import { readDoc, writeDoc } from '@/lib/reviewInbox'
import { hmac } from '@/lib/authToken'

// Login codes are kept hashed (never the code itself) in doc "login_otps".
export interface OtpRec { h: string; exp: number; tries: number; sent: number[] }

export async function readOtps(): Promise<Record<string, OtpRec>> {
  const d = await readDoc('login_otps')
  return d && typeof d.items === 'object' && d.items ? d.items : {}
}

export async function writeOtps(items: Record<string, OtpRec>) {
  const now = Date.now()
  for (const k of Object.keys(items)) if (items[k].exp < now - 3600_000) delete items[k] // drop old ones
  await writeDoc('login_otps', { version: 1, items })
}

export const otpKey = async (email: string) => (await hmac('otp-key:' + email.trim().toLowerCase())).slice(0, 22)
export const otpHash = (email: string, code: string) => hmac(`otp:${email.trim().toLowerCase()}:${code}`)
