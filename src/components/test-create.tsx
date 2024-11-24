'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusIcon, SaveIcon, ImageIcon, TrashIcon } from 'lucide-react'
import { z } from 'zod'

const MAX_QUESTIONS = 50
const MAX_WORD_COUNT = {
  setName: 10,
  setDescription: 50,
  question: 100,
  answer: 500,
  option: 100
}

const TestQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(1).max(MAX_WORD_COUNT.question),
  answerType: z.enum(['multiple', 'short']),
  options: z.array(z.string().max(MAX_WORD_COUNT.option)).optional(),
  correctAnswer: z.string().min(1).max(MAX_WORD_COUNT.answer),
  image: z.string().nullable()
})

const TestSetSchema = z.object({
  id: z.number(),
  name: z.string().min(1).max(MAX_WORD_COUNT.setName),
  description: z.string().max(MAX_WORD_COUNT.setDescription),
  questions: z.array(TestQuestionSchema).min(1).max(MAX_QUESTIONS)
})

type TestQuestion = z.infer<typeof TestQuestionSchema>
type TestSet = z.infer<typeof TestSetSchema>

interface TestCreateProps {
  setTestSets: React.Dispatch<React.SetStateAction<TestSet[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function TestCreate({ setTestSets, setNotification }: TestCreateProps) {
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([])
  const [testSetName, setTestSetName] = useState('')
  const [testSetDescription, setTestSetDescription] = useState('')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const addTestQuestion = () => {
    if (testQuestions.length < MAX_QUESTIONS) {
      setTestQuestions([...testQuestions, {
        id: Date.now(),
        question: '',
        answerType: 'multiple',
        options: ['', '', '', ''],
        correctAnswer: '',
        image: null
      }])
    } else {
      setNotification({ type: 'error', message: `Maximum of ${MAX_QUESTIONS} questions allowed.` })
    }
  }

  const updateTestQuestion = (id: number, field: keyof TestQuestion, value: any) => {
    setTestQuestions(testQuestions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ))
  }

  const removeTestQuestion = (id: number) => {
    setTestQuestions(testQuestions.filter(q => q.id !== id))
  }

  

  const removeImage = (id: number) => {
    setTestQuestions(testQuestions.map(question =>
      question.id === id ? { ...question, image: null } : question
    ))
  }

  const saveTestSet = () => {
    try {
      const newTestSet: TestSet = {
        id: Date.now(),
        name: testSetName,
        description: testSetDescription,
        questions: testQuestions
      }
      const validatedSet = TestSetSchema.parse(newTestSet)
      setTestSets(prev => [...prev, validatedSet])
      setNotification({ type: 'success', message: `Test set "${validatedSet.name}" saved successfully!` })
      setTestQuestions([])
      setTestSetName('')
      setTestSetDescription('')
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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="test-set-name" className="text-lg text-cyan-700">Test Set Name ({MAX_WORD_COUNT.setName} words max)</Label>
        <Input
          id="test-set-name"
          value={testSetName}
          onChange={(e) => setTestSetName(e.target.value)}
          placeholder="Enter test set name"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
        {errors['name'] && <p className="text-red-500 text-sm">{errors['name']}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="test-set-description" className="text-lg text-cyan-700">Test Set Description ({MAX_WORD_COUNT.setDescription} words max)</Label>
        <Textarea
          id="test-set-description"
          value={testSetDescription}
          onChange={(e) => setTestSetDescription(e.target.value)}
          placeholder="Enter test set description"
          className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
        />
        {errors['description'] && <p className="text-red-500 text-sm">{errors['description']}</p>}
      </div>
      {testQuestions.map((question, index) => (
        <Card key={question.id} className="bg-white/50">
          <CardContent className="p-4 space-y-4">
            <div>
              <Label htmlFor={`test-question-${question.id}`} className="text-lg text-cyan-700">Question ({MAX_WORD_COUNT.question} words max)</Label>
              <Input
                id={`test-question-${question.id}`}
                value={question.question}
                onChange={(e) => updateTestQuestion(question.id, 'question', e.target.value)}
                placeholder="Enter the question"
                className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
              {errors[`questions.${index}.question`] && <p className="text-red-500 text-sm">{errors[`questions.${index}.question`]}</p>}
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
                <Label className="text-lg text-cyan-700">Options ({MAX_WORD_COUNT.option} words max each)</Label>
                {question.options?.map((option, optionIndex) => (
                  <Input
                    key={optionIndex}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])]
                      newOptions[optionIndex] = e.target.value
                      updateTestQuestion(question.id, 'options', newOptions)
                    }}
                    placeholder={`Option ${optionIndex + 1}`}
                    className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                ))}
                {errors[`questions.${index}.options`] && <p className="text-red-500 text-sm">{errors[`questions.${index}.options`]}</p>}
              </div>
            )}
            <div>
              <Label htmlFor={`correct-answer-${question.id}`} className="text-lg text-cyan-700">Correct Answer ({MAX_WORD_COUNT.answer} words max)</Label>
              <Input
                id={`correct-answer-${question.id}`}
                value={question.correctAnswer}
                onChange={(e) => updateTestQuestion(question.id, 'correctAnswer', e.target.value)}
                placeholder="Enter the correct answer"
                className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
              />
              {errors[`questions.${index}.correctAnswer`] && <p className="text-red-500 text-sm">{errors[`questions.${index}.correctAnswer`]}</p>}
            </div>
          
            <Button variant="destructive" size="sm" onClick={() => removeTestQuestion(question.id)}>
              <TrashIcon className="w-4 h-4 mr-1" />
              Delete Question
            </Button>
          </CardContent>
        </Card>
      ))}
     <Button variant="secondary" onClick={addTestQuestion} disabled={testQuestions.length >= MAX_QUESTIONS} className="mr-2">
  <PlusIcon className="w-4 h-4 mr-2" />
  Add Question
</Button>
<Button variant="default" onClick={saveTestSet} disabled={!testSetName || !testQuestions.length} className="mr-2">
  <SaveIcon className="w-4 h-4 mr-2" />
  Save Test Set
</Button>

    </div>
  )
}
