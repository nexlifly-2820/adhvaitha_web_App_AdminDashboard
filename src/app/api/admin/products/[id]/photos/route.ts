import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const url = `${BIGROCK_API_URL}/product_detail.php?action=admin_photos&id=${encodeURIComponent(id)}`;
    const res = await fetch(url);
    const data = await res.json().catch(() => ({ success: false }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const contentType = request.headers.get('content-type') || '';

    const targetUrl = `${BIGROCK_API_URL}/product_detail.php?action=admin_photos&id=${encodeURIComponent(id)}`;

    if (contentType.includes('application/json')) {
      const body = await request.json();
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({ success: false }));
      return NextResponse.json(data, { status: res.status });
    } else {
      // Multipart or Form Data pass-through
      const formData = await request.formData();
      const res = await fetch(targetUrl, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json().catch(() => ({ success: false }));
      return NextResponse.json(data, { status: res.status });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
