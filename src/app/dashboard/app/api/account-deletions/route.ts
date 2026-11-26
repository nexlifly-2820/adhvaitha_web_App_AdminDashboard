export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { readDeletions, writeDeletions } from '@/lib/accountDeletions';

export async function GET() {
  return NextResponse.json({ success: true, data: await readDeletions() });
}

// mark a request as done { id }
export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const items = await readDeletions();
  const i = items.findIndex((x) => x.id === b.id);
  if (i < 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  items[i] = { ...items[i], status: b.status === 'pending' ? 'pending' : 'done', doneAt: new Date().toISOString() };
  await writeDeletions(items);
  return NextResponse.json({ success: true });
}
