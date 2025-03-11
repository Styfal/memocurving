
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
            await login();
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
            <div className="relative flex min-h-screen">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <Image
                        src="/placeholder.svg?height=1080&width=1920"
                        alt="Login background"
                        layout="fill"
                        objectFit="cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-50"></div>
                </div>

                {/* Login Card */}
                <div className="relative z-10 flex w-full flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                        <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Sign in to your account
                        </p>

                        <div className="mt-8 space-y-6">
                            <Button
                                onClick={handleLogin}
                                className="w-full rounded-md bg-cyan-600 py-2 text-white hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            >
                                Login with Google
                            </Button>
                            <Button
                                onClick={handleLogout}
                                className="w-full rounded-md bg-red-600 py-2 text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                            >
                                Logout
                            </Button>
                            <div className="mt-4 text-center text-sm text-gray-700">
                                {state && state.displayName
                                    ? `Logged in as ${state.displayName}`
                                    : "Not logged in"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}
