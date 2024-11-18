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


    // This is called the authReducer. It's responsible for checking the login state of the user.
    // By wrapping your components with the AuthContext.Provider and setting up the following, you can access the user state from any page
    const [state, dispatch] = useReducer(
        authReducer.reducer,
        authReducer.initialState
    );
    useEffect(() => {
        return listenAuthState(dispatch);
    }, []);

    const [username, setUserName] = useState<string | null>(null);

    const handleLogin = async () => {
        try {
            const result = await login(); // Call the login function
            //if (result) {
            //    setUserName(state.displayName); // Extract and set the user name
            //}
            console.log(state);
        } catch (error) {
            console.error("Login failed:", error); // Handle login errors
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error); // Handle logout errors
        }
    };

    return (
        <AuthContext.Provider value={state}>
            <div className="flex min-h-screen bg-white">
                <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8">
                    <div className="mx-auto w-full max-w-sm">
                        {/* OAuth Login Form */}
                        <div className="mt-8 space-y-6">
                            <Button
                                onClick={() => handleLogin()}
                                className="w-full bg-cyan-600 hover:bg-cyan-500"
                            >
                                Login with Google
                            </Button>
                            <Button
                                onClick={() => handleLogout()}
                                className="w-full bg-cyan-600 hover:bg-cyan-500"
                            >
                                logout
                            </Button>

                            {/* Just for checking purposes on this page: you can check to see what to show when logged in vs not logged in like so */}

                            <div>
                                <pre>
                                    {state
                                        ? state.displayName + "でログインしています"
                                        : "ログインしていません"}
                                </pre>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthContext.Provider>
    );
}
