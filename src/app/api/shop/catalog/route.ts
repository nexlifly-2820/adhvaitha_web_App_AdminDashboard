import { NextResponse } from 'next/server'
import { readDoc } from '@/lib/reviewInbox'
import { DEFAULT_SH_CATEGORIES } from '@/app/dashboard/app/content/components/shopCatalogDefaults'
import { readWebStore } from '@/lib/storeSettings'

export const dynamic = 'force-dynamic'

const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0)

// Website → the one shared product list (Admin → Shop catalogue). Same names, descriptions, sizes, prices, stock as the app.
// Each product's "web" box decides if/how it shows on the website. The price charged is checked again at checkout.
export async function GET(request: Request) {
  try {
    const all = new URL(request.url).searchParams.get('all') === '1'
    const [d, store, fees] = await Promise.all([readDoc('shop_catalog').catch(() => null), readWebStore(), readDoc('delivery_config').catch(() => null)])
    const cats: any[] = Array.isArray(d?.categories) && d.categories.length ? d.categories : (DEFAULT_SH_CATEGORIES as any[])
    const hidden = new Set(store.hidden)
    let shared = false
    const products = cats.flatMap((c) =>
      (Array.isArray(c?.products) ? c.products : [])
        .filter((p: any) => p?.name)
        .map((p: any) => {
          const web = p?.web && typeof p.web === 'object' ? p.web : null
          if (web) shared = true
          // with a website box: its "Show on website"; old products without one: shown when on in the app
          const onWeb = web ? web.show === true : p?.enabled !== false && c?.enabled !== false
          return {
            id: String(p.id || p.name),
            name: String(p.name),
            image: String(p.image || ''),
            description: String(p.description || ''),
            rating: num(p.rating) || 4.8,
            spice: num(p.spice),
            category: String(c?.id || ''),
            categoryName: String(c?.name || c?.label || ''),
            onWeb: onWeb && !hidden.has(String(p.id || p.name)),
            hidden: hidden.has(String(p.id || p.name)),
            web: web ? { category: String(web.category || ''), image: String(web.image || ''), badge: String(web.badge || ''), sourceId: String(web.sourceId || '') } : null,
            variants: (Array.isArray(p?.variants) ? p.variants : [])
              .filter((v: any) => String(v?.label || '').trim())
              .map((v: any) => ({ label: String(v.label), price: num(v.price), mrp: num(v.mrp), inStock: v?.inStock !== false })),
          }
        })
        .filter((p: any) => p.variants.length && (all || p.onWeb)),
    )
    return NextResponse.json({
      success: true,
      shared,
      shopEnabled: store.shopEnabled,
      codEnabled: store.codEnabled,
      notice: store.notice,
      delivery: { base: fees?.base_fee == null ? 40 : num(fees.base_fee), free: fees?.free_threshold == null ? 500 : num(fees.free_threshold) },
      products,
    }, { headers: { 'Cache-Control': 's-maxage=30, stale-while-revalidate=120' } })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not load products' }, { status: 500 })
  }
}
