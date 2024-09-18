"use client";

 
// It was just to check if trpc works but can be reference to determine how to use this 


import { trpc } from '../../src/app/_trpc/client';

export default function ToDoList() {
    const getTodos = trpc.getTodos.useQuery();
    return <main className='max-w-3xl mx-auto mt-5'></main>
}