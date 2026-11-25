'use client'

// Best Sellers — the champions podium on the home page (gold/silver/bronze + ranked rows, category tabs).
// Saved to app settings doc "best_sellers" as { version: 2, settings, products, categoryDefs, categories }.
//   products + categoryDefs = what this editor works with; categories = the expanded list the app reads.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, Trophy, X } from 'lucide-react'
import { BEST_PREVIEWS, DEFAULT_BS_CATEGORIES, DEFAULT_BS_PRODUCTS, DEFAULT_BS_SETTINGS, type BCategory, type BProduct, type BSettings } from './bestSellersDefaults'

const DOC_ID = 'best_sellers'
const GOLD = '#F6C453'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? BEST_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const MEDAL = ['🥇', '🥈', '🥉']

function normProducts(raw: any): BProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`), variantId: String(m?.variantId ?? ''), name: String(m?.name ?? ''), image: String(m?.image ?? ''),
    price: num(m?.price), mrp: num(m?.mrp), sold: String(m?.sold ?? ''), rating: num(m?.rating), move: String(m?.move ?? ''), moveBy: Math.round(num(m?.moveBy)),
  }))
}
function normCats(raw: any): BCategory[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c: any, i: number) => ({ id: String(c?.id || `cat${i + 1}`), name: String(c?.name ?? ''), emoji: String(c?.emoji ?? ''), productIds: Array.isArray(c?.productIds) ? c.productIds.map(String) : [] }))
}

export function BestSellersBoard() {
  const [products, setProducts] = useState<BProduct[]>(DEFAULT_BS_PRODUCTS)
  const [cats, setCats] = useState<BCategory[]>(DEFAULT_BS_CATEGORIES)
  const [settings, setSettings] = useState<BSettings>(DEFAULT_BS_SETTINGS)
  const [tab, setTab] = useState<'categories' | 'products'>('categories')
  const [cat, setCat] = useState(0)
  const [prod, setProd] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const ps = normProducts(d.products), cs = normCats(d.categoryDefs)
          if (ps.length) setProducts(ps)
          if (cs.length) setCats(cs)
          if (d.settings) setSettings({ ...DEFAULT_BS_SETTINGS, ...d.settings })
        } else if (d.categories) {
          toast.info('Showing the new Best Sellers defaults (12 brass-bowl products). Click Save to publish them.')
        }
      } catch {
        toast.error('Could not load Best Sellers — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const byId = (id: string) => products.find((p) => p.id === id)
  const updP = (i: number, patch: Partial<BProduct>) => setProducts((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const updC = (i: number, patch: Partial<BCategory>) => setCats((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const moveIn = (ci: number, k: number, d: -1 | 1) => {
    const ids = [...cats[ci].productIds]; const j = k + d
    if (j < 0 || j >= ids.length) return
    ;[ids[k], ids[j]] = [ids[j], ids[k]]
    updC(ci, { productIds: ids })
  }
  const moveCat = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= cats.length) return
    const n = [...cats]; [n[i], n[j]] = [n[j], n[i]]; setCats(n); setCat(j)
  }

  const save = async () => {
    for (const p of products) {
      if (!p.name.trim()) return toast.error('Every product needs a name')
      if (!p.image) return toast.error(`${p.name}: image is needed`)
      if (p.price <= 0) return toast.error(`${p.name}: price is needed`)
    }
    const expanded = cats
      .map((c) => ({ id: c.id || slug(c.name), name: c.name.trim(), emoji: c.emoji, items: c.productIds.map(byId).filter(Boolean) as BProduct[] }))
      .filter((c) => c.name && c.items.length)
    if (!expanded.length) return toast.error('Add at least one tab with products')
    setSaving(true)
    try {
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings: { ...settings, intervalMs: 4000 }, products, categoryDefs: cats, categories: expanded, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      toast.success('Best Sellers saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const c = cats[cat]
  const items = c ? (c.productIds.map(byId).filter(Boolean) as BProduct[]) : []
  const podium = [items[1], items[0], items[2]]
  const p = products[prod]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Trophy className="h-5 w-5 text-amber-500" /> Best Sellers</CardTitle>
          <CardDescription>The champions podium on the home page. Each tab shows its top 3 on the podium and the rest as ranked rows. Customers change tabs by tapping.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the default 12 products and 5 tabs?')) { setProducts(DEFAULT_BS_PRODUCTS); setCats(DEFAULT_BS_CATEGORIES); setSettings(DEFAULT_BS_SETTINGS); setCat(0); setProd(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-[#0E3B2A] text-white hover:bg-[#0a2c1f]">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* preview */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              <div className="rounded-2xl p-4 text-center" style={{ background: 'radial-gradient(circle at 50% 20%, #145238, #0E3B2A 70%)' }}>
                {!settings.enabled ? <div className="py-10 text-sm text-green-100">Section is hidden in the app</div> : (
                  <>
                    <div className="text-[9px] font-bold tracking-[3px]" style={{ color: GOLD }}>{settings.kicker}</div>
                    <div className="font-serif text-[24px] text-white">{settings.title} <i style={{ color: GOLD }}>{settings.titleAccent}</i></div>
                    {settings.subtitle && <div className="text-[10px] text-green-100/80">{settings.subtitle}</div>}
                    <div className="mt-3 flex justify-center gap-1.5 overflow-x-auto">
                      {cats.map((x, i) => (
                        <button key={x.id + i} type="button" onClick={() => { setTab('categories'); setCat(i) }} className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                          style={i === cat ? { background: GOLD, color: '#0E3B2A' } : { background: '#ffffff14', color: '#e8f5ee' }}>{x.emoji} {x.name}</button>
                      ))}
                    </div>
                    <div className="mt-4 flex items-end justify-center gap-1.5">
                      {podium.map((it, k) => {
                        const rank = k === 1 ? 1 : k === 0 ? 2 : 3
                        const h = rank === 1 ? 70 : rank === 2 ? 52 : 40
                        return (
                          <div key={k} className="w-[96px]">
                            {it ? (
                              <>
                                {preview(it.image) && <img src={preview(it.image)} alt="" className={`mx-auto object-contain ${rank === 1 ? 'h-[74px]' : 'h-[56px]'}`} />}
                                <div className="truncate text-[10px] font-semibold text-white">{it.name}</div>
                                <div className="text-[10px] font-bold" style={{ color: GOLD }}>₹{it.price}</div>
                              </>
                            ) : <div className="h-[90px]" />}
                            <div className="mt-1 grid place-items-center rounded-t-lg text-lg" style={{ height: h, background: rank === 1 ? 'linear-gradient(#FFF1BF,#B8801E)' : rank === 2 ? 'linear-gradient(#fff,#848D97)' : 'linear-gradient(#F3C9A0,#8C5A2B)' }}>{MEDAL[rank - 1]}</div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="mt-3 space-y-1.5 text-left">
                      {items.slice(3, 3 + Math.max(1, settings.rows)).map((it, k) => (
                        <div key={it.id} className="flex items-center gap-2 rounded-xl bg-white/10 px-2 py-1.5">
                          <span className="w-6 text-center font-serif text-xs font-bold" style={{ color: GOLD }}>#{k + 4}</span>
                          {preview(it.image) && <img src={preview(it.image)} alt="" className="h-8 w-8 object-contain" />}
                          <span className="flex-1 truncate text-[11px] font-semibold text-white">{it.name}<span className="block text-[9px] font-normal text-green-100/70">★ {it.rating} · {it.sold} sold</span></span>
                          <span className="text-[11px] font-bold" style={{ color: GOLD }}>₹{it.price}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Small label</label><Input value={settings.kicker} onChange={(e) => setSettings({ ...settings, kicker: e.target.value.toUpperCase() })} /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-semibold">Title</label><Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} /></div>
                  <div><label className="text-xs font-semibold">Title (italic word)</label><Input value={settings.titleAccent} onChange={(e) => setSettings({ ...settings, titleAccent: e.target.value })} /></div>
                </div>
                <div><label className="text-xs font-semibold">Subtitle</label><Input value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} /></div>
                <div><label className="text-xs font-semibold">Rows shown under the podium</label><Input type="number" min={1} max={6} value={settings.rows} onChange={(e) => setSettings({ ...settings, rows: Math.max(1, Math.min(6, Math.round(num(e.target.value)))) })} /></div>
              </div>
            </div>

            {/* editor */}
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button size="sm" variant={tab === 'categories' ? 'default' : 'outline'} onClick={() => setTab('categories')}>Tabs & ranking</Button>
                <Button size="sm" variant={tab === 'products' ? 'default' : 'outline'} onClick={() => setTab('products')}>Products ({products.length})</Button>
              </div>

              {tab === 'categories' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {cats.map((x, i) => (
                      <button key={x.id + i} type="button" onClick={() => setCat(i)} className={`rounded-full border px-3 py-1 text-sm ${i === cat ? 'border-[#0E3B2A] bg-green-50 font-semibold' : ''}`}>{x.emoji} {x.name || 'New tab'} <span className="text-xs text-stone-500">({x.productIds.length})</span></button>
                    ))}
                    <Button size="sm" variant="outline" disabled={cats.length >= 8} onClick={() => { setCats((p) => [...p, { id: `cat${Date.now()}`, name: '', emoji: '⭐', productIds: [] }]); setCat(cats.length) }}><Plus className="mr-1 h-4 w-4" /> Add tab</Button>
                  </div>
                  {c && (
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-[70px_1fr_auto] items-end gap-2">
                        <div><label className="text-xs font-semibold">Emoji</label><Input value={c.emoji} onChange={(e) => updC(cat, { emoji: e.target.value })} /></div>
                        <div><label className="text-xs font-semibold">Tab name</label><Input value={c.name} onChange={(e) => updC(cat, { name: e.target.value })} placeholder="Pickles" /></div>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => moveCat(cat, -1)} disabled={cat === 0}><ArrowUp className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => moveCat(cat, 1)} disabled={cat === cats.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="text-red-700" disabled={cats.length <= 1} onClick={() => { if (confirm(`Delete tab "${c.name}"?`)) { setCats((p) => p.filter((_, k) => k !== cat)); setCat(0) } }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="text-xs font-bold">Ranking in this tab <span className="font-normal text-muted-foreground">(top 3 go on the podium)</span></div>
                      <div className="space-y-1">
                        {c.productIds.map((id, k) => {
                          const it = byId(id)
                          return (
                            <div key={id + k} className="flex items-center gap-2 rounded-lg border px-2 py-1.5 text-sm">
                              <span className="w-8 text-center font-bold">{k < 3 ? MEDAL[k] : `#${k + 1}`}</span>
                              {it && preview(it.image) && <img src={preview(it.image)} alt="" className="h-7 w-7 object-contain" />}
                              <span className="flex-1 truncate">{it?.name || <i className="text-red-600">missing product</i>}</span>
                              <Button size="sm" variant="ghost" onClick={() => moveIn(cat, k, -1)} disabled={k === 0}><ArrowUp className="h-4 w-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => moveIn(cat, k, 1)} disabled={k === c.productIds.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                              <Button size="sm" variant="ghost" className="text-red-700" onClick={() => updC(cat, { productIds: c.productIds.filter((_, j) => j !== k) })}><X className="h-4 w-4" /></Button>
                            </div>
                          )
                        })}
                      </div>
                      <select className="h-10 w-full rounded-md border px-2 text-sm" value="" onChange={(e) => { if (e.target.value) updC(cat, { productIds: [...c.productIds, e.target.value] }) }}>
                        <option value="">+ Add a product to this tab…</option>
                        {products.filter((x) => !c.productIds.includes(x.id)).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {tab === 'products' && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    {products.map((x, i) => (
                      <div key={x.id + i} onClick={() => setProd(i)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${i === prod ? 'border-[#0E3B2A] bg-green-50' : ''}`}>
                        {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                        <span className="flex-1 truncate font-medium">{x.name || 'Untitled'}</span>
                        <span className="text-xs text-stone-500">in {cats.filter((cc) => cc.productIds.includes(x.id)).length} tab(s)</span>
                        <span className="text-xs text-stone-500">₹{x.price}</span>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="w-full" disabled={products.length >= 40}
                      onClick={() => { setProducts((p) => [...p, { id: `p${Date.now()}`, variantId: '', name: '', image: '', price: 0, mrp: 0, sold: '', rating: 4.8, move: '', moveBy: 0 }]); setProd(products.length) }}>
                      <Plus className="mr-1 h-4 w-4" /> Add product
                    </Button>
                  </div>
                  {p && (
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="flex items-center"><div className="text-sm font-bold">{p.name || 'New product'}</div>
                        <Button size="sm" variant="outline" className="ml-auto text-red-700" onClick={() => { if (confirm(`Delete "${p.name}"? It will be removed from every tab.`)) { setCats((cs) => cs.map((cc) => ({ ...cc, productIds: cc.productIds.filter((id) => id !== p.id) }))); setProducts((ps) => ps.filter((_, k) => k !== prod)); setProd(0) } }}><Trash2 className="h-4 w-4" /></Button></div>
                      <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                        <div>
                          <ImageUpload value={isAsset(p.image) ? '' : p.image} onChange={(url) => updP(prod, { image: url })} folder="best_sellers" maxSizeMB={3} />
                          {isAsset(p.image) && preview(p.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(p.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                          <div className="mt-1 text-[10px] text-muted-foreground">Brass bowl, background removed (transparent PNG).</div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          <div className="sm:col-span-2"><label className="text-xs font-semibold">Name</label><Input value={p.name} onChange={(e) => updP(prod, { name: e.target.value })} /></div>
                          <div><label className="text-xs font-semibold">Price ₹</label><Input type="number" value={p.price} onChange={(e) => updP(prod, { price: num(e.target.value) })} /></div>
                          <div><label className="text-xs font-semibold">MRP ₹</label><Input type="number" value={p.mrp} onChange={(e) => updP(prod, { mrp: num(e.target.value) })} /></div>
                          <div><label className="text-xs font-semibold">Sold (text)</label><Input value={p.sold} onChange={(e) => updP(prod, { sold: e.target.value })} placeholder="12K+" /></div>
                          <div><label className="text-xs font-semibold">Rating</label><Input type="number" step="0.1" value={p.rating} onChange={(e) => updP(prod, { rating: Math.min(5, num(e.target.value)) })} /></div>
                          <div><label className="text-xs font-semibold">Rank change</label>
                            <select className="h-10 w-full rounded-md border px-2 text-sm" value={p.move} onChange={(e) => updP(prod, { move: e.target.value })}>
                              <option value="">No change</option><option value="up">▲ Up</option><option value="down">▼ Down</option><option value="new">NEW</option>
                            </select></div>
                          <div><label className="text-xs font-semibold">By how many places</label><Input type="number" value={p.moveBy} disabled={p.move !== 'up' && p.move !== 'down'} onChange={(e) => updP(prod, { moveBy: Math.round(num(e.target.value)) })} /></div>
                          <div className="sm:col-span-2"><label className="text-xs font-semibold">Size added to cart (optional, e.g. 250g)</label><Input value={p.variantId} onChange={(e) => updP(prod, { variantId: e.target.value })} /></div>
                        </div>
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
