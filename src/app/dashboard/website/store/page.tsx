'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

type Product = { id: string; name: string; onWeb: boolean }

export default function WebStorePage() {
  const [shopEnabled, setShopEnabled] = useState(true)
  const [codEnabled, setCodEnabled] = useState(true)
  const [notice, setNotice] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [linking, setLinking] = useState(false)
  const [linkMsg, setLinkMsg] = useState('')

  const linkProducts = async () => {
    if (!confirm('Link the website products into the shared product list? The app will not change. Close any open Shop catalogue editor first.')) return
    setLinking(true); setLinkMsg('')
    try {
      const r = await fetch('/dashboard/website/api/import-products', { method: 'POST' })
      const j = await r.json()
      setLinkMsg(j.success
        ? `Done: ${j.linked} linked to app products, ${j.added} website-only products added (hidden in app, add prices to sell), ${j.skipped} already linked, ${j.notOnWeb} app products kept off the website.`
        : (j.error || 'Could not link'))
    } catch { setLinkMsg('Could not link. Check your internet.') }
    setLinking(false)
  }

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
        }
        if (Array.isArray(c?.products)) setProducts(c.products)
      } finally { setLoading(false) }
    })()
  }, [])


  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const r = await fetch('/dashboard/website/api/store', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopEnabled, codEnabled, notice }),
      })
      const j = await r.json()
      setMsg(j.success ? 'Saved. The website updates within a minute.' : (j.error || 'Could not save'))
    } catch { setMsg('Could not save. Check your internet.') }
    setSaving(false)
  }


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
        <h3 className="font-semibold">Products (shared with the app)</h3>
        <p className="text-sm text-slate-500">
          There is one product list for the app and the website. Edit name, description, sizes, prices and stock once — both update.
          Each product has a <b>🌐 Website</b> box (show on website, website category, bowl photo, badge). The app ignores it.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/dashboard/website/products" className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700">Edit products</Link>
          <button onClick={linkProducts} disabled={linking} className="px-4 py-2 rounded-lg border text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">{linking ? 'Linking…' : 'Link website products (one time)'}</button>
        </div>
        <p className="text-xs text-slate-500">
          “Link website products” joins the products currently on the website into the shared list: matching products get their website photo and category;
          website-only products are added <b>hidden in the app</b> with sizes but no prices (add prices to sell them). Safe to press again.
        </p>
        {linkMsg && <p className="text-sm text-slate-700">{linkMsg}</p>}
        {products.length > 0 && <p className="text-xs text-slate-500">On the website now: {products.filter((p: any) => p.onWeb).length} products.</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button onClick={save} disabled={saving} className="px-5 py-2.5 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
        <Link href="/dashboard/website/orders" className="px-5 py-2.5 rounded-lg border font-semibold hover:bg-slate-50">View website orders</Link>
        {msg && <span className="text-sm text-slate-600">{msg}</span>}
      </div>
    </div>
  )
}
