import { NextResponse } from 'next/server'
import { BIGROCK_API_URL } from '@/lib/api-client'

export const dynamic = 'force-dynamic'

// Setup check (shows no secrets): is the BigRock key set on Vercel, and does BigRock accept it?
export async function GET() {
  const raw = process.env.BIGROCK_API_KEY
  const key = (raw || '').trim()
  let bigrock = 'not tested'
  if (key) {
    try {
      const r = await fetch(`${BIGROCK_API_URL}/app_settings.php?doc_id=login_otps`, { headers: { 'X-AJ-Key': key, 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'application/json, text/plain, */*' }, cache: 'no-store' })
      bigrock = r.status === 200 ? 'OK — BigRock accepts the key' : `BigRock refused the key (HTTP ${r.status})`
    } catch (e: any) {
      bigrock = `Could not reach BigRock: ${e?.message || e}`
    }
  }
  return NextResponse.json({
    BIGROCK_API_KEY: raw === undefined ? 'MISSING on this deployment' : `set (${key.length} characters${raw !== key ? ', has extra spaces' : ''}${/^["']|["']$/.test(key) ? ', has quotes — remove them' : ''})`,
    expectedLength: 48,
    bigrock,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'set' : 'MISSING',
    loginSecret: process.env.AUTH_SECRET || process.env.FIREBASE_SERVICE_ACCOUNT ? 'ok' : 'MISSING',
  })
}
