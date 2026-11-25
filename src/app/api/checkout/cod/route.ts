import { NextResponse } from 'next/server';
import { orderFromCheckout, upsertAppOrder, mirrorToOrdersPhp } from '@/lib/appOrders';
import { notifyUser } from '@/lib/fcm';

export const dynamic = 'force-dynamic';

// App → Cash on Delivery order.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const order = orderFromCheckout(b, 'COD');
    if (!order.items.length) return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    await upsertAppOrder(order);
    await mirrorToOrdersPhp(order);
    await notifyUser(order.user_id, { title: 'Order placed 🎉', body: `Thank you! Order ${order.order_id} is confirmed — pay ₹${Math.round(order.total)} on delivery.`, data: { orderId: order.order_id, type: 'order_placed' } });
    return NextResponse.json({ success: true, order: { id: order.order_id, orderId: order.order_id, status: 'Placed', paymentMethod: 'Cash on Delivery', total: order.total } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not place the order' }, { status: 500 });
  }
}
