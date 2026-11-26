import { NextResponse } from 'next/server';
import { readCustomer } from '@/lib/customerAuth';
import { readAppOrders } from '@/lib/appOrders';
import { cancelAppOrder } from '@/lib/orderActions';

export const dynamic = 'force-dynamic';

// App → POST /api/orders/{id}/cancel  { reason }   (needs the login token)
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cust = await readCustomer(request);
  if (!cust) return NextResponse.json({ success: false, error: 'Please log in again' }, { status: 401 });
  const { id } = await params;
  const o = (await readAppOrders()).find((x) => x.order_id === id);
  if (!o || o.user_id !== cust.uid) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  const b = await request.json().catch(() => ({}));
  const reason = String(b?.reason || '').replace(/[<>]/g, '').slice(0, 200);
  const r = await cancelAppOrder(id, { by: 'customer', reason: reason ? `Cancelled by customer: ${reason}` : 'Cancelled by customer' });
  if (!r.ok) return NextResponse.json({ success: false, error: r.error }, { status: 409 });
  return NextResponse.json({
    success: true,
    refundStatus: r.order?.refund_status || 'none',
    refundAmount: r.order?.refund_amount || 0,
    message: r.order?.refund_status === 'none' ? 'Order cancelled' : 'Order cancelled. Refund started.',
  });
}
