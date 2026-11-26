import { NextResponse } from 'next/server';
import { readCustomer, privateDocId } from '@/lib/customerAuth';
import { readAppOrders, updateAppOrder } from '@/lib/appOrders';
import { postApi } from '@/lib/api-client';
import { notifyUser } from '@/lib/fcm';

export const dynamic = 'force-dynamic';
const WINDOW_H = 48;

// App → POST /api/orders/{id}/report-issue  { text, photo: "data:image/jpeg;base64,..." }
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const cust = await readCustomer(request);
  if (!cust) return NextResponse.json({ success: false, error: 'Please log in again' }, { status: 401 });
  const { id } = await params;
  const o = (await readAppOrders()).find((x) => x.order_id === id);
  if (!o || o.user_id !== cust.uid) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  if (String(o.status).toLowerCase() !== 'delivered') return NextResponse.json({ success: false, error: 'You can report a problem after the order is delivered' }, { status: 409 });
  const since = new Date(o.delivered_at || o.updated_at || o.created_at).getTime();
  if (Date.now() - since > WINDOW_H * 3600 * 1000) return NextResponse.json({ success: false, error: 'Damaged items must be reported within 48 hours of delivery' }, { status: 409 });
  if (o.issue) return NextResponse.json({ success: false, error: 'You have already reported a problem for this order. We will contact you soon.' }, { status: 409 });

  const b = await request.json().catch(() => ({}));
  const text = String(b?.text || '').replace(/[<>]/g, '').trim().slice(0, 800);
  const photo = String(b?.photo || '');
  if (text.length < 5) return NextResponse.json({ success: false, error: 'Please tell us what went wrong' }, { status: 400 });
  if (!/^data:image\/(jpeg|jpg|png|webp);base64,/.test(photo)) return NextResponse.json({ success: false, error: 'Please add a photo of the damaged item' }, { status: 400 });
  if (photo.length > 900_000) return NextResponse.json({ success: false, error: 'Photo is too large. Please pick a smaller one.' }, { status: 413 });

  const photoDoc = await privateDocId('issue', id);
  await postApi(`/app_settings.php?doc_id=${photoDoc}`, { order_id: id, photo });
  const saved = await updateAppOrder(id, { issue: { text, at: new Date().toISOString(), photo_doc: photoDoc, status: 'open' } });
  try { if (saved) await notifyUser(saved.user_id, { title: 'We got your report 🙏', body: `Our team will check and get back to you · ${id}`, data: { orderId: id, type: 'order_status' } }); } catch {}
  return NextResponse.json({ success: true, message: 'Thanks. Our team will check and contact you within 24 hours.' });
}
