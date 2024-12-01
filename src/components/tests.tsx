"use client";

import React, { useEffect, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Trash2, PenSquare, Play } from "lucide-react";
import { useAuthContext } from "@/lib/AuthContext";
import { Timestamp, collection, query, orderBy, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import CreateTest from "./create-tests";

type tests = {
    id: string;
    name: string;
    createdAt: Timestamp;
    questionLength: number;
}

export default function Test() {

    const { user, userId } = useAuthContext();
    const [tests, setTests] = useState<tests[]>([]);
    const [ createNewTest, setCreateNewTest ] = useState(false)
 
    useEffect(() => {
        const fetchTest = async () => {
            const testCollectionRef = collection(db, "test");
            const q = query(
                testCollectionRef,
                where("userId", "==", userId),
                orderBy("createdAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newTests: tests[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                    createdAt: doc.data().createdAt,
                    questionLength: doc.data().questions ? doc.data().questions.length : 0,
                    ...doc.data(),
                }));
                setTests(newTests);
            })
            return () => {
                unsubscribe();
            };
        }
        fetchTest();
    });

    return (
        <div className="lg:mr-64">
            
            {createNewTest ? (
                <CreateTest onBack={() => setCreateNewTest(false)} />
            ) : (

                <div className="w-full flex flex-col gap-y-4">
                    <div className="flex flex-row justify-between">
                        <div className="flex justify-center items-center">
                            <h1 className="text-xl px-3 font-bold">Your Tests</h1>
                        </div>
                        <Button onClick={() => setCreateNewTest(true)}>Create a New Test</Button>
                    </div>

                    <div className="flex flex-col gap-y-2">
                        {tests.map((test) => (
                            <Card key={test.id}>
                                <div className="flex flex-row justify-between">
                                    <CardHeader>
                                        <CardTitle>{test.name}</CardTitle>
                                        <CardDescription>{test.questionLength} Questions</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="bg-cyan-200 p-0">
                                        <div className="bg-slate-100 flex flex-row gap-x-2 items-center justify-center p-10">
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                            <PenSquare className="h-4 w-4" />
                                            <Play className="h-4 w-4 " />
                                        </div>
                                    </CardFooter>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

