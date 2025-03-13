

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Helper: Calculate the next review time based on the last review timestamp and the review count.
const getNextReviewTime = (lastReviewed: number, reviewCount: number): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  // If never reviewed, schedule for tomorrow.
  if (lastReviewed === 0) return Date.now() + msPerDay;
  return lastReviewed + (reviewCount + 1) * msPerDay;
};

export function Courses() {
  // User and cardset state.
  const [user, loading, error] = useAuthState(auth);
  const [userCardsets, setUserCardsets] = useState<any[]>([]);
  const [testedDecks, setTestedDecks] = useState<string[]>([]);
  const router = useRouter();

  // Modal states.
  const [showTestOptions, setShowTestOptions] = useState(false);
  const [selectedCardset, setSelectedCardset] = useState<any>(null);

  // States for editing a cardset.
  const [editingCardset, setEditingCardset] = useState<any | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCards, setEditedCards] = useState<any[]>([]);
  const [editingIndices, setEditingIndices] = useState<number[]>([]);

  // State for flag color (left marker) for each cardset.
  const [flagColors, setFlagColors] = useState<{ [id: string]: string }>({});

  // Cycle the flag color for a given cardset.
  const cycleFlag = (id: string) => {
    const current = flagColors[id] || "";
    let next = "";
    if (current === "") {
      next = "green";
    } else if (current === "green") {
      next = "yellow";
    } else if (current === "yellow") {
      next = "red";
    } else if (current === "red") {
      next = "";
    }
    setFlagColors((prev) => ({ ...prev, [id]: next }));
  };

  // Updated helper: Safely truncate text to a maximum number of words.
  function truncate(text: unknown, maxWords: number): string {
    const str = typeof text === "string" ? text : "";
    const words = str.split(/\s+/).filter(Boolean);
    return words.length > maxWords ? words.slice(0, maxWords).join(" ") : str;
  }

  // Helper: Normalize strings for comparison.
  const normalize = (str: string) => str.trim().toLowerCase();

  // Helper: Shuffle an array.
  const shuffleArray = (arr: any[]): any[] => {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Improved MCQ normalization function.
  const fixMCQQuestions = (questions: any[]): any[] => {
    return questions.map((q) => {
      if (q.type === "mcq") {
        let options = Array.isArray(q.options) ? q.options : [];
        const normCorrect = normalize(q.correctAnswer);
        options = options.map(normalize);
        if (!options.includes(normCorrect)) {
          console.warn(`MCQ question missing correct answer in options: "${q.question}"`);
          options.push(normCorrect);
        }
        options = Array.from(new Set(options));
        if (options.length > 4) {
          if (!options.slice(0, 4).includes(normCorrect)) {
            options[3] = normCorrect;
          }
          options = options.slice(0, 4);
        } else if (options.length < 4) {
          while (options.length < 4) {
            options.push("n/a");
          }
        }
        return { ...q, correctAnswer: normCorrect, options };
      }
      return q;
    });
  };

  // New helper: For all questions, fix missing correctAnswer in short-answer questions.
  const fixAllQuestions = (questions: any[]): any[] => {
    return questions.map((q) => {
      if (q.type === "mcq") {
        return fixMCQQuestions([q])[0];
      } else if (q.type === "short-answer") {
        return { ...q, correctAnswer: q.correctAnswer ?? "n/a" };
      }
      return q;
    });
  };

  // Fetch the user's cardsets.
  useEffect(() => {
    if (user) {
      const fetchCardsets = async () => {
        const q = query(collection(db, "cardSets"), where("createdBy.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const cardsets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserCardsets(cardsets);
      };
      fetchCardsets();
    }
  }, [user]);

  // Delete a flashcard deck.
  const handleDelete = async (cardsetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const confirmDelete = confirm("Are you sure you want to delete this flashcard deck?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/cardsets/${cardsetId}`, { method: "DELETE" });
      const result = await response.json();
      if (result.success) {
        setUserCardsets((prev) => prev.filter((cs) => cs.id !== cardsetId));
        setTestedDecks((prev) => prev.filter((id) => id !== cardsetId));
      } else {
        alert("Failed to delete flashcard deck: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting flashcard deck:", error);
      alert("An error occurred while deleting the flashcard deck.");
    }
  };

  // Opens the test options modal and stores the selected cardset.
  const openTestOptions = (cardset: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (testedDecks.includes(cardset.id)) return;
    setSelectedCardset(cardset);
    setShowTestOptions(true);
  };

  // Creates a basic test using flashcard content only.
  const createBasicTest = async (cardset: any) => {
    const allCards = cardset.cards || [];
    const validCards = allCards.filter((card: any) => card.question && card.answer);
    let selectedCards: any[] = [];
    if (validCards.length >= 15) {
      selectedCards = shuffleArray(validCards).slice(0, 15);
    } else {
      selectedCards = [...validCards];
      while (selectedCards.length < 15 && validCards.length > 0) {
        selectedCards.push(validCards[Math.floor(Math.random() * validCards.length)]);
      }
    }
    const questions = selectedCards.map((card: any) => {
      const questionText = truncate(card.question, 30);
      const answerText = truncate(card.answer, 50);
      const isMCQ = Math.random() < 0.5;
      if (isMCQ) {
        const otherAnswers = validCards
          .filter((c: any) => c.answer !== card.answer)
          .map((c: any) => truncate(c.answer, 50));
        const wrongOptions = shuffleArray(otherAnswers).slice(0, 3);
        while (wrongOptions.length < 3) {
          wrongOptions.push("n/a");
        }
        const options = shuffleArray([answerText, ...wrongOptions]);
        return {
          type: "mcq",
          question: questionText,
          correctAnswer: answerText,
          options,
        };
      } else {
        return {
          type: "short-answer",
          question: questionText,
          correctAnswer: answerText,
        };
      }
    });

    const fixedQuestions = fixMCQQuestions(questions);
    const requestData = {
      title: truncate(cardset.title, 10),
      description: truncate(cardset.description, 50),
      questions: fixedQuestions,
      createdAt: new Date().toISOString(),
      userId: user ? user.uid : "unknown",
    };

    console.log("Sending payload to /api/tests (Basic):", JSON.stringify(requestData, null, 2));

    try {
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setTestedDecks((prev) => [...prev, cardset.id]);
        router.push(`/tests/${result.data.id}`);
      } else {
        alert("Failed to create test: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating basic test:", error);
      alert("An error occurred while creating the test.");
    }
  };

  // Helper: Extract JSON between BEGIN_JSON and END_JSON markers.
  function extractJsonFromMarkers(str: string): string | null {
    const beginMarker = "BEGIN_JSON";
    const endMarker = "END_JSON";
    const startIndex = str.indexOf(beginMarker);
    const endIndex = str.lastIndexOf(endMarker);
    if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
      return str.substring(startIndex + beginMarker.length, endIndex).trim();
    }
    return null;
  }

  // Creates an AI-enhanced test using OpenAI.
  const createAITest = async (cardset: any) => {
    const prompt = `
You are a distinguished professor preparing an exam. Based on the following syllabus details, generate exactly 15 exam questions that progressively increase in difficulty.

Syllabus Title: ${cardset.title}
Syllabus Description: ${cardset.description}
Key Concepts (from flashcards):
${cardset.cards
  .map((card: any, index: number) => `${index + 1}. Q: ${card.question} | A: ${card.answer}`)
  .join("\n")}

Your exam should be a mix of short answer and multiple choice (MCQ) questions. For MCQs, provide 4 options with one correct answer.
Output exactly one line that contains only a valid, minified JSON string wrapped by the markers as follows:
BEGIN_JSON{"questions":[{"type":"mcq"|"short-answer","question":"<question text>","correctAnswer":"<correct answer>","options":["option1","option2","option3","option4"]}, ...]}END_JSON

Do not include any additional text.
`;

    try {
      // Notice the addition of userId in the request body.
      const aiResponse = await fetch("/api/ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId: user ? user.uid : "unknown" }),
      });
      const aiResult = await aiResponse.json();
      console.log("AI Response:", aiResult);

      const aiContent = aiResult.choices?.[0]?.message?.content;
      if (!aiContent) {
        alert("Failed to generate test questions from OpenAI.");
        return;
      }
      let cleanedContent = aiContent.trim();
      if (cleanedContent.startsWith("```")) {
        cleanedContent = cleanedContent.replace(/```(json)?/gi, "").trim();
      }
      console.log("Cleaned AI Content:", cleanedContent);

      const jsonString = extractJsonFromMarkers(cleanedContent);
      console.log("Extracted JSON string:", jsonString);
      if (!jsonString) {
        console.error("No JSON object found between markers.");
        alert("Received an invalid response from OpenAI.");
        return;
      }

      let testQuestions;
      try {
        const parsed = JSON.parse(jsonString);
        testQuestions = parsed.questions;
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        alert("Received an invalid JSON response from OpenAI.");
        return;
      }

      const fixedQuestions = fixAllQuestions(testQuestions);
      const requestData = {
        title: truncate(cardset.title, 10),
        description: truncate(cardset.description, 50),
        questions: fixedQuestions,
        createdAt: new Date().toISOString(),
        userId: user ? user.uid : "unknown",
      };

      console.log("Sending payload to /api/tests (AI):", JSON.stringify(requestData, null, 2));

      const response = await fetch("/api/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setTestedDecks((prev) => [...prev, cardset.id]);
        router.push(`/tests/${result.data.id}`);
      } else {
        alert("Failed to create test: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating AI test:", error);
      alert("An error occurred while creating the test.");
    }
  };

  // Open the edit modal for a cardset.
  const openEditModal = (cardset: any) => {
    setEditingCardset(cardset);
    setEditedTitle(cardset.title);
    setEditedDescription(cardset.description);
    setEditedCards(cardset.cards ? [...cardset.cards] : []);
    setEditingIndices([]);
  };

  // Update a card’s content.
  const handleCardChange = (index: number, field: "question" | "answer", value: string) => {
    setEditedCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove a card.
  const handleRemoveCard = (index: number) => {
    setEditedCards((prev) => prev.filter((_, i) => i !== index));
    setEditingIndices((prev) => prev.filter((i) => i !== index));
  };

  // Save changes to a cardset.
  const handleSaveChanges = async () => {
    if (!editingCardset) return;
    try {
      const requestData = {
        title: editedTitle,
        description: editedDescription,
        cards: editedCards,
      };
      const response = await fetch(`/api/cardsets/${editingCardset.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (result.success) {
        setUserCardsets((prev) =>
          prev.map((cs) =>
            cs.id === editingCardset.id
              ? { ...cs, title: editedTitle, description: editedDescription, cards: editedCards }
              : cs
          )
        );
        setEditingCardset(null);
      } else {
        alert("Failed to update flashcard deck: " + result.error);
      }
    } catch (error) {
      console.error("Error updating flashcard deck:", error);
      alert("An error occurred while updating the flashcard deck.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <header className="py-6 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <Image
              src="/memocurvelogo.svg"
              alt="MemoCurve Logo"
              width={250}
              height={160}
              className="h-40 w-auto"
            />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-[#0D005B] text-white px-2">Practice</span> Flashcards
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-6 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Flashcard Decks</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCardsets.length > 0 ? (
                userCardsets.map((cardset) => {
                  // Define today's start and end timestamps.
                  const todayStart = new Date();
                  todayStart.setHours(0, 0, 0, 0);
                  const todayEnd = new Date();
                  todayEnd.setHours(23, 59, 59, 999);
                  // Calculate next review time.
                  const nextReview = getNextReviewTime(cardset.lastReviewed, cardset.reviewCount);
                  // Determine review marker color for right marker.
                  let reviewMarkerColor = "";
                  if (nextReview >= todayStart.getTime() && nextReview <= todayEnd.getTime()) {
                    reviewMarkerColor = "green";
                  } else if (nextReview < todayStart.getTime()) {
                    reviewMarkerColor = "red";
                  }
                  return (
                    <div
                      key={cardset.id}
                      className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col w-80 h-48"
                      onClick={() => cycleFlag(cardset.id)}
                    >
                      {/* Left flag marker */}
                      <div
                        className="absolute top-0 left-0 h-full w-1"
                        style={{ backgroundColor: flagColors[cardset.id] || "transparent" }}
                      />
                      {/* Right review marker */}
                      {reviewMarkerColor && (
                        <div
                          className={`absolute top-0 right-0 h-full w-1 ${
                            reviewMarkerColor === "green" ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(cardset.id, e);
                        }}
                        className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                        title="Delete Flashcard Deck"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      <div className="p-6 bg-background flex flex-col h-full">
                        <h3 className="text-xl font-bold">{cardset.title}</h3>
                        <p className="text-muted-foreground mt-2">{cardset.description}</p>
                        <div className="flex space-x-2 mt-auto">
                          <Link href={`/cards/${cardset.id}`}>
                            <Button size="sm" onClick={(e) => e.stopPropagation()}>
                              Start
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTestOptions(cardset, e);
                            }}
                            disabled={testedDecks.includes(cardset.id)}
                          >
                            {testedDecks.includes(cardset.id) ? "Test Created" : "Create Test"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditModal(cardset);
                            }}
                          >
                            Edit Cards
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No flashcard decks available.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Modal: Test Options */}
      {showTestOptions && selectedCardset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowTestOptions(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              title="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Select Test Type</h2>
            <p className="mb-4">Choose the test option you’d like to create:</p>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => {
                  setShowTestOptions(false);
                  createBasicTest(selectedCardset);
                }}
              >
                Basic Test (Free)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowTestOptions(false);
                  createAITest(selectedCardset);
                }}
              >
                AI‑Enhanced Test (Premium)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Cardset */}
      {editingCardset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setEditingCardset(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              title="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Flashcard Deck</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Deck Title</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Deck Description</label>
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                ></textarea>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Flashcards</h3>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {editedCards.length > 0 ? (
                  editedCards.map((card, index) => (
                    <div key={index} className="border rounded p-4">
                      {editingIndices.includes(index) ? (
                        <div>
                          <input
                            type="text"
                            placeholder="Question"
                            value={card.question}
                            onChange={(e) => handleCardChange(index, "question", e.target.value)}
                            className="w-full p-2 border rounded mb-2 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Answer"
                            value={card.answer}
                            onChange={(e) => handleCardChange(index, "answer", e.target.value)}
                            className="w-full p-2 border rounded mb-2 bg-white"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => setEditingIndices((prev) => prev.filter((i) => i !== index))}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setEditingIndices((prev) => prev.filter((i) => i !== index))}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold">Q: {card.question}</p>
                            <p className="text-sm text-muted-foreground">A: {card.answer}</p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingIndices((prev) => [...prev, index])}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveCard(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No cards in this deck.</p>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <Button
                  size="sm"
                  onClick={() => {
                    const newCard = { question: "", answer: "", image: null };
                    setEditedCards((prev) => [...prev, newCard]);
                    setEditingIndices((prev) => [...prev, editedCards.length]);
                  }}
                >
                  Add Card
                </Button>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button size="sm" variant="outline" onClick={() => setEditingCardset(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;
