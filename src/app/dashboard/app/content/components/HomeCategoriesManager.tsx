'use client'

// Home Categories — the white category strip under the app's home header.
// Saved to app settings doc "home_categories" → the app reads it on launch.
import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ImageUpload } from '@/components/ImageUpload'
import { BUILT_IN_PREVIEWS } from './builtInPreviews'
import { toast } from 'sonner'
import { ArrowDown, ArrowUp, Loader2, Plus, RotateCcw, Save, Trash2, LayoutGrid } from 'lucide-react'

export type HomeCategory = {
  label: string
  image: string // R2 image URL, or a built-in app image path (assets/images/...)
  badge: string // e.g. "NEW" — empty for none
  target: string // shop | pickles | snacks | sweets | podis | combos | category:<name>
  enabled: boolean
}

export const TARGETS: { value: string; label: string }[] = [
  { value: 'shop', label: 'Shop tab (all categories)' },
  { value: 'pickles', label: 'Home → Pickles Paradise' },
  { value: 'snacks', label: 'Home → Snacks with Story' },
  { value: 'sweets', label: 'Home → Sweet Tooth Club' },
  { value: 'podis', label: 'Home → Spice It Up (podis)' },
  { value: 'combos', label: 'Home → Combos' },
  { value: 'offers', label: 'Home → Offers' },
  { value: 'pairing', label: 'Home → Art of Pairing' },
  { value: 'specials', label: 'Home → Specials' },
  { value: 'mostloved', label: 'Home → Most Loved' },
  { value: 'bestsellers', label: 'Home → Best Sellers' },
  { value: 'kadai', label: 'Home → Fresh from the Kadai' },
  { value: 'festive', label: 'Home → Festive' },
  { value: 'recent', label: 'Home → Recently Viewed' },
  { value: 'category', label: 'Product list of a category…' },
]

export const DEFAULT_HOME_CATEGORIES: HomeCategory[] = [
  { label: 'All', image: 'assets/images/cat_all.png', badge: '', target: 'shop', enabled: true },
  { label: 'Pickles', image: 'assets/images/cat_pickles.png', badge: '', target: 'pickles', enabled: true },
  { label: 'Snacks', image: 'assets/images/cat_snacks.png', badge: 'NEW', target: 'snacks', enabled: true },
  { label: 'Sweets', image: 'assets/images/cat_sweets.png', badge: '', target: 'sweets', enabled: true },
  { label: 'Podis', image: 'assets/images/cat_podis.png', badge: '', target: 'podis', enabled: true },
  { label: 'Combos', image: 'assets/images/cat_combos.png', badge: '', target: 'combos', enabled: true },
  { label: 'Offers', image: 'assets/images/cat_offers.png', badge: '', target: 'offers', enabled: true },
  { label: 'Pairing', image: 'assets/images/cat_pairing.png', badge: '', target: 'pairing', enabled: true },
  { label: 'Specials', image: 'assets/images/cat_specials.png', badge: '', target: 'specials', enabled: true },
  { label: 'Loved', image: 'assets/images/cat_loved.png', badge: '', target: 'mostloved', enabled: true },
  { label: 'Bestsellers', image: 'assets/images/cat_bestsellers.png', badge: '', target: 'bestsellers', enabled: true },
  { label: 'Kadai', image: 'assets/images/cat_kadai.png', badge: '', target: 'kadai', enabled: true },
  { label: 'Festive', image: 'assets/images/cat_festive.png', badge: '', target: 'festive', enabled: true },
  { label: 'Recent', image: 'assets/images/cat_recent.png', badge: '', target: 'recent', enabled: true },
]

const DOC_ID = 'home_categories'

