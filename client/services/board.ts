import instance from "@/lib/axios"
import { Board, BoardCreateDTO } from "@/types/Board"

export const getBoards = async (): Promise<Board[]> => {
    const {data} = await instance.get("/boards")
    return data;
}

export const getBoardById = async (id: string): Promise<Board> => {
    const {data} = await instance.get(`/boards/${id}`)
    return data
}

export const createBoard = async ({name, description} : BoardCreateDTO): Promise<Board> => {
    const {data} = await instance.post("/boards", {name, description})
    return data;
}

export const updateBoard = async (id: string, name: string, description?: string): Promise<Board> => {
    const {data} = await instance.put(`/boards/${id}`, {name, description})
    return data;
}

export const deleteBoard = async (id: string): Promise<Board> => {
    const {data} = await instance.delete(`/boards/${id}`)
    return data;
}