// // src/app/api/cardsets/[id]/route.ts
// import { db } from '@/lib/firebase';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { NextResponse } from 'next/server';

// export async function DELETE(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const cardsetDoc = doc(db, 'cardSets', params.id);
//     await deleteDoc(cardsetDoc);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting cardset:', error);
//     return NextResponse.json({ success: false, error: 'Failed to delete cardset' }, { status: 500 });
//   }
// }


// src/app/api/cardsets/[id]/route.ts
// src/app/api/cardsets/[id]/route.ts
import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for each flashcard
const FlashcardSchema = z.object({
  question: z.string(),
  answer: z.string(),
  image: z.string().nullable(),
});

// Schema for updating the card set (including title and description)
const UpdateCardSetSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string(),
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

