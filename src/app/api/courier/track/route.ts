import { NextResponse } from 'next/server';
import { readAppOrders, updateAppOrder } from '@/lib/appOrders';
import { mapCourierStatus } from '@/lib/shiprocket';
import { notifyUser } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

const TEXT: Record<string, [string, string]> = {
  shipped: ['On the way 🚚', 'Your order has been picked up by the courier'],
  out_for_delivery: ['Out for delivery 🛵', 'Your order will reach you today'],
  delivered: ['Delivered 💛', 'Enjoy your homemade treats! Tap to rate your order'],
};
const RANK: Record<string, number> = { pending: 0, placed: 0, accepted: 1, packing: 2, shipped: 3, out_for_delivery: 4, delivered: 5 };

// Shiprocket → Settings → Webhooks:  URL https://admin.adhvaithafoods.in/api/courier/track
// token = SHIPROCKET_WEBHOOK_TOKEN (Shiprocket sends it in the x-api-key header)
export async function POST(request: Request) {
  const want = process.env.SHIPROCKET_WEBHOOK_TOKEN || '';
  const got = request.headers.get('x-api-key') || new URL(request.url).searchParams.get('token') || '';
  if (!want || got !== want) return NextResponse.json({ ok: false }, { status: 401 });

  const b = await request.json().catch(() => ({}));
  const awb = String(b?.awb || '');
  const ref = String(b?.order_id || '');
  const courierStatus = String(b?.current_status || b?.shipment_status || '');
  const orders = await readAppOrders();
  const o = orders.find((x) => (awb && String(x.awb_code) === awb) || (ref && x.order_id === ref));
  if (!o) return NextResponse.json({ ok: true, note: 'order not found' }); // always 200 so Shiprocket keeps sending

  const events = Array.isArray(o.tracking_events) ? o.tracking_events : [];
  const ev = { status: courierStatus, location: String(b?.scans?.slice?.(-1)?.[0]?.location || b?.current_location || ''), at: String(b?.current_timestamp || new Date().toISOString()) };
  const patch: Record<string, any> = {
    courier_status: courierStatus,
    tracking_events: [...events.filter((e: any) => e.status !== ev.status), ev].slice(-25),
    etd: b?.etd || o.etd || '',
  };
  if (awb && !o.awb_code) patch.awb_code = awb;
  if (b?.courier_name) patch.courier_name = b.courier_name;
  if (/PICKED|IN TRANSIT|SHIPPED|OUT FOR|DELIVERED/i.test(courierStatus)) patch.picked_up = true;
  if (/RTO/i.test(courierStatus)) patch.rto = true;

  const next = mapCourierStatus(courierStatus);
  const cur = String(o.status || '').toLowerCase();
  const moved = next && !/rejected|cancel/.test(cur) && (RANK[next] ?? -1) > (RANK[cur] ?? -1);
  if (moved) {
    patch.status = next;
    if (next === 'delivered') patch.delivered_at = new Date().toISOString();
  }
  const saved = await updateAppOrder(o.order_id, patch);
  if (moved && saved && TEXT[next]) {
    try { await notifyUser(saved.user_id, { title: TEXT[next][0], body: `${TEXT[next][1]} · ${saved.order_id}`, data: { orderId: saved.order_id, type: 'order_status' } }); } catch {}
  }
  return NextResponse.json({ ok: true });
}

export async function GET() { return NextResponse.json({ ok: true }); }
