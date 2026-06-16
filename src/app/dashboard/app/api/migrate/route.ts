import { NextResponse } from 'next/server';
import { getDocs, doc, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase-app';

export async function GET() {
  try {
    const oldColl = collection(db, "products");
    const newColl = collection(db, "products_app");
    const snap = await getDocs(oldColl);
    let count = 0;
    
    for (const document of snap.docs) {
      await setDoc(doc(newColl, document.id), document.data());
      count++;
    }
    
    return NextResponse.json({ success: true, migrated: count });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
