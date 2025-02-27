// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Repeat,
//   Plus,
//   Check,
//   Home,
//   RefreshCw,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type Flashcard = {
//   question: string;
//   answer: string;
// };

// export function MemoFlashcard() {
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([
//     { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
//     { question: "What is the purpose of CSS?", answer: "To style and layout web pages" },
//     { question: "What is JavaScript primarily used for?", answer: "To add interactivity to websites" },
//   ]);
//   const [currentCard, setCurrentCard] = useState(0);
//   const [isFlipped, setIsFlipped] = useState(false);
//   const [newQuestion, setNewQuestion] = useState("");
//   const [newAnswer, setNewAnswer] = useState("");
//   const [showCelebration, setShowCelebration] = useState(false);
//   const [startTime, setStartTime] = useState<Date | null>(null);
//   const [endTime, setEndTime] = useState<Date | null>(null);
//   const [isCompleted, setIsCompleted] = useState(false);

//   // Set the start time when the session begins.
//   useEffect(() => {
//     if (currentCard === 0 && !startTime) {
//       setStartTime(new Date());
//     }
//   }, [currentCard, startTime]);

//   // Enable keyboard navigation: Left/Right for navigation; Up/Down/Space to flip.
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "ArrowRight") {
//         nextCard();
//       } else if (e.key === "ArrowLeft") {
//         prevCard();
//       } else if ((e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") && !isCompleted) {
//         e.preventDefault();
//         setIsFlipped((prev) => !prev);
//       }
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isCompleted, currentCard, flashcards.length]);

//   const nextCard = useCallback(() => {
//     if (currentCard < flashcards.length - 1) {
//       setCurrentCard((prev) => prev + 1);
//       setIsFlipped(false);
//     }
//   }, [currentCard, flashcards.length]);

//   const prevCard = useCallback(() => {
//     if (currentCard > 0) {
//       setCurrentCard((prev) => prev - 1);
//       setIsFlipped(false);
//     }
//   }, [currentCard]);

//   const addCard = () => {
//     if (newQuestion.trim() && newAnswer.trim()) {
//       setFlashcards([...flashcards, { question: newQuestion, answer: newAnswer }]);
//       setNewQuestion("");
//       setNewAnswer("");
//     }
//   };

//   const handleCheckClick = () => {
//     if (currentCard === flashcards.length - 1 && isFlipped && !isCompleted) {
//       setEndTime(new Date());
//       setIsCompleted(true);
//       setShowCelebration(true);
//     }
//   };

//   const resetFlashcards = () => {
//     setCurrentCard(0);
//     setIsFlipped(false);
//     setShowCelebration(false);
//     setIsCompleted(false);
//     setStartTime(new Date());
//     setEndTime(null);
//   };

//   const progress = ((currentCard + 1) / flashcards.length) * 100;
//   const isLastCard = currentCard === flashcards.length - 1;
//   const canCheck = isLastCard && isFlipped && !isCompleted;
//   const completionTime =
//     startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
//       {/* Increased container size for bigger cards */}
//       <div className="w-full max-w-3xl">
//         <Progress value={progress} className="mb-4 transition-all duration-300" />

//         {/* Bigger Flashcard Display */}
//         <div
//           className="relative w-full h-[500px] cursor-pointer"
//           onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
//           style={{ perspective: "2000px" }}
//           aria-label="Flashcard: click to flip"
//         >
//           <motion.div
//             className="relative w-full h-full"
//             initial={false}
//             animate={{ rotateY: isFlipped ? 180 : 0 }}
//             transition={{
//               type: "spring",
//               stiffness: 300,
//               damping: 20,
//             }}
//             style={{ transformStyle: "preserve-3d" }}
//           >
//             {/* Front Side */}
//             <div
//               className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
//               style={{ backfaceVisibility: "hidden" }}
//             >
//               <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
//                 {currentCard + 1} / {flashcards.length}
//               </div>
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-3xl font-chalk text-gray-800 text-center">
//                   {flashcards[currentCard].question}
//                 </p>
//               </div>
//             </div>

