'use client'

// Festive Specials — the red festival block on the home page (hero + 4 tiles + strip + category chips + product row).
// Saved to app settings doc "festive_section" as { version: 2, festival }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Loader2, Plus, RotateCcw, Save, Sparkles, Trash2, X } from 'lucide-react'
import { DEFAULT_FESTIVAL, FEST_PREVIEWS, type FChip, type Festival, type FProd, type FTile } from './festiveDefaults'

const DOC_ID = 'festive_section'
const CATEGORIES = ['Pickles', 'Powders', 'Sweets', 'Snacks', 'Combos', 'Specials']
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? FEST_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x))

function normalise(raw: any): Festival {
  const d = clone(DEFAULT_FESTIVAL)
  if (!raw || typeof raw !== 'object') return d
  const s = (v: any, f = '') => (v == null ? f : String(v))
  const prods = (a: any): FProd[] => (Array.isArray(a) ? a.map((p: any, i: number) => ({ id: s(p?.id, `p${i + 1}`), name: s(p?.name), image: s(p?.image), unit: s(p?.unit), price: num(p?.price), badge: s(p?.badge), enabled: p?.enabled !== false })) : [])
  return {
    enabled: raw.enabled !== false, id: s(raw.id, d.id), kicker: s(raw.kicker, d.kicker), title: s(raw.title, d.title), subtitle: s(raw.subtitle, d.subtitle),
    art: s(raw.art, d.art), chipsTitle: s(raw.chipsTitle, d.chipsTitle), theme: { ...d.theme, ...(raw.theme || {}) },
    tiles: Array.isArray(raw.tiles) ? raw.tiles.map((t: any) => ({ title: s(t?.title), image: s(t?.image), image2: s(t?.image2), link: { category: s(t?.link?.category, 'Snacks') } })) : d.tiles,
    chips: Array.isArray(raw.chips) ? raw.chips.map((c: any) => ({ title: s(c?.title), image: s(c?.image), link: { category: s(c?.link?.category, 'Pickles') }, products: prods(c?.products) })) : d.chips,
    strip: Array.isArray(raw.strip) ? raw.strip.map(String) : d.strip,
  }
}

function Img({ src, className }: { src: string; className?: string }) {
  const p = preview(src)
  return p ? <img src={p} alt="" className={className} /> : <div className={`grid place-items-center text-[9px] text-white/60 ${className || ''}`}>no image</div>
}

