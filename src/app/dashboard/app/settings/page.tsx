'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Settings, ShieldAlert, Smartphone, Save, AlertTriangle } from 'lucide-react'

export default function SystemSettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  // App Config State
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState('')
  const [forceUpdateEnabled, setForceUpdateEnabled] = useState(false)
  const [minAppVersion, setMinAppVersion] = useState('1.0.0')
  const [updateMessage, setUpdateMessage] = useState('')

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
        setMaintenanceMode(data.maintenanceMode || false)
        setMaintenanceMessage(data.maintenanceMessage || '')
        setForceUpdateEnabled(data.forceUpdateEnabled || false)
        setMinAppVersion(data.minAppVersion || '1.0.0')
        setUpdateMessage(data.updateMessage || '')
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
        maintenanceMode,
        maintenanceMessage,
        forceUpdateEnabled,
        minAppVersion,
        updateMessage,
        lastUpdated: new Date().toISOString()
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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            System Settings
          </h2>
          <p className="text-slate-500">Configure core application behaviors and overrides.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-slate-900 text-white hover:bg-slate-800">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Settings'}
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

            <div className={`space-y-3 transition-opacity duration-300 ${maintenanceMode ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <label className="text-sm font-semibold">Maintenance Message</label>
              <textarea 
                className="w-full min-h-[100px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500"
                placeholder="We are currently upgrading our servers. Please check back in 1 hour."
                value={maintenanceMessage}
                onChange={(e) => setMaintenanceMessage(e.target.value)}
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
        <Card className={`border-2 transition-colors ${forceUpdateEnabled ? 'border-blue-400 bg-blue-50/30' : 'border-transparent shadow-md'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Smartphone className="h-5 w-5" />
              Force App Update
            </CardTitle>
            <CardDescription>
              Force users on older versions to download the latest app update from the store.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-lg border">
              <div className="space-y-0.5">
                <label className="text-base font-bold text-slate-900 dark:text-white">Require Update</label>
                <p className="text-xs text-slate-500">Block older versions from functioning.</p>
              </div>
              <Switch 
                checked={forceUpdateEnabled} 
                onCheckedChange={setForceUpdateEnabled}
                className={forceUpdateEnabled ? 'bg-blue-600' : ''}
              />
            </div>

            <div className={`space-y-4 transition-opacity duration-300 ${forceUpdateEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Minimum Allowed Version</label>
                <Input 
                  placeholder="e.g. 1.2.0" 
                  value={minAppVersion}
                  onChange={(e) => setMinAppVersion(e.target.value)}
                  className="font-mono bg-white"
                />
                <p className="text-xs text-slate-500">Any app version lower than this will be forced to update.</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">Update Screen Message</label>
                <textarea 
                  className="w-full min-h-[80px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                  placeholder="A new version of the app is available with exciting features. Please update to continue."
                  value={updateMessage}
                  onChange={(e) => setUpdateMessage(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
