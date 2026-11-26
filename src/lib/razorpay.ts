import crypto from 'crypto';

// Keys come from environment variables (set them in Vercel → Project → Settings → Environment Variables):
//   RAZORPAY_KEY_ID      e.g. rzp_test_xxxxx
//   RAZORPAY_KEY_SECRET  the secret (never put it in the app)
export const RZP_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RZP_SECRET = process.env.RAZORPAY_KEY_SECRET || '';

export const razorpayReady = () => Boolean(RZP_KEY_ID && RZP_SECRET);

export async function createRazorpayOrder(amountPaise: number, receipt: string, notes: Record<string, string>) {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${RZP_KEY_ID}:${RZP_SECRET}`).toString('base64') },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR', receipt: receipt.slice(0, 40), notes }),
    cache: 'no-store',
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j?.id) throw new Error(j?.error?.description || 'Could not start the payment');
  return j as { id: string; amount: number; currency: string };
}

export function verifySignature(orderId: string, paymentId: string, signature: string) {
  const expected = crypto.createHmac('sha256', RZP_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  try { return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(String(signature))); } catch { return false; }
}

export async function fetchPayment(paymentId: string) {
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}`, {
    headers: { Authorization: 'Basic ' + Buffer.from(`${RZP_KEY_ID}:${RZP_SECRET}`).toString('base64') }, cache: 'no-store',
  });
  return res.ok ? res.json() : null;
}

/** Refunds a captured payment. amountPaise empty = full refund. */
export async function refundPayment(paymentId: string, amountPaise?: number, notes: Record<string, string> = {}) {
  const body: any = { notes, speed: 'normal' };
  if (amountPaise && amountPaise > 0) body.amount = Math.round(amountPaise);
  const res = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${RZP_KEY_ID}:${RZP_SECRET}`).toString('base64') },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j?.id) throw new Error(j?.error?.description || 'Refund failed');
  return j as { id: string; amount: number; status: string };
}
