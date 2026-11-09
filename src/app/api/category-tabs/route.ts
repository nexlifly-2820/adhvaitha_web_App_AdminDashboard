import { NextResponse } from 'next/server';
import { BIGROCK_API_URL } from '@/lib/api-client';

export async function GET() {
  try {
    const targetUrl = `${BIGROCK_API_URL}/category_tabs.php?action=public_tabs`;
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
      tabs: [
        { id: '1', slug: 'all', label: 'All', image: '', badge: '', allImages: [] },
        { id: '2', slug: 'pickles', label: 'Pickles', image: 'assets/images/bowl_bellam_avakaya.png', badge: '', allImages: [] },
        { id: '3', slug: 'snacks', label: 'Snacks', image: 'assets/images/bowl_karam_janthukalu.png', badge: 'NEW', allImages: [] },
        { id: '4', slug: 'sweets', label: 'Sweets', image: 'assets/images/bowl_sunnunda_laddu.png', badge: '', allImages: [] },
        { id: '5', slug: 'podis', label: 'Podis', image: 'assets/images/bowl_karam_podi.png', badge: '', allImages: [] },
        { id: '6', slug: 'combos', label: 'Combos', image: 'assets/images/combos.png', badge: '', allImages: [] }
      ]
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

