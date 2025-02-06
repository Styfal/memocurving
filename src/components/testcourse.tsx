import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";

export default function TestCourse() {
  // Track the current user
  const [user, loading, error] = useAuthState(auth);
  const [userTestsets, setUserTestsets] = useState<any[]>([]);

  // Fetch tests created by the current user using the "userId" field.
  useEffect(() => {
    if (user) {
      const fetchTestsets = async () => {
        const q = query(
          collection(db, "tests"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const testsets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserTestsets(testsets);
      };

      fetchTestsets();
    }
  }, [user]);

  // Handler for deleting a test.
  const handleDelete = async (testId: string, e: React.MouseEvent) => {
    // Stop propagation so that clicking the delete button does not activate the surrounding Link.
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;
    try {
      // Using the dynamic route DELETE endpoint.
      const response = await fetch(`/api/tests/${testId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        // Remove the deleted test from local state.
        setUserTestsets((prev) => prev.filter((test) => test.id !== testId));
      } else {
        alert("Failed to delete test: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("An error occurred while deleting the test.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full min-h-screen bg-background">
      <header className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto space-y-4 text-center">
          <div className="flex justify-center">
            <img
              src="/path-to-your-icon.svg"
              alt="Icon"
              className="h-10 w-10"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            <span className="bg-cyan-500 text-white px-2">Conduct</span> Tests
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Start Studying Efficiently
          </p>
        </div>
      </header>
      <main className="py-12 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Tests</h2>
              <Link href="/tests">
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
                      src={testset.imageUrl || "/placeholder.svg"}
                      alt={testset.title}
                      width={600}
                      height={300}
                      className="object-cover w-full h-48"
                      style={{ aspectRatio: "600/300", objectFit: "cover" }}
                    />
                    {/* Absolute link to test details */}
                    <Link
                      href={`/tests/${testset.id}`}
                      className="absolute inset-0 z-10"
                      prefetch={false}
                    >
                      <span className="sr-only">{testset.title}</span>
                    </Link>
                    {/* Delete Button: placed at top-right */}
                    <button
                      onClick={(e) => handleDelete(testset.id, e)}
                      className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                      title="Delete Test"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <div className="p-6 bg-background">
                      <h3 className="text-xl font-bold">{testset.title}</h3>
                      <p className="text-muted-foreground mt-2">
                        {testset.description}
                      </p>
                      <Link href={`/tests/${testset.id}`}>
                        <Button size="sm" className="mt-4">
                          Start
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tests available.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
