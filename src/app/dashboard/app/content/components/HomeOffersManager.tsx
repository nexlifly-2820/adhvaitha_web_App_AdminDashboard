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
  type: 'percent' | 'flat' | 'freeship'
  value: number
  minOrder: number
  maxDiscount: number
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
  { code: 'FIRST30', label: 'WELCOME OFFER', title: '30% OFF', sub: 'On your first order above ₹500', emoji: '🎁', theme: 'red', type: 'percent', value: 30, minOrder: 500, maxDiscount: 0, enabled: true },
  { code: 'FREESHIP', label: 'FREE DELIVERY', title: '₹0 DELIVERY', sub: 'On all orders · no minimum', emoji: '🛵', theme: 'green', type: 'freeship', value: 0, minOrder: 0, maxDiscount: 0, enabled: true },
  { code: 'PICKLE100', label: 'PICKLE SPECIAL', title: '₹100 OFF', sub: 'On pickle orders above ₹999', emoji: '🫙', theme: 'orange', type: 'flat', value: 100, minOrder: 999, maxDiscount: 0, enabled: true },
  { code: 'FESTIVE20', label: 'FESTIVE OFFER', title: '20% OFF', sub: 'On orders above ₹1500', emoji: '🪔', theme: 'purple', type: 'percent', value: 20, minOrder: 1500, maxDiscount: 0, enabled: true },
]

// Old saved offers had no discount rule — read it from the title/sub text (same as the app does).
function guessRule(x: any): Pick<HomeOffer, 'type' | 'value' | 'minOrder' | 'maxDiscount'> {
  const t = String(x.title ?? '').toUpperCase()
  const code = String(x.code ?? '').toUpperCase()
  let type: HomeOffer['type'] = x.type === 'flat' || x.type === 'freeship' || x.type === 'percent' ? x.type : 'percent'
  let value = Number(x.value) || 0
  if (!x.type) {
    const pct = t.match(/(\d+)\s*%/)
    const rs = t.match(/₹\s*(\d+)/)
    if (pct) { type = 'percent'; value = Number(pct[1]) }
    else if (t.includes('DELIVERY') || t.includes('SHIP') || code.includes('SHIP') || (rs && rs[1] === '0')) type = 'freeship'
    else if (rs) { type = 'flat'; value = Number(rs[1]) }
  }
  let minOrder = Number(x.minOrder)
  if (x.minOrder == null || Number.isNaN(minOrder)) {
    const m = String(x.sub ?? '').match(/(?:above|over|min[a-z]*)\D{0,6}(\d[\d,]*)/i)
    minOrder = m ? Number(m[1].replace(/,/g, '')) : 0
  }
  return { type, value, minOrder, maxDiscount: Number(x.maxDiscount) || 0 }
}

export function ruleText(o: HomeOffer) {
  const min = o.minOrder > 0 ? ` on orders ≥ ₹${o.minOrder}` : ' · no minimum'
  if (o.type === 'freeship') return `Free delivery${min}`
  if (o.type === 'flat') return `₹${o.value} off${min}`
  return `${o.value}% off${o.maxDiscount > 0 ? ` (max ₹${o.maxDiscount})` : ''}${min}`
}

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
              ...guessRule(x),
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
    if (new Set(clean.map((x) => x.code)).size !== clean.length) return toast.error('Two offers have the same code')
    if (clean.some((x) => x.type !== 'freeship' && !(x.value > 0))) return toast.error('Set the discount amount for every offer')
    if (clean.some((x) => x.type === 'percent' && x.value > 90)) return toast.error('Percent discount must be 90% or less')
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
            The same coupons show in the app's <b>My Coupons</b> page and at checkout, using the discount rule you set on each one.
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
                  <div className="md:col-span-3 grid grid-cols-2 gap-2 rounded-lg border border-dashed border-rose-200 bg-rose-50/40 p-2 sm:grid-cols-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="text-xs font-semibold">Discount type</label>
                      <select value={x.type} onChange={(e) => update(i, { type: e.target.value as HomeOffer['type'] })}
                        className="h-9 w-full rounded-md border bg-white px-2 text-sm">
                        <option value="percent">% off</option>
                        <option value="flat">₹ flat off</option>
                        <option value="freeship">Free delivery</option>
                      </select>
                    </div>
                    {x.type !== 'freeship' && (
                      <div>
                        <label className="text-xs font-semibold">{x.type === 'percent' ? 'Percent (%)' : 'Amount (₹)'}</label>
                        <Input type="number" min={0} value={x.value} onChange={(e) => update(i, { value: Number(e.target.value) || 0 })} />
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-semibold">Min order (₹)</label>
                      <Input type="number" min={0} value={x.minOrder} onChange={(e) => update(i, { minOrder: Number(e.target.value) || 0 })} />
                    </div>
                    {x.type === 'percent' && (
                      <div>
                        <label className="text-xs font-semibold">Max discount (₹, 0 = none)</label>
                        <Input type="number" min={0} value={x.maxDiscount} onChange={(e) => update(i, { maxDiscount: Number(e.target.value) || 0 })} />
                      </div>
                    )}
                    <p className="col-span-2 text-xs text-rose-800 sm:col-span-4">Customer gets: <b>{ruleText(x)}</b></p>
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
              onClick={() => setItems((p) => [...p, { code: '', label: 'NEW OFFER', title: '', sub: '', emoji: '🎉', theme: 'blue', type: 'percent', value: 10, minOrder: 0, maxDiscount: 0, enabled: true }])}>
              <Plus className="mr-1 h-4 w-4" /> Add offer {items.length >= 8 && '(max 8)'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
