'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon, EditIcon } from 'lucide-react'
import { z } from 'zod'

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

interface TestSet {
  id: number
  name: string
  description: string
  questions: any[] // Simplified for this example
}

type CombinedSet = CardSet | TestSet

interface EditCardSetsProps {
  combinedSets: CombinedSet[]
  setCardSets: React.Dispatch<React.SetStateAction<CardSet[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function EditCardSets({ combinedSets, setCardSets, setNotification }: EditCardSetsProps) {
  const [editingSet, setEditingSet] = useState<CardSet | null>(null)
  const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Filter out only CardSets from CombinedSets
  const cardSetsOnly = combinedSets.filter(
    (set): set is CardSet => 'cards' in set && Array.isArray(set.cards)
  )

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

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && editingSet) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setEditingSet({
          ...editingSet,
          cards: editingSet.cards.map(card =>
            card.id === id ? { ...card, image: reader.result as string } : card
          )
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (id: number) => {
    if (editingSet) {
      setEditingSet({
        ...editingSet,
        cards: editingSet.cards.map(card =>
          card.id === id ? { ...card, image: null } : card
        )
      })
    }
  }

  const saveEditedSet = () => {
    if (editingSet) {
      try {
        const validatedSet = CardSetSchema.parse(editingSet)
        setCardSets(prevSets => prevSets.map(set =>
          set.id === validatedSet.id ? validatedSet : set
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
        cards: [...editingSet.cards, { id: Date.now(), question: '', answer: '', image: null }]
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
            <Label htmlFor="setName">Set Name</Label>
            <Input
              id="setName"
              value={editingSet.title}
              onChange={(e) => setEditingSet({ ...editingSet, title: e.target.value })}
              maxLength={MAX_WORD_COUNT.setName}
            />
            <Label htmlFor="setDescription">Set Description</Label>
            <Textarea
              id="setDescription"
              value={editingSet.description}
              onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
              maxLength={MAX_WORD_COUNT.setDescription}
            />
          </div>
          {editingSet.cards.map((card, index) => (
            <Card key={card.id} className="bg-white/50">
              <CardContent className="p-4 grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`question-${card.id}`}>Question</Label>
                  <Textarea
                    id={`question-${card.id}`}
                    value={card.question}
                    onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
                    maxLength={MAX_WORD_COUNT.question}
                  />
                </div>
                <div>
                  <Label htmlFor={`answer-${card.id}`}>Answer</Label>
                  <Textarea
                    id={`answer-${card.id}`}
                    value={card.answer}
                    onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
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
          <div className="flex justify-between">
            <Button onClick={addFlashcard} className="bg-green-600 hover:bg-green-700 text-white">
              <PlusIcon className="mr-2 h-4 w-4" />
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
          <Select onValueChange={(value) => startEditing(Number(value))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a card set to edit" />
            </SelectTrigger>
            <SelectContent>
              {cardSetsOnly.length > 0 ? (
                cardSetsOnly.map((set) => (
                  <SelectItem key={set.id} value={set.id.toString()}>{set.title}</SelectItem>
                ))
              ) : (
                <SelectItem value="no-sets" disabled>No card sets available</SelectItem>
              )}
            </SelectContent>
          </Select>
          {cardSetsOnly.length > 0 ? (
            cardSetsOnly.map((set) => (
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