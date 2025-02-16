// 'use client'

// import { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { PlusIcon, SaveIcon, TrashIcon } from 'lucide-react'
// import { z } from 'zod'
// import { auth } from '@/lib/firebase'
// import { User } from 'firebase/auth'

// // Maximum allowed questions and word count limits
// const MAX_QUESTIONS = 20
// const MAX_WORD_COUNT = {
//   setName: 10,
//   setDescription: 50,
//   question: 30,
//   answer: 50,
//   option: 50,
// }

// const FreeTestQuestionSchema = z.object({
//   id: z.number(),
//   question: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
//     { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
//   ),
//   answerType: z.enum(['multiple', 'short']),
//   options: z.array(
//     z.string().min(1).refine(
//       val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.option,
//       { message: `Option must be at most ${MAX_WORD_COUNT.option} words.` }
//     )
//   ).optional(),
//   correctAnswer: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
//     { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
//   ),
//   image: z.string().nullable(),
// })
//   .refine(
//     data => data.answerType !== 'multiple' || (data.options && new Set(data.options).size === data.options.length),
//     { message: "Duplicate options are not allowed." }
//   )
//   .refine(
//     data => data.answerType !== 'multiple' || (data.options && data.options.includes(data.correctAnswer)),
//     { message: "Correct answer must be one of the options." }
//   )

// const FlashcardTestQuestionSchema = z.object({
//   id: z.number(),
//   question: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
//     { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
//   ),
//   answerType: z.literal('short'),
//   correctAnswer: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
//     { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
//   ),
//   image: z.string().nullable(),
// })

// const FreeTestSetSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setName,
//     { message: `Test Set name must be at most ${MAX_WORD_COUNT.setName} words.` }
//   ),
//   description: z.string().min(0).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
//     { message: `Test Set description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
//   ),
//   questions: z.array(FreeTestQuestionSchema).min(1).max(MAX_QUESTIONS),
// })

// const FlashcardTestSetSchema = z.object({
//   id: z.number(),
//   name: z.string().min(1).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setName,
//     { message: `Test Set name must be at most ${MAX_WORD_COUNT.setName} words.` }
//   ),
//   description: z.string().min(0).refine(
//     val => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
//     { message: `Test Set description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
//   ),
//   questions: z.array(FlashcardTestQuestionSchema).min(1).max(MAX_QUESTIONS),
// })

// type FreeTestQuestion = z.infer<typeof FreeTestQuestionSchema>
// type FreeTestSet = z.infer<typeof FreeTestSetSchema>
// type FlashcardTestQuestion = z.infer<typeof FlashcardTestQuestionSchema>
// type FlashcardTestSet = z.infer<typeof FlashcardTestSetSchema>

// interface Flashcard {
//   id: number
//   question: string
//   answer: string
//   image: string | null
// }

// export interface FlashcardDeck {
//   id: number
//   title: string
//   description: string
//   cards: Flashcard[]
// }

// interface TestCreateProps {
//   setTestSets: React.Dispatch<React.SetStateAction<(FreeTestSet | FlashcardTestSet)[]>>
//   setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
//   flashcardDeck?: FlashcardDeck
//   existingTestSetsCount?: number
// }

// export default function TestCreate({
//   setTestSets,
//   setNotification,
//   flashcardDeck,
//   existingTestSetsCount = 0,
// }: TestCreateProps) {
//   const [currentUser, setCurrentUser] = useState<User | null>(null)
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user))
//     return () => unsubscribe()
//   }, [])

//   const isFlashcardMode = !!flashcardDeck

//   const initialQuestions = isFlashcardMode
//     ? flashcardDeck!.cards.map((card) => ({
//         id: card.id,
//         question: card.question,
//         answerType: 'short' as const,
//         correctAnswer: card.answer,
//         image: card.image,
//       }))
//     : []

//   const [testQuestions, setTestQuestions] = useState<(FreeTestQuestion | FlashcardTestQuestion)[]>(initialQuestions)
//   const [testSetName, setTestSetName] = useState(isFlashcardMode ? flashcardDeck!.title : '')
//   const [testSetDescription, setTestSetDescription] = useState(isFlashcardMode ? flashcardDeck!.description : '')
//   const [errors, setErrors] = useState<{ [key: string]: string }>({})

