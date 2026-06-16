'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Bell, Send, Image as ImageIcon, Users, User, AlertCircle } from 'lucide-react'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase-app'
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

  const handleSendMarketing = async () => {
    if (!mktTitle.trim() || !mktBody.trim()) {
      toast.error('Title and Body are required')
      return
    }

    setIsSending(true)
    try {
      const sendMarketingNotification = httpsCallable(functions, 'sendMarketingNotification')
      await sendMarketingNotification({
        title: mktTitle,
        body: mktBody,
        imageUrl: mktImage
      })
      toast.success('Marketing notification sent to all app users!')
      setMktTitle('')
      setMktBody('')
      setMktImage('')
    } catch (error: any) {
      console.error('Error sending marketing notification:', error)
      toast.error(error?.message || 'Failed to send notification. Check Cloud Functions.')
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
      const sendCustomNotification = httpsCallable(functions, 'sendCustomNotification')
      await sendCustomNotification({
        userId: custUserId,
        title: custTitle,
        body: custBody,
        imageUrl: custImage
      })
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

      <Tabs defaultValue="marketing" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="marketing" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Marketing Broadcast
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <User className="h-4 w-4" /> Targeted Notification
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
          <Card className="border-none shadow-md overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
            <CardHeader>
              <CardTitle>Targeted Notification</CardTitle>
              <CardDescription>
                Send a specific message to a single user (e.g., apologies for delay, special custom reward).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Targeting Info</p>
                  <p>You need the exact User ID from the CRM or Orders page to send a targeted message.</p>
                </div>
              </div>

              <div className="max-w-xl space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">User ID</label>
                  <Input 
                    placeholder="e.g. usr_123abc..." 
                    value={custUserId}
                    onChange={(e) => setCustUserId(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Notification Title</label>
                  <Input 
                    placeholder="e.g. Sorry for the delay!" 
                    value={custTitle}
                    onChange={(e) => setCustTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Message Body</label>
                  <textarea 
                    placeholder="We've credited 500 coins to your wallet as an apology..." 
                    className="w-full min-h-[100px] rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                    value={custBody}
                    onChange={(e) => setCustBody(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Image Upload (Optional)</label>
                  <ImageUpload 
                    value={custImage}
                    onChange={(url) => setCustImage(url)}
                    folder="notifications"
                  />
                </div>
                <Button 
                  onClick={handleSendCustom} 
                  disabled={isSending} 
                  className="w-full bg-teal-600 hover:bg-teal-700 h-12 text-md mt-4"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSending ? 'Sending to User...' : 'Send Targeted Message'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
