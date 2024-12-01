"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Sidebar from "./sidebar";
import CreateCardSet from "./create-card-set";
import EditCardSets from "./edit-card-sets";
import AICreate from "./ai-create";
import Test from "./tests";

interface Flashcard {
    id: number;
    question: string;
    answer: string;
    image: string | null;
}

interface CardSet {
    id: number;
    name: string;
    description: string;
    cards: Flashcard[];
}

interface TestQuestion {
    id: number;
    question: string;
    answerType: "multiple" | "short";
    options?: string[];
    correctAnswer: string;
    image: string | null;
}

interface TestSet {
    id: number;
    name: string;
    description: string;
    questions: TestQuestion[];
}

// New combined type
type CombinedSet = CardSet | TestSet;

export default function CreateCards() {
    const [cardSets, setCardSets] = useState<CardSet[]>([]);
    const [testSets, setTestSets] = useState<TestSet[]>([]);
    const [combinedSets, setCombinedSets] = useState<CombinedSet[]>([]); // New state for combined sets
    const [currentPage, setCurrentPage] = useState("create");
    const [notification, setNotification] = useState<{
        type: "success" | "error";
        message: string;
    } | null>(null);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    useEffect(() => {
        // Update the combinedSets whenever cardSets or testSets change
        setCombinedSets([...cardSets, ...testSets]);
    }, [cardSets, testSets]);

    const renderContent = () => {
        switch (currentPage) {
            case "create":
                return (
                    <CreateCardSet
                        setCardSets={setCardSets}
                        setNotification={setNotification}
                    />
                );
            case "edit":
                return (
                    <EditCardSets
                        combinedSets={combinedSets}
                        setCardSets={setCardSets}
                        setNotification={setNotification}
                    />
                );
            case "test":
                return <Test />
                /* return (
                    <TestCreate
                        setTestSets={setTestSets}
                        setNotification={setNotification}
                    />
                ); */
            case "ai":
                return <AICreate />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
            <div className="flex-1 p-8 overflow-auto">
                <h1 className="text-4xl font-bold mb-8 text-center text-cyan-800">
                    {currentPage === "create"
                        ? "Create Card Set"
                        : currentPage === "edit"
                          ? "Edit Card Sets"
                          : currentPage === "test"
                            ? "Test Create"
                            : currentPage === "ai"
                              ? "AI Create"
                              : ""}
                </h1>
                {notification && (
                    <Alert
                        variant={
                            notification.type === "success"
                                ? "default"
                                : "destructive"
                        }
                        className="mb-4"
                    >
                        <AlertTitle>
                            {notification.type === "success"
                                ? "Success"
                                : "Error"}
                        </AlertTitle>
                        <AlertDescription>
                            {notification.message}
                        </AlertDescription>
                    </Alert>
                )}
                {renderContent()}
            </div>
        </div>
    );
}
