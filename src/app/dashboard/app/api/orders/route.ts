export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { fetchApi, postApi } from '@/lib/api-client';
import { createShiprocketOrder } from '@/lib/shiprocket'; // Assuming this still works with standard JSON

// GET: Fetch all orders
export async function GET() {
  try {
    const ordersArray = await fetchApi('/orders.php');
    
    // The frontend expects data as a record { documentId: { ...orderData } }
    const data: Record<string, any> = {};
    if (Array.isArray(ordersArray)) {
      ordersArray.forEach((order: any) => {
        data[order.order_id] = order;
      });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create or update an order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { documentId, ...orderData } = body;

    // We can handle both create and update via the orders.php POST endpoint
    // BigRock orders.php expects standard fields
    if (documentId) {
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
         order_id: orderData.orderId || `ADH-${Date.now()}`,
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
