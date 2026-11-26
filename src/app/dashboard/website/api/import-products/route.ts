import { NextResponse } from 'next/server'
import { readDoc, writeDoc } from '@/lib/reviewInbox'
import { DEFAULT_SH_CATEGORIES, DEFAULT_SH_SETTINGS } from '@/app/dashboard/app/content/components/shopCatalogDefaults'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SITE = (process.env.WEBSITE_URL || 'https://adhvaithafoods.in').replace(/\/$/, '')
const norm = (s: any) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const abs = (u: string) => (!u ? '' : /^https?:\/\//.test(u) ? u : `${SITE}${u.startsWith('/') ? '' : '/'}${u}`)

// website category → the app's lazy-susan category (for products that are only on the website; kept hidden in the app)
const APP_CAT_WORDS: Record<string, string[]> = {
  'Prepared Foods': ['pickle', 'avakaya', 'pachadi'],
  'Salts, spices, soups': ['podi', 'powder', 'spice', 'masala', 'karam'],
  'Ready-to-eat savouries': ['snack', 'savour', 'namkeen'],
  'Indian Sweets & Snacks': ['sweet', 'laddu', 'mithai'],
}

/**
 * Admin → Website → Online store → "Link website products".
 * Joins the website's current product list into the one shared catalogue (doc "shop_catalog"):
 *  - products already in the app get their website photo + category (app unchanged)
 *  - products only on the website are added hidden in the app (enabled: false), sizes without prices
 *  - app products not on the website are marked "not on website"
 * Safe to run again: products already linked are left alone.
 */
export async function POST() {
  try {
    const r = await fetch(`${SITE}/api/web-products?legacy=1`, { cache: 'no-store' })
    const list: any[] = await r.json().catch(() => [])
    if (!Array.isArray(list) || !list.length) return NextResponse.json({ success: false, error: 'Could not read the website product list. Is the latest website deployed?' }, { status: 502 })

    const doc = await readDoc('shop_catalog').catch(() => null)
    const cats: any[] = JSON.parse(JSON.stringify(Array.isArray(doc?.categories) && doc.categories.length ? doc.categories : DEFAULT_SH_CATEGORIES))
    const all = () => cats.flatMap((c) => (Array.isArray(c.products) ? c.products : []))

    const find = (name: string) => {
      const n = norm(name)
      const ps = all()
      return ps.find((p) => norm(p.name) === n || norm(p.web?.sourceName) === n)
        || ps.filter((p) => { const m = norm(p.name); return m.length >= 5 && n.length >= 5 && (m.includes(n) || n.includes(m)) })
          .sort((a, b) => Math.abs(norm(a.name).length - n.length) - Math.abs(norm(b.name).length - n.length))[0]
    }
    const appCatFor = (webCat: string) => {
      const words = APP_CAT_WORDS[webCat] || []
      return cats.find((c) => words.some((w) => norm(`${c.slug} ${c.id} ${c.name}`).includes(w))) || cats[0]
    }

    let linked = 0, added = 0, skipped = 0
    const touched = new Set<any>()
    for (const w of list) {
      const name = String(w?.productName || w?.name || '').trim()
      if (!name) continue
      const web = {
        show: true,
        category: String(w?.category || ''),
        image: abs(String(w?.img || (Array.isArray(w?.images) ? w.images[0] : '') || '')),
        badge: String(w?.badge || ''),
        sourceId: String(w?.id || ''),
        sourceName: name,
      }
      const p = find(name)
      if (p) {
        touched.add(p)
        if (p.web) { skipped++; continue }
        p.web = web
        if (!p.description && w?.desc) p.description = String(w.desc)
        linked++
      } else {
        const c = appCatFor(web.category)
        if (!Array.isArray(c.products)) c.products = []
        const np = {
          id: `web_${slug(name)}`, name, image: web.image, description: String(w?.desc || w?.productDescription || ''),
          tag: web.badge, cureNote: '', spice: Math.min(5, Math.max(0, Math.round(Number(w?.spice) || 2))), rating: Math.min(5, Number(w?.rating) || 4.8),
          color1: '#8A1A10', color2: '#2A0806', enabled: false,
          variants: [
            { id: 'v1', label: '250g', price: 0, mrp: 0, inStock: true },
            { id: 'v2', label: '500g', price: 0, mrp: 0, inStock: true },
            { id: 'v3', label: '1kg', price: 0, mrp: 0, inStock: true },
          ],
          ingredients: [], process: 'Handmade', processText: 'Made in small batches with care.', origin: 'Andhra',
          shelfLife: '6 months', storage: 'Store in a cool, dry place.', highlight: '', features: ['No preservatives', 'Traditional recipe', '100% natural'],
          web,
        }
        c.products.push(np)
        touched.add(np)
        added++
      }
    }
    // app products that the website doesn't show: keep them off the website until you switch them on
    let notOnWeb = 0
    for (const p of all()) if (!touched.has(p) && !p.web) { p.web = { show: false, category: '', image: '', badge: '' }; notOnWeb++ }

    await writeDoc('shop_catalog', { ...(doc || {}), version: 2, settings: doc?.settings || DEFAULT_SH_SETTINGS, categories: cats, updatedAt: new Date().toISOString() })
    return NextResponse.json({ success: true, linked, added, skipped, notOnWeb })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not link products' }, { status: 500 })
  }
}