function ImageField({ label, value, onChange, folder }: { label: string; value: string; onChange: (v: string) => void; folder: string }) {
  return (
    <div>
      <div className="text-xs font-semibold">{label}</div>
      <ImageUpload value={isAsset(value) ? '' : value} onChange={onChange} folder={folder} maxSizeMB={3} />
      {isAsset(value) && preview(value) && <div className="mt-1 flex items-center gap-2"><img src={preview(value)} alt="" className="h-10 w-10 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
      {value && <button type="button" className="mt-1 text-[10px] text-red-700 underline" onClick={() => onChange('')}>Remove image</button>}
    </div>
  )
}

export function FestiveManager() {
  const [f, setF] = useState<Festival>(clone(DEFAULT_FESTIVAL))
  const [tab, setTab] = useState<'banner' | 'tiles' | 'chips'>('banner')
  const [chip, setChip] = useState(0)
  const [tile, setTile] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2' && d.festival) setF(normalise(d.festival))
      } catch {
        toast.error('Could not load Festive Specials — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const set = (patch: Partial<Festival>) => setF((p) => ({ ...p, ...patch }))
  const updTile = (i: number, patch: Partial<FTile>) => set({ tiles: f.tiles.map((x, k) => (k === i ? { ...x, ...patch } : x)) })
  const updChip = (i: number, patch: Partial<FChip>) => set({ chips: f.chips.map((x, k) => (k === i ? { ...x, ...patch } : x)) })
  const updProd = (ci: number, pi: number, patch: Partial<FProd>) => updChip(ci, { products: f.chips[ci].products.map((p, k) => (k === pi ? { ...p, ...patch } : p)) })
  const moveArr = <T,>(arr: T[], i: number, d: -1 | 1): T[] => { const j = i + d; if (j < 0 || j >= arr.length) return arr; const n = [...arr]; [n[i], n[j]] = [n[j], n[i]]; return n }

  const save = async () => {
    if (!f.title.trim()) return toast.error('Festival title is needed')
    if (f.tiles.some((t) => !t.title.trim() || !t.image)) return toast.error('Every tile needs a title and an image')
    for (const c of f.chips) {
      if (!c.title.trim()) return toast.error('Every category needs a name')
      if (c.products.some((p) => !p.name.trim() || !p.image || p.price <= 0)) return toast.error(`${c.title}: every product needs a name, image and price`)
    }
    setSaving(true)
    try {
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, festival: { ...f, products: { category: f.chips[0]?.link.category || 'Pickles' } }, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      toast.success('Festive Specials saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const th = f.theme
  const c = f.chips[chip]
  const t = f.tiles[tile]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-red-600" /> Festive Specials</CardTitle>
          <CardDescription>The red festival block on the home page: banner, 4 tiles, offer strip, category chips and the products under each chip.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the default Sankranti festival?')) { setF(clone(DEFAULT_FESTIVAL)); setChip(0); setTile(0) } }}><RotateCcw className="mr-1 h-4 w-4" /> Defaults</Button>
          <Button onClick={save} disabled={saving || loading} className="bg-[#C3132F] text-white hover:bg-[#a30f27]">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* APP PREVIEW */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              {!f.enabled ? <div className="rounded-2xl border p-10 text-center text-sm text-stone-500">Section is hidden in the app</div> : (
                <div className="overflow-hidden rounded-2xl" style={{ background: th.chipBg }}>
                  <div className="relative p-3 pb-2" style={{ background: `linear-gradient(${th.bgTop}, ${th.bgBottom})` }}>
                    <div className="pr-24">
                      <div className="text-[9px] font-bold tracking-[2px]" style={{ color: th.kicker }}>{f.kicker}</div>
                      <div className="font-serif text-[18px] leading-tight" style={{ color: th.title }}>{f.title}</div>
                      <div className="mt-0.5 text-[9.5px] opacity-80" style={{ color: th.title }}>{f.subtitle}</div>
                    </div>
                    {f.art && <Img src={f.art} className="absolute right-2 top-2 h-[70px] w-[96px] object-contain" />}
                    <div className="mt-3 grid grid-cols-4 gap-1.5">
                      {f.tiles.slice(0, 4).map((x, i) => (
                        <button key={i} type="button" onClick={() => { setTab('tiles'); setTile(i) }} className="relative h-[96px] overflow-hidden rounded-lg border p-1 text-center" style={{ background: th.tile, borderColor: th.tileBorder }}>
                          <div className="text-[9px] font-bold leading-tight text-white">{x.title}</div>
                          <Img src={x.image} className="absolute bottom-1 left-1 right-1 mx-auto h-[56px] object-contain" />
                          {x.image2 && <Img src={x.image2} className="absolute bottom-0 right-0 h-[30px] w-[30px] object-contain" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  {f.strip.length > 0 && <div className="truncate px-3 py-1 text-center text-[10px] font-semibold text-white" style={{ background: th.strip }}>{f.strip.join('   •   ')}</div>}
                  <div className="p-3">
                    <div className="text-center text-[10px] font-bold tracking-[2px]" style={{ color: th.bgBottom }}>{f.chipsTitle}</div>
                    <div className="mt-2 flex justify-center gap-2 overflow-x-auto">
                      {f.chips.map((x, i) => (
                        <button key={i} type="button" onClick={() => { setTab('chips'); setChip(i) }} className={`w-16 shrink-0 rounded-xl border bg-white p-1 ${i === chip ? 'border-2' : 'opacity-70'}`} style={i === chip ? { borderColor: th.bgTop } : {}}>
                          <Img src={x.image} className="mx-auto h-9 w-10 object-contain" />
                          <div className="truncate text-[9px] font-semibold">{x.title}</div>
                        </button>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {(c?.products || []).filter((p) => p.enabled !== false).map((p, i) => (
                        <div key={i} className="w-[88px] shrink-0 rounded-lg bg-white p-1.5 shadow-sm">
                          <Img src={p.image} className="mx-auto h-14 w-16 object-contain" />
                          <div className="truncate text-[10px] font-semibold">{p.name}</div>
                          <div className="text-[9px] text-stone-500">{p.unit}</div>
                          <div className="flex items-center justify-between"><b className="text-[11px]">₹{p.price}</b><span className="rounded border px-1 text-[8px] font-bold" style={{ color: th.bgTop, borderColor: th.bgTop }}>ADD</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* EDITOR */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant={tab === 'banner' ? 'default' : 'outline'} onClick={() => setTab('banner')}>Banner & colours</Button>
                <Button size="sm" variant={tab === 'tiles' ? 'default' : 'outline'} onClick={() => setTab('tiles')}>Tiles ({f.tiles.length})</Button>
                <Button size="sm" variant={tab === 'chips' ? 'default' : 'outline'} onClick={() => setTab('chips')}>Categories & products ({f.chips.length})</Button>
              </div>

              {tab === 'banner' && (
                <div className="space-y-3 rounded-xl border p-4">
                  <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={f.enabled} onChange={(e) => set({ enabled: e.target.checked })} /> Show this section in the app</label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div><label className="text-xs font-semibold">Small label</label><Input value={f.kicker} onChange={(e) => set({ kicker: e.target.value.toUpperCase() })} placeholder="FESTIVAL OF HARVEST" /></div>
                    <div><label className="text-xs font-semibold">Festival title</label><Input value={f.title} onChange={(e) => set({ title: e.target.value })} placeholder="Sankranti Feast & Delicacies" /></div>
                    <div className="sm:col-span-2"><label className="text-xs font-semibold">Subtitle</label><Input value={f.subtitle} onChange={(e) => set({ subtitle: e.target.value })} /></div>
                    <div><label className="text-xs font-semibold">Chips heading</label><Input value={f.chipsTitle} onChange={(e) => set({ chipsTitle: e.target.value.toUpperCase() })} placeholder="FESTIVE SPECIALS" /></div>
                  </div>
                  <ImageField label="Banner art (right side of the banner)" value={f.art} onChange={(v) => set({ art: v })} folder="festive" />
                  <div>
                    <div className="text-xs font-semibold">Offer strip lines</div>
                    {f.strip.map((line, i) => (
                      <div key={i} className="mt-1 flex gap-2"><Input value={line} onChange={(e) => set({ strip: f.strip.map((x, k) => (k === i ? e.target.value : x)) })} /><Button size="sm" variant="outline" className="text-red-700" onClick={() => set({ strip: f.strip.filter((_, k) => k !== i) })}><X className="h-4 w-4" /></Button></div>
                    ))}
                    <Button size="sm" variant="outline" className="mt-1" disabled={f.strip.length >= 4} onClick={() => set({ strip: [...f.strip, ''] })}><Plus className="mr-1 h-4 w-4" /> Add line</Button>
                  </div>
                  <div>
                    <div className="mb-1 text-xs font-semibold">Colours</div>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {([['bgTop', 'Banner top'], ['bgBottom', 'Banner bottom'], ['tile', 'Tile'], ['tileBorder', 'Tile border'], ['title', 'Title text'], ['kicker', 'Small label'], ['strip', 'Offer strip'], ['chipBg', 'Lower background'], ['accent', 'Accent']] as const).map(([k, l]) => (
                        <label key={k} className="flex items-center gap-2 rounded-md border px-2 py-1 text-xs"><input type="color" value={th[k]} onChange={(e) => set({ theme: { ...th, [k]: e.target.value } })} />{l}</label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {tab === 'tiles' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {f.tiles.map((x, i) => <button key={i} type="button" onClick={() => setTile(i)} className={`rounded-full border px-3 py-1 text-sm ${i === tile ? 'border-red-700 bg-red-50 font-semibold' : ''}`}>{x.title || 'New tile'}</button>)}
                    <Button size="sm" variant="outline" disabled={f.tiles.length >= 4} onClick={() => { set({ tiles: [...f.tiles, { title: '', image: '', image2: '', link: { category: 'Snacks' } }] }); setTile(f.tiles.length) }}><Plus className="mr-1 h-4 w-4" /> Add tile</Button>
                  </div>
                  <div className="text-[11px] text-muted-foreground">The app shows 4 tiles in a row.</div>
                  {t && (
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-bold">Tile {tile + 1}</div>
                        <div className="ml-auto flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => { set({ tiles: moveArr(f.tiles, tile, -1) }); setTile(Math.max(0, tile - 1)) }} disabled={tile === 0}><ArrowLeft className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => { set({ tiles: moveArr(f.tiles, tile, 1) }); setTile(Math.min(f.tiles.length - 1, tile + 1)) }} disabled={tile === f.tiles.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="text-red-700" disabled={f.tiles.length <= 1} onClick={() => { set({ tiles: f.tiles.filter((_, k) => k !== tile) }); setTile(0) }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="grid gap-2 sm:grid-cols-2">
                        <div><label className="text-xs font-semibold">Title</label><Input value={t.title} onChange={(e) => updTile(tile, { title: e.target.value })} placeholder="Pindi Vantalu" /></div>
                        <div><label className="text-xs font-semibold">Opens category</label>
                          <select className="h-10 w-full rounded-md border px-2 text-sm" value={t.link.category || ''} onChange={(e) => updTile(tile, { link: { category: e.target.value } })}>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <ImageField label="Main image" value={t.image} onChange={(v) => updTile(tile, { image: v })} folder="festive" />
                        <ImageField label="Small second image (optional, bottom-right)" value={t.image2} onChange={(v) => updTile(tile, { image2: v })} folder="festive" />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {tab === 'chips' && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {f.chips.map((x, i) => <button key={i} type="button" onClick={() => setChip(i)} className={`rounded-full border px-3 py-1 text-sm ${i === chip ? 'border-red-700 bg-red-50 font-semibold' : ''}`}>{x.title || 'New'} <span className="text-xs text-stone-500">({x.products.length})</span></button>)}
                    <Button size="sm" variant="outline" disabled={f.chips.length >= 6} onClick={() => { set({ chips: [...f.chips, { title: '', image: '', link: { category: 'Pickles' }, products: [] }] }); setChip(f.chips.length) }}><Plus className="mr-1 h-4 w-4" /> Add category</Button>
                  </div>
                  {c && (
                    <div className="space-y-3 rounded-xl border p-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="text-sm font-bold">{c.title || 'New category'}</div>
                        <div className="ml-auto flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => { set({ chips: moveArr(f.chips, chip, -1) }); setChip(Math.max(0, chip - 1)) }} disabled={chip === 0}><ArrowLeft className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" onClick={() => { set({ chips: moveArr(f.chips, chip, 1) }); setChip(Math.min(f.chips.length - 1, chip + 1)) }} disabled={chip === f.chips.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                          <Button size="sm" variant="outline" className="text-red-700" disabled={f.chips.length <= 1} onClick={() => { if (confirm(`Delete "${c.title}" and its products?`)) { set({ chips: f.chips.filter((_, k) => k !== chip) }); setChip(0) } }}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                        <div className="space-y-2">
                          <div><label className="text-xs font-semibold">Chip name</label><Input value={c.title} onChange={(e) => updChip(chip, { title: e.target.value })} placeholder="Pickles" /></div>
                          <div><label className="text-xs font-semibold">Category (used for &quot;view all&quot;)</label>
                            <select className="h-10 w-full rounded-md border px-2 text-sm" value={c.link.category || ''} onChange={(e) => updChip(chip, { link: { category: e.target.value } })}>{CATEGORIES.map((x) => <option key={x}>{x}</option>)}</select></div>
                        </div>
                        <ImageField label="Chip image" value={c.image} onChange={(v) => updChip(chip, { image: v })} folder="festive" />
                      </div>
                      <div className="text-xs font-bold">Products under &quot;{c.title}&quot; <span className="font-normal text-muted-foreground">(at least 4 recommended)</span></div>
                      <div className="space-y-2">
                        {c.products.map((p, i) => (
                          <div key={i} className="grid gap-2 rounded-lg border p-2 sm:grid-cols-[120px_minmax(0,1fr)]">
                            <ImageField label="" value={p.image} onChange={(v) => updProd(chip, i, { image: v })} folder="festive" />
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                              <div className="col-span-2"><label className="text-[11px] font-semibold">Name</label><Input value={p.name} onChange={(e) => updProd(chip, i, { name: e.target.value })} /></div>
                              <div><label className="text-[11px] font-semibold">Size</label><Input value={p.unit} onChange={(e) => updProd(chip, i, { unit: e.target.value })} placeholder="250g" /></div>
                              <div><label className="text-[11px] font-semibold">Price ₹</label><Input type="number" value={p.price} onChange={(e) => updProd(chip, i, { price: num(e.target.value) })} /></div>
                              <div className="col-span-2"><label className="text-[11px] font-semibold">Badge</label><Input value={p.badge} onChange={(e) => updProd(chip, i, { badge: e.target.value.toUpperCase() })} placeholder="BESTSELLER" /></div>
                              <label className="flex items-center gap-1 self-end text-xs"><input type="checkbox" checked={p.enabled !== false} onChange={(e) => updProd(chip, i, { enabled: e.target.checked })} /> Show</label>
                              <div className="flex items-end gap-1">
                                <Button size="sm" variant="ghost" onClick={() => updChip(chip, { products: moveArr(c.products, i, -1) })} disabled={i === 0}><ArrowLeft className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => updChip(chip, { products: moveArr(c.products, i, 1) })} disabled={i === c.products.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="text-red-700" onClick={() => updChip(chip, { products: c.products.filter((_, k) => k !== i) })}><Trash2 className="h-4 w-4" /></Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button size="sm" variant="outline" disabled={c.products.length >= 12} onClick={() => updChip(chip, { products: [...c.products, { id: `p${Date.now()}`, name: '', image: '', unit: '250g', price: 0, badge: '', enabled: true }] })}><Plus className="mr-1 h-4 w-4" /> Add product</Button>
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
