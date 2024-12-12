"use client"

import TestPage from "@/components/testingpage"
import { useAuthContext } from "@/lib/AuthContext";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils"
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";


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

const Page = () => {
    
    const searchParams = useSearchParams();
    const testId = searchParams.get('testId');

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

    const { userId, loading } = useAuthContext();
    console.log(userId)
    const [tests, setTests] = useState<TestProps[]>([]);
    console.log(tests);
 

    useEffect(() => {

        console.log("Fetching tests for userId:", userId);

        if (loading || !userId) return;

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
                console.log(newTests);
            })
            return () => {
                unsubscribe();
            };
        }
        fetchTest();
    }, [userId, loading, testId]);

    useEffect(() => {
        if (testId && tests.length > 0) {
            const test = tests.find(test => test.id === testId);
            if (test) {
                const convertedTest = convertTest(test);
                setConvertedTest(convertedTest);
                console.log(convertedTest);
            }
        }
    }, [testId, tests])

    console.log(tests);
   return( 

       <Suspense fallback={<p>Loading feed...</p>}>
           <TestPage tests={convertedTest!}></TestPage>
       </Suspense>
        

    
   )
 
}

export default Page