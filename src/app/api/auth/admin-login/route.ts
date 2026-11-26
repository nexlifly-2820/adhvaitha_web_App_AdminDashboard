import { NextResponse } from 'next/server'
import { ADMIN_COOKIE, hasAuthSecret, signToken } from '@/lib/authToken'

export const dynamic = 'force-dynamic'

const tries = new Map<string, { n: number; until: number }>()

function same(a: string, b: string) {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

// Admin sign-in with a password only. Set ADMIN_PASSWORD in Vercel → Settings → Environment Variables.
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'x'
  const t = tries.get(ip)
  if (t && t.until > Date.now()) return NextResponse.json({ success: false, error: 'Too many attempts. Try again in 10 minutes.' }, { status: 429 })

  const password = process.env.ADMIN_PASSWORD || ''
  if (!password || !hasAuthSecret()) {
    return NextResponse.json({ success: false, error: 'Admin login is not set up. Add ADMIN_PASSWORD in Vercel environment variables, then redeploy.' }, { status: 503 })
  }
  const b = await request.json().catch(() => ({}))
  if (!same(String(b?.password || ''), password)) {
    const n = (t?.n || 0) + 1
    tries.set(ip, { n, until: n >= 5 ? Date.now() + 10 * 60_000 : 0 })
    return NextResponse.json({ success: false, error: 'Wrong password' }, { status: 401 })
  }
  tries.delete(ip)
  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, await signToken({ k: 'admin' }, 14), {
    httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 14 * 86400,
  })
  return res
}
