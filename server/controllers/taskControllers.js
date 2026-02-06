const Task = require("../models/Task");

exports.getTasksByCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const tasks = await Task.getAllByCardId(cardId);
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error get tasks by card", error);
        res.status(500).json({ error: "Error get tasks by card" });
    }
}

exports.createTaskWithInCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const boardId = req.params.boardId;
        const { name, description } = req.body;
        const userId = req.user.id;

        const task = await Task.createWithInCard(cardId, boardId, name, description, userId);
        res.status(201).json(task);
    } catch (error) {
        console.error("Error create task with in card", error);
        res.status(500).json({ error: "Error create task with in card" });
    }
}

exports.getTaskByIdWithInCard = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.getByIdWithInCard(taskId);

        res.status(200).json(task);
    } catch (error) {
        console.error("Error get task by id with in card", error);
        res.status(500).json({ error: "Error get task by id with in card" });
    }
}

exports.updateTaskWithInCard = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const { name, description } = req.body;

        const task = await Task.updateWithInCard(taskId, { name, description });

        res.status(200).json(task);
    } catch (error) {
        console.error("Error update task with in card", error);
        res.status(500).json({ error: "Error update task with in card" });
    }
}

exports.deleteTaskWithInCard = async (req, res) => {
    try {
        const taskId = req.params.taskId;

        await Task.deleteWithInCard(taskId);

        res.status(204);
    } catch (error) {
        console.error("Error delete task with in card", error);
        res.status(500).json({ error: "Error delete task with in card" });
    }
}

exports.assignMemberToTaskWithInCard = async (req, res) => {
    try {
        const memberId = req.body;
        const taskId = req.params.taskId;

        const task = await Task.assignMember(taskId, memberId)

        res.status(201).json(task);
    } catch (error) {
        console.error("Error assign member to task", error);
        res.status(500).json({ error: "Error assign member to task" });
    }
}

exports.unassignMemberToTaskWithInCard = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const taskId = req.params.taskId;

        const task = await Task.unassignMember(taskId, memberId);

        res.status(204);
    } catch (error) {
        console.error("Error unassign member to task with in card", error);
        res.status(500).json({ error: "Error unassign member to task" });
    }
}


exports.getAssignedMembersOfTaskWithInCard = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const assignedMembers = await Task.getAssignedMembers(taskId);

        res.status(200).json(assignedMembers);
    } catch (error) {
        console.error("Error get assigned members", error);
        res.status(500).json({ error: "Error" });
    }
}