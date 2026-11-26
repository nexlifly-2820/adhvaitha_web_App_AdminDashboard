import { NextResponse } from 'next/server'
import { otpHash, otpKey, readOtps, writeOtps } from '@/lib/otpStore'
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
    const rec = all[k]
    if (!rec || rec.exp < Date.now()) return NextResponse.json({ success: false, error: 'This code has expired. Tap "Resend" for a new one.' }, { status: 401 })
    if (rec.tries >= 5) return NextResponse.json({ success: false, error: 'Too many wrong tries. Tap "Resend" for a new code.' }, { status: 429 })
    if ((await otpHash(email, code)) !== rec.h) {
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
