'use client'

// Snacks with a Story — newspaper-potlam cards on the home page. Tap a cone → it flips to its newspaper story.
// Saved to app settings doc "story_snacks" as { version: 2, settings, list }.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, Heart, Loader2, Newspaper, Plus, RotateCcw, Save, Trash2 } from 'lucide-react'
import { DEFAULT_SS_LIST, DEFAULT_SS_SETTINGS, SNACK_PREVIEWS, type SSettings, type SSnack } from './storySnacksDefaults'

const DOC_ID = 'story_snacks'
const MAROON = '#7A0F12'
const PAPER = '#EADBBE'
const INK = '#2E2418'
const isAsset = (u: string) => u.startsWith('assets/')
const preview = (u: string) => (isAsset(u) ? SNACK_PREVIEWS[u.split('/').pop() || ''] || '' : u)
const num = (v: any) => (typeof v === 'number' ? v : parseFloat(String(v)) || 0)
const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')

function normalise(raw: any): SSnack[] {
  if (!Array.isArray(raw)) return []
  return raw.map((m: any, i: number) => ({
    id: String(m?.id || slug(String(m?.name || '')) || `snack_${i + 1}`), name: String(m?.name ?? ''), image: String(m?.image ?? ''), story: String(m?.story ?? ''),
    since: String(m?.since ?? ''), place: String(m?.place ?? ''), quote: String(m?.quote ?? ''), price: num(m?.price), enabled: m?.enabled !== false,
    weights: Array.isArray(m?.weights) ? m.weights.map((w: any) => ({ label: String(w?.label ?? ''), price: num(w?.price) })) : [],
  }))
}

function Cone({ s, flipped }: { s: SSnack; flipped: boolean }) {
  if (flipped) {
    return (
      <div className="mx-auto w-[170px] rounded-md p-2.5 text-left shadow-lg" style={{ background: `radial-gradient(circle at 80% 10%, #F2E3C4, ${PAPER})`, color: INK }}>
        <div className="border-b-2 pb-0.5 text-center font-serif text-[11px] font-black tracking-wider" style={{ borderColor: INK }}>AMBHUJAKSHI</div>
        <div className="border-b py-0.5 text-center text-[7.5px] text-stone-600" style={{ borderColor: INK }}>{(s.place || 'VIJAYAWADA').toUpperCase()} · SINCE {s.since || '1982'} · ₹{s.weights[0]?.price ?? s.price}</div>
        <div className="mt-1.5 font-serif text-[16px] font-bold leading-tight">{s.name || 'Snack name'}</div>
        {preview(s.image) && <img src={preview(s.image)} alt="" className="mx-auto my-1.5 h-[64px] object-contain" style={{ filter: 'sepia(1)' }} />}
        <div className="line-clamp-6 text-[9px] leading-snug text-stone-700">{s.story || 'Made by hand in small batches, the way Amma learnt it from her mother.'}</div>
        <div className="mt-1 text-[12px] font-bold italic text-[#B0202F]">“{s.quote || 'Best with evening chai.'}”</div>
      </div>
    )
  }
  return (
    <div className="relative mx-auto h-[250px] w-[170px]">
      {preview(s.image) ? <img src={preview(s.image)} alt="" className="absolute left-1/2 top-0 z-[2] w-[150px] -translate-x-1/2 drop-shadow" /> : <div className="absolute left-1/2 top-6 z-[2] -translate-x-1/2 text-xs text-stone-400">No image</div>}
      <div className="absolute inset-x-[10px] bottom-1 top-[90px] z-[3] overflow-hidden" style={{ clipPath: 'polygon(0 0,100% 0,54% 100%,46% 100%)', background: 'linear-gradient(90deg,#d9cba9,#f3ead6 30%,#f8f1e1 50%,#ece1c8 72%,#cdbd99)' }}>
        <div className="mt-2 text-center font-serif text-[12px] font-bold text-[#4c3c25]/80">Ambhujakshi</div>
        <div className="mx-3 border-t border-[#4c3c25]/40" />
        <div className="px-4 pt-1 text-justify font-serif text-[6.5px] leading-tight text-[#4c3c25]/50">Amma&apos;s kitchen still smells of roasting dal at dawn. Small batches, packed warm, festival evenings and tea-time stories.</div>
      </div>
      <div className="absolute left-1/2 top-[150px] z-[4] -translate-x-1/2 -rotate-3 rounded px-3 py-1 font-serif text-[13px] font-bold shadow-md" style={{ background: MAROON, color: '#FFE7B8' }}>{s.name || 'Snack'}</div>
      <Heart className="absolute right-1 top-1 z-[5] h-4 w-4 text-[#B0202F]" />
    </div>
  )
}

