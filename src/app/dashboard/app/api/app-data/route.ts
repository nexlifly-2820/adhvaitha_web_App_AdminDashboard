export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi, postApi } from '@/lib/api-client';

// GET: Fetch a specific document from app_data (e.g., ?docId=banners)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const docId = searchParams.get('docId');

    if (!docId) {
      return NextResponse.json({ success: false, error: 'docId parameter is required' }, { status: 400 });
    }

    const data = await fetchApi(`/app_settings.php?doc_id=${docId}`);
    return NextResponse.json({ success: true, data: data || {} }, { status: 200 });
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

    await postApi(`/app_settings.php?doc_id=${docId}`, data);

    return NextResponse.json({ success: true, message: `Document ${docId} updated successfully` }, { status: 200 });
  } catch (error: any) {
    console.error('Error saving app_data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
