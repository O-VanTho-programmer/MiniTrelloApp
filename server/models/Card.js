const { db } = require("../config/db");

class Card {
    constructor(id, name, description, list_id, board_id, order_number, owner_id, member_ids, create_at) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.list_id = list_id;
        this.board_id = board_id;
        this.order_number = order_number;
        this.owner_id = owner_id;
        this.member_ids = member_ids || [];
        this.create_at = create_at;
    }

    static async create(data) {
        const dto = {
            name: data.name,
            description: data.description || '',
            list_id: data.list_id,
            board_id: data.board_id,
            order_number: data.order_number,
            owner_id: data.owner_id,
            member_ids: data.member_ids || [owner_id],
            create_at: new Date().toISOString()
        }

        const card = await db.collection('cards').add(dto);
        return new Card(card.id, dto.name, dto.description, dto.list_id, dto.board_id, dto.order_number, dto.owner_id, dto.member_ids, dto.create_at);
    }

    static async getById(id) {
        const doc = await db.collection('cards').doc(id).get();

        if (!doc.exists) {
            throw new Error('Card not found');
        }

        const data = doc.data();

        return new Card(doc.id, data.name, data.description, data.list_id, data.board_id, data.order_number, data.owner_id, data.member_ids, data.create_at)
    }

    static async getAll() {
        const cards = await db.collection('cards').get();

        return cards.docs.map(card => {
            const data = card.data();
            return new Card(card.id, data.name, data.description, data.list_id, data.board_id, data.order_number, data.owner_id, data.member_ids, data.create_at);
        });
    }

    static async getByUserId(userId) {
        const cards = await db.collection('cards').where('member_ids', 'array-contains', userId).get();

        const res = await Promise.all(cards.docs.map(async card => {
            const data = card.data();
            const countTask = await this.getCountTask(card.id);
            return {
                id: card.id,
                name: data.name,
                description: data.description,
                list_id: data.list_id,
                board_id: data.board_id,
                order_number: data.order_number,
                owner_id: data.owner_id,
                member_ids: data.member_ids,
                create_at: data.create_at,
                countTask: countTask
            }
        }));

        return res;
    }

    static async update(id, data) {
        await db.collection('cards').doc(id).update(data);
        return {id, ...data};
    }

    static async delete(id) {
        await db.collection('cards').doc(id).delete();
        return true;
    }

    static async getCountTask(cardId){
        const tasks = await db.collection('tasks').where('card_id', '==', cardId).get();
        return tasks.size;
    }
}

module.exports = Card;