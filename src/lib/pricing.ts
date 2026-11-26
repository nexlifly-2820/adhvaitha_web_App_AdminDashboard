// Server-side price & coupon check. The app shows prices, but the amount charged is worked out here.
import { readDoc } from '@/lib/reviewInbox'
import { readAppOrders, type AppOrder } from '@/lib/appOrders'
import { DEFAULT_SH_CATEGORIES } from '@/app/dashboard/app/content/components/shopCatalogDefaults'

export interface Offer {
  code: string; title: string; sub: string; enabled: boolean
  type: 'percent' | 'flat' | 'freeship'; value: number; minOrder: number; maxDiscount: number
  firstOrderOnly: boolean; oncePerCustomer: boolean; startDate: string; endDate: string; totalLimit: number; category: string
}
export interface CartLine { name: string; qty: number; price: number; weight?: string; image?: string; verified?: boolean; category?: string }
export interface Bill {
  items: CartLine[]; subtotal: number; delivery: number; packing: number; gst: number; discount: number; total: number
  coupon: string | null; couponError: string | null; unverified: number
}

const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v ?? '').replace(/[^0-9.]/g, '')) || 0)
const norm = (s: string) => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
const r2 = (n: number) => Math.round(n * 100) / 100

const DEFAULT_OFFERS: Offer[] = [
  { code: 'FIRST30', title: '30% OFF', sub: 'On your first order above ₹500', enabled: true, type: 'percent', value: 30, minOrder: 500, maxDiscount: 0, firstOrderOnly: true, oncePerCustomer: true, startDate: '', endDate: '', totalLimit: 0, category: '' },
  { code: 'FREESHIP', title: '₹0 DELIVERY', sub: 'On all orders · no minimum', enabled: true, type: 'freeship', value: 0, minOrder: 0, maxDiscount: 0, firstOrderOnly: false, oncePerCustomer: false, startDate: '', endDate: '', totalLimit: 0, category: '' },
  { code: 'PICKLE100', title: '₹100 OFF', sub: 'On pickle orders above ₹999', enabled: true, type: 'flat', value: 100, minOrder: 999, maxDiscount: 0, firstOrderOnly: false, oncePerCustomer: false, startDate: '', endDate: '', totalLimit: 0, category: 'pickles' },
  { code: 'FESTIVE20', title: '20% OFF', sub: 'On orders above ₹1500', enabled: true, type: 'percent', value: 20, minOrder: 1500, maxDiscount: 0, firstOrderOnly: false, oncePerCustomer: false, startDate: '', endDate: '', totalLimit: 0, category: '' },
]

/** Same "read the rule from the text" fallback the app and admin use for old saved offers. */
function toOffer(x: any): Offer {
  const title = String(x?.title ?? '')
  const t = title.toUpperCase()
  const code = String(x?.code ?? '').trim().toUpperCase()
  let type: Offer['type'] = x?.type === 'flat' || x?.type === 'freeship' || x?.type === 'percent' ? x.type : 'percent'
  let value = num(x?.value)
  if (!x?.type) {
    const pct = t.match(/(\d+)\s*%/); const rs = t.match(/₹\s*(\d+)/)
    if (pct) { type = 'percent'; value = +pct[1] }
    else if (t.includes('DELIVERY') || t.includes('SHIP') || code.includes('SHIP') || (rs && rs[1] === '0')) type = 'freeship'
    else if (rs) { type = 'flat'; value = +rs[1] }
  }
  let minOrder = x?.minOrder == null ? NaN : num(x.minOrder)
  if (Number.isNaN(minOrder)) { const m = String(x?.sub ?? '').match(/(?:above|over|min[a-z]*)\D{0,6}(\d[\d,]*)/i); minOrder = m ? +m[1].replace(/,/g, '') : 0 }
  return {
    code, title, sub: String(x?.sub ?? ''), enabled: x?.enabled !== false, type, value, minOrder, maxDiscount: num(x?.maxDiscount),
    firstOrderOnly: x?.firstOrderOnly === undefined ? code === 'FIRST30' : !!x.firstOrderOnly,
    oncePerCustomer: x?.oncePerCustomer === undefined ? code === 'FIRST30' : !!x.oncePerCustomer,
    startDate: String(x?.startDate ?? ''), endDate: String(x?.endDate ?? ''), totalLimit: Math.max(0, Math.round(num(x?.totalLimit))),
    category: String(x?.category ?? (code === 'PICKLE100' ? 'pickles' : '')),
  }
}

export async function loadOffers(): Promise<Offer[]> {
  const d = await readDoc('home_offers')
  const list = Array.isArray(d?.items) ? d.items.map(toOffer).filter((o: Offer) => o.code) : DEFAULT_OFFERS
  return list
}

/** name → { size → price, category } from the Shop catalogue (admin) or its defaults. */
async function loadCatalog() {
  const d = await readDoc('shop_catalog')
  const cats: any[] = Array.isArray(d?.categories) && d.categories.length ? d.categories : (DEFAULT_SH_CATEGORIES as any[])
  const map = new Map<string, { cat: string; sizes: Map<string, number>; first: number }>()
  for (const c of cats) {
    for (const p of Array.isArray(c?.products) ? c.products : []) {
      const sizes = new Map<string, number>()
      for (const v of Array.isArray(p?.variants) ? p.variants : []) if (num(v?.price) > 0) sizes.set(norm(v.label), num(v.price))
      const first = sizes.size ? [...sizes.values()][0] : 0
      if (first > 0) map.set(norm(p?.name), { cat: String(c?.id || ''), sizes, first })
    }
  }
  return map
}