export function HomeCategoriesManager() {
  const [items, setItems] = useState<HomeCategory[]>(DEFAULT_HOME_CATEGORIES)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${DOC_ID}`)
        const json = await res.json()
        const list = json?.data?.items
        if (Array.isArray(list) && list.length) {
          setItems(
            list.map((x: any) => ({
              label: String(x.label ?? ''),
              image: String(x.image ?? ''),
              badge: String(x.badge ?? ''),
              target: String(x.target ?? 'shop'),
              enabled: x.enabled !== false,
            })),
          )
        }
      } catch {
        toast.error('Could not load home categories — showing defaults')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const update = (i: number, patch: Partial<HomeCategory>) =>
    setItems((prev) => prev.map((x, k) => (k === i ? { ...x, ...patch } : x)))

  const move = (i: number, d: -1 | 1) =>
    setItems((prev) => {
      const j = i + d
      if (j < 0 || j >= prev.length) return prev
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })

  const save = async () => {
    const clean = items.filter((x) => x.label.trim())
    if (!clean.length) return toast.error('Add at least one category')
    if (clean.some((x) => !x.image.trim())) return toast.error('Every category needs an image')
    setSaving(true)
    try {
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: DOC_ID, items: clean, updatedAt: new Date().toISOString() }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || json?.success === false) throw new Error(json?.error || 'Save failed')
      toast.success('Home categories saved — the app shows them on next open')
    } catch (e: any) {
      toast.error(e?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const isAsset = (u: string) => u.startsWith('assets/')
  // built-in app images have a copy in the dashboard's /public/home_categories folder, so they can be previewed here
  // "emoji:🎁" = the app draws that emoji on the tile (upload a photo to replace it)
  const emojiSvg = (e: string) => `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><text x='32' y='44' font-size='38' text-anchor='middle'>${e}</text></svg>`)}`
  const previewSrc = (u: string) => (u.startsWith('emoji:') ? emojiSvg(u.slice(6)) : isAsset(u) ? BUILT_IN_PREVIEWS[u.split('/').pop() || ''] || `/home_categories/${u.split('/').pop()}` : u)
  const targetKind = (t: string) => (t.startsWith('category:') ? 'category' : t)

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5 text-rose-700" /> Home Categories
          </CardTitle>
          <CardDescription>
            The white strip under the app's home header. Change names, photos, badges, order and where each one goes.
            Best image: square cut-out PNG (transparent background), around 256×256.
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 sm:shrink-0">
          <Button
            variant="outline"
            onClick={() => {
              if (!confirm('Reset to the 6 default categories?')) return
              setItems(DEFAULT_HOME_CATEGORIES)
            }}
          >
            <RotateCcw className="h-4 w-4 mr-1" /> Defaults
          </Button>
          <Button onClick={save} disabled={saving || loading} className="bg-rose-700 hover:bg-rose-800">
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Save className="h-4 w-4 mr-1" />} Save
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        ) : (
          <>
            {/* live preview of the strip */}
            <div className="rounded-xl border bg-white p-3 overflow-x-auto">
              <div className="flex gap-4 min-w-max">
                {items.filter((x) => x.enabled && x.label.trim()).map((x, i) => (
                  <div key={i} className="w-14 text-center">
                    <div className="relative mx-auto h-12 w-12 rounded-xl bg-orange-50 p-1">
                      {x.image ? (
                        <img src={previewSrc(x.image)} alt="" className="h-full w-full object-contain" />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-[9px] text-orange-700">no image</div>
                      )}
                      {x.badge && (
                        <span className="absolute -top-1.5 -right-2 rounded bg-red-700 px-1 text-[7px] font-extrabold text-white">
                          {x.badge}
                        </span>
                      )}
                    </div>
                    <div className={`mt-1 text-[10px] font-semibold ${i === 0 ? 'text-red-700' : 'text-stone-600'}`}>{x.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {items.map((x, i) => (
              <div key={i} className={`rounded-xl border p-3 ${x.enabled ? '' : 'opacity-60'}`}>
                <div className="grid gap-3 md:grid-cols-[160px_minmax(0,1fr)]">
                  <div>
                    <ImageUpload value={isAsset(x.image) ? '' : x.image} onChange={(url) => update(i, { image: url })} folder="home_categories" maxSizeMB={2} />
                    {isAsset(x.image) && (
                      <div className="mt-2 flex items-center gap-2 rounded-lg border bg-orange-50 p-2">
                        <img src={previewSrc(x.image)} alt="" className="h-12 w-12 object-contain" />
                        <p className="text-[11px] text-muted-foreground">Current image (built into the app). Upload above to replace it.</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold">Label</label>
                        <Input value={x.label} maxLength={14} onChange={(e) => update(i, { label: e.target.value })} placeholder="Pickles" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold">Badge (optional)</label>
                        <Input value={x.badge} maxLength={5} onChange={(e) => update(i, { badge: e.target.value.toUpperCase() })} placeholder="NEW" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold">On tap, go to</label>
                        <select
                          className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                          value={targetKind(x.target)}
                          onChange={(e) => update(i, { target: e.target.value === 'category' ? `category:${x.label}` : e.target.value })}
                        >
                          {TARGETS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                      {targetKind(x.target) === 'category' && (
                        <div>
                          <label className="text-xs font-semibold">Category name</label>
                          <Input value={x.target.slice('category:'.length)} onChange={(e) => update(i, { target: `category:${e.target.value}` })} placeholder="Pickles" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={x.enabled} onChange={(e) => update(i, { enabled: e.target.checked })} /> Show in app
                      </label>
                      <div className="ml-auto flex gap-1">
                        <Button size="sm" variant="outline" onClick={() => move(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => move(i, 1)} disabled={i === items.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                        <Button size="sm" variant="outline" className="text-red-700" onClick={() => setItems((p) => p.filter((_, k) => k !== i))}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full"
              disabled={items.length >= 8}
              onClick={() => setItems((p) => [...p, { label: 'New', image: '', badge: '', target: 'shop', enabled: true }])}
            >
              <Plus className="h-4 w-4 mr-1" /> Add category {items.length >= 8 && '(max 8)'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
