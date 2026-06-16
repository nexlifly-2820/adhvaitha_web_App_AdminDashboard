'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Search, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  adminReply?: string;
}

export default function CRMPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isResolving, setIsResolving] = useState(false)

  useEffect(() => {
    // Listen to "inquiries" collection
    const inquiriesRef = collection(db, 'inquiries')
    const unsubscribe = onSnapshot(inquiriesRef, (snapshot) => {
      const data: Inquiry[] = []
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() } as Inquiry)
      })
      
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setInquiries(data)
      setIsLoading(false)
      
      // Update selected inquiry if it was changed
      if (selectedInquiry) {
        const updated = data.find(i => i.id === selectedInquiry.id)
        if (updated) setSelectedInquiry(updated)
      }
    }, (error) => {
      console.error('Error fetching inquiries:', error)
      toast.error('Failed to load CRM data')
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleResolve = async () => {
    if (!selectedInquiry) return
    
    setIsResolving(true)
    try {
      const docRef = doc(db, 'inquiries', selectedInquiry.id)
      await updateDoc(docRef, {
        status: 'resolved',
        adminReply: replyText || 'Resolved without written reply.',
        resolvedAt: new Date().toISOString()
      })
      toast.success('Inquiry marked as resolved!')
      setReplyText('')
    } catch (error) {
      console.error('Error resolving inquiry:', error)
      toast.error('Failed to resolve inquiry')
    } finally {
      setIsResolving(false)
    }
  }

  const filteredInquiries = inquiries.filter(i => 
    i.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingCount = inquiries.filter(i => i.status === 'pending').length

  return (
    <div className="flex h-[calc(100vh-80px)] w-full gap-6 max-w-7xl mx-auto p-4 sm:p-6">
      {/* Left Panel: List */}
      <Card className="w-1/3 flex flex-col border-none shadow-md overflow-hidden">
        <CardHeader className="pb-4 bg-slate-50 border-b border-slate-100 dark:bg-slate-900/50 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              Customer CRM
            </CardTitle>
            {pendingCount > 0 && (
              <Badge variant="destructive" className="bg-red-500">{pendingCount} New</Badge>
            )}
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              type="search"
              placeholder="Search by name, email..."
              className="pl-9 bg-white dark:bg-slate-950"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">Loading inquiries...</div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No inquiries found.</div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInquiries.map((inquiry) => (
                <div 
                  key={inquiry.id} 
                  className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${selectedInquiry?.id === inquiry.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20 border-l-4 border-l-indigo-500' : 'border-l-4 border-l-transparent'}`}
                  onClick={() => setSelectedInquiry(inquiry)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm truncate max-w-[150px]">{inquiry.userName || 'Anonymous User'}</span>
                    <span className="text-[10px] text-slate-500">{new Date(inquiry.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 mb-2">{inquiry.message}</p>
                  <div className="flex items-center gap-2">
                    {inquiry.status === 'pending' ? (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none text-[10px] px-2 py-0">Pending</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 border-none text-[10px] px-2 py-0">Resolved</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Right Panel: Detail */}
      <Card className="flex-1 flex flex-col border-none shadow-md overflow-hidden bg-white dark:bg-slate-900 relative">
        {selectedInquiry ? (
          <>
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <h3 className="text-xl font-bold">{selectedInquiry.userName || 'Anonymous User'}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  <span>{selectedInquiry.email || 'No email'}</span>
                  <span>•</span>
                  <span>{selectedInquiry.phone || 'No phone'}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block mb-1">ID: {selectedInquiry.id}</span>
                {selectedInquiry.status === 'pending' ? (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50"><Clock className="w-3 h-3 mr-1" /> Awaiting Reply</Badge>
                ) : (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle className="w-3 h-3 mr-1" /> Resolved</Badge>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* User Message */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">Customer Message</span>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Admin Reply / Resolution */}
              {selectedInquiry.status === 'resolved' ? (
                <div className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/30 dark:bg-indigo-900/10 rounded-r-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" /> Resolution / Reply
                  </span>
                  <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                    {selectedInquiry.adminReply || "Issue was resolved by admin."}
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> Action Required
                  </span>
                  <p className="text-sm text-slate-500 mb-4">
                    Reply to the user directly via Email or Phone, then log the resolution here to close the ticket.
                  </p>
                  <textarea
                    placeholder="Log your resolution or reply here..."
                    className="w-full min-h-[120px] rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 mb-4"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleResolve} 
                      disabled={isResolving} 
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isResolving ? 'Resolving...' : 'Mark as Resolved'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="h-12 w-12 text-slate-200 dark:text-slate-800 mb-4" />
            <p>Select an inquiry to view details</p>
          </div>
        )}
      </Card>
    </div>
  )
}
