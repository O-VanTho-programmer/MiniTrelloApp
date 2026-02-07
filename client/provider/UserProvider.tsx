'use client';

import { useGetCurrentUser } from "@/hooks/useAuth";
import { User } from "@/types/User";
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<User | null>(null);

export const useUser = () => {
    return useContext(UserContext);
};


export function UserProvider({ children }: { children: React.ReactNode }) {
    const { data: user, isLoading } = useGetCurrentUser();

    if (isLoading) {
        return <div>Loading...</div>
    }

    return <UserContext.Provider value={user || null}>
        {children}
    </UserContext.Provider>
}