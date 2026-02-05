import { createBoard, getBoardById, getBoards, updateBoard } from "@/services/board"
import { BoardCreateDTO } from "@/types/Board";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useCreateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ name, description }: BoardCreateDTO) => createBoard({ name, description }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["boards"] })
    })
}

export const useGetAllBoards = () => {
    return useQuery({
        queryKey: ["boards"],
        queryFn: getBoards,
    })
}

export const useGetBoardById = (id: string) => {
    return useQuery({
        queryKey: ["board", id],
        queryFn: () => getBoardById(id),
        enabled: !!id
    })
}

export const useUpdateBoard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, name, description }: { id: string, name: string, description: string }) => updateBoard(id, name, description),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["boards"] })
            queryClient.invalidateQueries({ queryKey: ["board", id] })
        }
    })
}