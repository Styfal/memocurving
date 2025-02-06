// src/app/api/cardsets/[id]/route.ts
import { db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const cardsetDoc = doc(db, 'cardSets', params.id);
    await deleteDoc(cardsetDoc);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting cardset:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete cardset' }, { status: 500 });
  }
}
