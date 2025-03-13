

// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "@/components/ui/alert";
// import CreateCardSet from "./create-card-set";
// import EditCardSets from "./edit-card-sets";
// import TestCreate from "./test-create";
// import AICreate from "./ai-create";

// interface Flashcard {
//   id: number;
//   question: string;
//   answer: string;
//   image: string | null;
//   lastReviewed: number;
//   reviewCount: number;
// }

// interface CardSet {
//   id: number;
//   title: string;
//   description: string;
//   cards: Flashcard[];
// }

// interface TestQuestion {
//   id: number;
//   question: string;
//   answerType: "multiple" | "short";
//   options?: string[];
//   correctAnswer: string;
//   image: string | null;
// }

// interface TestSet {
//   id: number;
//   name: string;
//   description: string;
//   questions: TestQuestion[];
// }

// // New combined type
// type CombinedSet = CardSet | TestSet;

// export default function CreateCards() {
//   const [cardSets, setCardSets] = useState<CardSet[]>([]);
//   const [testSets, setTestSets] = useState<TestSet[]>([]);
//   const [combinedSets, setCombinedSets] = useState<CombinedSet[]>([]);
//   const [currentPage, setCurrentPage] = useState("create");
//   const [notification, setNotification] = useState<{
//     type: "success" | "error";
//     message: string;
//   } | null>(null);

//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotification(null), 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   useEffect(() => {
//     // Update the combinedSets whenever cardSets or testSets change
//     setCombinedSets([...cardSets, ...testSets]);
//   }, [cardSets, testSets]);

//   const renderContent = () => {
//     switch (currentPage) {
//       case "create":
//         return (
//           <CreateCardSet
//             setCardSets={setCardSets}
//             setNotification={setNotification}
//           />
//         );
//       case "edit":
//         return (
//           <EditCardSets
//             combinedSets={combinedSets}
//             setCardSets={setCardSets}
//             setNotification={setNotification}
//           />
//         );
//       case "test":
//         return (
//           <TestCreate setTestSets={setTestSets} setNotification={setNotification} />
//         );
//       case "ai":
//         return <AICreate />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar removed as you mentioned you don't use it.
//           The navigation is now handled with a simple header below. */}
//       <div className="w-full p-8 overflow-auto">
//         <header className="mb-8">
//           <h1
//             className="text-4xl font-bold text-center"
//             style={{ color: "#0D005B" }}
//           >
//             {currentPage === "create"
//               ? "Create Card Set"
//               : currentPage === "edit"
//               ? "Edit Card Sets"
//               : currentPage === "test"
//               ? "Test Create"
//               : currentPage === "ai"
//               ? "AI Create"
//               : ""}
//           </h1>
//           {/* Optional simple navigation */}
//           <div className="flex justify-center mt-4 space-x-4">
//             <button
//               onClick={() => setCurrentPage("create")}
//               className={`px-4 py-2 rounded ${
//                 currentPage === "create" ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//             >
//               Create
//             </button>
//             <button
//               onClick={() => setCurrentPage("edit")}
//               className={`px-4 py-2 rounded ${
//                 currentPage === "edit" ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//             >
//               Edit
//             </button>
//             <button
//               onClick={() => setCurrentPage("test")}
//               className={`px-4 py-2 rounded ${
//                 currentPage === "test" ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//             >
//               Test
//             </button>
//             <button
//               onClick={() => setCurrentPage("ai")}
//               className={`px-4 py-2 rounded ${
//                 currentPage === "ai" ? "bg-blue-600 text-white" : "bg-gray-200"
//               }`}
//             >
//               AI
//             </button>
//           </div>
//         </header>
//         {notification && (
//           <Alert
//             variant={notification.type === "success" ? "default" : "destructive"}
//             className="mb-4"
//           >
//             <AlertTitle>
//               {notification.type === "success" ? "Success" : "Error"}
//             </AlertTitle>
//             <AlertDescription>{notification.message}</AlertDescription>
//           </Alert>
//         )}
//         {renderContent()}
//       </div>
//     </div>
//   );
// }



'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PlusIcon, SaveIcon, TrashIcon, EditIcon } from 'lucide-react'
import { z } from 'zod'

const MAX_CARDS = 20
const MAX_WORD_COUNT = {
  setName: 10,
  setDescription: 50,
  question: 20,
  answer: 40
}

const FlashcardSchema = z.object({
  id: z.number(),
  question: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
    { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
  ),
  answer: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
    { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
  ),
  image: z.string().nullable(),
  // Review metadata is not edited here.
  lastReviewed: z.number().default(0),
  reviewCount: z.number().default(0),
})

