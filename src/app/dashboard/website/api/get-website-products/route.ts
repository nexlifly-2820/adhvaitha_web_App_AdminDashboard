import { NextResponse } from 'next/server';
import { getDocs } from 'firebase/firestore';

export const dynamic = 'force-dynamic';
import { webProductsCollection } from '@/lib/firebase-web';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

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

    return NextResponse.json({ success: true, data }, { status: 200, headers: corsHeaders });
  } catch (error: any) {
    console.error('Error fetching website products:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
