// Signed tokens for admin sessions and logged-in app customers.
// Works in Node routes and in middleware (Web Crypto only).
// Secret: AUTH_SECRET env, or (if not set) derived from FIREBASE_SERVICE_ACCOUNT which is already on Vercel.

const enc = new TextEncoder()

function b64url(bytes: Uint8Array): string {
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}
function fromB64url(s: string): Uint8Array {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4))
  const out = new Uint8Array(b.length)
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i)
  return out
}

let keyPromise: Promise<CryptoKey> | null = null
export function hasAuthSecret() {
  return !!(process.env.AUTH_SECRET || process.env.FIREBASE_SERVICE_ACCOUNT)
}
async function key(): Promise<CryptoKey> {
  if (!keyPromise) {
    keyPromise = (async () => {
      let raw = process.env.AUTH_SECRET || ''
      if (!raw) {
        const base = process.env.FIREBASE_SERVICE_ACCOUNT || ''
        if (!base) throw new Error('AUTH_SECRET is not set')
        const h = await crypto.subtle.digest('SHA-256', enc.encode('aj-auth-v1:' + base))
        raw = b64url(new Uint8Array(h))
      }
      return crypto.subtle.importKey('raw', enc.encode(raw), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])
    })()
  }
  return keyPromise
}

export async function hmac(text: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', await key(), enc.encode(text))
  return b64url(new Uint8Array(sig))
}

export async function signToken(payload: Record<string, any>, days: number): Promise<string> {
  const body = b64url(enc.encode(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + days * 86400 })))
  return `${body}.${await hmac(body)}`
}

export async function verifyToken<T = Record<string, any>>(token: string | undefined | null, kind: string): Promise<T | null> {
  try {
    if (!token) return null
    const [body, sig] = token.split('.')
    if (!body || !sig) return null
    const ok = await crypto.subtle.verify('HMAC', await key(), fromB64url(sig) as unknown as BufferSource, enc.encode(body))
    if (!ok) return null
    const p = JSON.parse(new TextDecoder().decode(fromB64url(body)))
    if (p?.k !== kind || !(p.exp > Date.now() / 1000)) return null
    return p as T
  } catch {
    return null
  }
}

export const ADMIN_COOKIE = 'aj_admin'
