import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/specials.php?action=public_specials`;
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default fallback if server is initializing
    return NextResponse.json({
      settings: {
        enabled: true,
        title: 'AMBHUJAKSHI',
        subtitle: 'SPECIALS',
        tagline: 'Seen through the Lotus Eye',
        tagText: "AMMA'S SPECIAL",
        moreText: 'MORE SPECIALS',
        showIntro: true
      },
      items: [
        {
          id: '1',
          productId: 'p1',
          name: 'Bellam Avakaya',
          story: "Amma's sun-cured sweet and spicy jaggery mango pickle.",
          image: 'assets/images/bowl_bellam_avakaya.png',
          features: [
            { icon: 'sun', text: '21 Days Sun-Cured' },
            { icon: 'recipe', text: 'Organic Palm Jaggery' },
            { icon: 'leaf', text: 'No Preservatives' }
          ],
          variants: [
            { id: '250g', label: '250 g', price: 120, mrp: 136 },
            { id: '500g', label: '500 g', price: 230, mrp: 260 }
          ],
          defaultVariant: 0
        }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
