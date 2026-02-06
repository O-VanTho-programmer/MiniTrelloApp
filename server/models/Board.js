const { db } = require("../config/db");

class Board {
    constructor(id, name, description, owner_id, member_ids, create_at, is_active) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.owner_id = owner_id;
        this.member_ids = member_ids || [];
        this.create_at = create_at;
        this.is_active = is_active || true;
    }

    static async create(data) {
        const dto = {
            name: data.name,
            description: data.description || '',
            owner_id: data.owner_id,
            member_ids: data.member_ids || [data.owner_id],
            create_at: new Date(),
        }

        const doc = await db.collection('boards').add(dto);

        return new Board(doc.id, data.name, dto.name, dto.description, dto.owner_id, dto.member_ids, dto.create_at);
    }

    static async getById(id) {
        const doc = await db.collection('boards').doc(id).get();

        if (!doc.exists) {
            throw new Error('Board not found');
        }

        const data = doc.data();
        return new Board(doc.id, data.name, data.description, data.owner_id, data.member_ids, data.create_at);
    }

    static async getAll() {
        const boards = await db.collection('boards').where('is_active', '==', true).get();

        return boards.docs.map(board => {
            const data = board.data();
            return new Board(board.id, data.name, data.description, data.owner_id, data.member_ids, data.create_at);
        });
    }

    static async getByUser(userId) {
        const boards = await db.collection('boards').where('member_ids', 'array-contains', userId).where('is_active', '!=', false).get();
       
        return boards.docs.map(board => {
            const data = board.data();
           
            return new Board(board.id, data.name, data.description, data.owner_id, data.member_ids, data.create_at);
        });
    }

    static async getMembers(boardId) {
        const board = await db.collection('boards').doc(boardId).get();

        if (!board.exists) {
            throw new Error('Board not found');
        }

        return board.data().member_ids;
    }


    static async update(id, data) {
        await db.collection('boards').doc(id).update(data);

        return { id, ...data };
    }

    static async delete(id) {
        await db.collection('boards').doc(id).delete();
        return true;
    }
}

module.exports = Board;