async function loadDelivery() {
  const d = await readDoc('delivery_config')
  return {
    base: d?.base_fee == null ? 40 : num(d.base_fee),
    free: d?.free_threshold == null ? 500 : num(d.free_threshold),
    packing: num(d?.packing_fee),
    gst: num(d?.gst_percentage),
  }
}

const isRealOrder = (o: AppOrder) => o.paymentStatus === 'paid' || o.paymentStatus === 'cod' || (o.status && !/pending|fail|cancel/i.test(o.status) && o.paymentStatus !== 'pending' && o.paymentStatus !== 'failed')
const phone10 = (s: string) => String(s || '').replace(/\D/g, '').slice(-10)

export function couponProblem(o: Offer | undefined, ctx: { subtotal: number; lines: CartLine[]; uid: string; phone: string; orders: AppOrder[] }): string | null {
  if (!o || !o.enabled) return 'This coupon code is not valid'
  const today = new Date().toISOString().slice(0, 10)
  if (o.startDate && today < o.startDate) return `${o.code} starts on ${o.startDate}`
  if (o.endDate && today > o.endDate) return `${o.code} has expired`
  if (o.category) {
    const inCat = ctx.lines.filter((l) => l.category === o.category || (!l.category && norm(l.name).includes(norm(o.category).replace(/s$/, ''))))
    if (!inCat.length) return `${o.code} is only for ${o.category}`
  }
  if (ctx.subtotal < o.minOrder) return `Add ₹${Math.ceil(o.minOrder - ctx.subtotal)} more to use ${o.code} (min order ₹${o.minOrder})`
  const mine = ctx.orders.filter((x) => isRealOrder(x) && ((ctx.uid && x.user_id === ctx.uid) || (phone10(ctx.phone).length === 10 && phone10(x.customer_phone) === phone10(ctx.phone))))
  if (o.firstOrderOnly && mine.length) return `${o.code} is only for your first order`
  if (o.oncePerCustomer && mine.some((x) => String(x.coupon || '').toUpperCase() === o.code)) return `You have already used ${o.code}`
  if (o.totalLimit > 0 && ctx.orders.filter((x) => isRealOrder(x) && String(x.coupon || '').toUpperCase() === o.code).length >= o.totalLimit) return `${o.code} has been fully used`
  return null
}

/** Re-prices the cart from the catalogue and checks the coupon. */
export async function priceCart(body: any, who: { uid: string; phone: string }): Promise<Bill & { offers: Offer[]; orders: AppOrder[]; ctx: any }> {
  const [catalog, fees, offers, orders] = await Promise.all([loadCatalog(), loadDelivery(), loadOffers(), readAppOrders()])
  let unverified = 0
  const items: CartLine[] = (Array.isArray(body?.items) ? body.items : []).slice(0, 60).map((it: any) => {
    const name = String(it?.name ?? '').replace(/[<>]/g, '').trim().slice(0, 120) || 'Product'
    const qty = Math.min(50, Math.max(1, Math.round(num(it?.qty ?? it?.quantity) || 1)))
    const weight = String(it?.weight ?? '').slice(0, 20)
    const sent = num(it?.price)
    const c = catalog.get(norm(name))
    let price = sent
    let verified = false
    if (c) {
      const p = c.sizes.get(norm(weight))
      // never charge less than the shop price for that size (stops a changed app from paying ₹1)
      const floor = p || Math.min(...c.sizes.values())
      price = Math.max(sent, floor)
      verified = true
    }
    if (!verified) unverified++
    if (!(price > 0)) price = 0
    return { name, qty, price, weight, image: String(it?.image ?? '').slice(0, 300), verified, category: c?.cat || '' }
  })
  const subtotal = r2(items.reduce((s, l) => s + l.price * l.qty, 0))
  const delivery = items.length ? (subtotal >= fees.free ? 0 : fees.base) : 0
  const code = String(body?.coupon ?? body?.code ?? '').trim().toUpperCase()
  const ctx = { subtotal, lines: items, uid: who.uid, phone: who.phone, orders }
  let discount = 0
  let couponError: string | null = null
  let coupon: string | null = null
  if (code) {
    const o = offers.find((x) => x.code === code)
    couponError = couponProblem(o, ctx)
    if (!couponError && o) {
      coupon = o.code
      discount = o.type === 'freeship' ? delivery : o.type === 'flat' ? o.value : subtotal * o.value / 100
      if (o.type === 'percent' && o.maxDiscount > 0) discount = Math.min(discount, o.maxDiscount)
      discount = r2(Math.min(discount, subtotal))
    }
  }
  const packing = items.length ? fees.packing : 0
  const gst = items.length ? r2((subtotal - discount) * fees.gst / 100) : 0
  const total = items.length ? r2(subtotal - discount + delivery + packing + gst) : 0
  return { items, subtotal, delivery, packing, gst, discount, total, coupon, couponError, unverified, offers, orders, ctx }
}
