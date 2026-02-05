import instance from "@/lib/axios"
import { List, ListWithCards } from "@/types/List";

export const getListsByBoardId = async (board_id: string): Promise<ListWithCards[]> => {
    const { data } = await instance.get(`/lists/board/${board_id}`)
    return data;
}

export const createList = async (name: string, board_id: string): Promise<List> => {
    const { data } = await instance.post("/lists", { board_id, name })
    return data;
}

export const deleteList = async (id: string) => {
    const { data } = await instance.delete(`/lists/${id}`)
    return data;
}