import { NextResponse } from 'next/server';
import { createRazorpayOrder, razorpayReady, RZP_KEY_ID } from '@/lib/razorpay';
import { orderFromCheckout, upsertAppOrder } from '@/lib/appOrders';

export const dynamic = 'force-dynamic';

const METHOD: Record<string, string> = { upi: 'UPI', card: 'Card', netbanking: 'Net Banking' };

// App → start an online payment. Creates the Razorpay order and keeps a "Payment pending" order.
export async function POST(request: Request) {
  try {
    if (!razorpayReady()) return NextResponse.json({ success: false, error: 'Online payment is not set up yet. Please choose Cash on Delivery.' }, { status: 503 });
    const b = await request.json().catch(() => ({}));
    const order = orderFromCheckout(b, METHOD[String(b?.method)] || 'Online');
    if (!(order.total > 0)) return NextResponse.json({ success: false, error: 'Amount is missing' }, { status: 400 });
    if (!order.items.length) return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    const rzp = await createRazorpayOrder(Math.round(order.total * 100), order.order_id, { appOrderId: order.order_id, phone: order.customer_phone });
    order.razorpay_order_id = rzp.id;
    await upsertAppOrder(order);
    return NextResponse.json({
      success: true,
      key: RZP_KEY_ID,
      razorpayOrderId: rzp.id,
      amountPaise: rzp.amount,
      orderId: order.order_id,
      orderNo: order.order_id,
      shopName: 'AmbhuJakshi',
      contact: order.customer_phone,
      email: order.email,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not start the payment' }, { status: 500 });
  }
}
