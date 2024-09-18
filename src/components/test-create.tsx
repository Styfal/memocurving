import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon } from 'lucide-react'


// Need to setup backend stuff here too! 
// I need to make a UI for the test itself lol forgot about that!

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

interface TestCreateProps {
  setCardSets: React.Dispatch<React.SetStateAction<(CardSet | TestSet)[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function TestCreate({ setCardSets, setNotification }: TestCreateProps) {
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [testSetName, setTestSetName] = useState('')
  const [testSetDescription, setTestSetDescription] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTestQuestion = () => {
    setTestQuestions([...testQuestions, {
      id: Date.now(),
      question: '',
      answerType: 'multiple',
      options: ['', '', '', ''],
      correctAnswer: '',
      image: null
    }])
  }

  const updateTestQuestion = (id: number, field: keyof TestQuestion, value: any) => {
    setTestQuestions(testQuestions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const removeTestQuestion = (id: number) => {
    setTestQuestions(testQuestions.filter(q => q.id !== id))
  }

  const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setTestQuestions(testQuestions.map(question =>
          question.id === id ? { ...question, image: reader.result as string } : question
        ))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = (id: number) => {
    setTestQuestions(testQuestions.map(question =>
      question.id === id ? { ...question, image: null } : question
    ))
  }

  const saveTestSet = () => {
    if (testQuestions.length > 0 && testSetName.trim()) {
      const newTestSet: TestSet = {
        id: Date.now(),
        name: testSetName.trim().split(' ').slice(0, 10).join(' '),
        description: testSetDescription.trim().split(' ').slice(0, 50).join(' '),
        questions: testQuestions
      }
      setCardSets(prev => [...prev, newTestSet])
      setNotification({ type: 'success', message: `Test set "${newTestSet.name}" saved successfully!` })
      setTestQuestions([])
      setTestSetName('')
      setTestSetDescription('')
    } else {
      setNotification({ type: 'error', message: "Please add at least one question and provide a name for the test set." })
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-set-name" className="text-lg text-cyan-700">Test Set Name (10 words max)</Label>
        <Input
          id="test-set-name"
          value={testSetName}
          onChange={(e) => setTestSetName(e.target.value)}
          placeholder="Enter test set name"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="test-set-description" className="text-lg text-cyan-700">Test Set Description (50 words max)</Label>
        <Textarea
          id="test-set-description"
          value={testSetDescription}
          onChange={(e) => setTestSetDescription(e.target.value)}
          placeholder="Enter test set description"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
      </div>
      {testQuestions.map((question) => (
        <Card key={question.id} className="bg-white/50">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor={`test-question-${question.id}`} className="text-lg text-cyan-700">Question</Label>
              <Input
                id={`test-question-${question.id}`}
                value={question.question}
                onChange={(e) => updateTestQuestion(question.id, 'question', e.target.value)}
                placeholder="Enter the question"
                className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label className="text-lg text-cyan-700">Answer Type</Label>
              <RadioGroup
                value={question.answerType}
                onValueChange={(value) => updateTestQuestion(question.id, 'answerType', value as 'multiple' | 'short')}
                className="flex space-x-4 mt-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="multiple" id={`multiple-${question.id}`} />
                  <Label htmlFor={`multiple-${question.id}`}>Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="short" id={`short-${question.id}`} />
                  <Label htmlFor={`short-${question.id}`}>Short Answer</Label>
                </div>
              </RadioGroup>
            </div>
            {question.answerType === 'multiple' && (
              <div className="space-y-2">
                <Label className="text-lg text-cyan-700">Options</Label>
                {question.options?.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])]
                      newOptions[index] = e.target.value
                      updateTestQuestion(question.id, 'options', newOptions)
                    }}
                    placeholder={`Option ${index + 1}`}
                    className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                ))}
              </div>
            )}
            <div>
              <Label htmlFor={`correct-answer-${question.id}`} className="text-lg text-cyan-700">Correct Answer</Label>
              <Input
                id={`correct-answer-${question.id}`}
                value={question.correctAnswer}
                onChange={(e) => updateTestQuestion(question.id, 'correctAnswer', e.target.value)}
                placeholder="Enter the correct answer"
                className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
            </div>
            <div>
              <Label htmlFor={`test-image-${question.id}`} className="text-lg text-cyan-700">Image</Label>
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
                  id={`test-image-${question.id}`}
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(question.id, e)}
                />
                {question.image && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeImage(question.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    Remove Image
                  </Button>
                )}
              </div>
              {question.image && (
                <div className="mt-2 relative w-full h-40">
                  <Image
                    src={question.image}
                    alt="Uploaded image"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              )}
            </div>
            <Button
              variant="destructive"
              onClick={() => removeTestQuestion(question.id)}
              className="w-full mt-2"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Remove Question
            </Button>
          </CardContent>
        </Card>
      ))}
      <div className="flex justify-between mt-6">
        <Button onClick={addTestQuestion} className="bg-cyan-600 hover:bg-cyan-700 text-white">
          <PlusIcon className="mr-2 h-5 w-5" />
          Add More Questions
        </Button>
        <Button onClick={saveTestSet} className="bg-green-600 hover:bg-green-700 text-white">
          <SaveIcon className="mr-2 h-5 w-5" />
          Save Test Set
        </Button>
      </div>
    </div>
  )
}