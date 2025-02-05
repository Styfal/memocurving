"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Repeat,
  Plus,
  Check,
  Home,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { NextPage } from "next";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Import auth from firebase
import { User } from "firebase/auth"; // Import the User type

type Flashcard = {
  question: string;
  answer: string;
};

type FlashcardPageProps = {
  params: {
    id: string;
  };
};

const MemoFlashcard: NextPage<FlashcardPageProps> = ({ params }) => {
  // State for test metadata fetched from Firestore
  const [fetchedTitle, setFetchedTitle] = useState("");
  const [fetchedDescription, setFetchedDescription] = useState("");

  // Flashcards state and navigation
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // States for new flashcard input (if needed)
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // State for the completion celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // States for test metadata (for saving changes, if needed)
  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // State to hold the current authenticated user
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch test data from Firestore using the test id
  useEffect(() => {
    const fetchTestSet = async () => {
      if (!params.id) return;
      try {
        setIsLoading(true);
        const docRef = doc(db, "tests", params.id); // Fetch from 'tests' collection
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Store metadata for display
          setFetchedTitle(data.title || "");
          setFetchedDescription(data.description || "");
          // Set flashcards (assumed to be stored in the "questions" field)
          const fetchedFlashcards = data.questions || [];
          setFlashcards(fetchedFlashcards);
          // Optionally, if you want to populate the saving fields with fetched data:
          setTestTitle(data.title || "");
          setTestDescription(data.description || "");
          setStartTime(new Date());
        } else {
          throw new Error("No such test found");
        }
      } catch (err) {
        console.error("Error fetching test set:", err);
        setError("Failed to load test");
        setFlashcards([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestSet();
  }, [params.id]);

  // Ensure startTime is set
  useEffect(() => {
    if (currentCard === 0 && !startTime && flashcards.length > 0) {
      setStartTime(new Date());
    }
  }, [currentCard, startTime, flashcards]);

  // Navigation functions
  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setIsFlipped(false);
    }
  };

  // Add a new flashcard to the current set
  const addCard = () => {
    if (newQuestion && newAnswer) {
      setFlashcards([...flashcards, { question: newQuestion, answer: newAnswer }]);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  // When the last card is flipped, mark the test as completed
  const handleCheckClick = () => {
    if (currentCard === flashcards.length - 1 && isFlipped && !isCompleted) {
      setEndTime(new Date());
      setIsCompleted(true);
      setShowCelebration(true);
    }
  };

  const resetFlashcards = () => {
    setCurrentCard(0);
    setIsFlipped(false);
    setShowCelebration(false);
    setIsCompleted(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  // Save test to Firestore via the API route (if editing or saving changes)
  const saveTest = async () => {
    try {
      const testData = {
        title: testTitle,
        description: testDescription,
        // Ensure we are sending an array of strings as expected
        questions: flashcards.map((card) => `${card.question} - ${card.answer}`),
        createdAt: new Date().toISOString(),
        userId: currentUser ? currentUser.uid : "unknown",
      };

      console.log("Sending test data:", testData);

      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      });

      console.log("Response status:", response.status);

      const result = await response.json();
      console.log("Response data:", result);

      if (result.success) {
        console.log("Test saved with ID:", result.data.id);
        // Optionally, clear state or give user feedback here
      } else {
        console.error("Error saving test:", result.error);
      }
    } catch (error) {
      console.error("Error in saveTest function:", error);
    }
  };

  // Loading and error states
  if (isLoading) {
    return <div>Loading test data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (flashcards.length === 0) {
    return <div>No flashcards found for this test.</div>;
  }

  const progress = ((currentCard + 1) / flashcards.length) * 100;
  const isLastCard = currentCard === flashcards.length - 1;
  const canCheck = isLastCard && isFlipped && !isCompleted;
  const completionTime =
    startTime && endTime
      ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
      : 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md">
        {/* Display test metadata */}
        <header className="mb-4">
          <h1 className="text-3xl font-bold">{fetchedTitle}</h1>
          <p className="text-lg text-muted-foreground">{fetchedDescription}</p>
        </header>

        {/* Progress Bar */}
        <Progress value={progress} className="mb-4" />

        {/* Flashcard display */}
        <div
          className="relative w-full aspect-[4/3] cursor-pointer"
          onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
          style={{ perspective: "1000px" }}
        >
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            <div
              className="absolute inset-0 bg-white rounded-lg p-6 border-2 border-gray-200 shadow-lg"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="absolute top-2 left-2 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-800">
                {currentCard + 1} / {flashcards.length}
              </div>
              <div className="flex items-center justify-center h-full">
                <p className="text-2xl font-chalk text-gray-800 text-center">
                  {flashcards[currentCard].question}
                </p>
              </div>
            </div>

            <div
              className="absolute inset-0 bg-white rounded-lg p-6 border-2 border-gray-200 shadow-lg"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="absolute top-2 left-2 bg-blue-100 px-3 py-1 rounded-full text-sm font-semibold text-blue-800">
                {currentCard + 1} / {flashcards.length}
              </div>
              <div className="flex items-center justify-center h-full">
                <p className="text-2xl font-chalk text-gray-800 text-center">
                  {flashcards[currentCard].answer}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevCard}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-12 h-12"
            disabled={currentCard === 0 || isCompleted}
          >
            <ChevronLeft className="h-6 w-6 text-white" />
            <span className="sr-only">Previous card</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-12 h-12"
            disabled={isCompleted}
          >
            <Repeat className="h-6 w-6 text-white" />
            <span className="sr-only">Flip card</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCheckClick}
            className={`${
              canCheck ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            } border-none rounded-full w-12 h-12`}
            disabled={!canCheck}
          >
            <Check className="h-6 w-6 text-white" />
            <span className="sr-only">Check</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextCard}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-12 h-12"
            disabled={isLastCard || isCompleted}
          >
            <ChevronRight className="h-6 w-6 text-white" />
            <span className="sr-only">Next card</span>
          </Button>
        </div>

        {/* Dialog to add a new flashcard */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isCompleted}
            >
              <Plus className="mr-2 h-4 w-4" /> Add New Card
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Flashcard</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="question" className="text-right">
                  Question
                </label>
                <Input
                  id="question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="answer" className="text-right">
                  Answer
                </label>
                <Input
                  id="answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={addCard}>Add Card</Button>
          </DialogContent>
        </Dialog>

        {/* Button and Dialog to save the entire test */}
        <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white"
              disabled={!isCompleted}
            >
              Save Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Save Test Details</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="testTitle" className="text-right">
                  Title
                </label>
                <Input
                  id="testTitle"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="testDescription" className="text-right">
                  Description
                </label>
                <Input
                  id="testDescription"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button
              onClick={() => {
                saveTest();
                setShowSaveDialog(false);
              }}
            >
              Save Test
            </Button>
          </DialogContent>
        </Dialog>

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                <p className="text-xl mb-6">
                  You completed the flashcard in {completionTime} seconds!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={resetFlashcards}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Redo
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/")}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Home className="mr-2 h-4 w-4" /> Home
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MemoFlashcard;
