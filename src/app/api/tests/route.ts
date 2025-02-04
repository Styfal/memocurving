import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const TestSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(z.string()),
  createdAt: z.string(),  // ISO date string
  userId: z.string()
}).strict(); // this disallows extra keys

export async function POST(req: Request) {
  try { 
    const body = await req.json();
    const validatedData = TestSchema.parse(body);

    const testsRef = collection(db, 'tests');
    const docRef = await addDoc(testsRef, validatedData);

    return NextResponse.json({
      success: true,
      data: {
        id: docRef.id,
        ...validatedData,
      },
    });
  } catch (error) {
    console.error('Error saving test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save test' },
      { status: 500 }
    );
  }
}
