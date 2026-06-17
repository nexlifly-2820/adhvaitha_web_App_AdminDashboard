'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { MessageSquare, Star, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export default function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      const q = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      const fetchedReviews: Review[] = []
      snapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() } as Review)
      })
      setReviews(fetchedReviews)
    } catch (error: any) {
      // If index doesn't exist, it might throw an error. Fallback to unordered query.
      console.warn('Query failed, falling back to unordered fetch:', error)
      try {
        const fallbackSnapshot = await getDocs(collection(db, 'reviews'))
        const fetchedReviews: Review[] = []
        fallbackSnapshot.forEach((doc) => {
          fetchedReviews.push({ id: doc.id, ...doc.data() } as Review)
        })
        fetchedReviews.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        setReviews(fetchedReviews)
      } catch (err) {
        toast.error('Failed to load reviews')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const approveReview = async (reviewId: string) => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId)
      await updateDoc(reviewRef, { status: 'approved' })
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: 'approved' } : r))
      toast.success('Review approved!')
    } catch (error) {
      console.error('Error approving review:', error)
      toast.error('Failed to approve review')
    }
  }

  const rejectReview = async (reviewId: string) => {
    try {
      const reviewRef = doc(db, 'reviews', reviewId)
      await updateDoc(reviewRef, { status: 'rejected' })
      setReviews(reviews.map(r => r.id === reviewId ? { ...r, status: 'rejected' } : r))
      toast.success('Review rejected!')
    } catch (error) {
      console.error('Error rejecting review:', error)
      toast.error('Failed to reject review')
    }
  }

  const pendingReviews = reviews.filter(r => r.status === 'pending' || !r.status)
  const approvedReviews = reviews.filter(r => r.status === 'approved')
  const rejectedReviews = reviews.filter(r => r.status === 'rejected')

  const ReviewCard = ({ review }: { review: Review }) => (
    <Card className="border shadow-sm flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-indigo-600">{review.productId}</CardTitle>
            <CardDescription className="text-slate-500 font-medium mt-1">by {review.userName || 'Anonymous'}</CardDescription>
          </div>
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < (review.rating || 5) ? 'fill-current' : 'text-slate-200'}`} />
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800 italic text-slate-700 dark:text-slate-300 text-sm">
          "{review.comment}"
        </div>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          <Clock className="h-3 w-3" /> 
          {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : 'Unknown date'}
        </p>
      </CardContent>
      <CardFooter className="pt-2 border-t bg-slate-50/50 dark:bg-slate-900/50 flex gap-2">
        {review.status !== 'approved' && (
          <Button onClick={() => approveReview(review.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white">
            <CheckCircle className="h-4 w-4 mr-2" /> Approve
          </Button>
        )}
        {review.status !== 'rejected' && (
          <Button onClick={() => rejectReview(review.id)} variant="destructive" className="flex-1">
            <XCircle className="h-4 w-4 mr-2" /> Reject
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
            Reviews Management
          </h2>
          <p className="text-slate-500">Moderate customer feedback before it appears in your app.</p>
        </div>
        <Button variant="outline" onClick={fetchReviews}>Refresh List</Button>
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            {pendingReviews.length > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full">
                {pendingReviews.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending">
          {isLoading ? <p className="text-slate-500 py-12 text-center">Loading reviews...</p> : pendingReviews.length === 0 ? (
             <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">No pending reviews!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingReviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {isLoading ? <p className="text-slate-500 py-12 text-center">Loading reviews...</p> : approvedReviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">No approved reviews yet.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {approvedReviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected">
          {isLoading ? <p className="text-slate-500 py-12 text-center">Loading reviews...</p> : rejectedReviews.length === 0 ? (
            <div className="text-center py-12 text-slate-500 border rounded-lg border-dashed">No rejected reviews.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rejectedReviews.map(r => <ReviewCard key={r.id} review={r} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
