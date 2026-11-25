import { NextResponse } from 'next/server';
import { pushReady, readTokens, writeTokens, sendToToken, sendToTopic } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

// Admin → send a notification. { mode: 'all' | 'user', userId?, title, body, image?, link? }
export async function POST(request: Request) {
  try {
    if (!pushReady()) return NextResponse.json({ success: false, error: 'Push is not set up: add FIREBASE_SERVICE_ACCOUNT in Vercel (see notes) and redeploy.' }, { status: 503 });
    const b = await request.json().catch(() => ({}));
    const title = String(b?.title || '').trim().slice(0, 120);
    const body = String(b?.body || '').trim().slice(0, 500);
    const image = String(b?.image || '').trim();
    if (!title || !body) return NextResponse.json({ success: false, error: 'Title and message are required' }, { status: 400 });
    const msg = { title, body, image: /^https:\/\//.test(image) ? image : undefined, data: { link: String(b?.link || '') } };

    if (b?.mode === 'user') {
      const userId = String(b?.userId || '').trim();
      const all = await readTokens();
      const tokens = all[userId] || [];
      if (!tokens.length) return NextResponse.json({ success: false, error: 'This customer has no phone registered for notifications yet (they need to open the app once after the update).' }, { status: 404 });
      let sent = 0;
      const dead: string[] = [];
      let lastError = '';
      for (const t of tokens) {
        const r = await sendToToken(t, msg);
        if (r.ok) sent++;
        else { lastError = r.error || ''; if (r.unregistered) dead.push(t); }
      }
      if (dead.length) { all[userId] = tokens.filter((t) => !dead.includes(t)); await writeTokens(all); }
      if (!sent) return NextResponse.json({ success: false, error: lastError || 'Could not deliver' }, { status: 502 });
      return NextResponse.json({ success: true, sent });
    }

    const r = await sendToTopic('marketing', msg);
    if (!r.ok) return NextResponse.json({ success: false, error: r.error }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Send failed' }, { status: 500 });
  }
}

// Admin → is push set up? how many customers have registered phones?
export async function GET() {
  const tokens = pushReady() ? await readTokens() : {};
  return NextResponse.json({ ready: pushReady(), users: Object.keys(tokens).length, userIds: Object.keys(tokens).slice(0, 500) });
}
