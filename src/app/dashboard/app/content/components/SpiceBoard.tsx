'use client'

// Spice grinder — "Fresh ground spices" on the home page.
// Saved to app settings doc "spices_grinder" as { version: 2, settings, products }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Flame, Loader2, Plus, RotateCcw, Save, Trash2, X } from 'lucide-react'
import { DEFAULT_SP_PRODUCTS, DEFAULT_SP_SETTINGS, SPICE_PIECES, SPICE_PREVIEWS, type SpProduct, type SpSettings, type SpThrow } from './spiceDefaults'

const DOC_ID = 'spices_grinder'
const BRAND = '#7A2A14'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? SPICE_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const hex = (v: any, fb: string) => (/^#[0-9a-fA-F]{6}$/.test(String(v)) ? String(v) : fb)
const pieceName = (p: string) => (p.split('/').pop() || '').replace(/_\d+\.png$/, '').replace(/\.png$/, '')

function normalise(raw: any): SpProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`),
    productId: String(m?.productId ?? ''),
    name: String(m?.name ?? ''),
    tagline: String(m?.tagline ?? ''),
    image: String(m?.image ?? ''),
    enabled: m?.enabled !== false,
    powderColor: hex(m?.powderColor, '#B8321E'),
    accentColor: hex(m?.accentColor, '#FF7A45'),
    glowColor: hex(m?.glowColor, '#7A2A14'),
    heat: Math.min(3, Math.max(1, Math.round(num(m?.heat) || 2))),
    throwIn: Array.isArray(m?.throwIn) ? m.throwIn.map((t: any) => ({ name: String(t?.name ?? ''), pieces: Array.isArray(t?.pieces) ? t.pieces.map(String).slice(0, 2) : [], count: Math.max(1, Math.round(num(t?.count) || 2)), size: t?.size === 'small' ? 'small' : 'big' } as SpThrow)) : [],
    chips: Array.isArray(m?.chips) ? m.chips.slice(0, 4).map((c: any) => ({ name: String(c?.name ?? ''), icon: String(c?.icon ?? '') })) : [],
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any, k: number) => ({ id: String(v?.id || `v${k + 1}`), label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp), inStock: v?.inStock !== false })) : [],
  }))
}

function PiecePicker({ value, onPick, onClose }: { value: string[]; onPick: (p: string) => void; onClose: () => void }) {
  return (
    <div className="mt-2 rounded-lg border bg-stone-50 p-2 dark:bg-stone-900">
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">Pick a spice picture <button type="button" onClick={onClose}><X className="h-3.5 w-3.5" /></button></div>
      <div className="flex flex-wrap gap-1.5">
        {SPICE_PIECES.map((p) => (
          <button key={p} type="button" title={pieceName(p)} onClick={() => onPick(p)}
            className={`h-11 w-11 rounded-md border-2 bg-white p-0.5 ${value.includes(p) ? 'border-orange-600' : 'border-transparent hover:border-orange-300'}`}>
            <img src={preview(p)} alt={pieceName(p)} className="h-full w-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  )
}

export function SpiceBoard() {
  const [items, setItems] = useState<SpProduct[]>(DEFAULT_SP_PRODUCTS)
  const [settings, setSettings] = useState<SpSettings>(DEFAULT_SP_SETTINGS)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [picker, setPicker] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const l = normalise(d.products)
          if (l.length) setItems(l)
          if (d.settings) setSettings({ ...DEFAULT_SP_SETTINGS, ...d.settings })
        } else if (d.products) {
          toast.info('Showing the new spice defaults (13 podis & masalas). Click Save to publish them.')
        }
      } catch {
        toast.error('Could not load spices — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<SpProduct>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; setItems(n); setOpen(j)
  }

  const save = async () => {
    for (const [i, x] of items.entries()) {
      if (!x.name.trim()) return toast.error(`Spice ${i + 1}: name is needed`)
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!x.throwIn.some((t) => t.pieces.length)) return toast.error(`${x.name}: add at least one spice that goes into the grinder`)
      if (!x.variants.length || x.variants.some((v) => !v.label.trim() || v.price <= 0)) return toast.error(`${x.name}: every size needs a name and a price`)
    }
    if (!items.some((x) => x.enabled)) return toast.error('Keep at least one spice switched on')
    setSaving(true)
    try {
      const clean = items.map((x) => ({
        ...x, id: x.id || slug(x.name), name: x.name.trim(),
        throwIn: x.throwIn.filter((t) => t.pieces.length).slice(0, 3),
        chips: x.chips.filter((c) => c.name.trim()).slice(0, 4),
      }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings, products: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Spices saved — the app shows them on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const shown = items.filter((x) => x.enabled)
  const c = items[open]
  const pv = c && c.enabled ? c : shown[0]
  const v0 = pv?.variants[0]
  const falling = pv ? pv.throwIn.flatMap((t) => t.pieces).slice(0, 6) : []

  const setThrow = (k: number, patch: Partial<SpThrow>) => c && upd(open, { throwIn: c.throwIn.map((t, j) => (j === k ? { ...t, ...patch } : t)) })

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-700" /> Spices (Stone Grinder)</CardTitle>
          <CardDescription>“Fresh ground spices” — whole spices fall into the stone and turn into podi. Customers switch spices with the chips or arrows.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 13 default spices?')) { setItems(DEFAULT_SP_PRODUCTS); setSettings(DEFAULT_SP_SETTINGS); setOpen(0) } }}><RotateCcw className="mr-1 h-4 w-4" /> Defaults</Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: BRAND }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 2xl:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            <div className="mx-auto w-full max-w-[420px] 2xl:max-w-none">
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              <div className="overflow-hidden rounded-2xl p-4 text-center" style={{ background: `radial-gradient(circle at 50% 30%, ${pv?.glowColor || '#7A2A14'}, #1A0C06 75%)` }}>
                {!settings.enabled ? <div className="py-10 text-sm text-orange-100/70">Section is hidden in the app</div> : pv && (
                  <>
                    <div className="text-[9px] font-bold tracking-[3px] text-[#FFD58A]">{settings.kicker}</div>
                    <div className="font-serif text-[21px] text-white">{settings.title} <i className="text-[#FFD58A]">{settings.titleAccent}</i></div>
                    <div className="text-[10px] text-orange-100/80">{settings.subtitle}</div>
                    <div className="relative mx-auto mt-3 h-[150px] w-[220px] max-w-full">
                      {falling.map((p, k) => (
                        <img key={k} src={preview(p)} alt="" className="absolute h-[30px] w-[30px] object-contain" style={{ left: 30 + k * 28, top: (k % 2) * 18 }} />
                      ))}
                      <div className="absolute bottom-0 left-1/2 h-[90px] w-[180px] -translate-x-1/2 rounded-b-[90px] rounded-t-[30px]" style={{ background: 'radial-gradient(ellipse at 50% 20%, #8C8C88, #4A4A46 70%)', boxShadow: '0 12px 20px rgba(0,0,0,.5)' }}>
                        <div className="mx-auto mt-3 h-[34px] w-[140px] rounded-[50%]" style={{ background: `radial-gradient(ellipse, ${pv.accentColor}, ${pv.powderColor})` }} />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-2 text-left">
                      <div className="flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-xl" style={{ background: `radial-gradient(circle at 50% 65%, ${pv.accentColor}, ${pv.glowColor}, #140A06)` }}>
                        {preview(pv.image) && <img src={preview(pv.image)} alt="" className="h-[58px] w-[58px] object-contain" />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-serif text-[15px] text-white">{pv.name}</div>
                        <div className="truncate text-[10px] text-orange-100/90">{'🌶'.repeat(pv.heat)}  {pv.tagline}</div>
                        <div className="mt-0.5 text-[12px] font-bold text-white">₹{v0?.price} {v0 && v0.mrp > v0.price && <s className="text-[10px] font-normal opacity-60">₹{v0.mrp}</s>}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap justify-center gap-1">{pv.chips.map((ch, k) => <span key={k} className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[9px] text-white">{preview(ch.icon) && <img src={preview(ch.icon)} alt="" className="h-3.5 w-3.5 object-contain" />}{ch.name}</span>)}</div>
                    <div className="mt-2 flex gap-1 overflow-x-auto pb-1">{shown.map((x) => <span key={x.id} className={`flex shrink-0 items-center gap-1 rounded-full border border-white/25 px-2 py-0.5 text-[9px] ${x === pv ? 'bg-[#FFF3D6] text-[#2B1D17]' : 'text-white'}`}><i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: x.powderColor }} />{x.name.replace(' Podi', '')}</span>)}</div>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Small label</label><Input value={settings.kicker} onChange={(e) => setSettings({ ...settings, kicker: e.target.value.toUpperCase() })} /></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div><label className="text-xs font-semibold">Title</label><Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} /></div>
                  <div><label className="text-xs font-semibold">Title (italic part)</label><Input value={settings.titleAccent} onChange={(e) => setSettings({ ...settings, titleAccent: e.target.value })} /></div>
                </div>
                <div><label className="text-xs font-semibold">Subtitle</label><Input value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} /></div>
                <div><label className="text-xs font-semibold">Card tag</label><Input value={settings.cardTag} onChange={(e) => setSettings({ ...settings, cardTag: e.target.value })} /></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                {items.map((x, i) => (
                  <div key={x.id + i} onClick={() => { setOpen(i); setPicker(null) }} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-orange-700 bg-orange-50 dark:bg-orange-950/30' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{i + 1}. {x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    <span className="text-xs text-stone-500">₹{x.variants[0]?.price ?? '-'}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={items.length >= 20}
                  onClick={() => { setItems((p) => [...p, { id: `p${Date.now()}`, productId: '', name: '', tagline: '', image: '', enabled: true, powderColor: '#B8321E', accentColor: '#FF7A45', glowColor: '#7A2A14', heat: 2, throwIn: [{ name: 'Red chilli', pieces: ['assets/images/redchilli_0.png'], count: 3, size: 'big' }], chips: [], variants: [{ id: 'v1', label: '250g', price: 0, mrp: 0, inStock: true }] }]); setOpen(items.length) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add spice
                </Button>
              </div>

              {c && (
                <div className="space-y-3 rounded-xl border p-3 sm:p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">{c.name || 'New spice'}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={items.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this spice'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="grid gap-3 xl:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url: string) => upd(open, { image: url })} folder="spices" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">Podi in a brass bowl, background removed (transparent PNG).</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Kandi Podi" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Tagline</label><Input value={c.tagline} onChange={(e) => upd(open, { tagline: e.target.value })} /></div>
                      <div>
                        <label className="text-xs font-semibold">Spice level</label>
                        <div className="mt-1 flex gap-1">{[1, 2, 3].map((h) => <button key={h} type="button" onClick={() => upd(open, { heat: h })} className={`rounded-md border px-2 py-1 text-xs ${c.heat === h ? 'border-orange-700 bg-orange-50 dark:bg-orange-950/40' : ''}`}>{'🌶'.repeat(h)}</button>)}</div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold">Colours (powder · glow · light)</label>
                        <div className="mt-1 flex gap-2">
                          <input type="color" value={c.powderColor} onChange={(e) => upd(open, { powderColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" title="Powder" />
                          <input type="color" value={c.glowColor} onChange={(e) => upd(open, { glowColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" title="Background glow" />
                          <input type="color" value={c.accentColor} onChange={(e) => upd(open, { accentColor: e.target.value })} className="h-8 w-10 cursor-pointer rounded border" title="Light / highlight" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">What falls into the grinder <span className="font-normal text-muted-foreground">(up to 3 groups, 1–2 pictures each)</span></div>
                    {c.throwIn.map((t, k) => (
                      <div key={k} className="rounded-md border p-2">
                        <div className="grid grid-cols-2 items-center gap-2 xl:grid-cols-[1fr_auto_80px_110px_40px]">
                          <Input className="col-span-2 xl:col-span-1" value={t.name} onChange={(e) => setThrow(k, { name: e.target.value })} placeholder="Red chilli" />
                          <div className="col-span-2 flex items-center gap-1 xl:col-span-1">
                            {t.pieces.map((p, j) => (
                              <span key={j} className="relative h-9 w-9 rounded border bg-white p-0.5">
                                <img src={preview(p)} alt="" className="h-full w-full object-contain" />
                                <button type="button" onClick={() => setThrow(k, { pieces: t.pieces.filter((_, q) => q !== j) })} className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 p-0.5 text-white"><X className="h-2.5 w-2.5" /></button>
                              </span>
                            ))}
                            {t.pieces.length < 2 && <Button size="sm" variant="outline" className="h-9" onClick={() => setPicker(picker === `t${k}` ? null : `t${k}`)}><Plus className="h-4 w-4" /></Button>}
                          </div>
                          <Input type="number" min={1} max={12} value={t.count} onChange={(e) => setThrow(k, { count: Math.min(12, Math.max(1, Math.round(num(e.target.value)))) })} title="How many fall" />
                          <select value={t.size} onChange={(e) => setThrow(k, { size: e.target.value === 'small' ? 'small' : 'big' })} className="h-9 rounded-md border bg-background px-2 text-sm">
                            <option value="big">Big pieces</option><option value="small">Small seeds</option>
                          </select>
                          <Button size="sm" variant="outline" className="text-red-700" disabled={c.throwIn.length <= 1} onClick={() => upd(open, { throwIn: c.throwIn.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {picker === `t${k}` && <PiecePicker value={t.pieces} onClose={() => setPicker(null)} onPick={(p) => { if (!t.pieces.includes(p)) setThrow(k, { pieces: [...t.pieces, p].slice(0, 2) }); setPicker(null) }} />}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.throwIn.length >= 3} onClick={() => upd(open, { throwIn: [...c.throwIn, { name: '', pieces: [], count: 3, size: 'big' }] })}><Plus className="mr-1 h-4 w-4" /> Add group</Button>
                  </div>

                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Ingredient chips on the card <span className="font-normal text-muted-foreground">(up to 4)</span></div>
                    {c.chips.map((ch, k) => (
                      <div key={k}>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setPicker(picker === `c${k}` ? null : `c${k}`)} className="h-9 w-9 shrink-0 rounded border bg-white p-0.5" title="Change picture">
                            {preview(ch.icon) ? <img src={preview(ch.icon)} alt="" className="h-full w-full object-contain" /> : <Plus className="mx-auto h-4 w-4" />}
                          </button>
                          <Input value={ch.name} onChange={(e) => upd(open, { chips: c.chips.map((x, j) => (j === k ? { ...x, name: e.target.value } : x)) })} placeholder="Curry leaves" />
                          <Button size="sm" variant="outline" className="text-red-700" onClick={() => upd(open, { chips: c.chips.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        {picker === `c${k}` && <PiecePicker value={[ch.icon]} onClose={() => setPicker(null)} onPick={(p) => { upd(open, { chips: c.chips.map((x, j) => (j === k ? { ...x, icon: p, name: x.name || pieceName(p) } : x)) }); setPicker(null) }} />}
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.chips.length >= 4} onClick={() => upd(open, { chips: [...c.chips, { name: '', icon: '' }] })}><Plus className="mr-1 h-4 w-4" /> Add chip</Button>
                  </div>

                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices</div>
                    {c.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-2 items-center gap-2 xl:grid-cols-[1fr_95px_95px_90px_40px]">
                        <Input value={v.label} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="250g" />
                        <Input type="number" value={v.price} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Input type="number" value={v.mrp} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, mrp: num(e.target.value) } : y)) })} placeholder="MRP ₹" />
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" checked={v.inStock} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, inStock: e.target.checked } : y)) })} /> In stock</label>
                        <Button size="sm" variant="outline" className="text-red-700" disabled={c.variants.length <= 1} onClick={() => upd(open, { variants: c.variants.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.variants.length >= 4} onClick={() => upd(open, { variants: [...c.variants, { id: `v${Date.now()}`, label: '', price: 0, mrp: 0, inStock: true }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
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
