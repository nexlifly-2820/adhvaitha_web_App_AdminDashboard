'use client'

// Art of Pairing — manages the home "Art of Pairing" card and the full pairing screen in the app.
// Saved to app settings doc "art_of_pairing"; the app reads it through /api/pairing.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Heart, Loader2, Plus, RotateCcw, Save, Trash2, UtensilsCrossed } from 'lucide-react'
import { PAIR_PREVIEWS } from './pairPreviews'

import { DEFAULT_SETTINGS, DEFAULT_COUPLES, type Side, type Couple, type Settings } from './pairDefaults'
const side = (name: string, bio: string, file: string, tags: string[]): Side => ({ productId: '', name, bio, image: file ? `assets/images/${file}` : '', tags })
const w = (p: number, m: number) => [{ label: '250 g each', price: p, mrp: m, aVariantId: '250g', bVariantId: '250g' }, { label: '500 g each', price: Math.round(p * 1.85), mrp: Math.round(m * 1.85), aVariantId: '500g', bVariantId: '500g' }]
const DOC_ID = 'art_of_pairing'

const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? PAIR_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)

function normalise(raw: any): Couple[] {
  if (!Array.isArray(raw)) return []
  const s = (x: any): Side => ({ productId: String(x?.productId ?? ''), name: String(x?.name ?? ''), bio: String(x?.bio ?? ''), image: String(x?.image ?? ''), tags: Array.isArray(x?.tags) ? x.tags.map(String) : [] })
  return raw.map((c: any, i: number) => ({
    id: String(c?.id ?? `c${i + 1}`), name: String(c?.name ?? ''), tag: String(c?.tag ?? ''), mealIcon: String(c?.mealIcon ?? ''), mealName: String(c?.mealName ?? ''),
    lovedText: String(c?.lovedText ?? ''), tip: String(c?.tip ?? ''), enabled: c?.enabled !== false, a: s(c?.a), b: s(c?.b),
    weights: Array.isArray(c?.weights) ? c.weights.map((x: any) => ({ label: String(x?.label ?? ''), price: num(x?.price), mrp: num(x?.mrp), aVariantId: String(x?.aVariantId ?? ''), bVariantId: String(x?.bVariantId ?? '') })) : [],
  }))
}

