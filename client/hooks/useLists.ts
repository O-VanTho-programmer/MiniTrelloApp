import { createList, deleteList, getListsByBoardId } from "@/services/list"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetListsByBoardId = (board_id: string) => {
    return useQuery({
        queryKey: ["lists_by_board_id", board_id],
        queryFn: () => getListsByBoardId(board_id),
        enabled: !!board_id
    })
}

export const useCreateList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ name, board_id }: { name: string, board_id: string }) => createList(name, board_id),
        onSuccess: (_, { board_id }) => queryClient.invalidateQueries({
            queryKey: ["lists_by_board_id", board_id]
        })
    })
}

export const useDeleteList = (board_id: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteList(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["lists_by_board_id", board_id] })
    })

}