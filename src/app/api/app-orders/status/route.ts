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
      .map((o) => ({ id: o.order_id, status: o.status, paymentStatus: o.paymentStatus, paymentMethod: o.payment_method, rejectionReason: o.rejectionReason || '', updatedAt: o.updated_at || o.created_at }));
    return NextResponse.json({ success: true, orders }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'failed', orders: [] }, { status: 500 });
  }
}
