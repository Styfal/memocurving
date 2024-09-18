'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon } from 'lucide-react'

interface Flashcard {
  id: number
  question: string
  answer: string
  image: string | null
}

interface CardSet {
  id: number
  name: string
  description: string
  cards: Flashcard[]
}

interface TestSet {
  id: number
  name: string
  description: string
  questions: any[] 
}

interface CreateCardSetProps {
  setCardSets: React.Dispatch<React.SetStateAction<(CardSet | TestSet)[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function CreateCardSet({ setCardSets, setNotification }: CreateCardSetProps) {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([{ id: 1, question: '', answer: '', image: null }])
  const [setName, setSetName] = useState('')
  const [setDescription, setSetDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addFlashcard = () => {
    setFlashcards([...flashcards, { id: Date.now(), question: '', answer: '', image: null }])
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
    const validFlashcards = flashcards.filter(card => card.question.trim() && card.answer.trim())
    if (validFlashcards.length > 0 && setName.trim()) {
      const newSet: CardSet = {
        id: Date.now(),
        name: setName.trim().split(' ').slice(0, 10).join(' '),
        description: setDescription.trim().split(' ').slice(0, 50).join(' '),
        cards: validFlashcards
      }
      setCardSets(prev => [...prev, newSet])
      setNotification({ type: 'success', message: `Card set "${newSet.name}" saved successfully!` })
      setFlashcards([{ id: Date.now(), question: '', answer: '', image: null }])
      setSetName('')
      setSetDescription('')
    } else {
      setNotification({ type: 'error', message: "Please fill in at least one flashcard and provide a name for the set." })
    }
  }

  const removeFlashcard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="set-name" className="text-lg text-cyan-700">Set Name (10 words max)</Label>
        <Input
          id="set-name"
          value={setName}
          onChange={(e) => setSetName(e.target.value)}
          placeholder="Enter set name"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="set-description" className="text-lg text-cyan-700">Set Description (50 words max)</Label>
        <Textarea
          id="set-description"
          value={setDescription}
          onChange={(e) => setSetDescription(e.target.value)}
          placeholder="Enter set description"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      {flashcards.map((card) => (
        <Card key={card.id} className="bg-white/50">
          <CardContent className="p-4 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor={`question-${card.id}`} className="text-lg text-cyan-700">Question</Label>
                <Input
                  id={`question-${card.id}`}
                  value={card.question}
                  onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
                  placeholder="Enter the question"
                  className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>
              <div>
                <Label htmlFor={`image-${card.id}`} className="text-lg text-cyan-700">Image</Label>
                <div className="mt-1 flex items-center space-x-2">
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white"
                  >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <input
                    type="file"
                    id={`image-${card.id}`}
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(card.id, e)}
                  />
                  {card.image && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeImage(card.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="mr-2 h-4 w-4" />
                      Remove Image
                    </Button>
                  )}
                </div>
                {card.image && (
                  <div className="mt-2 relative w-full h-40">
                    <Image
                      src={card.image}
                      alt="Uploaded image"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor={`answer-${card.id}`} className="text-lg text-cyan-700">Answer</Label>
                <Input
                  id={`answer-${card.id}`}
                  value={card.answer}
                  onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
                  placeholder="Enter the answer"
                  className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                />
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
        <Button onClick={addFlashcard} className="bg-cyan-600 hover:bg-cyan-700 text-white">
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