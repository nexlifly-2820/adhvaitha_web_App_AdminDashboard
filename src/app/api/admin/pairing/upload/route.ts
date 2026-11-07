import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const formData = await request.formData();
    const targetUrl = `${BIGROCK_API_URL}/pairing.php?action=admin_upload`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      body: formData
    });

    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

