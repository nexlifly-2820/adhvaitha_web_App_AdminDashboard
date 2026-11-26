'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

type Product = { id: string; name: string; image: string; categoryName: string; hidden: boolean; variants: { label: string; price: number; inStock: boolean }[] }

export default function WebStorePage() {
  const [shopEnabled, setShopEnabled] = useState(true)
  const [codEnabled, setCodEnabled] = useState(true)
  const [notice, setNotice] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [hidden, setHidden] = useState<Set<string>>(new Set())
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const [s, c] = await Promise.all([
          fetch('/dashboard/website/api/store', { cache: 'no-store' }).then((r) => r.json()),
          fetch('/api/shop/catalog?all=1', { cache: 'no-store' }).then((r) => r.json()),
        ])
        if (s?.data) {
          setShopEnabled(s.data.shopEnabled !== false)
          setCodEnabled(s.data.codEnabled !== false)
          setNotice(s.data.notice || '')
          setHidden(new Set(s.data.hidden || []))
        }
        if (Array.isArray(c?.products)) setProducts(c.products)
      } finally { setLoading(false) }
    })()
  }, [])

  const shown = useMemo(() => products.filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase())), [products, q])

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const r = await fetch('/dashboard/website/api/store', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopEnabled, codEnabled, notice, hidden: [...hidden] }),
      })
      const j = await r.json()
      setMsg(j.success ? 'Saved. The website updates within a minute.' : (j.error || 'Could not save'))
    } catch { setMsg('Could not save. Check your internet.') }
    setSaving(false)
  }

  const toggle = (id: string) => setHidden((h) => { const n = new Set(h); if (n.has(id)) n.delete(id); else n.add(id); return n })

  if (loading) return <div className="p-6">Loading…</div>

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Online Store</h2>
        <p className="text-slate-500 mt-1 text-sm">Selling on adhvaithafoods.in. Products, prices, stock and coupons are shared with the app — change them in App Management → Shop catalogue / Offers.</p>
      </div>

      <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={shopEnabled} onChange={(e) => setShopEnabled(e.target.checked)} />
          <span><b>Shop is open on the website</b><br /><span className="text-sm text-slate-500">When off, the website shows products only (no Add to cart).</span></span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" className="mt-1 h-4 w-4" checked={codEnabled} onChange={(e) => setCodEnabled(e.target.checked)} />
          <span><b>Allow Cash on Delivery on the website</b><br /><span className="text-sm text-slate-500">The app is not affected.</span></span>
        </label>
        <div>
          <label className="text-sm font-semibold">Notice on cart page (optional)</label>
          <input value={notice} onChange={(e) => setNotice(e.target.value)} maxLength={200} placeholder="e.g. Orders placed today ship on Monday" className="mt-1 w-full border rounded-lg p-2 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-xl border p-4 sm:p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-semibold">Products sold on the website <span className="text-slate-400 font-normal">({products.length - hidden.size} of {products.length})</span></h3>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className="border rounded-lg p-2 text-sm w-full sm:w-60" />
        </div>
        <p className="text-xs text-slate-500">Untick a product to stop selling it on the website only. It stays in the app.</p>
        <div className="divide-y max-h-[55vh] overflow-y-auto">
          {shown.map((p) => (
            <label key={p.id} className="flex items-center gap-3 py-2 cursor-pointer">
              <input type="checkbox" className="h-4 w-4 shrink-0" checked={!hidden.has(p.id)} onChange={() => toggle(p.id)} />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-sm truncate">{p.name}</div>
                <div className="text-xs text-slate-500 truncate">{p.categoryName} · {p.variants.map((v) => `${v.label} ₹${v.price}${v.inStock ? '' : ' (out)'}`).join(' · ')}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
        <Link href="/dashboard/website/orders" className="px-5 py-2.5 rounded-lg border font-semibold hover:bg-slate-50">View website orders</Link>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>
    </div>
  )
}
