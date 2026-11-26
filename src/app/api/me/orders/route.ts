import { NextResponse } from 'next/server'
import { readCustomer } from '@/lib/customerAuth'
import { readAppOrders } from '@/lib/appOrders'
import { customerCanCancel } from '@/lib/orderActions'

export const dynamic = 'force-dynamic'

// Website / app → the logged-in customer's own orders (newest first).
export async function GET(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const mine = (await readAppOrders())
    .filter((o) => o.user_id === c.uid && !/payment (pending|failed)/i.test(String(o.status)))
    .slice(0, 100)
    .map((o) => ({
      id: o.order_id,
      source: o.source || 'app',
      createdAt: o.created_at,
      status: String(o.status || 'Placed'),
      items: (o.items || []).map((i) => ({ name: i.name, qty: i.qty, price: i.price, weight: i.weight || '', image: i.image || '' })),
      subtotal: Number(o.subtotal) || 0,
      delivery: Number(o.delivery_fee) || 0,
      packing: Number(o.packing_fee) || 0,
      gst: Number(o.gst) || 0,
      discount: Number(o.discount) || 0,
      coupon: o.coupon || '',
      total: Number(o.total) || Number(o.total_amount) || 0,
      paymentMethod: o.payment_method || '',
      paymentStatus: o.paymentStatus,
      address: o.shipping_address || '',
      rejectionReason: o.rejectionReason || '',
      refundStatus: o.refund_status || '',
      refundAmount: Number(o.refund_amount) || 0,
      trackingId: o.awb_code || '',
      courierName: o.courier_name || '',
      trackingUrl: o.tracking_url || (o.awb_code ? `https://shiprocket.co/tracking/${o.awb_code}` : ''),
      courierStatus: o.courier_status || '',
      deliveredAt: o.delivered_at || '',
      issue: o.issue ? { status: o.issue.status || 'open', at: o.issue.at } : null,
      canCancel: customerCanCancel(o),
    }))
  return NextResponse.json({ success: true, orders: mine })
}
