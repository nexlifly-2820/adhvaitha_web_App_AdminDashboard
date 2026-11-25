import { NextResponse } from 'next/server';
import { updateAppOrder } from '@/lib/appOrders';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}));
    if (b?.orderId) await updateAppOrder(String(b.orderId), { paymentStatus: 'failed', status: 'Payment failed', failure_reason: String(b?.reason || '').slice(0, 200) });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
