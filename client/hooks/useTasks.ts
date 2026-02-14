import { assignMemberToTask, attachFromGithub, createTaskWithInCard, deleteAttachment, deleteTask, dragAndDropMoveTask, getAssignedMemberFromTask, getAttachmentsByTaskId, getTaskById, getTasksByCardId, unassignMemberFromTask, updateTask } from "@/services/task"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useGetTasksByCardId = (card_id: string, board_id: string) => {
    return useQuery({
        queryKey: ["tasks_by_card_id", card_id],
        queryFn: () => getTasksByCardId(card_id, board_id)
    })
}

export const useCreateTaskWithInCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ name, description, card_id, board_id }:
            {
                name: string,
                description: string,
                card_id: string,
                board_id: string
            }) => createTaskWithInCard(name, description, card_id, board_id),
        onSuccess: (_, { card_id }) => queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] })
    })
}

export const useGetTaskById = (id: string, card_id: string, board_id: string) => {
    return useQuery({
        queryKey: ["task", id],
        queryFn: () => getTaskById(id, card_id, board_id),
        enabled: !!id
    })
}

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, name, description, status, card_id, board_id }:
            {
                id: string, name: string,
                description: string, status: string,
                card_id: string, board_id: string
            }) => updateTask(id, name, description, status, card_id, board_id),
        onSuccess: (_, { card_id }) => queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] }),
        onError: (_, { card_id }) => {
            toast.error("Something went wrong")
            queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] })
        }
    })
}

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, card_id, board_id }:
            {
                id: string, card_id: string,
                board_id: string
            }) => deleteTask(id, card_id, board_id),
        onSuccess: (_, { card_id }) => queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] }),
    })
}

export const useAssignMemberToTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, member_id, card_id, board_id }:
            {
                id: string, member_id: string,
                card_id: string, board_id: string
            }) => assignMemberToTask(id, member_id, card_id, board_id),
        onSuccess: (_, { id }) => queryClient.invalidateQueries({
            queryKey: ["assigned_member", id]
        })
    })
}

export const useGetAssignedMemberFromTask = (id: string, card_id: string, board_id: string) => {
    return useQuery({
        queryKey: ["assigned_member", id],
        queryFn: () => getAssignedMemberFromTask(id, card_id, board_id),
        enabled: !!id
    })
}

export const useUnassignMemberFromTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, card_id, board_id, member_id }:
            { id: string, card_id: string, board_id: string, member_id: string }) => unassignMemberFromTask(id, card_id, board_id, member_id),
        onSuccess: (_, { id }) => queryClient.invalidateQueries({
            queryKey: ["assigned_member", id]
        })
    })
}

export const useDragAndDropMoveTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, sourceCardId, destinationCardId, newIndex }:
            {
                id: string, sourceCardId: string,
                destinationCardId: string, newIndex: number
            }) => dragAndDropMoveTask(id, sourceCardId, destinationCardId, newIndex),

        onSuccess: () => {
            console.log('Task moved successfully');

        },
        onError: (error, { sourceCardId, destinationCardId }) => {
            console.error('Error moving task:', error);
            toast.error("Something went wrong");
            
            queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", sourceCardId] })
            if (sourceCardId !== destinationCardId) {
                queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", destinationCardId] })
            }
        }
    })
}

export const useGetAttachmentsByTaskId = (id: string, card_id: string, board_id: string) => {
    return useQuery({
        queryKey: ["attachments", id],
        queryFn: () => getAttachmentsByTaskId(id, card_id, board_id),
        enabled: !!id
    })
}

export const useDeleteAttachment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, card_id, board_id, attachment_id }
            : {
                id: string, card_id: string,
                board_id: string, attachment_id: string
            }) => deleteAttachment(id, card_id, board_id, attachment_id),
        onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ["attachments", id] })
    })
}

export const useAttachFromGithub = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ board_id, card_id, task_id, payload }:
            {
                board_id: string, card_id: string,
                task_id: string,
                payload: {
                    type: string,
                    url: string,
                    title: string
                }
            }) => attachFromGithub(board_id, card_id, task_id, payload.type, payload.url, payload.title),
        onSuccess: (_, { task_id }) => queryClient.invalidateQueries({ queryKey: ["attachments", task_id] })
    })
}