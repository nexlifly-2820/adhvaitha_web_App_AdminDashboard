import { NextResponse } from 'next/server';
import { clean } from '@/lib/reviewInbox';
import { readTokens, writeTokens } from '@/lib/fcm';
import { readDeletions, writeDeletions } from '@/lib/accountDeletions';

export const dynamic = 'force-dynamic';

// Public: app → Profile → Delete my account. Records the request and removes the push token right away.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const userId = clean(b.userId, 80);
    if (!userId || userId === 'guest') return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 400 });
    const items = await readDeletions();
    if (!items.some((x) => x.userId === userId && x.status === 'pending')) {
      items.unshift({
        id: `d${Date.now()}`,
        userId,
        name: clean(b.name, 60),
        email: clean(b.email, 80),
        phone: clean(b.phone, 20),
        reason: clean(b.reason, 300),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      await writeDeletions(items.slice(0, 5000));
    }
    // stop sending this user notifications
    try {
      const all = await readTokens();
      if (all[userId]) { delete all[userId]; await writeTokens(all); }
    } catch {}
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Failed' }, { status: 500 });
  }
}
