import { NextResponse } from 'next/server'
import { readCustomer, privateDocId } from '@/lib/customerAuth'
import { readDoc, writeDoc } from '@/lib/reviewInbox'

export const dynamic = 'force-dynamic'

const clean = (v: any, n: number) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n)

// App → the logged-in customer's saved addresses (same on every phone).
export async function GET(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const d = await readDoc(await privateDocId('addr', c.uid))
  return NextResponse.json({ success: true, items: Array.isArray(d?.items) ? d.items : [], updatedAt: d?.updatedAt || null })
}

export async function PUT(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const b = await request.json().catch(() => ({}))
  const items = (Array.isArray(b?.items) ? b.items : []).slice(0, 20).map((a: any) => ({
    id: clean(a?.id, 40), name: clean(a?.name, 80), phone: clean(a?.phone, 20), altPhone: clean(a?.altPhone, 20),
    pincode: clean(a?.pincode, 10), city: clean(a?.city, 60), state: clean(a?.state, 60), house: clean(a?.house, 160),
    road: clean(a?.road, 200), type: ['HOME', 'OFFICE', 'OTHER'].includes(a?.type) ? a.type : 'HOME', isDefault: a?.isDefault === true,
  }))
  await writeDoc(await privateDocId('addr', c.uid), { version: 1, items, updatedAt: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
