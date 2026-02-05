const { db } = require("../config/db");

class Task {
    constructor(id, name, description, card_id, board_id, order_number, owner_id, member_ids, create_at) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.card_id = card_id;
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
            card_id: data.card_id,
            board_id: data.board_id,
            order_number: data.order_number,
            owner_id: data.owner_id,
            member_ids: data.member_ids,
            create_at: new Date().toISOString()
        }

        const task = await db.collection('tasks').add(dto);
        return new Task(task.id, dto.name, dto.description, dto.card_id, dto.board_id, dto.order_number, dto.owner_id, dto.member_ids, dto.create_at);
    }

    static async getById(id) {
        const doc = await db.collection('tasks').doc(id).get();

        if (!doc.exists) {
            throw new Error('Task not found');
        }

        const data = doc.data();

        return new Task(doc.id, data.name, data.description, data.card_id, data.board_id, data.order_number, data.owner_id, data.member_ids, data.create_at)
    }

    static async update(id, data) {
        await db.collection('tasks').doc(id).update(data);
        return { id, ...data };
    }

    static async delete(id) {
        await db.collection('tasks').doc(id).delete();
        return true;
    }

    static async getAllByCardId(cardId) {
        const tasks = await db.collection('tasks').where('card_id', '==', cardId).get();

        return tasks.docs.map(task => {
            const data = task.data();
            return new Task(task.id, data.name, data.description,
                data.card_id, data.board_id, data.order_number,
                data.owner_id, data.member_ids, data.create_at)
        });
    }

    static async createTaskWithInCard(data) {

    }
}

module.exports = Task;