//             {/* Back Side */}
//             <div
//               className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg hover:shadow-2xl transition-shadow"
//               style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
//             >
//               <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
//                 {currentCard + 1} / {flashcards.length}
//               </div>
//               <div className="flex items-center justify-center h-full">
//                 <p className="text-3xl font-chalk text-gray-800 text-center">
//                   {flashcards[currentCard].answer}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         {/* Navigation Controls */}
//         <div className="flex justify-between mt-8">
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={prevCard}
//             className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
//             disabled={currentCard === 0 || isCompleted}
//             aria-label="Previous card"
//           >
//             <ChevronLeft className="h-8 w-8 text-white" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={() => !isCompleted && setIsFlipped(!isFlipped)}
//             className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
//             disabled={isCompleted}
//             aria-label="Flip card"
//           >
//             <Repeat className="h-8 w-8 text-white" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={handleCheckClick}
//             className={`border-none rounded-full w-16 h-16 transition-transform hover:scale-110 ${
//               canCheck ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-400"
//             }`}
//             disabled={!canCheck}
//             aria-label="Complete session"
//           >
//             <Check className="h-8 w-8 text-white" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             onClick={nextCard}
//             className="bg-blue-600 hover:bg-blue-700 border-none rounded-full w-16 h-16 transition-transform hover:scale-110"
//             disabled={isLastCard || isCompleted}
//             aria-label="Next card"
//           >
//             <ChevronRight className="h-8 w-8 text-white" />
//           </Button>
//         </div>

//         {/* Add New Card Dialog */}
//         <Dialog>
//           <DialogTrigger asChild>
//             <Button
//               className="w-full mt-8 bg-blue-500 hover:bg-blue-600 text-white"
//               disabled={isCompleted}
//               aria-label="Add new flashcard"
//             >
//               <Plus className="mr-2 h-6 w-6" /> Add New Card
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add New Flashcard</DialogTitle>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="question" className="text-right">
//                   Question
//                 </label>
//                 <Input
//                   id="question"
//                   value={newQuestion}
//                   onChange={(e) => setNewQuestion(e.target.value)}
//                   className="col-span-3"
//                   aria-required="true"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <label htmlFor="answer" className="text-right">
//                   Answer
//                 </label>
//                 <Input
//                   id="answer"
//                   value={newAnswer}
//                   onChange={(e) => setNewAnswer(e.target.value)}
//                   className="col-span-3"
//                   aria-required="true"
//                 />
//               </div>
//             </div>
//             <Button onClick={addCard} disabled={!newQuestion.trim() || !newAnswer.trim()}>
//               Add Card
//             </Button>
//           </DialogContent>
//         </Dialog>

//         {/* Celebratory Modal */}
//         <AnimatePresence>
//           {showCelebration && (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.8 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 0.8 }}
//               className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
//               aria-modal="true"
//               role="dialog"
//             >
//               <div className="bg-white p-8 rounded-lg text-center">
//                 <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
//                 <p className="text-xl mb-6">
//                   You completed the flashcards in {completionTime} seconds!
//                 </p>
//                 <div className="flex justify-center space-x-6">
//                   <Button
//                     onClick={resetFlashcards}
//                     className="bg-blue-500 hover:bg-blue-600 text-white transition-transform hover:scale-110"
//                     aria-label="Redo session"
//                   >
//                     <RefreshCw className="mr-2 h-6 w-6" /> Redo
//                   </Button>
//                   <Button
//                     onClick={() => (window.location.href = "/cards")}
//                     className="bg-green-500 hover:bg-green-600 text-white transition-transform hover:scale-110"
//                     aria-label="Menu"
//                   >
//                     <Home className="mr-2 h-6 w-6" /> Menu
//                   </Button>
//                 </div>
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, Check, XCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Flashcard = {
  question: string;
  answer: string;
};

type FlashcardWithCount = Flashcard & { tickCount: number };

// Initial set of flashcards.
const initialCards: Flashcard[] = [
  { question: "What does HTML stand for?", answer: "HyperText Markup Language" },
  { question: "What is the purpose of CSS?", answer: "To style and layout web pages" },
  { question: "What is JavaScript primarily used for?", answer: "To add interactivity to websites" },
];

