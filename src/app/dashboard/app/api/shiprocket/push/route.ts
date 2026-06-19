import { NextResponse } from 'next/server';
import { doc, updateDoc } from 'firebase/firestore';
import { appOrdersCollection } from '@/lib/firebase-app';
import { createShiprocketOrder } from '@/lib/shiprocket';
import { OrderDetails } from '@/types/order';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const order: OrderDetails = body.order;

    if (!order || !order.id) {
      return NextResponse.json(
        { success: false, error: 'Valid order data is required' },
        { status: 400 }
      );
    }

    // Map OrderDetails to Shiprocket Payload
    const shiprocketPayload = {
      order_id: order.id,
      order_date: new Date(order.orderDate).toISOString().slice(0, 10), // YYYY-MM-DD
      pickup_location: "Primary", // Note: Ensure this matches the exact pickup location name in Shiprocket dashboard
      billing_customer_name: order.customerInfo.name || "Customer",
      billing_last_name: "", // Shiprocket might require this, but empty string usually works if first name is full name
      billing_address: order.shippingInfo.address || "N/A",
      billing_city: order.shippingInfo.city || "Unknown",
      billing_pincode: order.shippingInfo.zipCode || "000000",
      billing_state: order.shippingInfo.state || "Unknown",
      billing_country: order.shippingInfo.country || "India",
      billing_email: order.customerInfo.email || "customer@example.com",
      billing_phone: order.customerInfo.mobileNumber || "0000000000",
      shipping_is_billing: true,
      order_items: order.products.map((item) => ({
        name: item.name || "Product",
        sku: item.sku || "N/A",
        units: item.quantity || 1,
        selling_price: item.unitPrice || item.totalPrice || 0,
        hsn: 2001, // Default HSN code for pickles as requested
      })),
      payment_method: order.paymentMethod === "COD" ? "COD" : "Prepaid",
      sub_total: order.totalAmount,
      length: 10, // Provide actual package dimensions (cm) in the future
      breadth: 10,
      height: 10,
      weight: 0.5, // Provide actual package weight (kg) in the future
    };

    console.log(`Pushing order ${order.id} to Shiprocket...`);
    const shiprocketResponse = await createShiprocketOrder(shiprocketPayload);
    
    // Check if Shiprocket returned a valid order ID
    if (shiprocketResponse && shiprocketResponse.order_id) {
      // Update Firebase to mark it as pushed
      const docRef = doc(appOrdersCollection, order.id);
      await updateDoc(docRef, {
        shiprocketOrderId: shiprocketResponse.order_id.toString(),
        updatedAt: new Date().toISOString()
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Order successfully pushed to Shiprocket',
        shiprocketOrderId: shiprocketResponse.order_id
      }, { status: 200 });
    } else {
      throw new Error("Shiprocket response did not contain an order_id");
    }

  } catch (error: any) {
    console.error('Error pushing to Shiprocket:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to push to Shiprocket' 
    }, { status: 500 });
  }
}
