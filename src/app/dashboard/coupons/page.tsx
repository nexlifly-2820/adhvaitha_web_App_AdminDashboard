'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function CouponsPage() {
  const [couponName, setCouponName] = useState('')
  const [discountPercentage, setDiscountPercentage] = useState('')

  const handleReset = () => {
    setCouponName('')
    setDiscountPercentage('')
  }

  const handleGenerate = () => {
    // Logic to generate coupon
    console.log('Generating coupon:', { couponName, discountPercentage })
  }

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Coupons</h2>
      </div>

      <Card className="max-w-md shadow-md border-none">
        <CardHeader>
          <CardTitle>Create Coupon</CardTitle>
          <CardDescription>
            Generate a new discount coupon for your customers.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Coupon Name</label>
            <Input 
              value={couponName} 
              onChange={(e) => setCouponName(e.target.value)} 
              placeholder="Enter coupon name" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Discount Percentage (%)</label>
            <Input 
              type="number"
              value={discountPercentage} 
              onChange={(e) => setDiscountPercentage(e.target.value)} 
              placeholder="Enter discount percentage (e.g. 10)" 
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
          <Button variant="outline" onClick={handleReset}>Reset</Button>
          <Button onClick={handleGenerate}>Generate Coupon</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
