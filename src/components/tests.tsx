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
import { useRouter } from "next/navigation";

type tests = {
    id: string;
    name: string;
    createdAt: Timestamp;
    questionLength: number;
}

type Flashcard = {
    id: number
    question: string
    answer: string
    options?: string[]
    answered: boolean
    redoUsed: boolean
}

type TestProps = {
    id: string;
    title: string;
    userId: string;
    description: string;
    questions: [{
        questionText: string;
        options: [{
            optionText: string;
            isCorrect: boolean;
        }]
    }]
    questionLength: number;
}

export default function Test() {

    const router = useRouter();

    const [convertedTest, setConvertedTest] = useState<Flashcard[]>();

    const convertTest = (test: TestProps): Flashcard[] => {
        return test.questions.map((q, index) => {
            const correctOption = q.options.find(option => option.isCorrect)?.optionText || "";
            const options = q.options.map(option => option.optionText);

            return {
                id: index + 1,
                question: q.questionText,
                answer: correctOption,
                options: options.length > 0 ? options : undefined,
                answered: false,
                redoUsed: false
            };
        });
    };

    const handlePlayTest = (testId: string) => {
        router.push(`/cards/test01?testId=${testId}`)
    }



    const { userId } = useAuthContext();
    const [tests, setTests] = useState<TestProps[]>([]);
    const [ createNewTest, setCreateNewTest ] = useState(false)
 
    useEffect(() => {
        const fetchTest = async () => {
            const testCollectionRef = collection(db, "tests");
            const q = query(
                testCollectionRef,
                where("userId", "==", userId),
                //orderBy("createdAt", "desc")
            );
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const newTests: TestProps[] = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    title: doc.data().title,
                    userId: doc.data().userId,
                    description: doc.data().description,
                    questions: doc.data().questions || [],
                    questionLength: doc.data().questions? doc.data().questions.length : 0,
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
                                        <CardTitle>{test.title}</CardTitle>
                                        <CardDescription>{test.questionLength} Questions</CardDescription>
                                    </CardHeader>
                                    <CardFooter className="bg-cyan-200 p-0">
                                        <div className="bg-slate-100 flex flex-row gap-x-2 items-center justify-center p-10">
                                            <Trash2 className="h-4 w-4 text-red-600" />
                                            <PenSquare className="h-4 w-4" />
                                            <Button onClick={() => handlePlayTest(test.id)} variant="outline"><Play className="h-4 w-4 " /></Button>
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

