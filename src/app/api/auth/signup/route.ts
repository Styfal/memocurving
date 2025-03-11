

// import { NextRequest, NextResponse } from 'next/server';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { doc, setDoc } from 'firebase/firestore';
// import { auth, db } from '@/lib/firebase';

// export async function POST(request: NextRequest) {
//   try {
//     const { email, password, name } = await request.json();
//     console.log('Signup attempt:', { email, password });
    
//     // Create auth user with Firebase Authentication
//     const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Save additional user data to Firestore with isPremium defaulted to false
//     await setDoc(doc(db, 'users', user.uid), {
//       uid: user.uid,
//       email: user.email,
//       name: name,
//       password: password, 
//       createdAt: Date.now(),
//       lastLogin: Date.now(),
//       isPremium: false // default to free user
//     });

//     return NextResponse.json({
//       message: 'User created successfully',
//       user: {
//         uid: user.uid,
//         email: user.email,
//         name: name,
//       },
//     });

//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Something went wrong' },
//       { status: 400 }
//     );
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();
    console.log('Signup attempt:', { email, password });
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user data with AI usage defaults.
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      password: password, 
      createdAt: Date.now(),
      lastLogin: Date.now(),
      isPremium: false, // default free
      aiUsageCount: 0,
      aiUsageResetAt: new Date().toISOString()
    });

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        uid: user.uid,
        email: user.email,
        name: name,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 400 }
    );
  }
}
