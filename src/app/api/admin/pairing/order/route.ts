import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json();
    const targetUrl = `${BIGROCK_API_URL}/pairing.php?action=admin_order`;

    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({ ok: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

