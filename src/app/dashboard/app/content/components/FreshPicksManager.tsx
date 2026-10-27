'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  Tag, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Smartphone, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  ShoppingBag, 
  Check, 
  Package, 
  Layers, 
  Play, 
  Pause,
  ChevronLeft,
  ChevronRight,
  Utensils
} from 'lucide-react';
import { toast } from 'sonner';

export interface FPVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface FPProduct {
  id: string;
  name: string;
  tagline: string;
  image: string;
  madeLabel: string;
  batch: string;
  badge: string;
  variants: FPVariant[];
}

export interface FreshPicksSettings {
  enabled: boolean;
  kicker: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  intervalMs: number;
}

export interface FreshPicksConfig {
  settings: FreshPicksSettings;
  products: FPProduct[];
}

export const DEFAULT_FRESH_PICKS: FreshPicksConfig = {
  settings: {
    enabled: true,
    kicker: 'FRESH OFF THE STOVE',
    title: 'Fresh picks,',
    titleAccent: 'just for you',
    subtitle: "new from Amma's kitchen this week",
    intervalMs: 3400
  },
  products: [
    {
      id: 'p1',
      name: 'Chakralu',
      tagline: 'Sankranti spiral snack, made with pure rice flour',
      image: 'assets/images/chakralu.png',
      madeLabel: 'Made today, 6 AM',
      batch: 'Batch #24',
      badge: 'NEW',
      variants: [
        { id: 'v1', label: '250g', price: 100, mrp: 115, inStock: true },
        { id: 'v2', label: '500g', price: 190, mrp: 220, inStock: true }
      ]
    },
    {
      id: 'p2',
      name: 'Special Idli Karam Podi',
      tagline: 'freshly roasted lentils & Guntur red chillies',
      image: 'assets/images/special_idli_karam_podi.png',
      madeLabel: 'Made today, 7 AM',
      batch: 'Batch #25',
      badge: 'HOT',
      variants: [
        { id: 'v3', label: '100g', price: 85, mrp: 95, inStock: true },
        { id: 'v4', label: '250g', price: 190, mrp: 210, inStock: true }
      ]
    },
    {
      id: 'p3',
      name: 'Sunnunda Laddu',
      tagline: 'roasted urad dal & organic bellam with pure desi ghee',
      image: 'assets/images/sunnundalu.png',
      madeLabel: 'Made today, 5:30 AM',
      batch: 'Batch #26',
      badge: "AMMA'S SPECIAL",
      variants: [
        { id: 'v5', label: '250g', price: 199, mrp: 220, inStock: true },
        { id: 'v6', label: '500g', price: 380, mrp: 420, inStock: true }
      ]
    },
    {
      id: 'p4',
      name: 'Nuvvula Papad',
      tagline: 'hand-rolled sesame papadums sun-dried on terrace',
      image: 'assets/images/nuvvula_papad.png',
      madeLabel: 'Sun-dried yesterday',
      batch: 'Batch #27',
      badge: 'CRISP',
      variants: [
        { id: 'v7', label: '200g', price: 110, mrp: 125, inStock: true },
        { id: 'v8', label: '400g', price: 210, mrp: 240, inStock: true }
      ]
    }
  ]
};

const IMAGE_PRESETS = [
  { label: 'Chakralu', path: 'assets/images/chakralu.png' },
  { label: 'Idli Karam Podi', path: 'assets/images/special_idli_karam_podi.png' },
  { label: 'Sunnundalu', path: 'assets/images/sunnundalu.png' },
  { label: 'Nuvvula Papad', path: 'assets/images/nuvvula_papad.png' },
  { label: 'Karam Boondi', path: 'assets/images/karam_boondi.png' },
  { label: 'Mixture', path: 'assets/images/mixture.png' },
  { label: 'Potato Chips', path: 'assets/images/potato_chips.png' },
  { label: 'Biyyam Vadiyalu', path: 'assets/images/biyyam_vadiyalu.png' },
  { label: 'Tomato Appadalu', path: 'assets/images/tomato_appadalu.png' },
  { label: 'Avakaya Pickle', path: 'assets/images/avakaya_pickle.png' },
  { label: 'Gulab Jamun', path: 'assets/images/gulab_jamun.png' },
  { label: 'Dry Fruit Laddu', path: 'assets/images/dry_fruit_laddu.png' }
];

