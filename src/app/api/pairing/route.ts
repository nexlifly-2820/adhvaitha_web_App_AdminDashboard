import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/pairing.php?action=public_pairing`;
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
        eyebrow: 'CURATED COMBOS',
        title: 'The Art of',
        titleAccent: 'Pairing',
        subtitle: 'Flavors meant to be experienced together',
        explainText: 'Traditional South Indian dining has always paired complementary flavors.',
        matchText: 'Made for each other',
        buttonText: "Meet Amma's perfect couples",
        moreText: 'MORE PERFECT COUPLES'
      },
      couples: [
        {
          id: '1',
          name: 'Karam Podi + Avakaya',
          tag: 'BESTSELLER',
          mealIcon: '🌅',
          mealName: 'BREAKFAST',
          lovedText: "Amma's favorite morning duo",
          tip: 'Serve hot with piping hot idlis and pure cow ghee',
          a: {
            productId: 'p2',
            name: 'Karam Podi',
            bio: 'Stone-ground spices & roasted lentils',
            image: 'assets/images/bowl_karam_podi.png',
            tags: ['SPICY', 'CRISP']
          },
          b: {
            productId: 'p1',
            name: 'Bellam Avakaya',
            bio: 'Sun-cured sweet and spicy mango pickle',
            image: 'assets/images/bowl_bellam_avakaya.png',
            tags: ['SWEET', 'TANGY']
          },
          weights: [
            { label: '250 g each', price: 379, mrp: 419, aVariantId: 'p2_250', bVariantId: 'p1_250' }
          ]
        }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

