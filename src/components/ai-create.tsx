'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { SaveIcon, TrashIcon } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

interface Flashcard {
  id: number
  question: string
  answer: string
  image?: string | null
}

export default function FlashcardGenerator() {
  const [blockText, setBlockText] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [setName, setSetName] = useState('')
  const [setDescription, setSetDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Listen for auth changes.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user))
    return () => unsubscribe()
  }, [])

  // Helper to derive a title and description from the pasted text.
  // Ensures title is at most 10 words and description at most 50 words.
  const deriveTitleAndDescription = (text: string) => {
    const sentenceMatch = text.match(/([^.!?]+[.!?])\s*/)
    let title =
      sentenceMatch && sentenceMatch[0]
        ? sentenceMatch[0].trim()
        : text.split(' ').slice(0, 10).join(' ')
    const titleWords = title.split(/\s+/)
    if (titleWords.length > 10) {
      title = titleWords.slice(0, 10).join(' ')
    }
    const description = text.split(/\s+/).slice(0, 50).join(' ')
    return { title, description }
  }

  // Helper to trim a string to a specified number of words.
  const trimWords = (text: string, limit: number) => {
    const words = text.split(/\s+/)
    return words.length <= limit ? text : words.slice(0, limit).join(' ')
  }

  // Constructs the prompt on the client side, calls the OpenAI endpoint,
  // and then parses the JSON response into flashcards.
  const generateFlashcards = async () => {
    if (!blockText.trim()) {
      setError('Please paste some text to generate flashcards.')
      return
    }
    setError('')
    setLoading(true)

    const flashcardPrompt = `Convert the following text into flashcards. Generate a JSON array where each element is an object with "question" and "answer" keys. Ensure the JSON is properly formatted. Text: ${blockText}`

    try {
      const response = await fetch('/api/ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: flashcardPrompt, type: 'flashcard' })
      })
      const data = await response.json()
      const rawContent = data.choices && data.choices[0]?.message?.content
      if (!rawContent) {
        setError('No response from AI.')
        setLoading(false)
        return
      }

      let cardsData
      try {
        cardsData = JSON.parse(rawContent)
      } catch (parseError) {
        setError('Failed to parse flashcards from AI response.')
        setLoading(false)
        return
      }

      if (!Array.isArray(cardsData)) {
        setError('Unexpected flashcards format. Expected a JSON array.')
        setLoading(false)
        return
      }

      const cards: Flashcard[] = cardsData.map(
        (card: { question: string; answer: string }, index: number) => ({
          id: Date.now() + index,
          question: card.question,
          answer: card.answer,
          image: null
        })
      )
      setFlashcards(cards)
      const { title, description } = deriveTitleAndDescription(blockText)
      setSetName(title)
      setSetDescription(description)
    } catch (err) {
      console.error('Error generating flashcards:', err)
      setError('Error generating flashcards.')
    }
    setLoading(false)
  }

  // Update flashcard fields as the user edits them.
  const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
    setFlashcards(prev =>
      prev.map(card => (card.id === id ? { ...card, [field]: value } : card))
    )
  }

  // Remove a flashcard from the list.
  const removeFlashcard = (id: number) => {
    setFlashcards(prev => prev.filter(card => card.id !== id))
  }

  // Save the flashcard set (with title and description) to Firestore.
  const saveCardSet = async () => {
    if (!currentUser) {
      setError('You must be logged in to save card sets.')
      return
    }
    if (!setName.trim()) {
      setError('Please provide a title for the card set.')
      return
    }
    setError('')

    // Trim flashcards, title, and description.
    const trimmedFlashcards = flashcards.map(card => ({
      ...card,
      question: trimWords(card.question, 20),
      answer: trimWords(card.answer, 40)
    }))

    // Filter out any flashcards with empty question or answer.
    const validFlashcards = trimmedFlashcards.filter(
      card => card.question.trim() && card.answer.trim()
    )

    if (validFlashcards.length === 0) {
      setError('Please ensure at least one flashcard has a non-empty question and answer.')
      return
    }

    const trimmedTitle = trimWords(setName, 10)
    const trimmedDescription = trimWords(setDescription, 50)

    const newSet = {
      // 'id' is not needed by the API schema but kept for client-side uniqueness.
      title: trimmedTitle,
      description: trimmedDescription,
      cards: validFlashcards,
      createdBy: {
        uid: currentUser.uid,
        displayName: currentUser.displayName || 'Anonymous',
        email: currentUser.email || ''
      },
      lastReviewed: 0,
      reviewCount: 0
    }

    console.log('Saving card set with payload:', newSet) // Debug log

    try {
      const response = await fetch('/api/cardsets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSet)
      })
      const result = await response.json()
      if (result.success) {
        setFlashcards([])
        setSetName('')
        setSetDescription('')
        setBlockText('')
      } else {
        setError(result.error || 'Failed to save card set.')
      }
    } catch (err) {
      console.error('Error saving card set:', err)
      setError('Error saving card set.')
    }
  }

  return (
    <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)]">
      <div className="w-full max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold mb-6 text-center"
          style={{ color: '#0D005B' }}
        >
          Flashcard Generator
        </h1>

        <div className="mb-6">
          <Textarea
            value={blockText}
            onChange={(e) => setBlockText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-40 p-4 border border-gray-300 rounded"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-8">
          <Button
            onClick={generateFlashcards}
            disabled={loading}
            className="text-white px-6 py-3"
            style={{ backgroundColor: '#0D005B' }}
          >
            {loading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </div>

        {flashcards.length > 0 && (
          <>
            <div className="mb-6">
              <Input
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="Enter set title"
                className="w-full mb-4 text-xl p-4"
              />
              <Textarea
                value={setDescription}
                onChange={(e) => setSetDescription(e.target.value)}
                placeholder="Enter set description"
                className="w-full text-xl p-4 border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-6">
              {flashcards.map((card, index) => (
                <div
                  key={card.id}
                  className="p-4 bg-white rounded shadow flex flex-col"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">Card {index + 1}</span>
                    <Button
                      onClick={() => removeFlashcard(card.id)}
                      className="text-red-500"
                      title="Remove Card"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </Button>
                  </div>
                  <Input
                    value={card.question}
                    onChange={(e) =>
                      updateFlashcard(card.id, 'question', e.target.value)
                    }
                    placeholder="Question"
                    className="mb-2 text-xl p-3"
                  />
                  <Input
                    value={card.answer}
                    onChange={(e) =>
                      updateFlashcard(card.id, 'answer', e.target.value)
                    }
                    placeholder="Answer"
                    className="text-xl p-3"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <Button
                onClick={saveCardSet}
                className="text-white text-2xl py-4 px-10 flex items-center"
                style={{ backgroundColor: '#0D005B' }}
              >
                <SaveIcon className="mr-2 w-6 h-6" />
                Save Card Set
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
