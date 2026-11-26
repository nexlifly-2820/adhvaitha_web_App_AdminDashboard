import { NextResponse } from 'next/server';
import { cancelAppOrder, refundAppOrder } from '@/lib/orderActions';

export const dynamic = 'force-dynamic';

// Admin → POST /dashboard/app/api/orders/refund
//   { orderId, action: 'cancel', reason, amount? }  cancel (+ full or partial refund if paid)
//   { orderId, action: 'refund', reason, amount? }  refund only (partial / retry), status unchanged
export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}));
  const id = String(b?.orderId || '');
  const amount = Number(b?.amount) || 0;
  const reason = String(b?.reason || '').replace(/[<>]/g, '').slice(0, 200);
  if (!id) return NextResponse.json({ success: false, error: 'orderId missing' }, { status: 400 });
  const r = b?.action === 'refund'
    ? await refundAppOrder(id, amount, reason || 'Refund by Adhvaitha')
    : await cancelAppOrder(id, { by: 'admin', reason: reason || 'Cancelled by Adhvaitha', refundAmount: amount });
  if (!r.ok) return NextResponse.json({ success: false, error: r.error }, { status: 409 });
  return NextResponse.json({ success: true, order: r.order });
}
