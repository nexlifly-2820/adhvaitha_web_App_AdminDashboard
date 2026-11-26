// Shiprocket courier connection.
// Vercel → Settings → Environment Variables:
//   SHIPROCKET_EMAIL     API user email (Shiprocket → Settings → API → Configure → create API user)
//   SHIPROCKET_PASSWORD  that API user's password
//   SHIPROCKET_PICKUP    pickup location name exactly as in Shiprocket (default "Primary")
//   SHIPROCKET_WEBHOOK_TOKEN  any secret word; same value in Shiprocket → Settings → Webhooks → token
import type { AppOrder } from '@/lib/appOrders';

export const SHIPROCKET_API_URL = 'https://apiv2.shiprocket.in/v1/external';

const email = () => process.env.SHIPROCKET_EMAIL || process.env.SHIPROCKET_API_EMAIL || '';
const password = () => process.env.SHIPROCKET_PASSWORD || process.env.SHIPROCKET_API_PASSWORD || '';
export const shiprocketReady = () => Boolean(email() && password());

let cached: { token: string; at: number } | null = null;

export async function getShiprocketToken(): Promise<string> {
  if (!shiprocketReady()) throw new Error('Shiprocket is not connected yet. Add SHIPROCKET_EMAIL and SHIPROCKET_PASSWORD in Vercel.');
  if (cached && Date.now() - cached.at < 8 * 24 * 3600 * 1000) return cached.token; // tokens last 10 days
  const res = await fetch(`${SHIPROCKET_API_URL}/auth/login`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email(), password: password() }), cache: 'no-store',
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j?.token) throw new Error(j?.message || 'Shiprocket login failed. Check the email and password in Vercel.');
  cached = { token: j.token, at: Date.now() };
  return j.token;
}

