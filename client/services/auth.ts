import instance from "@/lib/axios"
import { User } from "@/types/User";

export const sendCodeSignup = async (email: string) => {
    const { data } = await instance.post("/auth/send-code-signup", { email });
    return data;
}

export const sendCodeLogin = async (email: string) => {
    const { data } = await instance.post("/auth/send-code-login", { email });
    return data;
}

export const signup = async (name: string, email: string, code: string) => {
    const { data } = await instance.post("/auth/signup", { name, email, code });
    return data;
}

export const signin = async (email: string, code: string) => {
    const { data } = await instance.post("/auth/signin", { email, code });
    return data;
}

export const getUser = async (): Promise<User> => {
    const { data } = await instance.get("/users/current-user");
    return data;
}

export const getUserByEmailSearch = async (email: string): Promise<User[]> => {
    const { data } = await instance.get(`/users/search?email=${email}`);
    return data;
}