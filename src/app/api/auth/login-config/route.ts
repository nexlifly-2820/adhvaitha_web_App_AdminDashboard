import { NextResponse } from 'next/server';
import { BIGROCK_API_URL, fetchApi } from '@/lib/api-client';
import { DEFAULT_WALL } from '@/app/dashboard/app/settings/components/loginWallDefaults';

export const dynamic = 'force-dynamic';

// moving-wall photos from the admin (app settings doc "login_wall"), else the 9 built-in photos
async function wallPhotos(): Promise<string[]> {
  try {
    const raw: any = await fetchApi('/app_settings.php?doc_id=login_wall');
    const d = raw?.content ?? raw?.data ?? raw;
    if (String(d?.version) === '2' && Array.isArray(d?.photos)) {
      const l = d.photos.filter((p: any) => p?.enabled !== false && p?.url).map((p: any) => String(p.url));
      if (l.length) return l;
    }
  } catch {}
  return DEFAULT_WALL.map((p) => p.url);
}

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/auth.php?action=login_config`;
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json({ ...data, wall: await wallPhotos() }, { headers: { 'Cache-Control': 'no-store' } });
    }
    throw new Error('Backend failed');
  } catch (error: any) {
    // Graceful fallback
    return NextResponse.json({
      texts: {
        taglineStart: "Great taste delivered at",
        taglineAccent: "lowest rate",
        subtitle: "Handmade in Andhra kitchens, packed with love",
        buttonText: "Log in with email",
        sheetTitle: "Welcome to our kitchen",
        cardTitle: "Your kitchen details ✍️",
        otpSheetTitle: "Almost there",
        otpTitle: "Check your email ✉️",
        welcomeTitle: "Namaskaram 🙏",
        welcomeLine: "Your royal kitchen is ready",
        welcomeBack: "Welcome back",
        privacyUrl: "",
        termsUrl: "",
        otpLength: 6,
        resendSeconds: 30
      },
      wall: await wallPhotos()
    });
  }
}
