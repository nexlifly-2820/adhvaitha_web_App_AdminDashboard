import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

const FALLBACK_BEST_SELLERS = {
  settings: {
    enabled: true,
    kicker: "THIS MONTH'S CHAMPIONS",
    title: "Best",
    titleAccent: "sellers",
    subtitle: "Ranked by real orders from 12,000+ homes",
    intervalMs: 4000,
    rows: 3
  },
  categories: [
    {
      id: "all",
      name: "All",
      emoji: "🔥",
      items: [
        {
          id: "p1",
          variantId: "v1",
          name: "Bellam Avakaya",
          image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
          price: 120,
          mrp: 136,
          sold: "12K+",
          rating: 4.8,
          move: "up",
          moveBy: 2
        },
        {
          id: "p2",
          variantId: "v4",
          name: "Idli Karam Podi",
          image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
          price: 139,
          mrp: 150,
          sold: "9.8K+",
          rating: 4.9,
          move: "up",
          moveBy: 1
        },
        {
          id: "p3",
          variantId: "v8",
          name: "Sunnunda Laddu",
          image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
          price: 199,
          mrp: 220,
          sold: "8.4K+",
          rating: 4.9,
          move: "new",
          moveBy: 0
        },
        {
          id: "p4",
          variantId: "v6",
          name: "Kara Murukku",
          image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg",
          price: 129,
          mrp: 140,
          sold: "6.2K+",
          rating: 4.7,
          move: "up",
          moveBy: 3
        },
        {
          id: "p5",
          variantId: "v10",
          name: "Khara Mixture",
          image: "assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg",
          price: 149,
          mrp: 165,
          sold: "5.5K+",
          rating: 4.6,
          move: "down",
          moveBy: 1
        },
        {
          id: "p6",
          variantId: "v12",
          name: "Gongura Pickle",
          image: "assets/images/gongura_pickle.png",
          price: 130,
          mrp: 145,
          sold: "7.1K+",
          rating: 4.9,
          move: "up",
          moveBy: 2
        },
        {
          id: "p7",
          variantId: "v14",
          name: "Usiri Pickle",
          image: "assets/images/avakaya_pickle.png",
          price: 130,
          mrp: 150,
          sold: "6.8K+",
          rating: 4.8,
          move: "up",
          moveBy: 1
        },
        {
          id: "p8",
          variantId: "v16",
          name: "Chakinalu",
          image: "assets/images/chakralu.png",
          price: 110,
          mrp: 130,
          sold: "8.2K+",
          rating: 4.8,
          move: "new",
          moveBy: 0
        }
      ]
    }
  ]
};

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/app_settings.php?doc_id=best_sellers`;
    const res = await fetch(targetUrl, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.categories && data.categories.length > 0) {
        return NextResponse.json(data);
      }
    }
    return NextResponse.json(FALLBACK_BEST_SELLERS);
  } catch (error: any) {
    return NextResponse.json(FALLBACK_BEST_SELLERS);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetUrl = `${BIGROCK_API_URL}/app_settings.php?doc_id=best_sellers`;
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: 'Failed to save settings' }, { status: res.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
