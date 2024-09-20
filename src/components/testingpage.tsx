"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, RotateCcw, Check, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type Flashcard = {
  id: number
  question: string
  answer: string
  options?: string[]
  answered: boolean
  redoUsed: boolean
}

export default function TestPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { 
      id: 1,
      question: "What does HTML stand for?", 
      answer: "HyperText Markup Language",
      options: ["HyperText Markup Language", "HighTech Modern Language", "HyperTransfer Markup Language", "HyperText Management Language"],
      answered: false,
      redoUsed: false
    },
    { 
      id: 2,
      question: "What is the purpose of CSS?", 
      answer: "To style and layout web pages",
      answered: false,
      redoUsed: false
    },
    { 
      id: 3,
      question: "What is JavaScript primarily used for?", 
      answer: "To add interactivity to websites",
      options: ["To style web pages", "To add interactivity to websites", "To create database structures", "To manage server configurations"],
      answered: false,
      redoUsed: false
    },
  ])
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [endTime, setEndTime] = useState<Date | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [answerStatus, setAnswerStatus] = useState<"correct" | "incorrect" | "already_answered" | "flipped_before_answer" | null>(null)
  const [showScoreAnimation, setShowScoreAnimation] = useState(false)
  const [showZeroAnimation, setShowZeroAnimation] = useState(false)
  const [incorrectQuestions, setIncorrectQuestions] = useState<Flashcard[]>([])
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (currentCard === 0 && !startTime) {
      setStartTime(new Date())
    }
  }, [currentCard, startTime])

  const nextCard = useCallback(() => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard((prev) => prev + 1)
      setIsFlipped(false)
      setUserAnswer("")
      setAnswerStatus(null)
    }
  }, [currentCard, flashcards.length])

  const prevCard = useCallback(() => {
    if (currentCard > 0) {
      setCurrentCard((prev) => prev - 1)
      setIsFlipped(false)
      setUserAnswer("")
      setAnswerStatus(null)
    }
  }, [currentCard])

  const flipCard = useCallback(() => {
    if (!isCompleted) {
      if (!isFlipped && !userAnswer) {
        setAnswerStatus("flipped_before_answer")
        setShowZeroAnimation(true)
        setTimeout(() => setShowZeroAnimation(false), 1000)
      }
      setIsFlipped(!isFlipped)
    }
  }, [isCompleted, isFlipped, userAnswer])

  const handleCheckAnswer = () => {
    const currentFlashcard = flashcards[currentCard]
    if (!isFlipped) {
      setIsFlipped(true)
      if (currentFlashcard.answered) {
        setAnswerStatus("already_answered")
      } else if (userAnswer.toLowerCase() === currentFlashcard.answer.toLowerCase()) {
        setScore((prevScore) => prevScore + 1)
        setAnswerStatus("correct")
        setShowScoreAnimation(true)
        setTimeout(() => setShowScoreAnimation(false), 1000)
        setFlashcards(cards => cards.map((card, index) => 
          index === currentCard ? { ...card, answered: true } : card
        ))
      } else {
        setAnswerStatus("incorrect")
        setShowZeroAnimation(true)
        setTimeout(() => setShowZeroAnimation(false), 1000)
        setIncorrectQuestions((prev) => {
          if (!prev.some(q => q.id === currentFlashcard.id)) {
            return [...prev, currentFlashcard]
          }
          return prev
        })
        setFlashcards(cards => cards.map((card, index) => 
          index === currentCard ? { ...card, answered: true } : card
        ))
      }
    } else {
      if (currentCard === flashcards.length - 1 && !isCompleted) {
        setShowCompletionDialog(true)
      } else {
        nextCard()
      }
    }
  }

  const handleCompleteTest = () => {
    setEndTime(new Date())
    setIsCompleted(true)
    setShowCelebration(true)
    setShowCompletionDialog(false)
  }

  const resetFlashcards = () => {
    setFlashcards(cards => cards.map(card => ({ ...card, answered: false, redoUsed: false })))
    setCurrentCard(0)
    setIsFlipped(false)
    setShowCelebration(false)
    setIsCompleted(false)
    setStartTime(new Date())
    setEndTime(null)
    setScore(0)
    setUserAnswer("")
    setAnswerStatus(null)
    setIncorrectQuestions([])
    setShowCompletionDialog(false)
  }

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (document.activeElement !== inputRef.current) {
      if (event.key === "ArrowLeft") {
        prevCard()
      } else if (event.key === "ArrowRight") {
        nextCard()
      } else if (event.key === " ") {
        flipCard()
      }
    }
  }, [prevCard, nextCard, flipCard])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  const handleRedo = () => {
    if (!flashcards[currentCard].redoUsed) {
      setIsFlipped(false)
      setUserAnswer("")
      setAnswerStatus(null)
      setFlashcards(cards => cards.map((card, index) => 
        index === currentCard ? { ...card, redoUsed: true, answered: false } : card
      ))
    }
  }

  const progress = ((currentCard + 1) / flashcards.length) * 100

  const completionTime = startTime && endTime
    ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000)
    : 0

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-between mb-4 items-center">
          <Progress value={progress} className="w-3/4" />
          <div className="text-xl font-bold flex items-center">
            <div className="w-24 text-right">Score: {score}</div>
            <div className="w-12 h-8 relative">
              <AnimatePresence>
                {showScoreAnimation && (
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 text-green-500"
                  >
                    +1
                  </motion.span>
                )}
                {showZeroAnimation && (
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute right-0 text-orange-500"
                  >
                    +0
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <div className="relative w-full aspect-[4/3] cursor-pointer mb-4 transition-transform duration-300 hover:scale-105" onClick={flipCard}>
            <motion.div
              className="relative w-full h-full"
              initial={false}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div
                className="absolute inset-0 bg-card rounded-lg p-6 border-2 border-border shadow-lg flex items-center justify-center"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute top-2 left-2 bg-primary/10 px-3 py-1 rounded-full text-sm font-semibold text-primary">
                  {currentCard + 1} / {flashcards.length}
                </div>
                <p className="text-2xl font-bold text-center">
                  {flashcards[currentCard].question}
                </p>
              </div>

              <div
                className="absolute inset-0 bg-card rounded-lg p-6 border-2 border-border shadow-lg flex items-center justify-center"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                <div className="absolute top-2 left-2 bg-primary/10 px-3 py-1 rounded-full text-sm font-semibold text-primary">
                  {currentCard + 1} / {flashcards.length}
                </div>
                <p className="text-2xl font-bold text-center">
                  {flashcards[currentCard].answer}
                </p>
              </div>
            </motion.div>
          </div>

          {flashcards[currentCard].options ? (
            <RadioGroup value={userAnswer} onValueChange={setUserAnswer} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {flashcards[currentCard].options.map((option, index) => (
                <div key={index} className="flex items-center">
                  <RadioGroupItem value={option} id={`option-${index}`} className="peer sr-only" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex flex-col items-center justify-center w-full p-4 bg-popover text-popover-foreground rounded-lg border-2 border-muted cursor-pointer hover:bg-accent 
                    hover:text-accent-foreground peer-data-[state=checked]:border-primary transition-transform duration-300 hover:scale-105"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <Input
              ref={inputRef}
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer here"
              className="w-full transition-transform duration-300 hover:scale-105"
            />
          )}
        </div>

        <AnimatePresence>
          {answerStatus && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`mb-4 p-4 rounded-lg text-center font-bold ${
                answerStatus === "correct" ? "bg-green-500 text-white" : 
                answerStatus === "incorrect" ? "bg-red-500 text-white" :
                answerStatus === "flipped_before_answer" ? "bg-orange-500 text-white" :
                "bg-yellow-500 text-white"
              }`}
            >
              {answerStatus === "correct" ? "Correct!" : 
               answerStatus === "incorrect" ? "Incorrect. Try again!" :
               answerStatus === "already_answered" ? "You already answered this question!" :
               "You will not be awarded points because you flipped before answering!"}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={prevCard}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12"
            disabled={currentCard === 0 || isCompleted}
          >
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">Previous card</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleRedo}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12"
            disabled={isCompleted || flashcards[currentCard].redoUsed}
          >
            <RotateCcw className="h-6 w-6" />
            <span className="sr-only">Try again</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCheckAnswer}
            className={`${
              currentCard === flashcards.length - 1 && isFlipped
                ? "bg-green-500 hover:bg-green-600"
                : "bg-primary hover:bg-primary/90"
            } text-primary-foreground rounded-full w-12 h-12`}
            disabled={isCompleted || (!isFlipped && !userAnswer)}
          >
            <Check className="h-6 w-6" />
            <span className="sr-only">Check</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextCard}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-12 h-12"
            disabled={currentCard === flashcards.length - 1 || isCompleted}
          >
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">Next card</span>
          </Button>
        </div>

        <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete the Test</DialogTitle>
              <DialogDescription>
                You've reached the end of the flashcards. Are you ready to complete the test?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button onClick={handleCompleteTest}>Complete Test</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-50"
            >
              <Card className="p-8 text-center max-w-md w-full">
                <CardContent>
                  <h2 className="text-3xl font-bold mb-4">Congratulations!</h2>
                  <div className="space-y-4 text-left mb-6">
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-semibold">Time taken:</span>
                      <span>{completionTime} seconds</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-semibold">Questions correct:</span>
                      <span>{score}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-semibold">Incorrect questions:</span>
                      <span>{incorrectQuestions.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                      <span className="font-semibold">Total Score:</span>
                      <span>{score} / {flashcards.length}</span>
                    </div>
                    {incorrectQuestions.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold mb-2">Questions to improve:</p>
                        <ul className="list-disc list-inside bg-primary/10 rounded-lg p-3">
                          {incorrectQuestions.map((q) => (
                            <li key={q.id} className="mb-1">{q.question}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button onClick={resetFlashcards} className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <RefreshCw className="mr-2 h-4 w-4" /> Redo
                    </Button>
                    <Button onClick={() => window.location.href = '/'} className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                      <Home className="mr-2 h-4 w-4" /> Home
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}