const CardSetSchema = z.object({
  id: z.number(),
  title: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setName,
    { message: `Set Title must be at most ${MAX_WORD_COUNT.setName} words.` }
  ),
  description: z.string().min(0).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
    { message: `Set Description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
  ),
  cards: z.array(FlashcardSchema).min(1).max(MAX_CARDS)
})

type Flashcard = z.infer<typeof FlashcardSchema>
type CardSet = z.infer<typeof CardSetSchema>

interface EditCardSetsProps {
  combinedSets: (CardSet | any)[]
  setCardSets: React.Dispatch<React.SetStateAction<CardSet[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function EditCardSets({ combinedSets, setCardSets, setNotification }: EditCardSetsProps) {
  const [editingSet, setEditingSet] = useState<CardSet | null>(null)
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const cardSetsOnly = combinedSets.filter(set => 'cards' in set)

  const startEditing = (setId: number) => {
    const set = cardSetsOnly.find(s => s.id === setId)
    if (set) {
      setEditingSet(set)
      setSelectedSetId(setId)
    } else {
      setNotification({ type: 'error', message: "You can only edit card sets, not test sets." })
    }
  }

  const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
    if (editingSet) {
      setEditingSet({
        ...editingSet,
        cards: editingSet.cards.map(card => 
          card.id === id ? { ...card, [field]: value } : card
        )
      })
    }
  }

  const saveEditedSet = () => {
    if (editingSet) {
      try {
        CardSetSchema.parse(editingSet)
        setCardSets(prevSets => prevSets.map(set => 
          set.id === editingSet.id ? editingSet : set
        ))
        setEditingSet(null)
        setSelectedSetId(null)
        setErrors({})
        setNotification({ type: 'success', message: "Card set updated successfully!" })
      } catch (error) {
        if (error instanceof z.ZodError) {
          const newErrors: { [key: string]: string } = {}
          error.errors.forEach(err => {
            newErrors[err.path.join('.')] = err.message
          })
          setErrors(newErrors)
          setNotification({ type: 'error', message: "Please correct the errors in the form." })
        }
      }
    }
  }

  const deleteCardSet = (id: number) => {
    setCardSets(prevSets => prevSets.filter(set => set.id !== id))
    setNotification({ type: 'success', message: "Card set deleted successfully!" })
  }

  const addFlashcard = () => {
    if (editingSet && editingSet.cards.length < MAX_CARDS) {
      setEditingSet({
        ...editingSet,
        cards: [...editingSet.cards, { id: Date.now(), question: '', answer: '', image: null, lastReviewed: 0, reviewCount: 0 }]
      })
    } else {
      setNotification({ type: 'error', message: `Maximum of ${MAX_CARDS} cards allowed.` })
    }
  }

  const removeFlashcard = (id: number) => {
    if (editingSet) {
      setEditingSet({
        ...editingSet,
        cards: editingSet.cards.filter(card => card.id !== id)
      })
    }
  }

  return (
    <div className="space-y-4">
      {editingSet ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="setName">Set Name (10 words max)</Label>
            <Input
              id="setName"
              value={editingSet.title}
              onChange={e => setEditingSet({ ...editingSet, title: e.target.value })}
              maxLength={MAX_WORD_COUNT.setName}
            />
            <Label htmlFor="setDescription">Set Description (50 words max)</Label>
            <Textarea
              id="setDescription"
              value={editingSet.description}
              onChange={e => setEditingSet({ ...editingSet, description: e.target.value })}
              maxLength={MAX_WORD_COUNT.setDescription}
            />
          </div>
          {editingSet.cards.map((card, index) => (
            <Card key={card.id} className="bg-white/50">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`question-${card.id}`}>Question (20 words max)</Label>
                  <Textarea
                    id={`question-${card.id}`}
                    value={card.question}
                    onChange={e => updateFlashcard(card.id, 'question', e.target.value)}
                    maxLength={MAX_WORD_COUNT.question}
                  />
                </div>
                <div>
                  <Label htmlFor={`answer-${card.id}`}>Answer (40 words max)</Label>
                  <Textarea
                    id={`answer-${card.id}`}
                    value={card.answer}
                    onChange={e => updateFlashcard(card.id, 'answer', e.target.value)}
                    maxLength={MAX_WORD_COUNT.answer}
                  />
                </div>
                <Button onClick={() => removeFlashcard(card.id)} variant="destructive" className="col-span-2">
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove Card
                </Button>
              </CardContent>
            </Card>
          ))}
          <div className="flex justify-between mt-6">
            <Button onClick={addFlashcard} className="bg-green-600 hover:bg-green-700 text-white">
              <PlusIcon className="mr-2 h-5 w-5" />
              Add Card
            </Button>
            <Button onClick={saveEditedSet} className="bg-blue-600 hover:bg-blue-700 text-white">
              <SaveIcon className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </>
      ) : (
        <>
          <Select onValueChange={value => startEditing(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a card set to edit" />
            </SelectTrigger>
            <SelectContent>
              {cardSetsOnly.length > 0 ? (
                cardSetsOnly.map(set => (
                  <SelectItem key={set.id} value={set.id.toString()}>{set.title}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-sets" disabled>No card sets available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {cardSetsOnly.length > 0 ? (
            cardSetsOnly.map(set => (
              <Card key={set.id} className="bg-white/50">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold text-purple-700">{set.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Cards: {set.cards.length}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button onClick={() => startEditing(set.id)} className="bg-blue-600 hover:bg-blue-700 text-white mr-2">
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button onClick={() => deleteCardSet(set.id)} variant="destructive">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-center text-gray-500">No card sets available. Create a new set to get started.</p>
          )}
        </>
      )}
    </div>
  )
}
