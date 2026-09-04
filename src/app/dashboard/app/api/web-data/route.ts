export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

// GET: Fetch web data (like homepage_web, faq_web)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId');
    if (!docId) return NextResponse.json({ success: false, error: 'docId is required' }, { status: 400 });

    const data = await fetchApi(`/web_settings.php?doc_id=${docId}`);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error(`Error fetching web data:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Update web data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { docId, ...data } = body;
    if (!docId) return NextResponse.json({ success: false, error: 'docId is required' }, { status: 400 });

    const result = await fetchApi('/web_settings.php', {
      method: 'POST',
      body: JSON.stringify({ doc_id: docId, data })
    });
    
    return NextResponse.json({ success: true, message: 'Web setting updated', result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
