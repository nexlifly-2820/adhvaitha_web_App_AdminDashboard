import { NextResponse } from 'next/server'
import { BIGROCK_API_URL } from '@/lib/api-client'
import { hasAuthSecret } from '@/lib/authToken'
import { otpHash, otpKey, readOtps, writeOtps } from '@/lib/otpStore'

export const dynamic = 'force-dynamic'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// App → send a 6-digit login code to the customer's email.
// The email itself is sent by the BigRock mail server (send_email_otp.php); the code is checked here.
export async function POST(request: Request) {
  try {
    if (!hasAuthSecret()) return NextResponse.json({ success: false, error: 'Login is not set up on the server yet.' }, { status: 503 })
    const b = await request.json().catch(() => ({}))
    const email = String(b?.email || '').trim().toLowerCase()
    if (!EMAIL.test(email) || email.length > 120) return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 })

    // Play Store review / testing account (optional): TEST_LOGIN_EMAIL + TEST_LOGIN_CODE in Vercel
    if (process.env.TEST_LOGIN_EMAIL && email === process.env.TEST_LOGIN_EMAIL.trim().toLowerCase() && process.env.TEST_LOGIN_CODE) {
      return NextResponse.json({ success: true, message: 'Code sent' })
    }

    const all = await readOtps()
    const k = await otpKey(email)
    const now = Date.now()
    const sent = (all[k]?.sent || []).filter((t) => t > now - 3600_000)
    if (sent.length && now - sent[sent.length - 1] < 30_000) return NextResponse.json({ success: false, error: 'Please wait 30 seconds before asking for a new code.' }, { status: 429 })
    if (sent.length >= 5) return NextResponse.json({ success: false, error: 'Too many codes asked. Please try again in an hour.' }, { status: 429 })

    const r = await fetch(`${BIGROCK_API_URL}/send_email_otp.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0', ...(process.env.BIGROCK_API_KEY ? { 'X-AJ-Key': process.env.BIGROCK_API_KEY } : {}) },
      body: JSON.stringify({ email }),
      cache: 'no-store',
    })
    const j: any = await r.json().catch(() => ({}))
    const code = String(j?.debug_otp || j?.otp || '')
    if (!/^\d{6}$/.test(code)) return NextResponse.json({ success: false, error: 'Could not send the code. Please try again.' }, { status: 502 })
    if (!String(j?.message || '').toLowerCase().startsWith('otp sent')) {
      return NextResponse.json({ success: false, error: 'Our email could not be sent right now. Please try again in a minute.' }, { status: 502 })
    }

    all[k] = { h: await otpHash(email, code), exp: now + 10 * 60_000, tries: 0, sent: [...sent, now] }
    await writeOtps(all)
    return NextResponse.json({ success: true, message: `Code sent to ${email}` })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Could not send the code. Please check your internet and try again.' }, { status: 500 })
  }
}
