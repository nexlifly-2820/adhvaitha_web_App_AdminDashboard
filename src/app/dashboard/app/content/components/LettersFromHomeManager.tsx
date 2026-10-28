'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Mail, 
  Heart, 
  Star, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Palette, 
  Smartphone, 
  Check, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  Clock, 
  Copy,
  CheckCircle2,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  BadgeCheck,
  ShoppingBag,
  ExternalLink,
  MessageSquareQuote
} from 'lucide-react';
import { toast } from 'sonner';

export interface ReviewLetterItem {
  id: string;
  productId: string;
  productName: string;
  text: string;
  name: string;
  meta: string;
  photoUrl: string;
  photoCaption: string;
  stars: number;
  verified: boolean;
  tagBg: string;
  tagFg: string;
}

export interface ReviewsSettings {
  enabled: boolean;
  eyebrow: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  seeAllLabel: string;
  writeLabel: string;
  ringText: string;
  wallTop: string;
  wallMid: string;
  wallBottom: string;
  accent: string;
  gold: string;
  autoplayMs: number;
}

export interface ReviewsSummary {
  average: number;
  count: number;
}

export interface ReviewsConfig {
  settings: ReviewsSettings;
  summary: ReviewsSummary;
  reviews: ReviewLetterItem[];
}

export const DEFAULT_REVIEWS: ReviewsConfig = {
  settings: {
    enabled: true,
    eyebrow: 'LETTERS FROM HOME',
    title: 'What families',
    titleAccent: 'write to Amma',
    subtitle: 'Real notes from real kitchens 💌',
    seeAllLabel: 'See all',
    writeLabel: '✍️ Write to Amma',
    ringText: '★ 1.2k REVIEWS ★ MADE WITH LOVE ★ ',
    wallTop: '#1F6B55',
    wallMid: '#0F3F33',
    wallBottom: '#082520',
    accent: '#FFD58A',
    gold: '#E9C46A',
    autoplayMs: 4200
  },
  summary: {
    average: 4.9,
    count: 1248
  },
  reviews: [
    {
      id: 'r1',
      productId: 'p1',
      productName: 'Avakaya Pickle',
      text: 'Dear Amma, the Avakaya pickle tastes exactly like my grandmother used to make in Vijayawada. It brought back so many childhood memories!',
      name: 'Siri M.',
      meta: 'Verified Purchaser · Hyderabad',
      photoUrl: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      photoCaption: 'Opened today! 🏺',
      stars: 5,
      verified: true,
      tagBg: '#FDE8EA',
      tagFg: '#C2273A'
    },
    {
      id: 'r2',
      productId: 'p2',
      productName: 'Idli Karam Podi',
      text: 'The aroma of roasted chana dal and garlic when I opened the pouch was amazing. Eating hot idlis with ghee and this Podi every morning!',
      name: 'Rajesh V.',
      meta: 'Verified Purchaser · Bengaluru',
      photoUrl: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
      photoCaption: 'Perfect breakfast 😋',
      stars: 5,
      verified: true,
      tagBg: '#FFF0E0',
      tagFg: '#D2691E'
    },
    {
      id: 'r3',
      productId: 'p3',
      productName: 'Sunnunda Laddu',
      text: 'The pure cow ghee aroma and crunch of roasted urad dal laddus are unmatchable. My children finish the whole box in two days!',
      name: 'Ananya K.',
      meta: 'Verified Purchaser · Chennai',
      photoUrl: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
      photoCaption: 'Kids loved it! 🎁',
      stars: 5,
      verified: true,
      tagBg: '#FEF3C7',
      tagFg: '#B45309'
    },
    {
      id: 'r4',
      productId: 'p4',
      productName: 'Gongura Pachadi',
      text: 'Being away from Andhra for 15 years, getting authentic sour & spicy Gongura Pachadi with hot steamed rice and raw onion is pure heavenly bliss.',
      name: 'Venkatesh P.',
      meta: 'Verified Purchaser · Mumbai',
      photoUrl: 'assets/images/banner_1.jpg',
      photoCaption: 'Tastes like home 🌿',
      stars: 5,
      verified: true,
      tagBg: '#DCFCE7',
      tagFg: '#166534'
    },
    {
      id: 'r5',
      productId: 'p5',
      productName: 'Kara Murukku',
      text: 'Super crispy, perfect spiciness, and not greasy at all! The handmade spiral texture is crisp and pairs so well with evening filter coffee.',
      name: 'Kavitha R.',
      meta: 'Verified Purchaser · Visakhapatnam',
      photoUrl: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
      photoCaption: 'Tea time crunch ☕',
      stars: 5,
      verified: true,
      tagBg: '#FEF9C3',
      tagFg: '#854D0E'
    }
  ]
};

