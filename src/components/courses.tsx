import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function Courses() {
  // Track the current user
  const [user, loading, error] = useAuthState(auth);
  const [userCardsets, setUserCardsets] = useState<any[]>([]);
  // Track which decks have already been used to create a test.
  const [testedDecks, setTestedDecks] = useState<string[]>([]);
  const router = useRouter();

  // State to control the "View More" modal popup
  const [showAllModal, setShowAllModal] = useState(false);

  // States for editing flashcards and deck details within a cardset:
  const [editingCardset, setEditingCardset] = useState<any | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCards, setEditedCards] = useState<any[]>([]);
  // Tracks which card rows are in “edit mode” (by index)
  const [editingIndices, setEditingIndices] = useState<number[]>([]);

  // Fetch the cardsets created by the current user (using createdBy.uid)
  useEffect(() => {
    if (user) {
      const fetchCardsets = async () => {
        const q = query(
          collection(db, "cardSets"),
          where("createdBy.uid", "==", user.uid)
        );
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

  // Handler for deleting an entire flashcard deck.
  const handleDelete = async (cardsetId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete this flashcard deck?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/cardsets/${cardsetId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setUserCardsets((prev) => prev.filter((cardset) => cardset.id !== cardsetId));
        // Remove from testedDecks if needed.
        setTestedDecks((prev) => prev.filter((id) => id !== cardsetId));
      } else {
        alert("Failed to delete flashcard deck: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting flashcard deck:", error);
      alert("An error occurred while deleting the flashcard deck.");
    }
  };

  // Modified handler for creating a test using the OpenAI API.
  const handleCreateTest = async (cardset: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (testedDecks.includes(cardset.id)) return;

    // Updated prompt with explicit markers.
    const prompt = `
You are an expert quiz generator. Given the following flashcard deck details:

Title: ${cardset.title}
Description: ${cardset.description}
Flashcards:
${cardset.cards
  .map((card: any, index: number) => `${index + 1}. Q: ${card.question} | A: ${card.answer}`)
  .join("\n")}

Generate a test consisting of exactly 15 questions that include a random mix of short answer and multiple choice (MCQ) questions in random order. Ensure:
- The questions are on the topic of the flashcards.
- The difficulty increases as the test progresses.
- For MCQ questions, include 4 options with one correct answer.

Do not include any text besides the JSON output.
Please output your result in the following format (all on one line):

BEGIN_JSON{"questions":[{"type":"mcq"|"short-answer","question":"<question text>","correctAnswer":"<correct answer>","options":["option1","option2","option3","option4"]}, ...]}END_JSON
`;

    try {
      const aiResponse = await fetch("/api/ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
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

      // Use the markers to extract the JSON substring.
      const jsonString = extractJsonFromMarkers(cleanedContent);
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

      // Fix any MCQ question that doesn't have its correct answer in the options.
      const fixedQuestions = testQuestions.map((q: any) => {
        if (q.type === "mcq" && !q.options.includes(q.correctAnswer)) {
          console.warn(`MCQ question missing correct answer in options: "${q.question}"`);
          let newOptions = [...q.options, q.correctAnswer];
          newOptions = Array.from(new Set(newOptions));
          if (newOptions.length > 4) {
            if (!newOptions.slice(0, 4).includes(q.correctAnswer)) {
              newOptions[3] = q.correctAnswer;
            }
            newOptions = newOptions.slice(0, 4);
          } else if (newOptions.length < 4) {
            while (newOptions.length < 4) {
              newOptions.push("N/A");
            }
          }
          return { ...q, options: newOptions };
        }
        return q;
      });

      console.log("Fixed Questions:", fixedQuestions);

      const requestData = {
        title: cardset.title,
        description: cardset.description,
        questions: fixedQuestions,
        createdAt: new Date().toISOString(),
        userId: user ? user.uid : "unknown",
      };

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
      console.error("Error creating test:", error);
      alert("An error occurred while creating the test.");
    }
  };

  // Open the edit modal for a specific cardset.
  const openEditModal = (cardset: any) => {
    setEditingCardset(cardset);
    setEditedTitle(cardset.title);
    setEditedDescription(cardset.description);
    setEditedCards(cardset.cards ? [...cardset.cards] : []);
    setEditingIndices([]);
  };

  // Update a card’s content in the editedCards state.
  const handleCardChange = (index: number, field: "question" | "answer", value: string) => {
    setEditedCards((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Remove a card from the editedCards array.
  const handleRemoveCard = (index: number) => {
    setEditedCards((prev) => prev.filter((_, i) => i !== index));
    setEditingIndices((prev) => prev.filter((i) => i !== index));
  };

  // Save the changes made in the modal (deck details and cards) to the backend.
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
      {/* Header with Logo */}
      <header className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto flex flex-col items-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <img src="/textless-logo.svg" alt="MemoCurve Logo" className="h-80 w-auto" />
          </div>
          {/* Title & Subheading */}
          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-cyan-500 text-white px-2">Explore</span> Flashcards
            </h1>
            <p className="text-muted-foreground md:text-xl">Start Studying Efficiently</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Flashcard Decks</h2>
              <Button variant="link" className="text-primary" onClick={() => setShowAllModal(true)}>
                View More
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCardsets.length > 0 ? (
                userCardsets.slice(0, 6).map((cardset) => (
                  <div
                    key={cardset.id}
                    className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
                  >
                    <Link href={`/cards/${cardset.id}`} prefetch={false}>
                      <img
                        src={cardset.imageUrl || "/placeholder.svg"}
                        alt={cardset.title}
                        width={600}
                        height={300}
                        className="object-cover w-full h-48"
                        style={{ aspectRatio: "600/300", objectFit: "cover" }}
                      />
                    </Link>
                    <button
                      onClick={(e) => handleDelete(cardset.id, e)}
                      className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                      title="Delete Flashcard Deck"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <div className="p-6 bg-background">
                      <h3 className="text-xl font-bold">{cardset.title}</h3>
                      <p className="text-muted-foreground mt-2">{cardset.description}</p>
                      <div className="flex space-x-2 mt-4">
                        <Link href={`/cards/${cardset.id}`}>
                          <Button size="sm">Start</Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleCreateTest(cardset, e)}
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
                ))
              ) : (
                <p>No flashcard decks available.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* View More Modal for All Decks */}
      {showAllModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
            <button
              onClick={() => setShowAllModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              title="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">All Your Flashcard Decks</h2>
            <div className="space-y-4">
              {userCardsets.length > 0 ? (
                userCardsets.map((cardset) => (
                  <div
                    key={cardset.id}
                    className="border rounded p-4 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-xl font-bold">{cardset.title}</h3>
                      <p className="text-muted-foreground">{cardset.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/cards/${cardset.id}`}>
                        <Button size="sm">Start</Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleCreateTest(cardset, e)}
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
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => handleDelete(cardset.id, e)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No flashcard decks available.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Deck Modal */}
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
                            onChange={(e) =>
                              handleCardChange(index, "question", e.target.value)
                            }
                            className="w-full p-2 border rounded mb-2 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Answer"
                            value={card.answer}
                            onChange={(e) =>
                              handleCardChange(index, "answer", e.target.value)
                            }
                            className="w-full p-2 border rounded mb-2 bg-white"
                          />
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                setEditingIndices((prev) => prev.filter((i) => i !== index))
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                setEditingIndices((prev) => prev.filter((i) => i !== index))
                              }
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

// Helper function to extract JSON between BEGIN_JSON and END_JSON markers.
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

export default Courses;