//   const addTestQuestion = () => {
//     if (testQuestions.length < MAX_QUESTIONS) {
//       if (isFlashcardMode) {
//         setTestQuestions([
//           ...testQuestions,
//           {
//             id: Date.now(),
//             question: '',
//             answerType: 'short',
//             correctAnswer: '',
//             image: null,
//           },
//         ])
//       } else {
//         setTestQuestions([
//           ...testQuestions,
//           {
//             id: Date.now(),
//             question: '',
//             answerType: 'multiple',
//             options: ['', '', '', ''],
//             correctAnswer: '',
//             image: null,
//           },
//         ])
//       }
//     } else {
//       setNotification({ type: 'error', message: `Maximum of ${MAX_QUESTIONS} questions allowed.` })
//     }
//   }

//   const updateTestQuestion = (
//     id: number,
//     field: keyof (FreeTestQuestion | FlashcardTestQuestion),
//     value: any
//   ) => {
//     setTestQuestions(testQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
//   }

//   const removeTestQuestion = (id: number) => {
//     setTestQuestions(testQuestions.filter((q) => q.id !== id))
//   }

//   const saveTestSet = async () => {
//     if (existingTestSetsCount >= 20) {
//       setNotification({ type: 'error', message: 'Maximum of 20 test sets allowed.' })
//       return
//     }
//     try {
//       if (isFlashcardMode) {
//         const newTestSet: FlashcardTestSet = {
//           id: Date.now(),
//           name: testSetName,
//           description: testSetDescription,
//           questions: testQuestions as FlashcardTestQuestion[],
//         }
//         const validatedSet = FlashcardTestSetSchema.parse(newTestSet)
//         const requestData = {
//           title: validatedSet.name,
//           description: validatedSet.description,
//           questions: validatedSet.questions.map((q) => ({
//             question: q.question,
//             correctAnswer: q.correctAnswer,
//           })),
//           createdAt: new Date().toISOString(),
//           userId: currentUser ? currentUser.uid : 'unknown',
//         }
//         const response = await fetch('/api/tests', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(requestData),
//         })
//         const result = await response.json()
//         if (response.ok) {
//           setNotification({ type: 'success', message: `Test set "${validatedSet.name}" saved successfully!` })
//           setTestSets((prev) => [...prev, validatedSet])
//           setTestQuestions([])
//           setTestSetName('')
//           setTestSetDescription('')
//           setErrors({})
//         } else {
//           setNotification({ type: 'error', message: `Error: ${result.error}` })
//         }
//       } else {
//         const newTestSet: FreeTestSet = {
//           id: Date.now(),
//           name: testSetName,
//           description: testSetDescription,
//           questions: testQuestions as FreeTestQuestion[],
//         }
//         const validatedSet = FreeTestSetSchema.parse(newTestSet)
//         const requestData = {
//           title: validatedSet.name,
//           description: validatedSet.description,
//           questions: validatedSet.questions.map((q) => ({
//             question: q.question,
//             answerType: q.answerType,
//             correctAnswer: q.correctAnswer,
//             ...(q.answerType === 'multiple' && { options: q.options }),
//           })),
//           createdAt: new Date().toISOString(),
//           userId: currentUser ? currentUser.uid : 'unknown',
//         }
//         const response = await fetch('/api/tests', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(requestData),
//         })
//         const result = await response.json()
//         if (response.ok) {
//           setNotification({ type: 'success', message: `Test set "${validatedSet.name}" saved successfully!` })
//           setTestSets((prev) => [...prev, validatedSet])
//           setTestQuestions([])
//           setTestSetName('')
//           setTestSetDescription('')
//           setErrors({})
//         } else {
//           setNotification({ type: 'error', message: `Error: ${result.error}` })
//         }
//       }
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         const newErrors: { [key: string]: string } = {}
//         error.errors.forEach((err) => {
//           newErrors[err.path.join('.')] = err.message
//         })
//         setErrors(newErrors)
//         setNotification({ type: 'error', message: "Please correct the errors in the form." })
//       }
//     }
//   }

