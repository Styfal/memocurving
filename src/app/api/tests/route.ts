import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const TestSchema = z.object({
  title: z.string(),
  description: z.string(),
  // Each question is an object with question text, correctAnswer, and optional options.
  questions: z.array(
    z.object({
      question: z.string(),
      correctAnswer: z.string(),
      options: z.array(z.string()).optional(),
    })
  ),
  createdAt: z.string(),
  userId: z.string(),
});

// POST: Create a new test.
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

// (Optional) GET: List all tests.
export async function GET() {
  try {
    const testsSnapshot = await getDocs(collection(db, 'tests'));
    const tests = testsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json({ success: true, tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch tests' },
      { status: 500 }
    );
  }
}

// DELETE: Delete a test based on an "id" query parameter.
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 }
      );
    }
    await deleteDoc(doc(db, "tests", id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting test:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete test" },
      { status: 500 }
    );
  }
}