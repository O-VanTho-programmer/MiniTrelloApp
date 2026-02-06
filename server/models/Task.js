const { db } = require("../config/db");
const { FieldValue } = require("firebase-admin/firestore");
class Task {
    constructor(id, name, description, status, card_id, board_id, order_number, owner_id, member_ids, create_at) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.status = status || 'Pending';
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

        return new Task(doc.id, data.name, data.description, data.status, data.card_id, data.board_id, data.order_number, data.owner_id, data.member_ids, data.create_at)
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
                data.status, data.card_id, data.board_id, data.order_number,
                data.owner_id, data.member_ids, data.create_at)
        });
    }

    static async createWithInCard(cardId, boardId, ownerId, name, description) {
        const curOrderNumber = (await db.collection('tasks').where('card_id', '==', cardId).count().get()).data().count;

        const dto = {
            name: name,
            description: description || '',
            status: 'Pending',
            card_id: cardId,
            board_id: boardId,
            order_number: curOrderNumber.count + 1,
            owner_id: ownerId,
            member_ids: [],
            create_at: new Date().toISOString()
        }

        const newTask = await db.collection('tasks').add(dto);
        return new Task(newTask.id, dto.name, dto.description, dto.card_id, dto.board_id, dto.order_number, dto.owner_id, dto.member_ids, dto.create_at);
    }

    static async getByIdWithInCard(taskId) {
        const task = await db.collection('tasks').doc(taskId).get();

        if (!task.exists) {
            throw new Error('Task not found');
        }

        const data = task.data();

        return new Task(task.id, data.name, data.description, data.status, data.card_id, data.board_id, data.order_number, data.owner_id, data.member_ids, data.create_at);
    }

    static async updateWithInCard(taskId, data) {
        await db.collection('tasks').doc(taskId).update(data);
        return { id: taskId, ...data };
    }

    static async deleteWithInCard(taskId) {
        await db.collection('tasks').doc(taskId).delete();
        return true;
    }

    static async assignMember(taskId, memberId) {
        const task = await db.collection("tasks").doc(taskId).set({
            member_ids: FieldValue.arrayUnion(memberId)
        }, {
            merge: true
        });

        return task;
    }

    static async getAssignedMembers(taskId) {
        const task = await db.collection("tasks").doc(taskId).get();

        if (!task.exists) {
            throw new Error('Task not found');
        }

        return {
            taskId: task.id,
            memberId: task.data().member_ids
        };
    }

    static async unassignMember(taskId, memberId) {
        const task = await db.collection("tasks").doc(taskId).set({
            member_ids: FieldValue.arrayRemove(memberId)
        }, {
            merge: true
        });

        return true;
    }
}

module.exports = Task;