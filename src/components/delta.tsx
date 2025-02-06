// import React, { useState, useRef } from 'react'
// import Image from 'next/image'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { PlusIcon, SaveIcon, ImageIcon, TrashIcon, EditIcon } from 'lucide-react'

// interface Flashcard {
//     id: number
//     question: string
//     answer: string
//     image: string | null
// }

// interface CardSet {
//     id: number
//     name: string
//     description: string
//     cards: Flashcard[]
// }

// interface TestQuestion {
//     id: number
//     question: string
//     answerType: 'multiple' | 'short'
//     options?: string[]
//     correctAnswer: string
//     image: string | null
// }

// interface TestSet {
//     id: number
//     name: string
//     description: string
//     questions: TestQuestion[]
// }

// interface EditCardSetsProps {
//     cardSets: (CardSet | TestSet)[]
//     setCardSets: React.Dispatch<React.SetStateAction<(CardSet | TestSet)[]>>
//     setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
// }

// export default function EditCardSets({ cardSets, setCardSets, setNotification }: EditCardSetsProps) {
//     const [editingSet, setEditingSet] = useState<CardSet | null>(null)
//     const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const startEditing = (setId: number) => {
//         const set = cardSets.find(s => s.id === setId)
//         if (set && 'cards' in set) {
//             setEditingSet(set)
//             setSelectedSetId(setId)
//         }
//     }

//     const updateFlashcard = (id: number, field: 'question' | 'answer', value: string) => {
//         if (editingSet) {
//             setEditingSet({
//                 ...editingSet,
//                 cards: editingSet.cards.map(card =>
//                     card.id === id ? { ...card, [field]: value } : card
//                 )
//             })
//         }
//     }

//     const handleImageUpload = (id: number, event: React.ChangeEvent<HTMLInputElement>) => {
//         const file = event.target.files?.[0]
//         if (file && editingSet) {
//             const reader = new FileReader()
//             reader.onloadend = () => {
//                 setEditingSet({
//                     ...editingSet,
//                     cards: editingSet.cards.map(card =>
//                         card.id === id ? { ...card, image: reader.result as string } : card
//                     )
//                 })
//             }
//             reader.readAsDataURL(file)
//         }
//     }

//     const removeImage = (id: number) => {
//         if (editingSet) {
//             setEditingSet({
//                 ...editingSet,
//                 cards: editingSet.cards.map(card =>
//                     card.id === id ? { ...card, image: null } : card
//                 )
//             })
//         }
//     }

//     const saveEditedSet = () => {
//         if (editingSet) {
//             setCardSets(cardSets.map(set =>
//                 set.id === editingSet.id ? editingSet : set
//             ))
//             setEditingSet(null)
//             setSelectedSetId(null)
//             setNotification({ type: 'success', message: "Card set updated successfully!" })
//         }
//     }

//     const deleteCardSet = (id: number) => {
//         setCardSets(cardSets.filter(set => set.id !== id))
//         setNotification({ type: 'success', message: "Card set deleted successfully!" })
//     }

//     const addFlashcard = () => {
//         if (editingSet) {
//             setEditingSet({
//                 ...editingSet,
//                 cards: [...editingSet.cards, { id: Date.now(), question: '', answer: '', image: null }]
//             })
//         }
//     }

//     const removeFlashcard = (id: number) => {
//         if (editingSet) {
//             setEditingSet({
//                 ...editingSet,
//                 cards: editingSet.cards.filter(card => card.id !== id)
//             })
//         }
//     }

