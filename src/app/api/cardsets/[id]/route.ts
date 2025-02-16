import { db } from '@/lib/firebase';
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Flashcard schema remains for the cards array.
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

// Schema for updating a card set. Note: now includes lastReviewed and reviewCount.
const UpdateCardSetSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 10, {
      message: "Title must be at most 10 words.",
    }),
  description: z
    .string()
    .refine(val => val.split(/\s+/).filter(Boolean).length <= 50, {
      message: "Description must be at most 50 words.",
    }),
  cards: z.array(FlashcardSchema).max(20),
  lastReviewed: z.number(), // Expect a timestamp (in ms)
  reviewCount: z.number(),
});

// GET: Retrieve a single card set by ID.
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const cardsetDoc = doc(db, 'cardSets', params.id);
    const docSnap = await getDoc(cardsetDoc);
    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: docSnap.data() });
    } else {
      return NextResponse.json({ success: false, error: 'Card set not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching card set:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch card set' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cardsetDoc = doc(db, 'cardSets', params.id);
    await deleteDoc(cardsetDoc);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cardset:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete cardset' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validatedData = UpdateCardSetSchema.parse(body);
    const cardsetDoc = doc(db, 'cardSets', params.id);
    await updateDoc(cardsetDoc, {
      title: validatedData.title,
      description: validatedData.description,
      cards: validatedData.cards,
      lastReviewed: validatedData.lastReviewed,
      reviewCount: validatedData.reviewCount,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cardset:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cardset' }, { status: 500 });
  }
}
