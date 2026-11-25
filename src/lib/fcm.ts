import crypto from 'crypto';
import { fetchApi, postApi } from '@/lib/api-client';

// Sends push notifications with Firebase Cloud Messaging (HTTP v1) straight from this server.
// Needs ONE environment variable in Vercel:
//   FIREBASE_SERVICE_ACCOUNT = the whole JSON file from Firebase → Project settings → Service accounts → Generate new private key

type SA = { project_id: string; client_email: string; private_key: string };

function serviceAccount(): SA | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT || '';
  if (!raw) return null;
  try {
    const j = JSON.parse(raw.trim().startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8'));
    if (!j.project_id || !j.client_email || !j.private_key) return null;
    return { project_id: j.project_id, client_email: j.client_email, private_key: String(j.private_key).replace(/\\n/g, '\n') };
  } catch {
    return null;
  }
}

export const pushReady = () => serviceAccount() !== null;

let cached: { token: string; exp: number } | null = null;

async function accessToken(sa: SA): Promise<string> {
  if (cached && cached.exp > Date.now() + 60_000) return cached.token;
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o: any) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })}`;
  const sig = crypto.createSign('RSA-SHA256').update(unsigned).sign(sa.private_key).toString('base64url');
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: `${unsigned}.${sig}` }),
    cache: 'no-store',
  });
  const j = await res.json().catch(() => ({}));
  if (!res.ok || !j.access_token) throw new Error(j.error_description || 'Firebase login failed — check FIREBASE_SERVICE_ACCOUNT');
  cached = { token: j.access_token, exp: Date.now() + (Number(j.expires_in) || 3600) * 1000 };
  return cached.token;
}

export interface PushMessage { title: string; body: string; image?: string; data?: Record<string, string> }

function payload(m: PushMessage, target: { topic?: string; token?: string }) {
  const data: Record<string, string> = { ...(m.data || {}), title: m.title, body: m.body, ...(m.image ? { image: m.image } : {}) };
  return {
    message: {
      ...target,
      notification: { title: m.title, body: m.body, ...(m.image ? { image: m.image } : {}) },
      data,
      android: { priority: 'HIGH', notification: { channel_id: 'high_importance_channel', sound: 'default', ...(m.image ? { image: m.image } : {}) } },
      apns: { payload: { aps: { sound: 'default', 'mutable-content': 1 } }, ...(m.image ? { fcm_options: { image: m.image } } : {}) },
    },
  };
}

async function send(body: any): Promise<{ ok: boolean; error?: string; unregistered?: boolean }> {
  const sa = serviceAccount();
  if (!sa) return { ok: false, error: 'Push is not set up: add FIREBASE_SERVICE_ACCOUNT in Vercel and redeploy' };
  const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await accessToken(sa)}` },
    body: JSON.stringify(body),
    cache: 'no-store',
  });
  if (res.ok) return { ok: true };
  const j = await res.json().catch(() => ({}));
  const msg = j?.error?.message || `FCM error ${res.status}`;
  return { ok: false, error: msg, unregistered: res.status === 404 || /UNREGISTERED|not a valid FCM/i.test(msg) };
}

export const sendToTopic = (topic: string, m: PushMessage) => send(payload(m, { topic }));
export const sendToToken = (token: string, m: PushMessage) => send(payload(m, { token }));

// ───────── device tokens (doc "push_tokens": { tokens: { userId: [token, …] } }) ─────────
const unwrap = (raw: any) => raw?.content ?? raw?.data ?? raw ?? {};

export async function readTokens(): Promise<Record<string, string[]>> {
  try {
    const d = unwrap(await fetchApi('/app_settings.php?doc_id=push_tokens'));
    return d && typeof d.tokens === 'object' && d.tokens ? d.tokens : {};
  } catch {
    return {};
  }
}

export async function writeTokens(tokens: Record<string, string[]>) {
  await postApi('/app_settings.php?doc_id=push_tokens', { version: 1, tokens, updatedAt: new Date().toISOString() });
}

/** Sends to every phone of one customer (used for automatic order notifications). Never throws. */
export async function notifyUser(userId: string, m: PushMessage) {
  try {
    if (!userId || !pushReady()) return;
    const tokens = (await readTokens())[userId] || [];
    for (const t of tokens) await sendToToken(t, m);
  } catch {}
}
