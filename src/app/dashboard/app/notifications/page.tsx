'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, Send, Image as ImageIcon, Users, User, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from '@/components/ImageUpload'

export default function NotificationsPage() {
  const [isSending, setIsSending] = useState(false)
  
  // Marketing Notification State
  const [mktTitle, setMktTitle] = useState('')
  const [mktBody, setMktBody] = useState('')
  const [mktImage, setMktImage] = useState('')

  // Custom Notification State
  const [custUserId, setCustUserId] = useState('')
  const [custTitle, setCustTitle] = useState('')
  const [custBody, setCustBody] = useState('')
  const [custImage, setCustImage] = useState('')

  const [status, setStatus] = useState<{ ready: boolean; users: number; userIds: string[] } | null>(null)
  useEffect(() => {
    fetch('/dashboard/app/api/push/send', { cache: 'no-store' }).then((r) => r.json()).then(setStatus).catch(() => setStatus({ ready: false, users: 0, userIds: [] }))
  }, [])

  const push = async (body: Record<string, unknown>) => {
    const res = await fetch('/dashboard/app/api/push/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await res.json().catch(() => ({}))
    if (!res.ok || j?.success === false) throw new Error(j?.error || 'Failed to send notification')
    return j
  }

  const handleSendMarketing = async () => {
    if (!mktTitle.trim() || !mktBody.trim()) {
      toast.error('Title and Body are required')
      return
    }

    setIsSending(true)
    try {
      await push({ mode: 'all', title: mktTitle, body: mktBody, image: mktImage })
      toast.success('Marketing notification sent to all app users!')
      setMktTitle('')
      setMktBody('')
      setMktImage('')
    } catch (error: any) {
      console.error('Error sending marketing notification:', error)
      toast.error(error?.message || 'Failed to send notification.')
    } finally {
      setIsSending(false)
    }
  }

  const handleSendCustom = async () => {
    if (!custUserId.trim() || !custTitle.trim() || !custBody.trim()) {
      toast.error('User ID, Title, and Body are required')
      return
    }

    setIsSending(true)
    try {
      await push({ mode: 'user', userId: custUserId.trim(), title: custTitle, body: custBody, image: custImage })
      toast.success(`Notification sent to user ${custUserId}!`)
      setCustUserId('')
      setCustTitle('')
      setCustBody('')
      setCustImage('')
    } catch (error: any) {
      console.error('Error sending custom notification:', error)
      toast.error(error?.message || 'Failed to send notification.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bell className="h-6 w-6 text-blue-600" />
          Notification Hub
        </h2>
        <p className="text-slate-500">Engage your app users with push notifications.</p>
      </div>

      {status && (
        <div className={`rounded-xl border p-3 text-sm ${status.ready ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
          {status.ready
            ? <>Push is ready. <b>{status.users}</b> customer{status.users === 1 ? '' : 's'} can get personal notifications. “All users” reaches every phone that allowed notifications.</>
            : <>Push is not set up yet: add <b>FIREBASE_SERVICE_ACCOUNT</b> in Vercel → Settings → Environment Variables, then redeploy.</>}
        </div>
      )}

      <datalist id="push-user-ids">{(status?.userIds || []).map((u) => <option key={u} value={u} />)}</datalist>

      <Tabs defaultValue="marketing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Marketing Broadcast
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> Automatic
          </TabsTrigger>
        </TabsList>

        <TabsContent value="marketing">
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <CardHeader>
              <CardTitle>Broadcast to All Users</CardTitle>
              <CardDescription>
                Send promotional offers, new arrivals, or general announcements to everyone who has the app installed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Notification Title</label>
                    <Input 
                      placeholder="e.g. 🌶️ Spicy Weekend Sale!" 
                      value={mktTitle}
                      onChange={(e) => setMktTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Message Body</label>
                    <textarea 
                      placeholder="Get 20% off on all pickles this weekend..." 
                      className="w-full min-h-[100px] rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                      value={mktBody}
                      onChange={(e) => setMktBody(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Image Upload (Optional)</label>
                    <ImageUpload 
                      value={mktImage}
                      onChange={(url) => setMktImage(url)}
                      folder="notifications"
                    />
                    <p className="text-xs text-slate-500">Rich notifications with images get 40% higher click rates.</p>
                  </div>
                  <Button 
                    onClick={handleSendMarketing} 
                    disabled={isSending} 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-md mt-4"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isSending ? 'Sending Broadcast...' : 'Send Broadcast Now'}
                  </Button>
                </div>

                {/* Preview Box */}
                <div className="bg-slate-50 p-6 rounded-xl border flex flex-col items-center justify-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Device Preview</p>
                  <div className="w-[280px] bg-white rounded-[24px] shadow-xl border-4 border-slate-900 p-3 relative overflow-hidden">
                    <div className="w-20 h-4 bg-slate-900 absolute top-0 left-1/2 -translate-x-1/2 rounded-b-xl"></div>
                    <div className="mt-6 mb-2 flex items-center justify-between px-2">
                      <span className="text-[10px] font-medium text-slate-500">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-3 h-2 bg-slate-900 rounded-sm"></div>
                        <div className="w-3 h-2 bg-slate-900 rounded-sm"></div>
                      </div>
                    </div>
                    
                    {/* Mock Notification */}
                    <div className="mt-8 bg-slate-50/80 backdrop-blur-md rounded-2xl p-3 shadow-sm border border-slate-100">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                          <span className="text-[10px] text-white font-bold">A</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider">Adhvaitha App</span>
                        <span className="text-[10px] text-slate-400 ml-auto">now</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">
                        {mktTitle || 'Notification Title'}
                      </h4>
                      <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                        {mktBody || 'This is how your message will appear to users on their lock screen.'}
                      </p>
                      {mktImage && (
                        <div className="mt-3 aspect-video bg-slate-200 rounded-lg overflow-hidden border">
                          <img src={mktImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div className="h-24"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Automatic notifications</CardTitle>
              <CardDescription>These go out on their own — you don’t need to send them. Each shows the Ambhujakshi logo and the customer’s order number.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                ['Order placed 🎉', 'Right after a customer pays online or places a Cash on Delivery order.'],
                ['Order accepted 🍲 · Packed 📦 · On the way 🚚 · Out for delivery 🛵 · Delivered 💛 · Cancelled', 'When you change the order status in Orders.'],
                ['Your cart misses you 🛒', '2 hours after a customer adds items to the cart but does not order.'],
                ['Still thinking about …?', '24 hours later, if the cart is still not ordered. Both cart reminders stop as soon as they order or empty the cart.'],
              ].map(([t, d]) => (
                <div key={t} className="rounded-lg border p-3">
                  <div className="text-sm font-semibold">{t}</div>
                  <div className="text-xs text-slate-500">{d}</div>
                </div>
              ))}
              <p className="text-xs text-slate-500">Use the Marketing tab for offers and announcements to all customers.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
