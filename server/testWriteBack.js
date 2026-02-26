require('dotenv').config();
const { createClient } = require('redis');
const redisWriteBackService = require('./services/redisWriteBackService');
const { db } = require('./config/db');

async function runTest() {
    const redisClient = createClient({ url: 'redis://localhost:6379' });

    redisClient.on('error', (err) => {
        console.log('Redis Client Error', err);
        process.exit(1);
    });

    await redisClient.connect();
    await redisWriteBackService.init(redisClient);

    // Start processor
    redisWriteBackService.startBatchProcessor(2000);

    console.log("Queueing 5 rapid updates for exactly the same document...");
    const testDocId = "test_doc_123";

    await redisWriteBackService.queueUpdate('tasks', testDocId, { status: "In Progress", order_number: 1 });
    await redisWriteBackService.queueUpdate('tasks', testDocId, { name: "Test Task" });
    await redisWriteBackService.queueUpdate('tasks', testDocId, { order_number: 2 });
    await redisWriteBackService.queueUpdate('tasks', testDocId, { description: "Updated description" });
    await redisWriteBackService.queueUpdate('tasks', testDocId, { order_number: 3, status: "Done" });

    // Let's do another doc just to verify it coalesces properly by doc id
    const testDocId2 = "test_doc_456";
    await redisWriteBackService.queueUpdate('tasks', testDocId2, { status: "Pending" });
    await redisWriteBackService.queueUpdate('tasks', testDocId2, { name: "Second Task" });

    console.log("Updates queued in AOF. Waiting for batch processor...");

    setTimeout(async () => {
        console.log("Let's fetch the docs to verify...");
        const doc1 = await db.collection('tasks').doc(testDocId).get();
        const doc2 = await db.collection('tasks').doc(testDocId2).get();

        console.log("Doc 1:", doc1.data());
        console.log("Doc 2:", doc2.data());

        // Cleanup
        await db.collection('tasks').doc(testDocId).delete();
        await db.collection('tasks').doc(testDocId2).delete();

        console.log("Test finished! Exiting.");
        process.exit(0);
    }, 4000);
}

runTest().catch(console.error);
