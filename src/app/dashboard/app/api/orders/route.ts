export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi, postApi } from '@/lib/api-client';
import { cancelAppOrder } from '@/lib/orderActions';
import { readAppOrders, updateAppOrder } from '@/lib/appOrders';
import { notifyUser } from '@/lib/fcm';

const STATUS_TEXT: Record<string, [string, string]> = {
  accepted: ['Order accepted 🍲', 'Amma has started preparing your order'],
  packing: ['Packed with love 📦', 'Your order is sealed and ready to ship'],
  shipped: ['On the way 🚚', 'Your order has been shipped'],
  out_for_delivery: ['Out for delivery 🛵', 'Your order will reach you today'],
  delivered: ['Delivered 💛', 'Enjoy your homemade treats! Tap to rate your order'],
  rejected: ['Order cancelled', 'Sorry, we could not complete your order. Any payment will be refunded'],
};

// tells the customer's phone when the admin changes the order status
async function notifyStatus(userId: string, orderId: string, status: string) {
  try {
    const t = STATUS_TEXT[status];
    if (!t) return;
    await notifyUser(userId, { title: t[0], body: `${t[1]} · ${orderId}`, data: { orderId, type: 'order_status' } });
  } catch {}
}

// GET: Fetch all orders
export async function GET() {
  // app orders (always available) + old orders.php (when it works)
  const data: Record<string, any> = {};
  try {
    const ordersArray = await fetchApi('/orders.php');
    if (Array.isArray(ordersArray)) {
      ordersArray.forEach((order: any) => {
        const id = order.order_id || order.orderId || order.id;
        if (id) data[id] = order;
      });
    }
  } catch (error: any) {
    console.error('orders.php unavailable:', error?.message);
  }
  try {
    const app = await readAppOrders();
    for (const o of app) {
      if (o.status === 'Payment pending' || o.status === 'Payment failed') continue; // not real orders yet
      data[o.order_id] = { ...(data[o.order_id] || {}), ...o };
    }
  } catch (error: any) {
    console.error('app orders unavailable:', error?.message);
  }
  return NextResponse.json({ success: true, data }, { status: 200 });
}

// POST: Create or update an order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, ...orderData } = body;

    // We can handle both create and update via the orders.php POST endpoint
    // BigRock orders.php expects standard fields
    if (documentId) {
       // orders placed from the app are updated in the app orders list
       const before = (await readAppOrders()).find((o) => o.order_id === String(documentId));
       // cancelling an app order also refunds online payments and cancels the courier
       if (before && orderData.status === 'rejected' && !/rejected|cancel/i.test(String(before.status))) {
         const r = await cancelAppOrder(String(documentId), { by: 'admin', reason: String(orderData.rejectionReason || 'Cancelled by Adhvaitha') });
         return NextResponse.json({ success: r.ok, error: r.error, message: 'Order cancelled' }, { status: r.ok ? 200 : 409 });
       }
       if (before && orderData.status === 'delivered' && !before.delivered_at) orderData.delivered_at = new Date().toISOString();
       const updatedApp = await updateAppOrder(String(documentId), orderData);
       if (updatedApp) {
         if (orderData.status && orderData.status !== before?.status) await notifyStatus(updatedApp.user_id, updatedApp.order_id, String(orderData.status));
         try { await postApi('/orders.php', { ...updatedApp, ...orderData, order_id: documentId }); } catch {}
         return NextResponse.json({ success: true, message: 'Order updated successfully' }, { status: 200 });
       }
       // Updating existing order
       // The PHP script handles update natively via INSERT ... ON DUPLICATE KEY UPDATE, 
       // but we need to ensure action parameter is passed if required, or simply passing the order_id updates it.
       const updatePayload = {
         ...orderData,
         order_id: documentId,
         user_id: orderData.userId || orderData.user_id,
         total_amount: orderData.total || orderData.total_amount,
         shipping_address: orderData.shippingAddress || orderData.shipping_address
       };
       await postApi('/orders.php', updatePayload);
       return NextResponse.json({ success: true, message: 'Order updated successfully' }, { status: 200 });
    } else {
       // Creating new order
       const orderPayload = {
         ...orderData,
         order_id: orderData.orderId || `AMBJ${new Date().getFullYear()}${Math.floor(100 + Math.random() * 900)}`,
         user_id: orderData.userId,
         total_amount: orderData.total,
         shipping_address: orderData.shippingAddress
       };
       await postApi('/orders.php', orderPayload);
       return NextResponse.json({ success: true, id: orderPayload.order_id, message: 'Order created successfully' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
