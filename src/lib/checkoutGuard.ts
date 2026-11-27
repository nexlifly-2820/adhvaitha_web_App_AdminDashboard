import { NextResponse } from 'next/server'
import { readCustomer } from '@/lib/customerAuth'
import { priceCart } from '@/lib/pricing'
import type { AppOrder } from '@/lib/appOrders'

/**
 * Checks the customer is logged in, works out the real bill and copies it onto the order.
 * Returns a response to send back when something is wrong.
 */
export async function guardCheckout(request: Request, b: any, order: AppOrder): Promise<NextResponse | null> {
  const cust = await readCustomer(request)
  if (!cust) return NextResponse.json({ success: false, relogin: true, error: 'Please log in again to place your order.' }, { status: 401 })
  const bill = await priceCart({ ...b, coupon: b?.coupon ?? b?.code ?? '' }, { uid: cust.uid, phone: order.customer_phone })
  if (!bill.items.length) return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 })
  // the website only sells products from the shared catalogue with a real price
  if (b?.source === 'web' && bill.unverified > 0) {
    const bad = bill.items.find((l) => !l.verified)
    return NextResponse.json({ success: false, priceChanged: true, error: `${bad?.name || 'An item'} is not available online right now. Please remove it from your cart.` }, { status: 409 })
  }
  const sent = Math.round(Number(b?.total ?? b?.amount) || 0)
  if (bill.couponError) {
    return NextResponse.json({ success: false, couponError: bill.couponError, error: `${bill.couponError}. Please remove the coupon and try again.`, bill: { total: bill.total } }, { status: 409 })
  }
  if (Math.abs(sent - Math.round(bill.total)) > 1) {
    return NextResponse.json({ success: false, priceChanged: true, error: `Your total is now ₹${Math.round(bill.total)}. Please go back to your cart to check it.`, bill: { total: bill.total } }, { status: 409 })
  }
  Object.assign(order, {
    user_id: cust.uid,
    email: order.email || cust.email,
    items: bill.items.map(({ name, qty, price, weight, image, combo }) => ({ name, qty, price, weight, image, ...(combo ? { combo } : {}) })),
    subtotal: bill.subtotal,
    delivery_fee: bill.delivery,
    packing_fee: bill.packing,
    gst: bill.gst,
    discount: bill.discount,
    coupon: bill.coupon || '',
    total: bill.total,
    total_amount: bill.total,
    unverified_prices: bill.unverified,
  })
  return null
}