const SUGGESTED_MADE_LABELS = [
  'Made today, 6 AM',
  'Made today, 7 AM',
  'Fresh batch at dawn',
  'Made fresh today',
  'Sun-dried yesterday',
  'Freshly pounded'
];

const SUGGESTED_BADGES = [
  'NEW',
  'HOT',
  "AMMA'S SPECIAL",
  'CRISP',
  'FRESH BATCH',
  'LIMITED'
];

interface FreshPicksManagerProps {
  config: FreshPicksConfig;
  onChange: (config: FreshPicksConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function FreshPicksManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: FreshPicksManagerProps) {
  const [selectedProductIdx, setSelectedProductIdx] = useState<number>(0);
  const [isSimulatingRotation, setIsSimulatingRotation] = useState<boolean>(true);
  const [simulatedIdx, setSimulatedIdx] = useState<number>(0);
  const [selectedSimVariantIdx, setSelectedSimVariantIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: FreshPicksConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      kicker: config?.settings?.kicker || 'FRESH OFF THE STOVE',
      title: config?.settings?.title || 'Fresh picks,',
      titleAccent: config?.settings?.titleAccent || 'just for you',
      subtitle: config?.settings?.subtitle || "new from Amma's kitchen this week",
      intervalMs: config?.settings?.intervalMs || 3400
    },
    products: Array.isArray(config?.products) && config.products.length > 0
      ? config.products
      : DEFAULT_FRESH_PICKS.products
  };

  // Safe Index bounds
  const currentProduct: FPProduct = safeConfig.products[selectedProductIdx] || safeConfig.products[0] || {
    id: 'p1',
    name: 'Chakralu',
    tagline: 'Sankranti spiral snack',
    image: 'assets/images/chakralu.png',
    madeLabel: 'Made today, 6 AM',
    batch: 'Batch #24',
    badge: 'NEW',
    variants: [{ id: 'v1', label: '250g', price: 100, mrp: 115, inStock: true }]
  };

  const simProduct: FPProduct = safeConfig.products[simulatedIdx] || safeConfig.products[0] || currentProduct;

  // Auto-rotation simulator for live phone preview
  useEffect(() => {
    if (!isSimulatingRotation || safeConfig.products.length <= 1) return;
    const interval = setInterval(() => {
      setSimulatedIdx(prev => (prev + 1) % safeConfig.products.length);
      setSelectedSimVariantIdx(0);
    }, Math.max(2500, safeConfig.settings.intervalMs || 3400));
    return () => clearInterval(interval);
  }, [isSimulatingRotation, safeConfig.products.length, safeConfig.settings.intervalMs]);

