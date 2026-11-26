import { NextResponse } from 'next/server';
import { fetchApi } from '@/lib/api-client';

export const dynamic = 'force-dynamic';

// Admin → GET /dashboard/app/api/orders/issue-photo?doc=u_issue_xxx  → the damage photo
export async function GET(request: Request) {
  const doc = new URL(request.url).searchParams.get('doc') || '';
  if (!/^u_issue_[A-Za-z0-9]+$/.test(doc)) return NextResponse.json({ success: false }, { status: 400 });
  try {
    const raw: any = await fetchApi(`/app_settings.php?doc_id=${doc}`);
    let d = raw?.content ?? raw?.data ?? raw;
    if (typeof d === 'string') d = JSON.parse(d);
    const m = String(d?.photo || '').match(/^data:(image\/[a-z]+);base64,(.+)$/);
    if (!m) return NextResponse.json({ success: false }, { status: 404 });
    return new NextResponse(Buffer.from(m[2], 'base64'), { headers: { 'Content-Type': m[1], 'Cache-Control': 'private, max-age=3600' } });
  } catch {
    return NextResponse.json({ success: false }, { status: 404 });
  }
}
