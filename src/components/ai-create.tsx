

// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { Textarea } from '@/components/ui/textarea'
// import { SaveIcon, TrashIcon } from 'lucide-react'
// import { auth } from '@/lib/firebase'
// import { User } from 'firebase/auth'

// interface Flashcard {
//   id: number
//   question: string
//   answer: string
//   image?: string | null
// }

// export default function FlashcardGenerator() {
//   const [blockText, setBlockText] = useState('')
//   const [flashcards, setFlashcards] = useState<Flashcard[]>([])
//   const [setName, setSetName] = useState('')
//   const [setDescription, setSetDescription] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [currentUser, setCurrentUser] = useState<User | null>(null)

//   // Local notification state for popup messages
//   const [notification, setNotificationState] = useState<{ type: 'success' | 'error', message: string } | null>(null)

//   // Helper to display a notification popup
//   const showNotification = (notif: { type: 'success' | 'error', message: string }) => {
//     setNotificationState(notif)
//     console.log('Notification:', notif) // Debug log
//   }

//   // Auto-dismiss notification after 5 seconds
//   useEffect(() => {
//     if (notification) {
//       const timer = setTimeout(() => setNotificationState(null), 5000)
//       return () => clearTimeout(timer)
//     }
//   }, [notification])

//   // Listen for auth changes.
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user))
//     return () => unsubscribe()
//   }, [])

//   // Helper to trim a string to a specified number of words.
//   const trimWords = (text: string, limit: number) => {
//     const words = text.split(/\s+/)
//     return words.length <= limit ? text : words.slice(0, limit).join(' ')
//   }

//   // Helper to derive a title and description from the generated flashcards.
//   const deriveTitleAndDescription = (text: string, cards: Flashcard[]) => {
//     if (cards.length > 0) {
//       const rawTitle = cards[0].question || text.split(' ').slice(0, 10).join(' ')
//       const rawDescription = cards[0].answer || text.split(' ').slice(0, 50).join(' ')
//       return {
//         title: trimWords(rawTitle, 10),
//         description: trimWords(rawDescription, 50)
//       }
//     }
//     // Fallback: derive title from the first sentence or first 10 words,
//     // and description from the first 50 words.
//     const sentenceMatch = text.match(/([^.!?]+[.!?])\s*/)
//     let title =
//       sentenceMatch && sentenceMatch[0]
//         ? sentenceMatch[0].trim()
//         : text.split(' ').slice(0, 10).join(' ')
//     title = title.split(/\s+/).length > 10 ? title.split(/\s+/).slice(0, 10).join(' ') : title
//     const description = text.split(/\s+/).slice(0, 50).join(' ')
//     return { title, description }
//   }

//   // Constructs the prompt on the client side, calls the OpenAI endpoint,
//   // and then parses the JSON response into flashcards.
//   const generateFlashcards = async () => {
//     if (!blockText.trim()) {
//       showNotification({ type: 'error', message: 'Please paste some text to generate flashcards.' })
//       return
//     }

//     // Check if the text exceeds 800 words.
//     const wordCount = blockText.split(/\s+/).filter(Boolean).length
//     if (wordCount > 800) {
//       showNotification({ type: 'error', message: 'The text exceeds the 800-word limit. Please shorten your text.' })
//       return
//     }

//     setLoading(true)

//     const flashcardPrompt = `Convert the following text into flashcards. Generate a JSON array where each element is an object with "question" and "answer" keys. Ensure the JSON is properly formatted. Text: ${blockText}`

//     try {
//       const response = await fetch('/api/ai/openai', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: flashcardPrompt, type: 'flashcard' })
//       })
//       const data = await response.json()
//       const rawContent = data.choices && data.choices[0]?.message?.content
//       if (!rawContent) {
//         showNotification({ type: 'error', message: 'No response from AI.' })
//         setLoading(false)
//         return
//       }

//       let cardsData
//       try {
//         cardsData = JSON.parse(rawContent)
//       } catch (parseError) {
//         showNotification({ type: 'error', message: 'Failed to parse flashcards from AI response.' })
//         setLoading(false)
//         return
//       }

