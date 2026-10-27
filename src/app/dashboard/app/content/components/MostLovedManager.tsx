'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
  Flame, 
  Star, 
  Crown, 
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
  ExternalLink,
  Code2,
  Clock,
  Eye,
  ShoppingBag,
  TrendingUp,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export interface MostLovedVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface MostLovedProduct {
  id: string;
  name: string;
  short: string;
  tagline: string;
  image: string;
  colors: string[];
  rating: number;
  soldToday: number;
  loves: string;
  spice: number;
  badge: string;
  variants: MostLovedVariant[];
}

export interface MostLovedSettings {
  enabled: boolean;
  kicker: string;
  title: string;
  titleAccent: string;
  intervalMs: number;
  maxItems: number;
}

export interface MostLovedConfig {
  settings: MostLovedSettings;
  products: MostLovedProduct[];
}

export const DEFAULT_MOST_LOVED: MostLovedConfig = {
  settings: {
    enabled: true,
    kicker: "THE LOVE CHART",
    title: "Most loved",
    titleAccent: "products",
    intervalMs: 2500,
    maxItems: 10
  },
  products: [
    {
      id: "p1",
      name: "Bellam Avakaya",
      short: "Avakaya",
      tagline: "sweet jaggery meets fiery mango",
      image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
      colors: ["#F7B733", "#E2722B"],
      rating: 4.8,
      soldToday: 320,
      loves: "2.1k",
      spice: 2,
      badge: "👑 No.1 this week",
      variants: [
        { id: "v1", label: "250g", price: 120, mrp: 136, inStock: true },
        { id: "v2", label: "500g", price: 230, mrp: 260, inStock: true },
        { id: "v3", label: "1kg", price: 440, mrp: 500, inStock: true }
      ]
    },
    {
      id: "p2",
      name: "Idli Karam Podi",
      short: "Karam Podi",
      tagline: "authentic gun powder spice blend",
      image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
      colors: ["#8E1B2B", "#5C0A0D"],
      rating: 4.9,
      soldToday: 280,
      loves: "1.8k",
      spice: 3,
      badge: "🔥 Bestseller",
      variants: [
        { id: "v4", label: "200g", price: 139, mrp: 150, inStock: true },
        { id: "v5", label: "500g", price: 320, mrp: 350, inStock: true }
      ]
    }
  ]
};

const GRADIENT_PRESETS = [
  { name: 'Mango Sunset', colors: ['#F7B733', '#E2722B'], preview: 'from-[#F7B733] to-[#E2722B]' },
  { name: 'Heritage Maroon', colors: ['#8E1B2B', '#5C0A0D'], preview: 'from-[#8E1B2B] to-[#5C0A0D]' },
  { name: 'Royal Crimson', colors: ['#B81D3B', '#6B0F24'], preview: 'from-[#B81D3B] to-[#6B0F24]' },
  { name: 'Forest Herb', colors: ['#2A9D8F', '#1D6B62'], preview: 'from-[#2A9D8F] to-[#1D6B62]' },
  { name: 'Golden Jaggery', colors: ['#F4A261', '#E76F51'], preview: 'from-[#F4A261] to-[#E76F51]' },
  { name: 'Deep Plum', colors: ['#6B2D5C', '#3C1335'], preview: 'from-[#6B2D5C] to-[#3C1335]' },
  { name: 'Emerald Spice', colors: ['#18453B', '#0E2E27'], preview: 'from-[#18453B] to-[#0E2E27]' },
  { name: 'Saffron Glow', colors: ['#E65100', '#BF360C'], preview: 'from-[#E65100] to-[#BF360C]' }
];

const PRESET_BADGES = [
  "👑 No.1 this week",
  "🔥 Bestseller",
  "✨ Trending",
  "⭐ Customer Favorite",
  "🌶️ Fiery Hot",
  "🍯 Pure Jaggery",
  "👵 Grandmas Secret"
];