export function StorySnacksManager() {
  const [list, setList] = useState<SSnack[]>(DEFAULT_SS_LIST)
  const [settings, setSettings] = useState<SSettings>(DEFAULT_SS_SETTINGS)
  const [open, setOpen] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const d = (await res.json())?.data || {}
        if (String(d.version) === '2') {
          const l = normalise(d.list)
          if (l.length) setList(l)
          if (d.settings) setSettings({ ...DEFAULT_SS_SETTINGS, ...d.settings })
        } else if (d.list) {
          toast.info('Showing the new Snacks with a Story defaults. Click Save to publish them.')
        }
      } catch {
        toast.error('Could not load Snacks with a Story — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const upd = (i: number, patch: Partial<SSnack>) => setList((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= list.length) return
    const n = [...list]; [n[i], n[j]] = [n[j], n[i]]; setList(n); setOpen(j)
  }

  const save = async () => {
    for (const [i, x] of list.entries()) {
      if (!x.name.trim()) return toast.error(`Snack ${i + 1}: name is needed`)
      if (!x.image) return toast.error(`${x.name}: image is needed`)
      if (!x.weights.length || x.weights.some((w) => !w.label.trim() || w.price <= 0)) return toast.error(`${x.name}: every size needs a name and a price`)
    }
    if (!list.some((x) => x.enabled)) return toast.error('Keep at least one snack switched on')
    setSaving(true)
    try {
      const clean = list.map((x) => ({ ...x, id: x.id || slug(x.name), name: x.name.trim(), price: x.weights[0]?.price ?? x.price }))
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 2, settings, list: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setList(clean)
      toast.success('Snacks with a Story saved — the app shows it on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const c = list[open]

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2"><Newspaper className="h-5 w-5 text-amber-700" /> Snacks with a Story</CardTitle>
          <CardDescription>Newspaper-cone cards on the home page. Customers tap a cone to flip it and read the story, pick a size and add to cart.</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => { if (confirm('Reset to the 4 default snacks?')) { setList(DEFAULT_SS_LIST); setSettings(DEFAULT_SS_SETTINGS); setOpen(0) } }}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} style={{ background: MAROON }} className="text-white hover:opacity-90">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div> : (
          <div className="grid w-full max-w-full gap-5 2xl:grid-cols-[380px_minmax(0,1fr)] [&>*]:min-w-0">
            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-muted-foreground">APP PREVIEW
                <button type="button" onClick={() => setFlipped((f) => !f)} className="rounded-full border px-2 py-0.5 text-[11px] font-semibold text-stone-700">{flipped ? '↺ Show cone' : '↻ Show story side'}</button></div>
              <div className="rounded-2xl p-4 text-center" style={{ background: 'radial-gradient(circle at 50% 0,#fbf3e3,#efdfc2)' }}>
                {!settings.enabled ? <div className="py-10 text-sm text-stone-500">Section is hidden in the app</div> : c && (
                  <>
                    {settings.tagline && <div className="mb-3 text-[10.5px] text-[#7A5A3A]">{settings.tagline}</div>}
                    <Cone s={c} flipped={flipped} />
                    <div className="mx-auto mt-3 w-[180px] rounded-2xl bg-[#FFF8EC] p-2 shadow">
                      <div className="flex gap-1">{c.weights.slice(0, 4).map((w, k) => <span key={k} className="flex-1 rounded-lg py-1 text-[10px] font-bold" style={k === 0 ? { background: MAROON, color: '#fff' } : { background: '#F7E6DA', color: MAROON }}>{w.label}</span>)}</div>
                      <div className="mt-2 flex items-center"><b className="text-[15px] text-[#3B1F0E]">₹{c.weights[0]?.price ?? c.price}</b><span className="ml-auto rounded-xl px-3 py-1 text-[11px] font-bold text-white" style={{ background: MAROON }}>🛒 Add</span></div>
                    </div>
                    <div className="mt-3 flex justify-center gap-2">
                      {list.map((x, i) => (
                        <button key={x.id + i} type="button" onClick={() => setOpen(i)} className={`h-11 w-11 rounded-full border-2 bg-white/70 p-0.5 ${i === open ? 'border-[#7A0F12]' : 'border-transparent'} ${x.enabled ? '' : 'opacity-40'}`}>
                          {preview(x.image) && <img src={preview(x.image)} alt="" className="h-full w-full object-contain" />}
                        </button>
                      ))}
                    </div>
                    <div className="mt-3"><span className="inline-block rounded-full px-4 py-1.5 text-[11px] font-bold text-[#FFE7B8]" style={{ background: MAROON }}>{settings.viewAll || 'View all snacks'} ›</span></div>
                  </>
                )}
              </div>
              <div className="mt-4 space-y-2 rounded-xl border p-3">
                <div className="flex items-center justify-between"><div className="text-sm font-bold">Section</div>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={settings.enabled} onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })} /> Show in app</label></div>
                <div><label className="text-xs font-semibold">Line above the cones</label><Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} /></div>
                <div><label className="text-xs font-semibold">Button text</label><Input value={settings.viewAll} onChange={(e) => setSettings({ ...settings, viewAll: e.target.value })} placeholder="View all snacks" /></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                {list.map((x, i) => (
                  <div key={x.id + i} onClick={() => setOpen(i)} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-sm ${open === i ? 'border-[#7A0F12] bg-rose-50' : ''} ${x.enabled ? '' : 'opacity-50'}`}>
                    {preview(x.image) && <img src={preview(x.image)} alt="" className="h-7 w-7 object-contain" />}
                    <span className="flex-1 truncate font-medium">{i + 1}. {x.name || 'Untitled'}</span>
                    {!x.enabled && <span className="text-[10px]">hidden</span>}
                    <span className="text-xs text-stone-500">₹{x.weights[0]?.price ?? '-'}</span>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="w-full" disabled={list.length >= 12}
                  onClick={() => { setList((p) => [...p, { id: `snack_${Date.now()}`, name: '', image: '', story: '', since: '', place: '', quote: '', price: 0, enabled: true, weights: [{ label: '250g', price: 0 }] }]); setOpen(list.length); setFlipped(false) }}>
                  <Plus className="mr-1 h-4 w-4" /> Add snack
                </Button>
              </div>

              {c && (
                <div className="space-y-3 rounded-xl border p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold">{c.name || 'New snack'}</div>
                    <label className="ml-2 flex items-center gap-2 text-sm"><input type="checkbox" checked={c.enabled} onChange={(e) => upd(open, { enabled: e.target.checked })} /> Show in app</label>
                    <div className="ml-auto flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => move(open, -1)} disabled={open === 0}><ArrowLeft className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" onClick={() => move(open, 1)} disabled={open === list.length - 1}><ArrowRight className="h-4 w-4" /></Button>
                      <Button size="sm" variant="outline" className="text-red-700" disabled={list.length <= 1} onClick={() => { if (confirm(`Delete "${c.name || 'this snack'}"?`)) { setList((p) => p.filter((_, k) => k !== open)); setOpen(0) } }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="grid gap-3 xl:grid-cols-[150px_minmax(0,1fr)]">
                    <div>
                      <ImageUpload value={isAsset(c.image) ? '' : c.image} onChange={(url) => upd(open, { image: url })} folder="story_snacks" maxSizeMB={3} />
                      {isAsset(c.image) && preview(c.image) && <div className="mt-1 flex items-center gap-2"><img src={preview(c.image)} alt="" className="h-12 w-12 object-contain" /><span className="text-[10px] text-muted-foreground">Built-in image</span></div>}
                      <div className="mt-1 text-[10px] text-muted-foreground">Snack heap only (no bowl), background removed — transparent PNG.</div>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Name</label><Input value={c.name} onChange={(e) => upd(open, { name: e.target.value })} placeholder="Kara Murukku" /></div>
                      <div><label className="text-xs font-semibold">Town (story page)</label><Input value={c.place} onChange={(e) => upd(open, { place: e.target.value })} placeholder="Vijayawada" /></div>
                      <div><label className="text-xs font-semibold">Since (year)</label><Input value={c.since} onChange={(e) => upd(open, { since: e.target.value })} placeholder="1985" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Story</label>
                        <textarea className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm" value={c.story} onFocus={() => setFlipped(true)} onChange={(e) => upd(open, { story: e.target.value })} placeholder="A crispy spiral snack made from rice flour…" /></div>
                      <div className="sm:col-span-2"><label className="text-xs font-semibold">Quote (red line at the bottom of the story)</label><Input value={c.quote} onFocus={() => setFlipped(true)} onChange={(e) => upd(open, { quote: e.target.value })} placeholder="Best with evening chai." /></div>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="text-xs font-bold">Sizes & prices <span className="font-normal text-muted-foreground">(first one is selected by default, up to 4)</span></div>
                    {c.weights.map((w, k) => (
                      <div key={k} className="grid grid-cols-2 xl:grid-cols-[1fr_120px_40px] gap-2">
                        <Input value={w.label} onChange={(e) => upd(open, { weights: c.weights.map((y, j) => (j === k ? { ...y, label: e.target.value } : y)) })} placeholder="250g" />
                        <Input type="number" value={w.price} onChange={(e) => upd(open, { weights: c.weights.map((y, j) => (j === k ? { ...y, price: num(e.target.value) } : y)) })} placeholder="Price ₹" />
                        <Button size="sm" variant="outline" className="text-red-700" disabled={c.weights.length <= 1} onClick={() => upd(open, { weights: c.weights.filter((_, j) => j !== k) })}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" disabled={c.weights.length >= 4} onClick={() => upd(open, { weights: [...c.weights, { label: '', price: 0 }] })}><Plus className="mr-1 h-4 w-4" /> Add size</Button>
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
