'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'
import { usePathname, useRouter } from 'next/navigation'
import { AuthManager } from '@/lib/AuthManager'
import { useAuthContext } from '@/lib/AuthContext'

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
  name: z.string().min(1).max(MAX_WORD_COUNT.setName),
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


    const { user, displayName } = useAuthContext();
    console.log(user);
    const router = useRouter();

    if (!user) {
        router.push("/login");
    }
    /* const pathname = usePathname();
    AuthManager(pathname) */

  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ id: 1, question: '', answer: '', image: null }])
  const [setName, setSetName] = useState('')
  const [setDescription, setSetDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const saveFlashcards = () => {
    try {
      const newSet: CardSet = {
        id: Date.now(),
        name: setName,
        description: setDescription,
        cards: flashcards
      }
      const validatedSet = CardSetSchema.parse(newSet)
      setCardSets(prev => [...prev, validatedSet])
      setNotification({ type: 'success', message: `Card set "${validatedSet.name}" saved successfully!` })
      setFlashcards([{ id: Date.now(), question: '', answer: '', image: null }])
      setSetName('')
      setSetDescription('')
      setErrors({})
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

  const removeFlashcard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id))
  }

  return (
    <div className="space-y-4">
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
        <Button onClick={addFlashcard} className="bg-cyan-600 hover:bg-cyan-700 text-white" disabled={flashcards.length >= MAX_CARDS}>
          <PlusIcon className="mr-2 h-5 w-5" />
          Add More Cards
        </Button>
        <Button onClick={saveFlashcards} className="bg-green-600 hover:bg-green-700 text-white">
          <SaveIcon className="mr-2 h-5 w-5" />
          Save Card Set
        </Button>
      </div>
    </div>
  )
}