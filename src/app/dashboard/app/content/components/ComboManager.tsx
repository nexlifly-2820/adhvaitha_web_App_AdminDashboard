'use client'

// Combo Box — "Build your box": customers pick any N products from the list, Amma packs them, with a discount.
// Saved to app settings doc "combo_box" as { version: 2, settings, products }.
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Loader2, Package, Plus, RotateCcw, Save, Search, Trash2, X } from 'lucide-react'
import { COMBO_PREVIEWS, DEFAULT_COMBO_PRODUCTS, DEFAULT_COMBO_SETTINGS, type CProduct, type CSettings } from './comboDefaults'

const DOC_ID = 'combo_box'
const KRAFT = '#8B5A2B'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? COMBO_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x))

function normProducts(raw: any): CProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => {
    const prices: CProduct['prices'] = {}
    if (m?.prices && typeof m.prices === 'object') {
      for (const [k, v] of Object.entries<any>(m.prices)) prices[k] = { variantId: String(v?.variantId ?? k), price: num(v?.price), mrp: num(v?.mrp), inStock: v?.inStock !== false }
    }
    return { id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`), productId: String(m?.productId ?? ''), name: String(m?.name ?? ''), category: String(m?.category ?? ''), image: String(m?.image ?? ''), enabled: m?.enabled !== false, prices }
  })
}

export function ComboManager() {
  const [items, setItems] = useState<CProduct[]>(clone(DEFAULT_COMBO_PRODUCTS))
  const [settings, setSettings] = useState<CSettings>(clone(DEFAULT_COMBO_SETTINGS))
  const [tab, setTab] = useState<'products' | 'settings'>('products')
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [picked, setPicked] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const ps = normProducts(d.products)
          if (ps.length) setItems(ps)
          if (d.settings) setSettings({ ...clone(DEFAULT_COMBO_SETTINGS), ...d.settings })
        }
      } catch {
        toast.error('Could not load Combo Box — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<CProduct>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const setPrice = (i: number, size: string, patch: Partial<CProduct['prices'][string]>) =>
    setItems((p) => p.map((x, k) => (k === i ? { ...x, prices: { ...x.prices, [size]: { variantId: size, price: 0, mrp: 0, inStock: true, ...x.prices[size], ...patch } } } : x)))
  const removePrice = (i: number, size: string) => setItems((p) => p.map((x, k) => { if (k !== i) return x; const n = { ...x.prices }; delete n[size]; return { ...x, prices: n } }))
  const move = (i: number, d: -1 | 1) => { const j = i + d; if (j < 0 || j >= items.length) return; const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; setItems(n); setOpen(j) }

  const filtered = useMemo(() => items.map((x, i) => ({ x, i })).filter(({ x }) => (cat === 'All' || x.category === cat) && x.name.toLowerCase().includes(q.toLowerCase())), [items, cat, q])

  const save = async () => {
    if (!settings.sizes.length) return toast.error('Add at least one size')
    if (!settings.categories.length) return toast.error('Add at least one category')
    for (const x of items) {
      if (!x.name.trim()) return toast.error('Every product needs a name')
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!settings.sizes.some((s) => (x.prices[s]?.price || 0) > 0)) return toast.error(`${x.name}: add a price for at least one size`)
    }
    if (items.filter((x) => x.enabled).length < settings.jars) return toast.error(`Keep at least ${settings.jars} products switched on`)
    setSaving(true)
    try {
      const clean = items.map((x) => {
        const prices: CProduct['prices'] = {}
        for (const s of settings.sizes) if ((x.prices[s]?.price || 0) > 0) prices[s] = { ...x.prices[s], variantId: x.prices[s].variantId || s }
        return { ...x, id: x.id || slug(x.name), productId: x.productId || slug(x.name), name: x.name.trim(), prices }
      })
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings, products: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Combo Box saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // preview: a box with the picked jars and the discount for that count
  const size0 = settings.sizes[0] || ''
  const pickedItems = picked.map((id) => items.find((x) => x.id === id)).filter(Boolean) as CProduct[]
  const sub = pickedItems.reduce((a, x) => a + (x.prices[size0]?.price || 0), 0)
  const pct = settings.tiers.reduce((p, t) => (pickedItems.length >= t.jars ? t.percent : p), 0)
  const total = Math.round(sub * (1 - pct / 100))
  const togglePick = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= settings.jars ? p : [...p, id]))
  const c = items[open]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Package className="h-5 w-5 text-amber-800" /> Combo Box (Build your box)</CardTitle>
          <CardDescription>Every product customers can put in the combo box, the sizes, prices, discount steps and the texts on the home card and box.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the default products and settings?')) { setItems(clone(DEFAULT_COMBO_PRODUCTS)); setSettings(clone(DEFAULT_COMBO_SETTINGS)); setOpen(0); setPicked([]) } }}><RotateCcw className="mr-1 h-4 w-4" /> Defaults</Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: KRAFT }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* PREVIEW */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW — tap products to fill the box</div>
              <div className="rounded-2xl p-4" style={{ background: 'linear-gradient(#FFF4E2,#F3E0C2)' }}>
                {!settings.enabled ? <div className="py-10 text-center text-sm text-stone-500">Section is hidden in the app</div> : (
                  <>
                    <div className="text-center text-[9px] font-bold tracking-[3px] text-amber-800">{settings.eyebrow}</div>
                    <div className="text-center font-serif text-[22px] text-[#3B1F0E]">{settings.homeTitle} <i className="text-[#B0263A]">{settings.homeAccent}</i></div>
                    <div className="text-center text-[11px] text-stone-600">{settings.homeLine}</div>
                    {/* box */}
                    <div className="mx-auto mt-3 w-[260px] max-w-full rounded-lg border-2 p-2 shadow-inner" style={{ background: 'linear-gradient(#C8945A,#A8733E)', borderColor: '#7A4A1E' }}>
                      <div className="mb-1 text-center font-serif text-[12px] font-bold text-[#FFF3DF]">{settings.boxLabel}</div>
                      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${Math.min(settings.jars, 4)}, minmax(0,1fr))` }}>
                        {Array.from({ length: settings.jars }).map((_, k) => {
                          const x = pickedItems[k]
                          return (
                            <div key={k} className="grid aspect-square place-items-center rounded-md bg-[#6E4520]/60">
                              {x && preview(x.image) ? <img src={preview(x.image)} alt="" className="h-full w-full object-contain p-0.5" /> : <span className="text-lg text-[#E9C99A]/60">+</span>}
                            </div>
                          )
                        })}
                      </div>
                      <div className="mt-1 text-center text-[9px] italic text-[#FFE9C7]">{settings.lidText}</div>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">
                      {settings.tiers.map((t, k) => <span key={k} className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${pickedItems.length >= t.jars ? 'bg-[#B0263A] text-white' : 'bg-white text-stone-600'}`}>{t.jars} jars · {t.percent}% off</span>)}
                    </div>
                    <div className="mt-2 text-center text-sm">{pickedItems.length}/{settings.jars} picked · <b>₹{total}</b>{pct > 0 && <s className="ml-1 text-xs text-stone-500">₹{sub}</s>} <span className="text-[10px] text-stone-500">({size0} each)</span></div>
                    <div className="mt-2 max-h-[220px] overflow-y-auto rounded-lg bg-white/70 p-2">
                      {settings.categories.map((cg) => {
                        const list = items.filter((x) => x.enabled && x.category === cg)
                        if (!list.length) return null
                        return (
                          <div key={cg} className="mb-2">
                            <div className="mb-1 text-[10px] font-bold text-amber-900">{cg} ({list.length})</div>
                            <div className="grid grid-cols-4 gap-1.5">
                              {list.map((x) => (
                                <button key={x.id} type="button" onClick={() => togglePick(x.id)} className={`rounded-lg border bg-white p-1 text-center ${picked.includes(x.id) ? 'border-2 border-[#B0263A]' : ''}`}>
                                  {preview(x.image) && <img src={preview(x.image)} alt="" className="mx-auto h-10 w-10 object-contain" />}
                                  <div className="truncate text-[8.5px] font-semibold">{x.name}</div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 text-center"><span className="inline-block rounded-full bg-[#3B1F0E] px-4 py-1.5 text-[11px] font-bold text-[#FFE7B8]">{settings.homeButton} ›</span></div>
                  </>
                )}
              </div>
            </div>

            {/* EDITOR */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={tab === 'products' ? 'default' : 'outline'} onClick={() => setTab('products')}>Products ({items.length})</Button>
                <Button size="sm" variant={tab === 'settings' ? 'default' : 'outline'} onClick={() => setTab('settings')}>Box, sizes & discounts</Button>
              </div>

              {tab === 'settings' && (
                <div className="space-y-3 rounded-xl border p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show this section in the app</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {([['eyebrow', 'Small label'], ['homeTitle', 'Home title'], ['homeAccent', 'Home title (italic)'], ['homeLine', 'Home line'], ['homeButton', 'Home button'], ['titleStart', 'Screen title'], ['titleAccent', 'Screen title (accent)'], ['boxLabel', 'Label on the box'], ['lidText', 'Text on the lid'], ['tagText', 'Gift tag text']] as const).map(([k, l]) => (
                      <div key={k}><label className="text-xs font-semibold">{l}</label><Input value={String(settings[k])} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} /></div>
                    ))}
                    <div><label className="text-xs font-semibold">Jars in one box</label>
                      <select className="h-10 w-full rounded-md border px-2 text-sm" value={settings.jars} onChange={(e) => { setSettings({ ...settings, jars: Number(e.target.value) }); setPicked([]) }}>{[2, 3, 4].map((n) => <option key={n} value={n}>{n} jars</option>)}</select></div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Sizes (customers pick one size for the whole box)</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {settings.sizes.map((s, i) => <span key={i} className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm">{s}<button type="button" onClick={() => setSettings({ ...settings, sizes: settings.sizes.filter((_, k) => k !== i) })}><X className="h-3 w-3" /></button></span>)}
                      <Input className="h-8 w-28" placeholder="+ size, Enter" onKeyDown={(e) => { const v = (e.target as HTMLInputElement).value.trim(); if (e.key === 'Enter' && v && !settings.sizes.includes(v)) { setSettings({ ...settings, sizes: [...settings.sizes, v] }); (e.target as HTMLInputElement).value = '' } }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Categories (tabs in the box screen)</div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {settings.categories.map((s, i) => <span key={i} className="flex items-center gap-1 rounded-full border px-2 py-0.5 text-sm">{s}<button type="button" onClick={() => setSettings({ ...settings, categories: settings.categories.filter((_, k) => k !== i) })}><X className="h-3 w-3" /></button></span>)}
                      <Input className="h-8 w-32" placeholder="+ category, Enter" onKeyDown={(e) => { const v = (e.target as HTMLInputElement).value.trim(); if (e.key === 'Enter' && v && !settings.categories.includes(v)) { setSettings({ ...settings, categories: [...settings.categories, v] }); (e.target as HTMLInputElement).value = '' } }} />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold">Discount steps</div>
                    {settings.tiers.map((t, i) => (
                      <div key={i} className="mt-1 flex items-center gap-2 text-sm">
                        <Input type="number" className="w-20" value={t.jars} onChange={(e) => setSettings({ ...settings, tiers: settings.tiers.map((x, k) => (k === i ? { ...x, jars: Math.round(num(e.target.value)) } : x)) })} /> jars →
                        <Input type="number" className="w-20" value={t.percent} onChange={(e) => setSettings({ ...settings, tiers: settings.tiers.map((x, k) => (k === i ? { ...x, percent: num(e.target.value) } : x)) })} /> % off
                        <Button size="sm" variant="outline" className="text-red-700" onClick={() => setSettings({ ...settings, tiers: settings.tiers.filter((_, k) => k !== i) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="mt-1" disabled={settings.tiers.length >= 4} onClick={() => setSettings({ ...settings, tiers: [...settings.tiers, { jars: settings.jars, percent: 10 }] })}><Plus className="mr-1 h-4 w-4" /> Add step</Button>
                  </div>
                </div>
              )}

              {tab === 'products' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative min-w-[160px] flex-1"><Search className="absolute left-2 top-2.5 h-4 w-4 text-stone-400" /><Input className="pl-8" placeholder="Search products" value={q} onChange={(e) => setQ(e.target.value)} /></div>
                    <select className="h-10 rounded-md border px-2 text-sm" value={cat} onChange={(e) => setCat(e.target.value)}><option>All</option>{settings.categories.map((x) => <option key={x}>{x}</option>)}</select>
                    <Button size="sm" variant="outline" onClick={() => { setItems((p) => [...p, { id: `p${Date.now()}`, productId: '', name: '', category: settings.categories[0] || 'Pickles', image: '', enabled: true, prices: {} }]); setOpen(items.length); setQ(''); setCat('All') }}><Plus className="mr-1 h-4 w-4" /> Add product</Button>
                  </div>
                  <div className="max-h-[260px] space-y-1 overflow-y-auto pr-1">
                    {filtered.map(({ x, i }) => (
                      <div key={x.id + i} onClick={() => setOpen(i)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-amber-800 bg-amber-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                        {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                        <span className="flex-1 truncate font-medium">{x.name || 'Untitled'}</span>
                        <span className="rounded bg-stone-100 px-1.5 text-[10px]">{x.category}</span>
                        {!x.enabled && <span className="text-[10px]">hidden</span>}
                        <span className="text-xs text-stone-500">₹{x.prices[size0]?.price ?? '-'}</span>
                      </div>
                    ))}
                    {!filtered.length && <div className="p-3 text-center text-sm text-stone-500">No products match.</div>}
                  </div>
                  {c && (
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-bold">{c.name || 'New product'}</div>
                        <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in combo</label>
                        <div className="ml-auto flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowUp className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="text-red-700" onClick={() => { if (confirm(`Delete "${c.name || 'this product'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setPicked((p) => p.filter((id) => id !== c.id)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                        <div>
                          <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="combo_box" maxSizeMB={3} />
                          {isAsset(c.image) && preview(c.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                          <div className="mt-1 text-[10px] text-muted-foreground">Product in a brass bowl, background removed (transparent PNG).</div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="sm:col-span-2"><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} /></div>
                          <div><label className="text-xs font-semibold">Category</label>
                            <select className="h-10 w-full rounded-md border px-2 text-sm" value={c.category} onChange={(e) => upd(open, { category: e.target.value })}>{settings.categories.map((x) => <option key={x}>{x}</option>)}{!settings.categories.includes(c.category) && <option>{c.category}</option>}</select></div>
                        </div>
                      </div>
                      <div className="space-y-2 rounded-lg border p-3">
                        <div className="text-xs font-bold">Price for each box size <span className="font-normal text-muted-foreground">(leave a size empty if this product isn&apos;t sold in it)</span></div>
                        {settings.sizes.map((s) => {
                          const pr = c.prices[s]
                          return (
                            <div key={s} className="grid grid-cols-2 items-center gap-2 sm:grid-cols-[70px_100px_100px_90px_40px]">
                              <div className="text-sm font-semibold">{s}</div>
                              <Input type="number" placeholder="Price ₹" value={pr?.price ?? ''} onChange={(e) => setPrice(open, s, { price: num(e.target.value) })} />
                              <Input type="number" placeholder="MRP ₹" value={pr?.mrp ?? ''} onChange={(e) => setPrice(open, s, { mrp: num(e.target.value) })} />
                              <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={pr ? pr.inStock : false} onChange={(e) => setPrice(open, s, { inStock: e.target.checked })} /> In stock</label>
                              <Button size="sm" variant="outline" className="text-red-700" disabled={!pr} onClick={() => removePrice(open, s)}><X className="h-4 w-4" /></Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
