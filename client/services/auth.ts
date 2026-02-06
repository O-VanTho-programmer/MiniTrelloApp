import instance from "@/lib/axios"

export const sendCode = async (email: string) => {
    const data = await instance.post("/auth/send-code", { email });
    return data;
}

export const signup = async (name: string, email: string, code: string) => {
    const data = await instance.post("/auth/signup", { name, email, code });
    return data;
}

export const signin = async (email: string, code: string) => {
    const data = await instance.post("/auth/signin", { email, code });
    return data;
}