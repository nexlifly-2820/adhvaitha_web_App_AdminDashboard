import { hmac, signToken, verifyToken } from '@/lib/authToken'

// Same id the app uses: UserManager.currentUserId for email logins.
export function uidForEmail(email: string) {
  return 'USER-' + email.trim().toLowerCase().replace(/@/g, '_').replace(/\./g, '_')
}

export interface Customer { k: 'cust'; uid: string; email: string; name?: string }

export async function issueCustomerToken(email: string, name: string) {
  const e = email.trim().toLowerCase()
  return signToken({ k: 'cust', uid: uidForEmail(e), email: e, name: name.slice(0, 60) }, 180)
}

/** The logged-in customer from "Authorization: Bearer <token>", or null. */
export async function readCustomer(request: Request): Promise<Customer | null> {
  const h = request.headers.get('authorization') || ''
  const t = h.toLowerCase().startsWith('bearer ') ? h.slice(7).trim() : ''
  return verifyToken<Customer>(t, 'cust')
}

/** Private per-customer doc id (cannot be guessed from the email). */
export async function privateDocId(kind: string, uid: string) {
  return `u_${kind}_${(await hmac(`${kind}:${uid}`)).replace(/[^A-Za-z0-9]/g, '').slice(0, 24)}`
}
