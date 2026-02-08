import instance from "@/lib/axios"
import { GithubRepo } from "@/types/GithubRepo";

export const getAllRepository = async (): Promise<GithubRepo[]> => {
    const { data } = await instance.get("/repositories/github-info");
    return data;
}

export const getRepositoryById = async (id: string) => {
    const { data } = await instance.get(`/repositories/${id}/github-info`);
    return data;
}