'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Save, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// App → bottom bar tabs (doc "bottom_nav"). The app reads it on start; no app update needed.
type Tab = { id: string; label: string; enabled: boolean }
const DOC_ID = 'bottom_nav'
const DEFAULTS: Tab[] = [
  { id: 'home', label: 'Home', enabled: true },
  { id: 'shop', label: 'Shop', enabled: true },
  { id: 'wishlist', label: 'Wishlist', enabled: true },
  { id: 'cart', label: 'Cart', enabled: true },
  { id: 'orders', label: 'Orders', enabled: true },
  { id: 'profile', label: 'Profile', enabled: true },
]
const ICON: Record<string, string> = { home: '🏠', shop: '▦', wishlist: '♡', cart: '🛒', orders: '🚚', profile: '👤' }

export default function BottomBarPage() {
  const [tabs, setTabs] = useState<Tab[]>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const r = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const j = await r.json()
        const items: any[] = Array.isArray(j?.data?.items) ? j.data.items : []
        if (items.length) {
          const known = items
            .filter((x) => DEFAULTS.some((d) => d.id === x?.id))
            .map((x) => ({ id: String(x.id), label: String(x.label || '').slice(0, 12) || DEFAULTS.find((d) => d.id === x.id)!.label, enabled: x.enabled !== false }))
          // any tab missing from the saved list is added at the end
          for (const d of DEFAULTS) if (!known.some((k) => k.id === d.id)) known.push({ ...d })
          setTabs(known)
        }
      } catch {}
      setLoading(false)
    })()
  }, [])

  const move = (i: number, d: number) => {
    const j = i + d
    if (j < 0 || j >= tabs.length) return
    const next = [...tabs]
    ;[next[i], next[j]] = [next[j], next[i]]
    setTabs(next)
  }
  const update = (i: number, patch: Partial<Tab>) => setTabs(tabs.map((t, k) => (k === i ? { ...t, ...patch } : t)))

  const save = async () => {
    const shown = tabs.filter((t) => t.enabled)
    if (!tabs.find((t) => t.id === 'home')?.enabled) return toast.error('Home must stay visible')
    if (shown.length < 3) return toast.error('Show at least 3 tabs')
    if (shown.length > 6) return toast.error('Show at most 6 tabs')
    if (tabs.some((t) => !t.label.trim())) return toast.error('Every tab needs a name')
    setSaving(true)
    try {
      const r = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, version: 1, items: tabs.map((t) => ({ ...t, label: t.label.trim() })) }),
      })
      if (!r.ok) throw new Error()
      toast.success('Bottom bar saved — the app shows it next time it opens')
    } catch {
      toast.error('Could not save')
    }
    setSaving(false)
  }

  const shown = tabs.filter((t) => t.enabled)

  return (
    <div className="mx-auto w-full max-w-2xl space-y-5 p-3 sm:p-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">App bottom bar</h1>
        <p className="text-sm text-slate-500">Order, rename and show/hide the tabs at the bottom of the app. Home always stays. 3–6 tabs.</p>
      </div>

      {/* live preview */}
      <div className="overflow-x-auto rounded-3xl border border-amber-200 bg-[#FFFBF2] p-3 shadow-sm">
        <div className="flex min-w-[320px] justify-between">
          {shown.map((t, i) => (
            <div key={t.id} className={`flex flex-1 flex-col items-center gap-1 text-[11px] font-semibold ${i === 0 ? 'text-white' : 'text-emerald-900'}`}>
              <span className={`flex h-10 w-10 items-center justify-center rounded-full text-base ${i === 0 ? 'bg-emerald-900 ring-2 ring-amber-300' : ''}`}>{ICON[t.id]}</span>
              <span className={i === 0 ? 'text-emerald-900' : ''}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="divide-y rounded-2xl border bg-white dark:bg-slate-900">
        {loading ? (
          <div className="p-6 text-center text-sm text-slate-500">Loading…</div>
        ) : (
          tabs.map((t, i) => (
            <div key={t.id} className="flex flex-wrap items-center gap-2 p-3 sm:flex-nowrap">
              <span className="w-6 text-center text-lg">{ICON[t.id]}</span>
              <Input value={t.label} maxLength={12} onChange={(e) => update(i, { label: e.target.value })} className="h-9 min-w-0 flex-1" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={t.enabled} disabled={t.id === 'home'} onChange={(e) => update(i, { enabled: e.target.checked })} />
                Show
              </label>
              <div className="flex gap-1">
                <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => move(i, -1)} disabled={i === 0} aria-label="Move up"><ArrowUp className="h-4 w-4" /></Button>
                <Button size="icon" variant="outline" className="h-9 w-9" onClick={() => move(i, 1)} disabled={i === tabs.length - 1} aria-label="Move down"><ArrowDown className="h-4 w-4" /></Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button variant="outline" onClick={() => setTabs(DEFAULTS)}><RotateCcw className="mr-2 h-4 w-4" />Reset to default</Button>
        <Button onClick={save} disabled={saving || loading}><Save className="mr-2 h-4 w-4" />{saving ? 'Saving…' : 'Save'}</Button>
      </div>
    </div>
  )
}
