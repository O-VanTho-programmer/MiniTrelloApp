import { assignMemberToTask, createTaskWithInCard, deleteTask, dragAndDropMoveTask, getAssignedMemberFromTask, getTaskById, getTasksByCardId, unassignMemberFromTask, updateTask } from "@/services/task"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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
            }) => updateTask(id, name, description,status, card_id, board_id),
        onSuccess: (_, { card_id }) => queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] })
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
        onSuccess: (_, { card_id }) => queryClient.invalidateQueries({ queryKey: ["tasks_by_card_id", card_id] })
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
        mutationFn: ({ id, card_id, board_id, member_id }: { id: string, card_id: string, board_id: string, member_id: string }) => {
            return unassignMemberFromTask(id, card_id, board_id, member_id)
        }, onSuccess: (_, {id}) => queryClient.invalidateQueries({
            queryKey: ["assigned_member", id]
        })
    })
}

export const useDragAndDropMoveTask = () => {
    return useMutation({
        mutationFn: ({ id, sourceCardId, destinationCardId, newIndex }:
            {
                id: string, sourceCardId: string,
                destinationCardId: string, newIndex: number
            }) => dragAndDropMoveTask(id, sourceCardId, destinationCardId, newIndex),
    })
}