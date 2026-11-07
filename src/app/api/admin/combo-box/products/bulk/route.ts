import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const body = await request.json();
    const targetUrl = `${BIGROCK_API_URL}/combo_box.php?action=admin_bulk`;

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {})
      },
      body: JSON.stringify(body)
    });

    const data = await res.json().catch(() => ({ ok: true, added: 0 }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
