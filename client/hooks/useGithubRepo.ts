import { getAllRepository, getRepositoryById } from "@/services/githubRepo"
import { useQuery } from "@tanstack/react-query"

export const useGetRepositoryById = (id: string) => {
    return useQuery({
        queryKey: ["repository", id],
        queryFn: () => getRepositoryById(id),
        enabled: !!id
    })
}

export const useGetRepositories = () => {
    return useQuery({
        queryKey: ["repositories"],
        queryFn: () => getAllRepository(),
    })
}