  // Update Settings
  const updateSettings = <K extends keyof FreshPicksSettings>(key: K, value: FreshPicksSettings[K]) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [key]: value
      }
    });
  };

  // Update current product
  const updateProduct = <K extends keyof FPProduct>(key: K, value: FPProduct[K]) => {
    const updated = [...safeConfig.products];
    if (!updated[selectedProductIdx]) return;
    updated[selectedProductIdx] = {
      ...updated[selectedProductIdx],
      [key]: value
    };
    onChange({
      ...safeConfig,
      products: updated
    });
  };

  // Add Product
  const handleAddProduct = () => {
    const newId = `p${Date.now()}`;
    const newProduct: FPProduct = {
      id: newId,
      name: 'Special Kura Karam Podi',
      tagline: 'authentic all-purpose Andhra curry powder',
      image: 'assets/images/special_kura_karam_podi.png',
      madeLabel: 'Made today, 8 AM',
      batch: `Batch #${safeConfig.products.length + 20}`,
      badge: 'NEW',
      variants: [
        { id: `v_${Date.now()}_1`, label: '250g', price: 135, mrp: 155, inStock: true },
        { id: `v_${Date.now()}_2`, label: '500g', price: 260, mrp: 295, inStock: true }
      ]
    };
    onChange({
      ...safeConfig,
      products: [...safeConfig.products, newProduct]
    });
    setSelectedProductIdx(safeConfig.products.length);
    toast.success('Added new product to Fresh Picks!');
  };

  // Delete Product
  const handleDeleteProduct = (idx: number) => {
    if (safeConfig.products.length <= 1) {
      toast.error('You must keep at least 1 product in Fresh Picks.');
      return;
    }
    const updated = safeConfig.products.filter((_, i) => i !== idx);
    onChange({
      ...safeConfig,
      products: updated
    });
    if (selectedProductIdx >= updated.length) {
      setSelectedProductIdx(Math.max(0, updated.length - 1));
    }
    if (simulatedIdx >= updated.length) {
      setSimulatedIdx(0);
    }
    toast.success('Product removed from Fresh Picks');
  };

  // Move Product
  const handleMoveProduct = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= safeConfig.products.length) return;
    const updated = [...safeConfig.products];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({
      ...safeConfig,
      products: updated
    });
    setSelectedProductIdx(targetIdx);
  };

  // Variants management
  const updateVariant = (variantIdx: number, key: keyof FPVariant, value: any) => {
    const updatedVariants = [...currentProduct.variants];
    updatedVariants[variantIdx] = {
      ...updatedVariants[variantIdx],
      [key]: value
    };
    updateProduct('variants', updatedVariants);
  };

  const addVariant = () => {
    const newVariant: FPVariant = {
      id: `v_${Date.now()}`,
      label: '1kg',
      price: 360,
      mrp: 400,
      inStock: true
    };
    updateProduct('variants', [...currentProduct.variants, newVariant]);
  };

  const removeVariant = (variantIdx: number) => {
    if (currentProduct.variants.length <= 1) {
      toast.error('Product must have at least 1 weight variant.');
      return;
    }
    updateProduct(
      'variants',
      currentProduct.variants.filter((_, i) => i !== variantIdx)
    );
  };

  // Helper to format image paths
  const getDisplayImage = (img: string) => {
    if (!img) return '/assets/images/chakralu.png';
    if (img.startsWith('http')) return img;
    const clean = img.startsWith('/') ? img : `/${img}`;
    return clean;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Header Card */}
      <Card className="border-orange-200 dark:border-orange-950/40 bg-gradient-to-r from-orange-50/60 via-amber-50/30 to-white dark:from-slate-900 dark:to-slate-950 shadow-sm overflow-hidden">
        <CardHeader className="pb-4 border-b border-orange-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-orange-600 text-white flex items-center justify-center shadow-md">
                <Flame className="h-5 w-5 fill-amber-300" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100">
                  Fresh Picks from Amma's Kitchen
                  <span className="bg-orange-500/15 text-orange-700 dark:text-orange-300 border border-orange-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {safeConfig.settings.enabled ? 'Live On App' : 'Disabled'}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 mt-0.5">
                  Live animated stage in the app where freshly made batches rise from Amma's hot brass kadai with time stamps and instant add-to-cart.
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto shrink-0 flex-wrap">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowJsonModal(true)}
              className="text-xs h-9"
            >
              <Code2 className="h-3.5 w-3.5 mr-1.5" />
              JSON Payload
            </Button>

            {onResetDefaults && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onResetDefaults}
                className="text-xs h-9 text-slate-600 hover:text-orange-600"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                Reset Defaults
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              disabled={isSaving}
              onClick={onSave}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-9 shadow-md px-5"
            >
              <Save className="h-4 w-4 mr-1.5" />
              {isSaving ? 'Publishing...' : 'Save Fresh Picks'}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-orange-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block">Live Section Status</span>
            <span className={`font-bold text-sm ${safeConfig.settings.enabled ? 'text-emerald-600' : 'text-slate-400'}`}>
              {safeConfig.settings.enabled ? 'Active on Home Screen' : 'Disabled'}
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-orange-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block">Products in Kadai</span>
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
              {safeConfig.products.length} Delicacies
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-orange-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block">Stove Stage Theme</span>
            <span className="font-bold text-sm text-amber-700 dark:text-amber-400">
              Brass Kadai & Fire Glow
            </span>
          </div>
          <div className="bg-white/80 dark:bg-slate-900/80 p-3 rounded-lg border border-orange-100 dark:border-slate-800">
            <span className="text-slate-500 text-[11px] block">Rotation Interval</span>
            <span className="font-bold text-sm text-orange-600">
              {(safeConfig.settings.intervalMs / 1000).toFixed(1)}s per item
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main 2-Column Workspace */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Editor Controls (7 cols) */}
        <div className="xl:col-span-7 space-y-6">
          {/* Section Settings Accordion Card */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  Section Branding & Auto-Rotation
                </CardTitle>
                <div className="flex items-center gap-2">
                  <label htmlFor="fp-enabled" className="text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                    Enable in App:
                  </label>
                  <input
                    type="checkbox"
                    id="fp-enabled"
                    checked={safeConfig.settings.enabled}
                    onChange={e => updateSettings('enabled', e.target.checked)}
                    className="w-4 h-4 accent-orange-600 cursor-pointer"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Top Kicker (Category Pill)
                  </label>
                  <Input
                    value={safeConfig.settings.kicker}
                    onChange={e => updateSettings('kicker', e.target.value)}
                    placeholder="FRESH OFF THE STOVE"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Kadai Cycle Interval (seconds)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={2500}
                      max={8000}
                      step={100}
                      value={safeConfig.settings.intervalMs}
                      onChange={e => updateSettings('intervalMs', Number(e.target.value))}
                      className="text-xs h-9"
                    />
                    <span className="text-xs text-slate-500 whitespace-nowrap">
                      {(safeConfig.settings.intervalMs / 1000).toFixed(1)}s
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Main Title
                  </label>
                  <Input
                    value={safeConfig.settings.title}
                    onChange={e => updateSettings('title', e.target.value)}
                    placeholder="Fresh picks,"
                    className="text-xs h-9"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Title Accent (Orange / Highlight)
                  </label>
                  <Input
                    value={safeConfig.settings.titleAccent}
                    onChange={e => updateSettings('titleAccent', e.target.value)}
                    placeholder="just for you"
                    className="text-xs h-9"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                    Subtitle (Amma's tagline)
                  </label>
                  <Input
                    value={safeConfig.settings.subtitle}
                    onChange={e => updateSettings('subtitle', e.target.value)}
                    placeholder="new from Amma's kitchen this week"
                    className="text-xs h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Items Selector Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-orange-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Kadai Delicacies ({safeConfig.products.length})
                </h4>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleAddProduct}
                className="text-xs h-8 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add New Kadai Item
              </Button>
            </div>

            {/* Product selection pill tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 custom-scrollbar">
              {safeConfig.products.map((p, idx) => (
                <button
                  key={p.id || idx}
                  type="button"
                  onClick={() => {
                    setSelectedProductIdx(idx);
                    setSimulatedIdx(idx);
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shrink-0 border ${
                    selectedProductIdx === idx
                      ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-300'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-orange-950/20 shrink-0 border border-white/30">
                    <img
                      src={getDisplayImage(p.image)}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/assets/images/chakralu.png';
                      }}
                    />
                  </div>
                  <span>{p.name || `Item ${idx + 1}`}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedProductIdx === idx ? 'bg-orange-700 text-amber-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {p.badge || 'NEW'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Active Product Editor Card */}
          <Card className="border-orange-200/80 dark:border-orange-900/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 bg-orange-50/30 dark:bg-slate-900/50 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-orange-600" />
                  Editing Item #{selectedProductIdx + 1}: {currentProduct.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Configure freshness stamps, batch tags, photo, and pricing variants.
                </CardDescription>
              </div>

              {/* Action Buttons: Move & Delete */}
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={selectedProductIdx === 0}
                  onClick={() => handleMoveProduct(selectedProductIdx, 'up')}
                  className="h-8 w-8 p-0"
                  title="Move Up in Rotation"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={selectedProductIdx === safeConfig.products.length - 1}
                  onClick={() => handleMoveProduct(selectedProductIdx, 'down')}
                  className="h-8 w-8 p-0"
                  title="Move Down in Rotation"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProduct(selectedProductIdx)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
                  title="Remove from Fresh Picks"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={currentProduct.name}
                    onChange={e => updateProduct('name', e.target.value)}
                    placeholder="e.g. Chakralu"
                    className="text-xs h-9 font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Batch Tag
                  </label>
                  <Input
                    value={currentProduct.batch}
                    onChange={e => updateProduct('batch', e.target.value)}
                    placeholder="e.g. Batch #24"
                    className="text-xs h-9 font-mono"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Tagline / Story
                  </label>
                  <Input
                    value={currentProduct.tagline}
                    onChange={e => updateProduct('tagline', e.target.value)}
                    placeholder="e.g. Sankranti spiral snack, made with pure rice flour"
                    className="text-xs h-9"
                  />
                </div>

                {/* Freshness Timestamp Stamp */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-orange-600" />
                      Made Timestamp Stamp
                    </label>
                  </div>
                  <Input
                    value={currentProduct.madeLabel}
                    onChange={e => updateProduct('madeLabel', e.target.value)}
                    placeholder="e.g. Made today, 6 AM"
                    className="text-xs h-9"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {SUGGESTED_MADE_LABELS.map(lbl => (
                      <button
                        key={lbl}
                        type="button"
                        onClick={() => updateProduct('madeLabel', lbl)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                          currentProduct.madeLabel === lbl
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-orange-50'
                        }`}
                      >
                        {lbl}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Badge Tag */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Tag className="h-3.5 w-3.5 text-orange-600" />
                    Top Promo Badge
                  </label>
                  <Input
                    value={currentProduct.badge}
                    onChange={e => updateProduct('badge', e.target.value)}
                    placeholder="e.g. NEW, HOT, AMMA'S SPECIAL"
                    className="text-xs h-9 uppercase font-bold"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {SUGGESTED_BADGES.map(b => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => updateProduct('badge', b)}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition uppercase font-bold ${
                          currentProduct.badge === b
                            ? 'bg-amber-500 text-slate-950 border-amber-500'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-amber-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Authentic Image Selector */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>Authentic AmbhuJakshi Product Photo</span>
                  <span className="text-[10px] text-slate-400 font-mono">{currentProduct.image}</span>
                </label>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl border-2 border-orange-300 dark:border-orange-800 overflow-hidden bg-slate-900 shrink-0 shadow-sm">
                    <img
                      src={getDisplayImage(currentProduct.image)}
                      alt={currentProduct.name}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).src = '/assets/images/chakralu.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      value={currentProduct.image}
                      onChange={e => updateProduct('image', e.target.value)}
                      placeholder="assets/images/chakralu.png"
                      className="text-xs h-9 font-mono"
                    />
                  </div>
                </div>

                {/* Quick Presets with Authentic Brass Bowl Photography */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] text-slate-500">Quick AmbhuJakshi Authentic Presets:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto custom-scrollbar p-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800">
                    {IMAGE_PRESETS.map(preset => (
                      <button
                        key={preset.path}
                        type="button"
                        onClick={() => updateProduct('image', preset.path)}
                        className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1.5 transition ${
                          currentProduct.image === preset.path
                            ? 'bg-orange-600 text-white border-orange-600 font-bold'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-300'
                        }`}
                      >
                        <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0 border border-black/10">
                          <img src={getDisplayImage(preset.path)} alt="" className="w-full h-full object-cover" />
                        </div>
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weight Variants & Pricing Table */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-orange-600" />
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Weight Variants & Pricing
                    </h5>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    className="text-xs h-7 border-dashed border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Variant
                  </Button>
                </div>

                <div className="space-y-2">
                  {currentProduct.variants.map((v, vIdx) => (
                    <div
                      key={v.id || vIdx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 grid grid-cols-12 gap-2.5 items-center"
                    >
                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block mb-0.5">Weight / Unit</label>
                        <Input
                          value={v.label}
                          onChange={e => updateVariant(vIdx, 'label', e.target.value)}
                          placeholder="250g"
                          className="text-xs h-8 font-medium"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block mb-0.5">Price (₹)</label>
                        <Input
                          type="number"
                          value={v.price}
                          onChange={e => updateVariant(vIdx, 'price', Number(e.target.value))}
                          placeholder="100"
                          className="text-xs h-8 font-bold text-orange-700 dark:text-orange-400"
                        />
                      </div>

                      <div className="col-span-3">
                        <label className="text-[10px] text-slate-500 block mb-0.5">MRP (₹)</label>
                        <Input
                          type="number"
                          value={v.mrp}
                          onChange={e => updateVariant(vIdx, 'mrp', Number(e.target.value))}
                          placeholder="115"
                          className="text-xs h-8 text-slate-500 line-through"
                        />
                      </div>

                      <div className="col-span-2 flex items-center justify-center pt-3">
                        <label className="flex items-center gap-1.5 text-[11px] font-medium cursor-pointer">
                          <input
                            type="checkbox"
                            checked={v.inStock}
                            onChange={e => updateVariant(vIdx, 'inStock', e.target.checked)}
                            className="w-3.5 h-3.5 accent-emerald-600"
                          />
                          <span className={v.inStock ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                            {v.inStock ? 'In Stock' : 'Out'}
                          </span>
                        </label>
                      </div>

                      <div className="col-span-1 flex justify-end pt-3">
                        <button
                          type="button"
                          onClick={() => removeVariant(vIdx)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-1"
                          title="Delete Variant"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Mobile Amma's Kitchen Scene Simulation (5 cols) */}
        <div className="xl:col-span-5 flex flex-col items-center">
          <div className="w-full text-center mb-2 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-orange-600" />
              Live Mobile Stage Simulation
            </span>

            {/* Playback Controls */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSimulatedIdx(prev => (prev - 1 + safeConfig.products.length) % safeConfig.products.length)}
                className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600"
                title="Previous Item"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsSimulatingRotation(!isSimulatingRotation)}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  isSimulatingRotation ? 'bg-orange-100 text-orange-800' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {isSimulatingRotation ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
                {isSimulatingRotation ? 'Auto' : 'Paused'}
              </button>
              <button
                type="button"
                onClick={() => setSimulatedIdx(prev => (prev + 1) % safeConfig.products.length)}
                className="h-6 w-6 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600"
                title="Next Item"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Mobile Phone Bezel */}
          <div className="w-full max-w-[365px] rounded-[38px] overflow-hidden border-[6px] border-slate-900 shadow-2xl bg-[#1E0B05] relative flex flex-col">
            {/* Phone Status Bar */}
            <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[11px] font-bold text-amber-200/80 bg-black/40 backdrop-blur-xs border-b border-white/5">
              <span>9:41</span>
              <div className="h-4 w-16 bg-slate-900 rounded-full mx-auto" />
              <div className="flex items-center gap-1">
                <span className="text-[10px]">5G</span>
                <div className="w-4 h-2 border border-amber-300/60 rounded-xs p-0.5">
                  <div className="w-full h-full bg-amber-400 rounded-2xs" />
                </div>
              </div>
            </div>

            {/* STAGE HEADER */}
            <div className="p-4 pb-2 bg-gradient-to-b from-[#2E1208] to-[#3D180B] text-center border-b border-amber-900/30">
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block">
                {safeConfig.settings.kicker || 'FRESH OFF THE STOVE'}
              </span>
              <h3 className="text-xl font-serif font-black text-amber-100 mt-1">
                {safeConfig.settings.title} <span className="text-orange-400 font-sans italic">{safeConfig.settings.titleAccent}</span>
              </h3>
              <p className="text-[11px] text-amber-200/70 font-medium mt-0.5">
                {safeConfig.settings.subtitle}
              </p>
            </div>

            {/* AMMA'S KITCHEN STOVE & BRASS KADAI STAGE */}
            <div className="relative h-[340px] bg-gradient-to-b from-[#3D180B] via-[#2A0E05] to-[#170602] flex flex-col items-center justify-between p-4 overflow-hidden">
              {/* Warm Stove Fire Glow */}
              <div className="absolute bottom-6 w-52 h-20 bg-gradient-to-t from-orange-600 via-amber-500 to-transparent blur-xl opacity-70 animate-pulse pointer-events-none" />
              
              {/* Kitchen Steam/Smoke Effect */}
              <div className="absolute top-10 w-40 h-40 bg-radial from-amber-500/10 to-transparent blur-2xl pointer-events-none" />

              {/* Top Floating Badge & Batch Pill */}
              <div className="w-full flex items-center justify-between z-10">
                <div className="flex items-center gap-1 bg-amber-950/80 border border-amber-500/40 text-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs">
                  <Clock className="h-3 w-3 text-orange-400" />
                  <span>{simProduct.madeLabel || 'Made today, 6 AM'}</span>
                </div>
                <div className="flex items-center gap-1 bg-orange-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-md uppercase">
                  <span>{simProduct.badge || 'NEW'}</span>
                </div>
              </div>

              {/* RISING PRODUCT FROM BRASS KADAI */}
              <div className="relative z-10 flex flex-col items-center my-auto transition-transform duration-500 transform hover:scale-105">
                {/* Floating Product Image with Brass Golden Aura */}
                <div className="relative w-36 h-36 rounded-full border-4 border-[#F6C453] shadow-2xl overflow-hidden bg-gradient-to-br from-[#4A1D0D] to-[#1F0A04] flex items-center justify-center">
                  <img
                    src={getDisplayImage(simProduct.image)}
                    alt={simProduct.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/assets/images/chakralu.png';
                    }}
                  />
                  {/* Subtle Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>

                {/* Simulated Brass Kadai Rim / Handles */}
                <div className="w-48 h-6 bg-gradient-to-r from-[#A77027] via-[#F3C64D] to-[#8C5A1B] rounded-full -mt-3 border-2 border-[#54340C] shadow-lg flex items-center justify-between px-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3D2005] border border-amber-300/40" />
                  <span className="text-[8px] font-mono tracking-widest text-[#3D2005] font-black uppercase">
                    TRADITIONAL KADAI
                  </span>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#3D2005] border border-amber-300/40" />
                </div>
              </div>

              {/* Product Info & Action Card */}
              <div className="w-full bg-[#301207]/90 backdrop-blur-md rounded-2xl p-3 border border-amber-600/30 shadow-xl z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-100 line-clamp-1">
                      {simProduct.name}
                    </h4>
                    <p className="text-[10px] text-amber-300/70 line-clamp-1">
                      {simProduct.tagline}
                    </p>
                  </div>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded border border-amber-500/30">
                    {simProduct.batch || 'Batch #24'}
                  </span>
                </div>

                {/* Variant Chips */}
                <div className="flex items-center gap-1.5 my-2">
                  {(simProduct.variants || []).map((v, vIdx) => (
                    <button
                      key={v.id || vIdx}
                      type="button"
                      onClick={() => setSelectedSimVariantIdx(vIdx)}
                      className={`text-[10px] px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 border ${
                        selectedSimVariantIdx === vIdx
                          ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-sm'
                          : 'bg-black/30 text-amber-200 border-amber-700/40 hover:bg-black/50'
                      }`}
                    >
                      <span>{v.label}</span>
                      <span className="opacity-80">· ₹{v.price}</span>
                    </button>
                  ))}
                </div>

                {/* Price & Add to Kadai Button */}
                <div className="flex items-center justify-between pt-1 border-t border-amber-800/40">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-amber-300">
                      ₹{simProduct.variants[selectedSimVariantIdx]?.price || simProduct.variants[0]?.price || 100}
                    </span>
                    {simProduct.variants[selectedSimVariantIdx]?.mrp && (
                      <span className="text-[11px] text-amber-400/50 line-through">
                        ₹{simProduct.variants[selectedSimVariantIdx]?.mrp}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:brightness-110 active:scale-95 transition"
                  >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Add to Kadai</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Kadai Queue Thumbnails */}
            <div className="p-3 bg-[#170602] border-t border-amber-900/40">
              <div className="flex items-center justify-between text-[10px] text-amber-400/80 mb-1.5 font-bold">
                <span>RISING FROM THE KADAI:</span>
                <span>{simulatedIdx + 1} of {safeConfig.products.length}</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {safeConfig.products.map((p, idx) => (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => {
                      setSimulatedIdx(idx);
                      setSelectedProductIdx(idx);
                    }}
                    className={`h-11 w-11 rounded-full border-2 overflow-hidden shrink-0 transition relative ${
                      simulatedIdx === idx
                        ? 'border-orange-500 scale-105 shadow-md shadow-orange-600/30'
                        : 'border-amber-900/50 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getDisplayImage(p.image)} alt={p.name} className="w-full h-full object-cover" />
                    {simulatedIdx === idx && (
                      <div className="absolute inset-0 bg-orange-600/20 flex items-center justify-center">
                        <Flame className="h-3 w-3 text-amber-300 fill-amber-300" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JSON Modal for direct inspection / backup */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-orange-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Fresh Picks JSON Document (doc_id: "fresh_picks")
                </h3>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="h-8 w-8 p-0"
              >
                ✕
              </Button>
            </div>

            <pre className="bg-slate-950 text-amber-300 p-4 rounded-xl text-xs font-mono overflow-auto max-h-[420px] custom-scrollbar border border-slate-800">
              {JSON.stringify(
                {
                  settings: safeConfig.settings,
                  products: safeConfig.products
                },
                null,
                2
              )}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Broadcasts instantly via <code className="text-orange-600">AppConfigRepository().getFreshPicksStream()</code>
              </span>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      {
                        settings: safeConfig.settings,
                        products: safeConfig.products
                      },
                      null,
                      2
                    )
                  );
                  toast.success('Copied JSON to clipboard!');
                }}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold"
              >
                Copy JSON
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
