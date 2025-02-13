


import { db } from '@/lib/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const TestQuestionSchema = z.object({
  question: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 30,
      { message: "Question must be at most 30 words." }
    ),
  correctAnswer: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 50,
      { message: "Answer must be at most 50 words." }
    ),
  options: z.array(z.string()).optional(),
}).refine(
  (q) => !q.options || (new Set(q.options).size === q.options.length),
  { message: "Duplicate options are not allowed." }
).refine(
  (q) => !q.options || q.options.includes(q.correctAnswer),
  { message: "Correct answer must be one of the options." }
);

const TestSchema = z.object({
  title: z
    .string()
    .min(1)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 10,
      { message: "Title must be at most 10 words." }
    ),
  description: z
    .string()
    .min(0)
    .refine(
      (val) => val.split(/\s+/).filter(Boolean).length <= 50,
      { message: "Description must be at most 50 words." }
    ),
  questions: z.array(TestQuestionSchema).max(20),
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
