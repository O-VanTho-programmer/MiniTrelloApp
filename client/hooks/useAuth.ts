import { getUser, sendCode, signin, signup } from "@/services/auth"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useSendCode = () => {
    return useMutation({
        mutationFn: ({ email }: { email: string }) => sendCode(email),
    })
}


export const useSignUp = () => {
    return useMutation({
        mutationFn: ({ name, email, code }:
            {
                name: string, email: string,
                code: string
            }) => signup(name, email, code)
    })
}

export const useSignIn = () => {
    return useMutation({
        mutationFn: ({ email, code }: { email: string, code: string }) => signin(email, code)
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryFn: () => getUser(),
        queryKey: ['user'],
        retry: 0,
    })
}