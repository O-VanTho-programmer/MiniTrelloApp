const { db } = require("../config/db");

class GithubAttachment {
    constructor(id, taskId, title, type, url_attachment, create_at) {
        this.id = id;
        this.taskId = taskId;
        this.title = title;
        this.type = type;
        this.url_attachment = url_attachment;
        this.create_at = create_at;
    }

    static async create(taskId, title, type, url) {

        const dto = {
            taskId: taskId,
            title: title,
            type: type,
            url_attachment: url,
            create_at: new Date().toISOString()
        }

        const attachment = await db.collection('github_attachments').add(dto);

        return new GithubAttachment(attachment.id, dto.taskId, dto.title, dto.type, dto.url_attachment, dto.create_at);
    }

    static async getAllByTaskId(taskId) {
        const attachments = await db.collection('github_attachments').where('taskId', '==', taskId).get();

        return attachments.docs.map((att) => {
            const data = att.data();
            return new GithubAttachment(att.id, data.taskId, data.title, data.type, data.url_attachment, data.create_at);
        })
    }

    static async delete(id) {
        await db.collection('github_attachments').doc(id).delete();
        return true;
    }
}

module.exports = GithubAttachment;