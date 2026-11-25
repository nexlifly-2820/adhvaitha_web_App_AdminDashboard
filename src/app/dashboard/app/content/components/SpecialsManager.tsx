'use client'

// Ambhujakshi Specials — the 6 tiles on the home page and the "Lotus Eye" detail screen they open.
// Saved to app settings doc "specials_light" as { list, settings }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, ChevronRight, Loader2, Plus, RotateCcw, Save, Sparkles, Trash2 } from 'lucide-react'
import { DEFAULT_SPECIALS, DEFAULT_SPECIALS_SETTINGS, SPECIAL_PREVIEWS, type Special, type SpecialsSettings } from './specialsDefaults'

const DOC_ID = 'specials_light'
const MAX = 6
const ICONS = ['sun', 'leaf', 'jar', 'recipe', 'fire', 'hand', 'ghee', 'heart', 'truck', 'star']
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? SPECIAL_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

function normalise(raw: any): Special[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `special_${i + 1}`),
    productId: String(m?.productId ?? ''),
    name: String(m?.name ?? '').replace(/\n/g, ' '),
    image: String(m?.image ?? ''),
    story: String(m?.story ?? ''),
    features: Array.isArray(m?.features) ? m.features.map((f: any) => ({ icon: String(f?.icon || 'star'), text: String(f?.text ?? '') })) : [],
    variants: Array.isArray(m?.variants) ? m.variants.map((v: any) => ({ id: String(v?.id || v?.label || ''), label: String(v?.label ?? ''), price: num(v?.price), mrp: num(v?.mrp) })) : [],
    defaultVariant: Math.max(0, Math.round(num(m?.defaultVariant))),
    enabled: m?.enabled !== false,
  }))
}