const IMAGE_PRESETS = [
  { label: 'Bellam Avakaya Pickle', path: 'assets/images/avakaya_pickle.png' },
  { label: 'Special Idli Karam Podi', path: 'assets/images/special_idli_karam_podi.png' },
  { label: 'Kara Murukku Strings', path: 'assets/images/chakralu.png' },
  { label: 'Khara Mixture', path: 'assets/images/mixture.png' },
  { label: 'Sunnunda Laddu', path: 'assets/images/sunnundalu.png' },
  { label: 'Special Kura Karam Podi', path: 'assets/images/special_kura_karam_podi.png' },
  { label: 'Potato Chips (Allu Chips)', path: 'assets/images/potato_chips.png' },
  { label: 'Dry Fruits Laddu', path: 'assets/images/dry_fruit_laddu.png' },
  { label: 'Gondh Laddu', path: 'assets/images/gond_laddu.png' },
  { label: 'Palli Chikki', path: 'assets/images/palli_chikki.png' }
];

interface MostLovedManagerProps {
  config: MostLovedConfig;
  onChange: (config: MostLovedConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function MostLovedManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: MostLovedManagerProps) {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [isSimulatingRotation, setIsSimulatingRotation] = useState<boolean>(true);
  const [simulatedIdx, setSimulatedIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: MostLovedConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      kicker: config?.settings?.kicker || 'THE LOVE CHART',
      title: config?.settings?.title || 'Most loved',
      titleAccent: config?.settings?.titleAccent || 'products',
      intervalMs: config?.settings?.intervalMs || 2500,
      maxItems: config?.settings?.maxItems || 10
    },
    products: Array.isArray(config?.products) && config.products.length > 0 
      ? config.products 
      : DEFAULT_MOST_LOVED.products
  };

  const currentProducts = safeConfig.products;
  const activeProduct = currentProducts[selectedProductIdx] || currentProducts[0];

  // Auto-rotation simulator for live phone preview
  useEffect(() => {
    if (!isSimulatingRotation || currentProducts.length <= 1) return;
    const interval = setInterval(() => {
      setSimulatedIdx(prev => (prev + 1) % currentProducts.length);
    }, Math.max(1000, safeConfig.settings.intervalMs || 2500));
    return () => clearInterval(interval);
  }, [isSimulatingRotation, currentProducts.length, safeConfig.settings.intervalMs]);

  // Keep simulator in sync if user clicks a product
  const previewProduct = isSimulatingRotation 
    ? (currentProducts[simulatedIdx] || activeProduct)
    : activeProduct;

