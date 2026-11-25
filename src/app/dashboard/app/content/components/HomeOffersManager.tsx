'use client'

// Home Offers — the colourful coupon cards on the app's home page ("Today's Offers").
// Saved to app settings doc "home_offers" → the app reads it on launch.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, Ticket } from 'lucide-react'

export type HomeOffer = {
  code: string
  label: string
  title: string
  sub: string
  emoji: string
  theme: string
  enabled: boolean
}

export const OFFER_THEMES: Record<string, [string, string, string]> = {
  red: ['#E8344A', '#B0122E', '#7A0A22'],
  green: ['#22B573', '#0E8A5A', '#065C3D'],
  orange: ['#FFB020', '#F07A12', '#C2410C'],
  purple: ['#8B5CF6', '#6D28D9', '#4C1D95'],
  blue: ['#38BDF8', '#2563EB', '#1E3A8A'],
  pink: ['#F472B6', '#DB2777', '#9D174D'],
  teal: ['#2DD4BF', '#0D9488', '#115E59'],
  gold: ['#F6D365', '#D9A441', '#8A5A10'],
}

export const DEFAULT_HOME_OFFERS: HomeOffer[] = [
  { code: 'FIRST30', label: 'WELCOME OFFER', title: '30% OFF', sub: 'On your first order above ₹500', emoji: '🎁', theme: 'red', enabled: true },
  { code: 'FREESHIP', label: 'FREE DELIVERY', title: '₹0 DELIVERY', sub: 'On all orders · no minimum', emoji: '🛵', theme: 'green', enabled: true },
  { code: 'PICKLE100', label: 'PICKLE SPECIAL', title: '₹100 OFF', sub: 'On pickle orders above ₹999', emoji: '🫙', theme: 'orange', enabled: true },
  { code: 'FESTIVE20', label: 'FESTIVE OFFER', title: '20% OFF', sub: 'On orders above ₹1500', emoji: '🪔', theme: 'purple', enabled: true },
]

const EMOJIS = ['🎁', '🛵', '🫙', '🪔', '🎉', '🔥', '💝', '🌶️', '🍬', '🥭', '⭐', '🏷️']
const DOC_ID = 'home_offers'

function OfferPreview({ o }: { o: HomeOffer }) {
  const g = OFFER_THEMES[o.theme] || OFFER_THEMES.red
  return (
    <div
      className="relative w-[290px] max-w-full shrink-0 overflow-hidden rounded-[22px] p-4 text-white"
      style={{ background: `linear-gradient(125deg, ${g[0]}, ${g[1]} 55%, ${g[2]})`, boxShadow: `0 14px 22px -14px ${g[2]}` }}
    >
      <div className="pointer-events-none absolute -right-10 -top-12 h-[170px] w-[170px] rounded-full" style={{ background: 'radial-gradient(rgba(255,255,255,.35), rgba(255,255,255,0) 70%)' }} />
      <div className="pointer-events-none absolute -bottom-8 right-4 h-[110px] w-[110px] rounded-full border-[14px] border-white/10" />
      <span className="absolute right-4 top-3 rotate-[10deg] text-[40px] drop-shadow">{o.emoji}</span>
      {o.label && <span className="relative inline-block rounded-md bg-white/20 px-2 py-0.5 text-[9px] font-bold tracking-[1.8px]">{o.label.toUpperCase()}</span>}
      <div className="relative mt-1.5 pr-14 text-[26px] font-black leading-tight">{(o.title || 'TITLE').toUpperCase()}</div>
      <div className="relative mt-0.5 truncate text-[11px] opacity-90">{o.sub}</div>
      <div className="relative mt-3 flex items-center justify-between">
        <span className="rounded-lg border-[1.5px] border-dashed border-white/75 bg-white/20 px-3 py-1.5 text-[11px] font-bold tracking-[1.6px]">{o.code || 'CODE'}</span>
        <span className="rounded-xl bg-white px-4 py-1.5 text-[11px] font-bold shadow" style={{ color: g[1] }}>Copy</span>
      </div>
    </div>
  )
}

