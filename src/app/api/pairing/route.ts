import { NextResponse } from 'next/server';
import { BIGROCK_API_URL, fetchApi } from '@/lib/api-client';
import { DEFAULT_SETTINGS, DEFAULT_COUPLES } from '@/app/dashboard/app/content/components/pairDefaults';

export const dynamic = 'force-dynamic';

// Serves the Art of Pairing data to the app.
// 1) what the admin saved (app settings doc "art_of_pairing"), 2) old pairing.php, 3) built-in defaults.
export async function GET() {
  try {
    const raw: any = await fetchApi(`/app_settings.php?doc_id=art_of_pairing`);
    const d = raw?.data ?? raw;
    if (d && Array.isArray(d.couples) && d.couples.length) {
      return NextResponse.json({
        settings: { ...DEFAULT_SETTINGS, ...(d.settings || {}) },
        couples: d.couples.filter((c: any) => c?.enabled !== false),
      }, { headers: { 'Cache-Control': 'no-store' } });
    }
  } catch {}

  try {
    const res = await fetch(`${BIGROCK_API_URL}/pairing.php?action=public_pairing`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.couples) && data.couples.length) return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({ settings: DEFAULT_SETTINGS, couples: DEFAULT_COUPLES });
}
