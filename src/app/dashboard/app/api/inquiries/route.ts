export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';
import { readContacts, writeContacts } from '@/lib/contactInbox';

// GET: all Contact Us messages (new app inbox + any old ones from inquiries.php)
export async function GET() {
  try {
    const items = await readContacts();
    let legacy: any[] = [];
    try {
      const old = await fetchApi('/inquiries.php');
      const arr = Array.isArray(old) ? old : Array.isArray(old?.data) ? old.data : [];
      legacy = arr.map((x: any) => ({
        id: String(x.id ?? ''),
        userId: String(x.userId ?? x.user_id ?? ''),
        userName: String(x.userName ?? x.name ?? ''),
        email: String(x.email ?? ''),
        phone: String(x.phone ?? ''),
        message: String(x.message ?? ''),
        status: x.status === 'resolved' ? 'resolved' : 'pending',
        createdAt: String(x.createdAt ?? x.created_at ?? ''),
        adminReply: x.adminReply ?? x.admin_reply,
      }));
    } catch {}
    const ids = new Set(items.map((x) => x.id));
    const data = [...items, ...legacy.filter((x) => x.id && !ids.has(x.id))];
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: mark resolved / reopen  { id, status, adminReply }
export async function POST(request: Request) {
  try {
    const b = await request.json();
    const items = await readContacts();
    const i = items.findIndex((x) => x.id === b.id);
    if (i < 0) return NextResponse.json({ success: false, error: 'Inquiry not found' }, { status: 404 });
    items[i] = {
      ...items[i],
      status: b.status === 'pending' ? 'pending' : 'resolved',
      adminReply: String(b.adminReply ?? '').slice(0, 1500),
      resolvedAt: new Date().toISOString(),
    };
    await writeContacts(items);
    return NextResponse.json({ success: true, message: 'Inquiry updated' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE ?id=
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get('id');
  const items = await readContacts();
  await writeContacts(items.filter((x) => x.id !== id));
  return NextResponse.json({ success: true });
}
