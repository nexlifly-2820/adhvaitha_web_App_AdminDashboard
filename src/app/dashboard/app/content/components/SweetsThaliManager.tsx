'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Gift, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Smartphone, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  ShoppingBag, 
  Star, 
  Clock, 
  Tag,
  Check,
  Package,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';

export interface SweetsVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface SweetsProduct {
  id: string;
  name: string;
  tagline: string;
  image: string;
  tags: string[];
  giftBox: boolean;
  variants: SweetsVariant[];
}

export interface SweetsSettings {
  enabled: boolean;
  kicker: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  intervalMs: number;
  badges: string[];
  giftTag: string;
}

export interface SweetsConfig {
  settings: SweetsSettings;
  products: SweetsProduct[];
}

export const DEFAULT_SWEETS: SweetsConfig = {
  settings: {
    enabled: true,
    kicker: "MITHAI THALI",
    title: "Traditional sweets,",
    titleAccent: "timeless joy",
    subtitle: "Pure ghee. Jaggery. Just like Ammamma made.",
    intervalMs: 2800,
    badges: ["🧈 Pure desi ghee", "No preservatives"],
    giftTag: "🎁 Gift box available"
  },
  products: [
    {
      id: "p1",
      name: "Sunnunda Laddu",
      tagline: "roasted urad dal & organic jaggery",
      image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
      tags: ["🧈 Pure Desi Ghee", "No Sugar"],
      giftBox: true,
      variants: [
        { id: "v1", label: "250g", price: 199, mrp: 220, inStock: true },
        { id: "v2", label: "500g", price: 380, mrp: 420, inStock: true }
      ]
    },
    {
      id: "p2",
      name: "Dry Fruits Laddu",
      tagline: "almonds, cashews, dates & pistachios",
      image: "assets/images/dry_fruits_laddu_premium_dry_fruits_laddu.jpg",
      tags: ["🥜 Loaded with nuts", "Energy Rich"],
      giftBox: true,
      variants: [
        { id: "v3", label: "250g", price: 240, mrp: 275, inStock: true },
        { id: "v4", label: "500g", price: 460, mrp: 520, inStock: true }
      ]
    },
    {
      id: "p3",
      name: "Gondh Laddu",
      tagline: "edible gum, ghee & wholesome dry fruits",
      image: "assets/images/gondh_laddu_edible_gum_laddu.jpg",
      tags: ["💪 Immunity Boost", "Winter Special"],
      giftBox: false,
      variants: [
        { id: "v5", label: "250g", price: 210, mrp: 235, inStock: true },
        { id: "v6", label: "500g", price: 410, mrp: 450, inStock: true }
      ]
    }
  ]
};

const SUGGESTED_TAGS = [
  "🧈 Pure Desi Ghee",
  "No Sugar",
  "🥜 Loaded with nuts",
  "Energy Rich",
  "💪 Immunity Boost",
  "Winter Special",
  "Organic Jaggery",
  "✨ Melt-in-Mouth",
  "Grandma's Secret"
];

const SUGGESTED_BADGES = [
  "🧈 Pure desi ghee",
  "No preservatives",
  "Fresh Batch Everyday",
  "100% Homemade",
  "Traditional Bellam"
];

const IMAGE_PRESETS = [
  { label: 'Sunnunda Laddu', path: 'assets/images/sunnundalu.png' },
  { label: 'Dry Fruits Laddu', path: 'assets/images/dry_fruit_laddu.png' },
  { label: 'Gondh Laddu', path: 'assets/images/gond_laddu.png' },
  { label: 'Kova Gulab Jamun', path: 'assets/images/gulab_jamun.png' },
  { label: 'Millets Laddu', path: 'assets/images/millet_laddu.png' },
  { label: 'Palli Chikki', path: 'assets/images/palli_chikki.png' },
  { label: 'Nuvvula Chikki', path: 'assets/images/nuvvula_chikki.png' },
  { label: 'Dry Fruit Chikki', path: 'assets/images/dry_fruit_chikki.png' }
];

