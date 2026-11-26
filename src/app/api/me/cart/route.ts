import { NextResponse } from 'next/server'
import { readCustomer, privateDocId } from '@/lib/customerAuth'
import { readDoc, writeDoc } from '@/lib/reviewInbox'

export const dynamic = 'force-dynamic'

const str = (v: any, n: number) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n)

// App → the logged-in customer's cart (same on every phone).
export async function GET(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const d = await readDoc(await privateDocId('cart', c.uid))
  return NextResponse.json({ success: true, items: Array.isArray(d?.items) ? d.items : [], updatedAt: d?.updatedAt || null })
}

export async function PUT(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const b = await request.json().catch(() => ({}))
  const items = (Array.isArray(b?.items) ? b.items : []).slice(0, 60).map((x: any) => ({
    name: str(x?.name, 120),
    image: str(x?.image, 300),
    weight: str(x?.weight, 20),
    qty: Math.min(50, Math.max(1, Math.round(Number(x?.qty) || 1))),
    price: Number(x?.price) || 0,
    category: str(x?.category, 40),
    tempering: x?.tempering === true,
    note: str(x?.note, 200),
  })).filter((x: any) => x.name)
  await writeDoc(await privateDocId('cart', c.uid), { version: 1, items, updatedAt: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
