import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id, photoId } = await params;
    const body = await request.json();

    const targetUrl = `${BIGROCK_API_URL}/product_detail.php?action=admin_photo_item&id=${encodeURIComponent(id)}&photoId=${encodeURIComponent(photoId)}`;
    const res = await fetch(targetUrl, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json().catch(() => ({ ok: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; photoId: string }> }
) {
  try {
    const { id, photoId } = await params;
    const targetUrl = `${BIGROCK_API_URL}/product_detail.php?action=admin_photo_item&id=${encodeURIComponent(id)}&photoId=${encodeURIComponent(photoId)}`;
    const res = await fetch(targetUrl, {
      method: 'DELETE',
    });

    const data = await res.json().catch(() => ({ ok: true }));
    return NextResponse.json(data, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
