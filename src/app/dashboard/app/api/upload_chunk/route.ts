export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Forward the JSON body to BigRock chunked upload endpoint
    const response = await fetch(`${BIGROCK_API_URL}/upload_chunk.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to upload chunk to backend.' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error('Error forwarding chunk:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