export function SpecialsManager() {
  const [items, setItems] = useState<Special[]>(DEFAULT_SPECIALS)
  const [settings, setSettings] = useState<SpecialsSettings>(DEFAULT_SPECIALS_SETTINGS)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        const list = normalise(d.list)
        // Old saves only had name + image; use them only if they carry the detail info too.
        if (list.length && list.every((x) => x.variants.length)) setItems(list)
        else if (list.length) toast.info('Old specials found without prices/details — showing the new 6 defaults. Click Save to use them.')
        if (d.settings) setSettings({ ...DEFAULT_SPECIALS_SETTINGS, ...d.settings })
      } catch {
        toast.error('Could not load specials — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<Special>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
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
      if (!x.name.trim()) return toast.error(`Tile ${i + 1}: name is needed`)
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!x.variants.length || x.variants.some((v) => !v.label || v.price <= 0)) return toast.error(`${x.name}: add at least one size with a price`)
    }
    if (!items.some((x) => x.enabled)) return toast.error('Keep at least one tile switched on')
    setSaving(true)
    try {
      const list = items.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim(), defaultVariant: Math.min(x.defaultVariant, x.variants.length - 1) }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, list, settings, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(list)
      toast.success('Ambhujakshi Specials saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const shown = items.filter((x) => x.enabled).slice(0, MAX)
  const c = items[open]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-amber-600" /> Ambhujakshi Specials</CardTitle>
          <CardDescription>The 6 tiles on the home page, and the Lotus Eye screen that opens when a tile is tapped. The app shows the first 6 switched-on tiles.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 6 default specials?')) { setItems(DEFAULT_SPECIALS); setSettings(DEFAULT_SPECIALS_SETTINGS); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-[#7A0F12] hover:bg-[#5e0b0e]">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] [&>*]:min-w-0">
            {/* live preview of the home tiles */}
            <div>
              <div className="mb-2 text-xs font-bold text-muted-foreground">APP PREVIEW — tap a tile to edit</div>
              <div className="rounded-2xl bg-gradient-to-b from-[#fdf3e4] to-[#fff8ec] p-3 shadow-inner">
                <div className="mb-2 text-center font-serif text-xl font-bold tracking-wide text-[#6B1020]">AMBHUJAKSHI<div className="text-[10px] tracking-[0.35em] text-[#8a6a3a]">SPECIALS</div></div>
                <div className="grid grid-cols-3 gap-2">
                  {shown.map((x) => {
                    const idx = items.indexOf(x)
                    return (
                      <button key={x.id + idx} type="button" onClick={() => setOpen(idx)}
                        className={`flex aspect-[1.3/1] flex-col rounded-xl bg-white p-1.5 text-left shadow-sm ${open === idx ? 'ring-2 ring-[#7A0F12]' : ''}`}>
                        <div className="flex flex-1 items-center justify-center overflow-hidden">
                          {preview(x.image) ? <img src={preview(x.image)} alt="" className="max-h-[52px] object-contain" /> : <span className="text-[9px] text-stone-400">No image</span>}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="flex-1 truncate font-serif text-[10px] font-bold text-[#6B1020]">{x.name || 'Untitled'}</span>
                          <span className="grid h-4 w-4 place-items-center rounded-full bg-[#7A0F12]"><ChevronRight className="h-3 w-3 text-white" /></span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
              {/* every tile, including hidden ones */}
              <div className="mt-3 space-y-1">
                {items.map((x, i) => (
                  <div key={x.id + i} onClick={() => setOpen(i)}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-[#7A0F12] bg-rose-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{i + 1}. {x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    {x.enabled && shown.indexOf(x) === -1 && <span className="text-[10px] text-amber-700">not shown (over 6)</span>}
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={items.length >= 12}
                  onClick={() => { setItems((p) => [...p, { id: `special_${Date.now()}`, productId: '', name: '', image: '', story: '', features: [], variants: [{ id: '250g', label: '250g', price: 0, mrp: 0 }], defaultVariant: 0, enabled: true }]); setOpen(items.length) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add special
                </Button>
              </div>
            </div>

            {/* editor */}
            <div className="space-y-4">
              {c && (
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">Tile {open + 1}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === items.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={items.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this tile'}"?`)) { setItems((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="specials_light" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && (
                        <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>
                      )}
                      <div className="mt-1 text-[10px] text-muted-foreground">Square photo of the product in a brass bowl on a plain white/cream background.</div>
                    </div>
                    <div className="space-y-2">
                      <div><label className="text-xs font-semibold">Name (on the tile)</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Gongura Pickle" /></div>
                      <div><label className="text-xs font-semibold">Story (Lotus Eye screen)</label>
                        <textarea className="min-h-[70px] w-full rounded-md border px-3 py-2 text-sm" value={c.story} onChange={(e) => upd(open, { story: e.target.value })} placeholder="Tangy sorrel leaves slow-cooked with garlic…" /></div>
                    </div>
                  </div>

                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="text-xs font-bold">Highlights (up to 3)</div>
                    {c.features.map((f, k) => (
                      <div key={k} className="grid grid-cols-2 sm:grid-cols-[110px_1fr_40px] gap-2">
                        <select className="rounded-md border px-2 text-sm" value={f.icon} onChange={(e) => upd(open, { features: c.features.map((y, j) => (j === k ? { ...y, icon: e.target.value } : y)) })}>
                          {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                        </select>
                        <Input value={f.text} onChange={(e) => upd(open, { features: c.features.map((y, j) => (j === k ? { ...y, text: e.target.value } : y)) })} placeholder="21 days sun-cured" />
                        <Button size="sm" variant="outline" className="text-red-700" onClick={() => upd(open, { features: c.features.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.features.length >= 3} onClick={() => upd(open, { features: [...c.features, { icon: 'star', text: '' }] })}><Plus className="mr-1 h-4 w-4" /> Add highlight</Button>
                  </div>

                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="text-xs font-bold">Sizes & prices <span className="font-normal text-muted-foreground">(● = selected by default)</span></div>
                    {c.variants.map((v, k) => (
                      <div key={k} className="grid grid-cols-2 sm:grid-cols-[28px_1fr_100px_100px_40px] items-center gap-2">
                        <input type="radio" name={`def-${open}`} checked={c.defaultVariant === k} onChange={() => upd(open, { defaultVariant: k })} />
                        <Input value={v.label} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, label: e.target.value, id: e.target.value.replace(/\s+/g, '') } : y)) })} placeholder="250g" />
                        <Input type="number" value={v.price} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Input type="number" value={v.mrp} onChange={(e) => upd(open, { variants: c.variants.map((y, j) => (j === k ? { ...y, mrp: num(e.target.value) } : y)) })} placeholder="MRP ₹" />
                        <Button size="sm" variant="outline" className="text-red-700" disabled={c.variants.length <= 1} onClick={() => upd(open, { variants: c.variants.filter((_, j) => j !== k), defaultVariant: 0 })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.variants.length >= 4} onClick={() => upd(open, { variants: [...c.variants, { id: '', label: '', price: 0, mrp: 0 }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
                  </div>
                </div>
              )}

              <div className="rounded-xl border p-4 space-y-2">
                <div className="text-sm font-bold">Lotus Eye screen texts</div>
                <div className="grid gap-2 md:grid-cols-2">
                  {([['title', 'Title', 'AMBHUJAKSHI'], ['subtitle', 'Subtitle', 'SPECIALS'], ['tagline', 'Tagline', 'Seen through the Lotus Eye'], ['tagText', 'Tag', "AMMA'S SPECIAL"], ['moreText', 'More label', 'MORE SPECIALS']] as const).map(([k, l, ph]) => (
                    <div key={k}><label className="text-xs font-semibold">{l}</label><Input value={String(settings[k])} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} placeholder={ph} /></div>
                  ))}
                  <label className="flex items-center gap-2 self-end text-sm"><input type="checkbox" checked={settings.showIntro} onChange={(e) => setSettings({ ...settings, showIntro: e.target.checked })} /> Play intro animation</label>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
