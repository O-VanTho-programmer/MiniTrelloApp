import { getInvitations } from "@/services/invitation"
import { useQuery } from "@tanstack/react-query"

export const useGetInvitations = (userId: string) => {
    return useQuery({
        queryKey: ["invitations", userId],
        queryFn: getInvitations
    })
}