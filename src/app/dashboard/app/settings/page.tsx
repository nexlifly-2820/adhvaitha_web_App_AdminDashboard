'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Settings, ShieldAlert, Smartphone, Save, AlertTriangle, Truck } from 'lucide-react'

export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // App Config State (Targeting exact Firestore Guide keys)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [minAppVersion, setMinAppVersion] = useState('1.0.0')

  // Shipping Config State
  const [baseFee, setBaseFee] = useState(40)
  const [freeThreshold, setFreeThreshold] = useState(500)
  const [enableFreeDelivery, setEnableFreeDelivery] = useState(true)
  const [packingFee, setPackingFee] = useState(20)
  const [gstPercentage, setGstPercentage] = useState(12)

  useEffect(() => {
    fetchConfig()
  }, [])

  const fetchConfig = async () => {
    setIsLoading(true)
    try {
      const docRef = doc(db, 'app_data', 'config')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setMaintenanceMode(data.maintenance_mode || false)
        setMinAppVersion(data.min_version || '1.0.0')
      }

      const deliveryRef = doc(db, 'app_data', 'delivery_config')
      const deliverySnap = await getDoc(deliveryRef)
      if (deliverySnap.exists()) {
        const deliveryData = deliverySnap.data()
        setBaseFee(deliveryData.base_fee || 40)
        setPackingFee(deliveryData.packing_fee || 0)
        setGstPercentage(deliveryData.gst_percentage || 12)
        
        // If threshold is >= 99999, it means free delivery is disabled
        if (deliveryData.free_threshold >= 99999) {
          setEnableFreeDelivery(false)
          setFreeThreshold(500) // Keep a normal value in the input box for when they turn it back on
        } else {
          setEnableFreeDelivery(true)
          setFreeThreshold(deliveryData.free_threshold || 500)
        }
      }
    } catch (error) {
      console.error('Error fetching app config:', error)
      toast.error('Failed to load system settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const docRef = doc(db, 'app_data', 'config')
      await setDoc(docRef, {
        maintenance_mode: maintenanceMode,
        min_version: minAppVersion,
      }, { merge: true })

      const deliveryRef = doc(db, 'app_data', 'delivery_config')
      await setDoc(deliveryRef, {
        base_fee: Number(baseFee),
        packing_fee: Number(packingFee),
        gst_percentage: Number(gstPercentage),
        free_threshold: enableFreeDelivery ? Number(freeThreshold) : 99999
      }, { merge: true })

      toast.success('System settings saved successfully!')
    } catch (error) {
      console.error('Error saving app config:', error)
      toast.error('Failed to save settings. Check permissions.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center text-slate-500">Loading System Settings...</div>
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            Global App Control
          </h2>
          <p className="text-slate-500">Manage the core `app_data/config` settings.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white hover:bg-slate-800">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Config'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maintenance Mode Card */}
        <Card className={`border-2 transition-colors ${maintenanceMode ? 'border-red-400 bg-red-50/30' : 'border-transparent shadow-md'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <ShieldAlert className="h-5 w-5" />
              Maintenance Mode
            </CardTitle>
            <CardDescription>
              Block all users from accessing the app. Use during critical database migrations or severe bugs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border">
              <div className="space-y-0.5">
                <label className="text-base font-bold text-slate-900 dark:text-white">Enable Maintenance</label>
                <p className="text-xs text-slate-500">App will show the maintenance screen immediately.</p>
              </div>
              <Switch 
                checked={maintenanceMode} 
                onCheckedChange={setMaintenanceMode}
                className={maintenanceMode ? 'bg-red-600' : ''}
              />
            </div>
          </CardContent>
          {maintenanceMode && (
            <CardFooter className="bg-red-100 text-red-800 p-4 border-t border-red-200 rounded-b-lg flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <p className="text-xs font-bold uppercase tracking-wider">Warning: App is currently inaccessible to users.</p>
            </CardFooter>
          )}
        </Card>

        {/* Force Update Card */}
        <Card className="border-transparent shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Smartphone className="h-5 w-5" />
              Force App Update
            </CardTitle>
            <CardDescription>
              Specify the minimum allowed app version (e.g. 1.0.0).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Minimum Allowed Version</label>
              <Input 
                placeholder="e.g. 1.2.0" 
                value={minAppVersion}
                onChange={(e) => setMinAppVersion(e.target.value)}
                className="font-mono bg-white"
              />
              <p className="text-xs text-slate-500">Any app version lower than this string will be forced to update.</p>
            </div>
          </CardContent>
        </Card>

        {/* Financial & Shipping Configuration Card */}
        <Card className="border-transparent shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-indigo-600">
              <Truck className="h-5 w-5" />
              Financial & Shipping Configuration
            </CardTitle>
            <CardDescription>
              Manage delivery fees, packing charges, taxes, and free shipping thresholds. Changes instantly update on user carts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Standard Delivery Fee (₹)</label>
                <Input 
                  type="number"
                  value={baseFee}
                  onChange={(e) => setBaseFee(Number(e.target.value))}
                  className="bg-white"
                />
                <p className="text-xs text-slate-500">The base shipping cost applied to all orders.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Packing Charge (₹)</label>
                <Input 
                  type="number"
                  value={packingFee}
                  onChange={(e) => setPackingFee(Number(e.target.value))}
                  className="bg-white"
                />
                <p className="text-xs text-slate-500">Extra charge for packaging materials (e.g., bubble wrap).</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">GST Percentage (%)</label>
                <Input 
                  type="number"
                  value={gstPercentage}
                  onChange={(e) => setGstPercentage(Number(e.target.value))}
                  className="bg-white"
                />
                <p className="text-xs text-slate-500">Tax rate applied to the products.</p>
              </div>
            </div>

            <div className="space-y-4 border rounded-lg p-4 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-slate-900">Enable Free Delivery</label>
                  <p className="text-xs text-slate-500">Waive shipping fee on large orders.</p>
                </div>
                <Switch 
                  checked={enableFreeDelivery} 
                  onCheckedChange={setEnableFreeDelivery}
                  className={enableFreeDelivery ? 'bg-indigo-600' : ''}
                />
              </div>
              
              <div className={`space-y-2 transition-opacity ${enableFreeDelivery ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <label className="text-sm font-semibold">Free Delivery Threshold (₹)</label>
                <Input 
                  type="number"
                  value={freeThreshold}
                  onChange={(e) => setFreeThreshold(Number(e.target.value))}
                  className="bg-white"
                  disabled={!enableFreeDelivery}
                />
                <p className="text-xs text-slate-500">Orders above this amount will get free shipping.</p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  )
}
