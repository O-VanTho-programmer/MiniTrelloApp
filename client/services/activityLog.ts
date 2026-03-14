import instance from "@/lib/axios"
import { ActivityLog } from "@/types/ActivityLog"

export const getLogsByBoardId = async (boardId: string): Promise<ActivityLog[]> => {
    const { data } = await instance.get(`/activity-logs/board/${boardId}`)
    return data;
}
