import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-app';
import { doc, setDoc } from 'firebase/firestore';

export async function POST(request: Request) {
  try {
    const { images } = await request.json();

    if (!Array.isArray(images) || images.length !== 3) {
      return NextResponse.json(
        { error: 'Exactly 3 images are required.' },
        { status: 400 }
      );
    }

    const galleryRef = doc(db, 'website_gallery', 'main');
    await setDoc(galleryRef, {
      images,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, message: 'Gallery updated successfully' });
  } catch (error: any) {
    console.error('Error updating gallery:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery' },
      { status: 500 }
    );
  }
}
