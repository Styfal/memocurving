



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

  // Fetch the cardsets created by the current user (using createdBy.uid)
  useEffect(() => {
    if (user) {
      const fetchCardsets = async () => {
        const q = query(
          collection(db, "cardSets"),
          where("createdBy.uid", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const cardsets = querySnapshot.docs.map(doc => ({
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
        setUserCardsets(prev => prev.filter(cardset => cardset.id !== cardsetId));
        // Remove from testedDecks if needed.
        setTestedDecks(prev => prev.filter(id => id !== cardsetId));
      } else {
        alert("Failed to delete flashcard deck: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting flashcard deck:", error);
      alert("An error occurred while deleting the flashcard deck.");
    }
  };

  // Handler for creating a test from a given flashcard deck.
  const handleCreateTest = async (cardset: any, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // Prevent creating a test if one already exists for this deck.
    if (testedDecks.includes(cardset.id)) return;

    // Prepare the test data by converting each flashcard to a short-answer test question.
    const requestData = {
      title: cardset.title,
      description: cardset.description,
      questions: cardset.cards.map((card: any) => ({
        question: card.question,
        correctAnswer: card.answer,
      })),
      createdAt: new Date().toISOString(),
      userId: user ? user.uid : "unknown",
    };

    try {
      const response = await fetch('/api/tests', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (response.ok && result.success) {
        // Mark this deck as already used to create a test.
        setTestedDecks(prev => [...prev, cardset.id]);
        // Redirect to the newly created test's page.
        router.push(`/tests/${result.data.id}`);
      } else {
        alert("Failed to create test: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error creating test:", error);
      alert("An error occurred while creating the test.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full min-h-screen bg-background">
      <header className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto space-y-4 text-center">
          <div className="flex justify-center">
            <img src="/path-to-your-icon.svg" alt="Icon" className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-cyan-500 text-white px-2">Explore</span> Flashcards
          </h1>
          <p className="text-muted-foreground md:text-xl">Start Studying Efficiently</p>
        </div>
      </header>
      <main className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Flashcard Decks</h2>
              <Link href="/cardSets">
                <Button variant="link" className="text-primary">
                  View More
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCardsets.length > 0 ? (
                userCardsets.map(cardset => (
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
    </div>
  );
}

export default Courses;

