const { db } = require("../config/db");

class Invitation {
    constructor(id, board_id, board_owner_id, member_id, email_member, status, create_at) {
        this.id = id;
        this.board_id = board_id;
        this.board_owner_id = board_owner_id;
        this.member_id = member_id;
        this.email_member = email_member;
        this.status = status;
        this.create_at = create_at;
    }

    static async create(board_id, board_owner_id, member_id, email_member) {
        const dto = {
            board_id: board_id,
            board_owner_id: board_owner_id,
            member_id: member_id,
            email_member: email_member,
            status: 'pending',
            create_at: new Date().toISOString()
        }

        const existInvitation = await db.collection('invitations').where('member_id', '==', member_id).where('board_id', '==', board_id).where('board_owner_id', '==', board_owner_id).get();

        if (existInvitation) {
            const updateInvitation = await db.collection('invitations').doc(existInvitation.docs[0].id).update(dto);
            return new Invitation(existInvitation.docs[0].id, board_id, board_owner_id, member_id, email_member, 'pending', dto.create_at);
        } else {
            const newInvitation = await db.collection('invitations').add(dto);
            return new Invitation(newInvitation.id, board_id, board_owner_id, member_id, email_member, 'pending', dto.create_at);

        }
    }

    static async updateStatus(id, status) {
        const invitation = db.collection('invitations').doc(id);
        await invitation.update({ status: status });

        const data = (await invitation.get()).data();

        return new Invitation(id, data.board_id, data.board_owner_id, data.member_id, data.email_member, status, data.create_at);
    }

    static async getInvitationsByReceiverId(receiver_id) {
        const invitations = await db.collection('invitations').where('member_id', '==', receiver_id).orderBy('create_at', 'desc').get();

        return invitations.docs.map(doc => {
            const data = doc.data();
            return new Invitation(doc.id, data.board_id, data.board_owner_id, data.member_id, data.email_member, data.status, data.create_at);
        });
    }

}

module.exports = Invitation;