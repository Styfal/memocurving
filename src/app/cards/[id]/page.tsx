"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Repeat,
  Check,
  XCircle,
  Home,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

type FlashcardWithCount = Flashcard & { tickCount: number };

type CardSetMeta = {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[]; // original flashcards
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

// Custom progress bar component.
// It displays a center marker with two bars growing from the center:
// green (for ticks) to the left and red (for crosses) to the right.
// The unit is based on a required total of 2× the number of cards.
const CustomProgressBar = ({
  greenCount,
  redCount,
  total,
}: {
  greenCount: number;
  redCount: number;
  total: number;
}) => {
  // Total required ticks = 2 * total cards.
  const requiredTicks = 2 * total;
  // Each half of the bar represents 50% of the container.
  // unitPercent: How many percentage points one tick adds to half the bar.
  const unitPercent = total > 0 ? 50 / requiredTicks : 0;
  const leftWidth = greenCount * unitPercent;
  const rightWidth = redCount * unitPercent;
  return (
    <div className="relative w-full h-6 bg-gray-200 rounded" style={{ position: "relative" }}>
  
      {/* Left side (green) */}
      <div
        className="absolute top-0 bottom-0 bg-green-700 rounded-l"
        style={{
          left: "50%",
          width: `${leftWidth}%`,
          transform: "translateX(-100%)",
          transition: "width 0.3s ease",
        }}
      />
      {/* Right side (red) */}
      <div
        className="absolute top-0 bottom-0 bg-red-700 rounded-r"
        style={{
          left: "50%",
          width: `${rightWidth}%`,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
};

const MemoFlashcard: NextPage<FlashcardPageProps> = ({ params }) => {
  const [queue, setQueue] = useState<FlashcardWithCount[]>([]);
  const [cardSet, setCardSet] = useState<CardSetMeta | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [showIntermission, setShowIntermission] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  // Count of reviews since the last intermission.
  const [reviewCountSinceIntermission, setReviewCountSinceIntermission] = useState(0);
  // Tally counters.
  const [greenCount, setGreenCount] = useState(0);
  const [redCount, setRedCount] = useState(0);
  // Holds the initial total count of cards.
  const totalCardsRef = useRef<number>(0);

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
          const fetchedCards: Flashcard[] = data.cards || [];
          setCardSet({
            id: params.id,
            title: data.title || "Untitled",
            description: data.description || "",
            cards: fetchedCards,
            lastReviewed: data.lastReviewed || 0,
            reviewCount: data.reviewCount || 0,
          });
          // Initialize the review queue.
          const initialQueue = fetchedCards.map((card) => ({ ...card, tickCount: 0 }));
          setQueue(initialQueue);
          totalCardsRef.current = fetchedCards.length;
          setStartTime(new Date());
        } else {
          throw new Error("No such document");
        }
      } catch (err) {
        console.error("Error fetching flashcard set:", err);
        setError("Failed to load flashcards");
        setQueue([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFlashcardSet();
  }, [params.id]);

  // Enable keyboard navigation to flip the card.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") &&
        !isCompleted &&
        !showIntermission
      ) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompleted, showIntermission]);

  // Navigation: rotate the queue forward.
  const nextCard = () => {
    if (queue.length > 1 && !showIntermission) {
      setQueue((prevQueue) => [...prevQueue.slice(1), prevQueue[0]]);
      setIsFlipped(false);
    }
  };

  // Navigation: rotate the queue backward.
  const prevCard = () => {
    if (queue.length > 1 && !showIntermission) {
      setQueue((prevQueue) => [prevQueue[prevQueue.length - 1], ...prevQueue.slice(0, prevQueue.length - 1)]);
      setIsFlipped(false);
    }
  };

  // Process intermission logic.
  const incrementReviewCount = () => {
    const newCount = reviewCountSinceIntermission + 1;
    if (newCount >= 7) {
      setShowIntermission(true);
      setReviewCountSinceIntermission(0);
    } else {
      setReviewCountSinceIntermission(newCount);
    }
  };

  // Handler for when the user indicates they "got" the card.
  const handleGotIt = async () => {
    if (!isFlipped || queue.length === 0 || showIntermission) return;
    const current = queue[0];
    const updatedCount = current.tickCount + 1;
    let newQueue = queue.slice(1);
    setGreenCount((prev) => prev + 1);
    if (updatedCount < 2) {
      newQueue.push({ ...current, tickCount: updatedCount });
    }
    setQueue(newQueue);
    setIsFlipped(false);
    incrementReviewCount();
    if (newQueue.length === 0) {
      // All cards mastered: finish the session.
      const finishTime = Date.now();
      setEndTime(new Date(finishTime));
      setIsCompleted(true);
      setShowCelebration(true);
      if (cardSet) {
        const newReviewCount = cardSet.reviewCount + 1;
        const updatedCardSet: CardSetMeta = {
          ...cardSet,
          lastReviewed: finishTime,
          reviewCount: newReviewCount,
        };
        setCardSet(updatedCardSet);
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
      }
    }
  };

  // Handler for when the user indicates they didn't get the card.
  const handleDidntGetIt = () => {
    if (queue.length === 0 || showIntermission) return;
    const current = queue[0];
    setRedCount((prev) => prev + 1);
    const newQueue = queue.slice(1).concat(current);
    setQueue(newQueue);
    setIsFlipped(false);
    incrementReviewCount();
  };

  // Handler for adding a new card.
  const addCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newCard: FlashcardWithCount = { question: newQuestion, answer: newAnswer, tickCount: 0 };
      const updatedQueue = [...queue, newCard];
      setQueue(updatedQueue);
      if (cardSet) {
        const updatedCards = [...cardSet.cards, { question: newQuestion, answer: newAnswer }];
        setCardSet({ ...cardSet, cards: updatedCards });
        totalCardsRef.current = updatedCards.length;
      }
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  // Reset the session.
  const resetFlashcards = () => {
    if (cardSet) {
      const initialQueue = cardSet.cards.map((card) => ({ ...card, tickCount: 0 }));
      setQueue(initialQueue);
      totalCardsRef.current = cardSet.cards.length;
    }
    setGreenCount(0);
    setRedCount(0);
    setIsFlipped(false);
    setShowCelebration(false);
    setIsCompleted(false);
    setShowIntermission(false);
    setReviewCountSinceIntermission(0);
    setStartTime(new Date());
    setEndTime(null);
  };

  if (isLoading) return <div>Loading flashcards...</div>;
  if (error) return <div>Error: {error}</div>;
  if (queue.length === 0 && !isCompleted) return <div>No flashcards found for this set.</div>;

  const masteredCount = totalCardsRef.current - queue.length;
  // overallProgress is not used now since our custom bar is independent.
  const completionTime =
    startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;
  const nextReview =
    cardSet && cardSet.lastReviewed !== undefined
      ? formatDate(getNextReviewTime(cardSet.lastReviewed, cardSet.reviewCount))
      : "N/A";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-3xl">
        {/* Header: Menu button (moved higher) and custom progress bar above the card */}
        <header className="mb-6">
          <div className="flex items-center justify-start mb-2">
            <Button
              onClick={() => (window.location.href = "/cards")}
              aria-label="Return to Menu"
              className="mt-[-20px]"
            >
              <Home className="h-6 w-6" /> Menu
            </Button>
          </div>
          <CustomProgressBar
            greenCount={greenCount}
            redCount={redCount}
            total={totalCardsRef.current}
          />
        </header>

        {/* Flashcard Display or Intermission */}
        {showIntermission ? (
          <div className="relative w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200">
            <h2 className="text-3xl font-bold mb-4">Intermission</h2>
            <p className="text-lg mb-6">Take a short break.</p>
            <Button
              onClick={() => setShowIntermission(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-110"
            >
              Continue
            </Button>
          </div>
        ) : (
          !isCompleted && (
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
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Front Side */}
                <div
                  className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-3xl font-chalk text-gray-800 text-center">
                      {queue[0].question}
                    </p>
                  </div>
                </div>
                {/* Back Side */}
                <div
                  className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
                  style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                  <div className="flex items-center justify-center h-full">
                    <p className="text-3xl font-chalk text-gray-800 text-center">
                      {queue[0].answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          )
        )}

        {isCompleted && (
          <div className="text-center text-2xl font-bold">All cards mastered!</div>
        )}

        {/* Navigation and Control Buttons */}
        {!isCompleted && !showIntermission && queue.length > 0 && (
          <div className="flex justify-around mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevCard}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
              aria-label="Previous card"
            >
              <ChevronLeft className="h-8 w-8 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
              aria-label="Flip card"
            >
              <Repeat className="h-8 w-8 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleGotIt}
              className="bg-green-600 hover:bg-green-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
              disabled={!isFlipped}
              aria-label="Got it"
            >
              <Check className="h-8 w-8 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDidntGetIt}
              className="bg-red-600 hover:bg-red-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
              aria-label="Didn't get it"
            >
              <XCircle className="h-8 w-8 text-white" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextCard}
              className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
              aria-label="Next card"
            >
              <ChevronRight className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}

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
                    aria-label="Return to Menu"
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