//     return (
//         <div className="space-y-4">
//             {editingSet ? (
//                 <>
//                     <div className="space-y-2">
//                         <Label htmlFor="edit-set-name" className="text-lg text-purple-700">Set Name (10 words max)</Label>
//                         <Input
//                             id="edit-set-name"
//                             value={editingSet.name}
//                             onChange={(e) => setEditingSet({ ...editingSet, name: e.target.value })}
//                             placeholder="Enter set name"
//                             className="bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                     </div>
//                     <div className="space-y-2">
//                         <Label htmlFor="edit-set-description" className="text-lg text-purple-700">Set Description (50 words max)</Label>
//                         <Textarea
//                             id="edit-set-description"
//                             value={editingSet.description}
//                             onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
//                             placeholder="Enter set description"
//                             className="bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                         />
//                     </div>
//                     {editingSet.cards.map((card) => (
//                         <Card key={card.id} className="bg-white/50">
//                             <CardContent className="p-4 grid grid-cols-2 gap-4">
//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor={`edit-question-${card.id}`} className="text-lg text-purple-700">Question</Label>
//                                         <Input
//                                             id={`edit-question-${card.id}`}
//                                             value={card.question}
//                                             onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
//                                             placeholder="Enter the question"
//                                             className="mt-1 bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                                         />
//                                     </div>
//                                     <div>
//                                         <Label htmlFor={`edit-image-${card.id}`} className="text-lg text-purple-700">Image</Label>
//                                         <div className="mt-1 flex items-center space-x-2">
//                                             <Button
//                                                 type="button"
//                                                 onClick={() => fileInputRef.current?.click()}
//                                                 className="bg-purple-600 hover:bg-purple-700 text-white"
//                                             >
//                                                 <ImageIcon className="mr-2 h-4 w-4" />
//                                                 Upload Image
//                                             </Button>
//                                             <input
//                                                 type="file"
//                                                 id={`edit-image-${card.id}`}
//                                                 ref={fileInputRef}
//                                                 className="hidden"
//                                                 accept="image/*"
//                                                 onChange={(e) => handleImageUpload(card.id, e)}
//                                             />
//                                             {card.image && (
//                                                 <Button
//                                                     type="button"
//                                                     variant="outline"
//                                                     onClick={() => removeImage(card.id)}
//                                                     className="text-red-500 hover:text-red-700"
//                                                 >
//                                                     <TrashIcon className="mr-2 h-4 w-4" />
//                                                     Remove Image
//                                                 </Button>
//                                             )}
//                                         </div>
//                                         {card.image && (
//                                             <div className="mt-2 relative w-full h-40">
//                                                 <Image
//                                                     src={card.image}
//                                                     alt="Uploaded image"
//                                                     layout="fill"
//                                                     objectFit="contain"
//                                                 />
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="space-y-4">
//                                     <div>
//                                         <Label htmlFor={`edit-answer-${card.id}`} className="text-lg text-purple-700">Answer</Label>
//                                         <Input
//                                             id={`edit-answer-${card.id}`}
//                                             value={card.answer}
//                                             onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
//                                             placeholder="Enter the answer"
//                                             className="mt-1 bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
//                                         />
//                                     </div>
//                                     <Button
//                                         variant="destructive"
//                                         onClick={() => removeFlashcard(card.id)}
//                                         className="w-full mt-2"
//                                     >
//                                         <TrashIcon className="mr-2 h-4 w-4" />
//                                         Remove Card
//                                     </Button>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                     <div className="flex justify-between mt-6">
//                         <Button onClick={addFlashcard} className="bg-purple-600 hover:bg-purple-700 text-white">
//                             <PlusIcon className="mr-2 h-5 w-5" />
//                             Add More Cards
//                         </Button>
//                         <Button onClick={saveEditedSet} className="bg-green-600 hover:bg-green-700 text-white">
//                             <SaveIcon className="mr-2 h-5 w-5" />
//                             Save Changes
//                         </Button>
//                     </div>
//                 </>
//             ) : (
//                 <>
//                     <Select onValueChange={(value) => startEditing(Number(value))}>
//                         <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select a card set to edit" />
//                         </SelectTrigger>
//                         <SelectContent>
//                             {cardSets.map((set) => (
//                                 <SelectItem key={set.id} value={set.id.toString()}>{set.name}</SelectItem>
//                             ))}
//                         </SelectContent>
//                     </Select>
//                     {cardSets.map((set) => (
//                         <Card key={set.id} className="bg-white/50">
//                             <CardContent className="p-4">
//                                 <h3 className="text-lg font-semibold text-purple-700">{set.name}</h3>
//                                 <p className="text-sm text-gray-600 mt-1">{set.description}</p>
//                                 <p className="text-sm text-gray-600 mt-1">
//                                     {('cards' in set) ? `Cards: ${set.cards.length}` : `Questions: ${set.questions.length}`}
//                                 </p>
//                                 <div className="flex justify-end space-x-2 mt-4">
//                                     <Button onClick={() => startEditing(set.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
//                                         <EditIcon className="mr-2 h-4 w-4" />
//                                         Edit
//                                     </Button>
//                                     <Button onClick={() => deleteCardSet(set.id)} variant="destructive">
//                                         <TrashIcon className="mr-2 h-4 w-4" />
//                                         Delete
//                                     </Button>
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </>
//             )}
//         </div>
//     )
// }


import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SaveIcon, TrashIcon, EditIcon } from 'lucide-react'

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

interface EditCardSetsProps {
    cardSets: (CardSet | TestSet)[]
    setCardSets: React.Dispatch<React.SetStateAction<(CardSet | TestSet)[]>>
    setNotification: (notification: { type: 'success' | 'error', message: string } | null) => void
}

