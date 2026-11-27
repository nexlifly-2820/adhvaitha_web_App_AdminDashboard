import { fetchApi, postApi } from '@/lib/api-client';

// Orders placed from the app are kept in app settings doc "app_orders" (always available),
// and are also sent to the old orders.php when it works.

export interface AppOrderItem { name: string; qty: number; price: number; weight?: string; image?: string; combo?: { size: string; jars: string[] } }
export interface AppOrder {
  order_id: string;
  orderId: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  email: string;
  shipping_address: string;
  items: AppOrderItem[];
  subtotal: number;
  delivery_fee: number;
  discount: number;
  total_amount: number;
  total: number;
  payment_method: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'cod';
  status: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  failure_reason?: string;
  created_at: string;
  updated_at?: string;
  source: 'app' | 'web';
  [k: string]: any;
}

const unwrap = (raw: any) => {
  const d = raw?.content ?? raw?.data ?? raw;
  if (typeof d === 'string') { try { return JSON.parse(d); } catch { return {}; } }
  return d && typeof d === 'object' ? d : {};
};

export async function readAppOrders(): Promise<AppOrder[]> {
  try {
    const d = unwrap(await fetchApi('/app_settings.php?doc_id=app_orders'));
    return Array.isArray(d?.orders) ? d.orders : [];
  } catch {
    return [];
  }
}

async function writeAppOrders(orders: AppOrder[]) {
  await postApi('/app_settings.php?doc_id=app_orders', { version: 1, orders: orders.slice(0, 3000) });
}

export async function upsertAppOrder(o: AppOrder) {
  const list = await readAppOrders();
  const i = list.findIndex((x) => x.order_id === o.order_id);
  if (i >= 0) list[i] = { ...list[i], ...o, updated_at: new Date().toISOString() };
  else list.unshift(o);
  await writeAppOrders(list);
}

export async function updateAppOrder(id: string, patch: Partial<AppOrder>): Promise<AppOrder | null> {
  const list = await readAppOrders();
  const i = list.findIndex((x) => x.order_id === id);
  if (i < 0) return null;
  list[i] = { ...list[i], ...patch, updated_at: new Date().toISOString() };
  await writeAppOrders(list);
  return list[i];
}

/** Copy to the old orders.php too (ignored if it fails). */
export async function mirrorToOrdersPhp(o: AppOrder) {
  try { await postApi('/orders.php', { ...o, userId: o.user_id, shippingAddress: o.shipping_address, paymentMethod: o.payment_method }); } catch {}
}

const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0);
const str = (v: any, max = 500) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, max);

/** Builds an order from what the app sends at checkout. */
export function orderFromCheckout(b: any, method: string, extra: Partial<AppOrder> = {}): AppOrder {
  const a = b?.address || {};
  const id = str(b?.orderId, 40) || `AMBJ${Date.now().toString().slice(-9)}`;
  const items: AppOrderItem[] = (Array.isArray(b?.items) ? b.items : []).slice(0, 60).map((it: any) => ({
    name: str(it?.name, 120) || 'Product', qty: Math.max(1, Math.round(num(it?.qty ?? it?.quantity) || 1)), price: num(it?.price), weight: str(it?.weight, 20), image: str(it?.image, 300),
  }));
  const addressLine = [a.name, a.phone, a.house, a.road, a.city, a.state, a.pincode].map((x: any) => str(x, 120)).filter(Boolean).join(', ')
  const total = Math.round(num(b?.total ?? b?.amount) * 100) / 100;
  return {
    order_id: id,
    orderId: id,
    user_id: str(b?.userId, 120),
    customer_name: str(a.name || b?.customerName, 80) || 'Customer',
    customer_phone: str(a.phone || b?.phone, 20),
    email: str(b?.email, 120),
    shipping_address: addressLine || str(b?.addressText, 500),
    items,
    subtotal: num(b?.subtotal),
    delivery_fee: num(b?.deliveryFee),
    discount: num(b?.discount),
    total_amount: total,
    total,
    payment_method: method,
    paymentStatus: method === 'COD' ? 'cod' : 'pending',
    status: method === 'COD' ? 'Placed' : 'Payment pending',
    created_at: new Date().toISOString(),
    source: b?.source === 'web' ? 'web' : 'app',
    ...extra,
  };
}