//       if (!Array.isArray(cardsData)) {
//         showNotification({ type: 'error', message: 'Unexpected flashcards format. Expected a JSON array.' })
//         setLoading(false)
//         return
//       }

//       const cards: Flashcard[] = cardsData.map(
//         (card: { question: string; answer: string }, index: number) => ({
//           id: Date.now() + index,
//           question: card.question,
//           answer: card.answer,
//           image: null
//         })
//       )
//       setFlashcards(cards)
//       const { title, description } = deriveTitleAndDescription(blockText, cards)
//       setSetName(title)
//       setSetDescription(description)
//       showNotification({ type: 'success', message: 'Flashcards generated successfully!' })
//     } catch (err) {
//       console.error('Error generating flashcards:', err)
//       showNotification({ type: 'error', message: 'Error generating flashcards.' })
//     }
//     setLoading(false)
//   }

//   // Update flashcard fields as the user edits them.
//   const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
//     setFlashcards(prev =>
//       prev.map(card => (card.id === id ? { ...card, [field]: value } : card))
//     )
//   }

//   // Remove a flashcard from the list.
//   const removeFlashcard = (id: number) => {
//     setFlashcards(prev => prev.filter(card => card.id !== id))
//     showNotification({ type: 'success', message: 'Flashcard removed successfully!' })
//   }

//   // Save the flashcard set (with title and description) to Firestore.
//   const saveCardSet = async () => {
//     if (!currentUser) {
//       showNotification({ type: 'error', message: 'You must be logged in to save card sets.' })
//       return
//     }
//     if (!setName.trim()) {
//       showNotification({ type: 'error', message: 'Please provide a title for the card set.' })
//       return
//     }

//     // Trim flashcards, title, and description.
//     const trimmedFlashcards = flashcards.map(card => ({
//       ...card,
//       question: trimWords(card.question, 20),
//       answer: trimWords(card.answer, 40)
//     }))

//     // Filter out any flashcards with empty question or answer.
//     const validFlashcards = trimmedFlashcards.filter(
//       card => card.question.trim() && card.answer.trim()
//     )

//     if (validFlashcards.length === 0) {
//       showNotification({ type: 'error', message: 'Please ensure at least one flashcard has a non-empty question and answer.' })
//       return
//     }

//     const trimmedTitle = trimWords(setName, 10)
//     const trimmedDescription = trimWords(setDescription, 50)

//     const newSet = {
//       title: trimmedTitle,
//       description: trimmedDescription,
//       cards: validFlashcards,
//       createdBy: {
//         uid: currentUser.uid,
//         displayName: currentUser.displayName || 'Anonymous',
//         email: currentUser.email || ''
//       },
//       lastReviewed: 0,
//       reviewCount: 0
//     }

//     console.log('Saving card set with payload:', newSet) // Debug log

//     try {
//       const response = await fetch('/api/cardsets', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(newSet)
//       })
//       const result = await response.json()
//       if (result.success) {
//         setFlashcards([])
//         setSetName('')
//         setSetDescription('')
//         setBlockText('')
//         showNotification({ type: 'success', message: 'Card set saved successfully!' })
//       } else {
//         showNotification({ type: 'error', message: result.error || 'Failed to save card set.' })
//       }
//     } catch (err) {
//       console.error('Error saving card set:', err)
//       showNotification({ type: 'error', message: 'Error saving card set.' })
//     }
//   }

//   // Calculate current word count for blockText.
//   const wordCount = blockText.split(/\s+/).filter(Boolean).length

//   return (
//     <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)]">
//       {/* Notification Popup */}
//       {notification && (
//         <div className="fixed top-4 right-4 z-[9999]">
//           <div className={`p-4 rounded shadow-lg ${notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' : 'bg-green-50 border-l-4 border-green-500 text-green-800'}`}>
//             <p className="text-xl font-medium">{notification.message}</p>
//           </div>
//         </div>
//       )}

//       <div className="w-full max-w-4xl mx-auto">
//         <h1
//           className="text-3xl font-bold mb-6 text-center"
//           style={{ color: '#0D005B' }}
//         >
//           Flashcard Generator
//         </h1>

