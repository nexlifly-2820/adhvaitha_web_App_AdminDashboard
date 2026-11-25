'use client'

// Most Loved ("The Love Chart") — the dark spotlight section on the home page.
// Saved to app settings doc "most_loved" as { version: 2, settings, products }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Heart, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { DEFAULT_LOVE_PRODUCTS, DEFAULT_LOVE_SETTINGS, LOVED_PREVIEWS, type LProduct, type LSettings } from './loveChartDefaults'

const DOC_ID = 'most_loved'
const GOLD = '#F6C453'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? LOVED_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
const COLOR_PRESETS: [string, string, string][] = [
  ['Mango', '#F7B733', '#E2722B'], ['Chilli', '#8E1B2B', '#5C0A0D'], ['Leaf', '#18453B', '#235D4E'],
  ['Ghee', '#8B4513', '#B8860B'], ['Gongura', '#2E5E2A', '#16361A'], ['Jaggery', '#B5651D', '#7A3E12'], ['Royal', '#4B2A7A', '#2A1650'],
]

function normalise(raw: any): LProduct[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `p${i + 1}`),
    name: String(m?.name ?? ''), short: String(m?.short ?? ''), tagline: String(m?.tagline ?? ''), image: String(m?.image ?? ''),
    colors: Array.isArray(m?.colors) && m.colors.length >= 2 ? [String(m.colors[0]), String(m.colors[1])] : ['#F7B733', '#E2722B'],
    rating: num(m?.rating), soldToday: Math.round(num(m?.soldToday)), loves: String(m?.loves ?? ''), spice: Math.max(0, Math.min(3, Math.round(num(m?.spice)))),
    badge: String(m?.badge ?? ''), enabled: m?.enabled !== false,
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any, k: number) => ({ id: String(v?.id || `v${k + 1}`), label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp), inStock: v?.inStock !== false })) : [],
  }))
}

