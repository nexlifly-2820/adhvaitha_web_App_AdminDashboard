import { NextResponse } from 'next/server';
import { readAppOrders } from '@/lib/appOrders';

export const dynamic = 'force-dynamic';

// App → latest status of the orders this phone placed: GET /api/app-orders/status?ids=AMBJ1,AMBJ2
export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get('ids') || '').split(',').map((s) => s.trim()).filter(Boolean).slice(0, 50);
  if (!ids.length) return NextResponse.json({ success: true, orders: [] });
  try {
    const all = await readAppOrders();
    const want = new Set(ids);
    const orders = all
      .filter((o) => want.has(o.order_id))
      .map((o) => ({ id: o.order_id, status: o.status, paymentStatus: o.paymentStatus, paymentMethod: o.payment_method, rejectionReason: o.rejectionReason || '', updatedAt: o.updated_at || o.created_at,
        refundStatus: o.refund_status || '', refundId: o.refund_id || '', refundAmount: Number(o.refund_amount) || 0, refundedAt: o.refunded_at || '',
        trackingId: o.awb_code || '', courierName: o.courier_name || '', trackingUrl: o.tracking_url || (o.awb_code ? `https://shiprocket.co/tracking/${o.awb_code}` : ''),
        courierStatus: o.courier_status || '', etd: o.etd || '', pickedUp: Boolean(o.picked_up),
        trackingEvents: Array.isArray(o.tracking_events) ? o.tracking_events.slice(-10) : [],
        deliveredAt: o.delivered_at || '', issue: o.issue ? { status: o.issue.status || 'open', at: o.issue.at } : null,
        canCancel: !/rejected|cancel/i.test(String(o.status)) && ['pending', 'placed', 'accepted', 'packing', 'processing'].includes(String(o.status).toLowerCase()) && !o.picked_up }));
    return NextResponse.json({ success: true, orders }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'failed', orders: [] }, { status: 500 });
  }
}
