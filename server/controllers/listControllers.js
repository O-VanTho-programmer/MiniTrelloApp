const Card = require("../models/Card");
const List = require("../models/List")

exports.newList = async (req, res) => {
    try {
        const { board_id, name } = req.body;

        const listsLength = (await List.getByBoardId(board_id)).length;

        const newList = await List.create({
            board_id,
            name,
            order_number: listsLength + 1
        });

        res.status(201).json(newList);
    } catch (error) {
        console.error("Error creating list", error);
        res.status(500).json({ error: "Error creating list" });
    }
}

exports.getListByBoardId = async (req, res) => {
    const board_id = req.params.board_id;

    const [lists, cards] = await Promise.all([
        List.getByBoardId(board_id),
        Card.getByBoardId(board_id)
    ]);

    const listsWithCards = lists.map(list => {
        const cardsInList = cards.filter(card => card.list_id === list.id);
        return { ...list, cards: cardsInList };
    });

    res.status(200).json(listsWithCards);
}

exports.updateList = async (req, res) => { };

exports.deleteList = async (req, res) => {
    const listId = req.params.id;
    await List.delete(listId);
    res.status(204).json();
};