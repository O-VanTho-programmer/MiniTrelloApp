import { acceptInvitation, declineInvitation, deleteInvitation, getInvitations, sendInvitation } from "@/services/invitation"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetInvitations = (userId: string) => {
    return useQuery({
        queryKey: ["invitations", userId],
        queryFn: getInvitations
    })
}

export const useAcceptInvitation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inviteId }: { inviteId: string }) => acceptInvitation(inviteId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invitations", userId] });
            queryClient.invalidateQueries({
                queryKey: ["boards", userId]
            })
        }
    })
}

export const useDeclineInvitation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inviteId }: { inviteId: string }) => declineInvitation(inviteId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invitations", userId] })
    })
}

export const useSendInvitation = () => {
    return useMutation({
        mutationFn: ({ boardId, receiveId }:
            { boardId: string, receiveId: string }
        ) => sendInvitation(boardId, receiveId)
    })
}

export const useDeleteInvitation = (userId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ inviteId }: { inviteId: string }) => deleteInvitation(inviteId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invitations", userId] })
    })
}