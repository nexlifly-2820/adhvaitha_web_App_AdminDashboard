import { NextResponse } from 'next/server'
import { readCustomer } from '@/lib/customerAuth'
import { couponProblem, priceCart } from '@/lib/pricing'

export const dynamic = 'force-dynamic'

// App → which coupons can this customer use on this cart, and what the bill is with { code }.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}))
    const cust = await readCustomer(request)
    const phone = String(b?.phone || b?.address?.phone || '')
    const bill = await priceCart(b, { uid: cust?.uid || '', phone })
    const offers = bill.offers.filter((o) => o.enabled).map((o) => {
      const why = couponProblem(o, bill.ctx)
      return { code: o.code, title: o.title, sub: o.sub, type: o.type, value: o.value, minOrder: o.minOrder, firstOrderOnly: o.firstOrderOnly, endDate: o.endDate, ok: !why, reason: why }
    })
    return NextResponse.json({
      success: true,
      loggedIn: !!cust,
      offers,
      bill: { itemsTotal: bill.subtotal, delivery: bill.delivery, packing: bill.packing, gst: bill.gst, discount: bill.discount, total: bill.total, coupon: bill.coupon, couponError: bill.couponError },
    })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not check coupons' }, { status: 500 })
  }
}