//   return (
//     <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)] flex flex-col items-center">
//       <div className="w-full max-w-4xl space-y-4">
//         <div className="space-y-2">
//           <Label htmlFor="test-set-name" className="text-lg text-cyan-700">
//             Test Set Name (10 words max)
//           </Label>
//           <Input
//             id="test-set-name"
//             value={testSetName}
//             onChange={(e) => setTestSetName(e.target.value)}
//             placeholder="Enter test set name"
//             className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//           />
//           {errors['name'] && <p className="text-red-500 text-lg">{errors['name']}</p>}
//         </div>
//         <div className="space-y-2">
//           <Label htmlFor="test-set-description" className="text-lg text-cyan-700">
//             Test Set Description (50 words max)
//           </Label>
//           <Textarea
//             id="test-set-description"
//             value={testSetDescription}
//             onChange={(e) => setTestSetDescription(e.target.value)}
//             placeholder="Enter test set description"
//             className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//           />
//           {errors['description'] && <p className="text-red-500 text-lg">{errors['description']}</p>}
//         </div>

//         {/* Header Row: Questions Counter & Add Question Button */}
//         <div className="flex items-center justify-between mt-8">
//           <p className="text-lg font-semibold text-gray-700">
//             {`Questions: ${testQuestions.length} of ${MAX_QUESTIONS}`}
//           </p>
//           <Button
//             variant="secondary"
//             onClick={addTestQuestion}
//             disabled={testQuestions.length >= MAX_QUESTIONS}
//             className="mr-2"
//           >
//             <PlusIcon className="w-4 h-4 mr-2" />
//             Add Question
//           </Button>
//         </div>

//         {testQuestions.map((question) => (
//           <Card key={question.id} className="bg-white/50">
//             <CardContent className="p-4 space-y-4">
//               <div>
//                 <Label htmlFor={`test-question-${question.id}`} className="text-lg text-cyan-700">
//                   Question (30 words max)
//                 </Label>
//                 <Input
//                   id={`test-question-${question.id}`}
//                   value={question.question}
//                   onChange={(e) => updateTestQuestion(question.id, 'question', e.target.value)}
//                   placeholder="Enter the question"
//                   className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>
//               {!isFlashcardMode && (
//                 <div>
//                   <Label className="text-lg text-cyan-700">Answer Type</Label>
//                   <RadioGroup
//                     value={question.answerType}
//                     onValueChange={(value) => updateTestQuestion(question.id, 'answerType', value)}
//                     className="flex space-x-4 mt-1"
//                   >
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="multiple" id={`multiple-${question.id}`} />
//                       <Label htmlFor={`multiple-${question.id}`}>Multiple Choice</Label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <RadioGroupItem value="short" id={`short-${question.id}`} />
//                       <Label htmlFor={`short-${question.id}`}>Short Answer</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//               )}
//               {!isFlashcardMode && question.answerType === 'multiple' && (
//                 <div className="space-y-2">
//                   <Label className="text-lg text-cyan-700">
//                     Options (50 words max each)
//                   </Label>
//                   {question.options?.map((option, optionIndex) => (
//                     <Input
//                       key={optionIndex}
//                       value={option}
//                       onChange={(e) => {
//                         const newOptions = [...(question.options || [])]
//                         newOptions[optionIndex] = e.target.value
//                         updateTestQuestion(question.id, 'options', newOptions)
//                       }}
//                       placeholder={`Option ${optionIndex + 1}`}
//                       className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                     />
//                   ))}
//                 </div>
//               )}
//               <div>
//                 <Label htmlFor={`correct-answer-${question.id}`} className="text-lg text-cyan-700">
//                   Correct Answer (50 words max)
//                 </Label>
//                 <Input
//                   id={`correct-answer-${question.id}`}
//                   value={question.correctAnswer}
//                   onChange={(e) => updateTestQuestion(question.id, 'correctAnswer', e.target.value)}
//                   placeholder="Enter the correct answer"
//                   className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
//                 />
//               </div>
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => removeTestQuestion(question.id)}
//               >
//                 <TrashIcon className="w-4 h-4 mr-1" />
//                 Delete Question
//               </Button>
//             </CardContent>
//           </Card>
//         ))}

