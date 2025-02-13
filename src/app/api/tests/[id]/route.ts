// import { db } from '@/lib/firebase';
// import { doc, deleteDoc } from 'firebase/firestore';
// import { NextResponse } from 'next/server';

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     if (!id) {
//       return NextResponse.json(
//         { success: false, error: 'Missing id parameter' },
//         { status: 400 }
//       );
//     }
//     await deleteDoc(doc(db, 'tests', id));
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting test:', error);
//     return NextResponse.json(
//       { success: false, error: 'Failed to delete test' },
//       { status: 500 }
//     );
//   }
// }


// src/app/api/tests/[id]/route.ts
import { db } from '@/lib/firebase';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const UpdateTestSchema = z.object({
  title: z.string(),
  description: z.string(),
  questions: z.array(
    z.object({
      question: z.string(),
      correctAnswer: z.string(),
      options: z.array(z.string()).optional(),
    })
  ),
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
