'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { MessageSquare, Star, CheckCircle, XCircle, Clock, Trash2, RefreshCw, MapPin, Phone, ShieldCheck, Undo2 } from 'lucide-react'

interface Letter {
  id: string;
  name: string;
  city: string;
  phone: string;
  productId: string;
  productName: string;
  stars: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  verified: boolean;
  createdAt: string;
}

export default function ReviewsManagement() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)
  const [verifiedPick, setVerifiedPick] = useState<Record<string, boolean>>({})

  useEffect(() => { load() }, [])

  const load = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/dashboard/app/api/reviews', { cache: 'no-store' })
      const result = await res.json()
      if (result.success && Array.isArray(result.data)) setLetters(result.data)
      else toast.error('Failed to load letters')
    } catch {
      toast.error('Failed to load letters')
    } finally {
      setIsLoading(false)
    }
  }

  const act = async (l: Letter, body: Record<string, unknown>, ok: string) => {
    setBusy(l.id)
    try {
      const res = await fetch('/dashboard/app/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: l.id, ...body }),
      })
      const r = await res.json().catch(() => ({}))
      if (!res.ok || r.success === false) throw new Error(r.error || 'Failed')
      if (body.action === 'delete') setLetters((xs) => xs.filter((x) => x.id !== l.id))
      else setLetters((xs) => xs.map((x) => (x.id === l.id ? { ...x, status: body.status as Letter['status'], verified: typeof body.verified === 'boolean' ? body.verified : x.verified } : x)))
      toast.success(ok)
    } catch (e: any) {
      toast.error(e?.message || 'Something went wrong')
    } finally {
      setBusy(null)
    }
  }

  const pending = letters.filter((r) => r.status === 'pending' || !r.status)
  const approved = letters.filter((r) => r.status === 'approved')
  const rejected = letters.filter((r) => r.status === 'rejected')

  const LetterCard = ({ l }: { l: Letter }) => {
    const v = verifiedPick[l.id] ?? l.verified
    const isBusy = busy === l.id
    return (
      <Card className="border shadow-sm flex flex-col min-w-0">
        <CardContent className="flex-1 p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold text-slate-900 dark:text-slate-100 truncate">{l.name || 'Anonymous'}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-0.5">
                {l.city && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{l.city}</span>}
                {l.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{l.phone}</span>}
              </div>
            </div>
            <div className="flex shrink-0 text-amber-500">
              {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`h-4 w-4 ${i < (l.stars || 5) ? 'fill-current' : 'text-slate-200'}`} />)}
            </div>
          </div>
          {l.productName && <Badge variant="secondary" className="max-w-full truncate">{l.productName}</Badge>}
          <div className="bg-amber-50/60 dark:bg-slate-900 p-3 rounded-md border border-amber-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 text-sm whitespace-pre-wrap break-words">
            “{l.text}”
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{l.createdAt ? new Date(l.createdAt).toLocaleString() : ''}</span>
            {l.status === 'approved' && l.verified && <span className="flex items-center gap-1 text-green-700"><ShieldCheck className="h-3 w-3" />Verified buyer</span>}
          </div>
          {l.status !== 'approved' && (
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer select-none">
              <input type="checkbox" className="h-4 w-4 accent-green-600" checked={v} onChange={(e) => setVerifiedPick((m) => ({ ...m, [l.id]: e.target.checked }))} />
              Show “Verified Buyer” stamp (tick only if they really ordered)
            </label>
          )}
        </CardContent>
        <CardFooter className="p-3 border-t bg-slate-50/50 dark:bg-slate-900/50 flex flex-wrap gap-2">
          {l.status !== 'approved' && (
            <Button disabled={isBusy} onClick={() => act(l, { status: 'approved', verified: v }, 'Approved — now showing in the app')} className="flex-1 min-w-[120px] bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="h-4 w-4 mr-2" /> Approve
            </Button>
          )}
          {l.status === 'approved' && (
            <Button disabled={isBusy} variant="outline" onClick={() => act(l, { status: 'pending' }, 'Hidden from the app')} className="flex-1 min-w-[120px]">
              <Undo2 className="h-4 w-4 mr-2" /> Hide from app
            </Button>
          )}
          {l.status !== 'rejected' && (
            <Button disabled={isBusy} variant="destructive" onClick={() => act(l, { status: 'rejected' }, 'Rejected')} className="flex-1 min-w-[120px]">
              <XCircle className="h-4 w-4 mr-2" /> Reject
            </Button>
          )}
          {l.status === 'rejected' && (
            <Button disabled={isBusy} variant="outline" onClick={() => { if (confirm('Delete this letter permanently?')) act(l, { action: 'delete' }, 'Deleted') }} className="flex-1 min-w-[120px]">
              <Trash2 className="h-4 w-4 mr-2" /> Delete
            </Button>
          )}
        </CardFooter>
      </Card>
    )
  }

  const List = ({ items, empty }: { items: Letter[]; empty: string }) =>
    isLoading ? <p className="text-slate-500 py-12 text-center">Loading letters…</p>
      : items.length === 0 ? <div className="text-center py-12 px-4 text-slate-500 border rounded-lg border-dashed">{empty}</div>
      : <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">{items.map((l) => <LetterCard key={l.id} l={l} />)}</div>

  return (
    <div className="flex-1 space-y-6 p-3 sm:p-8 pt-6 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600 shrink-0" />
            Letters to Amma
          </h2>
          <p className="text-slate-500 text-sm">Letters customers send from the app’s “Write to Amma” button. Approved letters appear in the app’s Letters from Home section.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={isLoading}><RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Refresh</Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full sm:w-[420px] grid-cols-3 mb-6">
          <TabsTrigger value="pending">Pending{pending.length > 0 && <Badge variant="destructive" className="ml-1.5 h-5 min-w-5 px-1.5 rounded-full">{pending.length}</Badge>}</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approved.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejected.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending"><List items={pending} empty="No new letters waiting." /></TabsContent>
        <TabsContent value="approved"><List items={approved} empty="No approved letters yet." /></TabsContent>
        <TabsContent value="rejected"><List items={rejected} empty="No rejected letters." /></TabsContent>
      </Tabs>
    </div>
  )
}