const WALL_THEME_PRESETS = [
  {
    name: "Amma's Emerald Wall",
    wallTop: '#1F6B55',
    wallMid: '#0F3F33',
    wallBottom: '#082520',
    accent: '#FFD58A',
    gold: '#E9C46A',
    preview: 'from-[#1F6B55] via-[#0F3F33] to-[#082520]'
  },
  {
    name: 'Royal Heritage Burgundy',
    wallTop: '#661122',
    wallMid: '#3D0813',
    wallBottom: '#210207',
    accent: '#FFD58A',
    gold: '#E9C46A',
    preview: 'from-[#661122] via-[#3D0813] to-[#210207]'
  },
  {
    name: 'Terracotta Andhra Kitchen',
    wallTop: '#8B3A1E',
    wallMid: '#58200E',
    wallBottom: '#300E05',
    accent: '#FFE4B5',
    gold: '#E9C46A',
    preview: 'from-[#8B3A1E] via-[#58200E] to-[#300E05]'
  },
  {
    name: 'Midnight Temple Indigo',
    wallTop: '#1A2C3D',
    wallMid: '#0E1B27',
    wallBottom: '#050A0F',
    accent: '#9FE7FF',
    gold: '#E9C46A',
    preview: 'from-[#1A2C3D] via-[#0E1B27] to-[#050A0F]'
  }
];

const TAG_COLOR_PRESETS = [
  { name: 'Pickle Red', bg: '#FDE8EA', fg: '#C2273A' },
  { name: 'Spice Orange', bg: '#FFF0E0', fg: '#D2691E' },
  { name: 'Jaggery Gold', bg: '#FEF3C7', fg: '#B45309' },
  { name: 'Curry Green', bg: '#DCFCE7', fg: '#166534' },
  { name: 'Crispy Yellow', bg: '#FEF9C3', fg: '#854D0E' },
  { name: 'Royal Purple', bg: '#F3E8FF', fg: '#6B21A8' }
];

