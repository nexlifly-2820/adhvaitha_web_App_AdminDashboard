import { NextResponse } from 'next/server'
import { readCustomer, privateDocId } from '@/lib/customerAuth'
import { readDoc, writeDoc } from '@/lib/reviewInbox'

export const dynamic = 'force-dynamic'

// App → the logged-in customer's wishlist (product names + the photo/price they saw).
export async function GET(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const d = await readDoc(await privateDocId('wish', c.uid))
  return NextResponse.json({ success: true, items: Array.isArray(d?.items) ? d.items : [], updatedAt: d?.updatedAt || null })
}

export async function PUT(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const b = await request.json().catch(() => ({}))
  const items = (Array.isArray(b?.items) ? b.items : []).slice(0, 200).map((x: any) => ({
    name: String(x?.name ?? '').replace(/[<>]/g, '').trim().slice(0, 120),
    image: String(x?.image ?? '').slice(0, 300),
    price: Number(x?.price) || 0,
    category: String(x?.category ?? '').slice(0, 40),
  })).filter((x: any) => x.name)
  await writeDoc(await privateDocId('wish', c.uid), { version: 1, items, updatedAt: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
