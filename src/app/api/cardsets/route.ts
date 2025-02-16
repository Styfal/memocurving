import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const UserSchema = z.object({
  uid: z.string(),
  displayName: z.string().nullable(),
  email: z.string().nullable(),
});

const FlashcardSchema = z.object({
  question: z
    .string()
    .min(1)
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 20, {
      message: "Question must be at most 20 words.",
    }),
  answer: z
    .string()
    .min(1)
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 40, {
      message: "Answer must be at most 40 words.",
    }),
  image: z.string().nullable(),
});

const CardSetSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 10, {
      message: "Title must be at most 10 words.",
    }),
  description: z
    .string()
    .min(0)
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 50, {
      message: "Description must be at most 50 words.",
    }),
  cards: z.array(FlashcardSchema).max(20),
  createdBy: UserSchema,
  lastReviewed: z.number(), // should be 0 initially
  reviewCount: z.number(),
});

// GET: Retrieve all card sets.
export async function GET(req: Request) {
  try {
    const querySnapshot = await getDocs(collection(db, 'cardSets'));
    const cardSets = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json({ success: true, data: cardSets });
  } catch (error) {
    console.error('Error fetching card sets:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch card sets' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = CardSetSchema.parse(body);
    const cardSetData = {
      title: validatedData.title,
      description: validatedData.description,
      cards: validatedData.cards.map(card => ({
        question: card.question,
        answer: card.answer,
        image: card.image,
      })),
      createdBy: {
        uid: validatedData.createdBy.uid,
        displayName: validatedData.createdBy.displayName || 'Anonymous',
        email: validatedData.createdBy.email || '',
      },
      lastReviewed: validatedData.lastReviewed, // should be 0 initially
      reviewCount: validatedData.reviewCount,       // should be 0 initially
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'cardSets'), cardSetData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...cardSetData,
      },
    });
  } catch (error) {
    console.error('Error saving card set:', error);
    return NextResponse.json({ success: false, error: 'Failed to save card set' }, { status: 500 });
  }
}
