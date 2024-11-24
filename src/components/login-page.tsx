'use client'

import { useState, useEffect, useReducer } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "@/lib/firebase";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";

// Login with Google Oauth imports
import { listenAuthState, login, logout } from "../lib/auth";
import authReducer from "@/lib/authReducer";
import AuthContext from "@/lib/AuthContext";

export default function LoginPage() {
    const [state, dispatch] = useReducer(
        authReducer.reducer,
        authReducer.initialState
    );
    useEffect(() => {
        return listenAuthState(dispatch);
    }, []);

    const [username, setUserName] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const result = await login();
            console.log(state);
            router.push('/');  // Redirect to home page after successful login
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider value={state}>
            <div className="flex min-h-screen bg-white">
                <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
                    <div className="mx-auto w-full max-w-sm">
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Sign in to your account
                        </p>
                        <div className="mt-8 space-y-6">
                            <Button
                                onClick={() => handleLogin()}
                                className="w-full bg-cyan-600 hover:bg-cyan-500"
                            >
                                Login with Google
                            </Button>
                            <Button
                                onClick={() => handleLogout()}
                                className="w-full bg-red-600 hover:bg-red-500"
                            >
                                Logout
                            </Button>
                            <div className="mt-4 text-center text-sm">
                                {state
                                    ? `Logged in as ${state.displayName}`
                                    : "Not logged in"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:w-1/2 relative">
                    <Image
                        className="absolute inset-0 h-full w-full object-cover"
                        src="/placeholder.svg?height=1080&width=1920"
                        alt="Login background"
                        width={1920}
                        height={1080}
                    />
                </div>
            </div>
        </AuthContext.Provider>
    );
}

