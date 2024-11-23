"use client";

import Image from "next/image";
import { ArrowRightIcon } from "lucide-react";
import Laptop from "../../public/computerapp.png";
import { buttonVariants } from "./ui/button";
import { LogoutLink, RegisterLink, LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export function Hero() {
  return (
    <div className="bg-slate-50">
      <section className="pt-10 bg-[radial-gradient(ellipse_200%_100%_at_bottom_left,#a6dcff,#EAEEFE_90%)] image-fade relative min-h-screen pb-[250px]"> {/* Added pb-[150px] */}
        <div className="container relative z-10">
          <div className="max-w-2xl mb-[210px]">
          
            <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-b from-black to-[#001E80] bg-clip-text text-transparent mt-6 px-2 py-2 ">
              Pathway to <span className=" bg-cyan-500 text-white px-2 rounded-lg py-2"> Productivity</span>
            </h1>
            <p className="text-xl text-[#010D3E] tracking-tight mt-6 pr-12 px-2">
              Celebrate the joy of accomplishment with a tool designed to track your progress,
              motivate your efforts, and celebrate your success. 
            </p>
            <div className="flex gap-1 items-center mt-[30px]">
              <RegisterLink
                className={buttonVariants({
                  size: "lg",
                  variant: "ghost",
                }) + " bg-gradient-to-b from-cyan-500 to-cyan-600 text-white w-32 transition-transform duration-700 ease-in-and-out hover:text-white hover:scale-105"}
              >
                Join for Free
              </RegisterLink>

              <button className="px-4 py-2 rounded-lg font-medium inline-flex items-center justify-center tracking-tight">
                <span>Learn More</span> <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[-150px] right-0 w-full h-full"> 
          <Image src={Laptop} alt="Laptop Image" className="image-fade" />
        </div>
      </section>
    </div>
  );
}