export function HomeOffersManager() {
  const [items, setItems] = useState<HomeOffer[]>(DEFAULT_HOME_OFFERS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const json = await res.json()
        const list = json?.data?.items
        if (Array.isArray(list)) {
          setItems(
            list.map((x: any) => ({
              code: String(x.code ?? ''),
              label: String(x.label ?? ''),
              title: String(x.title ?? ''),
              sub: String(x.sub ?? ''),
              emoji: String(x.emoji ?? '🎁'),
              theme: OFFER_THEMES[x.theme] ? String(x.theme) : 'red',
              enabled: x.enabled !== false,
            })),
          )
        }
      } catch {
        toast.error('Could not load home offers — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const update = (i: number, patch: Partial<HomeOffer>) => setItems((p) => p.map((x, k) => (k === i ? { ...x, ...patch } : x)))
  const move = (i: number, d: -1 | 1) =>
    setItems((p) => {
      const j = i + d
      if (j < 0 || j >= p.length) return p
      const n = [...p]
      ;[n[i], n[j]] = [n[j], n[i]]
      return n
    })

  const save = async () => {
    const clean = items.map((x) => ({ ...x, code: x.code.trim().toUpperCase(), title: x.title.trim() }))
    if (clean.some((x) => !x.code || !x.title)) return toast.error('Every offer needs a code and a big title')
    setSaving(true)
    try {
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, items: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      setItems(clean)
      toast.success('Home offers saved — the app shows them on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-rose-700" /> Home Offers
          </CardTitle>
          <CardDescription>
            The colourful coupon cards on the app's home page. Customers tap <b>Copy</b> to copy the code and apply it at checkout.
            Note: the discount itself comes from the app's coupon rules — currently FIRST30, FREESHIP, PICKLE100 and FESTIVE20.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button variant="outline" onClick={() => confirm('Reset to the 4 default offers?') && setItems(DEFAULT_HOME_OFFERS)}>
            <RotateCcw className="mr-1 h-4 w-4" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-rose-700 hover:bg-rose-800">
            {saving ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Save className="mr-1 h-4 w-4" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border bg-[#FBF6EF] p-4">
              <div className="flex min-w-max gap-3">
                {items.filter((x) => x.enabled).map((x, i) => <OfferPreview key={i} o={x} />)}
                {!items.some((x) => x.enabled) && <p className="text-sm text-muted-foreground">No offers shown — the section is hidden in the app.</p>}
              </div>
            </div>

            {items.map((x, i) => (
              <div key={i} className={`rounded-xl border p-3 ${x.enabled ? '' : 'opacity-60'}`}>
                <div className="grid gap-2 md:grid-cols-3">
                  <div>
                    <label className="text-xs font-semibold">Coupon code</label>
                    <Input value={x.code} maxLength={16} onChange={(e) => update(i, { code: e.target.value.toUpperCase() })} placeholder="FIRST30" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Small label</label>
                    <Input value={x.label} maxLength={20} onChange={(e) => update(i, { label: e.target.value.toUpperCase() })} placeholder="WELCOME OFFER" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Big title</label>
                    <Input value={x.title} maxLength={14} onChange={(e) => update(i, { title: e.target.value })} placeholder="30% OFF" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold">Line under the title</label>
                    <Input value={x.sub} maxLength={40} onChange={(e) => update(i, { sub: e.target.value })} placeholder="On your first order above ₹500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold">Icon</label>
                    <div className="flex flex-wrap gap-1">
                      {EMOJIS.map((em) => (
                        <button key={em} type="button" onClick={() => update(i, { emoji: em })}
                          className={`h-8 w-8 rounded-md border text-lg ${x.emoji === em ? 'border-rose-600 bg-rose-50' : 'bg-white'}`}>{em}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold">Colour</span>
                  {Object.entries(OFFER_THEMES).map(([k, g]) => (
                    <button key={k} type="button" title={k} onClick={() => update(i, { theme: k })}
                      className={`h-7 w-7 rounded-full ${x.theme === k ? 'ring-2 ring-offset-2 ring-stone-800' : ''}`}
                      style={{ background: `linear-gradient(125deg, ${g[0]}, ${g[1]}, ${g[2]})` }} />
                  ))}
                  <label className="ml-4 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={x.enabled} onChange={(e) => update(i, { enabled: e.target.checked })} /> Show in app
                  </label>
                  <div className="ml-auto flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" className="text-red-700" onClick={() => setItems((p) => p.filter((_, k) => k !== i))}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" disabled={items.length >= 8}
              onClick={() => setItems((p) => [...p, { code: '', label: 'NEW OFFER', title: '', sub: '', emoji: '🎉', theme: 'blue', enabled: true }])}>
              <Plus className="mr-1 h-4 w-4" /> Add offer {items.length >= 8 && '(max 8)'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
