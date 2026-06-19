import { NextResponse } from 'next/server';
import { getDocs, doc, updateDoc, setDoc } from 'firebase/firestore';
import { appOrdersCollection, db } from '@/lib/firebase-app';

import { createShiprocketOrder } from '@/lib/shiprocket';

// GET: Fetch all orders
export async function GET() {
  try {
    const querySnapshot = await getDocs(appOrdersCollection);
    const data: Record<string, any> = {};
    
    querySnapshot.forEach((doc) => {
      data[doc.id] = { id: doc.id, ...doc.data() };
    });

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

    if (!orderData.userId || !orderData.items || !orderData.total) {
      return NextResponse.json(
        { success: false, error: 'Order must contain userId, items, and total' },
        { status: 400 }
      );
    }

    if (documentId) {
      // Update existing order (e.g., updating tracking info)
      const docRef = doc(appOrdersCollection, documentId);
      await updateDoc(docRef, {
        ...orderData,
        updatedAt: new Date().toISOString()
      });
      return NextResponse.json({ success: true, message: 'Order updated successfully' }, { status: 200 });
    } else {
      // Create new order (document ID is orderId, e.g. ADH-1234)
      const orderId = orderData.orderId || `ADH-${Date.now()}`;
      const orderRef = doc(appOrdersCollection, orderId);
      
      const newData = {
        orderId: orderId,
        userId: orderData.userId,
        status: orderData.status || 'Placed',
        total: orderData.total,
        shippingAddress: orderData.shippingAddress || '',
        trackingId: orderData.trackingId || '',
        courierName: orderData.courierName || '',
        items: orderData.items || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(orderRef, newData);
      return NextResponse.json({ success: true, id: orderId, message: 'Order created successfully' }, { status: 201 });
    }
  } catch (error: any) {
    console.error('Error saving order:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
