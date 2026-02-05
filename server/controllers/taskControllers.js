const Task = require("../models/Task");

exports.getTasksByCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const tasks = await Task.getByCardId(cardId);
        res.status(200).json(tasks);
    } catch (error) {
        
    }
}

exports.createTaskWithInCard = async (req, res) => {
    try {
        const cardId = req.params.id;
        const boardId = req.params.boardId;
        const { name, description } = req.body;
        const userId = req.user.id;

       
    } catch (error) {
        
    }
}

exports.getTaskByIdWithInCard = async (req, res) => {

}

exports.updateTaskWithInCard = async (req, res) => {

}

exports.deleteTaskWithInCard = async (req, res) => {

}

exports.assignMemberToTaskWithInCard = async (req, res) => {

}

exports.unassignMemberToTaskWithInCard = async (req, res) => {

}


exports.getAssignedMembersOfTaskWithInCard = async (req, res) => {

}