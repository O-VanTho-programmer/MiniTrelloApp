const Board = require('../models/Board');

exports.newBoard = async (req, res) => {
    try {
        const { name, description } = req.body;
        const userId = req.user.id;

        const newBoard = await Board.create({
            name,
            description,
            owner_id: userId,
            member_ids: [userId]
        });

        res.status(201).json(newBoard);

    } catch (error) {
        console.error("Error creating board", error);
        res.status(500).json({ error: "Error creating board" });
    }
}

exports.getBoard = async (req, res) => {
    const boardId = req.params.id;
    const board = await Board.getById(boardId);
    res.status(200).json(board);
}

exports.getAllBoard = async (req, res) => {
    const boards = await Board.getAll();
    res.status(200).json(boards);
}

exports.getBoardsByUser = async (req, res) => {
    const userId = req.user.id;
    const boards = await Board.getByUser(userId);
    res.status(200).json(boards);
}

exports.updateBoard = async (req, res) => {
    const boardId = req.params.id;
    const { name, description } = req.body;
    const board = await Board.update(boardId, { name, description });
    res.status(200).json(board);
}

exports.deleteBoard = async (req, res) => {
    const boardId = req.params.id;
    await Board.delete(boardId);
    res.status(204).json();
}