function SideEditor({ label, value, onChange }: { label: string; value: Side; onChange: (s: Side) => void }) {
  return (
    <div className="rounded-lg border bg-orange-50/40 p-3 space-y-2">
      <div className="text-xs font-bold text-rose-800">{label}</div>
      <div className="grid gap-2 sm:grid-cols-[120px_1fr]">
        <div>
          <ImageUpload value={isAsset(value.image) ? '' : value.image} onChange={(url) => onChange({ ...value, image: url })} folder="art_of_pairing" maxSizeMB={3} />
          {isAsset(value.image) && preview(value.image) && (
            <div className="mt-1 flex items-center gap-2">
              <img src={preview(value.image)} alt="" className="h-12 w-12 rounded-full bg-white object-cover" />
              <span className="text-[10px] text-muted-foreground">Built-in image</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Product name (e.g. Kara Murukku)" />
          <Input value={value.bio} onChange={(e) => onChange({ ...value, bio: e.target.value })} placeholder="Short line (e.g. Crispy spiral festive snack)" />
          <Input value={value.tags.join(', ')} onChange={(e) => onChange({ ...value, tags: e.target.value.split(',').map((t) => t.trim().toUpperCase()).filter(Boolean) })} placeholder="Tags, comma separated (CRISPY, SPICY)" />
        </div>
      </div>
    </div>
  )
}

export function ArtOfPairingManager() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [couples, setCouples] = useState<Couple[]>(DEFAULT_COUPLES)
  const [open, setOpen] = useState(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const json = await res.json()
        const d = json?.data || {}
        if (d.settings) setSettings({ ...DEFAULT_SETTINGS, ...d.settings })
        const cs = normalise(d.couples)
        if (cs.length) setCouples(cs)
      } catch {
        toast.error('Could not load Art of Pairing — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<Couple>) => setCouples((p) => p.map((c, k) => (k === i ? { ...c, ...patch } : c)))
  const move = (i: number, d: -1 | 1) =>
    setCouples((p) => {
      const j = i + d
      if (j < 0 || j >= p.length) return p
      const n = [...p]
      ;[n[i], n[j]] = [n[j], n[i]]
      setOpen(j)
      return n
    })

  const save = async () => {
    for (const [i, c] of couples.entries()) {
      if (!c.a.name || !c.b.name) return toast.error(`Couple ${i + 1}: both product names are needed`)
      if (!c.a.image || !c.b.image) return toast.error(`Couple ${i + 1}: both images are needed`)
      if (!c.weights.length || c.weights.some((x) => !x.label || x.price <= 0)) return toast.error(`Couple ${i + 1}: add at least one size with a price`)
    }
    setSaving(true)
    try {
      const clean = couples.map((c) => ({ ...c, name: c.name.trim() || `${c.a.name} + ${c.b.name}` }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, settings, couples: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setCouples(clean)
      toast.success('Art of Pairing saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const S = (k: keyof Settings, label: string, ph = '') => (
    <div>
      <label className="text-xs font-semibold">{label}</label>
      <Input value={String(settings[k])} onChange={(e) => setSettings({ ...settings, [k]: e.target.value })} placeholder={ph} />
    </div>
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2"><UtensilsCrossed className="h-5 w-5 text-rose-700" /> The Art of Pairing</CardTitle>
          <CardDescription>The home "Art of Pairing" card, the full pairing screen and the "More perfect couples" cards in the app.</CardDescription>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 6 default couples?')) { setSettings(DEFAULT_SETTINGS); setCouples(DEFAULT_COUPLES); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-rose-700 hover:bg-rose-800">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <>
            {/* section texts */}
            <div className="rounded-xl border p-3 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold">Section texts</div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show section in app</label>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {S('eyebrow', 'Small label', 'CURATED COMBOS')}
                {S('title', 'Title', 'The Art of')}
                {S('titleAccent', 'Title (script word)', 'Pairing')}
                {S('subtitle', 'Subtitle', 'Flavors meant to be experienced together')}
                {S('matchText', 'Match line', 'Made for each other')}
                {S('buttonText', 'Button text', "Meet Amma's perfect couples")}
                {S('explainText', 'Explain line', '2 jars Amma pairs together · one combo price')}
              </div>
            </div>

            {/* couples overview (like the app's "More perfect couples" cards) */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {couples.map((c, i) => (
                <button key={c.id + i} type="button" onClick={() => setOpen(i)}
                  className={`w-[150px] shrink-0 rounded-2xl border bg-white p-3 text-center shadow-sm ${open === i ? 'border-rose-600 ring-2 ring-rose-100' : ''} ${c.enabled ? '' : 'opacity-50'}`}>
                  <div className="relative mx-auto h-[64px] w-[112px]">
                    {[c.a, c.b].map((s, k) => (
                      <div key={k} className={`absolute top-0 h-[60px] w-[60px] overflow-hidden rounded-full border-[3px] border-white bg-orange-50 shadow ${k ? 'right-0 rotate-6' : 'left-0 -rotate-6'}`}>
                        {preview(s.image) && <img src={preview(s.image)} alt="" className="h-full w-full object-cover" />}
                      </div>
                    ))}
                    <span className="absolute left-1/2 top-5 grid h-6 w-6 -translate-x-1/2 place-items-center rounded-full bg-white shadow"><Heart className="h-3.5 w-3.5 fill-rose-600 text-rose-600" /></span>
                  </div>
                  {c.tag && <div className="mt-1 inline-block rounded bg-rose-50 px-1.5 text-[8px] font-bold tracking-wider text-rose-700">{c.tag}</div>}
                  <div className="mt-1 line-clamp-2 text-[12px] font-bold leading-tight">{c.a.name} + {c.b.name}</div>
                  {c.weights[0] && <div className="mt-1 text-[11px] font-bold text-rose-900">₹{c.weights[0].price} <s className="font-normal text-stone-400">₹{c.weights[0].mrp}</s></div>}
                </button>
              ))}
              <button type="button" disabled={couples.length >= 12}
                onClick={() => { setCouples((p) => [...p, { id: `c${Date.now()}`, name: '', tag: 'NEW PAIR', mealIcon: '🍽️', mealName: 'ANYTIME', lovedText: '', tip: '', enabled: true, a: side('', '', '', []), b: side('', '', '', []), weights: w(299, 349) }].map((c) => (c.a.image === 'assets/images/' ? { ...c, a: { ...c.a, image: '' }, b: { ...c.b, image: '' } } : c))); setOpen(couples.length) }}
                className="grid w-[150px] shrink-0 place-items-center rounded-2xl border-2 border-dashed text-sm text-muted-foreground">
                <span><Plus className="mx-auto h-5 w-5" /> Add couple</span>
              </button>
            </div>

            {/* editor for the selected couple */}
            {couples[open] && (() => {
              const c = couples[open]
              const i = open
              return (
                <div className="rounded-xl border p-4 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">Couple {i + 1}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(i, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(i, 1)} disabled={i === couples.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" onClick={() => { if (confirm('Delete this couple?')) { setCouples((p) => p.filter((_, k) => k !== i)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-2 md:grid-cols-3">
                    <div><label className="text-xs font-semibold">Couple name</label><Input value={c.name} onChange={(e) => upd(i, { name: e.target.value })} placeholder="Kara Murukku + Sunnunda Laddu" /></div>
                    <div><label className="text-xs font-semibold">Tag</label><Input value={c.tag} onChange={(e) => upd(i, { tag: e.target.value.toUpperCase() })} placeholder="SNACK & SWEET" /></div>
                    <div><label className="text-xs font-semibold">Loved-for line</label><Input value={c.lovedText} onChange={(e) => upd(i, { lovedText: e.target.value })} placeholder="The ultimate tea-time combo" /></div>
                    <div className="grid grid-cols-[70px_1fr] gap-2">
                      <div><label className="text-xs font-semibold">Meal icon</label><Input value={c.mealIcon} onChange={(e) => upd(i, { mealIcon: e.target.value })} placeholder="☕" /></div>
                      <div><label className="text-xs font-semibold">Best for</label><Input value={c.mealName} onChange={(e) => upd(i, { mealName: e.target.value.toUpperCase() })} placeholder="EVENING TEA" /></div>
                    </div>
                    <div className="md:col-span-2"><label className="text-xs font-semibold">Amma's tip</label><Input value={c.tip} onChange={(e) => upd(i, { tip: e.target.value })} placeholder="Crunchy murukku with chai, sunnunda to finish." /></div>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    <SideEditor label="Product A (left)" value={c.a} onChange={(s) => upd(i, { a: s })} />
                    <SideEditor label="Product B (right)" value={c.b} onChange={(s) => upd(i, { b: s })} />
                  </div>
                  <div className="rounded-lg border p-3 space-y-2">
                    <div className="text-xs font-bold">Sizes & combo prices</div>
                    {c.weights.map((x, k) => (
                      <div key={k} className="grid grid-cols-[1fr_110px_110px_40px] gap-2">
                        <Input value={x.label} onChange={(e) => upd(i, { weights: c.weights.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="250 g each" />
                        <Input type="number" value={x.price} onChange={(e) => upd(i, { weights: c.weights.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Input type="number" value={x.mrp} onChange={(e) => upd(i, { weights: c.weights.map((y, j) => (j === k ? { ...y, mrp: num(e.target.value) } : y)) })} placeholder="MRP ₹" />
                        <Button size="sm" variant="outline" className="text-red-700" disabled={c.weights.length <= 1} onClick={() => upd(i, { weights: c.weights.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" onClick={() => upd(i, { weights: [...c.weights, { label: '1 kg each', price: 0, mrp: 0, aVariantId: '1kg', bVariantId: '1kg' }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
                  </div>
                </div>
              )
            })()}
          </>
        )}
      </CardContent>
    </Card>
  )
}
