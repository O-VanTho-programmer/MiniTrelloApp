import { createCard, deleteCard, getCardsByBoardId, updateCard } from "@/services/card"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"

export const useGetCardsByBoardId = (board_id: string) => {
    return useQuery({
        queryKey: ["cards_by_board_id", board_id],
        queryFn: () => getCardsByBoardId(board_id),
        enabled: !!board_id
    })
}

export const useCreateCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ name, board_id }: { name: string, board_id: string }) => await createCard(name, board_id),
        onSuccess: async (_, { board_id }) => await queryClient.invalidateQueries({
            queryKey: ["cards_by_board_id", board_id]
        }),
        onError: () => toast.error("Something went wrong")
    })
}

export const useDeleteCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, board_id }: { id: string, board_id: string }) => await deleteCard(id, board_id),
        onSuccess: (_, { board_id }) => {
            queryClient.invalidateQueries({ queryKey: ["cards_by_board_id", board_id] })
        }
    })

}

export const useEditCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, board_id, name, description }: { id: string, board_id: string, name: string, description: string }) => {
            return await updateCard(id, board_id, name, description)
        },
        onError: (_, { board_id }) => {
            toast.error("Something went wrong")
            queryClient.invalidateQueries({ queryKey: ["cards_by_board_id", board_id] })
        },
    })
}