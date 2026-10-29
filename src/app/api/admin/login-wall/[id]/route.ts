import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authHeader = request.headers.get('authorization') || '';
    const targetUrl = `${BIGROCK_API_URL}/auth.php?action=admin_login_wall_item&id=${encodeURIComponent(id)}`;

    const res = await fetch(targetUrl, {
      method: 'DELETE',
      headers: {
        ...(authHeader ? { Authorization: authHeader } : {})
      }
    });

    const data = await res.json().catch(() => ({ ok: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
