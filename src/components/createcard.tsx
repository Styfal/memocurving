'use client'

// Create Card is the page itself. "create-card-set is the component I am using"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PlusIcon, EditIcon, BookOpenIcon, BrainIcon } from 'lucide-react'
import Sidebar from './sidebar'
import CreateCardSet from './create-card-set'
import EditCardSets from './edit-card-sets'
import TestCreate from './test-create'
import AICreate from './ai-create'

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

interface TestQuestion {
  id: number
  question: string
  answerType: 'multiple' | 'short'
  options?: string[]
  correctAnswer: string
  image: string | null
}

interface TestSet {
  id: number
  name: string
  description: string
  questions: TestQuestion[]
}

export default function CreateCards() {
  const [cardSets, setCardSets] = useState<(CardSet | TestSet)[]>([])
  const [currentPage, setCurrentPage] = useState('create')
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  const renderContent = () => {
    switch (currentPage) {
      case 'create':
        return <CreateCardSet setCardSets={setCardSets} setNotification={setNotification} />
      case 'edit':
        return <EditCardSets cardSets={cardSets} setCardSets={setCardSets} setNotification={setNotification} />
      case 'test':
        return <TestCreate setCardSets={setCardSets} setNotification={setNotification} />
      case 'ai':
        return <AICreate />
      default:
        return null
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-cyan-800">
          {currentPage === 'create' ? 'Create Card Set' :
           currentPage === 'edit' ? 'Edit Card Sets' :
           currentPage === 'test' ? 'Test Create' :
           currentPage === 'ai' ? 'AI Create' : ''}
        </h1>
        {notification && (
          <Alert variant={notification.type === 'success' ? 'default' : 'destructive'} className="mb-4">
            <AlertTitle>{notification.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{notification.message}</AlertDescription>
          </Alert>
        )}
        {renderContent()}
      </div>
    </div>
  )
}