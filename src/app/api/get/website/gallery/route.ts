import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-app';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const galleryRef = doc(db, 'website_gallery', 'main');
    const docSnap = await getDoc(galleryRef);

    if (docSnap.exists()) {
      return NextResponse.json({ images: docSnap.data().images });
    } else {
      return NextResponse.json({ images: [] });
    }
  } catch (error: any) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery' },
      { status: 500 }
    );
  }
}
