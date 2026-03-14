import { getLogsByBoardId } from "@/services/activityLog"
import { useQuery } from "@tanstack/react-query"

export const useGetLogsByBoardId = (boardId: string) => {
    return useQuery({
        queryKey: ["activity_logs", boardId],
        queryFn: () => getLogsByBoardId(boardId),
        enabled: !!boardId
    })
}