async function sr(path: string, body?: any, method = 'POST') {
  const token = await getShiprocketToken();
  const res = await fetch(`${SHIPROCKET_API_URL}${path}`, {
    method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body === undefined ? undefined : JSON.stringify(body), cache: 'no-store',
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errs = j?.errors ? Object.values(j.errors).flat().join(', ') : '';
    throw new Error(errs || j?.message || `Shiprocket error ${res.status}`);
  }
  return j;
}

/** Kept for older code. */
export const createShiprocketOrder = (orderData: any) => sr('/orders/create/adhoc', orderData);

/** Splits "name, phone, house, road, city, state, pincode". */
function parseAddress(o: AppOrder) {
  const parts = String(o.shipping_address || '').split(',').map((s) => s.trim()).filter(Boolean);
  const pin = (String(o.shipping_address).match(/\b\d{6}\b/g) || []).pop() || '';
  const rest = parts.filter((p) => p !== pin && p !== o.customer_name && p.replace(/\D/g, '') !== String(o.customer_phone).replace(/\D/g, ''));
  const state = rest.length >= 2 ? rest[rest.length - 1] : '';
  const city = rest.length >= 2 ? rest[rest.length - 2] : rest[0] || '';
  const line = rest.slice(0, Math.max(1, rest.length - 2)).join(', ') || o.shipping_address;
  return { line, city, state, pin };
}

export interface ShipResult {
  shiprocketOrderId: string; shipment_id: string; awb_code: string; courier_name: string;
  label_url: string; tracking_url: string; pickup_requested: boolean; warnings: string[];
}

/** Creates the Shiprocket order, gets a courier + AWB, asks for pickup and makes the label. */
export async function shipAppOrder(o: AppOrder): Promise<ShipResult> {
  const warnings: string[] = [];
  let srOrderId = String(o.shiprocketOrderId || '');
  let shipmentId = String(o.shipment_id || '');
  if (!shipmentId) {
    const a = parseAddress(o);
    const units = (o.items || []).reduce((n, it) => n + (Number(it.qty) || 1), 0) || 1;
    const created = await sr('/orders/create/adhoc', {
      order_id: o.order_id,
      order_date: new Date(o.created_at || Date.now()).toISOString().slice(0, 16).replace('T', ' '),
      pickup_location: process.env.SHIPROCKET_PICKUP || 'Primary',
      billing_customer_name: o.customer_name || 'Customer',
      billing_last_name: '',
      billing_address: a.line,
      billing_city: a.city,
      billing_pincode: a.pin,
      billing_state: a.state,
      billing_country: 'India',
      billing_email: o.email || 'info@adhvaithafoods.in',
      billing_phone: String(o.customer_phone || '').replace(/\D/g, '').slice(-10),
      shipping_is_billing: true,
      order_items: (o.items || []).map((it, i) => ({
        name: `${it.name}${it.weight ? ' ' + it.weight : ''}`.slice(0, 100), sku: `AJ-${i + 1}-${String(it.name).replace(/\W+/g, '').slice(0, 12)}`,
        units: Number(it.qty) || 1, selling_price: Number(it.price) || 0, hsn: 2001,
      })),
      payment_method: o.paymentStatus === 'cod' ? 'COD' : 'Prepaid',
      shipping_charges: Number(o.delivery_fee) || 0,
      total_discount: Number(o.discount) || 0,
      sub_total: Number(o.total) || Number(o.total_amount) || 0,
      length: 20, breadth: 15, height: 12,
      weight: Math.max(0.5, Math.round(units * 0.55 * 10) / 10),
    });
    srOrderId = String(created?.order_id || '');
    shipmentId = String(created?.shipment_id || '');
    if (!shipmentId) throw new Error(created?.message || 'Shiprocket did not create the shipment');
  }
  let awb = String(o.awb_code || ''), courier = String(o.courier_name || '');
  if (!awb) {
    const r = await sr('/courier/assign/awb', { shipment_id: shipmentId });
    const d = r?.response?.data || {};
    awb = String(d.awb_code || '');
    courier = String(d.courier_name || '');
    if (!awb) throw new Error(r?.message || 'No courier available for this pincode right now');
  }
  let pickup = Boolean(o.pickup_requested);
  if (!pickup) {
    try { await sr('/courier/generate/pickup', { shipment_id: [shipmentId] }); pickup = true; }
    catch (e: any) { if (/already/i.test(e.message)) pickup = true; else warnings.push('Pickup: ' + e.message); }
  }
  let label = String(o.label_url || '');
  if (!label) {
    try { const l = await sr('/courier/generate/label', { shipment_id: [shipmentId] }); label = String(l?.label_url || ''); }
    catch (e: any) { warnings.push('Label: ' + e.message); }
  }
  return {
    shiprocketOrderId: srOrderId, shipment_id: shipmentId, awb_code: awb, courier_name: courier,
    label_url: label, tracking_url: `https://shiprocket.co/tracking/${awb}`, pickup_requested: pickup, warnings,
  };
}

export async function shiprocketLabel(shipmentId: string): Promise<string> {
  const l = await sr('/courier/generate/label', { shipment_id: [shipmentId] });
  return String(l?.label_url || '');
}

export async function cancelShiprocketOrder(srOrderId: string) {
  if (!srOrderId || !shiprocketReady()) return;
  await sr('/orders/cancel', { ids: [Number(srOrderId) || srOrderId] });
}

/** Shiprocket status text → our order status (or '' to keep). */
export function mapCourierStatus(s: string): string {
  const t = String(s || '').toUpperCase();
  if (/RTO|CANCEL|LOST|DAMAGED/.test(t)) return '';
  if (/^DELIVERED/.test(t)) return 'delivered';
  if (/OUT FOR DELIVERY/.test(t)) return 'out_for_delivery';
  if (/PICKED|IN TRANSIT|SHIPPED|REACHED|DESTINATION|HUB|DISPATCH/.test(t)) return 'shipped';
  return '';
}
