'use client'

// Pickle Paradise — the home-page pickles section (clean green style).
// Saved to app settings doc "pickle_paradise" as { settings, items }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, Heart, Loader2, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { DEFAULT_PP_ITEMS, DEFAULT_PP_SETTINGS, PICKLE_PREVIEWS, type PItem, type PSettings } from './pickleParadiseDefaults'

const DOC_ID = 'pickle_paradise'
const GREEN = '#0C831F'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? PICKLE_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

function normalise(raw: any): PItem[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `pickle_${i + 1}`),
    name: String(m?.name ?? ''),
    shortName: String(m?.shortName ?? ''),
    description: String(m?.description ?? ''),
    tag: String(m?.tag ?? ''),
    image: String(m?.image ?? ''),
    enabled: m?.enabled !== false,
    defaultVariant: Math.max(0, Math.round(num(m?.defaultVariant))),
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any) => ({ label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp) })) : [],
  }))
}

export function PickleParadiseManager() {
  const [items, setItems] = useState<PItem[]>(DEFAULT_PP_ITEMS)
  const [settings, setSettings] = useState<PSettings>(DEFAULT_PP_SETTINGS)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        const list = normalise(d.items)
        if (list.length) setItems(list)
        if (d.settings) setSettings({ ...DEFAULT_PP_SETTINGS, ...d.settings })
      } catch {
        toast.error('Could not load Pickle Paradise — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<PItem>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
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
      if (!x.name.trim()) return toast.error(`Pickle ${i + 1}: name is needed`)
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!x.variants.length || x.variants.some((v) => !v.label.trim() || v.price <= 0)) return toast.error(`${x.name}: every size needs a name and a price`)
    }
    if (!items.some((x) => x.enabled)) return toast.error('Keep at least one pickle switched on')
    setSaving(true)
    try {
      const clean = items.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim(), shortName: x.shortName.trim(), defaultVariant: Math.min(x.defaultVariant, x.variants.length - 1) }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, settings, items: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Pickle Paradise saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const shown = items.filter((x) => x.enabled)
  const c = items[open]
  const pv = shown.includes(c) ? c : shown[0]
  const pvV = pv?.variants[Math.min(pv.defaultVariant, pv.variants.length - 1)]
  const off = pvV && pvV.mrp > pvV.price ? Math.round((1 - pvV.price / pvV.mrp) * 100) : 0

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle>Pickle Paradise</CardTitle>
          <CardDescription>The pickles section on the home page. Customers tap a pickle (or the arrows) to see it — nothing changes on its own.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 8 default pickles?')) { setItems(DEFAULT_PP_ITEMS); setSettings(DEFAULT_PP_SETTINGS); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: GREEN }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* live app preview */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW</div>
              <div className="rounded-2xl p-4" style={{ background: '#F4FBF4' }}>
                {settings.enabled ? (
                  <>
                    <div className="flex items-center"><div className="flex-1 text-[17px] font-extrabold">{settings.title || 'Pickle Paradise'}</div><div className="text-xs font-bold" style={{ color: GREEN }}>{settings.viewAll || 'See all'} ›</div></div>
                    {settings.subtitle && <div className="text-[11px] text-stone-500">{settings.subtitle}</div>}
                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                      {shown.map((x) => {
                        const on = x === pv
                        return (
                          <button key={x.id} type="button" onClick={() => setOpen(items.indexOf(x))}
                            className="flex shrink-0 items-center gap-1.5 rounded-full border py-1 pl-1 pr-3 text-xs font-semibold"
                            style={on ? { background: GREEN, borderColor: GREEN, color: '#fff' } : { background: '#fff', borderColor: '#e8e2da', color: '#333' }}>
                            <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: on ? '#ffffff33' : '#f6f1ea' }}>{preview(x.image) && <img src={preview(x.image)} alt="" className="h-6 w-6 object-contain" />}</span>
                            {x.shortName || x.name}
                          </button>
                        )
                      })}
                    </div>
                    {pv && (
                      <div className="mt-3 overflow-hidden rounded-2xl border bg-white shadow-sm">
                        <div className="relative grid h-[170px] place-items-center" style={{ background: 'radial-gradient(circle at 50% 60%, #fff7ec, #fbe9d3)' }}>
                          {off > 0 && <span className="absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-extrabold text-white" style={{ background: '#D32F2F' }}>{off}% OFF</span>}
                          <span className="absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full bg-white shadow"><Heart className="h-3.5 w-3.5" style={{ color: GREEN }} /></span>
                          {preview(pv.image) ? <img src={preview(pv.image)} alt="" className="h-[140px] object-contain" /> : <span className="text-xs text-stone-400">No image</span>}
                          <span className="absolute left-2 top-[70px] grid h-7 w-7 place-items-center rounded-full bg-white shadow"><ChevronLeft className="h-4 w-4" /></span>
                          <span className="absolute right-2 top-[70px] grid h-7 w-7 place-items-center rounded-full bg-white shadow"><ChevronRight className="h-4 w-4" /></span>
                        </div>
                        <div className="p-3">
                          <div className="text-[15px] font-bold">{pv.name}</div>
                          <div className="text-[11px] text-stone-500">{pv.description}</div>
                          {pv.tag && <div className="mt-1.5 inline-block rounded-md px-2 py-0.5 text-[10px] font-semibold" style={{ background: '#FFF4D6', color: '#8A5A00' }}>☀ {pv.tag}</div>}
                          <div className="mt-2 flex gap-1.5">
                            {pv.variants.slice(0, 4).map((v, k) => {
                              const on = k === Math.min(pv.defaultVariant, pv.variants.length - 1)
                              return <span key={k} className="flex-1 rounded-lg border py-1 text-center text-[11px] font-semibold" style={on ? { borderColor: GREEN, color: GREEN, background: '#0C831F0f' } : { color: '#444' }}>{v.label}</span>
                            })}
                          </div>
                          <div className="mt-2.5 flex items-center">
                            <b className="text-[17px]">₹{pvV?.price}</b>{pvV && pvV.mrp > pvV.price && <s className="ml-1.5 text-[11px] text-stone-400">₹{pvV.mrp}</s>}
                            <span className="ml-auto rounded-lg px-5 py-1.5 text-xs font-bold text-white" style={{ background: GREEN }}>ADD</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-10 text-center text-sm text-stone-500">Section is hidden in the app</div>
                )}
              </div>

              {/* section texts */}
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Title</label><Input value={settings.title} onChange={(e) => setSettings({ ...settings, title: e.target.value })} placeholder="Pickle Paradise" /></div>
                <div><label className="text-xs font-semibold">Subtitle</label><Input value={settings.subtitle} onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })} placeholder="Handmade in small batches · sun-cured" /></div>
                <div><label className="text-xs font-semibold">"See all" text</label><Input value={settings.viewAll} onChange={(e) => setSettings({ ...settings, viewAll: e.target.value })} placeholder="See all" /></div>
              </div>
            </div>

            {/* list + editor */}
            <div className="space-y-4">
              <div className="space-y-1">
                {items.map((x, i) => (
                  <div key={x.id + i} onClick={() => setOpen(i)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-green-700 bg-green-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{i + 1}. {x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    <span className="text-xs text-stone-500">₹{x.variants[0]?.price ?? '-'}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={items.length >= 15}
                  onClick={() => { setItems((p) => [...p, { id: `pickle_${Date.now()}`, name: '', shortName: '', description: '', tag: '', image: '', enabled: true, defaultVariant: 0, variants: [{ label: '250 g', price: 0, mrp: 0 }] }]); setOpen(items.length) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add pickle
                </Button>
              </div>

              {c && (
                <div className="space-y-3 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">Pickle {open + 1}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={items.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this pickle'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="pickle_paradise" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && (
                        <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>
                      )}
                      <div className="mt-1 text-[10px] text-muted-foreground">Pickle in a brass bowl, background removed (transparent PNG) looks best.</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Bellam Avakaya" /></div>
                      <div><label className="text-xs font-semibold">Short name (pill)</label><Input value={c.shortName} onChange={(e) => upd(open, { shortName: e.target.value })} placeholder="Avakaya" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Short line</label><Input value={c.description} onChange={(e) => upd(open, { description: e.target.value })} placeholder="Raw mango in jaggery-chilli masala" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Tag (optional)</label><Input value={c.tag} onChange={(e) => upd(open, { tag: e.target.value })} placeholder="Sun-cured 21 days" /></div>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices <span className="font-normal text-muted-foreground">(● = selected by default, up to 4)</span></div>
                    {c.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-2 sm:grid-cols-[28px_1fr_100px_100px_40px] items-center gap-2">
                        <input type="radio" name={`ppdef-${open}`} checked={c.defaultVariant === k} onChange={() => upd(open, { defaultVariant: k })} />
                        <Input value={v.label} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="250 g" />
                        <Input type="number" value={v.price} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Input type="number" value={v.mrp} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, mrp: num(e.target.value) } : y)) })} placeholder="MRP ₹" />
                        <Button size="sm" variant="outline" className="text-red-700" disabled={c.variants.length <= 1} onClick={() => upd(open, { variants: c.variants.filter((_, j) => j !== k), defaultVariant: 0 })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.variants.length >= 4} onClick={() => upd(open, { variants: [...c.variants, { label: '', price: 0, mrp: 0 }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
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
