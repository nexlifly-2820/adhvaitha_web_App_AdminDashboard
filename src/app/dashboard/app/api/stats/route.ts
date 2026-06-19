import { NextResponse } from 'next/server';
import { getDocs, collection } from 'firebase/firestore';
import { appOrdersCollection, db } from '@/lib/firebase-app';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const ordersSnapshot = await getDocs(appOrdersCollection);
    
    let totalRevenue = 0;
    let activeOrders = 0;
    const allOrders: any[] = [];
    const userIds = new Set<string>();
    
    // For revenue over time (last 7 months including current)
    const monthlyRevenue: Record<string, number> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const now = new Date();
    // Initialize last 7 months
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(-2)}`;
      monthlyRevenue[label] = 0;
    }

    // For top products
    const productSales: Record<string, number> = {};

    ordersSnapshot.forEach((doc) => {
      const order = { id: doc.id, ...doc.data() };
      allOrders.push(order);
      
      const total = Number(order.total) || 0;
      totalRevenue += total;
      
      if (order.userId) userIds.add(order.userId);
      
      // Active orders
      const status = (order.status || '').toLowerCase();
      if (!['delivered', 'cancelled', 'rejected'].includes(status)) {
        activeOrders++;
      }
      
      // Monthly revenue
      let orderDate = order.createdAt ? new Date(order.createdAt) : new Date();
      // Handle timestamp object
      if (order.createdAt?.seconds) {
        orderDate = new Date(order.createdAt.seconds * 1000);
      }
      
      const monthLabel = `${monthNames[orderDate.getMonth()]} ${orderDate.getFullYear().toString().slice(-2)}`;
      if (monthlyRevenue[monthLabel] !== undefined) {
        monthlyRevenue[monthLabel] += total;
      }
      
      // Product sales
      const items = order.items || order.products || [];
      items.forEach((item: any) => {
        const name = item.name || 'Unknown Product';
        const qty = Number(item.quantity || item.qty) || 1;
        if (!productSales[name]) productSales[name] = 0;
        productSales[name] += qty;
      });
    });

    let totalUserCount = userIds.size;

    // Format sales data
    const salesData = Object.entries(monthlyRevenue).map(([name, total]) => ({
      name,
      total: Math.round(total)
    }));

    // Format top products (top 5)
    const productData = Object.entries(productSales)
      .map(([name, sales]) => ({ name, sales }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Format recent orders (top 5 by date)
    const recentOrders = allOrders
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds ? a.createdAt.seconds * 1000 : new Date(a.createdAt || 0).getTime();
        const dateB = b.createdAt?.seconds ? b.createdAt.seconds * 1000 : new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map(o => ({
        id: o.orderId || o.id,
        customer: o.customerName || o.customerInfo?.name || `User ${o.userId?.substring(0,5) || ''}`,
        total: o.total || 0,
        status: o.status || 'Pending',
        time: o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleString() : new Date(o.createdAt || new Date()).toLocaleString(),
      }));

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        totalOrderCount: allOrders.length,
        totalUserCount,
        activeOrders,
        salesData,
        productData,
        recentOrders
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
