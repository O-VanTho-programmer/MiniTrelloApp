const { db } = require("../config/db");

class Invitation {
    constructor(id, board_id, board_owner_id, member_id, email_member, status) {
        this.id = id;
        this.board_id = board_id;
        this.board_owner_id = board_owner_id;
        this.member_id = member_id;
        this.email_member = email_member;
        this.status = status;
    }

    static async create(board_id, board_owner_id, member_id, email_member) {
        const dto = {
            board_id: board_id,
            board_owner_id: board_owner_id,
            member_id: member_id,
            email_member: email_member,
            status: 'pending'
        }

        const newInvitation = await db.collection('invitations').add(dto);
        return new Invitation(newInvitation.id, board_id, board_owner_id, member_id, email_member, 'pending');
    }

    static async updateStatus(id, status) {
        const invitation = db.collection('invitations').doc(id);
        await invitation.update({ status: status });

        const data = (await invitation.get()).data();

        return new Invitation(id, data.board_id, data.board_owner_id, data.member_id, data.email_member, status);
    }

    static async getInvitationsByReceiverId(receiver_id) {
        const invitations = await db.collection('invitations').where('member_id', '==', receiver_id).get();

        return invitations.docs.map(doc => {
            const data = doc.data();
            return new Invitation(doc.id, data.board_id, data.board_owner_id, data.member_id, data.email_member, data.status);
        });
    }
        
}

module.exports = Invitation;