import { NextResponse } from 'next/server'
import { readWebStore, writeWebStore } from '@/lib/storeSettings'

export const dynamic = 'force-dynamic'

// Admin → Website → Online store settings
export async function GET() {
  return NextResponse.json({ success: true, data: await readWebStore() })
}

export async function POST(request: Request) {
  const b = await request.json().catch(() => ({}))
  try {
    const data = await writeWebStore({
      shopEnabled: typeof b?.shopEnabled === 'boolean' ? b.shopEnabled : undefined,
      codEnabled: typeof b?.codEnabled === 'boolean' ? b.codEnabled : undefined,
      notice: typeof b?.notice === 'string' ? b.notice : undefined,
      hidden: Array.isArray(b?.hidden) ? b.hidden : undefined,
    })
    return NextResponse.json({ success: true, data })
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Could not save' }, { status: 500 })
  }
}
