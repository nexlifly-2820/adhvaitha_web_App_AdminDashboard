import { NextResponse } from 'next/server';
import { clean } from '@/lib/reviewInbox';
import { readContacts, writeContacts, ContactItem } from '@/lib/contactInbox';

export const dynamic = 'force-dynamic';

// Public endpoint used by the app's Contact Us form.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const userName = clean(b.name, 60);
    const email = clean(b.email, 80);
    const phone = clean(b.phone, 20).replace(/[^\d+ ]/g, '');
    const message = String(b.message ?? '').replace(/[<>]/g, '').trim().slice(0, 1500);
    if (userName.length < 2) return NextResponse.json({ success: false, error: 'Please enter your name.' }, { status: 400 });
    if (phone.replace(/\D/g, '').length < 10) return NextResponse.json({ success: false, error: 'Please enter a valid phone number.' }, { status: 400 });
    if (message.length < 5) return NextResponse.json({ success: false, error: 'Please write your message.' }, { status: 400 });

    const items = await readContacts();
    if (items.filter((x) => x.status === 'pending').length >= 1000) {
      return NextResponse.json({ success: false, error: 'Too many messages waiting. Please call us.' }, { status: 429 });
    }
    if (items.some((x) => x.message === message && x.phone === phone)) {
      return NextResponse.json({ success: true, message: 'Already received' });
    }
    const item: ContactItem = {
      id: `c${Date.now()}${Math.floor(Math.random() * 1000)}`,
      userId: clean(b.userId, 80),
      userName,
      email,
      phone,
      message,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    await writeContacts([item, ...items].slice(0, 3000));
    return NextResponse.json({ success: true, message: 'Thank you! We will get back to you soon.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not send' }, { status: 500 });
  }
}
