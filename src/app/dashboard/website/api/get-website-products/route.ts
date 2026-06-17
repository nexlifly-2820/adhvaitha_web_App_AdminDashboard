import { NextResponse } from 'next/server';
import { getDocs } from 'firebase/firestore';
import { webProductsCollection } from '@/lib/firebase-web';

// GET: Fetch all website products
export async function GET() {
  try {
    const querySnapshot = await getDocs(webProductsCollection);
    const data: any[] = [];
    
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    // Sort by creation date descending
    data.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching website products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
