import { NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/authToken'

export async function GET(request: Request) {
  const res = NextResponse.redirect(new URL('/login', request.url))
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}