//         <div className="mb-6">
//           <Textarea
//             value={blockText}
//             onChange={(e) => setBlockText(e.target.value)}
//             placeholder="Paste your text here..."
//             className="w-full h-40 p-4 border border-gray-300 rounded"
//           />
//           <p className="text-gray-600 text-sm mt-2">Word Count: {wordCount}</p>
//         </div>

//         <div className="mb-8">
//           <Button
//             onClick={generateFlashcards}
//             disabled={loading}
//             className="text-white px-6 py-3"
//             style={{ backgroundColor: '#0D005B' }}
//           >
//             {loading ? 'Generating...' : 'Generate Flashcards'}
//           </Button>
//         </div>

//         {flashcards.length > 0 && (
//           <>
//             <div className="mb-6">
//               <Input
//                 value={setName}
//                 onChange={(e) => setSetName(e.target.value)}
//                 placeholder="Enter set title"
//                 className="w-full mb-4 text-xl p-4"
//               />
//               <Textarea
//                 value={setDescription}
//                 onChange={(e) => setSetDescription(e.target.value)}
//                 placeholder="Enter set description"
//                 className="w-full text-xl p-4 border border-gray-300 rounded"
//               />
//             </div>

//             <div className="space-y-6">
//               {flashcards.map((card, index) => (
//                 <div
//                   key={card.id}
//                   className="p-4 bg-white rounded shadow flex flex-col"
//                 >
//                   <div className="flex justify-between items-center mb-2">
//                     <span className="font-bold">Card {index + 1}</span>
//                     <Button
//                       onClick={() => removeFlashcard(card.id)}
//                       className="text-red-500"
//                       title="Remove Card"
//                     >
//                       <TrashIcon className="w-5 h-5" />
//                     </Button>
//                   </div>
//                   <Input
//                     value={card.question}
//                     onChange={(e) =>
//                       updateFlashcard(card.id, 'question', e.target.value)
//                     }
//                     placeholder="Question"
//                     className="mb-2 text-xl p-3"
//                   />
//                   <Input
//                     value={card.answer}
//                     onChange={(e) =>
//                       updateFlashcard(card.id, 'answer', e.target.value)
//                     }
//                     placeholder="Answer"
//                     className="text-xl p-3"
//                   />
//                 </div>
//               ))}
//             </div>