//         <Button
//           variant="default"
//           onClick={saveTestSet}
//           disabled={!testSetName || testQuestions.length === 0}
//           className="mr-2"
//         >
//           <SaveIcon className="w-4 h-4 mr-2" />
//           Save Test Set
//         </Button>
//       </div>
//     </div>
//   )
// }

'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusIcon, SaveIcon, TrashIcon, ChevronUp, ChevronDown } from 'lucide-react'
import { z } from 'zod'
import { auth } from '@/lib/firebase'
import { User } from 'firebase/auth'

// Maximum allowed questions and word count limits
const MAX_QUESTIONS = 20
const MAX_WORD_COUNT = {
  setName: 10,
  setDescription: 50,
  question: 30,
  answer: 50,
  option: 50,
}

const FreeTestQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
    { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
  ),
  answerType: z.enum(['multiple', 'short']),
  options: z.array(
    z.string().min(1).refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.option,
      { message: `Option must be at most ${MAX_WORD_COUNT.option} words.` }
    )
  ).optional(),
  correctAnswer: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
    { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
  ),
  image: z.string().nullable(),
})
  .refine(
    (data) =>
      data.answerType !== 'multiple' ||
      (data.options && new Set(data.options).size === data.options.length),
    { message: "Duplicate options are not allowed." }
  )
  .refine(
    (data) =>
      data.answerType !== 'multiple' ||
      (data.options && data.options.includes(data.correctAnswer)),
    { message: "Correct answer must be one of the options." }
  )

const FlashcardTestQuestionSchema = z.object({
  id: z.number(),
  question: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.question,
    { message: `Question must be at most ${MAX_WORD_COUNT.question} words.` }
  ),
  answerType: z.literal('short'),
  correctAnswer: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.answer,
    { message: `Answer must be at most ${MAX_WORD_COUNT.answer} words.` }
  ),
  image: z.string().nullable(),
})

