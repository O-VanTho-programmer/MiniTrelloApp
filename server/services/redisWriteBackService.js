const { db } = require('../config/db');

class RedisWriteBackService {
    constructor() {
        this.redisClient = null;
        this.streamName = 'write_aof';
        this.groupName = 'write_workers';
        this.consumerName = `consumer_${Date.now()}`;
        this.isProcessing = false;
    }

    async init(redisClient) {
        this.redisClient = redisClient;
        try {
            await this.redisClient.xGroupCreate(this.streamName, this.groupName, '0', {
                MKSTREAM: true
            });
            console.log('Created consumer group for write_aof');
        } catch (error) {
            if (!error.message.includes('BUSYGROUP')) {
                console.error('Error creating consumer group:', error);
            }
        }
    }

    async queueUpdate(collectionName, documentId, data) {
        if (!this.redisClient) {
            console.warn('Redis client not initialized for Write Back. Writing directly to DB.');
            await db.collection(collectionName).doc(documentId).update(data);
            return;
        }

        const payload = JSON.stringify(data);
        await this.redisClient.xAdd(this.streamName, '*', {
            collection: collectionName,
            docId: documentId,
            data: payload
        });
    }

    startBatchProcessor(intervalMs = 5000) {
        setInterval(async () => {
            if (this.isProcessing || !this.redisClient) return;
            this.isProcessing = true;

            try {
                const response = await this.redisClient.xReadGroup(
                    this.groupName,
                    this.consumerName,
                    [
                        {
                            key: this.streamName,
                            id: '>'
                        }
                    ],
                    {
                        COUNT: 500, // Process up to 500 operations per batch
                        BLOCK: 100 // Block for 100ms
                    }
                );

                if (response && response.length > 0) {
                    const messages = response[0].messages;
                    if (messages.length > 0) {
                        await this.processBatch(messages);
                    }
                }
            } catch (error) {
                console.error('Error in write back batch processor:', error);
            } finally {
                this.isProcessing = false;
            }
        }, intervalMs);
    }

    async processBatch(messages) {
        const coalescedUpdates = new Map();
        const messageIds = [];

        // Write Coalescing
        for (const message of messages) {
            messageIds.push(message.id);
            const { collection, docId, data } = message.message;

            try {
                const parsedData = JSON.parse(data);
                const key = `${collection}::${docId}`;

                if (coalescedUpdates.has(key)) {
                    // Merge fields for the same document
                    coalescedUpdates.set(key, { ...coalescedUpdates.get(key), ...parsedData });
                } else {
                    coalescedUpdates.set(key, parsedData);
                }
            } catch (err) {
                console.error('Failed to parse AOF message data:', data);
            }
        }

        if (coalescedUpdates.size === 0) return;

        console.log(`[Write-Back] Read ${messages.length} operations. Coalesced to ${coalescedUpdates.size} DB updates.`);

        // BatchUpdate to Firestore
        const batch = db.batch();
        for (const [key, data] of coalescedUpdates.entries()) {
            const [collection, docId] = key.split('::');
            const docRef = db.collection(collection).doc(docId);
            batch.set(docRef, data, { merge: true });
        }

        try {
            await batch.commit();
            console.log(`[Write-Back] Successfully committed batch to Firestore.`);
            await this.redisClient.xAck(this.streamName, this.groupName, messageIds);
        } catch (error) {
            console.error('[Write-Back] Error committing Firestore batch:', error);
        }
    }
}

module.exports = new RedisWriteBackService();
