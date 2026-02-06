import instance from "@/lib/axios"
import { Board, BoardCreateDTO } from "@/types/Board"
import { User } from "@/types/User";

export const getBoards = async (): Promise<Board[]> => {
    const { data } = await instance.get("/boards")
    return data;
}

export const getBoardById = async (id: string): Promise<Board> => {
    const { data } = await instance.get(`/boards/${id}`)
    return data
}

export const getMembers = async (id: string): Promise<User[]> => {
    const { data } = await instance.get(`/boards/${id}/members`);
    return data;
}

export const getBoardsByUser = async (): Promise<Board[]> => {
    const { data } = await instance.get("/boards/user")
    return data;
}

export const createBoard = async ({ name, description }: BoardCreateDTO): Promise<Board> => {
    const { data } = await instance.post("/boards", { name, description })
    return data;
}

export const updateBoard = async (id: string, name: string, description?: string, is_active?: boolean): Promise<Board> => {
    const { data } = await instance.put(`/boards/${id}`, { name, description, is_active })
    return data;
}

export const deleteBoard = async (id: string) => {
    const { data } = await instance.delete(`/boards/${id}`)
    return data;
}