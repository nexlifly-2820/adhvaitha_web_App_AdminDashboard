import { NextResponse } from 'next/server';
import { verifySignature, fetchPayment } from '@/lib/razorpay';
import { readAppOrders, updateAppOrder, mirrorToOrdersPhp } from '@/lib/appOrders';
import { notifyUser } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

// App → after Razorpay says success. Checks the signature, then marks the order as paid & placed.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const orderId = String(b?.orderId || '');
    const rOrder = String(b?.razorpay_order_id || '');
    const rPay = String(b?.razorpay_payment_id || '');
    const sig = String(b?.razorpay_signature || '');
    if (!orderId || !rOrder || !rPay || !sig) return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });

    const existing = (await readAppOrders()).find((o) => o.order_id === orderId);
    if (!existing) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    if (existing.razorpay_order_id && existing.razorpay_order_id !== rOrder) return NextResponse.json({ success: false, error: 'Payment does not match this order' }, { status: 400 });
    if (!verifySignature(rOrder, rPay, sig)) {
      await updateAppOrder(orderId, { paymentStatus: 'failed', status: 'Payment failed', failure_reason: 'Signature check failed' });
      return NextResponse.json({ success: false, error: 'Payment could not be verified' }, { status: 400 });
    }
    const p: any = await fetchPayment(rPay).catch(() => null);
    const method = p?.method ? String(p.method).toUpperCase() : existing.payment_method;
    const updated = await updateAppOrder(orderId, { paymentStatus: 'paid', status: 'Placed', razorpay_payment_id: rPay, payment_method: `${method === 'NETBANKING' ? 'Net Banking' : method} · Paid` });
    if (updated) {
      await mirrorToOrdersPhp(updated);
      await notifyUser(updated.user_id, { title: 'Order placed 🎉', body: `Thank you! Payment of ₹${Math.round(Number(updated.total) || 0)} received. Amma will start preparing order ${orderId} soon.`, data: { orderId, type: 'order_placed' } });
    }
    return NextResponse.json({ success: true, order: { id: orderId, orderId, status: 'Placed', paymentMethod: updated?.payment_method, total: updated?.total } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Verification failed' }, { status: 500 });
  }
}
