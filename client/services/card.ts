import instance from "@/lib/axios"
import { Card, CardWithTask } from "@/types/Card";

export const getCardsByBoardId = async (board_id: string): Promise<CardWithTask[]> => {
    const { data } = await instance.get(`/boards/${board_id}/cards`)
    return data;
}

export const createCard = async (name: string, board_id: string): Promise<Card> => {
    const { data } = await instance.post(`/boards/${board_id}/cards`, { board_id, name })
    return data;
}

export const getCardById = async (id: string, board_id: string): Promise<CardWithTask> => {
    const { data } = await instance.get(`/boards/${board_id}/cards/${id}`)
    return data;
}

export const deleteCard = async (id: string, board_id: string) => {
    const { data } = await instance.delete(`/boards/${board_id}/cards/${id}`)
    return data;
}

export const updateCard = async (id: string, board_id: string, name: string, description: string) => {
    const { data } = await instance.put(`/boards/${board_id}/cards/${id}`, { name, description })
    return data;
}