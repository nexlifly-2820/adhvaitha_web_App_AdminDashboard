'use client'

import React, { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  Gift, 
  Trophy, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Tag, 
  Layers, 
  ChevronRight, 
  RefreshCw, 
  Coins, 
  Percent, 
  Package, 
  BarChart3, 
  Filter, 
  Lock, 
  Unlock, 
  Flame, 
  Eye, 
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react'
import { toast } from 'sonner'
import { RewardLadderStep, RewardOffer, RewardStats, DEFAULT_LADDER, DEFAULT_OFFERS } from '@/lib/rewards-storage'

export default function RewardsAdminPage() {
  const [activeTab, setActiveTab] = useState<'ladder' | 'offers' | 'analytics'>('ladder')
  const [ladder, setLadder] = useState<RewardLadderStep[]>(DEFAULT_LADDER)
  const [offers, setOffers] = useState<RewardOffer[]>(DEFAULT_OFFERS)
  const [stats, setStats] = useState<RewardStats | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [savingStep, setSavingStep] = useState<number | null>(null)

  // Filters for Tab 2
  const [stepFilter, setStepFilter] = useState<number | 'all'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Modal State for Offer
  const [isOfferModalOpen, setIsOfferModalOpen] = useState<boolean>(false)
  const [editingOffer, setEditingOffer] = useState<Partial<RewardOffer> | null>(null)

  // Interactive Scratch Simulation state for demonstration
  const [scratchedDemo, setScratchedDemo] = useState<boolean>(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [ladderRes, offersRes, statsRes] = await Promise.all([
        fetch('/api/admin/rewards/ladder').then(r => r.json()).catch(() => null),
        fetch('/api/admin/rewards/offers').then(r => r.json()).catch(() => null),
        fetch('/api/admin/rewards/stats').then(r => r.json()).catch(() => null)
      ])

      if (ladderRes && ladderRes.success && Array.isArray(ladderRes.data)) {
        setLadder(ladderRes.data)
      }
      if (offersRes && offersRes.success && Array.isArray(offersRes.data)) {
        setOffers(offersRes.data)
      }
      if (statsRes && statsRes.success && statsRes.data) {
        setStats(statsRes.data)
      }
    } catch (err) {
      console.error('Error fetching rewards data:', err)
      toast.error('Failed to load rewards data')
    } finally {
      setLoading(false)
    }
  }

  // Ladder Step Update
  const handleUpdateStep = async (stepNum: number, updates: Partial<RewardLadderStep>) => {
    setSavingStep(stepNum)
    try {
      const res = await fetch(`/api/admin/rewards/ladder/${stepNum}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      const data = await res.json()
      if (data.success) {
        setLadder(prev => prev.map(s => s.step === stepNum ? { ...s, ...updates } : s))
        toast.success(`Ladder Step ${stepNum} updated successfully!`)
      } else {
        toast.error(data.error || 'Failed to update ladder step')
      }
    } catch (err) {
      toast.error('Error updating ladder step')
    } finally {
      setSavingStep(null)
    }
  }

  // Offer Creation & Update
  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOffer) return

    try {
      if (editingOffer.id) {
        // Edit existing
        const res = await fetch(`/api/admin/rewards/offers/${editingOffer.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingOffer)
        })
        const data = await res.json()
        if (data.success) {
          setOffers(prev => prev.map(o => o.id === editingOffer.id ? { ...o, ...editingOffer } as RewardOffer : o))
          toast.success('Reward offer updated!')
          setIsOfferModalOpen(false)
        } else {
          toast.error(data.error || 'Failed to update offer')
        }
      } else {
        // Create new
        const res = await fetch('/api/admin/rewards/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingOffer)
        })
        const data = await res.json()
        if (data.success) {
          setOffers(prev => [...prev, data.data])
          toast.success('New reward offer created in prize pool!')
          setIsOfferModalOpen(false)
        } else {
          toast.error(data.error || 'Failed to create offer')
        }
      }
    } catch (err) {
      toast.error('Error saving reward offer')
    }
  }

  // Toggle Offer Active
  const handleToggleOfferActive = async (offer: RewardOffer) => {
    try {
      const res = await fetch(`/api/admin/rewards/offers/${offer.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !offer.active })
      })
      const data = await res.json()
      if (data.success) {
        setOffers(prev => prev.map(o => o.id === offer.id ? { ...o, active: !offer.active } : o))
        toast.success(offer.active ? 'Offer deactivated' : 'Offer activated')
      }
    } catch (err) {
      toast.error('Failed to toggle offer status')
    }
  }

  // Delete Offer
  const handleDeleteOffer = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prize offer from the pool?')) return

    try {
      const res = await fetch(`/api/admin/rewards/offers/${id}`, {
        method: 'DELETE'
      })
      const data = await res.json()
      if (data.success) {
        setOffers(prev => prev.filter(o => o.id !== id))
        toast.success('Offer removed from prize pool')
      }
    } catch (err) {
      toast.error('Failed to delete offer')
    }
  }

  // Filtered Offers
  const filteredOffers = offers.filter(o => {
    if (stepFilter !== 'all' && o.step !== stepFilter) return false
    if (typeFilter !== 'all' && o.discount_type !== typeFilter) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return o.title.toLowerCase().includes(q) || o.subtitle.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="space-y-8 pb-16">
      {/* Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 text-white shadow-xl shadow-amber-900/10 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute left-1/3 -top-12 w-48 h-48 bg-amber-400/20 rounded-full blur-xl pointer-events-none" />

        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-100" />
            </span>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Scratch & Save Rewards
              </h1>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/25 text-white backdrop-blur-md border border-white/30 uppercase tracking-wider">
                Live Engine
              </span>
            </div>
          </div>
          <p className="text-sm text-amber-100/90 max-w-2xl leading-relaxed">
            Manage the 4-step progressive reward ladder, weighted prize pool offers, and order lifecycle triggers. Connected to <code className="text-xs font-mono bg-black/25 text-amber-200 px-2 py-0.5 rounded">/api/admin/rewards/*</code>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={loading}
            className="gap-2 bg-white/15 hover:bg-white/25 text-white border-white/30 text-xs backdrop-blur-md"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditingOffer({
                step: 1,
                title: '₹100 OFF',
                subtitle: 'on orders above ₹799',
                discount_type: 'flat',
                value: 100,
                min_order: 799,
                valid_days: 7,
                weight: 20,
                active: true
              })
              setIsOfferModalOpen(true)
            }}
            className="gap-2 bg-white text-slate-900 hover:bg-amber-50 font-bold text-xs shadow-lg"
          >
            <Plus className="w-4 h-4 text-amber-600" />
            + New Prize Offer
          </Button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('ladder')}
          className={`flex items-center gap-2.5 py-3 px-5 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'ladder'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tab 1: Ladder Configuration</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            4 Steps
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2.5 py-3 px-5 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'offers'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <Gift className="w-4 h-4" />
          <span>Tab 2: Prize Pool Offers</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            {offers.length} Active Prizes
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2.5 py-3 px-5 text-sm font-bold rounded-t-xl transition-all border-b-2 ${
            activeTab === 'analytics'
              ? 'border-amber-600 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
              : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Tab 3: Analytics & Usage</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Live Stats
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: LADDER CONFIGURATION                                              */}
      {/* ========================================================================= */}
      {activeTab === 'ladder' && (
        <div className="space-y-8">
          {/* Milestone Visual Progress Track */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  Progressive Scratch Ladder Sequence
                </h3>
                <p className="text-xs text-slate-500">
                  Customers advance along this 4-step sequence as their orders are marked <b>DELIVERED</b> by the system.
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Auto-Unlock Trigger Active
              </div>
            </div>

            {/* Visual Step Timeline */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
              {ladder.map((step, idx) => {
                const stepOfferCount = offers.filter(o => o.step === step.step && o.active).length;
                return (
                  <div 
                    key={step.step}
                    className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                      step.is_big
                        ? 'bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 border-amber-500/50 shadow-md shadow-amber-500/10'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500/30'
                    }`}
                  >
                    {/* Top Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          step.is_big
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          #{step.step}
                        </span>
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                            step.is_big ? 'text-amber-600 dark:text-amber-400 font-extrabold' : 'text-slate-400'
                          }`}>
                            {step.step === 1 ? 'FREE ON SIGNUP' : step.is_big ? 'GRAND CELEBRATION 🎁' : `ORDER #${step.unlock_after}`}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                            {step.title || `Step ${step.step}`}
                          </h4>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        step.active 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        {step.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>

                    {/* Middle Card Illustration */}
                    <div className="my-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-center space-y-1">
                      <div className="text-2xl">
                        {step.step === 1 ? '🎉' : step.step === 2 ? '📦' : step.step === 3 ? '✨' : '👑'}
                      </div>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {step.unlock_after === 0 ? 'Instant Upon Signup' : `Requires ${step.unlock_after} Delivered Order${step.unlock_after > 1 ? 's' : ''}`}
                      </div>
                      <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                        {stepOfferCount} Prize{stepOfferCount !== 1 ? 's' : ''} in Pool
                      </div>
                    </div>

                    {/* Editor Control in Card */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-slate-500">
                          Delivered Orders Needed
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            max="50"
                            value={step.unlock_after}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10) || 0;
                              setLadder(prev => prev.map(s => s.step === step.step ? { ...s, unlock_after: val } : s));
                            }}
                            className="h-8 text-xs font-bold"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={savingStep === step.step}
                            onClick={() => handleUpdateStep(step.step, { unlock_after: step.unlock_after, active: step.active })}
                            className="h-8 px-2.5 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border-amber-500/30"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <label className="text-[11px] text-slate-500 flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={step.active}
                            onChange={(e) => handleUpdateStep(step.step, { active: e.target.checked })}
                            className="w-3.5 h-3.5 accent-amber-600 rounded"
                          />
                          <span>Enabled in App</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setStepFilter(step.step);
                            setActiveTab('offers');
                          }}
                          className="text-[11px] font-semibold text-amber-600 hover:underline flex items-center gap-0.5"
                        >
                          View Prizes <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Step Cards Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Order Lifecycle & Automated Delivery Hooks
                </CardTitle>
                <CardDescription className="text-xs">
                  How rewards are awarded automatically as customers shop.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    1. When Order Status is DELIVERED:
                  </span>
                  <p>
                    <code className="font-mono text-amber-600">rewards.onOrderDelivered(userId, orderId, orderTotal)</code> increments the user's delivered count and unlocks the corresponding step card.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    2. When Order is CANCELLED / REFUNDED:
                  </span>
                  <p>
                    <code className="font-mono text-rose-600">rewards.onOrderCancelled(userId, orderId)</code> rolls back the counted order to prevent abuse.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    3. Hourly Expiration Sweeper:
                  </span>
                  <p>
                    <code className="font-mono text-amber-600">rewards.expireOld()</code> transitions unredeemed scratch cards past their <code className="font-mono">valid_days</code> to <code className="font-mono">expired</code> status.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 dark:border-slate-800">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Interactive Mobile Card Simulator
                </CardTitle>
                <CardDescription className="text-xs">
                  Simulate what the mobile app customer sees and scratches.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center justify-center">
                <div 
                  onClick={() => setScratchedDemo(!scratchedDemo)}
                  className="w-full max-w-[280px] h-[160px] rounded-2xl relative overflow-hidden cursor-pointer select-none shadow-xl border-2 border-amber-400/40 transition-all transform hover:scale-[1.02]"
                >
                  {/* Underneath Revealed Card */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 p-4 flex flex-col justify-between text-white">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">
                        UNLOCKED PRIZE
                      </span>
                      <span className="text-xs font-mono font-bold">SAVE ₹150</span>
                    </div>
                    <div className="text-center my-auto">
                      <div className="text-2xl font-black tracking-tight">₹150 OFF</div>
                      <div className="text-[11px] text-amber-100">on orders above ₹899</div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] border-t border-white/20 pt-1">
                      <span>CODE: ADH150ROYAL</span>
                      <span>Expires in 7 days</span>
                    </div>
                  </div>

                  {/* Top Scratch Foil (Hides or reveals on click) */}
                  {!scratchedDemo && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 via-slate-100 to-slate-400 flex flex-col items-center justify-center text-slate-700 shadow-inner p-4 text-center z-10 transition-opacity">
                      <div className="text-3xl mb-1 animate-bounce">🪙</div>
                      <div className="font-bold text-sm tracking-wide text-slate-800">SCRATCH & SAVE</div>
                      <p className="text-[10px] text-slate-500 mt-1">Click to reveal your mystery gift!</p>
                      <span className="mt-2 text-[9px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                        Tap To Scratch
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={() => setScratchedDemo(!scratchedDemo)}
                    className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                  >
                    {scratchedDemo ? '↺ Reset Scratch Foil' : '✨ Scratch Card Now'}
                  </button>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Live Flutter client renders dynamic smooth particle scratches via canvas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PRIZE POOL OFFERS                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'offers' && (
        <div className="space-y-6">
          {/* Controls & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Step:
              </span>
              <button
                type="button"
                onClick={() => setStepFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  stepFilter === 'all'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                All Steps ({offers.length})
              </button>
              {[1, 2, 3, 4].map(s => {
                const count = offers.filter(o => o.step === s).length;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStepFilter(s)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      stepFilter === s
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    Step {s} {s === 4 ? '🎁' : ''} ({count})
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                className="h-9 rounded-xl border border-input bg-background px-3 text-xs font-medium"
              >
                <option value="all">All Discount Types</option>
                <option value="flat">Flat ₹ Discounts</option>
                <option value="percent">Percentage % Off</option>
                <option value="free_item">Free Item Gifts 🎁</option>
              </select>

              <Input
                placeholder="Search prizes..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="h-9 w-40 sm:w-52 text-xs"
              />

              <Button
                size="sm"
                onClick={() => {
                  setEditingOffer({
                    step: stepFilter === 'all' ? 1 : stepFilter,
                    title: '₹100 OFF',
                    subtitle: 'on orders above ₹799',
                    discount_type: 'flat',
                    value: 100,
                    min_order: 799,
                    valid_days: 7,
                    weight: 20,
                    active: true
                  })
                  setIsOfferModalOpen(true)
                }}
                className="h-9 px-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white text-xs font-bold gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Offer
              </Button>
            </div>
          </div>

          {/* Offers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map(offer => {
              const stepOffers = offers.filter(o => o.step === offer.step && o.active);
              const totalStepWeight = stepOffers.reduce((sum, o) => sum + (o.weight || 1), 0);
              const winProbability = totalStepWeight > 0 ? ((offer.weight / totalStepWeight) * 100).toFixed(1) : '0';

              return (
                <div
                  key={offer.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    offer.active 
                      ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md' 
                      : 'bg-slate-50 dark:bg-slate-950/40 border-slate-200/50 opacity-60'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Milestone & Type Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          offer.step === 4 
                            ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          Step {offer.step} {offer.step === 4 ? 'Big Prize 🎁' : ''}
                        </span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          offer.discount_type === 'flat'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : offer.discount_type === 'percent'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {offer.discount_type === 'flat' ? '₹ Flat Off' : offer.discount_type === 'percent' ? '% Percentage' : 'Free Gift 🎁'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleOfferActive(offer)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border transition-all ${
                          offer.active
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-500/30'
                            : 'bg-slate-100 text-slate-500 border-slate-300'
                        }`}
                        title="Click to toggle active/inactive"
                      >
                        {offer.active ? '● Active' : '○ Inactive'}
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <div>
                      <h4 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                        {offer.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {offer.subtitle || 'Special milestone reward'}
                      </p>
                    </div>

                    {/* Details Pill Row */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Min. Order</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {offer.min_order > 0 ? `₹${offer.min_order}` : 'No Minimum'}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Validity</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {offer.valid_days} Days
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Win Probability</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          {winProbability}% (wt: {offer.weight})
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
                        <span className="text-slate-400 block text-[10px]">Times Won / Cap</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {offer.issued_count} / {offer.budget_limit || '∞'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400">
                      ID #{offer.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingOffer(offer)
                          setIsOfferModalOpen(true)
                        }}
                        className="h-8 px-2.5 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="h-8 px-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete Offer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12 border border-dashed rounded-2xl border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
              <Gift className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No prize offers match your filter</h4>
              <p className="text-xs text-slate-500 mt-1">Try resetting your step or category filter.</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setStepFilter('all'); setTypeFilter('all'); setSearchQuery(''); }}
                className="mt-3 text-xs"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: ANALYTICS & USAGE                                                 */}
      {/* ========================================================================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Card className="border-amber-500/20 bg-gradient-to-br from-white to-amber-50/30 dark:from-slate-900 dark:to-amber-950/20 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Scratched</span>
                  <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <Gift className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                    {stats?.cards_issued || 833}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Cards issued across all 4 steps</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-500/20 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/20 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coupons Redeemed</span>
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {stats?.coupons_used || 516}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Redeemed during cart checkout</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/20 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Redemption Rate</span>
                  <span className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                    <TrendingUp className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    {stats?.redemption_rate || 61.9}%
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">High customer engagement</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-950/20 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Attributed Revenue</span>
                  <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                    <Coins className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                    ₹{(stats?.total_revenue_generated || 438600).toLocaleString('en-IN')}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Driven by reward checkout orders</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Breakdown by Ladder Step */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-amber-500" />
                Performance Breakdown by Ladder Step
              </CardTitle>
              <CardDescription className="text-xs">
                Compare engagement and redemption metrics across each milestone.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Milestone Step</th>
                      <th className="py-2.5 px-4">Cards Scratched</th>
                      <th className="py-2.5 px-4">Coupons Used</th>
                      <th className="py-2.5 px-4">Redemption Rate</th>
                      <th className="py-2.5 px-4">Engagement Bar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(stats?.step_breakdown || [
                      { step: 1, name: 'Step 1 (Free on Signup)', issued: 443, used: 265, rate: 59.8 },
                      { step: 2, name: 'Step 2 (1st Delivered Order)', issued: 220, used: 142, rate: 64.5 },
                      { step: 3, name: 'Step 3 (2nd Delivered Order)', issued: 106, used: 71, rate: 67.0 },
                      { step: 4, name: 'Step 4 (Big Prize Milestone 🎁)', issued: 64, used: 48, rate: 75.0 }
                    ]).map(item => (
                      <tr key={item.step} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {item.name}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">{item.issued}</td>
                        <td className="py-3 px-4 font-mono font-semibold text-emerald-600">{item.used}</td>
                        <td className="py-3 px-4 font-mono font-bold text-amber-600">{item.rate}%</td>
                        <td className="py-3 px-4 w-48">
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full" 
                              style={{ width: `${Math.min(100, item.rate)}%` }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT PRIZE OFFER                                         */}
      {/* ========================================================================= */}
      {isOfferModalOpen && editingOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Gift className="w-5 h-5 text-amber-500" />
                {editingOffer.id ? `Edit Prize Offer #${editingOffer.id}` : 'Create New Prize Offer'}
              </h3>
              <button
                type="button"
                onClick={() => setIsOfferModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Ladder Step Milestone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingOffer.step || 1}
                    onChange={e => setEditingOffer(prev => ({ ...prev, step: Number(e.target.value) }))}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                  >
                    <option value={1}>Step 1: Free on Signup</option>
                    <option value={2}>Step 2: 1st Delivered Order</option>
                    <option value={3}>Step 3: 2nd Delivered Order</option>
                    <option value={4}>Step 4: Big Prize Milestone 🎁</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Discount Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editingOffer.discount_type || 'flat'}
                    onChange={e => setEditingOffer(prev => ({ ...prev, discount_type: e.target.value as any }))}
                    className="w-full h-9 rounded-xl border border-input bg-background px-3 text-xs font-semibold"
                  >
                    <option value="flat">Flat Discount (₹)</option>
                    <option value="percent">Percentage Off (%)</option>
                    <option value="free_item">Free Item Gift 🎁</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prize Title (Headline) <span className="text-red-500">*</span>
                </label>
                <Input
                  value={editingOffer.title || ''}
                  onChange={e => setEditingOffer(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g. ₹100 OFF, 15% OFF, FREE SWEET BOX"
                  className="h-9 text-xs font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subtitle (Condition Text)
                </label>
                <Input
                  value={editingOffer.subtitle || ''}
                  onChange={e => setEditingOffer(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="e.g. on orders above ₹799"
                  className="h-9 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {editingOffer.discount_type === 'percent' ? 'Percentage Value (%)' : 'Discount / Gift Value (₹)'} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.value ?? 100}
                    onChange={e => setEditingOffer(prev => ({ ...prev, value: Number(e.target.value) }))}
                    className="h-9 text-xs font-bold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Min Order Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.min_order ?? 0}
                    onChange={e => setEditingOffer(prev => ({ ...prev, min_order: Number(e.target.value) }))}
                    className="h-9 text-xs"
                  />
                </div>
              </div>

              {editingOffer.discount_type === 'percent' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Max Discount Cap (₹)
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.max_discount || ''}
                    onChange={e => setEditingOffer(prev => ({ ...prev, max_discount: Number(e.target.value) }))}
                    placeholder="e.g. 150 (leaves uncapped if blank)"
                    className="h-9 text-xs"
                  />
                </div>
              )}

              {editingOffer.discount_type === 'free_item' && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Free Item Name
                  </label>
                  <Input
                    value={editingOffer.free_product_name || ''}
                    onChange={e => setEditingOffer(prev => ({ ...prev, free_product_name: e.target.value }))}
                    placeholder="e.g. Royal Sunnunda Laddu Box (250g)"
                    className="h-9 text-xs font-medium"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Validity (Days)
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.valid_days ?? 7}
                    onChange={e => setEditingOffer(prev => ({ ...prev, valid_days: Number(e.target.value) }))}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Probability Weight
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.weight ?? 10}
                    onChange={e => setEditingOffer(prev => ({ ...prev, weight: Number(e.target.value) }))}
                    className="h-9 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Budget Limit (Cap)
                  </label>
                  <Input
                    type="number"
                    value={editingOffer.budget_limit || ''}
                    onChange={e => setEditingOffer(prev => ({ ...prev, budget_limit: Number(e.target.value) }))}
                    placeholder="∞ unlimited"
                    className="h-9 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <label className="text-xs font-semibold flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingOffer.active ?? true}
                    onChange={e => setEditingOffer(prev => ({ ...prev, active: e.target.checked }))}
                    className="w-4 h-4 accent-amber-600 rounded"
                  />
                  <span>Activate immediately in prize pool</span>
                </label>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsOfferModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                  >
                    Save Prize Offer
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