export function LoveChartManager() {
  const [items, setItems] = useState<LProduct[]>(DEFAULT_LOVE_PRODUCTS)
  const [settings, setSettings] = useState<LSettings>(DEFAULT_LOVE_SETTINGS)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const list = normalise(d.products)
          if (list.length) setItems(list)
          if (d.settings) setSettings({ ...DEFAULT_LOVE_SETTINGS, ...d.settings })
        } else if (d.products) {
          toast.info('Showing the new Most Loved defaults (6 bowls). Click Save to publish them.')
        }
      } catch {
        toast.error('Could not load Most Loved — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<LProduct>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= items.length) return
    const n = [...items]
    ;[n[i], n[j]] = [n[j], n[i]]
    setItems(n)
    setOpen(j)
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
      const clean = items.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim(), short: x.short.trim() || x.name.trim() }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings: { ...settings, intervalMs: 2500, maxItems: 12 }, products: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Most Loved saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const shown = items.filter((x) => x.enabled)
  const c = items[open]
  const pv = c && c.enabled ? c : shown[0]
  const pvRank = pv ? shown.indexOf(pv) + 1 : 1
  const pvV = pv?.variants[0]
  const off = pvV && pvV.mrp > pvV.price ? Math.round((1 - pvV.price / pvV.mrp) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 fill-rose-600 text-rose-600" /> Most Loved (The Love Chart)</CardTitle>
          <CardDescription>The dark spotlight section on the home page. The order here is the ranking (#1, #2…). It changes only when the customer taps.</CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 6 default bowls?')) { setItems(DEFAULT_LOVE_PRODUCTS); setSettings(DEFAULT_LOVE_SETTINGS); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-[#8E1B2B] text-white hover:bg-[#6d1421]">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
            {/* live preview */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              <div className="overflow-hidden rounded-2xl p-4 text-center" style={{ background: 'radial-gradient(circle at 50% 30%, #3A1410, #1E0A07 70%)' }}>
                {!settings.enabled ? <div className="py-10 text-sm text-stone-300">Section is hidden in the app</div> : pv && (
                  <>
                    <div className="text-[9px] font-bold tracking-[3px]" style={{ color: GOLD }}>✦ {settings.kicker} ✦</div>
                    <div className="font-serif text-[22px] text-white">{settings.title} <i className="text-[#FFD39A]">{settings.titleAccent}</i></div>
                    <div className="relative mx-auto mt-3 h-[210px] w-[230px]">
                      <div className="absolute inset-x-3 bottom-1 top-0 shadow-[0_0_0_4px_#1E0A07,0_0_0_6px_#F6C45388]" style={{ borderRadius: '100px 100px 18px 18px', background: `linear-gradient(${pv.colors[0]}, ${pv.colors[1]})` }} />
                      <div className="absolute inset-x-0 top-0 font-serif text-[96px] font-extrabold leading-none text-white/20">#{pvRank}</div>
                      {preview(pv.image) && <img src={preview(pv.image)} alt="" className="absolute bottom-0 left-1/2 w-[190px] -translate-x-1/2 drop-shadow-[0_16px_12px_rgba(0,0,0,.5)]" />}
                      {pv.badge && <span className="absolute left-0 top-5 -rotate-6 rounded-full px-2 py-0.5 text-[9px] font-bold shadow" style={{ background: GOLD, color: '#1E0A07' }}>{pv.badge}</span>}
                      {pv.loves && <span className="absolute right-0 top-14 rotate-6 rounded-full bg-[#C2273A] px-2 py-0.5 text-[9px] font-bold text-white shadow">♥ {pv.loves} love it</span>}
                      <span className="absolute -left-2 top-[90px] grid h-7 w-7 place-items-center rounded-full border border-[#F6C45399] bg-black/40"><ChevronLeft className="h-4 w-4 text-[#F6C453]" /></span>
                      <span className="absolute -right-2 top-[90px] grid h-7 w-7 place-items-center rounded-full border border-[#F6C45399] bg-black/40"><ChevronRight className="h-4 w-4 text-[#F6C453]" /></span>
                    </div>
                    <div className="mt-3 font-serif text-[22px] text-white">{pv.name}</div>
                    <div className="font-serif text-[11px] italic text-[#FFCF9A]">{pv.tagline}</div>
                    <div className="mt-1 text-[10px] text-[#E8D4C2]"><b style={{ color: GOLD }}>★ {pv.rating}</b>{pv.soldToday > 0 && ` · ${pv.soldToday} sold today`}</div>
                    <div className="mt-2 flex items-center gap-1 rounded-2xl bg-white p-1.5">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#FDEBD3]"><Heart className="h-3.5 w-3.5 text-[#C0392B]" /></span>
                      {pv.variants.slice(0, 3).map((v, k) => <span key={k} className={`rounded-xl px-2 py-1 text-[10px] font-semibold ${k === 0 ? 'bg-[#FDEBD3] text-[#1E0A07]' : 'text-[#6B5A48]'}`}>{v.label}</span>)}
                      <span className="ml-auto rounded-xl px-3 py-1 text-[11px] font-bold leading-tight text-white" style={{ background: 'linear-gradient(#C2273A,#8E1B2B)' }}>Add · ₹{pvV?.price}{off > 0 && <small className="block text-[8px] font-normal">₹{pvV?.mrp} {off}% off</small>}</span>
                    </div>
                    <div className="mt-3 flex justify-center gap-2 overflow-x-auto">
                      {shown.map((x) => (
                        <button key={x.id} type="button" onClick={() => setOpen(items.indexOf(x))} className="w-11 shrink-0">
                          <span className={`mx-auto grid h-10 w-10 place-items-center rounded-full border ${x === pv ? 'border-2 border-[#F6C453] bg-[#7A0F12]' : 'border-white/20 bg-white/10'}`}>{preview(x.image) && <img src={preview(x.image)} alt="" className="h-8 w-8 object-contain" />}</span>
                          <span className="block truncate text-[8px] text-[#F3E2D0]">{x.short || x.name}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Small label</label><Input value={settings.kicker} onChange={(e) => setSettings({ ...settings, kicker: e.target.value.toUpperCase() })} placeholder="THE LOVE CHART" /></div>
                <div className="grid grid-cols-2 gap-2">
                  <div><label className="text-xs font-semibold">Title</label><Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} placeholder="Most loved" /></div>
                  <div><label className="text-xs font-semibold">Title (italic word)</label><Input value={settings.titleAccent} onChange={(e) => setSettings({ ...settings, titleAccent: e.target.value })} placeholder="products" /></div>
                </div>
              </div>
            </div>

            {/* list + editor */}
            <div className="space-y-4">
              <div className="space-y-1">
                {items.map((x, i) => (
                  <div key={x.id + i} onClick={() => setOpen(i)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-[#8E1B2B] bg-rose-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    <span className="w-6 text-center text-xs font-bold text-stone-500">#{x.enabled ? shown.indexOf(x) + 1 : '–'}</span>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    <span className="text-xs text-stone-500">₹{x.variants[0]?.price ?? '-'}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={items.length >= 12}
                  onClick={() => { setItems((p) => [...p, { id: `p${Date.now()}`, name: '', short: '', tagline: '', image: '', colors: ['#F7B733', '#E2722B'], rating: 4.8, soldToday: 0, loves: '', spice: 0, badge: '', enabled: true, variants: [{ id: 'v1', label: '250g', price: 0, mrp: 0, inStock: true }] }]); setOpen(items.length) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add product
                </Button>
              </div>

              {c && (
                <div className="space-y-3 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">{c.name || 'New product'}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" title="Move up the ranking" onClick={() => move(open, -1)} disabled={open === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" title="Move down the ranking" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={items.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this product'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="most_loved" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">Product in a brass bowl, background removed (transparent PNG).</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Bellam Avakaya" /></div>
                      <div><label className="text-xs font-semibold">Short name (bottom row)</label><Input value={c.short} onChange={(e) => upd(open, { short: e.target.value })} placeholder="Avakaya" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Tagline</label><Input value={c.tagline} onChange={(e) => upd(open, { tagline: e.target.value })} placeholder="sweet jaggery meets fiery mango" /></div>
                      <div><label className="text-xs font-semibold">Badge (gold tag)</label><Input value={c.badge} onChange={(e) => upd(open, { badge: e.target.value })} placeholder="👑 No.1 this week" /></div>
                      <div><label className="text-xs font-semibold">Loves (red tag)</label><Input value={c.loves} onChange={(e) => upd(open, { loves: e.target.value })} placeholder="2.1k" /></div>
                      <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                        <div><label className="text-xs font-semibold">Rating</label><Input type="number" step="0.1" value={c.rating} onChange={(e) => upd(open, { rating: Math.min(5, num(e.target.value)) })} /></div>
                        <div><label className="text-xs font-semibold">Sold today</label><Input type="number" value={c.soldToday} onChange={(e) => upd(open, { soldToday: Math.round(num(e.target.value)) })} /></div>
                        <div><label className="text-xs font-semibold">Spice (0–3)</label>
                          <select className="h-10 w-full rounded-md border px-2 text-sm" value={c.spice} onChange={(e) => upd(open, { spice: Number(e.target.value) })}>
                            <option value={0}>None</option><option value={1}>🌶 Mild</option><option value={2}>🌶🌶 Medium</option><option value={3}>🌶🌶🌶 Hot</option>
                          </select></div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3">
                    <div className="mb-2 text-xs font-bold">Arch colour</div>
                    <div className="flex flex-wrap gap-2">
                      {COLOR_PRESETS.map(([n, a, b]) => (
                        <button key={n} type="button" onClick={() => upd(open, { colors: [a, b] })} className={`flex items-center gap-1.5 rounded-full border px-2 py-1 text-xs ${c.colors[0] === a && c.colors[1] === b ? 'border-2 border-[#8E1B2B]' : ''}`}>
                          <span className="h-4 w-4 rounded-full" style={{ background: `linear-gradient(${a}, ${b})` }} />{n}
                        </button>
                      ))}
                      <label className="flex items-center gap-1 text-xs">Custom <input type="color" value={c.colors[0]} onChange={(e) => upd(open, { colors: [e.target.value, c.colors[1]] })} /><input type="color" value={c.colors[1]} onChange={(e) => upd(open, { colors: [c.colors[0], e.target.value] })} /></label>
                    </div>
                  </div>

                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices</div>
                    {c.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-[1fr_95px_95px_90px_40px] items-center gap-2">
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
