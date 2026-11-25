import { NextResponse } from 'next/server';
import { readTokens, writeTokens } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

// App → remember this phone's push token for a user (so the admin can notify one customer).
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const userId = String(b?.userId || '').trim().slice(0, 128);
    const token = String(b?.token || '').trim();
    if (!userId || token.length < 20 || token.length > 400) return NextResponse.json({ success: false, error: 'bad request' }, { status: 400 });
    const all = await readTokens();
    // a token belongs to one user only (phone switched accounts)
    for (const k of Object.keys(all)) if (k !== userId) all[k] = (all[k] || []).filter((t) => t !== token);
    all[userId] = [token, ...(all[userId] || []).filter((t) => t !== token)].slice(0, 5);
    for (const k of Object.keys(all)) if (!all[k]?.length) delete all[k];
    await writeTokens(all);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'failed' }, { status: 500 });
  }
}
