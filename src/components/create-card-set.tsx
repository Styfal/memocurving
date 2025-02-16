"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
  existingCardSetsCount?: number
}

export default function CreateCardSet({ setCardSets, setNotification, existingCardSetsCount = 0 }: CreateCardSetProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: 1, question: '', answer: '', image: null }
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
      setFlashcards([...flashcards, { id: Date.now(), question: '', answer: '', image: null }])
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
    // Remove the card from state
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
    <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)] flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {!currentUser && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-6 py-4 rounded mb-6" role="alert">
            <span className="text-xl">Please log in to create and save card sets.</span>
          </div>
        )}

        <div className="space-y-4">
          <Label htmlFor="set-name" className="text-xl text-cyan-700">Set Name (10 words max)</Label>
          <Input
            id="set-name"
            value={setName}
            onChange={e => setSetName(e.target.value)}
            placeholder="Enter set name"
            className="bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200 text-xl py-4 px-4"
          />
          {errors['title'] && <p className="text-red-500 text-lg">{errors['title']}</p>}
        </div>

        <div className="space-y-4 mt-6">
          <Label htmlFor="set-description" className="text-xl text-cyan-700">Set Description (50 words max)</Label>
          <Textarea
            id="set-description"
            value={setDescription}
            onChange={e => setSetDescription(e.target.value)}
            placeholder="Enter set description"
            className="bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200 text-xl py-4 px-4"
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
            className="bg-cyan-600 hover:bg-cyan-700 text-white text-2xl py-4 px-6 transition-colors duration-200"
            disabled={flashcards.length >= MAX_CARDS || !currentUser}
          >
            <PlusIcon className="mr-3 h-8 w-8" />
            Add Another Card
          </Button>
        </div>

        {/* List of Flashcards */}
        {flashcards.map((card) => (
          <Card key={card.id} className="bg-white shadow-md hover:shadow-xl transition-shadow my-6">
            <CardContent className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor={`question-${card.id}`} className="text-xl text-cyan-700">Question (20 words max)</Label>
                <Input
                  id={`question-${card.id}`}
                  value={card.question}
                  onChange={e => updateFlashcard(card.id, 'question', e.target.value)}
                  placeholder="Enter the question"
                  className="mt-1 bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200 text-xl py-4 px-4"
                />
                {errors[`cards.${card.id}.question`] && (
                  <p className="text-red-500 text-lg">{errors[`cards.${card.id}.question`]}</p>
                )}
              </div>
              <div className="space-y-4">
                <Label htmlFor={`answer-${card.id}`} className="text-xl text-cyan-700">Answer (40 words max)</Label>
                <Input
                  id={`answer-${card.id}`}
                  value={card.answer}
                  onChange={e => updateFlashcard(card.id, 'answer', e.target.value)}
                  placeholder="Enter the answer"
                  className="mt-1 bg-white border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500 transition-all duration-200 text-xl py-4 px-4"
                />
                {errors[`cards.${card.id}.answer`] && (
                  <p className="text-red-500 text-lg">{errors[`cards.${card.id}.answer`]}</p>
                )}
                {/* Remove Card Button placed inside the card column */}
                <Button
                  variant="destructive"
                  onClick={() => removeFlashcard(card.id)}
                  className="w-full mt-4 transition-colors duration-200 text-xl py-4"
                >
                  <TrashIcon className="mr-3 h-6 w-6" />
                  Remove Card
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end mt-8">
          <Button 
            onClick={saveFlashcards} 
            className="bg-green-600 hover:bg-green-700 text-white text-2xl py-6 px-10 transition-colors duration-200"
            disabled={!currentUser}
          >
            <SaveIcon className="mr-3 h-8 w-8" />
            Save Card Set
          </Button>
        </div>
      </div>
    </div>
  )
}
