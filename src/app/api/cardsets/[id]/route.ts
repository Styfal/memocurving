

import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for each flashcard with word‐count limits:
const FlashcardSchema = z.object({
  question: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 20,
      { message: "Question must be at most 20 words." }
    ),
  answer: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 40,
      { message: "Answer must be at most 40 words." }
    ),
  image: z.string().nullable(),
});

// Schema for updating a card set (title and description with limits, plus cards array)
const UpdateCardSetSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 10,
      { message: "Title must be at most 10 words." }
    ),
  description: z
    .string()
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 50,
      { message: "Description must be at most 50 words." }
    ),
  cards: z.array(FlashcardSchema).max(20),
});

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cardsetDoc = doc(db, 'cardSets', params.id);
    await deleteDoc(cardsetDoc);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cardset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete cardset' },
      { status: 500 }
    );
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
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cardset:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update cardset' },
      { status: 500 }
    );
  }
}
