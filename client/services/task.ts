import instance from "@/lib/axios"
import { Task, TaskWithAssignedMember } from "@/types/Task";

export const getTasksByCardId = async (card_id: string, board_id: string): Promise<Task[]> => {
    const { data } = await instance.get(`/boards/${board_id}/cards/${card_id}/tasks`)
    return data;
}

export const createTaskWithInCard = async (name: string, description: string, card_id: string, board_id: string) => {
    const { data } = await instance.post(`/boards/${board_id}/cards/${card_id}/tasks`, { name, description })
    return data;
}

export const getTaskById = async (id: string, card_id: string, board_id: string): Promise<Task> => {
    const { data } = await instance.get(`/boards/${board_id}/cards/${card_id}/tasks/${id}`);

    return data;
}

export const updateTask = async (id: string, name: string, description: string, card_id: string, board_id: string) => {
    const { data } = await instance.put(`/boards/${board_id}/cards/${card_id}/tasks/${id}`, { name, description });

    return data;
}

export const deleteTask = async (id: string, card_id: string, board_id: string) => {
    const { data } = await instance.delete(`/boards/${board_id}/cards/${card_id}/tasks/${id}`);

    return data;
}

export const assignMemberToTask = async (id: string, member_id: string, card_id: string, board_id: string) => {
    const { data } = await instance.post(`/boards/${board_id}/cards/${card_id}/tasks/${id}/assign`, { member_id });

    return data;
}

export const getAssignedMemberFromTask = async (id: string, card_id: string, board_id: string): Promise<TaskWithAssignedMember> => {
    const { data } = await instance.get(`/boards/${board_id}/cards/${card_id}/tasks/${id}/assign`);

    return data;
}

export const unassignMemberFromTask = async (id: string, card_id: string, board_id: string, member_id: string) => {
    const { data } = await instance.delete(`/boards/${board_id}/cards/${card_id}/tasks/${id}/assign/${member_id}`);

    return data;
}