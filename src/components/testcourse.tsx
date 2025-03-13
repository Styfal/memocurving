



import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { TrashIcon } from "lucide-react";

export default function TestCourse() {
  const [user, loading, error] = useAuthState(auth);
  const [userTestsets, setUserTestsets] = useState<any[]>([]);
  // State for flag color (left marker) for test sets.
  const [testFlagColors, setTestFlagColors] = useState<{ [id: string]: string }>({});

  // Cycle flag color for a test set.
  const cycleTestFlag = (id: string) => {
    const current = testFlagColors[id] || "";
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
    setTestFlagColors((prev) => ({ ...prev, [id]: next }));
  };

  const [showModal, setShowModal] = useState(false);

  const [editingTest, setEditingTest] = useState<any | null>(null);
  const [editedTestTitle, setEditedTestTitle] = useState("");
  const [editedTestDescription, setEditedTestDescription] = useState("");
  const [editedQuestions, setEditedQuestions] = useState<any[]>([]);
  const [editingIndices, setEditingIndices] = useState<number[]>([]);

  useEffect(() => {
    if (user) {
      const fetchTestsets = async () => {
        const q = query(collection(db, "tests"), where("userId", "==", user.uid));
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

  const handleDelete = async (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const confirmDelete = confirm("Are you sure you want to delete this test?");
    if (!confirmDelete) return;
    try {
      const response = await fetch(`/api/tests/${testId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setUserTestsets((prev) => prev.filter((test) => test.id !== testId));
      } else {
        alert("Failed to delete test: " + result.error);
      }
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("An error occurred while deleting the test.");
    }
  };

  const openEditModal = (test: any) => {
    setEditingTest(test);
    setEditedTestTitle(test.title);
    setEditedTestDescription(test.description);
    setEditedQuestions(test.questions ? [...test.questions] : []);
    setEditingIndices([]);
  };

  const handleQuestionChange = (
    index: number,
    field: "question" | "correctAnswer",
    value: string
  ) => {
    setEditedQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    setEditedQuestions((prev) => prev.filter((_, i) => i !== index));
    setEditingIndices((prev) => prev.filter((i) => i !== index));
  };

  const handleSaveTestChanges = async () => {
    if (!editingTest) return;
    try {
      const requestData = {
        title: editedTestTitle,
        description: editedTestDescription,
        questions: editedQuestions,
      };
      const response = await fetch(`/api/tests/${editingTest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const result = await response.json();
      if (result.success) {
        setUserTestsets((prev) =>
          prev.map((t) =>
            t.id === editingTest.id
              ? { ...t, title: editedTestTitle, description: editedTestDescription, questions: editedQuestions }
              : t
          )
        );
        setEditingTest(null);
      } else {
        alert("Failed to update test: " + result.error);
      }
    } catch (error) {
      console.error("Error updating test:", error);
      alert("An error occurred while updating the test.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header with centered logo and updated styling */}
      <header className="py-6 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="flex items-center justify-center space-x-4 mb-2">
            <img
              src="/memocurvelogo.svg"
              alt="MemoCurve Logo"
              className="h-40 w-auto"
            />
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="bg-[#0D005B] text-white px-2">Practice</span> Tests
            </h1>
          </div>
        </div>
      </header>

      <main className="py-6 px-4 md:px-6">
        <div className="container max-w-5xl mx-auto">
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Your Test Sets</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTestsets.length > 0 ? (
                userTestsets.map((testset) => (
                  <div
                    key={testset.id}
                    className="relative overflow-hidden rounded-lg shadow-lg group hover:shadow-xl hover:-translate-y-2 transition-transform duration-300 ease-in-out cursor-pointer flex flex-col w-80 h-48"
                    onClick={() => cycleTestFlag(testset.id)}
                  >
                    {/* Left flag marker */}
                    <div
                      className="absolute top-0 left-0 h-full w-1"
                      style={{ backgroundColor: testFlagColors[testset.id] || "transparent" }}
                    />
                    {/* Completed Test Indicator */}
                    {testset.completed && (
                      <div className="absolute top-2 left-4 bg-green-500 text-white text-xs px-1 py-0.5 rounded">
                        Completed
                      </div>
                    )}
                    {/* Image placeholder removed */}
                    <Link
                      href={`/tests/${testset.id}`}
                      className="absolute inset-0 z-10 pointer-events-none"
                      prefetch={false}
                    >
                      <span className="sr-only">{testset.title}</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(testset.id, e);
                      }}
                      className="absolute top-2 right-2 z-20 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 focus:outline-none"
                      title="Delete Test"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                    <div className="p-6 bg-background flex flex-col h-full">
                      <h3 className="text-xl font-bold">{testset.title}</h3>
                      <p className="text-muted-foreground mt-2">{testset.description}</p>
                      <div className="flex space-x-2 mt-auto">
                        <Link href={`/tests/${testset.id}`}>
                          <Button size="sm" onClick={(e) => e.stopPropagation()}>
                            Start
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(testset);
                          }}
                        >
                          Edit Test
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No test sets available.</p>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Test Modal */}
      {editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setEditingTest(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              title="Close"
            >
              &#10005;
            </button>
            <h2 className="text-2xl font-bold mb-4">Edit Test</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Test Title (10 words max)
                </label>
                <input
                  type="text"
                  value={editedTestTitle}
                  onChange={(e) => setEditedTestTitle(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Test Description (50 words max)
                </label>
                <textarea
                  value={editedTestDescription}
                  onChange={(e) => setEditedTestDescription(e.target.value)}
                  className="w-full p-2 border rounded bg-white"
                ></textarea>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Questions</h3>
              <div className="max-h-80 overflow-y-auto space-y-2">
                {editedQuestions.length > 0 ? (
                  editedQuestions.map((q, index) => (
                    <div key={index} className="border rounded p-4">
                      {editingIndices.includes(index) ? (
                        <div>
                          <input
                            type="text"
                            placeholder="Question"
                            value={q.question}
                            onChange={(e) =>
                              handleQuestionChange(index, "question", e.target.value)
                            }
                            className="w-full p-2 border rounded mb-2 bg-white"
                          />
                          <input
                            type="text"
                            placeholder="Correct Answer"
                            value={q.correctAnswer}
                            onChange={(e) =>
                              handleQuestionChange(index, "correctAnswer", e.target.value)
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
                            <p className="font-semibold">Q: {q.question}</p>
                            <p className="text-sm text-muted-foreground">A: {q.correctAnswer}</p>
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
                              onClick={() => handleRemoveQuestion(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">No questions in this test.</p>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <Button
                  size="sm"
                  onClick={() => {
                    const newQuestion = { question: "", correctAnswer: "", options: [] };
                    setEditedQuestions((prev) => [...prev, newQuestion]);
                    setEditingIndices((prev) => [...prev, editedQuestions.length]);
                  }}
                >
                  Add Question
                </Button>
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button size="sm" variant="outline" onClick={() => setEditingTest(null)}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveTestChanges}>
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
