'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { 
  Sparkles, 
  Save, 
  RefreshCw, 
  Mail, 
  Image as ImageIcon, 
  Trash2, 
  Plus, 
  Clock, 
  ShieldCheck, 
  Smartphone,
  Eye,
  CheckCircle2,
  Sliders,
  FileText
} from 'lucide-react'
import { ImageUpload } from '@/components/ImageUpload'

interface WallPhoto {
  id: number;
  url: string;
  sort: number;
}

export function LoginScreenManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'content' | 'otp' | 'wall' | 'preview'>('content')

  // Texts
  const [texts, setTexts] = useState({
    taglineStart: 'Great taste delivered at',
    taglineAccent: 'lowest rate',
    subtitle: 'Handmade in Andhra kitchens, packed with love',
    buttonText: 'Log in with email',
    sheetTitle: 'Welcome to our kitchen',
    cardTitle: 'Your kitchen details ✍️',
    otpSheetTitle: 'Almost there',
    otpTitle: 'Check your email ✉️',
    welcomeTitle: 'Namaskaram 🙏',
    welcomeLine: 'Your royal kitchen is ready',
    welcomeBack: 'Welcome back',
    privacyUrl: '',
    termsUrl: ''
  })

  // OTP Config
  const [otpLength, setOtpLength] = useState(6)
  const [resendSeconds, setResendSeconds] = useState(30)
  const [expiryMinutes, setExpiryMinutes] = useState(10)
  const [mailSubject, setMailSubject] = useState('Your AmbhuJakshi login code: {code}')
  const [mailBody, setMailBody] = useState("Namaskaram {name},\n\nYour login code is {code}. It is valid for {minutes} minutes.\n\n— AmbhuJakshi kitchen")

  // Wall Photos
  const [wallPhotos, setWallPhotos] = useState<WallPhoto[]>([])
  const [newWallUrl, setNewWallUrl] = useState('')
  const [isAddingPhoto, setIsAddingPhoto] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/admin/login-settings')
      if (res.ok) {
        const data = await res.json()
        if (data.texts) {
          setTexts(prev => ({ ...prev, ...data.texts }))
        }
        if (data.otp_length) setOtpLength(data.otp_length)
        if (data.resend_seconds) setResendSeconds(data.resend_seconds)
        if (data.expiry_minutes) setExpiryMinutes(data.expiry_minutes)
        if (data.mail_subject) setMailSubject(data.mail_subject)
        if (data.mail_body) setMailBody(data.mail_body)
        if (data.wall && Array.isArray(data.wall)) {
          setWallPhotos(data.wall)
        }
      }
    } catch (err) {
      console.error('Error fetching login settings:', err)
      toast.error('Failed to load login configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const payload = {
        texts,
        otp_length: Number(otpLength),
        resend_seconds: Number(resendSeconds),
        expiry_minutes: Number(expiryMinutes),
        mail_subject: mailSubject,
        mail_body: mailBody
      }

      const res = await fetch('/api/admin/login-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success('Login screen configuration updated!')
      } else {
        toast.error('Failed to save settings')
      }
    } catch (err: any) {
      toast.error('Network error: ' + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddWallPhoto = async () => {
    if (!newWallUrl.trim()) {
      toast.error('Please upload or enter a photo URL')
      return
    }

    setIsAddingPhoto(true)
    try {
      const res = await fetch('/api/admin/login-wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: newWallUrl.trim() })
      })

      if (res.ok) {
        const newPhoto = await res.json()
        setWallPhotos(prev => [...prev, newPhoto])
        setNewWallUrl('')
        toast.success('Photo added to moving wall')
      } else {
        toast.error('Failed to add wall photo')
      }
    } catch (err: any) {
      toast.error('Error adding photo: ' + err.message)
    } finally {
      setIsAddingPhoto(false)
    }
  }

  const handleDeleteWallPhoto = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/login-wall/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setWallPhotos(prev => prev.filter(p => p.id !== id))
        toast.success('Photo removed from wall')
      } else {
        toast.error('Failed to remove photo')
      }
    } catch (err: any) {
      toast.error('Error removing photo: ' + err.message)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 text-slate-500">
        <RefreshCw className="h-5 w-5 animate-spin mr-2" />
        Loading login screen settings...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
              Mobile App Experience
            </span>
            <span className="text-xs text-slate-500 font-mono">/api/auth/login-config</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-600" />
            Login Screen & Moving Wall Manager
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Customize the dynamic tagline texts, email OTP verification parameters, and background food gallery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchSettings} 
            className="text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Reload
          </Button>
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-md"
          >
            <Save className="h-3.5 w-3.5 mr-1.5" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* NAVIGATION PILLS */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'content'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="h-3.5 w-3.5 text-amber-600" />
          Taglines & Content
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('otp')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'otp'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="h-3.5 w-3.5 text-blue-600" />
          OTP & Email Template
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('wall')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'wall'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="h-3.5 w-3.5 text-emerald-600" />
          Moving Wall Photos ({wallPhotos.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
            activeTab === 'preview'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Smartphone className="h-3.5 w-3.5 text-rose-600" />
          Live App Preview
        </button>
      </div>

      {/* TAB 1: TAGLINES & CONTENT */}
      {activeTab === 'content' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Hero Tagline & Subtitle
              </CardTitle>
              <CardDescription className="text-xs">
                Shown prominently at the center of the mobile login screen over the moving food wall.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tagline Start (Regular Text)
                </label>
                <Input
                  value={texts.taglineStart}
                  onChange={e => setTexts({ ...texts, taglineStart: e.target.value })}
                  placeholder="e.g. Great taste delivered at"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                  Tagline Accent (Gold / Highlighted Text)
                </label>
                <Input
                  value={texts.taglineAccent}
                  onChange={e => setTexts({ ...texts, taglineAccent: e.target.value })}
                  placeholder="e.g. lowest rate"
                  className="border-amber-400/50 focus-visible:ring-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subtitle Line
                </label>
                <Input
                  value={texts.subtitle}
                  onChange={e => setTexts({ ...texts, subtitle: e.target.value })}
                  placeholder="e.g. Handmade in Andhra kitchens, packed with love"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Main Call-to-Action Button Label
                </label>
                <Input
                  value={texts.buttonText}
                  onChange={e => setTexts({ ...texts, buttonText: e.target.value })}
                  placeholder="e.g. Log in with email"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-600" />
                Bottom Sheet & Verification Headers
              </CardTitle>
              <CardDescription className="text-xs">
                Titles and micro-copy displayed inside the modal sheets when entering email and OTP.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Sheet Title</label>
                  <Input
                    value={texts.sheetTitle}
                    onChange={e => setTexts({ ...texts, sheetTitle: e.target.value })}
                    placeholder="Welcome to our kitchen"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Card Title</label>
                  <Input
                    value={texts.cardTitle}
                    onChange={e => setTexts({ ...texts, cardTitle: e.target.value })}
                    placeholder="Your kitchen details ✍️"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">OTP Sheet Title</label>
                  <Input
                    value={texts.otpSheetTitle}
                    onChange={e => setTexts({ ...texts, otpSheetTitle: e.target.value })}
                    placeholder="Almost there"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">OTP Header</label>
                  <Input
                    value={texts.otpTitle}
                    onChange={e => setTexts({ ...texts, otpTitle: e.target.value })}
                    placeholder="Check your email ✉️"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Welcome Greeting</label>
                  <Input
                    value={texts.welcomeTitle}
                    onChange={e => setTexts({ ...texts, welcomeTitle: e.target.value })}
                    placeholder="Namaskaram 🙏"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Welcome Line</label>
                  <Input
                    value={texts.welcomeLine}
                    onChange={e => setTexts({ ...texts, welcomeLine: e.target.value })}
                    placeholder="Your royal kitchen is ready"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500">Privacy Policy URL</label>
                  <Input
                    value={texts.privacyUrl}
                    onChange={e => setTexts({ ...texts, privacyUrl: e.target.value })}
                    placeholder="https://..."
                    className="text-xs"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-slate-500">Terms of Service URL</label>
                  <Input
                    value={texts.termsUrl}
                    onChange={e => setTexts({ ...texts, termsUrl: e.target.value })}
                    placeholder="https://..."
                    className="text-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: OTP & EMAIL TEMPLATE */}
      {activeTab === 'otp' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                Security & Expiry Parameters
              </CardTitle>
              <CardDescription className="text-xs">
                Control code length, resend timers, and expiration windows.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Code Length</label>
                  <Input
                    type="number"
                    min={4}
                    max={8}
                    value={otpLength}
                    onChange={e => setOtpLength(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400">Default: 6 digits</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Resend Delay (sec)</label>
                  <Input
                    type="number"
                    min={10}
                    max={120}
                    value={resendSeconds}
                    onChange={e => setResendSeconds(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400">Wait before retry</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Valid (Minutes)</label>
                  <Input
                    type="number"
                    min={2}
                    max={60}
                    value={expiryMinutes}
                    onChange={e => setExpiryMinutes(Number(e.target.value))}
                  />
                  <span className="text-[10px] text-slate-400">Code lifetime</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs text-blue-800 dark:text-blue-300 space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4" />
                  SHA-256 HMAC Hashing
                </div>
                <p className="text-[11px] leading-relaxed">
                  Plain OTP codes are never stored in the database. Only cryptographically hashed pairs 
                  <code>hash_hmac('sha256', email + ':' + code)</code> are saved with automatic expiration.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-600" />
                Customer Email Template
              </CardTitle>
              <CardDescription className="text-xs">
                Placeholders: <code>{'{code}'}</code>, <code>{'{name}'}</code>, <code>{'{minutes}'}</code>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Subject</label>
                <Input
                  value={mailSubject}
                  onChange={e => setMailSubject(e.target.value)}
                  placeholder="Your AmbhuJakshi login code: {code}"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Email Message Body</label>
                <textarea
                  rows={4}
                  value={mailBody}
                  onChange={e => setMailBody(e.target.value)}
                  className="w-full text-xs font-mono p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-visible:outline-none focus-visible:ring-1"
                  placeholder="Namaskaram {name}..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: MOVING WALL PHOTOS */}
      {activeTab === 'wall' && (
        <div className="space-y-6">
          <Card className="border shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-emerald-600" />
                  Moving Wall Background Photos
                </div>
                <span className="text-xs text-slate-500 font-mono font-normal">
                  {wallPhotos.length} images active
                </span>
              </CardTitle>
              <CardDescription className="text-xs">
                The mobile app renders these food photos in an animated vertical looping wall behind the dark amber glass overlay.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* UPLOAD / ADD FORM */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                  Add Photo to Moving Wall
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Upload Image File</label>
                    <ImageUpload
                      value={newWallUrl}
                      onChange={url => setNewWallUrl(url)}
                      folder="login_wall"
                    />
                  </div>
                  <div className="space-y-1.5 flex flex-col justify-end">
                    <label className="text-xs font-medium text-slate-600">Or Paste Image URL directly</label>
                    <div className="flex gap-2">
                      <Input
                        value={newWallUrl}
                        onChange={e => setNewWallUrl(e.target.value)}
                        placeholder="https://... or assets/images/..."
                        className="text-xs font-mono"
                      />
                      <Button
                        type="button"
                        onClick={handleAddWallPhoto}
                        disabled={isAddingPhoto || !newWallUrl.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 text-xs"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PHOTOS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {wallPhotos.map((photo, idx) => (
                  <div 
                    key={photo.id || idx}
                    className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 aspect-[3/4] shadow-sm hover:shadow-md transition-all"
                  >
                    <img 
                      src={photo.url} 
                      alt={`Wall photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <span className="text-[10px] font-mono text-white/80 bg-black/50 px-1.5 py-0.5 rounded w-fit">
                        #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteWallPhoto(photo.id)}
                        className="w-7 h-7 rounded-full bg-red-600/90 hover:bg-red-700 text-white flex items-center justify-center self-end shadow"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: LIVE MOBILE APP PREVIEW */}
      {activeTab === 'preview' && (
        <div className="flex justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="w-[320px] h-[640px] rounded-[40px] border-4 border-stone-800 bg-stone-900 shadow-2xl overflow-hidden relative flex flex-col">
            {/* PHONE NOTCH */}
            <div className="absolute top-2 inset-x-0 flex justify-center z-30">
              <div className="w-24 h-4 bg-black rounded-full" />
            </div>

            {/* BACKGROUND MOVING WALL SIMULATION */}
            <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2 opacity-40 blur-[1px]">
              {wallPhotos.slice(0, 4).map((p, i) => (
                <div key={i} className="rounded-lg overflow-hidden bg-stone-800 h-44">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* DARK AMBER VIGNETTE OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/95 z-10" />

            {/* FOREGROUND CONTENT */}
            <div className="relative z-20 flex-1 flex flex-col justify-between p-5 pt-16 text-center text-white">
              {/* TOP BRAND ICON */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mb-2 shadow-inner">
                  <Sparkles className="h-7 w-7 text-amber-300" />
                </div>
                <span className="text-[10px] tracking-widest font-black uppercase text-amber-200/80">
                  AMBHUJAKSHI
                </span>
              </div>

              {/* HERO TAGLINE */}
              <div className="space-y-2">
                <h2 className="text-xl font-black leading-tight tracking-tight">
                  <span>{texts.taglineStart} </span>
                  <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-4">
                    {texts.taglineAccent}
                  </span>
                </h2>
                <p className="text-[11px] text-stone-300 leading-snug px-2">
                  {texts.subtitle}
                </p>
              </div>

              {/* BOTTOM SHEET MOCKUP */}
              <div className="rounded-2xl bg-stone-900/95 border border-amber-500/20 p-4 shadow-xl backdrop-blur-md text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-300">
                    {texts.sheetTitle}
                  </span>
                  <span className="text-[9px] text-stone-400">
                    OTP: {otpLength} digits
                  </span>
                </div>
                <div className="h-8 rounded-lg bg-stone-800 border border-stone-700 px-3 flex items-center text-[10px] text-stone-400 font-mono">
                  guest@example.com
                </div>
                <button 
                  type="button"
                  className="w-full h-8 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center shadow"
                >
                  {texts.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