export function MemoFlashcard() {
  // The review queue stores each card with a tickCount.
  const [queue, setQueue] = useState<FlashcardWithCount[]>(
    initialCards.map((card) => ({ ...card, tickCount: 0 }))
  );
  // totalCards remains constant (even as cards are requeued).
  const totalCards = useRef(initialCards.length);

  const [isFlipped, setIsFlipped] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Set the start time when the session begins.
  useEffect(() => {
    if (!startTime) {
      setStartTime(new Date());
    }
  }, [startTime]);

  // Keyboard navigation for flipping cards.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "ArrowUp" || e.key === "ArrowDown") && !isCompleted) {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCompleted]);

  // Handler for when the user indicates they "got" the card.
  const handleGotIt = () => {
    if (!isFlipped || queue.length === 0) return;
    const current = queue[0];
    const updatedCount = current.tickCount + 1;
    let newQueue = queue.slice(1);
    if (updatedCount < 2) {
      // If the card isn’t mastered yet, update its tickCount and requeue it.
      newQueue.push({ ...current, tickCount: updatedCount });
    }
    setQueue(newQueue);
    setIsFlipped(false);
    // Session is complete when all cards are mastered.
    if (newQueue.length === 0) {
      setEndTime(new Date());
      setIsCompleted(true);
      setShowCelebration(true);
    }
  };

  // Handler for when the user indicates they didn't get the card.
  const handleDidntGetIt = () => {
    if (queue.length === 0) return;
    // Requeue the current card without incrementing tickCount.
    const current = queue[0];
    const newQueue = queue.slice(1).concat(current);
    setQueue(newQueue);
    setIsFlipped(false);
  };

  // Reset the session.
  const resetFlashcards = () => {
    setQueue(initialCards.map((card) => ({ ...card, tickCount: 0 })));
    setIsFlipped(false);
    setShowCelebration(false);
    setIsCompleted(false);
    setStartTime(new Date());
    setEndTime(null);
  };

  // Progress is measured by how many cards have been mastered.
  const masteredCount = totalCards.current - queue.length;
  const progress = (masteredCount / totalCards.current) * 100;
  const completionTime =
    startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : 0;

  // For adding new cards during the session.
  const addCard = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      const newCard = { question: newQuestion, answer: newAnswer, tickCount: 0 };
      setQueue((prev) => [...prev, newCard]);
      totalCards.current += 1;
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-3xl">
        {/* Top bar with progress and Return to Menu */}
        <div className="flex justify-between items-center mb-4">
          <Progress value={progress} className="w-2/3 transition-all duration-300" />
          <Button onClick={() => (window.location.href = "/cards")} aria-label="Return to Menu" className="ml-4">
            <Home className="h-6 w-6" /> Menu
          </Button>
        </div>

        {/* Flashcard Display */}
        {queue.length > 0 ? (
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
                className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg transition-shadow"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
                  {masteredCount} / {totalCards.current} mastered
                </div>
                <div className="flex items-center justify-center h-full">
                  <p className="text-3xl font-chalk text-gray-800 text-center">
                    {queue[0].question}
                  </p>
                </div>
              </div>
              {/* Back Side */}
              <div
                className="absolute inset-0 bg-white rounded-lg p-8 border-2 border-gray-200 shadow-lg transition-shadow"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="absolute top-4 left-4 bg-blue-100 px-4 py-2 rounded-full text-lg font-semibold text-blue-800">
                  {masteredCount} / {totalCards.current} mastered
                </div>
                <div className="flex items-center justify-center h-full">
                  <p className="text-3xl font-chalk text-gray-800 text-center">
                    {queue[0].answer}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="text-center text-2xl font-bold">All cards mastered!</div>
        )}

        {/* Control Buttons */}
        {!isCompleted && queue.length > 0 && (
          <div className="flex justify-around mt-8">
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
              + Add New Card
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
                <p className="text-xl mb-6">
                  You completed the review in {completionTime} seconds!
                </p>
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
}
