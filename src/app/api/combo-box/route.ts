import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/combo_box.php?action=public_combo`;
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default fallback
    return NextResponse.json({
      settings: {
        enabled: true,
        eyebrow: 'BUILD YOUR BOX',
        titleStart: "Amma's",
        titleAccent: 'Combo Box',
        jars: 4,
        boxLabel: "Amma's Combo",
        lidText: "Made with love,\npacked by Amma",
        tagText: "For you, with love 💛",
        sizes: ['250 g', '500 g', '1 kg'],
        tiers: [
          { jars: 4, percent: 10 },
          { jars: 6, percent: 15 },
          { jars: 8, percent: 20 }
        ],
        categories: ['Pickles', 'Podis', 'Snacks', 'Sweets'],
        homeLine: 'pick any 4 jars, Amma packs them',
        homeTitle: 'Fill the box,',
        homeAccent: 'save more',
        homeButton: 'Start building your box'
      },
      products: []
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

