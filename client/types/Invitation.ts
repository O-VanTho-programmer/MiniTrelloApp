export interface Invitation {
    id: string,
    board_id: string,
    board_owner_id: string,
    member_id: string,
    email_member: string,
    status: string,
}

export interface InvitationWithSenderName extends Invitation {
    sender_name: string
}