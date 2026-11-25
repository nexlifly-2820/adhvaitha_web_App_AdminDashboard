'use client'

// Fresh Picks — "Amma's kitchen": each product rises out of a brass kadai on a fire. Customers tap a product to show it.
// Saved to app settings doc "fresh_picks" as { version: 2, settings, products }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Flame, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { DEFAULT_FP_PRODUCTS, DEFAULT_FP_SETTINGS, FRESH_PREVIEWS, type FProduct, type FSettings } from './freshPicksDefaults'

const DOC_ID = 'fresh_picks'
const ORANGE = '#E2572B'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? FRESH_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

function normalise(raw: any): FProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`), name: String(m?.name ?? ''), tagline: String(m?.tagline ?? ''), image: String(m?.image ?? ''),
    madeLabel: String(m?.madeLabel ?? ''), batch: String(m?.batch ?? ''), badge: String(m?.badge ?? ''), enabled: m?.enabled !== false,
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any, k: number) => ({ id: String(v?.id || `v${k + 1}`), label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp), inStock: v?.inStock !== false })) : [],
  }))
}

// The kadai scene, same placement as the app: food centred, its bottom sinking inside the kadai.
function Kadai({ image }: { image: string }) {
  return (
    <div className="relative mx-auto h-[220px] w-[280px] max-w-full">
      <div className="absolute left-1/2 top-[188px] h-[30px] w-[130px] -translate-x-1/2 rounded-[50%_50%_20%_20%] blur-[1px]" style={{ background: 'radial-gradient(circle at 50% 90%, #fff3b0, #ff9a2e 40%, #e8461b 70%, transparent 75%)' }} />
      <div className="absolute left-[34px] right-[34px] top-[96px] h-[44px] rounded-[50%]" style={{ background: 'linear-gradient(#c9963a,#8a5a14)' }} />
      <div className="absolute left-[42px] right-[42px] top-[101px] h-[34px] rounded-[50%]" style={{ background: 'radial-gradient(#3a2208,#1a0e04)' }} />
      {preview(image) ? (
        <img src={preview(image)} alt="" className="absolute left-1/2 top-[22px] z-[2] w-[150px] -translate-x-1/2 drop-shadow-[0_6px_8px_rgba(0,0,0,.45)]" style={{ WebkitMaskImage: 'linear-gradient(#000 78%, transparent 92%)', maskImage: 'linear-gradient(#000 78%, transparent 92%)' }} />
      ) : <div className="absolute left-1/2 top-[60px] z-[2] -translate-x-1/2 text-xs text-orange-100/70">No image</div>}
      <div className="absolute left-[34px] right-[34px] top-[118px] z-[3] h-[76px] shadow-[0_10px_20px_rgba(0,0,0,.5)]" style={{ borderRadius: '0 0 140px 140px / 0 0 76px 76px', background: 'linear-gradient(#f3cf73,#b8801e 55%,#6e4710)' }} />
    </div>
  )
}

export function FreshPicksBoard() {
  const [items, setItems] = useState<FProduct[]>(DEFAULT_FP_PRODUCTS)
  const [settings, setSettings] = useState<FSettings>(DEFAULT_FP_SETTINGS)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const l = normalise(d.products)
          if (l.length) setItems(l)
          if (d.settings) setSettings({ ...DEFAULT_FP_SETTINGS, ...d.settings })
        } else if (d.products) {
          toast.info('Showing the new Fresh Picks defaults. Click Save to publish them.')
        }
      } catch {
        toast.error('Could not load Fresh Picks — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<FProduct>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const n = [...items]; [n[i], n[j]] = [n[j], n[i]]; setItems(n); setOpen(j)
  }

  const save = async () => {
    for (const [i, x] of items.entries()) {
      if (!x.name.trim()) return toast.error(`Product ${i + 1}: name is needed`)
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!x.variants.length || x.variants.some((v) => !v.label.trim() || v.price <= 0)) return toast.error(`${x.name}: every size needs a name and a price`)
    }
    if (!items.some((x) => x.enabled)) return toast.error('Keep at least one product switched on')
    setSaving(true)
    try {
      const clean = items.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim() }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings: { ...settings, intervalMs: 3400 }, products: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Fresh Picks saved — the app shows it on next open')
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

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5 text-orange-600" /> Fresh Picks (Amma&apos;s kadai)</CardTitle>
          <CardDescription>Each product rises out of the brass kadai on the fire. Customers tap a product in the row to see it — nothing changes on its own.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the default fresh picks?')) { setItems(DEFAULT_FP_PRODUCTS); setSettings(DEFAULT_FP_SETTINGS); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: ORANGE }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              <div className="overflow-hidden rounded-2xl p-4 text-center" style={{ background: 'radial-gradient(circle at 50% 0,#4a2412,#1d0d06)' }}>
                {!settings.enabled ? <div className="py-10 text-sm text-orange-100/70">Section is hidden in the app</div> : pv && (
                  <>
                    <div className="text-[9px] font-bold tracking-[3px] text-[#F6C453]">{settings.kicker}</div>
                    <div className="font-serif text-[22px] text-white">{settings.title} <i className="text-[#FFB37A]">{settings.titleAccent}</i></div>
                    {settings.subtitle && <div className="text-[10px] text-orange-100/70">{settings.subtitle}</div>}
                    <div className="relative mt-2">
                      <Kadai image={pv.image} />
                      {pv.madeLabel && <span className="absolute left-0 top-8 -rotate-6 rounded-full bg-[#FDF6E3] px-2 py-0.5 text-[9px] font-bold text-[#6E2E14] shadow">● {pv.madeLabel}</span>}
                      {pv.batch && <span className="absolute right-0 top-16 rotate-6 rounded-full bg-[#E2572B] px-2 py-0.5 text-[9px] font-bold text-white shadow">🔥 {pv.batch}</span>}
                    </div>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      <span className="font-serif text-[20px] text-white">{pv.name}</span>
                      {pv.badge && <span className="rounded bg-[#E2572B] px-1.5 text-[9px] font-bold text-white">{pv.badge}</span>}
                    </div>
                    <div className="text-[11px] italic text-orange-100/80">{pv.tagline}</div>
                    <div className="mt-2 flex items-center justify-center gap-2 text-white">
                      {pv.variants.slice(0, 3).map((v, k) => <span key={k} className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${k === 0 ? 'bg-[#FDF6E3] text-[#6E2E14]' : 'border border-white/30'}`}>{v.label}</span>)}
                      <b className="ml-1">₹{v0?.price}</b>
                    </div>
                    <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
                      {shown.map((x) => (
                        <button key={x.id} type="button" onClick={() => setOpen(items.indexOf(x))} className={`w-12 shrink-0 rounded-xl border p-1 ${x === pv ? 'border-[#F6C453] bg-white/15' : 'border-white/15 bg-white/5'}`}>
                          {preview(x.image) && <img src={preview(x.image)} alt="" className="mx-auto h-9 w-10 object-contain" />}
                        </button>
                      ))}
                    </div>
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
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                {items.map((x, i) => (
                  <div key={x.id + i} onClick={() => setOpen(i)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-orange-600 bg-orange-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{i + 1}. {x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    <span className="text-xs text-stone-500">₹{x.variants[0]?.price ?? '-'}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={items.length >= 12}
                  onClick={() => { setItems((p) => [...p, { id: `p${Date.now()}`, name: '', tagline: '', image: '', madeLabel: 'Made today', batch: '', badge: 'NEW', enabled: true, variants: [{ id: 'v1', label: '250g', price: 0, mrp: 0, inStock: true }] }]); setOpen(items.length) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add product
                </Button>
              </div>

              {c && (
                <div className="space-y-3 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">{c.name || 'New product'}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={items.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this product'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="fresh_picks" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">Food heap only (no bowl), background removed — transparent PNG. It sits inside the kadai.</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Chakinalu" /></div>
                      <div><label className="text-xs font-semibold">Badge</label><Input value={c.badge} onChange={(e) => upd(open, { badge: e.target.value.toUpperCase() })} placeholder="NEW / HOT / FRESH" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Tagline</label><Input value={c.tagline} onChange={(e) => upd(open, { tagline: e.target.value })} placeholder="Sankranti spiral snack" /></div>
                      <div><label className="text-xs font-semibold">Made label (cream tag)</label><Input value={c.madeLabel} onChange={(e) => upd(open, { madeLabel: e.target.value })} placeholder="Made today, 6 AM" /></div>
                      <div><label className="text-xs font-semibold">Batch (orange tag)</label><Input value={c.batch} onChange={(e) => upd(open, { batch: e.target.value })} placeholder="Batch #24" /></div>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices</div>
                    {c.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-2 sm:grid-cols-[1fr_95px_95px_90px_40px] items-center gap-2">
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
