import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    console.log('Login attempt:', { email, password });

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log('User logged in:', user);

    // Update last login time
    await setDoc(doc(db, 'users', user.uid), {
      lastLogin: Date.now()
    }, { merge: true });

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

