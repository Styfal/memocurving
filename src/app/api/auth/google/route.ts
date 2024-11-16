import { NextRequest, NextResponse } from 'next/server';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;

    // Save/update user data
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL,
      lastLogin: Date.now()
    }, { merge: true });

    return NextResponse.json({ 
      message: 'Google sign-in successful',
      user: {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Google sign-in failed' },
      { status: 401 }
    );
  }
}