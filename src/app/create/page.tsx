"use client"

import CreateCardSet from "@/components/createcard"
import { SetStateAction } from "react"

const Page= () => {

   return( 

   <CreateCardSet combinedSets={[]} setCardSets={function (value: SetStateAction<{ id: number; title: string; description: string; cards: { id: number; question: string; answer: string; image: string | null; lastReviewed: number; reviewCount: number }[] }[]>): void {
         throw new Error("Function not implemented.")
      } } setNotification={function (notification: { type: "success" | "error"; message: string } | null): void {
         throw new Error("Function not implemented.")
      } }/>
  
   )
    

 
}

export default Page

