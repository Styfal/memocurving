import Image from "next/image";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Check, Star } from "lucide-react";
import Phone from "@/components/Phone";
import { Icons } from "@/components/icons";
import { Reviews } from "@/components/Reviews";
import Link from "next/link";
import { PricingCards } from "@/components/pricingcards";

{/* This is a backup page! Just keeping it just in case (we are prolly not using this lol)*/}

export default function Home() {
  return (
   <div className="bg-slate-50 ">
    <section>
      <MaxWidthWrapper className="pb-24 pt-10 lg:grid lg:grid-cols-3 sm:pb-32 lg:gap-x-0 xl:gap-x-8 lg:pt-24 xl:pt-32 lg:pb-52">
        <div className="col-span-2 px-6 lg:px-0 lg:pt-4">
          <div className="relative mx-auto text-center lg:text-left 
          flex flex-col  items-center lg:items-start">
            <div className="absolute w-28 left-0 -top-20 hidden lg:block">
              <img src="snake-1.png" className="w-full"/>
            </div>
            <h1 className="relative w-fit tracking-tight text-balance mt-16 font-bold !leading-tight text-gray-900 text-5xl md:text-6xl lg:text-7xl">
              From  <span className="bg-green-600 px-2 text-white">Zero</span> to a <span className="bg-blue-500 px-2 text-white">Hero</span></h1>
              <p className="mt-8 text-lg lg:pr-10 max-w-prose text-center lg:text-left text-balance md:text-wrap">
                  A masterclass on investment for complete beginners. <span className="font-semibold">Unlock the money habits you need for success</span>. Inbound will deliver interactive videos 
                and lessons that prepares you for as a <span className="text-green-600">professional investor </span>
              </p>

              <ul className="mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start">
                <div className="space-y-2">
                  <li  className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  20+ Course Chapters
                  </li> 
                  <li  className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Interactive Graphs and Figures 
                  </li> 
                  <li  className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Daily Analysis of Recent Market Trends 
                  </li> 
                  <li  className="flex gap-1.5 items-center text-left">
                  <Check className="h-5 w-5 shrink-0 text-green-600" />
                  Quizzes and Activities 
                  </li> 
                    
                </div>
              </ul>

              <div className="mt-12 flex flex-col sm+flex-row items-center sm:items-start gap-5">
                  <div className="flex -space-x-4">
                    <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" 
                    src="/users/user-1.png" 
                    alt="user image"
                    />
                     <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" 
                    src="/users/user-2.png" 
                    alt="user image"
                    />
                     <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" 
                    src="/users/user-3.png" 
                    alt="user image"
                    />
                     <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100" 
                    src="/users/user-4.jpg" 
                    alt="user image"
                    />
                     <img 
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-100 object-cover" 
                    src="/users/user-5.jpg" 
                    alt="user image"
                    />
                  </div>

                  <div className="flex flex-col justify-between items-center 
                  sm:items-start">
                    <div className="flex gap-0.5">
                      <Star 
                      className="h-4 w-4 text-green-600 fill-green-600"
                      />
                       <Star 
                      className="h-4 w-4 text-green-600 fill-green-600"
                      />
                       <Star 
                      className="h-4 w-4 text-green-600 fill-green-600"
                      />
                       <Star 
                      className="h-4 w-4 text-green-600 fill-green-600"
                      />
                       <Star 
                      className="h-4 w-4 text-green-600 fill-green-600"
                      />
                    </div>
                        <div className="mt-3">
                          <p>
                          <span className="font-semibold">4.3 million</span> Satisfied Customers
                          </p>
                          <p>
                            <span className="font-semibold">2.5 million </span> Premium Users 
                          </p>
                          <p>
                        <span className="font-semibold">5 million</span> Active Users 
                        </p>
                        </div>
                  </div>

              </div>
          </div>

        </div>



      <div className="col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit">
          <div className="relative md:max-w-xl">
            <img src="your-image.png" className="absolute w-40 lg:w52 left-56 -top-20 select-non hidden sm:block lg:hidden xl:block"/>
            <img src="/line.png" className="absolute w-20 -left-6 -bottom-6 select-none" />
           <Phone className="w-64" imgSrc="/testimonials/1.jpg"/>
          </div>
      </div>


      </MaxWidthWrapper>
    </section>    


    
<section className="bg-slate-100 py-24">
  <MaxWidthWrapper className="flex flex-col items-center gap-16 sm:gap-32">
    <div className="flex flex-col items-center gap-4 sm:gap-6">
      <img src="/snake-2.png" className="w-24 order-0" alt="Icon" />
      <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
        What Our
        <span className="relative px-2">Customers
          <Icons.underline className="hidden sm:block pointer-events-none absolute inset-x-0 -bottom-6 text-green-500" />
        </span> Say
      </h2>
    </div>


    <div className="mx-auto grid max-w-2xl grid-cols-1 px-4 lg:mx-0 lg:max-w-none lg:grid-cols-2 gap-y-16">
       {/*User 1*/}
      <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
        <div className="flex gap-0.5 mb-2">
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
        </div>
        <div className="text-lg leading-8">
            <p>
              "I was able to invest with just 100 dollars and make millions! I have been studying with inbound and I couldn't have asked for 
              anyone better to teach me about how to invest"
            </p>
        </div>
        <div className="flex gap-4 mt-2">
           <img
             className="rounded-full h-12 w-12 object-cover"
              src="/users/user-1.png"
              alt="user"
              />
               <div className="flex flex-col">
                  <p className="font-semibold">Michael</p>
                 <div className="flex items-center text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-green-600" />
                 <p className="text-sm ml-1">Verified Purchase</p>
             </div>
            </div>
          </div>

      </div>
        {/*User 2*/}
      <div className="flex flex-auto flex-col gap-4 lg:pr-8 xl:pr-20">
        <div className="flex gap-0.5 mb-2">
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
          <Star className="h-5 w-5 text-green-600 fill-green-600" />
        </div>
        <div className="text-lg leading-8">
            <p>
             At first I was very worried about whether this app would be similar to generic youtube videos talking about investments but not really getting us anywhere. 
             I took a risk and it was well worth the money. The course provided gave me so much insight and tricks I could use for me to get started with trading. It is 
             beginner friendly and really intuitive. Props to Inboundrive!
            </p>
        </div>
        <div className="flex gap-4 mt-2">
           <img
             className="rounded-full h-12 w-12 object-cover"
              src="/users/user-2.png"
              alt="user"
              />
               <div className="flex flex-col">
                  <p className="font-semibold">Hansen</p>
                 <div className="flex items-center text-zinc-600">
                  <Check className="h-4 w-4 stroke-[3px] text-green-600" />
                 <p className="text-sm ml-1">Verified Purchase</p>
             </div>
            </div>
          </div>
      </div>
    </div>
  </MaxWidthWrapper>
<div className="pt-16">
    <Reviews />
</div>

</section>

<section>
  <MaxWidthWrapper className="py-24">
      <div className="mb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-2xl sm:text-center">
        <h2 className="order-1 mt-2 tracking-tight text-center text-balance !leading-tight font-bold text-5xl md:text-6xl text-gray-900">
          <span className="text-green-600 relative">Join</span> us now!
           </h2>
        </div>
        
        <div className="px-[20px] lg:px-[280px]">
                <p className="text-center pt-6 text-zinc-900 lg:text-[20px] lg:leading-7">
                   Kickstart your investment career by joining us for free, or purchasing our premium plans to dive deeper into 
                   the mindset of a professional investor. 
                </p>

                <div className="flex w-full pt-8 justify-center sm:gap-x-6">
                <Link href="/api/auth/login" passHref>
               <button className="bg-green-600 w-full sm:w-auto py-2 px-4 lg:px-8 text-white rounded-md lg:w-fit">
              View Pricing
              </button>
              </Link>
                </div>
              </div>
      </div>
    </MaxWidthWrapper>
</section>
   </div>
  );
}
