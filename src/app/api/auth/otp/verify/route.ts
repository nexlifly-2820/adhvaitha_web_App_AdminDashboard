import { NextResponse } from 'next/server'
import { otpHash, otpKey, readOtps, writeOtps } from '@/lib/otpStore'
import { BIGROCK_API_URL } from '@/lib/api-client'
import { issueCustomerToken, uidForEmail } from '@/lib/customerAuth'

export const dynamic = 'force-dynamic'

// App → check the 6-digit code. On success returns a login token the app sends with orders, addresses, wishlist.
export async function POST(request: Request) {
  try {
    const b = await request.json().catch(() => ({}))
    const email = String(b?.email || '').trim().toLowerCase()
    const code = String(b?.otp || '').replace(/\D/g, '')
    const name = String(b?.name || '').replace(/[<>]/g, '').trim().slice(0, 60)
    if (!email || code.length !== 6) return NextResponse.json({ success: false, error: 'Enter the 6-digit code from your email.' }, { status: 400 })

    const ok = async () => NextResponse.json({
      success: true,
      token: await issueCustomerToken(email, name),
      user: { id: uidForEmail(email), email, name },
    })

    if (process.env.TEST_LOGIN_EMAIL && email === process.env.TEST_LOGIN_EMAIL.trim().toLowerCase() && process.env.TEST_LOGIN_CODE) {
      return code === process.env.TEST_LOGIN_CODE ? ok() : NextResponse.json({ success: false, error: 'Wrong code, please try again.' }, { status: 401 })
    }

    const all = await readOtps()
    const k = await otpKey(email)
    // if we couldn't save the record, BigRock still has the code
    const rec = all[k] || { h: '', exp: Date.now() + 60_000, tries: 0, sent: [] }
    if (rec.exp < Date.now()) return NextResponse.json({ success: false, error: 'This code has expired. Tap "Resend" for a new one.' }, { status: 401 })
    if (rec.tries >= 5) return NextResponse.json({ success: false, error: 'Too many wrong tries. Tap "Resend" for a new code.' }, { status: 429 })
    let good = false
    if (rec.h) {
      good = (await otpHash(email, code)) === rec.h
    } else {
      // BigRock kept the code — ask it (it deletes the code after one correct use)
      try {
        const r = await fetch(`${BIGROCK_API_URL}/verify_email_otp.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
          body: JSON.stringify({ email, otp: code }),
          cache: 'no-store',
        })
        const j: any = await r.json().catch(() => ({}))
        good = j?.success === true || j?.verified === true
      } catch {
        return NextResponse.json({ success: false, error: 'Could not check the code. Please try again.' }, { status: 502 })
      }
    }
    if (!good) {
      rec.tries += 1
      await writeOtps(all)
      return NextResponse.json({ success: false, error: 'Wrong code, please try again.' }, { status: 401 })
    }
    rec.exp = 0 // one use only
    await writeOtps(all)
    return ok()
  } catch {
    return NextResponse.json({ success: false, error: 'Could not check the code. Please try again.' }, { status: 500 })
  }
}
