import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
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

const UpdateTestSchema = z.object({
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
  questions: z.array(TestQuestionSchema).max(20),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing id parameter' },
        { status: 400 }
      );
    }
    await deleteDoc(doc(db, 'tests', id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete test' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const validatedData = UpdateTestSchema.parse(body);
    const testDoc = doc(db, 'tests', params.id);
    await updateDoc(testDoc, {
      title: validatedData.title,
      description: validatedData.description,
      questions: validatedData.questions,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating test:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update test' },
      { status: 500 }
    );
  }
}
