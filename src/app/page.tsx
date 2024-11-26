"use client";

import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Showcase } from "@/components/showcase";
import LandingEnd from "@/components/landingend";

// Login with Google Oauth imports
import React from "react";

export default function Home() {
    return (
        <>
            <Hero />
            <div className="px-[24px] lg:container lg:px-20 mx-auto items-align justify-center py-10">
                <Showcase />
                <Features />
                <LandingEnd />
            </div>
        </>
    );
}
