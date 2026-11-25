import { NextResponse } from 'next/server';
import { readInbox, writeInbox, clean, InboxItem } from '@/lib/reviewInbox';

export const dynamic = 'force-dynamic';

// Public endpoint used by the app's "Write to Amma" form.
// Letters are saved as "pending" and only appear in the app after an admin approves them.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const name = clean(b.name, 40);
    const text = clean(b.text, 600);
    const stars = Math.min(5, Math.max(1, Math.round(Number(b.stars) || 5)));
    if (name.length < 2) return NextResponse.json({ success: false, error: 'Please enter your name.' }, { status: 400 });
    if (text.length < 10) return NextResponse.json({ success: false, error: 'Please write a few more words.' }, { status: 400 });

    const items = await readInbox();
    if (items.filter((x) => x.status === 'pending').length >= 500) {
      return NextResponse.json({ success: false, error: 'Too many letters waiting. Please try later.' }, { status: 429 });
    }
    const phone = clean(b.phone, 20);
    const recentDup = items.some((x) => x.text === text && x.name === name);
    if (recentDup) return NextResponse.json({ success: true, message: 'Already received' });

    const item: InboxItem = {
      id: `u${Date.now()}${Math.floor(Math.random() * 1000)}`,
      name,
      city: clean(b.city, 40),
      phone,
      productId: clean(b.productId, 80),
      productName: clean(b.productName, 80),
      stars,
      text,
      status: 'pending',
      verified: false,
      createdAt: new Date().toISOString(),
    };
    await writeInbox([item, ...items].slice(0, 2000));
    return NextResponse.json({ success: true, message: 'Thank you! Amma will read your letter soon.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not send' }, { status: 500 });
  }
}
