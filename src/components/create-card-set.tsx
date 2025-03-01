


"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

// Maximum limits and word counts
const MAX_CARDS = 20
const MAX_WORD_COUNT = {
  setDescription: 50,
  question: 20,
  answer: 40,
}

// Flashcard-level schema
const FlashcardSchema = z.object({
  id: z.number(),
  question: z.string().min(1, "Question is required").refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
    { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
  ),
  answer: z.string().min(1, "Answer is required").refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
    { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
  ),
  image: z.string().nullable(),
})

export const CardSetSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Set name is required").refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= 10,
    { message: "Title must be at most 10 words." }
  ),
  description: z.string().min(0).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
    { message: `Description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
  ),
  cards: z.array(FlashcardSchema).min(1, "At least one card is required").max(MAX_CARDS)
})

type Flashcard = z.infer<typeof FlashcardSchema>
type CardSet = z.infer<typeof CardSetSchema>

interface CreateCardSetProps {
  setCardSets: React.Dispatch<React.SetStateAction<CardSet[]>>
  setNotification?: (notification: { type: 'success' | 'error', message: string } | null) => void
  existingCardSetsCount?: number
}

export default function CreateCardSet({
  setCardSets,
  setNotification = () => {},
  existingCardSetsCount = 0
}: CreateCardSetProps) {
  // Start with 5 flashcards instead of 1
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: 1, question: '', answer: '', image: null },
    { id: 2, question: '', answer: '', image: null },
    { id: 3, question: '', answer: '', image: null },
    { id: 4, question: '', answer: '', image: null },
    { id: 5, question: '', answer: '', image: null }
  ])
  const [setName, setSetName] = useState('')
  const [setDescription, setSetDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user))
    return () => unsubscribe()
  }, [])

  const addFlashcard = () => {
    if (flashcards.length < MAX_CARDS) {
      const newCard = { id: Date.now(), question: '', answer: '', image: null }
      setFlashcards([...flashcards, newCard])
    } else {
      setNotification({ type: 'error', message: `Maximum of ${MAX_CARDS} cards allowed.` })
    }
  }

  const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, [field]: value } : card
    ))
  }

  const removeFlashcard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id))
  }

  const saveFlashcards = async () => {
    if (existingCardSetsCount >= 20) {
      setNotification({ type: 'error', message: 'Maximum of 20 flashcard sets allowed.' })
      return;
    }
    if (!currentUser) {
      setNotification({ type: 'error', message: 'You must be logged in to save card sets.' })
      return;
    }
    try {
      const newSet: CardSet = {
        id: Date.now(),
        title: setName,
        description: setDescription,
        cards: flashcards
      }
      const validatedSet = CardSetSchema.parse(newSet)

      // Card set–level review metadata:
      const cardSetData = {
        ...validatedSet,
        createdBy: {
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Anonymous',
          email: currentUser.email || ''
        },
        lastReviewed: 0,
        reviewCount: 0,
        cards: validatedSet.cards.map(card => ({
          question: card.question,
          answer: card.answer,
          image: card.image,
        }))
      }

      const response = await fetch('/api/cardsets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cardSetData)
      })
      const result = await response.json()
      if (result.success) {
        setCardSets(prev => [...prev, validatedSet])
        setNotification({ type: 'success', message: `Card set "${validatedSet.title}" saved successfully!` })
        setFlashcards([{ id: Date.now(), question: '', answer: '', image: null }])
        setSetName('')
        setSetDescription('')
        setErrors({})
      } else {
        throw new Error(result.error || 'Failed to save card set')
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach(err => {
          newErrors[err.path.join('.')] = err.message
        })
        setErrors(newErrors)
        setNotification({ type: 'error', message: "Please correct the errors in the form." })
      } else {
        console.error('Error saving card set:', error)
        setNotification({ type: 'error', message: error instanceof Error ? error.message : 'An unknown error occurred' })
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-300">
      {/* Top header spanning full width */}
      <div className="w-full bg-gray-100 py-6">
        <h1 className="text-center text-5xl font-bold" style={{ color: "#0D005B" }}>
          Create Cards
        </h1>
      </div>
      {/* Main content container spanning 100% width of the viewport with gray-100 background */}
      <div className="p-8 w-full bg-gray-100">
        <div className="mt-8 p-8 w-[60%] mx-auto flex flex-col items-center">
          <div className="w-full space-y-8">
            {!currentUser && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded">
                <p className="text-xl font-medium">Please log in to create and save card sets.</p>
              </div>
            )}

            {/* Set Name */}
            <div className="space-y-4">
              <Input
                id="set-name"
                value={setName}
                onChange={e => setSetName(e.target.value)}
                placeholder="Enter a title, like Microeconomics - Chapter 512: What the fuck is demand"
                className="bg-white border-none outline-none focus:outline-none focus:border-b-2 focus:border-[#0D005B] transition-all duration-200 text-xl py-4 px-4"
              />
              {errors['title'] && <p className="text-red-500 text-lg">{errors['title']}</p>}
            </div>

            {/* Set Description */}
            <div className="space-y-4">
              <Textarea
                id="set-description"
                value={setDescription}
                onChange={e => setSetDescription(e.target.value)}
                placeholder="Add a description"
                className="bg-white border-none outline-none focus:outline-none focus:border-b-2 focus:border-[#0D005B] transition-all duration-200 text-xl py-4 px-4 resize-none"
              />
              {errors['description'] && <p className="text-red-500 text-lg">{errors['description']}</p>}
            </div>

            {/* Header row with cards counter and Add Card button */}
            <div className="flex items-center justify-between mt-8">
              <p className="text-lg font-semibold text-gray-700">
                {`Cards: ${flashcards.length} of ${MAX_CARDS}`}
              </p>
              <Button 
                onClick={addFlashcard} 
                className="bg-white text-gray-700 text-2xl py-4 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                disabled={flashcards.length >= MAX_CARDS || !currentUser}
              >
                <PlusIcon className="mr-0 h-40 w-40" />
              </Button>
            </div>

            {/* List of Flashcards */}
            {flashcards.map((card, index) => (
              <Card key={card.id} className="bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow my-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300 rounded-t-lg">
                  <p className="text-xl font-bold text-gray-700">{index + 1}</p>
                  {/* Remove Button */}
                  <Button
                    onClick={() => removeFlashcard(card.id)}
                    className="p-2 focus:outline-none border-0 text-gray-700 hover:text-gray-900 transition-colors duration-200"
                    title="Remove Card"
                    variant="ghost"
                  >
                    <TrashIcon className="w-5 h-5"/>
                  </Button>
                </div>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Input
                      id={`question-${card.id}`}
                      value={card.question}
                      onChange={e => updateFlashcard(card.id, 'question', e.target.value)}
                      placeholder="Enter term"
                      className="bg-white border-none outline-none focus:outline-none focus:border-b-2 focus:border-yellow-500 transition-all duration-200 text-xl py-4 px-4"
                    />
                    <p className="text-sm text-gray-500">Term (20 words max)</p>
                    {errors[`cards.${card.id}.question`] && (
                      <p className="text-red-500 text-lg">{errors[`cards.${card.id}.question`]}</p>
                    )}
                  </div>
                  <div className="space-y-4">
                    <Input
                      id={`answer-${card.id}`}
                      value={card.answer}
                      onChange={e => updateFlashcard(card.id, 'answer', e.target.value)}
                      placeholder="Enter definition"
                      className="bg-white border-none outline-none focus:outline-none focus:border-b-2 focus:border-yellow-500 transition-all duration-200 text-xl py-4 px-4"
                    />
                    <p className="text-sm text-gray-500">Definition (40 words max)</p>
                    {errors[`cards.${card.id}.answer`] && (
                      <p className="text-red-500 text-lg">{errors[`cards.${card.id}.answer`]}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex justify-end">
              <Button 
                onClick={saveFlashcards} 
                className="bg-gray-400 hover:bg-gray-300 text-white text-xl py-4 px-8 rounded-lg transition-colors duration-200 flex items-center"
                disabled={!currentUser}
              >
                <SaveIcon className="mr-3 h-8 w-8" />
                Save Card Set
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
