import { NextResponse } from 'next/server';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase-app';

// GET: Fetch a specific document from app_data (e.g., ?docId=banners)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId');

    if (!docId) {
      return NextResponse.json({ success: false, error: 'docId parameter is required' }, { status: 400 });
    }

    const docRef = doc(db, 'app_data', docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: docSnap.data() }, { status: 200 });
    } else {
      return NextResponse.json({ success: true, data: {} }, { status: 200 });
    }
  } catch (error: any) {
    console.error(`Error fetching app_data:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create or update a document in app_data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { docId, ...data } = body;

    if (!docId) {
      return NextResponse.json(
        { success: false, error: 'docId is required in the body' },
        { status: 400 }
      );
    }

    const docRef = doc(db, 'app_data', docId);
    
    // setDoc with merge: true will update existing fields or create new ones
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    return NextResponse.json({ success: true, message: `Document ${docId} updated successfully` }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving app_data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