const FreeTestSetSchema = z.object({
  id: z.number(),
  name: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setName,
    { message: `Test Set name must be at most ${MAX_WORD_COUNT.setName} words.` }
  ),
  description: z.string().min(0).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
    { message: `Test Set description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
  ),
  questions: z.array(FreeTestQuestionSchema).min(1).max(MAX_QUESTIONS),
})

const FlashcardTestSetSchema = z.object({
  id: z.number(),
  name: z.string().min(1).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setName,
    { message: `Test Set name must be at most ${MAX_WORD_COUNT.setName} words.` }
  ),
  description: z.string().min(0).refine(
    (val) => val.split(/\s+/).filter(Boolean).length <= MAX_WORD_COUNT.setDescription,
    { message: `Test Set description must be at most ${MAX_WORD_COUNT.setDescription} words.` }
  ),
  questions: z.array(FlashcardTestQuestionSchema).min(1).max(MAX_QUESTIONS),
})

type FreeTestQuestion = z.infer<typeof FreeTestQuestionSchema>
type FreeTestSet = z.infer<typeof FreeTestSetSchema>
type FlashcardTestQuestion = z.infer<typeof FlashcardTestQuestionSchema>
type FlashcardTestSet = z.infer<typeof FlashcardTestSetSchema>

interface Flashcard {
  id: number
  question: string
  answer: string
  image: string | null
}

export interface FlashcardDeck {
  id: number
  title: string
  description: string
  cards: Flashcard[]
}

interface TestCreateProps {
  setTestSets: React.Dispatch<React.SetStateAction<(FreeTestSet | FlashcardTestSet)[]>>
  setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
  flashcardDeck?: FlashcardDeck
  existingTestSetsCount?: number
}

export default function TestCreate({
  setTestSets,
  setNotification,
  flashcardDeck,
  existingTestSetsCount = 0,
}: TestCreateProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => setCurrentUser(user))
    return () => unsubscribe()
  }, [])

  const isFlashcardMode = !!flashcardDeck

  const initialQuestions = isFlashcardMode
    ? flashcardDeck!.cards.map((card) => ({
        id: card.id,
        question: card.question,
        answerType: 'short' as const,
        correctAnswer: card.answer,
        image: card.image,
      }))
    : []

  const [testQuestions, setTestQuestions] = useState<(FreeTestQuestion | FlashcardTestQuestion)[]>(initialQuestions)
  const [testSetName, setTestSetName] = useState(isFlashcardMode ? flashcardDeck!.title : '')
  const [testSetDescription, setTestSetDescription] = useState(isFlashcardMode ? flashcardDeck!.description : '')
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // State to track which questions are collapsed
  const [collapsedQuestions, setCollapsedQuestions] = useState<Record<number, boolean>>({})

  const addTestQuestion = () => {
    if (testQuestions.length < MAX_QUESTIONS) {
      if (isFlashcardMode) {
        setTestQuestions([
          ...testQuestions,
          {
            id: Date.now(),
            question: '',
            answerType: 'short',
            correctAnswer: '',
            image: null,
          },
        ])
      } else {
        setTestQuestions([
          ...testQuestions,
          {
            id: Date.now(),
            question: '',
            answerType: 'multiple',
            options: ['', '', '', ''],
            correctAnswer: '',
            image: null,
          },
        ])
      }
    } else {
      setNotification({ type: 'error', message: `Maximum of ${MAX_QUESTIONS} questions allowed.` })
    }
  }

  const updateTestQuestion = (
    id: number,
    field: keyof (FreeTestQuestion | FlashcardTestQuestion),
    value: any
  ) => {
    setTestQuestions(testQuestions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const removeTestQuestion = (id: number) => {
    setTestQuestions(testQuestions.filter((q) => q.id !== id))
    // Also remove collapse state if present
    setCollapsedQuestions((prev) => {
      const newState = { ...prev }
      delete newState[id]
      return newState
    })
  }

  const toggleCollapse = (id: number) => {
    setCollapsedQuestions((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const saveTestSet = async () => {
    if (existingTestSetsCount >= 20) {
      setNotification({ type: 'error', message: 'Maximum of 20 test sets allowed.' })
      return
    }
    try {
      if (isFlashcardMode) {
        const newTestSet: FlashcardTestSet = {
          id: Date.now(),
          name: testSetName,
          description: testSetDescription,
          questions: testQuestions as FlashcardTestQuestion[],
        }
        const validatedSet = FlashcardTestSetSchema.parse(newTestSet)
        const requestData = {
          title: validatedSet.name,
          description: validatedSet.description,
          questions: validatedSet.questions.map((q) => ({
            question: q.question,
            correctAnswer: q.correctAnswer,
          })),
          createdAt: new Date().toISOString(),
          userId: currentUser ? currentUser.uid : 'unknown',
        }
        const response = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        })
        const result = await response.json()
        if (response.ok) {
          setNotification({ type: 'success', message: `Test set "${validatedSet.name}" saved successfully!` })
          setTestSets((prev) => [...prev, validatedSet])
          setTestQuestions([])
          setTestSetName('')
          setTestSetDescription('')
          setErrors({})
        } else {
          setNotification({ type: 'error', message: `Error: ${result.error}` })
        }
      } else {
        const newTestSet: FreeTestSet = {
          id: Date.now(),
          name: testSetName,
          description: testSetDescription,
          questions: testQuestions as FreeTestQuestion[],
        }
        const validatedSet = FreeTestSetSchema.parse(newTestSet)
        const requestData = {
          title: validatedSet.name,
          description: validatedSet.description,
          questions: validatedSet.questions.map((q) => ({
            question: q.question,
            answerType: q.answerType,
            correctAnswer: q.correctAnswer,
            ...(q.answerType === 'multiple' && { options: q.options }),
          })),
          createdAt: new Date().toISOString(),
          userId: currentUser ? currentUser.uid : 'unknown',
        }
        const response = await fetch('/api/tests', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        })
        const result = await response.json()
        if (response.ok) {
          setNotification({ type: 'success', message: `Test set "${validatedSet.name}" saved successfully!` })
          setTestSets((prev) => [...prev, validatedSet])
          setTestQuestions([])
          setTestSetName('')
          setTestSetDescription('')
          setErrors({})
        } else {
          setNotification({ type: 'error', message: `Error: ${result.error}` })
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: { [key: string]: string } = {}
        error.errors.forEach((err) => {
          newErrors[err.path.join('.')] = err.message
        })
        setErrors(newErrors)
        setNotification({ type: 'error', message: "Please correct the errors in the form." })
      }
    }
  }

  return (
    <div className="ml-64 mt-16 p-8 w-[calc(100%-16rem)] flex flex-col items-center">
      <div className="w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="test-set-name" className="text-lg text-cyan-700">
            Test Set Name (10 words max)
          </Label>
          <Input
            id="test-set-name"
            value={testSetName}
            onChange={(e) => setTestSetName(e.target.value)}
            placeholder="Enter test set name"
            className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
          />
          {errors['name'] && <p className="text-red-500 text-lg">{errors['name']}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="test-set-description" className="text-lg text-cyan-700">
            Test Set Description (50 words max)
          </Label>
          <Textarea
            id="test-set-description"
            value={testSetDescription}
            onChange={(e) => setTestSetDescription(e.target.value)}
            placeholder="Enter test set description"
            className="bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
          />
          {errors['description'] && <p className="text-red-500 text-lg">{errors['description']}</p>}
        </div>

        {/* Header Row: Questions Counter & Add Question Button */}
        <div className="flex items-center justify-between mt-8">
          <p className="text-lg font-semibold text-gray-700">
            {`Questions: ${testQuestions.length} of ${MAX_QUESTIONS}`}
          </p>
          <Button
            variant="secondary"
            onClick={addTestQuestion}
            disabled={testQuestions.length >= MAX_QUESTIONS}
            className="mr-2"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Question
          </Button>
        </div>

        {testQuestions.map((question, index) => (
          <Card key={question.id} className="bg-white/50">
            {/* Card Header with Collapse Toggle */}
            <div className="flex items-center justify-between p-4 border-b">
              <p className="text-lg font-bold text-gray-800">Question {index + 1}</p>
              <Button
                variant="secondary"
                onClick={() => toggleCollapse(question.id)}
                className="p-2"
              >
                {collapsedQuestions[question.id] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
              </Button>
            </div>
            {!collapsedQuestions[question.id] && (
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor={`test-question-${question.id}`} className="text-lg text-cyan-700">
                    Question (30 words max)
                  </Label>
                  <Input
                    id={`test-question-${question.id}`}
                    value={question.question}
                    onChange={(e) => updateTestQuestion(question.id, 'question', e.target.value)}
                    placeholder="Enter the question"
                    className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                {!isFlashcardMode && (
                  <div>
                    <Label className="text-lg text-cyan-700">Answer Type</Label>
                    <RadioGroup
                      value={question.answerType}
                      onValueChange={(value) => updateTestQuestion(question.id, 'answerType', value)}
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
                )}
                {!isFlashcardMode && question.answerType === 'multiple' && (
                  <div className="space-y-2">
                    <Label className="text-lg text-cyan-700">
                      Options (50 words max each)
                    </Label>
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
                  </div>
                )}
                <div>
                  <Label htmlFor={`correct-answer-${question.id}`} className="text-lg text-cyan-700">
                    Correct Answer (50 words max)
                  </Label>
                  <Input
                    id={`correct-answer-${question.id}`}
                    value={question.correctAnswer}
                    onChange={(e) => updateTestQuestion(question.id, 'correctAnswer', e.target.value)}
                    placeholder="Enter the correct answer"
                    className="mt-1 bg-white/50 border-cyan-200 focus:border-cyan-500 focus:ring-cyan-500"
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeTestQuestion(question.id)}
                >
                  <TrashIcon className="w-4 h-4 mr-1" />
                  Delete Question
                </Button>
              </CardContent>
            )}
          </Card>
        ))}

        <Button
          variant="default"
          onClick={saveTestSet}
          disabled={!testSetName || testQuestions.length === 0}
          className="mr-2"
        >
          <SaveIcon className="w-4 h-4 mr-2" />
          Save Test Set
        </Button>
      </div>
    </div>
  )
}
