const Board = require('../models/Board');
const Card = require('../models/Card');
const Invitation = require('../models/Invitation');
const Task = require('../models/Task');
const User = require('../models/User');
const { transporter } = require('./authControllers');

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

        const sample = ["Todo", "Doing", "Done"];

        for (const s of sample) {
            const newCard = await Card.create(s, "", newBoard.id);

            if (s === "Todo") {
                await Task.createWithInCard(newCard.id, newBoard.id, userId, "Welcome to Mini Trello", "");
                await Task.createWithInCard(newCard.id, newBoard.id, userId, "Drag this", "");
            } else if (s === "Done") {
                await Task.createWithInCard(newCard.id, newBoard.id, userId, "Challenge", "");
            }
        }

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

exports.getMembers = async (req, res) => {
    const boardId = req.params.id;
    const board = await Board.getById(boardId);

    const members = await User.getByIds(board.member_ids);

    res.status(200).json(members);
}

exports.addMemberToBoard = async (req, res) => {
    const boardId = req.params.id;
    const { memberId } = req.body;

    const board = await Board.addMemberId(boardId, memberId);

    res.status(201).json(board);
}

exports.updateBoard = async (req, res) => {
    const boardId = req.params.id;
    const { name, description, is_active } = req.body;

    const updatedBoard = {};

    if (typeof name === "string" && name.trim().length > 0) updatedBoard.name = name;
    if (typeof description === 'string') updatedBoard.description = description;
    if (typeof is_active === 'boolean') updatedBoard.is_active = is_active;

    console.log(updatedBoard);

    const board = await Board.update(boardId, updatedBoard);
    res.status(200).json(board);
}

exports.deleteBoard = async (req, res) => {
    const boardId = req.params.id;
    await Board.delete(boardId);
    res.status(204).json();
}

exports.sendInvite = async (req, res) => {
    try {
        const boardId = req.params.id;
        const { receiverId } = req.body;

        const board = await Board.getById(boardId);
        const sender = await User.getById(board.owner_id);

        const receiver = await User.getById(receiverId);

        if (!receiver) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        const invitation = await Invitation.create(boardId, board.owner_id, receiverId, receiver.email);

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: receiver.email,
            subject: "Board Invitation",
            text: `${sender.name} invite you to his/her board. Check it out!`
        })

        res.status(201).json(invitation);
    } catch (error) {
        console.error("Error sending invite", error);
        res.status(500).json({ error: "Error sending invite" });
    }
}

exports.responeInvite = async (req, res) => {
    try {
        const inviteId = req.params.inviteId;
        const { status } = req.body;

        if (status !== 'accepted' && status !== 'declined') {
            res.status(400).json({ error: "Invalid invitation status" });
            return;
        }

        const invitation = await Invitation.updateStatus(inviteId, status);

        if (invitation && invitation.status === 'accepted') {
            console.log(invitation);

            const board = await Board.getById(invitation.board_id);
            await Board.addMemberId(board.id, invitation.member_id);

            res.status(200).json({ message: "Invitation accepted" });
        } else {
            res.status(200).json({ message: "Invitation declined" });
        }
    } catch (error) {
        console.error("Error accepting invite", error);
        res.status(500).json({ error: "Error accepting invite" });
    }
}

exports.getInvitations = async (req, res) => {
    try {
        const userId = req.user.id;
        const invitations = await Invitation.getInvitationsByReceiverId(userId);

        const boardOwnerId = [
            ...new Set(invitations.map(invitation => invitation.board_owner_id))
        ]

        const boardOwner = await User.getByIds(boardOwnerId);

        const inviteWithSender = invitations.map(invitation => {
            const sender = boardOwner.find(owner => owner.id === invitation.board_owner_id);
            return { ...invitation, sender_name: sender.name };
        });

        res.status(200).json(inviteWithSender);
    } catch (error) {
        console.error("Error getting invitations", error);
        res.status(500).json({ error: "Error getting invitations" });
    }
}

exports.deleteInvitation = async (req, res) => {
    try {
        const inviteId = req.params.inviteId;

        const invitation = await Invitation.delete(inviteId);

        res.status(204).json();
    } catch (error) {
        console.error("Error deleting invitation", error);
        res.status(500).json({ error: "Error deleting invitation" });
    }
}   