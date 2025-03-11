// import { db } from '@/lib/firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { NextResponse } from 'next/server';
// import { z } from 'zod';

// const TestQuestionSchema = z.object({
//   question: z.string().min(1).max(200),
//   correctAnswer: z.string().min(1).max(200),
//   options: z.array(z.string()).optional(),
// }).refine(
//   (q) => !q.options || q.options.includes(q.correctAnswer),
//   { message: "Correct answer must be one of the options." }
// );

// const TestSchema = z.object({
//   title: z.string().min(1).max(50),
//   description: z.string().min(1).max(200),
//   questions: z.array(TestQuestionSchema).max(20),
//   createdAt: z.string(),
//   userId: z.string(),
// });

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
    
//     console.log("Received payload:", JSON.stringify(body, null, 2)); // Log raw request data

//     // Validate request body
//     const validatedData = TestSchema.parse(body);

//     console.log("Validation successful. Storing in Firestore...");

//     const testsRef = collection(db, 'tests');
//     const docRef = await addDoc(testsRef, validatedData);

//     console.log("Test saved successfully:", docRef.id);

//     return NextResponse.json({
//       success: true,
//       data: { id: docRef.id, ...validatedData },
//     });
//   } catch (error) {
//     console.error("Error saving test:", error);

//     if (error instanceof z.ZodError) {
//       console.error("Zod validation errors:", error.errors);
//       return NextResponse.json(
//         { success: false, error: "Validation failed", details: error.errors },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, error: "Failed to save test" },
//       { status: 500 }
//     );
//   }
// }



import { db } from '@/lib/firebase';
import { collection, addDoc, getDoc, query, where, getDocs, doc } from 'firebase/firestore';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const TestQuestionSchema = z.object({
  question: z.string().min(1).max(200),
  correctAnswer: z.string().min(1).max(200),
  options: z.array(z.string()).optional(),
}).refine(
  (q) => !q.options || q.options.includes(q.correctAnswer),
  { message: "Correct answer must be one of the options." }
);

const TestSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(200),
  questions: z.array(TestQuestionSchema).max(20),
  createdAt: z.string(),
  userId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    console.log("Received payload:", JSON.stringify(body, null, 2)); // Log raw request data

    // Validate request body
    const validatedData = TestSchema.parse(body);

    // Fetch the user document to check premium status
    const userDoc = await getDoc(doc(db, 'users', validatedData.userId));
    const userData = userDoc.data();
    const isPremium = userData?.isPremium || false;

    // Query tests collection for this user to enforce the limit for free users.
    const testsQuery = query(
      collection(db, 'tests'),
      where("userId", "==", validatedData.userId)
    );
    const testsSnapshot = await getDocs(testsQuery);

    // If user is free and already has 20 or more tests, return an error.
    if (!isPremium && testsSnapshot.size >= 20) {
      return NextResponse.json(
        { success: false, error: 'Free users are limited to 20 tests' },
        { status: 400 }
      );
    }

    console.log("Validation successful. Storing in Firestore...");

    const testsRef = collection(db, 'tests');
    const docRef = await addDoc(testsRef, validatedData);

    console.log("Test saved successfully:", docRef.id);

    return NextResponse.json({
      success: true,
      data: { id: docRef.id, ...validatedData },
    });
  } catch (error) {
    console.error("Error saving test:", error);

    if (error instanceof z.ZodError) {
      console.error("Zod validation errors:", error.errors);
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to save test" },
      { status: 500 }
    );
  }
}