interface SweetsThaliManagerProps {
  config: SweetsConfig;
  onChange: (config: SweetsConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function SweetsThaliManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: SweetsThaliManagerProps) {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [isSimulatingRotation, setIsSimulatingRotation] = useState<boolean>(true);
  const [simulatedIdx, setSimulatedIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [newBadgeInput, setNewBadgeInput] = useState<string>('');
  const [newTagInput, setNewTagInput] = useState<string>('');

  const safeConfig: SweetsConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      kicker: config?.settings?.kicker || "MITHAI THALI",
      title: config?.settings?.title || 'Traditional sweets,',
      titleAccent: config?.settings?.titleAccent || 'timeless joy',
      subtitle: config?.settings?.subtitle || 'Pure ghee. Jaggery. Just like Ammamma made.',
      intervalMs: config?.settings?.intervalMs || 2800,
      badges: Array.isArray(config?.settings?.badges) ? config.settings.badges : DEFAULT_SWEETS.settings.badges,
      giftTag: config?.settings?.giftTag || '🎁 Gift box available'
    },
    products: Array.isArray(config?.products) && config.products.length > 0
      ? config.products
      : DEFAULT_SWEETS.products
  };

  const products = safeConfig.products;
  const activeProduct = products[selectedProductIdx] || products[0];

  // Auto-rotation simulator for the Brass Thali mobile stage
  useEffect(() => {
    if (!isSimulatingRotation || products.length <= 1) return;
    const interval = setInterval(() => {
      setSimulatedIdx(prev => (prev + 1) % products.length);
    }, Math.max(1000, safeConfig.settings.intervalMs || 2800));
    return () => clearInterval(interval);
  }, [isSimulatingRotation, products.length, safeConfig.settings.intervalMs]);

  const previewProduct = isSimulatingRotation 
    ? (products[simulatedIdx] || activeProduct)
    : activeProduct;

