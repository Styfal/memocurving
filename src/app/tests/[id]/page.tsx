"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { NextPage } from "next";

type Question = {
  id: number;
  question: string;
  // We use the saved correctAnswer as the answer for checking purposes.
  answer: string;
  options?: string[];
};

type TestPageProps = {
  params: {
    id: string;
  };
};

const TestPage: NextPage<TestPageProps> = ({ params }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Object to store the user's answers (mapping question id => answer string)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  // When submitted, we calculate the score
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Fetch the test document from Firestore and map its questions to our structure.
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setIsLoading(true);
        const docRef = doc(db, "tests", params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || "");
          setDescription(data.description || "");
          // Map each fetched question to our structure.
          const fetchedQuestions: Question[] = (data.questions || []).map((q: any, index: number) => ({
            id: index, // Using the array index as an ID (ideally, each question would have a unique id)
            question: q.question,
            answer: q.correctAnswer, // Map the correctAnswer to the answer property.
            options: q.options,
          }));
          setQuestions(fetchedQuestions);
        } else {
          throw new Error("No such test found");
        }
      } catch (err) {
        console.error("Error fetching test:", err);
        setError("Failed to load test");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTest();
  }, [params.id]);

  // Handler for answer change.
  const handleAnswerChange = (questionId: number, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Submit the test and calculate the score.
  const handleSubmit = useCallback(() => {
    let newScore = 0;
    questions.forEach((q) => {
      const userAns = (userAnswers[q.id] || "").trim().toLowerCase();
      const correctAns = (q.answer || "").trim().toLowerCase();
      if (userAns === correctAns) {
        newScore++;
      }
    });
    setScore(newScore);
    setSubmitted(true);
  }, [questions, userAnswers]);

  // Reset the test so the user can try again.
  const resetTest = () => {
    setUserAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  // Listen for Enter key to submit the test (only if not yet submitted).
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Enter key is pressed.
      if (e.key === "Enter" && !submitted) {
        // Optionally, you can check if the focused element is not a textarea,
        // so that the Enter key does not break line in text inputs.
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")) {
          // If you don't want Enter to submit when focus is in an input/textarea,
          // you can return early.
          // For now, we'll let Enter submit regardless.
        }
        e.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [submitted, handleSubmit]);

  if (isLoading) {
    return <div>Loading test...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }
  if (questions.length === 0) {
    return <div>No questions found for this test.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p className="text-lg">{description}</p>
      </header>

      <div className="space-y-6">
        {questions.map((q, index) => (
          <Card key={q.id} className="p-4">
            <CardContent>
              <div className="mb-2">
                <span className="font-bold">Question {index + 1}:</span> {q.question}
              </div>

              {q.options && q.options.length > 0 ? (
                // MCQ: Render a RadioGroup for options.
                <RadioGroup
                  value={userAnswers[q.id] || ""}
                  onValueChange={(val) => handleAnswerChange(q.id, val)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center">
                      <RadioGroupItem
                        value={option}
                        id={`q-${q.id}-option-${i}`}
                        className="peer"  // ensure radio buttons are visible and clickable.
                      />
                      <Label htmlFor={`q-${q.id}-option-${i}`} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                // Short Answer: Render an Input box.
                <Input
                  value={userAnswers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                  placeholder="Type your answer here"
                />
              )}

              {/* When submitted, show per-question feedback */}
              {submitted && (
                <div className="mt-2 text-sm font-semibold">
                  {(userAnswers[q.id] || "").trim().toLowerCase() === (q.answer || "").trim().toLowerCase() ? (
                    <span className="text-green-600">Correct</span>
                  ) : (
                    <span className="text-red-600">
                      Incorrect. Correct answer: {q.answer || "N/A"}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        {!submitted ? (
          <Button onClick={handleSubmit}>Submit Test</Button>
        ) : (
          <>
            <div className="text-xl font-bold">
              Your Score: {score} / {questions.length}
            </div>
            <Button variant="secondary" onClick={resetTest}>
              Redo Test
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TestPage;
