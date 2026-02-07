import { acceptInvitation, declineInvitation, getInvitations } from "@/services/invitation"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetInvitations = (userId: string) => {
    return useQuery({
        queryKey: ["invitations", userId],
        queryFn: getInvitations
    })
}

export const useAcceptInvitation = () => {
    return useMutation({
        mutationFn: ({ inviteId }: { inviteId: string }) => acceptInvitation(inviteId)
    })
}

export const useDeclineInvitation = () => {
    return useMutation({
        mutationFn: ({ inviteId }: { inviteId: string }) => declineInvitation(inviteId)
    })
}