'use client'

// Shop tab — "Spin Amma's lazy susan" categories + every product in each category (the Explore deck).
// Saved to app settings doc "shop_catalog" as { version: 2, settings, categories: [{ ..., products: [...] }] }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Loader2, Plus, RotateCcw, Save, Store, Trash2 } from 'lucide-react'
import { BOWL_FIX, DEFAULT_SH_CATEGORIES, DEFAULT_SH_SETTINGS, SHOP_PREVIEWS, type ShCategory, type ShProduct, type ShSettings } from './shopCatalogDefaults'

const DOC_ID = 'shop_catalog'
const BRAND = '#9E1424'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? SHOP_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const hex = (v: any, fb: string) => (/^#[0-9a-fA-F]{6}$/.test(String(v)) ? String(v) : fb)

function normProducts(raw: any): ShProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`), name: String(m?.name ?? ''), image: BOWL_FIX[String(m?.image ?? '')] || String(m?.image ?? ''),
    description: String(m?.description ?? ''), tag: String(m?.tag ?? ''), cureNote: String(m?.cureNote ?? ''),
    spice: Math.min(5, Math.max(0, Math.round(num(m?.spice)))), rating: Math.min(5, Math.max(0, num(m?.rating))),
    color1: hex(m?.color1, '#8A1A10'), color2: hex(m?.color2, '#2A0806'), enabled: m?.enabled !== false,
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any, k: number) => ({ id: String(v?.id || `v${k + 1}`), label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp), inStock: v?.inStock !== false })) : [],
  }))
}
function normCats(raw: any): ShCategory[] {
  if (!Array.isArray(raw)) return []
  return raw.map((c: any, i: number) => ({
    id: String(c?.id || slug(String(c?.name || '')) || `c${i + 1}`), slug: String(c?.slug || slug(String(c?.name || ''))), name: String(c?.name ?? ''),
    label: String(c?.label ?? ''), subtitle: String(c?.subtitle ?? ''), deckTitle: String(c?.deckTitle ?? ''), image: BOWL_FIX[String(c?.image ?? '')] || String(c?.image ?? ''),
    color1: hex(c?.color1, '#E8432B'), color2: hex(c?.color2, '#9E1424'), color3: hex(c?.color3, '#4A0A0E'), enabled: c?.enabled !== false,
    products: normProducts(c?.products),
  }))
}

const blankProduct = (): ShProduct => ({ id: `p${Date.now()}`, name: '', image: '', description: '', tag: '', cureNote: '', spice: 2, rating: 4.8, color1: '#8A1A10', color2: '#2A0806', enabled: true, variants: [{ id: 'v1', label: '250g', price: 0, mrp: 0, inStock: true }] })

export function ShopCatalogBoard() {
  const [cats, setCats] = useState<ShCategory[]>(DEFAULT_SH_CATEGORIES)
  const [settings, setSettings] = useState<ShSettings>(DEFAULT_SH_SETTINGS)
  const [ci, setCi] = useState(0)
  const [pi, setPi] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const l = normCats(d.categories)
          if (l.length) setCats(l)
          if (d.settings) setSettings({ ...DEFAULT_SH_SETTINGS, ...d.settings })
        } else {
          toast.info('Showing the full shop catalogue (4 categories, 39 products). Click Save to publish it to the app.')
        }
      } catch {
        toast.error('Could not load the shop catalogue — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const cat = cats[ci]
  const prod = cat?.products[pi]
  const updCat = (patch: Partial<ShCategory>) => setCats((p) => p.map((c, k) => (k === ci ? { ...c, ...patch } : c)))
  const updProd = (patch: Partial<ShProduct>) => setCats((p) => p.map((c, k) => (k === ci ? { ...c, products: c.products.map((x, j) => (j === pi ? { ...x, ...patch } : x)) } : c)))
  const moveCat = (d: -1 | 1) => { const j = ci + d; if (j < 0 || j >= cats.length) return; const n = [...cats]; [n[ci], n[j]] = [n[j], n[ci]]; setCats(n); setCi(j) }
  const moveProd = (d: -1 | 1) => { if (!cat) return; const j = pi + d; if (j < 0 || j >= cat.products.length) return; const n = [...cat.products]; [n[pi], n[j]] = [n[j], n[pi]]; updCat({ products: n }); setPi(j) }
  const moveToCategory = (target: number) => {
    if (!prod || target === ci) return
    setCats((p) => p.map((c, k) => (k === ci ? { ...c, products: c.products.filter((_, j) => j !== pi) } : k === target ? { ...c, products: [...c.products, prod] } : c)))
    toast.success(`Moved to ${cats[target].name}`)
    setPi(0)
  }

  const save = async () => {
    const ids = new Set<string>()
    for (const c of cats) {
      if (!c.name.trim()) return toast.error('Every category needs a name')
      if (!c.image) return toast.error(`${c.name}: the bowl image for the turntable is needed`)
      for (const [i, x] of c.products.entries()) {
        if (!x.name.trim()) return toast.error(`${c.name} product ${i + 1}: name is needed`)
        if (!x.image) return toast.error(`${x.name}: image is needed`)
        if (!x.variants.length || x.variants.some((v) => !v.label.trim() || v.price <= 0)) return toast.error(`${x.name}: every size needs a name and a price`)
        const id = x.id || slug(x.name)
        if (ids.has(id)) return toast.error(`${x.name}: appears twice — remove one`)
        ids.add(id)
      }
    }
    if (!cats.some((c) => c.enabled && c.products.some((x) => x.enabled))) return toast.error('Keep at least one category with products switched on')
    setSaving(true)
    try {
      const clean = cats.map((c) => ({ ...c, slug: c.slug || slug(c.name), name: c.name.trim(), products: c.products.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim() })) }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings, categories: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setCats(clean)
      toast.success('Shop catalogue saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const shownCats = cats.filter((c) => c.enabled)
  const pvCat = cat && cat.enabled ? cat : shownCats[0]
  const pvIdx = pvCat ? shownCats.indexOf(pvCat) : 0
  const neighbours = shownCats.length > 1 ? [shownCats[(pvIdx - 1 + shownCats.length) % shownCats.length], shownCats[(pvIdx + 1) % shownCats.length]] : []
  const pvProducts = pvCat ? pvCat.products.filter((x) => x.enabled) : []
  const v0 = prod?.variants[0]
  const total = cats.reduce((a, c) => a + c.products.length, 0)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2"><Store className="h-5 w-5 text-red-800" /> Shop Catalog (Shop tab)</CardTitle>
          <CardDescription>The lazy susan categories and every product shown in each category ({cats.length} categories · {total} products).</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the full default catalogue (39 products)?')) { setCats(DEFAULT_SH_CATEGORIES); setSettings(DEFAULT_SH_SETTINGS); setCi(0); setPi(0) } }}><RotateCcw className="mr-1 h-4 w-4" /> Defaults</Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: BRAND }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* PREVIEW */}
            <div className="mx-auto w-full max-w-[420px] 2xl:max-w-none">
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW — SHOP TAB</div>
              <div className="overflow-hidden rounded-2xl px-3 pb-4 pt-4 text-center" style={{ background: pvCat ? `linear-gradient(180deg, ${pvCat.color1}, ${pvCat.color2} 60%, ${pvCat.color3})` : '#9E1424' }}>
                {!settings.enabled ? <div className="py-10 text-sm text-white/70">Shop categories are hidden in the app</div> : pvCat && (
                  <>
                    <div className="text-left text-[9px] font-bold tracking-[2.6px] text-white/70">{settings.eyebrow}</div>
                    <div className="text-left font-serif text-[22px] leading-tight text-white">{settings.titleStart} <span className="text-[#FFD58A]">{settings.titleAccent}</span></div>
                    <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">{shownCats.map((c) => <span key={c.id} className={`flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${c === pvCat ? 'bg-white text-red-900' : 'bg-white/15 text-white'}`}>{preview(c.image) && <img src={preview(c.image)} alt="" className="h-4 w-4 object-contain" />}{c.name}</span>)}</div>
                    <div className="relative mx-auto mt-3 h-[150px] w-[300px] max-w-full">
                      <div className="absolute bottom-2 left-1/2 h-[70px] w-[280px] -translate-x-1/2 rounded-[50%]" style={{ background: 'radial-gradient(ellipse at 50% 35%, #D9A55A, #8A5A1E 70%)', boxShadow: '0 12px 24px rgba(0,0,0,.4)' }} />
                      {neighbours.map((c, k) => preview(c.image) && <img key={k} src={preview(c.image)} alt="" className="absolute h-[58px] w-[58px] object-contain opacity-80" style={{ left: k === 0 ? 22 : 220, top: 40 }} />)}
                      {preview(pvCat.image) && <img src={preview(pvCat.image)} alt="" className="absolute left-1/2 top-[30px] h-[100px] w-[100px] -translate-x-1/2 object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,.4)]" />}
                    </div>
                    <div className="mt-1 inline-block rounded-full bg-white px-3 py-0.5 text-[9px] font-bold tracking-[2px] text-red-900">{pvCat.label}</div>
                    <div className="font-serif text-[30px] leading-tight text-white">{pvCat.name}</div>
                    <div className="text-[11px] italic text-white/85">{pvCat.subtitle}</div>
                    <div className="mx-auto mt-2 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[12px] font-bold text-red-900">Explore {pvCat.name} <span className="rounded-full bg-red-900 px-2 text-[10px] text-white">{pvProducts.length}</span></div>
                    {settings.products && <div className="mt-3 flex gap-2 overflow-x-auto pb-1">{pvProducts.map((x) => (
                      <div key={x.id} className="w-[86px] shrink-0 rounded-xl border border-white/20 bg-white/10 p-1.5">
                        {preview(x.image) && <img src={preview(x.image)} alt="" className="mx-auto h-[46px] w-[60px] object-contain" />}
                        <div className="truncate text-[9px] font-semibold text-white">{x.name}</div>
                        <div className="text-[11px] font-bold text-[#FFD58A]">₹{x.variants[0]?.price ?? ''}</div>
                      </div>
                    ))}</div>}
                  </>
                )}
              </div>
              {prod && (
                <div className="mt-3">
                  <div className="mb-1 text-xs font-bold text-muted-foreground">EXPLORE CARD — {prod.name || 'product'}</div>
                  <div className="relative mx-auto h-[300px] w-full max-w-[300px] overflow-hidden rounded-[26px]" style={{ background: `radial-gradient(circle at 50% 35%, ${prod.color1}, ${prod.color2})` }}>
                    {preview(prod.image) && <img src={preview(prod.image)} alt="" className="absolute left-1/2 top-[22px] h-[170px] w-[86%] -translate-x-1/2 object-contain" />}
                    {prod.tag && <span className="absolute left-3 top-3 rounded-md bg-[#FFD27A] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-[#3B1F00]">{prod.tag}</span>}
                    {prod.rating > 0 && <span className="absolute right-3 top-3 rounded-md bg-white/25 px-2 py-0.5 text-[9px] text-white">★ {prod.rating}</span>}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left">
                      <div className="font-serif text-[20px] text-white">{prod.name}</div>
                      <div className="line-clamp-2 text-[10px] italic text-white/85">{prod.description}</div>
                      <div className="mt-1 flex items-center justify-between text-white"><span className="text-[10px]">{'🌶'.repeat(prod.spice)} {prod.cureNote && <span className="ml-1 rounded bg-white/15 px-1.5 text-[9px]">{prod.cureNote}</span>}</span><b className="text-[#FFD27A]">₹{v0?.price}</b></div>
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Small label</label><Input value={settings.eyebrow} onChange={(e) => setSettings({ ...settings, eyebrow: e.target.value.toUpperCase() })} /></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div><label className="text-xs font-semibold">Title</label><Input value={settings.titleStart} onChange={(e) => setSettings({ ...settings, titleStart: e.target.value })} /></div>
                  <div><label className="text-xs font-semibold">Title (gold part)</label><Input value={settings.titleAccent} onChange={(e) => setSettings({ ...settings, titleAccent: e.target.value })} /></div>
                </div>
                <div><label className="text-xs font-semibold">Hint</label><Input value={settings.hint} onChange={(e) => setSettings({ ...settings, hint: e.target.value })} /></div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.products} onChange={(e) => setSettings({ ...settings, products: e.target.checked })} /> Show the product strip under the turntable</label>
              </div>
            </div>

            {/* EDITOR */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {cats.map((c, k) => (
                  <button key={c.id + k} type="button" onClick={() => { setCi(k); setPi(0) }} className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${k === ci ? 'border-red-800 bg-red-50 font-semibold dark:bg-red-950/40' : ''} ${c.enabled ? '' : 'opacity-50'}`}>
                    {preview(c.image) && <img src={preview(c.image)} alt="" className="h-5 w-5 object-contain" />}{c.name || 'New'} <span className="text-xs text-muted-foreground">({c.products.length})</span>
                  </button>
                ))}
                <Button size="sm" variant="outline" disabled={cats.length >= 8} onClick={() => { setCats((p) => [...p, { id: `c${Date.now()}`, slug: '', name: 'New category', label: '', subtitle: '', deckTitle: '', image: '', color1: '#E8432B', color2: '#9E1424', color3: '#4A0A0E', enabled: true, products: [] }]); setCi(cats.length); setPi(0) }}><Plus className="mr-1 h-4 w-4" /> Category</Button>
              </div>

              {cat && (
                <div className="space-y-3 rounded-xl border p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">Category: {cat.name}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={cat.enabled} onChange={(e) => updCat({ enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => moveCat(-1)} disabled={ci === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => moveCat(1)} disabled={ci === cats.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={cats.length <= 1} onClick={() => { if (confirm(`Delete the "${cat.name}" category and its ${cat.products.length} products?`)) { setCats((p) => p.filter((_, k) => k !== ci)); setCi(0); setPi(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(cat.image) ? '' : cat.image} onChange={(url: string) => updCat({ image: url })} folder="shop" maxSizeMB={3} />
                      {isAsset(cat.image) && preview(cat.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(cat.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in bowl</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">The bowl on the turntable (transparent PNG).</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><label className="text-xs font-semibold">Name</label><Input value={cat.name} onChange={(e) => updCat({ name: e.target.value })} /></div>
                      <div><label className="text-xs font-semibold">Badge</label><Input value={cat.label} onChange={(e) => updCat({ label: e.target.value.toUpperCase() })} placeholder="BESTSELLERS" /></div>
                      <div><label className="text-xs font-semibold">Subtitle</label><Input value={cat.subtitle} onChange={(e) => updCat({ subtitle: e.target.value })} /></div>
                      <div><label className="text-xs font-semibold">Explore page title</label><Input value={cat.deckTitle} onChange={(e) => updCat({ deckTitle: e.target.value })} placeholder="Traditional Pickles" /></div>
                      <div className="sm:col-span-2">
                        <label className="text-xs font-semibold">Background colours (top · middle · bottom)</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={cat.color1} onChange={(e) => updCat({ color1: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" />
                          <input type="color" value={cat.color2} onChange={(e) => updCat({ color2: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" />
                          <input type="color" value={cat.color3} onChange={(e) => updCat({ color3: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold">Products in {cat.name} ({cat.products.length})</div>
                    <div className="grid gap-1 sm:grid-cols-2">
                      {cat.products.map((x, j) => (
                        <div key={x.id + j} onClick={() => setPi(j)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${pi === j ? 'border-red-800 bg-red-50 dark:bg-red-950/30' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                          {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                          <span className="flex-1 truncate font-medium">{j + 1}. {x.name || 'Untitled'}</span>
                          {!x.enabled && <span className="text-[10px]">hidden</span>}
                          <span className="text-xs text-stone-500">₹{x.variants[0]?.price ?? '-'}</span>
                        </div>
                      ))}
                    </div>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => { updCat({ products: [...cat.products, blankProduct()] }); setPi(cat.products.length) }}><Plus className="mr-1 h-4 w-4" /> Add product to {cat.name}</Button>
                  </div>
                </div>
              )}

              {cat && prod && (
                <div className="space-y-3 rounded-xl border p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">{prod.name || 'New product'}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={prod.enabled} onChange={(e) => updProd({ enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex flex-wrap gap-1">
                      <select value="" onChange={(e) => e.target.value && moveToCategory(Number(e.target.value))} className="h-8 rounded-md border bg-background px-2 text-xs">
                        <option value="">Move to…</option>
                        {cats.map((c, k) => k !== ci && <option key={k} value={k}>{c.name}</option>)}
                      </select>
                      <Button size="sm" variant="outline" onClick={() => moveProd(-1)} disabled={pi === 0}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => moveProd(1)} disabled={pi === cat.products.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" onClick={() => { if (confirm(`Delete "${prod.name || 'this product'}"?`)) { updCat({ products: cat.products.filter((_, j) => j !== pi) }); setPi(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(prod.image) ? '' : prod.image} onChange={(url: string) => updProd({ image: url })} folder="shop" maxSizeMB={3} />
                      {isAsset(prod.image) && preview(prod.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(prod.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">Product in a brass bowl, background removed (transparent PNG).</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Name</label><Input value={prod.name} onChange={(e) => updProd({ name: e.target.value })} /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Description</label><Input value={prod.description} onChange={(e) => updProd({ description: e.target.value })} /></div>
                      <div><label className="text-xs font-semibold">Tag (top-left)</label><Input value={prod.tag} onChange={(e) => updProd({ tag: e.target.value })} placeholder="Bestseller" /></div>
                      <div><label className="text-xs font-semibold">Note</label><Input value={prod.cureNote} onChange={(e) => updProd({ cureNote: e.target.value })} placeholder="☀ 21 days sun-cured" /></div>
                      <div>
                        <label className="text-xs font-semibold">Spice level</label>
                        <div className="mt-1 flex flex-wrap gap-1">{[0, 1, 2, 3, 4, 5].map((h) => <button key={h} type="button" onClick={() => updProd({ spice: h })} className={`rounded-md border px-2 py-1 text-xs ${prod.spice === h ? 'border-red-800 bg-red-50 dark:bg-red-950/40' : ''}`}>{h === 0 ? 'None' : '🌶'.repeat(h)}</button>)}</div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div><label className="text-xs font-semibold">Rating</label><Input type="number" step="0.1" min={0} max={5} value={prod.rating} onChange={(e) => updProd({ rating: Math.min(5, Math.max(0, num(e.target.value))) })} /></div>
                        <div>
                          <label className="text-xs font-semibold">Card colours</label>
                          <div className="mt-1 flex gap-1">
                            <input type="color" value={prod.color1} onChange={(e) => updProd({ color1: e.target.value })} className="h-8 w-9 cursor-pointer rounded border" />
                            <input type="color" value={prod.color2} onChange={(e) => updProd({ color2: e.target.value })} className="h-8 w-9 cursor-pointer rounded border" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices</div>
                    {prod.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-2 items-center gap-2 xl:grid-cols-[1fr_95px_95px_90px_40px]">
                        <Input value={v.label} onChange={(e) => updProd({ variants: prod.variants.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="250g" />
                        <Input type="number" value={v.price} onChange={(e) => updProd({ variants: prod.variants.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Input type="number" value={v.mrp} onChange={(e) => updProd({ variants: prod.variants.map((y, j) => (j === k ? { ...y, mrp: num(e.target.value) } : y)) })} placeholder="MRP ₹" />
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={v.inStock} onChange={(e) => updProd({ variants: prod.variants.map((y, j) => (j === k ? { ...y, inStock: e.target.checked } : y)) })} /> In stock</label>
                        <Button size="sm" variant="outline" className="text-red-700" disabled={prod.variants.length <= 1} onClick={() => updProd({ variants: prod.variants.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={prod.variants.length >= 5} onClick={() => updProd({ variants: [...prod.variants, { id: `v${Date.now()}`, label: '', price: 0, mrp: 0, inStock: true }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
