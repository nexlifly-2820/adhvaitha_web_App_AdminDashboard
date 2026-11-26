import { NextResponse } from 'next/server'
import { readDoc } from '@/lib/reviewInbox'
import { DEFAULT_SH_CATEGORIES } from '@/app/dashboard/app/content/components/shopCatalogDefaults'
import { readWebStore } from '@/lib/storeSettings'

export const dynamic = 'force-dynamic'

const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0)

// Website → the same products, sizes and prices the app sells (Admin → App → Shop catalogue).
// The price charged is always checked again on the server at checkout.
export async function GET(request: Request) {
  try {
    const all = new URL(request.url).searchParams.get('all') === '1'
    const [d, store, fees] = await Promise.all([readDoc('shop_catalog').catch(() => null), readWebStore(), readDoc('delivery_config').catch(() => null)])
    const cats: any[] = Array.isArray(d?.categories) && d.categories.length ? d.categories : (DEFAULT_SH_CATEGORIES as any[])
    const hidden = new Set(store.hidden)
    const products = cats.filter((c) => c?.enabled !== false).flatMap((c) =>
      (Array.isArray(c?.products) ? c.products : [])
        .filter((p: any) => p?.enabled !== false && p?.name && (all || !hidden.has(String(p.id || p.name))))
        .map((p: any) => ({
          id: String(p.id || p.name),
          name: String(p.name),
          image: String(p.image || ''),
          category: String(c?.id || ''),
          categoryName: String(c?.name || c?.label || ''),
          hidden: hidden.has(String(p.id || p.name)),
          variants: (Array.isArray(p?.variants) ? p.variants : [])
            .filter((v: any) => num(v?.price) > 0)
            .map((v: any) => ({ label: String(v.label || ''), price: num(v.price), mrp: num(v.mrp), inStock: v?.inStock !== false })),
        }))
        .filter((p: any) => p.variants.length),
    )
    return NextResponse.json({
      success: true,
      shopEnabled: store.shopEnabled,
      codEnabled: store.codEnabled,
      notice: store.notice,
      delivery: { base: fees?.base_fee == null ? 40 : num(fees.base_fee), free: fees?.free_threshold == null ? 500 : num(fees.free_threshold) },
      products,
    }, { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not load products' }, { status: 500 })
  }
}
