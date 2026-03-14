const { db } = require("../config/db");
const { FieldValue } = require("firebase-admin/firestore");
const redisWriteBackService = require("../services/redisWriteBackService");
const ActivityLog = require("./ActivityLog");
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

        await ActivityLog.create({
            boardId: boardId,
            userId: ownerId,
            action: 'CREATE',
            entityType: 'TASK',
            entityId: newTask.id,
            details: `Created task: ${name}`
        });

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

    static async updateWithInCard(taskId, data, userId) {
        const task = await db.collection('tasks').doc(taskId).get();
        if (!task.exists) return null;

        // Status changes need immediate persistence for instant checkbox feedback
        const immediate = data.hasOwnProperty('status');
        await redisWriteBackService.queueUpdate('tasks', taskId, data, immediate);

        if (userId) {
            await ActivityLog.create({
                boardId: task.data().board_id,
                userId: userId,
                action: 'UPDATE',
                entityType: 'TASK',
                entityId: taskId,
                details: `Updated task: ${data.name || 'details'}`
            });
        }

        return { id: taskId, ...data };
    }

    static async deleteWithInCard(taskId, userId) {
        const task = await db.collection('tasks').doc(taskId).get();
        if(!task.exists) return false;

        const boardId = task.data().board_id;
        const taskName = task.data().name;

        await db.collection('tasks').doc(taskId).delete();

        if (userId) {
            await ActivityLog.create({
                boardId: boardId,
                userId: userId,
                action: 'DELETE',
                entityType: 'TASK',
                entityId: taskId,
                details: `Deleted task: ${taskName}`
            });
        }

        return true;
    }

    static async assignMember(taskId, memberId, userId) {
        const taskSnap = await db.collection("tasks").doc(taskId).get();
        if (!taskSnap.exists) return null;

        const task = await db.collection("tasks").doc(taskId).set({
            member_ids: FieldValue.arrayUnion(memberId)
        }, {
            merge: true
        });

        if (userId) {
            await ActivityLog.create({
                boardId: taskSnap.data().board_id,
                userId: userId,
                action: 'ASSIGN',
                entityType: 'TASK',
                entityId: taskId,
                details: `Assigned member to task`
            });
        }

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

    static async unassignMember(taskId, memberId, userId) {
        const taskSnap = await db.collection("tasks").doc(taskId).get();
        if (!taskSnap.exists) return false;

        const task = await db.collection("tasks").doc(taskId).set({
            member_ids: FieldValue.arrayRemove(memberId)
        }, { merge: true });

        if (userId) {
            await ActivityLog.create({
                boardId: taskSnap.data().board_id,
                userId: userId,
                action: 'UNASSIGN',
                entityType: 'TASK',
                entityId: taskId,
                details: `Unassigned member from task`
            });
        }

        return true;
    }

    static async dragAndDropMove(taskId, sourceCard, desCard, newIndex, userId) {
        let boardId = null;

        if (sourceCard === desCard) {
            const tasksInCardSnap = await db.collection('tasks').where('card_id', '==', sourceCard).orderBy('order_number', 'asc').get();
            const tasksInCard = tasksInCardSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const movedTask = tasksInCard.find(task => task.id === taskId);
            if(movedTask) boardId = movedTask.board_id;

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
            if(movedTask) boardId = movedTask.board_id;

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

        if (userId && boardId) {
            await ActivityLog.create({
                boardId: boardId,
                userId: userId,
                action: 'MOVE',
                entityType: 'TASK',
                entityId: taskId,
                details: `Moved task`
            });
        }

        return true;
    }
}

module.exports = Task;