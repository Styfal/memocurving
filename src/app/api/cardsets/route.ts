import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'
import { z } from 'zod'

// Updated schema to include user information
const UserSchema = z.object({
  uid: z.string(),
  displayName: z.string().nullable(),
  email: z.string().nullable()
})

const FlashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  image: z.string().nullable()
})

const CardSetSchema = z.object({
  name: z.string(),
  description: z.string(),
  cards: z.array(FlashcardSchema),
  createdBy: UserSchema
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const validatedData = CardSetSchema.parse(body)

    // Prepare data for Firestore
    const cardSetData = {
      name: validatedData.name,
      description: validatedData.description,
      cards: validatedData.cards.map(card => ({
        question: card.question,
        answer: card.answer,
        image: card.image,
      })),
      createdBy: {
        uid: validatedData.createdBy.uid,
        displayName: validatedData.createdBy.displayName || 'Anonymous',
        email: validatedData.createdBy.email || ''
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Save to Firestore
    const docRef = await addDoc(collection(db, 'cardSets'), cardSetData)

    // Return the saved data with the Firestore ID
    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...cardSetData
      }
    })
  } catch (error) {
    console.error('Error saving card set:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save card set' },
      { status: 500 }
    )
  }
}