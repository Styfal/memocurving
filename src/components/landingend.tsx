import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "./ui/button";
import { LogoutLink, RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function LandingEnd() {
  return (
    <div className="p-8 flex justify-center items-center min-h-[50px]">
      <div className="w-full max-w-4xl">
        <div className="group bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 
         rounded-lg shadow-lg overflow-hidden hover:scale-105
         transition-all duration-1000"> 
          <section className="p-8 sm:p-12">
            <div className="w-full max-w-3xl mx-auto text-center">
              <div className="relative mb-8 inline-block">
                <Sparkles className="text-yellow-300 w-8 h-8 sm:w-10 sm:h-10 absolute -top-4 -left-4" />
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight">
                  Join us
                </h1>
                <Sparkles className="text-yellow-300 w-8 h-8 sm:w-10 sm:h-10 absolute -bottom-4 -right-4" />
              </div>
              <p className="mt-3 text-xl sm:text-2xl text-white sm:mt-5 sm:max-w-xl sm:mx-auto md:mt-5">
                Be part of the next big thing. Start studying effectively!
              </p>
              <div className="mt-10 sm:mt-12">

              <RegisterLink
                className={`${buttonVariants({
                size: "lg",
                variant: "ghost",
                  })} bg-white text-blue-600 border border-blue-600 rounded-lg shadow-md hover:scale-105 hover:text-blue-700 transition-all duration-300`}
                  >
                   Join Now
              </RegisterLink>

              </div>
              <div className="mt-10">
                <p className="text-sm text-white">
                  By joining, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}