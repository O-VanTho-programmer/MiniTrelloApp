import instance from "@/lib/axios"
import { InvitationWithSenderName } from "@/types/Invitation";

export const getInvitations = async (): Promise<InvitationWithSenderName[]> => {
    const { data } = await instance.get("/boards/user/invites");
    return data;
}

export const acceptInvitation = async (inviteId: string) => {
    const { data } = await instance.post(`/boards/invite-respone/${inviteId}`, { status: "accepted" });
    return data;
}

export const declineInvitation = async (inviteId: string) => {
    const { data } = await instance.post(`/boards/invite-respone/${inviteId}`, { status: "declined" });
    return data;
}

export const sendInvitation = async (boardId: string, receiverId: string) => {
    const { data } = await instance.post(`/boards/${boardId}/invite`, { receiverId })
    return data;
}

export const deleteInvitation = async (inviteId: string) => {
    const { data } = await instance.delete(`/boards/invite/${inviteId}`)
    return data;
}