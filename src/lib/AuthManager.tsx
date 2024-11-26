"use client";

import { useRouter } from "next/navigation";
import { useAuthContext } from "./AuthContext";

export function AuthManager(pathname: string) {
    const { user } = useAuthContext();
    const router = useRouter();

    if (!user) {
        router.replace("/login");
        return <div className="bg-cyan-200 h-screen w-screen"></div>;
    }
    
    if (pathname === "/login" && user) {
        router.replace("/create");
        return <div className="bg-cyan-200 h-screen w-screen"></div>;
    }

    return null;
}