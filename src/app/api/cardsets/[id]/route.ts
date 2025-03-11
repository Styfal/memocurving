import { 
  doc, 
  getDoc, 
  deleteDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';

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
  cards: z.array(FlashcardSchema),
  lastReviewed: z.number(), // Expect a timestamp (in ms)
  reviewCount: z.number(),
});

// Helper function to notify the user (only once every 12 hours)
async function notifyUser(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  const lastNotification = userData?.lastDeletionNotification || 0;
  const now = Date.now();
  // 12 hours = 43200000 ms
  if (now - lastNotification > 43200000) {
    console.log(`Notify user ${userId} to delete excess cardsets.`);
    await updateDoc(userRef, { lastDeletionNotification: now });
    // Insert integration with your notification service here.
  }
}

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

    // Fetch the existing card set to get the creator's uid.
    const cardsetRef = doc(db, 'cardSets', params.id);
    const cardsetSnap = await getDoc(cardsetRef);
    if (!cardsetSnap.exists()) {
      return NextResponse.json({ success: false, error: 'Card set not found' }, { status: 404 });
    }
    const cardsetData = cardsetSnap.data();
    const createdByUid = cardsetData.createdBy?.uid;
    if (!createdByUid) {
      return NextResponse.json({ success: false, error: 'Creator information missing' }, { status: 400 });
    }

    // Fetch the user's premium status
    const userDocSnap = await getDoc(doc(db, 'users', createdByUid));
    const userData = userDocSnap.data();
    const isPremium = userData?.isPremium || false;

    // Proceed with the update (individual cardset update does not affect overall count)
    await updateDoc(cardsetRef, {
      title: validatedData.title,
      description: validatedData.description,
      cards: validatedData.cards,
      lastReviewed: validatedData.lastReviewed,
      reviewCount: validatedData.reviewCount,
      updatedAt: new Date().toISOString(),
    });

    // After update, if the user is free, check overall number of cardsets.
    if (!isPremium) {
      const userCardSetsQuery = query(
        collection(db, 'cardSets'),
        where("createdBy.uid", "==", createdByUid)
      );
      const userCardSetsSnapshot = await getDocs(userCardSetsQuery);
      const totalCardSets = userCardSetsSnapshot.size;
      if (totalCardSets > 20) {
        await notifyUser(createdByUid);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating cardset:', error);
    return NextResponse.json({ success: false, error: 'Failed to update cardset' }, { status: 500 });
  }
}