export default function EditCardSets({ cardSets, setCardSets, setNotification }: EditCardSetsProps) {
    const [editingSet, setEditingSet] = useState<CardSet | null>(null)
    const [selectedSetId, setSelectedSetId] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const startEditing = (setId: number) => {
        const set = cardSets.find(s => s.id === setId)
        if (set && 'cards' in set) {
            setEditingSet(set)
            setSelectedSetId(setId)
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

    // Commented out the image functionality
    /*
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
    */

    const saveEditedSet = () => {
        if (editingSet) {
            setCardSets(cardSets.map(set =>
                set.id === editingSet.id ? editingSet : set
            ))
            setEditingSet(null)
            setSelectedSetId(null)
            setNotification({ type: 'success', message: "Card set updated successfully!" })
        }
    }

    const deleteCardSet = (id: number) => {
        setCardSets(cardSets.filter(set => set.id !== id))
        setNotification({ type: 'success', message: "Card set deleted successfully!" })
    }

    const addFlashcard = () => {
        if (editingSet) {
            setEditingSet({
                ...editingSet,
                cards: [...editingSet.cards, { id: Date.now(), question: '', answer: '', image: null }]
            })
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
                        <Label htmlFor="edit-set-name" className="text-lg text-purple-700">Set Name (10 words max)</Label>
                        <Input
                            id="edit-set-name"
                            value={editingSet.name}
                            onChange={(e) => setEditingSet({ ...editingSet, name: e.target.value })}
                            placeholder="Enter set name"
                            className="bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-set-description" className="text-lg text-purple-700">Set Description (50 words max)</Label>
                        <Textarea
                            id="edit-set-description"
                            value={editingSet.description}
                            onChange={(e) => setEditingSet({ ...editingSet, description: e.target.value })}
                            placeholder="Enter set description"
                            className="bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                        />
                    </div>
                    {editingSet.cards.map((card) => (
                        <Card key={card.id} className="bg-white/50">
                            <CardContent className="p-4 grid grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor={`edit-question-${card.id}`} className="text-lg text-purple-700">Question</Label>
                                        <Input
                                            id={`edit-question-${card.id}`}
                                            value={card.question}
                                            onChange={(e) => updateFlashcard(card.id, 'question', e.target.value)}
                                            placeholder="Enter the question"
                                            className="mt-1 bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        />
                                    </div>
                                    {/*
                                    <div>
                                        <Label htmlFor={`edit-image-${card.id}`} className="text-lg text-purple-700">Image</Label>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <Button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-purple-600 hover:bg-purple-700 text-white"
                                            >
                                                <ImageIcon className="mr-2 h-4 w-4" />
                                                Upload Image
                                            </Button>
                                            <input
                                                type="file"
                                                id={`edit-image-${card.id}`}
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
                                    */}
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor={`edit-answer-${card.id}`} className="text-lg text-purple-700">Answer</Label>
                                        <Input
                                            id={`edit-answer-${card.id}`}
                                            value={card.answer}
                                            onChange={(e) => updateFlashcard(card.id, 'answer', e.target.value)}
                                            placeholder="Enter the answer"
                                            className="mt-1 bg-white/50 border-purple-200 focus:border-purple-500 focus:ring-purple-500"
                                        />
                                    </div>
                                    <Button
                                        variant="destructive"
                                        onClick={() => removeFlashcard(card.id)}
                                        className="w-full mt-2"
                                    >
                                        <TrashIcon className="mr-2 h-4 w-4" />
                                        Remove Card
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    <div className="flex justify-between mt-6">
                        <Button onClick={addFlashcard} className="bg-purple-600 hover:bg-purple-700 text-white">
                            <PlusIcon className="mr-2 h-5 w-5" />
                            Add More Cards
                        </Button>
                        <Button onClick={saveEditedSet} className="bg-green-600 hover:bg-green-700 text-white">
                            <SaveIcon className="mr-2 h-5 w-5" />
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
                            {cardSets.map((set) => (
                                <SelectItem key={set.id} value={set.id.toString()}>{set.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {cardSets.map((set) => (
                        <Card key={set.id} className="bg-white/50">
                            <CardContent className="p-4">
                                <h3 className="text-lg font-semibold text-purple-700">{set.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{set.description}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                    {('cards' in set) ? `Cards: ${set.cards.length}` : `Questions: ${set.questions.length}`}
                                </p>
                                <div className="flex justify-end space-x-2 mt-4">
                                    <Button onClick={() => startEditing(set.id)} className="bg-blue-600 hover:bg-blue-700 text-white">
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
                    ))}
                </>
            )}
        </div>
    )
}
