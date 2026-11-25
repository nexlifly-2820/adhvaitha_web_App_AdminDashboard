import { NextResponse } from 'next/server';
import { orderFromCheckout, upsertAppOrder, mirrorToOrdersPhp } from '@/lib/appOrders';

export const dynamic = 'force-dynamic';

// App → Cash on Delivery order.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    const order = orderFromCheckout(b, 'COD');
    if (!order.items.length) return NextResponse.json({ success: false, error: 'Your cart is empty' }, { status: 400 });
    await upsertAppOrder(order);
    await mirrorToOrdersPhp(order);
    return NextResponse.json({ success: true, order: { id: order.order_id, orderId: order.order_id, status: 'Placed', paymentMethod: 'Cash on Delivery', total: order.total } });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not place the order' }, { status: 500 });
  }
}