  const getDisplayImage = (imgUrl?: string) => {
    if (!imgUrl) return '/assets/images/avakaya_pickle.png';
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  const updateSetting = (field: keyof MostLovedSettings, value: any) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [field]: value
      }
    });
  };

  const updateProduct = (idx: number, field: keyof MostLovedProduct, value: any) => {
    const updated = [...currentProducts];
    updated[idx] = { ...updated[idx], [field]: value };
    onChange({
      ...safeConfig,
      products: updated
    });
  };

  const updateProductColor = (prodIdx: number, colorIdx: number, value: string) => {
    const updated = [...currentProducts];
    const colors = [...(updated[prodIdx].colors || ['#F7B733', '#E2722B'])];
    colors[colorIdx] = value;
    updated[prodIdx] = { ...updated[prodIdx], colors };
    onChange({ ...safeConfig, products: updated });
  };

  const applyColorPreset = (prodIdx: number, colors: string[]) => {
    const updated = [...currentProducts];
    updated[prodIdx] = { ...updated[prodIdx], colors };
    onChange({ ...safeConfig, products: updated });
  };

  const addProduct = () => {
    const newId = `p${Date.now()}`;
    const newProduct: MostLovedProduct = {
      id: newId,
      name: 'New Heritage Delicacy',
      short: 'Delicacy',
      tagline: 'handcrafted with cold-pressed oil',
      image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      colors: ['#F7B733', '#E2722B'],
      rating: 4.9,
      soldToday: 180,
      loves: '1.5k',
      spice: 2,
      badge: '👑 No.1 this week',
      variants: [
        { id: `v1_${Date.now()}`, label: '250g', price: 139, mrp: 160, inStock: true },
        { id: `v2_${Date.now()}`, label: '500g', price: 260, mrp: 299, inStock: true }
      ]
    };
    const updated = [...currentProducts, newProduct];
    onChange({ ...safeConfig, products: updated });
    setSelectedProductIdx(currentProducts.length);
    toast.success('Product added to The Love Chart');
  };

  const removeProduct = (idx: number) => {
    if (currentProducts.length <= 1) {
      toast.error('You must keep at least 1 product in The Love Chart.');
      return;
    }
    const updated = currentProducts.filter((_, i) => i !== idx);
    onChange({ ...safeConfig, products: updated });
    setSelectedProductIdx(0);
    toast.success('Product removed');
  };

  const moveProduct = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= currentProducts.length) return;
    const updated = [...currentProducts];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ ...safeConfig, products: updated });
    setSelectedProductIdx(targetIdx);
  };

  const addVariant = (prodIdx: number) => {
    const updated = [...currentProducts];
    const cur = updated[prodIdx];
    const newV: MostLovedVariant = {
      id: `v_${Date.now()}`,
      label: '1kg',
      price: 499,
      mrp: 550,
      inStock: true
    };
    updated[prodIdx] = {
      ...cur,
      variants: [...(cur.variants || []), newV]
    };
    onChange({ ...safeConfig, products: updated });
    toast.success('Variant added');
  };

  const updateVariant = (prodIdx: number, variantIdx: number, field: keyof MostLovedVariant, val: any) => {
    const updated = [...currentProducts];
    const cur = updated[prodIdx];
    const variants = [...(cur.variants || [])];
    variants[variantIdx] = { ...variants[variantIdx], [field]: val };
    updated[prodIdx] = { ...cur, variants };
    onChange({ ...safeConfig, products: updated });
  };

  const removeVariant = (prodIdx: number, variantIdx: number) => {
    const updated = [...currentProducts];
    const cur = updated[prodIdx];
    if (cur.variants && cur.variants.length <= 1) {
      toast.error('Each product must have at least 1 variant.');
      return;
    }
    const variants = (cur.variants || []).filter((_, i) => i !== variantIdx);
    updated[prodIdx] = { ...cur, variants };
    onChange({ ...safeConfig, products: updated });
    setSelectedVariantIdx(0);
    toast.success('Variant removed');
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <Card className="border-rose-200 dark:border-rose-900/50 bg-gradient-to-r from-rose-50/50 via-white to-amber-50/30 dark:from-slate-900 dark:to-slate-950 shadow-sm">
        <CardHeader className="pb-4 border-b border-rose-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center ring-1 ring-rose-500/20">
                  <Heart className="h-5 w-5 fill-rose-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      The Love Chart — Most Loved Products
                    </CardTitle>
                    <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Stream Sync
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Connects directly to Flutter's <code className="font-mono text-rose-600 dark:text-rose-400">AppConfigRepository().getMostLovedStream()</code>. Updates live on mobile screens without requiring an app reload.
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
                className="bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs shadow-sm shadow-rose-500/20"
              >
                <Save className="h-3.5 w-3.5 mr-1.5" />
                {isSaving ? 'Publishing...' : 'Publish to App'}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* SECTION GLOBAL SETTINGS */}
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Section Visibility
              </label>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {safeConfig.settings.enabled ? 'Enabled in App' : 'Hidden in App'}
                </span>
                <input
                  type="checkbox"
                  checked={safeConfig.settings.enabled}
                  onChange={e => updateSetting('enabled', e.target.checked)}
                  className="h-4 w-4 rounded accent-rose-600 cursor-pointer"
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
                placeholder="THE LOVE CHART"
                className="h-8 text-xs font-mono font-medium"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Main Title
              </label>
              <Input
                value={safeConfig.settings.title}
                onChange={e => updateSetting('title', e.target.value)}
                placeholder="Most loved"
                className="h-8 text-xs font-medium"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Title Accent
              </label>
              <Input
                value={safeConfig.settings.titleAccent}
                onChange={e => updateSetting('titleAccent', e.target.value)}
                placeholder="products"
                className="h-8 text-xs font-medium text-rose-600"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Rotation Interval
                </label>
                <span className="text-[11px] font-mono text-rose-600 font-bold">
                  {safeConfig.settings.intervalMs}ms
                </span>
              </div>
              <Input
                type="number"
                step="250"
                min="1000"
                max="10000"
                value={safeConfig.settings.intervalMs}
                onChange={e => updateSetting('intervalMs', parseInt(e.target.value) || 2500)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PRODUCT LIST & EDITOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* PRODUCT SELECTOR TABS */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
            <div className="flex items-center gap-2">
              {currentProducts.map((p, idx) => {
                const isSelected = selectedProductIdx === idx;
                const c1 = p.colors?.[0] || '#F7B733';
                const c2 = p.colors?.[1] || '#E2722B';
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
                        ? 'bg-white dark:bg-slate-900 border-rose-500 text-slate-900 dark:text-white shadow-sm ring-2 ring-rose-500/20'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <span 
                      className="h-4 w-4 rounded-full shrink-0 shadow-inner" 
                      style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}
                    />
                    <span className="font-semibold">{`#${idx + 1} ${p.short || p.name}`}</span>
                    <span className="text-[10px] bg-rose-50 dark:bg-rose-950/50 text-rose-600 font-bold px-1.5 py-0.5 rounded">
                      ❤️ {p.loves}
                    </span>
                  </button>
                );
              })}
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={addProduct}
              className="text-xs shrink-0 border-dashed border-rose-300 dark:border-rose-900 text-rose-600 hover:bg-rose-50"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Product
            </Button>
          </div>

          {/* ACTIVE PRODUCT EDITOR */}
          {activeProduct && (
            <div className="space-y-4">
              {/* Product Header & Actions */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    Editing Product #{selectedProductIdx + 1}:
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
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
                    title="Move Rank Up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={selectedProductIdx === currentProducts.length - 1}
                    onClick={() => moveProduct(selectedProductIdx, 'down')}
                    className="h-7 w-7 p-0"
                    title="Move Rank Down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProduct(selectedProductIdx)}
                    className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                    title="Delete Product"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* CARD 1: PRODUCT IDENTITY & COPY */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Tag className="h-4 w-4 text-rose-600" />
                    Product Identity & Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Full Product Name
                      </label>
                      <Input
                        value={activeProduct.name}
                        onChange={e => updateProduct(selectedProductIdx, 'name', e.target.value)}
                        placeholder="Bellam Avakaya"
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                        Short Tile Title
                      </label>
                      <Input
                        value={activeProduct.short}
                        onChange={e => updateProduct(selectedProductIdx, 'short', e.target.value)}
                        placeholder="Avakaya"
                        className="h-8 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Tagline / Poetic Description
                    </label>
                    <Input
                      value={activeProduct.tagline}
                      onChange={e => updateProduct(selectedProductIdx, 'tagline', e.target.value)}
                      placeholder="sweet jaggery meets fiery mango"
                      className="h-8 text-xs font-serif italic text-slate-700 dark:text-slate-300"
                    />
                  </div>

                  {/* Badge & Quick Badge Presets */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Highlight Badge
                      </label>
                      <span className="text-[10px] text-slate-400">Shown at top of mobile card</span>
                    </div>
                    <Input
                      value={activeProduct.badge}
                      onChange={e => updateProduct(selectedProductIdx, 'badge', e.target.value)}
                      placeholder="👑 No.1 this week"
                      className="h-8 text-xs font-medium"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {PRESET_BADGES.map(badge => (
                        <button
                          key={badge}
                          type="button"
                          onClick={() => updateProduct(selectedProductIdx, 'badge', badge)}
                          className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                            activeProduct.badge === badge
                              ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 font-bold'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700'
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metrics: Loves, Spice, Rating, Sold */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                        ❤️ Loves Count
                      </label>
                      <Input
                        value={activeProduct.loves}
                        onChange={e => updateProduct(selectedProductIdx, 'loves', e.target.value)}
                        placeholder="2.1k"
                        className="h-8 text-xs font-bold text-rose-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                        ⭐ Rating (0-5)
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={activeProduct.rating}
                        onChange={e => updateProduct(selectedProductIdx, 'rating', parseFloat(e.target.value) || 4.8)}
                        className="h-8 text-xs font-bold text-amber-600"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                        🔥 Sold Today
                      </label>
                      <Input
                        type="number"
                        value={activeProduct.soldToday}
                        onChange={e => updateProduct(selectedProductIdx, 'soldToday', parseInt(e.target.value) || 0)}
                        placeholder="320"
                        className="h-8 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 uppercase block mb-1">
                        🌶️ Spice (0-5)
                      </label>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4, 5].map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updateProduct(selectedProductIdx, 'spice', lvl)}
                            className={`h-7 flex-1 rounded text-[11px] font-bold border ${
                              activeProduct.spice === lvl
                                ? 'bg-red-500 text-white border-red-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-800'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 2: GRADIENT THEME & IMAGE */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Palette className="h-4 w-4 text-amber-600" />
                    Gradient Background & Product Image
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Image Path & Presets */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Image Path / URL
                    </label>
                    <div className="flex gap-2 items-center">
                      <Input
                        value={activeProduct.image}
                        onChange={e => updateProduct(selectedProductIdx, 'image', e.target.value)}
                        placeholder="assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
                        className="h-8 text-xs font-mono flex-1"
                      />
                      <img
                        src={getDisplayImage(activeProduct.image)}
                        alt="Preview"
                        className="h-8 w-8 rounded-lg object-cover border shrink-0 bg-white"
                      />
                    </div>

                    <div className="mt-2">
                      <span className="text-[10px] text-slate-400 block mb-1">Suggested Asset Presets:</span>
                      <div className="flex flex-wrap gap-1.5">
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
                  </div>

                  {/* Gradient Colors */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      Card Dual-Color Gradient
                    </label>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Color 1 (Top Left)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeProduct.colors?.[0] || '#F7B733'}
                            onChange={e => updateProductColor(selectedProductIdx, 0, e.target.value)}
                            className="h-8 w-12 rounded border cursor-pointer p-0.5 bg-white"
                          />
                          <Input
                            value={activeProduct.colors?.[0] || '#F7B733'}
                            onChange={e => updateProductColor(selectedProductIdx, 0, e.target.value)}
                            className="h-8 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-500 block mb-1">Color 2 (Bottom Right)</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={activeProduct.colors?.[1] || '#E2722B'}
                            onChange={e => updateProductColor(selectedProductIdx, 1, e.target.value)}
                            className="h-8 w-12 rounded border cursor-pointer p-0.5 bg-white"
                          />
                          <Input
                            value={activeProduct.colors?.[1] || '#E2722B'}
                            onChange={e => updateProductColor(selectedProductIdx, 1, e.target.value)}
                            className="h-8 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Gradient Preset Palette */}
                    <div>
                      <span className="text-[10px] text-slate-400 block mb-1.5">Curated Palette Presets:</span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {GRADIENT_PRESETS.map((preset, pIdx) => {
                          const isActive = 
                            activeProduct.colors?.[0]?.toUpperCase() === preset.colors[0].toUpperCase() &&
                            activeProduct.colors?.[1]?.toUpperCase() === preset.colors[1].toUpperCase();
                          return (
                            <button
                              key={pIdx}
                              type="button"
                              onClick={() => applyColorPreset(selectedProductIdx, preset.colors)}
                              className={`flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all ${
                                isActive
                                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 ring-1 ring-rose-500/20'
                                  : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                              }`}
                            >
                              <div
                                className="h-5 w-5 rounded-md shadow-inner shrink-0"
                                style={{ background: `linear-gradient(135deg, ${preset.colors[0]}, ${preset.colors[1]})` }}
                              />
                              <span className="text-[11px] font-medium truncate text-slate-700 dark:text-slate-300">
                                {preset.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CARD 3: VARIANTS & PRICING */}
              <Card className="border-slate-200 dark:border-slate-800">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-emerald-600" />
                    Weight Variants & Stock ({activeProduct.variants?.length || 0})
                  </CardTitle>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => addVariant(selectedProductIdx)}
                    className="h-7 text-xs border-dashed text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Variant
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
                              Weight/Label
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

        {/* RIGHT COLUMN: FLUTTER MOBILE APP LIVE SIMULATOR (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-rose-600" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Live Flutter App Preview
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsSimulatingRotation(!isSimulatingRotation)}
              className={`text-[11px] px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                isSimulatingRotation
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Clock className="h-3 w-3" />
              <span>{isSimulatingRotation ? 'Auto-Rotating' : 'Paused'}</span>
            </button>
          </div>

          {/* PHONE FRAME */}
          <div className="w-full max-w-[340px] mx-auto bg-slate-900 rounded-[36px] p-3 shadow-2xl ring-1 ring-slate-800/80">
            {/* Phone Screen Notch & Status */}
            <div className="flex items-center justify-between px-4 py-1.5 text-[10px] text-slate-400 font-mono">
              <span>9:41</span>
              <div className="h-4 w-16 bg-slate-800 rounded-full" />
              <span>5G 100%</span>
            </div>

            {/* SCREEN VIEWPORT */}
            <div className="bg-[#FAF7F2] text-slate-900 rounded-[28px] overflow-hidden p-4 min-h-[520px] flex flex-col justify-between select-none">
              {/* SECTION HEADER AS RENDERED IN FLUTTER */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold tracking-widest text-[#B81D3B] uppercase font-mono">
                    {safeConfig.settings.kicker || 'THE LOVE CHART'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {simulatedIdx + 1} of {currentProducts.length}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {safeConfig.settings.title || 'Most loved'}{' '}
                  <span className="text-[#B81D3B] italic">
                    {safeConfig.settings.titleAccent || 'products'}
                  </span>
                </h3>
              </div>

              {/* CARD PREVIEW */}
              {previewProduct && (
                <div 
                  className="rounded-2xl p-4 my-3 text-white shadow-lg transition-all duration-500 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${previewProduct.colors?.[0] || '#F7B733'}, ${previewProduct.colors?.[1] || '#E2722B'})`
                  }}
                >
                  {/* Floating Badge Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-md text-white border border-white/30 shadow-sm">
                      {previewProduct.badge || '👑 No.1 this week'}
                    </span>

                    {/* Loves Floating Heart */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-black/25 backdrop-blur-md text-rose-200">
                      <Heart className="h-2.5 w-2.5 fill-rose-400 text-rose-400 animate-pulse" />
                      {previewProduct.loves || '2.1k'}
                    </span>
                  </div>

                  {/* Centered Product Image Floating */}
                  <div className="relative py-2 flex justify-center">
                    <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white/30 shadow-xl bg-white/10 shrink-0">
                      <img
                        src={getDisplayImage(previewProduct.image)}
                        alt={previewProduct.name}
                        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Product Titles & Info */}
                  <div className="text-center mt-2">
                    <h4 className="text-base font-bold tracking-tight text-white drop-shadow-sm">
                      {previewProduct.name}
                    </h4>
                    <p className="text-[11px] font-serif italic text-white/90 line-clamp-1 mt-0.5">
                      "{previewProduct.tagline}"
                    </p>
                  </div>

                  {/* Rating, Sold, Spice Row */}
                  <div className="flex items-center justify-center gap-3 text-[10px] mt-2.5 pt-2 border-t border-white/20 font-medium">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-2.5 w-2.5 fill-amber-300 text-amber-300" />
                      {previewProduct.rating || 4.8}
                    </span>
                    <span>•</span>
                    <span>{previewProduct.soldToday || 320} bought today</span>
                    <span>•</span>
                    <span className="flex items-center">
                      {Array.from({ length: previewProduct.spice || 2 }).map((_, i) => (
                        <span key={i}>🌶️</span>
                      ))}
                    </span>
                  </div>

                  {/* Variants Selector Chips */}
                  <div className="mt-3">
                    <span className="text-[9px] uppercase tracking-wider text-white/75 font-semibold block mb-1 text-center">
                      Available Weights
                    </span>
                    <div className="flex items-center justify-center gap-1.5 flex-wrap">
                      {(previewProduct.variants || []).map((v, i) => (
                        <div
                          key={i}
                          className="px-2 py-0.5 rounded-lg bg-black/30 backdrop-blur-sm text-[10px] font-bold text-white border border-white/20"
                        >
                          {v.label} · ₹{v.price}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Add to Cart CTA */}
                  <button
                    type="button"
                    className="w-full mt-3 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-slate-100 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              )}

              {/* ROTATION INDICATOR DOTS */}
              <div className="flex items-center justify-center gap-1.5 py-1">
                {currentProducts.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSimulatedIdx(i);
                      setSelectedProductIdx(i);
                    }}
                    className={`h-1.5 rounded-full transition-all ${
                      (isSimulatingRotation ? simulatedIdx : selectedProductIdx) === i
                        ? 'w-5 bg-rose-600'
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
                  Live JSON Payload for <code className="font-mono text-rose-600">most_loved</code>
                </h3>
                <p className="text-xs text-slate-500">
                  POST payload delivered to <code className="font-mono">/api/app_settings.php?doc_id=most_loved</code>
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
                doc_id: "most_loved",
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
                    doc_id: "most_loved",
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