  const getDisplayImage = (imgUrl?: string) => {
    if (!imgUrl) return '/assets/images/sunnundalu.png';
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  const updateSetting = (field: keyof SweetsSettings, value: any) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [field]: value
      }
    });
  };

  const addGlobalBadge = (badge: string) => {
    if (!badge.trim()) return;
    if (safeConfig.settings.badges.includes(badge)) {
      toast.error('Badge already exists');
      return;
    }
    updateSetting('badges', [...safeConfig.settings.badges, badge.trim()]);
    setNewBadgeInput('');
  };

  const removeGlobalBadge = (idx: number) => {
    const updated = safeConfig.settings.badges.filter((_, i) => i !== idx);
    updateSetting('badges', updated);
  };

  const updateProduct = (idx: number, field: keyof SweetsProduct, value: any) => {
    const updated = [...products];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({ ...safeConfig, products: updated });
  };

  const addProductTag = (prodIdx: number, tag: string) => {
    if (!tag.trim()) return;
    const cur = products[prodIdx];
    const tags = cur.tags || [];
    if (tags.length >= 2) {
      toast.error('Maximum 2 tags allowed per sweet');
      return;
    }
    updateProduct(prodIdx, 'tags', [...tags, tag.trim()]);
    setNewTagInput('');
  };

  const removeProductTag = (prodIdx: number, tagIdx: number) => {
    const cur = products[prodIdx];
    const tags = (cur.tags || []).filter((_, i) => i !== tagIdx);
    updateProduct(prodIdx, 'tags', tags);
  };

  const addVariant = (prodIdx: number) => {
    const cur = products[prodIdx];
    const newV: SweetsVariant = {
      id: `v_${Date.now()}`,
      label: '1kg',
      price: 699,
      mrp: 780,
      inStock: true
    };
    updateProduct(prodIdx, 'variants', [...(cur.variants || []), newV]);
    toast.success('Variant added');
  };

  const updateVariant = (prodIdx: number, variantIdx: number, field: keyof SweetsVariant, val: any) => {
    const cur = products[prodIdx];
    const variants = [...(cur.variants || [])];
    variants[variantIdx] = { ...variants[variantIdx], [field]: val };
    updateProduct(prodIdx, 'variants', variants);
  };

  const removeVariant = (prodIdx: number, variantIdx: number) => {
    const cur = products[prodIdx];
    if (cur.variants && cur.variants.length <= 1) {
      toast.error('At least 1 variant is required.');
      return;
    }
    const variants = (cur.variants || []).filter((_, i) => i !== variantIdx);
    updateProduct(prodIdx, 'variants', variants);
    toast.success('Variant removed');
  };

  const addProduct = () => {
    const newId = `p${Date.now()}`;
    const newProduct: SweetsProduct = {
      id: newId,
      name: 'New Heritage Mithai',
      tagline: 'pure desi ghee & organic jaggery',
      image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
      tags: ['🧈 Pure Desi Ghee', '✨ Melt-in-Mouth'],
      giftBox: true,
      variants: [
        { id: `v1_${Date.now()}`, label: '250g', price: 199, mrp: 220, inStock: true },
        { id: `v2_${Date.now()}`, label: '500g', price: 380, mrp: 420, inStock: true }
      ]
    };
    onChange({ ...safeConfig, products: [...products, newProduct] });
    setSelectedProductIdx(products.length);
    toast.success('Added sweet to Mithai Thali');
  };

  const removeProduct = (idx: number) => {
    if (products.length <= 1) {
      toast.error('You must keep at least 1 sweet in the Mithai Thali.');
      return;
    }
    const updated = products.filter((_, i) => i !== idx);
    onChange({ ...safeConfig, products: updated });
    setSelectedProductIdx(0);
    toast.success('Product removed');
  };

  const moveProduct = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;
    const updated = [...products];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ ...safeConfig, products: updated });
    setSelectedProductIdx(targetIdx);
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/60 via-yellow-50/20 to-orange-50/40 dark:from-slate-900 dark:to-slate-950 shadow-sm">
        <CardHeader className="pb-4 border-b border-amber-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center ring-1 ring-amber-500/20">
                  <Sparkles className="h-5 w-5 text-amber-600 fill-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      Mithai Thali Sweets Section
                    </CardTitle>
                    <span className="text-[10px] bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Stream Sync
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Connected live to Flutter's <code className="font-mono text-amber-700 dark:text-amber-400">AppConfigRepository().getSweetsStream()</code>. Manages the rotating brass thali stage, gift tags, and desi ghee badges.
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJsonModal(true)}
                className="text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100"
              >
                <Code2 className="h-3.5 w-3.5 mr-1.5 text-slate-600" />
                View Payload JSON
              </Button>

              {onResetDefaults && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetDefaults}
                  className="text-xs border-slate-300 dark:border-slate-700 hover:bg-slate-100"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1.5 text-slate-500" />
                  Restore Presets
                </Button>
              )}

              <Button
                size="sm"
                onClick={onSave}
                disabled={isSaving}
                className="bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs shadow-sm shadow-amber-500/20"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isSaving ? 'Publishing...' : 'Publish to App'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* SECTION GLOBAL SETTINGS */}
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3 mb-4">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Visibility
              </label>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {safeConfig.settings.enabled ? 'Enabled' : 'Hidden'}
                </span>
                <input
                  type="checkbox"
                  checked={safeConfig.settings.enabled}
                  onChange={e => updateSetting('enabled', e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Kicker Tag
              </label>
              <Input
                value={safeConfig.settings.kicker}
                onChange={e => updateSetting('kicker', e.target.value)}
                placeholder="MITHAI THALI"
                className="h-8 text-xs font-mono font-medium"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Title & Accent
              </label>
              <div className="flex gap-1.5">
                <Input
                  value={safeConfig.settings.title}
                  onChange={e => updateSetting('title', e.target.value)}
                  placeholder="Traditional sweets,"
                  className="h-8 text-xs font-medium w-1/2"
                />
                <Input
                  value={safeConfig.settings.titleAccent}
                  onChange={e => updateSetting('titleAccent', e.target.value)}
                  placeholder="timeless joy"
                  className="h-8 text-xs font-medium text-amber-700 w-1/2"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 md:col-span-2">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Subtitle
              </label>
              <Input
                value={safeConfig.settings.subtitle}
                onChange={e => updateSetting('subtitle', e.target.value)}
                placeholder="Pure ghee. Jaggery. Just like Ammamma made."
                className="h-8 text-xs"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Rotation Interval
                </label>
                <span className="text-[11px] font-mono text-amber-700 font-bold">
                  {safeConfig.settings.intervalMs}ms
                </span>
              </div>
              <Input
                type="number"
                step="200"
                min="1000"
                max="10000"
                value={safeConfig.settings.intervalMs}
                onChange={e => updateSetting('intervalMs', parseInt(e.target.value) || 2800)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>

          {/* BADGES & GIFT TAG ROW */}
          <div className="p-3 rounded-xl bg-amber-50/40 dark:bg-slate-900/40 border border-amber-200/80 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Global Badges */}
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-amber-600" />
                  Top Section Badges (Displayed above the Thali)
                </span>
                <span className="text-[10px] text-slate-400">Click × to remove</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {safeConfig.settings.badges.map((b, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-amber-300 dark:border-slate-700 text-amber-900 dark:text-amber-200 shadow-2xs"
                  >
                    <span>{b}</span>
                    <button
                      type="button"
                      onClick={() => removeGlobalBadge(i)}
                      className="h-3.5 w-3.5 rounded-full hover:bg-amber-100 dark:hover:bg-slate-700 flex items-center justify-center text-[10px]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <div className="flex items-center gap-1">
                  <Input
                    value={newBadgeInput}
                    onChange={e => setNewBadgeInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addGlobalBadge(newBadgeInput);
                      }
                    }}
                    placeholder="+ Add badge"
                    className="h-7 text-xs w-28"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => addGlobalBadge(newBadgeInput)}
                    className="h-7 px-2 text-xs"
                  >
                    Add
                  </Button>
                </div>
              </div>

              {/* Quick suggestions */}
              <div className="flex flex-wrap gap-1 mt-2">
                {SUGGESTED_BADGES.map((b, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addGlobalBadge(b)}
                    className="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.5 rounded border border-dashed border-slate-300 bg-white/50"
                  >
                    + {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Gift Tag Config */}
            <div className="shrink-0 w-full md:w-64 border-t md:border-t-0 md:border-l md:pl-4 pt-3 md:pt-0 border-amber-200 dark:border-slate-800">
              <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1 flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-rose-500" />
                Default Gift Tag Badge
              </label>
              <Input
                value={safeConfig.settings.giftTag}
                onChange={e => updateSetting('giftTag', e.target.value)}
                placeholder="🎁 Gift box available"
                className="h-8 text-xs font-medium"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: SWEET PRODUCTS LIST & EDITOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* PRODUCT CAROUSEL SELECTOR */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
            <div className="flex items-center gap-2">
              {products.map((p, idx) => {
                const isSelected = selectedProductIdx === idx;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedProductIdx(idx);
                      setSimulatedIdx(idx);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20 font-bold ring-2 ring-amber-500/20'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-sm">🍯</span>
                    <span>{`#${idx + 1} ${p.name}`}</span>
                    {p.giftBox && (
                      <span className="text-[10px] bg-white/20 text-white font-bold px-1 rounded">
                        🎁
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={addProduct}
              className="text-xs shrink-0 border-dashed border-amber-300 text-amber-700 hover:bg-amber-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Sweet
            </Button>
          </div>

          {/* ACTIVE PRODUCT EDITOR */}
          {activeProduct && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Editing Sweet #{selectedProductIdx + 1}:
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300">
                    {activeProduct.name}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={selectedProductIdx === 0}
                    onClick={() => moveProduct(selectedProductIdx, 'up')}
                    className="h-7 w-7 p-0"
                    title="Move Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={selectedProductIdx === products.length - 1}
                    onClick={() => moveProduct(selectedProductIdx, 'down')}
                    className="h-7 w-7 p-0"
                    title="Move Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(selectedProductIdx)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete Sweet"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* CARD 1: SWEET IDENTITY & TAGS */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    Sweet Details & Gift Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Mithai Name
                      </label>
                      <Input
                        value={activeProduct.name}
                        onChange={e => updateProduct(selectedProductIdx, 'name', e.target.value)}
                        placeholder="Sunnunda Laddu"
                        className="h-8 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Product ID
                      </label>
                      <Input
                        value={activeProduct.id}
                        onChange={e => updateProduct(selectedProductIdx, 'id', e.target.value)}
                        placeholder="p1"
                        className="h-8 text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Poetic Tagline (Ingredients & Aroma)
                    </label>
                    <Input
                      value={activeProduct.tagline}
                      onChange={e => updateProduct(selectedProductIdx, 'tagline', e.target.value)}
                      placeholder="roasted urad dal & organic jaggery"
                      className="h-8 text-xs font-serif italic text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  {/* Gift Box Toggle */}
                  <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-slate-900 border border-amber-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Gift className="h-4 w-4 text-rose-500" />
                        Gift Box Available on Mobile Thali
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Shows the '{safeConfig.settings.giftTag}' badge on this item.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={activeProduct.giftBox}
                      onChange={e => updateProduct(selectedProductIdx, 'giftBox', e.target.checked)}
                      className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
                    />
                  </div>

                  {/* Feature Tags (up to 2) */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Feature Tags (Max 2 tags displayed on Thali stage)
                      </label>
                      <span className="text-[10px] text-slate-400">
                        {activeProduct.tags?.length || 0}/2 used
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {(activeProduct.tags || []).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-200"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeProductTag(selectedProductIdx, tIdx)}
                            className="h-3.5 w-3.5 rounded-full hover:bg-amber-200 flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}

                      {(activeProduct.tags || []).length < 2 && (
                        <div className="flex items-center gap-1">
                          <Input
                            value={newTagInput}
                            onChange={e => setNewTagInput(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addProductTag(selectedProductIdx, newTagInput);
                              }
                            }}
                            placeholder="+ Add tag"
                            className="h-7 text-xs w-28"
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => addProductTag(selectedProductIdx, newTagInput)}
                            className="h-7 px-2 text-xs"
                          >
                            Add
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {(activeProduct.tags || []).length < 2 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {SUGGESTED_TAGS.map((t, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => addProductTag(selectedProductIdx, t)}
                            className="text-[10px] text-slate-500 hover:text-amber-700 px-1.5 py-0.5 rounded border border-dashed border-slate-300 bg-white"
                          >
                            + {t}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Product Image */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Image Path / URL
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={activeProduct.image}
                        onChange={e => updateProduct(selectedProductIdx, 'image', e.target.value)}
                        placeholder="assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg"
                        className="h-8 text-xs font-mono flex-1"
                      />
                      <img
                        src={getDisplayImage(activeProduct.image)}
                        alt="Preview"
                        className="h-8 w-8 rounded-lg object-cover border shrink-0 bg-white"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {IMAGE_PRESETS.map((img, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => updateProduct(selectedProductIdx, 'image', img.path)}
                          className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: VARIANTS & WEIGHT PACKAGING */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" />
                    Weight Variants & Pricing ({activeProduct.variants?.length || 0})
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addVariant(selectedProductIdx)}
                    className="h-7 text-xs border-dashed text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Weight
                  </Button>
                </CardHeader>

                <CardContent className="pt-4 space-y-3">
                  {(activeProduct.variants || []).map((v, vIdx) => {
                    const discount = v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0;
                    return (
                      <div
                        key={v.id || vIdx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 flex-1 w-full sm:w-auto">
                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                              Weight/Box
                            </span>
                            <Input
                              value={v.label}
                              onChange={e => updateVariant(selectedProductIdx, vIdx, 'label', e.target.value)}
                              placeholder="250g"
                              className="h-7 text-xs font-semibold"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                              Price (₹)
                            </span>
                            <Input
                              type="number"
                              value={v.price}
                              onChange={e => updateVariant(selectedProductIdx, vIdx, 'price', parseFloat(e.target.value) || 0)}
                              className="h-7 text-xs font-bold text-emerald-600"
                            />
                          </div>

                          <div>
                            <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-1">
                              MRP (₹)
                            </span>
                            <Input
                              type="number"
                              value={v.mrp}
                              onChange={e => updateVariant(selectedProductIdx, vIdx, 'mrp', parseFloat(e.target.value) || 0)}
                              className="h-7 text-xs text-slate-500"
                            />
                          </div>

                          <div className="flex items-center gap-2 pt-4 sm:pt-0">
                            {discount > 0 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={v.inStock}
                              onChange={e => updateVariant(selectedProductIdx, vIdx, 'inStock', e.target.checked)}
                              className="h-3.5 w-3.5 rounded accent-emerald-600 cursor-pointer"
                            />
                            <span>In Stock</span>
                          </label>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVariant(selectedProductIdx, vIdx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: FLUTTER APP LIVE SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-amber-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Flutter Mobile App Live Simulator
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSimulatingRotation(!isSimulatingRotation)}
              className={`text-[11px] px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                isSimulatingRotation
                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{isSimulatingRotation ? 'Auto-Rotating' : 'Paused'}</span>
            </button>
          </div>

          {/* PHONE FRAME */}
          <div className="w-full max-w-[340px] mx-auto bg-slate-900 rounded-[36px] p-3 shadow-2xl ring-1 ring-slate-800/80">
            {/* Phone Screen Notch */}
            <div className="flex items-center justify-between px-4 py-1.5 text-[10px] text-slate-400 font-mono">
              <span>9:41</span>
              <div className="h-4 w-16 bg-slate-800 rounded-full" />
              <span>5G 100%</span>
            </div>

            {/* SCREEN VIEWPORT */}
            <div className="bg-[#FAF7F2] text-slate-900 rounded-[28px] overflow-hidden p-4 min-h-[520px] flex flex-col justify-between select-none">
              {/* SECTION HEADER */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[9px] font-extrabold tracking-widest text-[#B81D3B] uppercase font-mono">
                    {safeConfig.settings.kicker || 'MITHAI THALI'}
                  </span>
                  <span className="text-[9px] text-slate-500 font-medium">
                    {simulatedIdx + 1} of {products.length}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {safeConfig.settings.title || 'Traditional sweets,'}{' '}
                  <span className="text-[#B81D3B] italic">
                    {safeConfig.settings.titleAccent || 'timeless joy'}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {safeConfig.settings.subtitle || 'Pure ghee. Jaggery. Just like Ammamma made.'}
                </p>

                {/* HEADER BADGES STRIP */}
                <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 no-scrollbar">
                  {safeConfig.settings.badges.map((b, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 shrink-0"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* BRASS THALI STAGE */}
              {previewProduct && (
                <div className="relative my-3 flex flex-col items-center">
                  {/* Outer Brass Thali Rim with Gold Shimmer */}
                  <div className="relative w-64 h-64 rounded-full p-2 bg-gradient-to-br from-[#E2B755] via-[#C99727] to-[#8C6207] shadow-xl flex items-center justify-center">
                    {/* Inner Brass Platter */}
                    <div className="w-full h-full rounded-full bg-gradient-to-b from-[#FFF5DD] via-[#F3E2B8] to-[#E5CCA0] border-4 border-[#C99727] shadow-inner flex flex-col items-center justify-center p-3 relative overflow-hidden">
                      {/* Traditional Thali Radial Lines */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#8C6207_1px,transparent_1px)] [background-size:12px_12px]" />

                      {/* Floating Gift Box Badge */}
                      {previewProduct.giftBox && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10">
                          <span className="inline-flex items-center gap-1 text-[8px] font-extrabold bg-[#B81D3B] text-white px-2 py-0.5 rounded-full shadow-md uppercase tracking-wider">
                            {safeConfig.settings.giftTag || '🎁 Gift box available'}
                          </span>
                        </div>
                      )}

                      {/* Sweet Product Image Floating on Thali */}
                      <div className="relative z-0 my-1">
                        <div className="h-28 w-28 rounded-full overflow-hidden border-2 border-white/60 shadow-lg bg-white/20">
                          <img
                            src={getDisplayImage(previewProduct.image)}
                            alt={previewProduct.name}
                            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Sweet Name & Tagline */}
                      <div className="text-center relative z-10 mt-1 max-w-[200px]">
                        <h4 className="text-xs font-bold text-slate-900 tracking-tight line-clamp-1">
                          {previewProduct.name}
                        </h4>
                        <p className="text-[9px] font-serif italic text-amber-950/80 line-clamp-1">
                          "{previewProduct.tagline}"
                        </p>
                      </div>

                      {/* Feature Tags on Thali */}
                      <div className="flex items-center justify-center gap-1 mt-1 z-10 flex-wrap">
                        {(previewProduct.tags || []).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[8px] font-bold px-1.5 py-0.2 rounded-full bg-white/80 text-amber-950 border border-amber-300 shadow-2xs"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Weight Selector & Price */}
                  <div className="w-full mt-3 px-2">
                    <div className="flex items-center justify-between mb-1 text-[10px]">
                      <span className="font-bold text-slate-700">Select Box:</span>
                      <span className="font-bold text-[#B81D3B]">
                        ₹{previewProduct.variants?.[0]?.price || 199}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      {(previewProduct.variants || []).map((v, i) => (
                        <div
                          key={i}
                          className="p-1 rounded-lg bg-white border border-slate-200 text-center text-[10px] font-bold text-slate-800 shadow-2xs"
                        >
                          <span>{v.label}</span> · <span className="text-[#B81D3B]">₹{v.price}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className="w-full mt-2 py-1.5 rounded-xl bg-[#B81D3B] text-white font-bold text-[10px] uppercase tracking-wider shadow hover:bg-[#9B1D22] transition-colors"
                    >
                      Add to Thali
                    </button>
                  </div>
                </div>
              )}

              {/* ROTATION INDICATOR DOTS */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {products.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSimulatedIdx(i);
                      setSelectedProductIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      (isSimulatingRotation ? simulatedIdx : selectedProductIdx) === i
                        ? 'w-5 bg-amber-600'
                        : 'w-1.5 bg-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Bottom Mock Tab Bar */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-around text-[9px] text-slate-400 font-medium">
                <span className="text-[#B81D3B] font-bold">🏠 Home</span>
                <span>🛍️ Store</span>
                <span>🎁 Rewards</span>
                <span>👤 Profile</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                  Live JSON Payload for <code className="font-mono text-amber-600">sweets</code>
                </h3>
                <p className="text-xs text-slate-500">
                  POST payload delivered to <code className="font-mono">/api/app_settings.php?doc_id=sweets</code>
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <pre className="flex-1 overflow-y-auto p-4 bg-slate-950 text-emerald-400 rounded-xl text-xs font-mono custom-scrollbar">
              {JSON.stringify({
                doc_id: "sweets",
                content: {
                  settings: safeConfig.settings,
                  products: safeConfig.products
                }
              }, null, 2)}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    doc_id: "sweets",
                    content: {
                      settings: safeConfig.settings,
                      products: safeConfig.products
                    }
                  }, null, 2));
                  toast.success('JSON copied to clipboard!');
                }}
              >
                Copy JSON
              </Button>
              <Button
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="bg-slate-900 text-white dark:bg-white dark:text-slate-900"
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