//             <div className="mt-8 flex justify-end">
//               <Button
//                 onClick={saveCardSet}
//                 className="text-white text-2xl py-4 px-10 flex items-center"
//                 style={{ backgroundColor: '#0D005B' }}
//               >
//                 <SaveIcon className="mr-2 w-6 h-6" />
//                 Save Card Set
//               </Button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   )
// }



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
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Local notification state for popup messages
  const [notification, setNotificationState] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  // Helper to display a notification popup
  const showNotification = (notif: { type: 'success' | 'error', message: string }) => {
    setNotificationState(notif)
    console.log('Notification:', notif)
  }

  // Auto-dismiss notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotificationState(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Listen for auth changes.
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setCurrentUser(user))
    return () => unsubscribe()
  }, [])

  // Helper to trim a string to a specified number of words.
  const trimWords = (text: string, limit: number) => {
    const words = text.split(/\s+/)
    return words.length <= limit ? text : words.slice(0, limit).join(' ')
  }

  // Helper to derive a title and description from the generated flashcards.
  const deriveTitleAndDescription = (text: string, cards: Flashcard[]) => {
    if (cards.length > 0) {
      const rawTitle = cards[0].question || text.split(' ').slice(0, 10).join(' ')
      const rawDescription = cards[0].answer || text.split(' ').slice(0, 50).join(' ')
      return {
        title: trimWords(rawTitle, 10),
        description: trimWords(rawDescription, 50)
      }
    }
    const sentenceMatch = text.match(/([^.!?]+[.!?])\s*/)
    let title =
      sentenceMatch && sentenceMatch[0]
        ? sentenceMatch[0].trim()
        : text.split(' ').slice(0, 10).join(' ')
    title = title.split(/\s+/).length > 10 ? title.split(/\s+/).slice(0, 10).join(' ') : title
    const description = text.split(/\s+/).slice(0, 50).join(' ')
    return { title, description }
  }

  // Constructs the prompt, calls the AI endpoint, and parses the JSON response into flashcards.
  const generateFlashcards = async () => {
    if (!blockText.trim()) {
      showNotification({ type: 'error', message: 'Please paste some text to generate flashcards.' })
      return
    }

    const wordCount = blockText.split(/\s+/).filter(Boolean).length
    if (wordCount > 800) {
      showNotification({ type: 'error', message: 'The text exceeds the 800-word limit. Please shorten your text.' })
      return
    }

    setLoading(true)

    const flashcardPrompt = `Convert the following text into flashcards. Generate a JSON array where each element is an object with "question" and "answer" keys. Ensure the JSON is properly formatted. Text: ${blockText}`

    try {
      const response = await fetch('/api/ai/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include the current user's UID for AI usage tracking.
        body: JSON.stringify({ prompt: flashcardPrompt, userId: currentUser?.uid, type: 'flashcard' })
      })
      const data = await response.json()
      const rawContent = data.choices && data.choices[0]?.message?.content
      if (!rawContent) {
        showNotification({ type: 'error', message: 'No response from AI.' })
        setLoading(false)
        return
      }

      let cardsData
      try {
        cardsData = JSON.parse(rawContent)
      } catch (parseError) {
        showNotification({ type: 'error', message: 'Failed to parse flashcards from AI response.' })
        setLoading(false)
        return
      }

      if (!Array.isArray(cardsData)) {
        showNotification({ type: 'error', message: 'Unexpected flashcards format. Expected a JSON array.' })
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
      const { title, description } = deriveTitleAndDescription(blockText, cards)
      setSetName(title)
      setSetDescription(description)
      showNotification({ type: 'success', message: 'Flashcards generated successfully!' })
    } catch (err) {
      console.error('Error generating flashcards:', err)
      showNotification({ type: 'error', message: 'Error generating flashcards.' })
    }
    setLoading(false)
  }

  const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
    setFlashcards(prev =>
      prev.map(card => (card.id === id ? { ...card, [field]: value } : card))
    )
  }

  const removeFlashcard = (id: number) => {
    setFlashcards(prev => prev.filter(card => card.id !== id))
    showNotification({ type: 'success', message: 'Flashcard removed successfully!' })
  }

  const saveCardSet = async () => {
    if (!currentUser) {
      showNotification({ type: 'error', message: 'You must be logged in to save card sets.' })
      return
    }
    if (!setName.trim()) {
      showNotification({ type: 'error', message: 'Please provide a title for the card set.' })
      return
    }

    const trimmedFlashcards = flashcards.map(card => ({
      ...card,
      question: trimWords(card.question, 20),
      answer: trimWords(card.answer, 40)
    }))

    const validFlashcards = trimmedFlashcards.filter(
      card => card.question.trim() && card.answer.trim()
    )

    if (validFlashcards.length === 0) {
      showNotification({ type: 'error', message: 'Please ensure at least one flashcard has a non-empty question and answer.' })
      return
    }

    const trimmedTitle = trimWords(setName, 10)
    const trimmedDescription = trimWords(setDescription, 50)

    const newSet = {
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

    console.log('Saving card set with payload:', newSet)

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
        showNotification({ type: 'success', message: 'Card set saved successfully!' })
      } else {
        showNotification({ type: 'error', message: result.error || 'Failed to save card set.' })
      }
    } catch (err) {
      console.error('Error saving card set:', err)
      showNotification({ type: 'error', message: 'Error saving card set.' })
    }
  }

  const wordCount = blockText.split(/\s+/).filter(Boolean).length

  return (
    <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)]">
      {notification && (
        <div className="fixed top-4 right-4 z-[9999]">
          <div className={`p-4 rounded shadow-lg ${notification.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-800' : 'bg-green-50 border-l-4 border-green-500 text-green-800'}`}>
            <p className="text-xl font-medium">{notification.message}</p>
          </div>
        </div>
      )}

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
          <p className="text-gray-600 text-sm mt-2">Word Count: {wordCount}</p>
        </div>

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
