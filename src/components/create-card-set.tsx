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
  id: z.number(), // Added id field
  name: z.string().min(1).max(MAX_WORD_COUNT.setName),
  description: z.string().max(MAX_WORD_COUNT.setDescription),
  cards: z.array(FlashcardSchema).min(1).max(MAX_CARDS)
})

type Flashcard = z.infer<typeof FlashcardSchema>
type CardSet = z.infer<typeof CardSetSchema>

interface CreateCardSetProps {
  setCardSets: React.Dispatch<React.SetStateAction<CardSet[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function CreateCardSet({ setCardSets, setNotification }: CreateCardSetProps) {
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

  const saveFlashcards = async () => {
    try {
      const newSet = {
        id: Date.now(), // Added id generation
        name: setName,
        description: setDescription,
        cards: flashcards
      }
      
      // First validate the data
      const validatedSet = CardSetSchema.parse(newSet)
      
      // Make API call to save the data
      const response = await fetch('/api/cardsets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedSet)
      })
  
      const result = await response.json()
  
      if (!result.success) {
        throw new Error(result.error || 'Failed to save card set')
      }
  
      // Update local state
      setCardSets(prev => [...prev, result.data])
      setNotification({ type: 'success', message: `Card set "${validatedSet.name}" saved successfully!` })
      
      // Reset form
      setFlashcards([{ id: Date.now(), question: '', answer: '', image: null }])
      setSetName('')
      setSetDescription('')
      setErrors({})
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach(err => {
          console.log('Validation error:', err)
          newErrors[err.path.join('.')] = err.message
        })
        setErrors(newErrors)
        setNotification({ type: 'error', message: "Please correct the errors in the form." })
      } else {
        console.error('Non-validation error:', error)
        setNotification({ 
          type: 'error', 
          message: error instanceof Error ? error.message : "Failed to save card set" 
        })
      }
    }
  }

  const removeFlashcard = (id: number) => {
    setFlashcards(flashcards.filter(card => card.id !== id))
  }

  // Rest of the component remains the same...
  return (
    <div className="space-y-4">
      {/* Existing JSX remains unchanged */}
    </div>
  )
}