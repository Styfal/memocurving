"use client";

import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/showcase";
import LandingEnd from "@/components/landingend";

// Login with Google Oauth imports
import React, { useReducer, useEffect } from "react";
import { AppProps } from "next/app";
import AuthContext from "../lib/AuthContext";
import authReducer from "../lib/authReducer";
import { listenAuthState } from "../lib/auth";

export default function Home() {
    const [state, dispatch] = useReducer(
        authReducer.reducer,
        authReducer.initialState
    );
    useEffect(() => {
        return listenAuthState(dispatch);
    }, []);

    return (
        <>
            <AuthContext.Provider value={state}>
                <Hero />
                <div className="px-[24px] lg:container lg:px-20 mx-auto items-align justify-center py-10">
                    <Showcase />
                    <Features />
                    <LandingEnd />
                </div>
            </AuthContext.Provider>
        </>
    );
}