const SUGGESTED_PHOTOS = [
  { name: 'Bellam Avakaya', path: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg' },
  { name: 'Idli Karam Podi', path: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg' },
  { name: 'Sunnunda Laddu', path: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg' },
  { name: 'Kara Murukku', path: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg' },
  { name: 'Khara Mixture', path: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg' },
  { name: 'Banner Heritage', path: 'assets/images/banner_1.jpg' }
];

interface LettersFromHomeManagerProps {
  config: ReviewsConfig;
  onChange: (config: ReviewsConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
  allProducts?: any[];
}

export function LettersFromHomeManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults,
  allProducts = []
}: LettersFromHomeManagerProps) {
  const [selectedReviewIdx, setSelectedReviewIdx] = useState<number>(0);
  const [isSimulatingRotation, setIsSimulatingRotation] = useState<boolean>(true);
  const [simulatedIdx, setSimulatedIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'settings'>('reviews');

  const safeConfig: ReviewsConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      eyebrow: config?.settings?.eyebrow || 'LETTERS FROM HOME',
      title: config?.settings?.title || 'What families',
      titleAccent: config?.settings?.titleAccent || 'write to Amma',
      subtitle: config?.settings?.subtitle || 'Real notes from real kitchens 💌',
      seeAllLabel: config?.settings?.seeAllLabel || 'See all',
      writeLabel: config?.settings?.writeLabel || '✍️ Write to Amma',
      ringText: config?.settings?.ringText || '★ 1.2k REVIEWS ★ MADE WITH LOVE ★ ',
      wallTop: config?.settings?.wallTop || '#1F6B55',
      wallMid: config?.settings?.wallMid || '#0F3F33',
      wallBottom: config?.settings?.wallBottom || '#082520',
      accent: config?.settings?.accent || '#FFD58A',
      gold: config?.settings?.gold || '#E9C46A',
      autoplayMs: config?.settings?.autoplayMs || 4200
    },
    summary: {
      average: config?.summary?.average ?? 4.9,
      count: config?.summary?.count ?? 1248
    },
    reviews: Array.isArray(config?.reviews) && config.reviews.length > 0
      ? config.reviews
      : DEFAULT_REVIEWS.reviews
  };

  const currentReview: ReviewLetterItem = safeConfig.reviews[selectedReviewIdx] || safeConfig.reviews[0] || DEFAULT_REVIEWS.reviews[0];
  const simReview: ReviewLetterItem = safeConfig.reviews[simulatedIdx] || safeConfig.reviews[0] || currentReview;

  // Auto-slide simulator for preview
  useEffect(() => {
    if (!isSimulatingRotation || safeConfig.reviews.length <= 1) return;
    const interval = setInterval(() => {
      setSimulatedIdx(prev => (prev + 1) % safeConfig.reviews.length);
    }, Math.max(2500, safeConfig.settings.autoplayMs || 4200));
    return () => clearInterval(interval);
  }, [isSimulatingRotation, safeConfig.reviews.length, safeConfig.settings.autoplayMs]);

  // Update Settings
  const updateSettings = <K extends keyof ReviewsSettings>(key: K, value: ReviewsSettings[K]) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [key]: value
      }
    });
  };

  // Update Summary
  const updateSummary = <K extends keyof ReviewsSummary>(key: K, value: ReviewsSummary[K]) => {
    onChange({
      ...safeConfig,
      summary: {
        ...safeConfig.summary,
        [key]: value
      }
    });
  };

  // Update Specific Review
  const updateReview = (index: number, patch: Partial<ReviewLetterItem>) => {
    const updated = [...safeConfig.reviews];
    updated[index] = { ...updated[index], ...patch };
    onChange({
      ...safeConfig,
      reviews: updated
    });
  };

  // Add Review
  const handleAddReview = () => {
    const newId = `r_${Date.now()}`;
    const newReview: ReviewLetterItem = {
      id: newId,
      productId: 'p1',
      productName: 'Avakaya Pickle',
      text: 'Dear Amma, your pickles bring back the real taste of home. We love every single bite!',
      name: 'Pooja S.',
      meta: 'Verified Purchaser · Bangalore',
      photoUrl: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      photoCaption: 'Fresh bottle ✨',
      stars: 5,
      verified: true,
      tagBg: '#FDE8EA',
      tagFg: '#C2273A'
    };

    const updated = [...safeConfig.reviews, newReview];
    onChange({
      ...safeConfig,
      reviews: updated
    });
    setSelectedReviewIdx(updated.length - 1);
    toast.success('Added new customer review letter!');
  };

  // Duplicate Review
  const handleDuplicateReview = (index: number) => {
    const target = safeConfig.reviews[index];
    if (!target) return;
    const duplicated: ReviewLetterItem = {
      ...target,
      id: `r_${Date.now()}`,
      name: `${target.name} (Copy)`
    };
    const updated = [...safeConfig.reviews];
    updated.splice(index + 1, 0, duplicated);
    onChange({
      ...safeConfig,
      reviews: updated
    });
    setSelectedReviewIdx(index + 1);
    toast.success('Cloned review letter!');
  };

  // Delete Review
  const handleDeleteReview = (index: number) => {
    if (safeConfig.reviews.length <= 1) {
      toast.error('You must keep at least 1 review letter.');
      return;
    }
    const updated = safeConfig.reviews.filter((_, i) => i !== index);
    onChange({
      ...safeConfig,
      reviews: updated
    });
    setSelectedReviewIdx(Math.max(0, index - 1));
    toast.success('Deleted review letter.');
  };

  // Move Review Up/Down
  const handleMoveReview = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= safeConfig.reviews.length) return;
    const updated = [...safeConfig.reviews];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({
      ...safeConfig,
      reviews: updated
    });
    setSelectedReviewIdx(targetIdx);
  };

  // Copy JSON Payload
  const handleCopyJson = () => {
    const payload = {
      doc_id: 'reviews',
      content: {
        settings: safeConfig.settings,
        summary: safeConfig.summary,
        reviews: safeConfig.reviews
      }
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success('Copied exact JSON payload to clipboard!');
  };

  const formattedCount = safeConfig.summary.count >= 1000
    ? `${(safeConfig.summary.count / 1000).toFixed(safeConfig.summary.count % 1000 === 0 ? 0 : 1)}k`
    : `${safeConfig.summary.count}`;

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white shadow-xl border border-emerald-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Mail className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Letters from Home
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 font-medium">
                Customer Reviews
              </span>
            </h2>
          </div>
          <p className="text-xs text-emerald-200/80">
            Emerald wall · Swinging clothespin letters · Rotating rating medal · Polaroid photo notes to Amma
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJsonModal(true)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 backdrop-blur-sm"
          >
            <Code2 className="h-3.5 w-3.5" />
            JSON Payload
          </Button>

          {onResetDefaults && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetDefaults}
              className="text-xs bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 backdrop-blur-sm"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset Defaults
            </Button>
          )}

          <Button
            size="sm"
            onClick={onSave}
            disabled={isSaving}
            className="text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold gap-1.5 shadow-lg shadow-emerald-900/50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Reviews'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Tabs) & Right Mobile Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Reviews Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'reviews'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <MessageSquareQuote className="h-4 w-4 text-emerald-600" />
              Customer Letters ({safeConfig.reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="h-4 w-4 text-amber-500" />
              Wall Theme & Settings
            </button>
          </div>

          {/* TAB 1: CUSTOMER LETTERS LIST & EDITOR */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {/* Letters Carousel Quick Selector */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <span>Letters from Customers</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                        {safeConfig.reviews.length} Notes
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Select a letter to edit its review text, photo, and attached product.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddReview}
                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Letter
                  </Button>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {safeConfig.reviews.map((rev, idx) => {
                      const isSelected = idx === selectedReviewIdx;
                      return (
                        <button
                          key={rev.id || idx}
                          onClick={() => {
                            setSelectedReviewIdx(idx);
                            setSimulatedIdx(idx);
                          }}
                          className={`flex-shrink-0 text-left p-2.5 rounded-xl border transition-all w-48 ${
                            isSelected
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                              {rev.name || `Letter #${idx + 1}`}
                            </span>
                            <div className="flex items-center gap-0.5 text-amber-500 text-[10px] font-bold">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              {rev.stars}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1.5">
                            {rev.productName || 'General Review'}
                          </p>
                          <p className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-2 italic bg-slate-50 dark:bg-slate-800/60 p-1.5 rounded-md border border-slate-100 dark:border-slate-800">
                            "{rev.text}"
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* CURRENT SELECTED LETTER FORM */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                      {selectedReviewIdx + 1}
                    </span>
                    <div>
                      <CardTitle className="text-sm font-bold">
                        Editing Letter: {currentReview.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        ID: <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{currentReview.id}</code>
                      </CardDescription>
                    </div>
                  </div>

                  {/* Move & Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={selectedReviewIdx === 0}
                      onClick={() => handleMoveReview(selectedReviewIdx, 'up')}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={selectedReviewIdx === safeConfig.reviews.length - 1}
                      onClick={() => handleMoveReview(selectedReviewIdx, 'down')}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-slate-600"
                      onClick={() => handleDuplicateReview(selectedReviewIdx)}
                      title="Duplicate Letter"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDeleteReview(selectedReviewIdx)}
                      title="Delete Letter"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* Customer Info & Rating */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Customer Name
                      </label>
                      <Input
                        value={currentReview.name}
                        onChange={e => updateReview(selectedReviewIdx, { name: e.target.value })}
                        placeholder="e.g. Siri M."
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Location / Meta Subtitle
                      </label>
                      <Input
                        value={currentReview.meta}
                        onChange={e => updateReview(selectedReviewIdx, { meta: e.target.value })}
                        placeholder="e.g. Verified Purchaser · Hyderabad"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Star Rating (1 - 5)
                      </label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => updateReview(selectedReviewIdx, { stars: star })}
                            className="p-1 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= currentReview.stars
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300 dark:text-slate-700'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">
                          {currentReview.stars}.0
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verified Buyer Checkbox */}
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <input
                      type="checkbox"
                      id={`verified-${selectedReviewIdx}`}
                      checked={currentReview.verified}
                      onChange={e => updateReview(selectedReviewIdx, { verified: e.target.checked })}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4 cursor-pointer"
                    />
                    <label
                      htmlFor={`verified-${selectedReviewIdx}`}
                      className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
                    >
                      <BadgeCheck className="h-4 w-4 text-emerald-600" />
                      Show "VERIFIED BUYER" Postmark Rubber Stamp
                    </label>
                  </div>

                  {/* Letter Content */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <MessageSquareQuote className="h-3.5 w-3.5 text-emerald-600" />
                        Letter Text ("Note to Amma")
                      </label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {currentReview.text?.length || 0} chars
                      </span>
                    </div>
                    <textarea
                      value={currentReview.text}
                      onChange={e => updateReview(selectedReviewIdx, { text: e.target.value })}
                      placeholder="Dear Amma, ..."
                      rows={3}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 font-serif leading-relaxed"
                    />
                  </div>

                  {/* Product Association */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <ShoppingBag className="h-3.5 w-3.5 text-amber-600" />
                        Associated Product Link
                      </span>
                      {allProducts.length > 0 && (
                        <span className="text-[10px] text-slate-500">
                          {allProducts.length} live catalog items
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Product Name (shown on tag pill)
                        </label>
                        <Input
                          value={currentReview.productName}
                          onChange={e => updateReview(selectedReviewIdx, { productName: e.target.value })}
                          placeholder="e.g. Avakaya Pickle"
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Product ID (for Add to Cart)
                        </label>
                        <Input
                          value={currentReview.productId}
                          onChange={e => updateReview(selectedReviewIdx, { productId: e.target.value })}
                          placeholder="e.g. p1 or prod_123"
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Quick Pick from live products */}
                    {allProducts.length > 0 && (
                      <div className="pt-1">
                        <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1">
                          Quick Select From Store Catalog
                        </label>
                        <select
                          className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2"
                          onChange={e => {
                            const val = e.target.value;
                            if (!val) return;
                            const found = allProducts.find(p => p.id === val || p.name === val);
                            if (found) {
                              updateReview(selectedReviewIdx, {
                                productId: String(found.id || found.slug || val),
                                productName: found.name || val,
                                photoUrl: found.image || currentReview.photoUrl
                              });
                              toast.success(`Attached product: ${found.name}`);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Choose a product from store...</option>
                          {allProducts.map((p, pIdx) => (
                            <option key={p.id || pIdx} value={p.id || p.name}>
                              {p.name} {p.price ? `(₹${p.price})` : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Polaroid Photo Attachment & Caption */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <ImageIcon className="h-3.5 w-3.5 text-blue-600" />
                      Polaroid Photo Attachment (Taped on Letter)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Photo URL / Asset Path
                        </label>
                        <Input
                          value={currentReview.photoUrl}
                          onChange={e => updateReview(selectedReviewIdx, { photoUrl: e.target.value })}
                          placeholder="assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Polaroid Caption (written under photo)
                        </label>
                        <Input
                          value={currentReview.photoCaption}
                          onChange={e => updateReview(selectedReviewIdx, { photoCaption: e.target.value })}
                          placeholder="e.g. Opened today! 🏺"
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Quick suggested photos */}
                    <div>
                      <label className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block mb-1.5">
                        Quick Preset Photos
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {SUGGESTED_PHOTOS.map((sp, spIdx) => (
                          <button
                            key={spIdx}
                            type="button"
                            onClick={() => updateReview(selectedReviewIdx, { photoUrl: sp.path })}
                            className="text-[10px] px-2 py-1 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
                          >
                            {sp.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Product Tag Pill Styling */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <Palette className="h-3.5 w-3.5 text-pink-600" />
                      Product Badge Pill Colors
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Background Color (`tagBg`)
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={currentReview.tagBg?.startsWith('#') ? currentReview.tagBg : '#FDE8EA'}
                            onChange={e => updateReview(selectedReviewIdx, { tagBg: e.target.value })}
                            className="h-8 w-10 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentReview.tagBg}
                            onChange={e => updateReview(selectedReviewIdx, { tagBg: e.target.value })}
                            placeholder="#FDE8EA"
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          Text / Border Color (`tagFg`)
                        </label>
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="color"
                            value={currentReview.tagFg?.startsWith('#') ? currentReview.tagFg : '#C2273A'}
                            onChange={e => updateReview(selectedReviewIdx, { tagFg: e.target.value })}
                            className="h-8 w-10 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentReview.tagFg}
                            onChange={e => updateReview(selectedReviewIdx, { tagFg: e.target.value })}
                            placeholder="#C2273A"
                            className="h-8 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quick Badge Color Presets */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] text-slate-500 mr-1">Presets:</span>
                      {TAG_COLOR_PRESETS.map((tcp, tcpIdx) => (
                        <button
                          key={tcpIdx}
                          type="button"
                          onClick={() => updateReview(selectedReviewIdx, { tagBg: tcp.bg, tagFg: tcp.fg })}
                          style={{ backgroundColor: tcp.bg, color: tcp.fg, borderColor: tcp.fg }}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs hover:scale-105 transition-transform"
                        >
                          {tcp.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: WALL THEME & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              {/* General Visibility & Autoplay */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Section Visibility & Timing</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeConfig.settings.enabled}
                        onChange={e => updateSettings('enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enable or disable the "Letters from Home" customer reviews section on the app home screen.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        Autoplay Interval (ms)
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="range"
                          min="2000"
                          max="8000"
                          step="200"
                          value={safeConfig.settings.autoplayMs}
                          onChange={e => updateSettings('autoplayMs', Number(e.target.value))}
                          className="w-full accent-emerald-600"
                        />
                        <span className="text-xs font-mono font-bold w-16 text-right">
                          {safeConfig.settings.autoplayMs}ms
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        See All Button Label
                      </label>
                      <Input
                        value={safeConfig.settings.seeAllLabel}
                        onChange={e => updateSettings('seeAllLabel', e.target.value)}
                        placeholder="See all"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Write Button Label
                    </label>
                    <Input
                      value={safeConfig.settings.writeLabel}
                      onChange={e => updateSettings('writeLabel', e.target.value)}
                      placeholder="✍️ Write to Amma"
                      className="h-8 text-xs mt-1"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Header Titles */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Header Titles & Kicker</CardTitle>
                  <CardDescription className="text-xs">
                    Configure the gold kicker, primary title, italic accent title, and subtitle.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Gold Eyebrow Kicker
                      </label>
                      <Input
                        value={safeConfig.settings.eyebrow}
                        onChange={e => updateSettings('eyebrow', e.target.value)}
                        placeholder="LETTERS FROM HOME"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Subtitle
                      </label>
                      <Input
                        value={safeConfig.settings.subtitle}
                        onChange={e => updateSettings('subtitle', e.target.value)}
                        placeholder="Real notes from real kitchens 💌"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Title First Line
                      </label>
                      <Input
                        value={safeConfig.settings.title}
                        onChange={e => updateSettings('title', e.target.value)}
                        placeholder="What families"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Title Accent (Italic Accent Line)
                      </label>
                      <Input
                        value={safeConfig.settings.titleAccent}
                        onChange={e => updateSettings('titleAccent', e.target.value)}
                        placeholder="write to Amma"
                        className="h-8 text-xs mt-1 font-serif italic"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Ratings Summary & Rotating Ring Medal */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    Gold Rating Medal & Summary
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Controls the average score, review count, and circular spinning ring medal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Average Star Rating
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={safeConfig.summary.average}
                        onChange={e => updateSummary('average', parseFloat(e.target.value) || 4.9)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Total Reviews Count
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={safeConfig.summary.count}
                        onChange={e => updateSummary('count', parseInt(e.target.value) || 1248)}
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Rotating Ring Medal Text (Repeats along outer ring circle)
                    </label>
                    <Input
                      value={safeConfig.settings.ringText}
                      onChange={e => updateSettings('ringText', e.target.value)}
                      placeholder="★ 1.2k REVIEWS ★ MADE WITH LOVE ★ "
                      className="h-8 text-xs mt-1 font-mono"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Wall Theme & Colors */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <Palette className="h-4 w-4 text-emerald-600" />
                    Emerald Wall Color Palette
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Customize the 3-stop radial gradient background and luxury gold accents.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-4">
                  {/* Preset Themes */}
                  <div>
                    <label className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Curated Wall Themes
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {WALL_THEME_PRESETS.map((theme, tIdx) => (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => {
                            onChange({
                              ...safeConfig,
                              settings: {
                                ...safeConfig.settings,
                                wallTop: theme.wallTop,
                                wallMid: theme.wallMid,
                                wallBottom: theme.wallBottom,
                                accent: theme.accent,
                                gold: theme.gold
                              }
                            });
                            toast.success(`Applied theme: ${theme.name}`);
                          }}
                          className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 text-left transition-all group"
                        >
                          <div className={`h-8 rounded-md bg-gradient-to-br ${theme.preview} mb-1.5 border border-white/20`} />
                          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 block truncate group-hover:text-emerald-600">
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hex Color Inputs */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Wall Top (Center)
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={safeConfig.settings.wallTop}
                          onChange={e => updateSettings('wallTop', e.target.value)}
                          className="h-7 w-8 p-0 rounded border cursor-pointer"
                        />
                        <Input
                          value={safeConfig.settings.wallTop}
                          onChange={e => updateSettings('wallTop', e.target.value)}
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Wall Mid
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={safeConfig.settings.wallMid}
                          onChange={e => updateSettings('wallMid', e.target.value)}
                          className="h-7 w-8 p-0 rounded border cursor-pointer"
                        />
                        <Input
                          value={safeConfig.settings.wallMid}
                          onChange={e => updateSettings('wallMid', e.target.value)}
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Wall Bottom (Dark)
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={safeConfig.settings.wallBottom}
                          onChange={e => updateSettings('wallBottom', e.target.value)}
                          className="h-7 w-8 p-0 rounded border cursor-pointer"
                        />
                        <Input
                          value={safeConfig.settings.wallBottom}
                          onChange={e => updateSettings('wallBottom', e.target.value)}
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Italic Accent Color
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={safeConfig.settings.accent}
                          onChange={e => updateSettings('accent', e.target.value)}
                          className="h-7 w-8 p-0 rounded border cursor-pointer"
                        />
                        <Input
                          value={safeConfig.settings.accent}
                          onChange={e => updateSettings('accent', e.target.value)}
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                        Gold Highlights
                      </label>
                      <div className="flex items-center gap-1.5 mt-1">
                        <input
                          type="color"
                          value={safeConfig.settings.gold}
                          onChange={e => updateSettings('gold', e.target.value)}
                          className="h-7 w-8 p-0 rounded border cursor-pointer"
                        />
                        <Input
                          value={safeConfig.settings.gold}
                          onChange={e => updateSettings('gold', e.target.value)}
                          className="h-7 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE MOBILE PHONE SIMULATOR */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="mx-auto w-full max-w-[340px] bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Notch & Speaker */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Mobile Screen Surface */}
            <div
              className="relative overflow-hidden rounded-[28px] text-white select-none transition-all shadow-inner"
              style={{
                height: '520px',
                background: `radial-gradient(circle at 50% 0%, ${safeConfig.settings.wallTop} 0%, ${safeConfig.settings.wallMid} 48%, ${safeConfig.settings.wallBottom} 100%)`
              }}
            >
              {/* Subtle Wall Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Top Header Row with Rotating Medal & Title */}
              <div className="relative z-10 px-4 pt-4 flex items-center gap-3">
                {/* Gold Rating Medal with Rotating Ring */}
                <div className="relative shrink-0 w-14 h-14 flex items-center justify-center">
                  {/* Rotating Ring Text */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full animate-spin"
                    style={{ animationDuration: '20s', animationTimingFunction: 'linear' }}
                  >
                    <path
                      id="textRingPath"
                      d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                      fill="none"
                    />
                    <text fontSize="8.2" fontWeight="bold" fill={safeConfig.settings.gold} letterSpacing="1.2">
                      <textPath href="#textRingPath">
                        {safeConfig.settings.ringText}
                      </textPath>
                    </text>
                  </svg>

                  {/* Center Medal Core */}
                  <div
                    className="w-8 h-8 rounded-full flex flex-col items-center justify-center shadow-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${safeConfig.settings.gold}, #B8860B)`,
                      borderColor: safeConfig.settings.accent
                    }}
                  >
                    <span className="text-[10px] font-black text-slate-950 leading-none">
                      {safeConfig.summary.average}
                    </span>
                    <Star className="h-2 w-2 fill-slate-950 text-slate-950 mt-0.5" />
                  </div>
                </div>

                {/* Headers */}
                <div className="min-w-0 flex-1">
                  <span
                    className="text-[8px] font-black tracking-widest uppercase block truncate"
                    style={{ color: safeConfig.settings.gold }}
                  >
                    {safeConfig.settings.eyebrow}
                  </span>
                  <h3 className="text-base font-bold leading-tight text-[#FBEFDC] truncate">
                    {safeConfig.settings.title}
                  </h3>
                  <h3
                    className="text-base font-semibold italic leading-tight font-serif truncate"
                    style={{ color: safeConfig.settings.accent }}
                  >
                    {safeConfig.settings.titleAccent}
                  </h3>
                  <p className="text-[9px] text-white/70 truncate mt-0.5">
                    {safeConfig.settings.subtitle}
                  </p>
                </div>
              </div>

              {/* Hanging Rope / Thoranam with Leaves */}
              <div className="relative z-10 mt-2 px-2">
                {/* Jute Rope */}
                <div className="w-full h-0.5 bg-[#B89758] shadow-xs relative">
                  {/* Clothespin */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 w-3 h-5 bg-[#C9A66B] border border-[#8B6538] rounded-xs shadow-xs z-20 flex flex-col items-center justify-between py-0.5">
                    <div className="w-1.5 h-0.5 bg-[#694827]" />
                    <div className="w-1.5 h-0.5 bg-[#694827]" />
                  </div>
                </div>

                {/* Leaves garland accents */}
                <div className="flex justify-between px-4 -mt-1 opacity-75">
                  <span className="text-xs">🍃</span>
                  <span className="text-xs">🌼</span>
                  <span className="text-xs">🍃</span>
                  <span className="text-xs">🌼</span>
                  <span className="text-xs">🍃</span>
                </div>
              </div>

              {/* THE SWINGING LETTER CARD (Phone Screen Center) */}
              <div className="relative z-10 px-5 pt-3">
                <div
                  className="relative bg-[#FFFDF7] text-slate-900 rounded-xl p-3 shadow-2xl border border-amber-200/80 transition-all duration-500"
                  style={{
                    transform: 'rotate(-1.2deg)',
                    boxShadow: '0 12px 30px -8px rgba(0,0,0,0.45)'
                  }}
                >
                  {/* Top Row: Stars + Verified Postmark Stamp */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < simReview.stars
                              ? 'text-amber-500 fill-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>

                    {simReview.verified && (
                      <span className="text-[8px] font-black uppercase tracking-wider text-rose-700 border border-rose-600/70 px-1.5 py-0.5 rounded rotate-3 bg-rose-50/50">
                        VERIFIED BUYER
                      </span>
                    )}
                  </div>

                  {/* Letter Text (Handwriting / Serif Aesthetic) */}
                  <p className="text-[11px] font-serif leading-relaxed text-slate-800 line-clamp-4 italic mb-3 min-h-[52px]">
                    "{simReview.text}"
                  </p>

                  {/* Bottom Info: Customer details & Product Tag */}
                  <div className="flex items-end justify-between gap-2 border-t border-amber-100 pt-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-900 truncate flex items-center gap-1">
                        {simReview.name}
                        {simReview.verified && (
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 inline shrink-0" />
                        )}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate">
                        {simReview.meta}
                      </p>
                      <div className="mt-1">
                        <span
                          style={{
                            backgroundColor: simReview.tagBg || '#FDE8EA',
                            color: simReview.tagFg || '#C2273A'
                          }}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-md inline-block max-w-[130px] truncate"
                        >
                          {simReview.productName}
                        </span>
                      </div>
                    </div>

                    {/* Polaroid Photo with Masking Tape */}
                    {simReview.photoUrl && (
                      <div className="relative shrink-0 w-16 bg-white p-1 rounded shadow-md border border-slate-200 rotate-2">
                        {/* Tape effect */}
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-6 h-2 bg-amber-100/90 border border-amber-300/40 rounded-xs shadow-2xs rotate-1 z-10" />
                        <div className="w-14 h-14 bg-slate-100 rounded-xs overflow-hidden flex items-center justify-center">
                          <img
                            src={simReview.photoUrl.startsWith('assets/') ? `/${simReview.photoUrl}` : simReview.photoUrl}
                            alt="Review attachment"
                            className="w-full h-full object-cover"
                            onError={e => {
                              // Fallback if image path not found in dashboard preview
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <p className="text-[7px] text-center text-slate-600 font-handwriting truncate mt-0.5">
                          {simReview.photoCaption || 'Customer photo'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Phone Bar: Dots + See all + Write CTA */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between z-10">
                {/* Dots indicator */}
                <div className="flex items-center gap-1">
                  {safeConfig.reviews.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSimulatedIdx(i)}
                      className={`h-1.5 rounded-full transition-all ${
                        i === simulatedIdx
                          ? 'w-4 bg-amber-400'
                          : 'w-1.5 bg-white/30'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: safeConfig.settings.gold }}
                  >
                    {safeConfig.settings.seeAllLabel} {formattedCount} →
                  </span>
                  <div
                    className="text-[9px] font-bold px-2.5 py-1 rounded-full text-slate-950 shadow-md flex items-center gap-1"
                    style={{
                      background: `linear-gradient(135deg, ${safeConfig.settings.gold}, #FFD58A)`
                    }}
                  >
                    {safeConfig.settings.writeLabel}
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Controls Bar */}
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => {
                    const prev = (simulatedIdx - 1 + safeConfig.reviews.length) % safeConfig.reviews.length;
                    setSimulatedIdx(prev);
                    setSelectedReviewIdx(prev);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => setIsSimulatingRotation(!isSimulatingRotation)}
                  title={isSimulatingRotation ? 'Pause Auto-Slide' : 'Start Auto-Slide'}
                >
                  {isSimulatingRotation ? (
                    <Pause className="h-3.5 w-3.5 text-amber-400" />
                  ) : (
                    <Play className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => {
                    const next = (simulatedIdx + 1) % safeConfig.reviews.length;
                    setSimulatedIdx(next);
                    setSelectedReviewIdx(next);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-[11px] font-mono">
                {simulatedIdx + 1} / {safeConfig.reviews.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Payload Inspector Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Exact Backend JSON Payload (doc_id: "reviews")
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="h-7 w-7 p-0 rounded-full"
              >
                ✕
              </Button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-emerald-400 custom-scrollbar">
              <pre>{JSON.stringify({
                doc_id: 'reviews',
                content: {
                  settings: safeConfig.settings,
                  summary: safeConfig.summary,
                  reviews: safeConfig.reviews
                }
              }, null, 2)}</pre>
            </div>

            <div className="p-3 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyJson}
                className="text-xs gap-1.5"
              >
                <Copy className="h-3.5 w-3.5" />
                Copy JSON
              </Button>
              <Button
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
