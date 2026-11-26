// Cancel + refund for app orders (used by the app and the admin).
import { AppOrder, readAppOrders, updateAppOrder } from '@/lib/appOrders';
import { razorpayReady, refundPayment } from '@/lib/razorpay';
import { cancelShiprocketOrder } from '@/lib/shiprocket';
import { notifyUser } from '@/lib/fcm';
import { postApi } from '@/lib/api-client';

const s = (v: any) => String(v ?? '').trim().toLowerCase();
export const isCancelled = (o: AppOrder) => /rejected|cancel/.test(s(o.status));
/** Customer can cancel only before the parcel leaves. */
export const customerCanCancel = (o: AppOrder) =>
  !isCancelled(o) && ['pending', 'placed', 'accepted', 'packing', 'processing'].includes(s(o.status)) && !o.picked_up;

const paise = (rupees: number) => Math.round(rupees * 100);
const orderTotal = (o: AppOrder) => Number(o.total) || Number(o.total_amount) || 0;
export const refundedSoFar = (o: AppOrder) => Number(o.refund_amount) || 0;

async function push(o: AppOrder, title: string, body: string, type = 'order_status') {
  try { await notifyUser(o.user_id, { title, body: `${body} · ${o.order_id}`, data: { orderId: o.order_id, type } }); } catch {}
}

/** Sends money back through Razorpay. Returns the patch to save. */
async function doRefund(o: AppOrder, rupees: number, reason: string): Promise<Partial<AppOrder>> {
  const left = Math.round((orderTotal(o) - refundedSoFar(o)) * 100) / 100;
  const amt = Math.min(Math.max(0, rupees), left);
  if (amt <= 0) throw new Error('Nothing left to refund on this order');
  if (!o.razorpay_payment_id) throw new Error('No online payment found on this order');
  if (!razorpayReady()) throw new Error('Razorpay keys are missing in Vercel');
  const history = Array.isArray(o.refunds) ? o.refunds : [];
  try {
    const r = await refundPayment(o.razorpay_payment_id, paise(amt), { order_id: o.order_id, reason: reason.slice(0, 200) });
    return {
      refund_status: r.status === 'processed' ? 'processed' : 'initiated',
      refund_id: r.id,
      refund_amount: Math.round((refundedSoFar(o) + amt) * 100) / 100,
      refund_error: '',
      refunded_at: new Date().toISOString(),
      refunds: [...history, { id: r.id, amount: amt, reason, at: new Date().toISOString() }],
    };
  } catch (e: any) {
    return { refund_status: 'failed', refund_error: String(e?.message || 'Refund failed').slice(0, 200) };
  }
}

export interface CancelOpts { by: 'customer' | 'admin'; reason: string; refundAmount?: number }

export async function cancelAppOrder(id: string, opts: CancelOpts): Promise<{ ok: boolean; error?: string; order?: AppOrder }> {
  const o = (await readAppOrders()).find((x) => x.order_id === id);
  if (!o) return { ok: false, error: 'Order not found' };
  if (isCancelled(o)) return { ok: false, error: 'This order is already cancelled' };
  if (opts.by === 'customer' && !customerCanCancel(o)) return { ok: false, error: 'This order has already been shipped, so it cannot be cancelled now' };

  const patch: Partial<AppOrder> = {
    status: 'rejected',
    rejectionReason: opts.reason || (opts.by === 'customer' ? 'Cancelled by customer' : 'Cancelled by Adhvaitha'),
    cancelled_by: opts.by,
    cancelled_at: new Date().toISOString(),
  };
  if (o.shiprocketOrderId) {
    try { await cancelShiprocketOrder(String(o.shiprocketOrderId)); patch.shiprocket_cancelled = true; } catch (e: any) { patch.shiprocket_cancel_error = String(e?.message || '').slice(0, 200); }
  }
  if (o.paymentStatus === 'paid') {
    const want = opts.refundAmount && opts.refundAmount > 0 ? opts.refundAmount : orderTotal(o) - refundedSoFar(o);
    Object.assign(patch, await doRefund(o, want, patch.rejectionReason as string));
  } else {
    patch.refund_status = 'none';
  }
  const saved = await updateAppOrder(id, patch);
  try { await postApi('/orders.php', { ...saved, order_id: id }); } catch {}
  if (saved) {
    const paid = o.paymentStatus === 'paid';
    const msg = !paid ? (opts.by === 'customer' ? 'Your order has been cancelled' : 'Sorry, we could not complete your order')
      : saved.refund_status === 'failed' ? 'Order cancelled. Your refund is being processed by our team'
      : `Order cancelled. Refund of ₹${saved.refund_amount} started — it reaches your account in 5–7 working days`;
    await push(saved, 'Order cancelled', msg);
  }
  return { ok: true, order: saved || undefined };
}

/** Admin: refund part (or the rest) without changing the status, or retry a failed refund. */
export async function refundAppOrder(id: string, rupees: number, reason: string): Promise<{ ok: boolean; error?: string; order?: AppOrder }> {
  const o = (await readAppOrders()).find((x) => x.order_id === id);
  if (!o) return { ok: false, error: 'Order not found' };
  if (o.paymentStatus !== 'paid') return { ok: false, error: 'Only online-paid orders can be refunded here' };
  const amt = rupees > 0 ? rupees : orderTotal(o) - refundedSoFar(o);
  let patch: Partial<AppOrder>;
  try { patch = await doRefund(o, amt, reason || 'Refund'); } catch (e: any) { return { ok: false, error: e.message }; }
  if (patch.refund_status === 'failed') {
    await updateAppOrder(id, patch);
    return { ok: false, error: String(patch.refund_error) };
  }
  const saved = await updateAppOrder(id, patch);
  if (saved) await push(saved, 'Refund started 💸', `₹${amt.toFixed(0)} is on the way to your account (5–7 working days)`);
  return { ok: true, order: saved || undefined };
}
