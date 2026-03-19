const ActivityLog = require("../models/ActivityLog");

exports.createLog = async (req, res) => {
    try {
        const { boardId, action, entityType, entityId, details } = req.body;
        const userId = req.user.id;

        const log = await ActivityLog.create({ boardId, userId, action, entityType, entityId, details });

        const socketId = req.headers['x-socket-id'];
        const io = req.app.get('io');

        if (io && boardId) {
            if (socketId) {
                io.to(boardId).except(socketId).emit("create_log", log);
            } else {
                io.to(boardId).emit("create_log", log);
            }
        }

        res.status(201).json(log);
    } catch (error) {
        console.error("Error creating activity log", error);
        res.status(500).json({ error: "Error creating activity log" });
    }
}

exports.getLogsByBoard = async (req, res) => {
    try {
        const boardId = req.params.boardId;
        const logs = await ActivityLog.getByBoardId(boardId);
        res.status(200).json(logs);
    } catch (error) {
        console.error("Error getting activity logs by board", error);
        res.status(500).json({ error: "Error getting activity logs by board" });
    }
}

exports.getLogById = async (req, res) => {
    try {
        const logId = req.params.id;
        const log = await ActivityLog.getById(logId);
        res.status(200).json(log);
    } catch (error) {
        console.error("Error getting activity log by id", error);
        res.status(500).json({ error: "Error getting activity log by id" });
    }
}

exports.updateLog = async (req, res) => {
    try {
        const logId = req.params.id;
        const data = req.body;
        const updatedLog = await ActivityLog.update(logId, data);
        res.status(200).json(updatedLog);
    } catch (error) {
        console.error("Error updating activity log", error);
        res.status(500).json({ error: "Error updating activity log" });
    }
}

exports.deleteLog = async (req, res) => {
    try {
        const logId = req.params.id;
        await ActivityLog.delete(logId);
        res.status(204).json();
    } catch (error) {
        console.error("Error deleting activity log", error);
        res.status(500).json({ error: "Error deleting activity log" });
    }
}
