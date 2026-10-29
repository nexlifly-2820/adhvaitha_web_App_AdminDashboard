import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/auth.php?action=login_config`;
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
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
      wall: [
        "assets/images/banner_1.jpg",
        "assets/images/banner_2.jpg",
        "assets/images/banner_3.jpg",
        "assets/images/banner_4.jpg",
        "assets/images/avakaya_pickle.png"
      ]
    });
  }
}
