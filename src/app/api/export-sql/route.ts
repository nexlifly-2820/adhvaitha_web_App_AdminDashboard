import { NextResponse } from 'next/server';
import { getDocs, collection, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase-app'; // App DB
import { db as webDb } from '@/lib/firebase-web'; // Web DB

export const dynamic = 'force-dynamic';

function escapeSql(str: any): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'boolean') return str ? '1' : '0';
  if (typeof str === 'number') return str.toString();
  
  if (typeof str === 'object') {
    if (str instanceof Timestamp) {
       // Convert Firebase timestamp to MySQL DATETIME
       const d = str.toDate();
       const pad = (n: number) => n.toString().padStart(2, '0');
       return `'${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}'`;
    }
    // Stringify objects and arrays
    str = JSON.stringify(str);
  }

  // Escape single quotes and backslashes
  const escaped = String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
    
  return `'${escaped}'`;
}

export async function GET() {
  try {
    let sqlOutput = "-- Firebase to MySQL Migration Dump\n-- Generated for Adhvaitha Foods BigRock Migration\n\n";
    
    // 1. Users
    sqlOutput += "-- --------------------------------------------------------\n";
    sqlOutput += "-- Table: users\n";
    const usersSnapshot = await getDocs(collection(db, 'users'));
    for (const doc of usersSnapshot.docs) {
      const data = doc.data();
      const uid = escapeSql(doc.id);
      const phone = escapeSql(data.phone || data.phoneNumber || '');
      const name = escapeSql(data.name || data.displayName || '');
      const email = escapeSql(data.email || '');
      
      sqlOutput += `INSERT IGNORE INTO users (uid, phone, name, email) VALUES (${uid}, ${phone}, ${name}, ${email});\n`;
    }
    
    // 2. Orders & Order Items
    sqlOutput += "\n-- --------------------------------------------------------\n";
    sqlOutput += "-- Table: orders & order_items\n";
    const ordersSnapshot = await getDocs(collection(db, 'orders'));
    for (const doc of ordersSnapshot.docs) {
      const data = doc.data();
      const order_id = escapeSql(doc.id);
      const user_id = escapeSql(data.userId || data.customer_id || 'unknown');
      const subtotal = data.subtotal || 0;
      const delivery_fee = data.deliveryFee || data.delivery_fee || 0;
      const packing_fee = data.packingFee || data.packing_fee || 0;
      const gst_amount = data.gstAmount || data.gst || 0;
      const discount_amount = data.discountAmount || data.discount || 0;
      const total = data.total || data.amount || 0;
      
      const addr = data.shippingAddress || data.address || {};
      const shipping_address = escapeSql(addr.fullAddress || addr.address || '');
      const city = escapeSql(addr.city || '');
      const state = escapeSql(addr.state || '');
      const pincode = escapeSql(addr.pincode || addr.zipcode || '');
      
      const payment_method = escapeSql(data.paymentMethod || data.payment_method || 'Online');
      const payment_id = escapeSql(data.paymentId || data.transaction_id || '');
      const status = escapeSql(data.status || 'pending');
      const created_at = data.createdAt || data.created_at || new Date();
      
      sqlOutput += `INSERT IGNORE INTO orders (order_id, user_id, subtotal, delivery_fee, packing_fee, gst_amount, discount_amount, total, shipping_address, city, state, pincode, payment_method, payment_id, status, created_at) VALUES (${order_id}, ${user_id}, ${subtotal}, ${delivery_fee}, ${packing_fee}, ${gst_amount}, ${discount_amount}, ${total}, ${shipping_address}, ${city}, ${state}, ${pincode}, ${payment_method}, ${payment_id}, ${status}, ${escapeSql(created_at)});\n`;
      
      // Order Items
      const items = data.items || data.products || [];
      for (const item of items) {
          const product_name = escapeSql(item.name || item.product_name || 'Unknown Item');
          const quantity = item.quantity || item.qty || 1;
          const weight = escapeSql(item.weight || item.size || '');
          const price = item.price || 0;
          const tempering = escapeSql(item.tempering || '');
          const chef_note = escapeSql(item.chef_note || item.instructions || '');
          
          sqlOutput += `INSERT INTO order_items (order_id, product_name, quantity, weight, price, tempering, chef_note) VALUES (${order_id}, ${product_name}, ${quantity}, ${weight}, ${price}, ${tempering}, ${chef_note});\n`;
      }
    }
    
    // 3. App Products
    sqlOutput += "\n-- --------------------------------------------------------\n";
    sqlOutput += "-- Table: app_products\n";
    const appProductsSnapshot = await getDocs(collection(db, 'products_app'));
    for (const doc of appProductsSnapshot.docs) {
      const data = doc.data();
      const id = escapeSql(doc.id);
      const name = escapeSql(data.name || '');
      const desc = escapeSql(data.description || '');
      const price = data.price || 0;
      const stock = data.stock || data.quantity || 100;
      const img = escapeSql(data.imageUrl || data.image || '');
      const cat = escapeSql(data.category || 'General');
      const active = data.isActive !== false ? 1 : 0;
      
      sqlOutput += `INSERT IGNORE INTO app_products (id, name, description, price, stock, image_url, category, is_active) VALUES (${id}, ${name}, ${desc}, ${price}, ${stock}, ${img}, ${cat}, ${active});\n`;
    }

    // 4. Web Products
    sqlOutput += "\n-- --------------------------------------------------------\n";
    sqlOutput += "-- Table: web_products\n";
    const webProductsSnapshot = await getDocs(collection(webDb, 'products'));
    for (const doc of webProductsSnapshot.docs) {
      const data = doc.data();
      const id = escapeSql(doc.id);
      const name = escapeSql(data.name || '');
      const desc = escapeSql(data.description || '');
      const price = data.price || 0;
      const stock = data.stock || data.quantity || 100;
      const img = escapeSql(data.imageUrl || data.image || '');
      const cat = escapeSql(data.category || 'General');
      const active = data.isActive !== false ? 1 : 0;
      
      sqlOutput += `INSERT IGNORE INTO web_products (id, name, description, price, stock, image_url, category, is_active) VALUES (${id}, ${name}, ${desc}, ${price}, ${stock}, ${img}, ${cat}, ${active});\n`;
    }
    
    // 5. App Data (Banners, Categories, etc)
    sqlOutput += "\n-- --------------------------------------------------------\n";
    sqlOutput += "-- Table: app_settings\n";
    const appDataSnapshot = await getDocs(collection(db, 'app_data'));
    for (const doc of appDataSnapshot.docs) {
      const data = doc.data();
      const id = escapeSql(doc.id);
      const json = escapeSql(JSON.stringify(data));
      sqlOutput += `INSERT IGNORE INTO app_settings (doc_id, json_data) VALUES (${id}, ${json});\n`;
    }
    
    return new NextResponse(sqlOutput, {
      status: 200,
      headers: {
        'Content-Type': 'application/sql',
        'Content-Disposition': 'attachment; filename="firebase_migration.sql"'
      }
    });

  } catch (error: any) {
    console.error('Export Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
