import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE, verifyToken } from '@/lib/authToken'

// Admin pages and admin APIs need the admin login. Everything the app uses stays public.
const PROTECTED = ['/dashboard', '/orders', '/orders-management', '/api/admin', '/api/upload', '/api/post', '/api/dummy']

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  if (!PROTECTED.some((p) => path === p || path.startsWith(p + '/'))) return NextResponse.next()
  const ok = await verifyToken(req.cookies.get(ADMIN_COOKIE)?.value, 'admin').catch(() => null)
  if (ok) return NextResponse.next()
  const isApi = path.startsWith('/api/') || path.includes('/api/')
  if (isApi) return NextResponse.json({ success: false, error: 'Please log in to the admin' }, { status: 401 })
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.search = `?next=${encodeURIComponent(path + req.nextUrl.search)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/dashboard/:path*', '/orders/:path*', '/orders-management/:path*', '/api/admin/:path*', '/api/upload/:path*', '/api/post/:path*', '/api/dummy/:path*'],
}
