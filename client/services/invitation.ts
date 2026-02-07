import instance from "@/lib/axios"
import { InvitationWithSenderName } from "@/types/Invitation";

export const getInvitations = async (): Promise<InvitationWithSenderName[]> => {
    const { data } = await instance.get("/boards/user/invites");
    return data;
}