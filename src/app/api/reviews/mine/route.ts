import { NextResponse } from 'next/server';
import { readInbox } from '@/lib/reviewInbox';

export const dynamic = 'force-dynamic';

// Public: the app's Profile → My reviews. Returns only this customer's letters and their status.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const userId = (q.get('userId') || '').trim();
  const phone = (q.get('phone') || '').replace(/\D/g, '').slice(-10);
  const name = (q.get('name') || '').trim().toLowerCase();
  if (!userId && !phone) return NextResponse.json({ success: true, items: [] });
  const items = (await readInbox()).filter((x) => {
    if (userId && userId !== 'guest' && x.userId === userId) return true;
    const p = String(x.phone || '').replace(/\D/g, '').slice(-10);
    if (phone.length === 10 && p === phone) return true;
    // older letters had no userId/phone: match by the exact name only when both are given
    return !x.userId && !x.phone && !!name && name.length > 2 && x.name.trim().toLowerCase() === name && userId !== 'guest';
  });
  return NextResponse.json({
    success: true,
    items: items.slice(0, 100).map((x) => ({ id: x.id, productName: x.productName, stars: x.stars, text: x.text, status: x.status, createdAt: x.createdAt })),
  });
}
