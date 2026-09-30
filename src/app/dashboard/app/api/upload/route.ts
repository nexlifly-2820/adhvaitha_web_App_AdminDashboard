export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    
    // Forward the form data to BigRock backend
    const response = await fetch(`${BIGROCK_API_URL}/upload.php`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      return NextResponse.json(
        { success: false, error: data.error || 'Failed to upload image to backend.' },
        { status: response.status || 500 }
      );
    }

    return NextResponse.json({ success: true, url: data.url }, { status: 200 });
  } catch (error: any) {
    console.error('Error forwarding upload:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
