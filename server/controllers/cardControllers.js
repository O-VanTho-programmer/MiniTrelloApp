const Card = require("../models/Card");

exports.newCard = async (req, res) => {
    try {
        const { name, description } = req.body;
        const board_id  = req.params.boardId;
        const userId = req.user.id;

        const cardLength = (await Card.getByBoardId(board_id)).length;

        const newCard = await Card.create({
            name,
            description,
            board_id,
            owner_id: userId,
            order_number: cardLength + 1,
            member_ids: [userId]
        });

        res.status(201).json(newCard);
    } catch (error) {
        console.error("Error creating card", error);
        res.status(500).json({ error: "Error creating card" });
    }
}

exports.getAllCards = async (req, res) => {
    try {
        const { boardId } = req.params;
        const cards = await Card.getByBoardId(boardId);

        res.status(200).json(cards);
    } catch (error) {
        console.error("Error getting cards", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

exports.getCardById = async (req, res) => {
    const { card_id } = req.params.id;
    const card = await Card.getById(card_id);

    res.status(200).json(card);
}

exports.getCardsByUser = async (req, res) => {
    const userId = req.params.user_id;
    const cards = await Card.getByUserId(userId);

    res.status(200).json(cards);
}

exports.updateCard = async (req, res) => {

}

exports.deleteCard = async (req, res) => {
    const cardId = req.params.id;
    await Card.delete(cardId);
    res.status(204).json();
}
