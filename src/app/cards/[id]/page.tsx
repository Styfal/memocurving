"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { db } from "@/lib/firebase";

// Define types for flashcards and card set.
type Flashcard = {
  question: string;
  answer: string;
};

type CardSetMeta = {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  lastReviewed: number; // timestamp in ms; 0 if never reviewed
  reviewCount: number;
};

type FlashcardPageProps = {
  params: { id: string };
};

// Helper functions to compute and format the next review date.
const msPerDay = 1000 * 60 * 60 * 24;
const getNextReviewTime = (lastReviewed: number, reviewCount: number): number => {
  if (lastReviewed === 0) return Date.now() + msPerDay;
  return lastReviewed + (reviewCount + 1) * msPerDay;
};

const formatDate = (timestamp: number): string => {
  const options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };
  return new Date(timestamp).toLocaleDateString(undefined, options);
};

const MemoFlashcard: NextPage<FlashcardPageProps> = ({ params }) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [cardSet, setCardSet] = useState<CardSetMeta | null>(null);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fetch the card set document from Firestore.
  useEffect(() => {
    const fetchFlashcardSet = async () => {
      if (!params.id) return;
      try {
        setIsLoading(true);
        const docRef = doc(db, "cardSets", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const fetchedCards = data.cards || [];
          setFlashcards(fetchedCards);
          setCardSet({
            id: params.id,
            title: data.title || "Untitled",
            description: data.description || "",
            cards: fetchedCards,
            lastReviewed: data.lastReviewed || 0,
            reviewCount: data.reviewCount || 0,
          });
          setStartTime(new Date());
        } else {
          throw new Error("No such document");
        }
      } catch (err) {
        console.error("Error fetching flashcard set:", err);
        setError("Failed to load flashcards");
        setFlashcards([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashcardSet();
  }, [params.id]);

  useEffect(() => {
    if (currentCard === 0 && !startTime && flashcards.length > 0) {
      setStartTime(new Date());
    }
  }, [currentCard, startTime, flashcards]);

  // Extended keyboard navigation: Left/Right for navigation; Up/Down/Space to flip.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        nextCard();
      } else if (e.key === "ArrowLeft") {
        prevCard();
      } else if ((e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") && !isCompleted) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompleted, currentCard, flashcards.length]);

  const nextCard = useCallback(() => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1);
      setIsFlipped(false);
    }
  }, [currentCard, flashcards.length]);

  const prevCard = useCallback(() => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1);
      setIsFlipped(false);
    }
  }, [currentCard]);

  const addCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const updatedCards = [...flashcards, { question: newQuestion, answer: newAnswer }];
      setFlashcards(updatedCards);
      if (cardSet) {
        setCardSet({ ...cardSet, cards: updatedCards });
      }
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  // Finish review session and update Firestore.
  const finishReviewSession = async () => {
    if (!cardSet) return;
    const finishTime = Date.now();
    const newReviewCount = cardSet.reviewCount + 1;
    const updatedCardSet: CardSetMeta = {
      ...cardSet,
      lastReviewed: finishTime,
      reviewCount: newReviewCount,
    };
    setCardSet(updatedCardSet);
    setEndTime(new Date(finishTime));
    setIsCompleted(true);
    setShowCelebration(true);

    try {
      await fetch(`/api/cardsets/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedCardSet.title,
          description: updatedCardSet.description,
          cards: updatedCardSet.cards,
          lastReviewed: updatedCardSet.lastReviewed,
          reviewCount: updatedCardSet.reviewCount,
        }),
      });
    } catch (error) {
      console.error("Error updating review session:", error);
    }
  };

  const handleCheckClick = () => {
    if (currentCard === flashcards.length - 1 && isFlipped && !isCompleted) {
      finishReviewSession();
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

  if (isLoading) return <div>Loading flashcards...</div>;
  if (error) return <div>Error: {error}</div>;
  if (flashcards.length === 0) return <div>No flashcards found for this set.</div>;

  const progress = ((currentCard + 1) / flashcards.length) * 100;
  const isLastCard = currentCard === flashcards.length - 1;
  const canCheck = isLastCard && isFlipped && !isCompleted;
  const completionTime =
    startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

  // Calculate the next review date using the updated card set.
  const nextReview =
    cardSet && cardSet.lastReviewed !== undefined
      ? formatDate(getNextReviewTime(cardSet.lastReviewed, cardSet.reviewCount))
      : "N/A";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Larger container for Firestore flashcards */}
      <div className="w-full max-w-3xl">
        <Progress value={progress} className="mb-4 transition-all duration-300" />

        {/* Flashcard Display */}
        <div
          className="relative w-full h-[500px] cursor-pointer"
          onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
          style={{ perspective: "2000px" }}
          aria-label="Flashcard: click to flip"
        >
          <motion.div
            className="relative w-full h-full"
            initial={false}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front Side */}
            <div
              className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
                {currentCard + 1} / {flashcards.length}
              </div>
              <div className="flex items-center justify-center h-full">
                <p className="text-3xl font-chalk text-gray-800 text-center">
                  {flashcards[currentCard].question}
                </p>
              </div>
            </div>
            {/* Back Side */}
            <div
              className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
                {currentCard + 1} / {flashcards.length}
              </div>
              <div className="flex items-center justify-center h-full">
                <p className="text-3xl font-chalk text-gray-800 text-center">
                  {flashcards[currentCard].answer}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            size="icon"
            onClick={prevCard}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
            disabled={currentCard === 0 || isCompleted}
            aria-label="Previous card"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
            disabled={isCompleted}
            aria-label="Flip card"
          >
            <Repeat className="h-8 w-8 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCheckClick}
            className={`border-none rounded-full w-16 h-16 transition-transform hover:scale-110 ${
              canCheck ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
            }`}
            disabled={!canCheck}
            aria-label="Complete session"
          >
            <Check className="h-8 w-8 text-white" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextCard}
            className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
            disabled={isLastCard || isCompleted}
            aria-label="Next card"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </Button>
        </div>

        {/* Add New Card Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isCompleted}
              aria-label="Add new flashcard"
            >
              <Plus className="mr-2 h-6 w-6" /> Add New Card
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
                  aria-required="true"
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
                  aria-required="true"
                />
              </div>
            </div>
            <Button onClick={addCard} disabled={!newQuestion.trim() || !newAnswer.trim()}>
              Add Card
            </Button>
          </DialogContent>
        </Dialog>

        {/* Celebratory Modal */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
              aria-modal="true"
              role="dialog"
            >
              <div className="bg-white p-8 rounded-lg text-center">
                <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                <p className="text-xl mb-4">
                  You completed the flashcard set in {completionTime} seconds!
                </p>
                {cardSet && (
                  <p className="text-lg mb-6">
                    Next Review: {nextReview}
                  </p>
                )}
                <div className="flex justify-center space-x-6">
                  <Button
                    onClick={resetFlashcards}
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-transform hover:scale-110"
                    aria-label="Redo session"
                  >
                    <RefreshCw className="mr-2 h-6 w-6" /> Redo
                  </Button>
                  <Button
                    onClick={() => (window.location.href = "/cards")}
                    className="bg-green-500 hover:bg-green-600 text-white transition-transform hover:scale-110"
                    aria-label="Menu"
                  >
                    <Home className="mr-2 h-6 w-6" /> Menu
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
