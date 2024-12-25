'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

const MAX_CARDS = 50
const MAX_WORD_COUNT = {
  setName: 10,
  setDescription: 50,
  question: 100,
  answer: 500
}

const FlashcardSchema = z.object({
  id: z.number(),
  question: z.string().min(1).max(MAX_WORD_COUNT.question),
  answer: z.string().min(1).max(MAX_WORD_COUNT.answer),
  image: z.string().nullable()
})

const CardSetSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(MAX_WORD_COUNT.setName),
  description: z.string().max(MAX_WORD_COUNT.setDescription),
  cards: z.array(FlashcardSchema).min(1).max(MAX_CARDS)
})

type Flashcard = z.infer<typeof FlashcardSchema>
type CardSet = z.infer<typeof CardSetSchema>

interface CreateCardSetProps {
  setCardSets: React.Dispatch<React.SetStateAction<(CardSet)[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function CreateCardSet({ setCardSets, setNotification }: CreateCardSetProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ id: 1, question: '', answer: '', image: null }])
  const [setName, setSetName] = useState('')
  const [setDescription, setSetDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
    })

    // Cleanup subscription on unmount
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

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFlashcards(flashcards.map(card =>
          card.id === id ? { ...card, image: reader.result as string } : card
        ))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (id: number) => {
    setFlashcards(flashcards.map(card =>
      card.id === id ? { ...card, image: null } : card
    ))
  }

  const saveFlashcards = async () => {
    // Check if user is authenticated
    if (!currentUser) {
      setNotification({ type: 'error', message: 'You must be logged in to save card sets.' })
      return
    }

    try {
      const newSet: CardSet = {
        id: Date.now(),
        title: setName,
        description: setDescription,
        cards: flashcards
      }
      const validatedSet = CardSetSchema.parse(newSet)

      // Prepare data for API call
      const cardSetData = {
        ...validatedSet,
        createdBy: {
          uid: currentUser.uid,
          displayName: currentUser.displayName || 'Anonymous',
          email: currentUser.email || ''
        },
        cards: validatedSet.cards.map(card => ({
          question: card.question,
          answer: card.answer,
          image: card.image,
        }))
      }

      // Make API call to save card set
      const response = await fetch('/api/cardsets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cardSetData)
      })

      const result = await response.json()

      if (result.success) {
        // Update local state
        setCardSets(prev => [...prev, validatedSet])
        setNotification({ type: 'success', message: `Card set "${validatedSet.title}" saved successfully!` })

        // Reset form
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

  const removeFlashcard = (id: number) => {
    // Prevent removing the last card
    if (flashcards.length > 1) {
      setFlashcards(flashcards.filter(card => card.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      {!currentUser && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">Please log in to create and save card sets.</span>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="set-name" className="text-lg text-cyan-700">Set Name ({MAX_WORD_COUNT.setName} words max)</Label>
        <Input
          id="set-name"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder="Enter set name"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
        {errors['name'] && <p className="text-red-500 text-sm">{errors['name']}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="set-description" className="text-lg text-cyan-700">Set Description ({MAX_WORD_COUNT.setDescription} words max)</Label>
        <Textarea
          id="set-description"
          value={setDescription}
          onChange={(e) => setSetDescription(e.target.value)}
          placeholder="Enter set description"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
        {errors['description'] && <p className="text-red-500 text-sm">{errors['description']}</p>}
      </div>

      {flashcards.map((card, index) => (
        <Card key={card.id} className="bg-white/50">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`question-${card.id}`} className="text-lg text-cyan-700">Question ({MAX_WORD_COUNT.question} words max)</Label>
                <Input
                  id={`question-${card.id}`}
                  value={card.question}
                  onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
                  placeholder="Enter the question"
                  className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
                {errors[`cards.${index}.question`] && <p className="text-red-500 text-sm">{errors[`cards.${index}.question`]}</p>}
              </div>

              <div>
                <Label className="text-lg text-cyan-700">Optional Image</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(card.id, e)}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full mt-2"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                {card.image && (
                  <div className="mt-2 relative">
                    <img
                      src={card.image}
                      alt="Card"
                      className="max-w-full h-auto rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(card.id)}
                      className="absolute top-2 right-2"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`answer-${card.id}`} className="text-lg text-cyan-700">Answer ({MAX_WORD_COUNT.answer} words max)</Label>
                <Input
                  id={`answer-${card.id}`}
                  value={card.answer}
                  onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
                  placeholder="Enter the answer"
                  className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
                {errors[`cards.${index}.answer`] && <p className="text-red-500 text-sm">{errors[`cards.${index}.answer`]}</p>}
              </div>

              {flashcards.length > 1 && (
                <Button
                  variant="destructive"
                  onClick={() => removeFlashcard(card.id)}
                  className="w-full mt-2"
                >
                  <TrashIcon className="mr-2 h-4 w-4" />
                  Remove Card
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-between mt-6">
        <Button
          onClick={addFlashcard}
          className="bg-cyan-600 hover:bg-cyan-700 text-white"
          disabled={flashcards.length >= MAX_CARDS || !currentUser}
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Add More Cards
        </Button>
        <Button
          onClick={saveFlashcards}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={!currentUser}
        >
          <SaveIcon className="mr-2 h-5 w-5" />
          Save Card Set
        </Button>
      </div>
    </div>
  )
}