

// import { NextRequest, NextResponse } from 'next/server';
// import { signInWithEmailAndPassword } from 'firebase/auth';
// import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password } = await request.json();
//     console.log('Login attempt:', { email, password });

//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     console.log('User logged in:', user);

//     // Get the user's document to check for an existing isPremium field
//     const userDocRef = doc(db, 'users', user.uid);
//     const userDocSnap = await getDoc(userDocRef);

//     if (!userDocSnap.exists() || userDocSnap.data().isPremium === undefined) {
//       // Create the field if not present
//       await setDoc(userDocRef, {
//         lastLogin: Date.now(),
//         isPremium: false
//       }, { merge: true });
//     } else {
//       // Update only the last login time, leaving isPremium unchanged
//       await updateDoc(userDocRef, {
//         lastLogin: Date.now()
//       });
//     }

//     return NextResponse.json({
//       message: 'Login successful',
//       user: {
//         uid: user.uid,
//         email: user.email
//       }
//     });

//   } catch (error: any) {
//     console.error('Error during login:', error);

//     let errorMessage = 'Invalid credentials';
//     let statusCode = 401;

//     if (error.code === 'auth/user-not-found') {
//       errorMessage = 'No user found with this email';
//     } else if (error.code === 'auth/wrong-password') {
//       errorMessage = 'Incorrect password';
//     } else if (error.code === 'auth/invalid-email') {
//       errorMessage = 'Invalid email format';
//     }

//     return NextResponse.json(
//       { error: errorMessage },
//       { status: statusCode }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email, password });

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User logged in:', user);

    const userDocRef = doc(db, 'users', user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists() || userDocSnap.data().isPremium === undefined) {
      await setDoc(userDocRef, {
        lastLogin: Date.now(),
        isPremium: false,
        aiUsageCount: 0,
        aiUsageResetAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await updateDoc(userDocRef, { lastLogin: Date.now() });
    }

    return NextResponse.json({
      message: 'Login successful',
      user: {
        uid: user.uid,
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Error during login:', error);

    let errorMessage = 'Invalid credentials';
    let statusCode = 401;

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No user found with this email';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}
