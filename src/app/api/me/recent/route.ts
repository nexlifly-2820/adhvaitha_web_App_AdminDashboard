import { NextResponse } from 'next/server'
import { readCustomer, privateDocId } from '@/lib/customerAuth'
import { readDoc, writeDoc } from '@/lib/reviewInbox'

export const dynamic = 'force-dynamic'

const str = (v: any, n: number) => String(v ?? '').replace(/[<>]/g, '').trim().slice(0, n)

// App → the logged-in customer's recently viewed products (same on every phone).
export async function GET(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const d = await readDoc(await privateDocId('recent', c.uid))
  return NextResponse.json({ success: true, items: Array.isArray(d?.items) ? d.items : [] })
}

export async function PUT(request: Request) {
  const c = await readCustomer(request)
  if (!c) return NextResponse.json({ success: false, relogin: true, error: 'Please log in' }, { status: 401 })
  const b = await request.json().catch(() => ({}))
  const items = (Array.isArray(b?.items) ? b.items : []).slice(0, 12).map((x: any) => {
    const w: Record<string, number> = {}
    if (x?.w && typeof x.w === 'object') for (const [k, v] of Object.entries(x.w).slice(0, 8)) if (Number(v) > 0) w[str(k, 20)] = Number(v)
    return { n: str(x?.n, 120), i: str(x?.i, 300), c: str(x?.c, 40), d: str(x?.d, 300), w, p: Number(x?.p) || 0, t: Number(x?.t) || Date.now() }
  }).filter((x: any) => x.n)
  await writeDoc(await privateDocId('recent', c.uid), { version: 1, items, updatedAt: new Date().toISOString() })
  return NextResponse.json({ success: true })
}
