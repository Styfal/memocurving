import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useEffect, useState } from "react";

export function testcourse() {
  // Track the current user
  const [user, loading, error] = useAuthState(auth);
  const [userTestsets, setUserTestsets] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      // Fetch the cardsets created by the current user (using their UID inside the createdBy object)
      const fetchTestsets = async () => {
        const q = query(collection(db, "tests"), where("createdBy.uid", "==", user.uid));
        const querySnapshot = await getDocs(q);

        // Process the query result and store cardsets
        const testsets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUserTestsets(testsets);
      };

      fetchTestsets();
    }
  }, [user]); // Trigger whenever the user changes

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
            <span className="bg-cyan-500 text-white px-2">Conduct</span> Tests
          </h1>
          <p className="text-muted-foreground md:text-xl">Start Studying Efficiently</p>
        </div>
      </header>
      <main className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Cards</h2>
              <Link href="/courses/flashcard01">
                <Button variant="link" className="text-primary">
                  View More
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTestsets.length > 0 ? (
                userTestsets.map((testset) => (
                  <div
                    key={testset.id}
                    className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out"
                  >
                    <img
                      src={testset.imageUrl || "/placeholder.svg"} // Fallback to placeholder if no image
                      alt={testset.title}
                      width={600}
                      height={300}
                      className="object-cover w-full h-48"
                      style={{ aspectRatio: "600/300", objectFit: "cover" }}
                    />
                    <Link href={`/cards/${testset.id}`} className="absolute inset-0 z-10" prefetch={false}>
                      <span className="sr-only">{testset.title}</span>
                    </Link>
                    <div className="p-6 bg-background">
                      <h3 className="text-xl font-bold">{testset.title}</h3>
                      <p className="text-muted-foreground mt-2">{testset.description}</p>
                      <Link href={`/courses/${testset.id}`}>
                        <Button size="sm" className="mt-4">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No cardsets available.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
