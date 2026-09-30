export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Forward the formData body to BigRock chunked upload endpoint
    const response = await fetch(`${BIGROCK_API_URL}/upload_chunk.php`, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: formData,
    });

    const responseText = await response.text();
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      throw new Error(`Server returned invalid JSON. WAF block? Output: ${responseText.substring(0, 150)}`);
    }

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
