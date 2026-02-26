const { db } = require("../config/db");
const { FieldValue } = require("firebase-admin/firestore");
const redisWriteBackService = require("../services/redisWriteBackService");
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
        const tasks = await db.collection('tasks').where('card_id', '==', cardId).orderBy('order_number', 'asc').get();

        return tasks.docs.map(task => {
            const data = task.data();
            return new Task(task.id, data.name, data.description,
                data.status, data.card_id, data.board_id, data.order_number,
                data.owner_id, data.member_ids, data.create_at)
        });
    }

    static async createWithInCard(cardId, boardId, ownerId, name, description) {
        const maxOrderNumberSnap = await db.collection('tasks').where('card_id', '==', cardId).orderBy('order_number', 'desc').limit(1).get();
        let maxOrderNumber = -1;

        if (!maxOrderNumberSnap.empty) {
            maxOrderNumber = maxOrderNumberSnap.docs[0].data().order_number;
        }

        const dto = {
            name: name,
            description: description || '',
            status: 'Pending',
            card_id: cardId,
            board_id: boardId,
            order_number: maxOrderNumber + 1,
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
        await redisWriteBackService.queueUpdate('tasks', taskId, data);
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

        let memberIds = task.data().member_ids;

        return memberIds;
    }

    static async unassignMember(taskId, memberId) {
        const task = await db.collection("tasks").doc(taskId).set({
            member_ids: FieldValue.arrayRemove(memberId)
        }, { merge: true });

        return true;
    }

    static async dragAndDropMove(taskId, sourceCard, desCard, newIndex) {
        if (sourceCard === desCard) {
            const tasksInCardSnap = await db.collection('tasks').where('card_id', '==', sourceCard).orderBy('order_number', 'asc').get();
            const tasksInCard = tasksInCardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const movedTask = tasksInCard.find(task => task.id === taskId);

            tasksInCard.splice(tasksInCard.indexOf(movedTask), 1);
            tasksInCard.splice(newIndex, 0, movedTask);

            for (let i = 0; i < tasksInCard.length; i++) {
                await redisWriteBackService.queueUpdate('tasks', tasksInCard[i].id, { order_number: i });
            }
        } else {

            const [tasksInSourceCardSnap, tasksInDesCardSnap] = await Promise.all([
                db.collection('tasks').where('card_id', '==', sourceCard).orderBy('order_number', 'asc').get(),
                db.collection('tasks').where('card_id', '==', desCard).orderBy('order_number', 'asc').get()
            ])

            const tasksInSourceCard = tasksInSourceCardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            const tasksInDesCard = tasksInDesCardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const movedTask = tasksInSourceCard.find(task => task.id === taskId);
            tasksInSourceCard.splice(tasksInSourceCard.indexOf(movedTask), 1);
            tasksInDesCard.splice(newIndex, 0, movedTask);

            for (let i = 0; i < tasksInSourceCard.length; i++) {
                await redisWriteBackService.queueUpdate('tasks', tasksInSourceCard[i].id, { order_number: i });
            }

            for (let i = 0; i < tasksInDesCard.length; i++) {
                const update = { order_number: i };
                if (tasksInDesCard[i].id === movedTask.id) {
                    update.card_id = desCard;
                }
                await redisWriteBackService.queueUpdate('tasks', tasksInDesCard[i].id, update);
            }
        }

        return true;
    }
}

module.exports = Task;