import { NextResponse } from 'next/server';
import { readAppOrders, updateAppOrder } from '@/lib/appOrders';
import { shipAppOrder, shiprocketLabel, shiprocketReady } from '@/lib/shiprocket';
import { notifyUser } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

// Admin → POST /dashboard/app/api/shiprocket/push  { orderId, action?: 'ship' | 'label' }
export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const id = String(b?.orderId || b?.order?.id || b?.order?.order_id || '');
  if (!shiprocketReady()) return NextResponse.json({ success: false, error: 'Shiprocket is not connected yet. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in Vercel and redeploy.' }, { status: 400 });
  const o = (await readAppOrders()).find((x) => x.order_id === id);
  if (!o) return NextResponse.json({ success: false, error: 'Only app orders can be shipped from here' }, { status: 404 });
  if (/rejected|cancel/i.test(String(o.status))) return NextResponse.json({ success: false, error: 'This order is cancelled' }, { status: 409 });
  try {
    if (b?.action === 'label') {
      if (!o.shipment_id) throw new Error('Ship the order first');
      const url = await shiprocketLabel(String(o.shipment_id));
      await updateAppOrder(id, { label_url: url });
      return NextResponse.json({ success: true, label_url: url });
    }
    const r = await shipAppOrder(o);
    const wasShipped = String(o.status).toLowerCase() === 'shipped';
    const saved = await updateAppOrder(id, { ...r, status: 'shipped', shipped_at: o.shipped_at || new Date().toISOString(), trackingId: r.awb_code, courierName: r.courier_name });
    if (!wasShipped && saved) {
      try { await notifyUser(saved.user_id, { title: 'On the way 🚚', body: `Shipped with ${r.courier_name || 'our courier'} · AWB ${r.awb_code} · ${id}`, data: { orderId: id, type: 'order_status' } }); } catch {}
    }
    return NextResponse.json({ success: true, ...r });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Shiprocket failed' }, { status: 500 });
  }
}
