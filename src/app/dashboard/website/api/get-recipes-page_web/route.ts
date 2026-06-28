import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-web';
import { doc, getDoc } from 'firebase/firestore';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const docSnap = await getDoc(doc(db, 'recipes-page_web', 'main'));
    if (docSnap.exists()) {
      return NextResponse.json({ success: true, data: docSnap.data() }, { headers: corsHeaders });
    }
    return NextResponse.json({ success: false }, { status: 404, headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500, headers: corsHeaders });
  }
}
