"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "./firebase";
import { usePathname, useRouter } from "next/navigation";

type AuthProviderProps = {
    children: React.ReactNode;
};

type AuthContextType = {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    userId: string | null;
    displayName: string | null;
}

const defaultContextData = {
    user: null,
    setUser: () => { },
    userId: null,
    displayName: null,
};

const AuthContext = React.createContext<AuthContextType>(defaultContextData);

export function AuthProvider({ children }: AuthProviderProps){
    const [user, setUser] = useState<any | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [displayName, setDisplayName] = useState<string | null>(null);
    // const loading = true;

    /* const router = useRouter();
    const pathname = usePathname(); */

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (newUser) => {
            console.log(newUser);
            setUser(newUser);
            setUserId(newUser ? newUser.uid : null);
            setDisplayName(newUser ? newUser.displayName : null);
        });
        console.log(user);


       /*  if (!user) {
            router.replace("/login");
            return () => { { <div className="bg-cyan-200 h-screen w-screen z-50"></div> } };
        }
        
        if (pathname === "/login" && user) {
            router.replace("/create");
            return () => { <div className="bg-cyan-200 h-screen w-screen z-50"></div> };
        }

        if (loading) {
            return () => { <div className="bg-cyan-200 h-screen w-screen z-50"></div> }
    } */

        return () => {
            unsubscribe();
        }

    }, [user, /*pathname, router, loading */])

    


    return (
        <AuthContext.Provider value={{ user, userId, displayName, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthContext() {
    return React.useContext(AuthContext);
}