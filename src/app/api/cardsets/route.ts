import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  getDoc, 
  query, 
  where, 
  updateDoc 
} from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from '@/lib/firebase';

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
      message: "Answer must be at most 20 words.",
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
  cards: z.array(FlashcardSchema),
  createdBy: UserSchema,
  lastReviewed: z.number(), // should be 0 initially
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

// GET: Retrieve all card sets.
export async function GET(req: Request) {
  try {
    const querySnapshot = await getDocs(collection(db, 'cardSets'));
    const cardSets = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data(),
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

    // Fetch the user document to check premium status
    const userRef = doc(db, 'users', validatedData.createdBy.uid);
    const userDocSnap = await getDoc(userRef);
    const userData = userDocSnap.data();
    const isPremium = userData?.isPremium || false;

    // Query to get the total number of cardsets for this user.
    const userCardSetsQuery = query(
      collection(db, 'cardSets'),
      where("createdBy.uid", "==", validatedData.createdBy.uid)
    );
    const userCardSetsSnapshot = await getDocs(userCardSetsQuery);
    const totalCardSets = userCardSetsSnapshot.size;

    // Enforce free user limit: free users are allowed up to 20 cardsets.
    if (!isPremium) {
      if (totalCardSets >= 20) {
        await notifyUser(validatedData.createdBy.uid);
        return NextResponse.json({ success: false, error: 'Free users are limited to 20 cardsets' }, { status: 400 });
      }
    }

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
