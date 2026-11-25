export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readInbox, writeInbox, readDoc, writeDoc, InboxItem } from '@/lib/reviewInbox';

const TAGS: [string, string][] = [['#FDE8EA', '#C2273A'], ['#E7F5EC', '#1F7A45'], ['#FFF3D6', '#9A6A00'], ['#EAF1FD', '#2A64B2']];

function toLetter(x: InboxItem) {
  const [tagBg, tagFg] = TAGS[Math.abs(x.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % TAGS.length];
  return {
    id: x.id,
    productId: x.productId || '',
    productName: x.productName || 'Ambhujakshi',
    text: x.text,
    name: x.name,
    meta: [x.verified ? 'Verified Buyer' : 'Customer', x.city].filter(Boolean).join(' · '),
    photoUrl: '',
    photoCaption: '',
    stars: x.stars,
    verified: x.verified,
    tagBg,
    tagFg,
    fromApp: true,
  };
}

// GET: all letters sent from the app (pending, approved, rejected)
export async function GET() {
  try {
    const items = await readInbox();
    items.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    return NextResponse.json({ success: true, data: items });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// POST { id, status: 'approved' | 'rejected' | 'pending', verified? }  or  { id, action: 'delete' }
export async function POST(request: Request) {
  try {
    const { id, status, verified, action } = await request.json();
    if (!id) return NextResponse.json({ success: false, error: 'id required' }, { status: 400 });

    const items = await readInbox();
    const idx = items.findIndex((x) => x.id === id);
    if (idx < 0) return NextResponse.json({ success: false, error: 'Letter not found' }, { status: 404 });

    const reviewsDoc = await readDoc('reviews');
    let letters: any[] = Array.isArray(reviewsDoc?.reviews) ? reviewsDoc.reviews : [];
    letters = letters.filter((l) => String(l?.id) !== id);

    if (action === 'delete') {
      items.splice(idx, 1);
    } else {
      const next: InboxItem = {
        ...items[idx],
        status: status === 'approved' || status === 'rejected' ? status : 'pending',
        verified: typeof verified === 'boolean' ? verified : items[idx].verified,
        reviewedAt: new Date().toISOString(),
      };
      items[idx] = next;
      if (next.status === 'approved') letters = [toLetter(next), ...letters];
    }

    await writeInbox(items);
    await writeDoc('reviews', {
      ...reviewsDoc,
      settings: reviewsDoc?.settings || {},
      summary: reviewsDoc?.summary || { average: 4.9, count: 128 },
      reviews: letters,
    });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
