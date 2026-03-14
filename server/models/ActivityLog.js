const { db } = require("../config/db");
const { v4: uuidv4 } = require('uuid');
const redisWriteBackService = require("../services/redisWriteBackService");

class ActivityLog {
    constructor(id, board_id, user_id, action, entity_type, entity_id, details, created_at) {
        this.id = id;
        this.board_id = board_id;
        this.user_id = user_id;
        this.action = action;
        this.entity_type = entity_type;
        this.entity_id = entity_id;
        this.details = details || '';
        this.created_at = created_at;
    }

    static async create({ boardId, userId, action, entityType, entityId, details = '' }) {
        const id = uuidv4();
        const dto = {
            board_id: boardId,
            user_id: userId,
            action: action,
            entity_type: entityType,
            entity_id: entityId,
            details: details,
            created_at: new Date().toISOString()
        };

        await redisWriteBackService.queueUpdate('activity_logs', id, dto);
        return new ActivityLog(id, dto.board_id, dto.user_id, dto.action, dto.entity_type, dto.entity_id, dto.details, dto.created_at);
    }

    static async getByBoardId(boardId) {
        const logsSnap = await db.collection('activity_logs')
            .where('board_id', '==', boardId)
            .orderBy('created_at', 'desc')
            .get();

        return logsSnap.docs.map(doc => {
            const data = doc.data();
            return new ActivityLog(
                doc.id, data.board_id, data.user_id, data.action,
                data.entity_type, data.entity_id, data.details, data.created_at
            );
        });
    }

    static async getById(id) {
        const doc = await db.collection('activity_logs').doc(id).get();
        if (!doc.exists) {
            throw new Error('ActivityLog not found');
        }
        const data = doc.data();
        return new ActivityLog(
            doc.id, data.board_id, data.user_id, data.action,
            data.entity_type, data.entity_id, data.details, data.created_at
        );
    }

    static async update(id, data) {
        await redisWriteBackService.queueUpdate('activity_logs', id, data);
        return { id, ...data };
    }

    static async delete(id) {
        await db.collection('activity_logs').doc(id).delete();
        return true;
    }
}

module.exports = ActivityLog;
