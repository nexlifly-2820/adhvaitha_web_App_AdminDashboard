import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-web';
import { doc, getDoc } from 'firebase/firestore';

export async function GET() {
  try {
    const docSnap = await getDoc(doc(db, 'faq_web', 'main'));
    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: docSnap.data() });
    }
    return NextResponse.json({ success: false }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
