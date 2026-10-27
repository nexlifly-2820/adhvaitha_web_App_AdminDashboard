'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Flame, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Smartphone, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  ShoppingBag, 
  Tag, 
  Check, 
  Layers, 
  Eye, 
  Play, 
  Palette, 
  ShieldAlert, 
  Sparkle 
} from 'lucide-react';
import { toast } from 'sonner';

export interface SpiceThrowInPiece {
  name: string;
  pieces: string[];
  count: number;
  size: 'big' | 'small';
}

export interface SpiceChip {
  name: string;
  icon: string;
}

export interface SpiceVariant {
  id: string;
  label: string;
  price: number;
  mrp: number;
  inStock: boolean;
}

export interface SpiceProduct {
  id: string;
  name: string;
  tagline: string;
  image: string;
  powderColor: string;
  accentColor: string;
  glowColor: string;
  heat: number; // 1 to 3
  throwIn: SpiceThrowInPiece[];
  chips: SpiceChip[];
  variants: SpiceVariant[];
}

export interface SpiceGrinderSettings {
  enabled: boolean;
  kicker: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  cardTag: string;
}

export interface SpiceGrinderConfig {
  settings: SpiceGrinderSettings;
  products: SpiceProduct[];
}

export const DEFAULT_SPICE_GRINDER: SpiceGrinderConfig = {
  settings: {
    enabled: true,
    kicker: "FROM WHOLE SPICE TO PODI",
    title: "Fresh ground",
    titleAccent: "spices",
    subtitle: "Pounded in stone, the way Ammamma did.",
    cardTag: "🪨 STONE-GROUND TODAY"
  },
  products: [
    {
      id: "p1",
      name: "Moringa Karam Podi",
      tagline: "Drumstick-leaf spice powder",
      image: "assets/images/munagaku_karam_podi_moringa_leaves_spice_powder.jpg",
      powderColor: "#6B7A2A",
      accentColor: "#A8D86A",
      glowColor: "#3A4A14",
      heat: 2,
      throwIn: [
        {
          name: "Moringa leaves",
          pieces: [
            "assets/images/moringa_0.png",
            "assets/images/moringa_1.png"
          ],
          count: 3,
          size: "big"
        },
        {
          name: "Dry red chilli",
          pieces: [
            "assets/images/redchilli_0.png",
            "assets/images/chillies_0.png"
          ],
          count: 2,
          size: "big"
        },
        {
          name: "Cumin",
          pieces: [
            "assets/images/cumin_0.png",
            "assets/images/cumin_1.png"
          ],
          count: 8,
          size: "small"
        }
      ],
      chips: [
        {
          name: "Moringa leaves",
          icon: "assets/images/moringa_0.png"
        },
        {
          name: "Red chilli",
          icon: "assets/images/redchilli_0.png"
        },
        {
          name: "Cumin",
          icon: "assets/images/cumin_0.png"
        }
      ],
      variants: [
        { id: "v1", label: "100g", price: 129, mrp: 149, inStock: true },
        { id: "v2", label: "250g", price: 249, mrp: 280, inStock: true }
      ]
    },
    {
      id: "p2",
      name: "Idli Karam Podi",
      tagline: "authentic gun powder spice blend",
      image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
      powderColor: "#B8321E",
      accentColor: "#FF7A45",
      glowColor: "#7A2A14",
      heat: 3,
      throwIn: [
        {
          name: "Red chilli",
          pieces: [
            "assets/images/redchilli_0.png",
            "assets/images/chillies_1.png"
          ],
          count: 4,
          size: "big"
        },
        {
          name: "Urad dal",
          pieces: [
            "assets/images/urad_0.png",
            "assets/images/urad_1.png"
          ],
          count: 6,
          size: "small"
        }
      ],
      chips: [
        {
          name: "Red chilli",
          icon: "assets/images/redchilli_0.png"
        },
        {
          name: "Urad dal",
          icon: "assets/images/urad_0.png"
        }
      ],
      variants: [
        { id: "v3", label: "200g", price: 139, mrp: 150, inStock: true },
        { id: "v4", label: "500g", price: 320, mrp: 350, inStock: true }
      ]
    },
    {
      id: "p3",
      name: "Karvepaku Karam Podi",
      tagline: "Iron-rich aromatic curry leaves podi",
      image: "assets/images/karvepaku_karam_podi_curry_leaves_powder.jpg",
      powderColor: "#2F4F2F",
      accentColor: "#556B2F",
      glowColor: "#1C331C",
      heat: 2,
      throwIn: [
        {
          name: "Curry leaves",
          pieces: [
            "assets/images/curry_leaves_0.png"
          ],
          count: 4,
          size: "big"
        },
        {
          name: "Dry red chilli",
          pieces: [
            "assets/images/redchilli_0.png"
          ],
          count: 2,
          size: "big"
        },
        {
          name: "Cumin",
          pieces: [
            "assets/images/cumin_0.png"
          ],
          count: 6,
          size: "small"
        }
      ],
      chips: [
        {
          name: "Curry leaves",
          icon: "assets/images/curry_leaves_0.png"
        },
        {
          name: "Red chilli",
          icon: "assets/images/redchilli_0.png"
        },
        {
          name: "Cumin",
          icon: "assets/images/cumin_0.png"
        }
      ],
      variants: [
        { id: "v5", label: "100g", price: 119, mrp: 135, inStock: true },
        { id: "v6", label: "250g", price: 229, mrp: 260, inStock: true }
      ]
    }
  ]
};

const IMAGE_PRESETS = [
  { label: 'Moringa Karam Podi', path: 'assets/images/munagaku_karam_podi_moringa_leaves_spice_powder.jpg' },
  { label: 'Special Idli Karam Podi', path: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg' },
  { label: 'Karvepaku Karam Podi', path: 'assets/images/karvepaku_karam_podi_curry_leaves_powder.jpg' },
  { label: 'Special Kura Karam Podi', path: 'assets/images/special_kura_karam_podi_all-purpose_curry_powder.jpg' },
  { label: 'Kakarakaya Karam Podi', path: 'assets/images/kakarakaya_karam_podi_bitter_gourd_spice_mix.jpg' },
  { label: 'Kobbari Karam Podi', path: 'assets/images/kobbari_karam_podi_dry_coconut_spice_powder.jpg' },
  { label: 'Nalla Karam Podi', path: 'assets/images/nalla_karam_podi_traditional_black_curry_powder.jpg' },
  { label: 'Vellulli Karam Podi', path: 'assets/images/vellulli_karam_podi_garlic_spice_powder.jpg' },
  { label: 'Dhaniyala Karam Podi', path: 'assets/images/dhaniyala_karam_podi_coriander_seeds_powder.jpg' },
  { label: 'Putnala Podi', path: 'assets/images/putnala_podi_roasted_chana_dal_powder.jpg' }
];

const COLOR_THEMES = [
  { name: 'Moringa Herbal', powder: '#6B7A2A', accent: '#A8D86A', glow: '#3A4A14' },
  { name: 'Fiery Gun Powder', powder: '#B8321E', accent: '#FF7A45', glow: '#7A2A14' },
  { name: 'Curry Leaf Emerald', powder: '#2F4F2F', accent: '#556B2F', glow: '#1C331C' },
  { name: 'Golden Turmeric', powder: '#C28B1E', accent: '#F4C430', glow: '#664608' },
  { name: 'Black Nalla Karam', powder: '#2E221F', accent: '#73564A', glow: '#17100E' },
  { name: 'Garlic Podi', powder: '#8B3A22', accent: '#E6683B', glow: '#4D1B0D' }
];

const COMMON_THROW_INS = [
  { name: 'Dry red chilli', piece: 'assets/images/redchilli_0.png', size: 'big' as const, count: 3 },
  { name: 'Moringa leaves', piece: 'assets/images/moringa_0.png', size: 'big' as const, count: 4 },
  { name: 'Curry leaves', piece: 'assets/images/curry_leaves_0.png', size: 'big' as const, count: 5 },
  { name: 'Garlic cloves', piece: 'assets/images/garlic_0.png', size: 'big' as const, count: 4 },
  { name: 'Cumin seeds', piece: 'assets/images/cumin_0.png', size: 'small' as const, count: 8 },
  { name: 'Urad dal', piece: 'assets/images/urad_0.png', size: 'small' as const, count: 6 },
  { name: 'Chana dal', piece: 'assets/images/chana_0.png', size: 'small' as const, count: 6 },
  { name: 'Sesame seeds', piece: 'assets/images/sesame_0.png', size: 'small' as const, count: 10 }
];

interface SpiceGrinderManagerProps {
  config: SpiceGrinderConfig;
  onChange: (config: SpiceGrinderConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function SpiceGrinderManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: SpiceGrinderManagerProps) {
  const [activeProductIdx, setActiveProductIdx] = useState<number>(0);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [isPounding, setIsPounding] = useState<boolean>(false);
  const [pestleAngle, setPestleAngle] = useState<number>(0);

  // Fallback defaults
  const settings = {
    enabled: config?.settings?.enabled ?? DEFAULT_SPICE_GRINDER.settings.enabled,
    kicker: config?.settings?.kicker ?? DEFAULT_SPICE_GRINDER.settings.kicker,
    title: config?.settings?.title ?? DEFAULT_SPICE_GRINDER.settings.title,
    titleAccent: config?.settings?.titleAccent ?? DEFAULT_SPICE_GRINDER.settings.titleAccent,
    subtitle: config?.settings?.subtitle ?? DEFAULT_SPICE_GRINDER.settings.subtitle,
    cardTag: config?.settings?.cardTag ?? DEFAULT_SPICE_GRINDER.settings.cardTag
  };

  const products = Array.isArray(config?.products) && config.products.length > 0
    ? config.products
    : DEFAULT_SPICE_GRINDER.products;

  const currentProduct: SpiceProduct = products[activeProductIdx] || products[0] || DEFAULT_SPICE_GRINDER.products[0];

  // Stone Mortar pounding simulator animation loop
  const triggerPoundingSimulation = () => {
    setIsPounding(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setPestleAngle(prev => (prev === 0 ? -15 : prev === -15 ? 12 : 0));
      if (count > 8) {
        clearInterval(interval);
        setPestleAngle(0);
        setIsPounding(false);
        toast.success(`✨ Freshly stone-ground ${currentProduct.name}!`);
      }
    }, 180);
  };

  const updateSettings = (partial: Partial<SpiceGrinderSettings>) => {
    onChange({
      ...config,
      settings: { ...settings, ...partial }
    });
  };

  const updateProduct = (idx: number, partial: Partial<SpiceProduct>) => {
    const next = [...products];
    next[idx] = { ...next[idx], ...partial };
    onChange({ ...config, products: next });
  };

  const handleAddProduct = () => {
    const newId = `p${Date.now().toString().slice(-4)}`;
    const newProduct: SpiceProduct = {
      id: newId,
      name: "Special Kura Karam Podi",
      tagline: "All-purpose stone-ground curry powder",
      image: "assets/images/special_kura_karam_podi_all-purpose_curry_powder.jpg",
      powderColor: "#B8321E",
      accentColor: "#FF7A45",
      glowColor: "#7A2A14",
      heat: 2,
      throwIn: [
        {
          name: "Dry red chilli",
          pieces: ["assets/images/redchilli_0.png"],
          count: 3,
          size: "big"
        },
        {
          name: "Cumin seeds",
          pieces: ["assets/images/cumin_0.png"],
          count: 8,
          size: "small"
        }
      ],
      chips: [
        { name: "Red chilli", icon: "assets/images/redchilli_0.png" },
        { name: "Cumin", icon: "assets/images/cumin_0.png" }
      ],
      variants: [
        { id: `v_${Date.now()}_1`, label: "100g", price: 125, mrp: 145, inStock: true },
        { id: `v_${Date.now()}_2`, label: "250g", price: 235, mrp: 270, inStock: true }
      ]
    };
    onChange({
      ...config,
      products: [...products, newProduct]
    });
    setActiveProductIdx(products.length);
    toast.success("New spice blend added!");
  };

  const handleDeleteProduct = (idx: number) => {
    if (products.length <= 1) {
      toast.error("You must keep at least 1 spice blend in the showcase.");
      return;
    }
    const next = products.filter((_, i) => i !== idx);
    onChange({ ...config, products: next });
    setActiveProductIdx(Math.max(0, idx - 1));
    toast.success("Spice blend removed.");
  };

  const handleMoveProduct = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= products.length) return;
    const next = [...products];
    const temp = next[idx];
    next[idx] = next[targetIdx];
    next[targetIdx] = temp;
    onChange({ ...config, products: next });
    setActiveProductIdx(targetIdx);
  };

  // Throw-In piece handlers
  const handleAddThrowIn = (preset?: typeof COMMON_THROW_INS[0]) => {
    const newItem: SpiceThrowInPiece = preset
      ? {
          name: preset.name,
          pieces: [preset.piece],
          count: preset.count,
          size: preset.size
        }
      : {
          name: "Ingredient Piece",
          pieces: ["assets/images/redchilli_0.png"],
          count: 3,
          size: "big"
        };
    const nextThrowIn = [...currentProduct.throwIn, newItem];
    updateProduct(activeProductIdx, { throwIn: nextThrowIn });
    toast.success(`Added ${newItem.name} to stone mortar!`);
  };

  const handleUpdateThrowIn = (throwIdx: number, partial: Partial<SpiceThrowInPiece>) => {
    const nextThrowIn = [...currentProduct.throwIn];
    nextThrowIn[throwIdx] = { ...nextThrowIn[throwIdx], ...partial };
    updateProduct(activeProductIdx, { throwIn: nextThrowIn });
  };

  const handleDeleteThrowIn = (throwIdx: number) => {
    const nextThrowIn = currentProduct.throwIn.filter((_, i) => i !== throwIdx);
    updateProduct(activeProductIdx, { throwIn: nextThrowIn });
  };

  // Chips handlers
  const handleAddChip = (name = "Spice", icon = "assets/images/redchilli_0.png") => {
    const nextChips = [...currentProduct.chips, { name, icon }];
    updateProduct(activeProductIdx, { chips: nextChips });
  };

  const handleUpdateChip = (chipIdx: number, partial: Partial<SpiceChip>) => {
    const nextChips = [...currentProduct.chips];
    nextChips[chipIdx] = { ...nextChips[chipIdx], ...partial };
    updateProduct(activeProductIdx, { chips: nextChips });
  };

  const handleDeleteChip = (chipIdx: number) => {
    const nextChips = currentProduct.chips.filter((_, i) => i !== chipIdx);
    updateProduct(activeProductIdx, { chips: nextChips });
  };

  // Variants handlers
  const handleAddVariant = () => {
    const newVariant: SpiceVariant = {
      id: `v_${Date.now()}`,
      label: "250g",
      price: 249,
      mrp: 280,
      inStock: true
    };
    updateProduct(activeProductIdx, { variants: [...currentProduct.variants, newVariant] });
  };

  const handleUpdateVariant = (vIdx: number, partial: Partial<SpiceVariant>) => {
    const nextVariants = [...currentProduct.variants];
    nextVariants[vIdx] = { ...nextVariants[vIdx], ...partial };
    updateProduct(activeProductIdx, { variants: nextVariants });
  };

  const handleDeleteVariant = (vIdx: number) => {
    if (currentProduct.variants.length <= 1) {
      toast.error("Product must have at least one weight variant.");
      return;
    }
    const nextVariants = currentProduct.variants.filter((_, i) => i !== vIdx);
    updateProduct(activeProductIdx, { variants: nextVariants });
  };

  const getHeatBadge = (heat: number) => {
    if (heat === 1) return { label: 'Mild Spice', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', count: 1 };
    if (heat === 2) return { label: 'Medium Spice', color: 'bg-amber-50 text-amber-700 border-amber-200', count: 2 };
    return { label: 'Fiery Andhra Hot', color: 'bg-rose-50 text-rose-700 border-rose-200', count: 3 };
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <Card className="border-orange-200 dark:border-orange-950/60 bg-gradient-to-r from-orange-50/50 via-amber-50/30 to-white dark:from-orange-950/20 dark:via-background dark:to-background">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-lg bg-orange-600 text-white shadow-sm">
                  <Flame className="h-5 w-5" />
                </span>
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Spice Grinder Section
                    <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-semibold border border-orange-200 dark:border-orange-900">
                      SpiceGrinderWebView Live
                    </span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pounded in stone, stone mortar & pestle interactive animation, color studio, ingredient throw-ins, and weight variants.
                  </CardDescription>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJsonModal(true)}
                className="gap-1.5 text-xs font-medium"
              >
                <Code2 className="h-3.5 w-3.5 text-slate-500" />
                View JSON
              </Button>

              {onResetDefaults && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onResetDefaults}
                  className="gap-1.5 text-xs text-amber-700 border-amber-300 hover:bg-amber-50 dark:border-amber-800 dark:hover:bg-amber-950/50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset Defaults
                </Button>
              )}

              <Button
                onClick={onSave}
                disabled={isSaving}
                className="gap-1.5 text-xs font-semibold bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
              >
                <Save className="h-3.5 w-3.5" />
                {isSaving ? 'Publishing Live...' : 'Save & Publish Live'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Grid: Left Config Tabs & Right Smartphone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Config Forms (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">

          {/* 1. Global Section Settings */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-orange-600" />
                  1. Section Headline & Header Badges
                </CardTitle>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium">
                  <span>Display Section:</span>
                  <input
                    type="checkbox"
                    checked={settings.enabled}
                    onChange={e => updateSettings({ enabled: e.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className={settings.enabled ? "text-emerald-600 font-bold" : "text-slate-400"}>
                    {settings.enabled ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Section Kicker
                  </label>
                  <Input
                    value={settings.kicker}
                    onChange={e => updateSettings({ kicker: e.target.value })}
                    placeholder="FROM WHOLE SPICE TO PODI"
                    className="text-xs font-mono uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Card Stone Badge
                  </label>
                  <Input
                    value={settings.cardTag}
                    onChange={e => updateSettings({ cardTag: e.target.value })}
                    placeholder="🪨 STONE-GROUND TODAY"
                    className="text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Primary Title Line
                  </label>
                  <Input
                    value={settings.title}
                    onChange={e => updateSettings({ title: e.target.value })}
                    placeholder="Fresh ground"
                    className="text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Accent Title Word (Colored)
                  </label>
                  <Input
                    value={settings.titleAccent}
                    onChange={e => updateSettings({ titleAccent: e.target.value })}
                    placeholder="spices"
                    className="text-xs font-semibold text-orange-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Subtitle Description
                </label>
                <Input
                  value={settings.subtitle}
                  onChange={e => updateSettings({ subtitle: e.target.value })}
                  placeholder="Pounded in stone, the way Ammamma did."
                  className="text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* 2. Spice Blend Products Selector */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Flame className="h-4 w-4 text-orange-600" />
                  2. Spice Blend Podis ({products.length} Items)
                </CardTitle>
                <Button
                  size="sm"
                  onClick={handleAddProduct}
                  className="gap-1 bg-orange-600 hover:bg-orange-700 text-white text-xs h-7"
                >
                  <Plus className="h-3 w-3" />
                  Add Spice Podi
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-1">
              {/* Product Pills Navigation */}
              <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg">
                {products.map((prod, idx) => (
                  <button
                    key={prod.id || idx}
                    type="button"
                    onClick={() => {
                      setActiveProductIdx(idx);
                      setSelectedVariantIdx(0);
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${
                      activeProductIdx === idx
                        ? 'bg-white dark:bg-slate-800 text-orange-700 dark:text-orange-400 shadow-sm border border-orange-300 dark:border-orange-900 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                      style={{ backgroundColor: prod.powderColor || '#6B7A2A' }}
                    />
                    <span>{prod.name || `Podi ${idx + 1}`}</span>
                    <span className="text-[10px] opacity-70">
                      {'🔥'.repeat(Math.min(3, Math.max(1, prod.heat || 1)))}
                    </span>
                  </button>
                ))}
              </div>

              {/* Active Product Editor Card */}
              {currentProduct && (
                <div className="p-4 border rounded-xl bg-slate-50/70 dark:bg-slate-900/40 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-orange-800 dark:text-orange-400 bg-orange-100 dark:bg-orange-950 px-2 py-0.5 rounded">
                        Item #{activeProductIdx + 1}: {currentProduct.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        ID: {currentProduct.id}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        disabled={activeProductIdx === 0}
                        onClick={() => handleMoveProduct(activeProductIdx, 'up')}
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-slate-500 hover:text-slate-900"
                        disabled={activeProductIdx === products.length - 1}
                        onClick={() => handleMoveProduct(activeProductIdx, 'down')}
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => handleDeleteProduct(activeProductIdx)}
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Name & Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Spice Podi Name
                      </label>
                      <Input
                        value={currentProduct.name}
                        onChange={e => updateProduct(activeProductIdx, { name: e.target.value })}
                        placeholder="Moringa Karam Podi"
                        className="text-xs font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Tagline / Description
                      </label>
                      <Input
                        value={currentProduct.tagline}
                        onChange={e => updateProduct(activeProductIdx, { tagline: e.target.value })}
                        placeholder="Drumstick-leaf spice powder"
                        className="text-xs"
                      />
                    </div>
                  </div>

                  {/* Product Pack Image & Preset Dropdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Product Pack Image Path
                      </label>
                      <span className="text-[10px] text-slate-500">Pick preset or enter asset path</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        value={currentProduct.image}
                        onChange={e => updateProduct(activeProductIdx, { image: e.target.value })}
                        placeholder="assets/images/munagaku_karam_podi_moringa_leaves_spice_powder.jpg"
                        className="text-xs font-mono"
                      />
                      <select
                        className="h-9 px-2.5 text-xs rounded-md border border-input bg-background font-medium"
                        value={currentProduct.image}
                        onChange={e => updateProduct(activeProductIdx, { image: e.target.value })}
                      >
                        <option value="">-- Choose from Image Presets --</option>
                        {IMAGE_PRESETS.map((p, idx) => (
                          <option key={idx} value={p.path}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Heat Level Selector */}
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Flame className="h-3.5 w-3.5 text-red-600" />
                        Heat Level (Spice Burn Meter)
                      </label>
                      <span className="text-xs font-bold text-orange-700">
                        Level {currentProduct.heat || 1} of 3
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { level: 1, label: '1 - Mild', desc: 'Gentle warmth, aromatic stone pound', color: 'border-emerald-300 bg-emerald-50/50 text-emerald-800' },
                        { level: 2, label: '2 - Medium', desc: 'Classic Andhra heat, balanced spice', color: 'border-amber-300 bg-amber-50/50 text-amber-800' },
                        { level: 3, label: '3 - Hot', desc: 'Fiery Guntur punch, intense tears of joy', color: 'border-rose-300 bg-rose-50/50 text-rose-800' }
                      ].map(h => (
                        <button
                          key={h.level}
                          type="button"
                          onClick={() => updateProduct(activeProductIdx, { heat: h.level })}
                          className={`p-2.5 text-left rounded-lg border text-xs transition-all ${
                            (currentProduct.heat || 1) === h.level
                              ? `${h.color} ring-2 ring-orange-500 font-bold shadow-sm`
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 opacity-75 hover:opacity-100'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span>{h.label}</span>
                            <span>{'🔥'.repeat(h.level)}</span>
                          </div>
                          <p className="text-[10px] text-slate-500 leading-tight">
                            {h.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Color Studio (powderColor, accentColor, glowColor) */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-purple-600" />
                        Stone Powder & Stage Color Studio
                      </label>
                      <span className="text-[10px] text-slate-500">Affects stone mortar mound & background radiance</span>
                    </div>

                    {/* Quick Palettes */}
                    <div className="flex flex-wrap gap-1.5">
                      {COLOR_THEMES.map(thm => (
                        <button
                          key={thm.name}
                          type="button"
                          onClick={() => {
                            updateProduct(activeProductIdx, {
                              powderColor: thm.powder,
                              accentColor: thm.accent,
                              glowColor: thm.glow
                            });
                            toast.success(`Applied ${thm.name} color palette!`);
                          }}
                          className="px-2 py-1 rounded text-[11px] font-medium border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-orange-400 flex items-center gap-1.5"
                        >
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: thm.powder }} />
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: thm.accent }} />
                          <span>{thm.name}</span>
                        </button>
                      ))}
                    </div>

                    {/* Individual Color Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1 p-2 rounded-lg border bg-white dark:bg-slate-900">
                        <label className="text-[11px] font-semibold flex items-center justify-between">
                          <span>Powder Color</span>
                          <span className="font-mono text-[10px]">{currentProduct.powderColor || '#6B7A2A'}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentProduct.powderColor || '#6B7A2A'}
                            onChange={e => updateProduct(activeProductIdx, { powderColor: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                          />
                          <Input
                            value={currentProduct.powderColor || '#6B7A2A'}
                            onChange={e => updateProduct(activeProductIdx, { powderColor: e.target.value })}
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 p-2 rounded-lg border bg-white dark:bg-slate-900">
                        <label className="text-[11px] font-semibold flex items-center justify-between">
                          <span>Accent Color</span>
                          <span className="font-mono text-[10px]">{currentProduct.accentColor || '#A8D86A'}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentProduct.accentColor || '#A8D86A'}
                            onChange={e => updateProduct(activeProductIdx, { accentColor: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                          />
                          <Input
                            value={currentProduct.accentColor || '#A8D86A'}
                            onChange={e => updateProduct(activeProductIdx, { accentColor: e.target.value })}
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                      </div>

                      <div className="space-y-1 p-2 rounded-lg border bg-white dark:bg-slate-900">
                        <label className="text-[11px] font-semibold flex items-center justify-between">
                          <span>Glow Color</span>
                          <span className="font-mono text-[10px]">{currentProduct.glowColor || '#3A4A14'}</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={currentProduct.glowColor || '#3A4A14'}
                            onChange={e => updateProduct(activeProductIdx, { glowColor: e.target.value })}
                            className="w-7 h-7 rounded cursor-pointer border-0 p-0"
                          />
                          <Input
                            value={currentProduct.glowColor || '#3A4A14'}
                            onChange={e => updateProduct(activeProductIdx, { glowColor: e.target.value })}
                            className="h-7 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 4. Throw-In Ingredient Pieces (throwIn) */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                          Mortar Throw-In Ingredient Pieces ({currentProduct.throwIn?.length || 0})
                        </label>
                        <p className="text-[10px] text-slate-500">
                          These whole pieces fly and drop into the stone mortar during pounding.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddThrowIn()}
                        className="h-7 text-xs gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Custom Throw-in
                      </Button>
                    </div>

                    {/* Quick Preset Buttons for Throw-in */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[10px] font-bold text-slate-500 self-center mr-1">Quick Add:</span>
                      {COMMON_THROW_INS.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddThrowIn(item)}
                          className="px-2 py-0.5 rounded text-[10px] bg-slate-200/70 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                        >
                          + {item.name}
                        </button>
                      ))}
                    </div>

                    {/* Throw-in Items List */}
                    <div className="space-y-2">
                      {currentProduct.throwIn?.map((item, throwIdx) => (
                        <div
                          key={throwIdx}
                          className="p-2.5 rounded-lg border bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                        >
                          <div className="sm:col-span-4 space-y-0.5">
                            <label className="text-[10px] font-semibold text-slate-500">Name</label>
                            <Input
                              value={item.name}
                              onChange={e => handleUpdateThrowIn(throwIdx, { name: e.target.value })}
                              placeholder="e.g. Dry red chilli"
                              className="h-7 text-xs font-medium"
                            />
                          </div>

                          <div className="sm:col-span-4 space-y-0.5">
                            <label className="text-[10px] font-semibold text-slate-500">Image Asset Path</label>
                            <Input
                              value={item.pieces?.[0] || ''}
                              onChange={e => handleUpdateThrowIn(throwIdx, { pieces: [e.target.value] })}
                              placeholder="assets/images/redchilli_0.png"
                              className="h-7 text-xs font-mono"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-0.5">
                            <label className="text-[10px] font-semibold text-slate-500">Count ({item.count})</label>
                            <Input
                              type="number"
                              min={1}
                              max={20}
                              value={item.count}
                              onChange={e => handleUpdateThrowIn(throwIdx, { count: parseInt(e.target.value) || 1 })}
                              className="h-7 text-xs"
                            />
                          </div>

                          <div className="sm:col-span-1 space-y-0.5">
                            <label className="text-[10px] font-semibold text-slate-500">Size</label>
                            <select
                              value={item.size}
                              onChange={e => handleUpdateThrowIn(throwIdx, { size: e.target.value as 'big' | 'small' })}
                              className="h-7 w-full text-xs rounded border bg-background font-medium px-1"
                            >
                              <option value="big">Big</option>
                              <option value="small">Small</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1 flex justify-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                              onClick={() => handleDeleteThrowIn(throwIdx)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 5. Ingredient Chips (badges on product card) */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <Tag className="h-3.5 w-3.5 text-blue-600" />
                          Product Card Ingredient Chips ({currentProduct.chips?.length || 0})
                        </label>
                        <p className="text-[10px] text-slate-500">
                          Badges displayed on the product card to show key ingredients.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddChip()}
                        className="h-7 text-xs gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Chip
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {currentProduct.chips?.map((chip, chipIdx) => (
                        <div
                          key={chipIdx}
                          className="p-2 rounded-lg border bg-white dark:bg-slate-900 space-y-1 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500">Chip #{chipIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteChip(chipIdx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                          <Input
                            value={chip.name}
                            onChange={e => handleUpdateChip(chipIdx, { name: e.target.value })}
                            placeholder="Chip Name"
                            className="h-7 text-xs font-semibold"
                          />
                          <Input
                            value={chip.icon}
                            onChange={e => handleUpdateChip(chipIdx, { icon: e.target.value })}
                            placeholder="Icon path"
                            className="h-6 text-[10px] font-mono text-slate-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 6. Weight Variants (100g, 250g, 500g...) */}
                  <div className="space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ShoppingBag className="h-3.5 w-3.5 text-emerald-600" />
                          Weight Variants & Pricing ({currentProduct.variants?.length || 0})
                        </label>
                        <p className="text-[10px] text-slate-500">
                          Customer weight options, discounted selling price, and MRP.
                        </p>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleAddVariant}
                        className="h-7 text-xs gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Variant
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {currentProduct.variants?.map((v, vIdx) => {
                        const discount = v.mrp > v.price ? Math.round(((v.mrp - v.price) / v.mrp) * 100) : 0;
                        return (
                          <div
                            key={v.id || vIdx}
                            className="p-2.5 rounded-lg border bg-white dark:bg-slate-900 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center"
                          >
                            <div className="sm:col-span-3 space-y-0.5">
                              <label className="text-[10px] font-semibold text-slate-500">Weight Label</label>
                              <Input
                                value={v.label}
                                onChange={e => handleUpdateVariant(vIdx, { label: e.target.value })}
                                placeholder="100g"
                                className="h-7 text-xs font-bold"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-0.5">
                              <label className="text-[10px] font-semibold text-slate-500">Selling Price (₹)</label>
                              <Input
                                type="number"
                                value={v.price}
                                onChange={e => handleUpdateVariant(vIdx, { price: parseFloat(e.target.value) || 0 })}
                                className="h-7 text-xs font-bold text-emerald-700"
                              />
                            </div>

                            <div className="sm:col-span-3 space-y-0.5">
                              <label className="text-[10px] font-semibold text-slate-500">
                                MRP (₹) {discount > 0 && <span className="text-emerald-600 font-bold">({discount}% off)</span>}
                              </label>
                              <Input
                                type="number"
                                value={v.mrp}
                                onChange={e => handleUpdateVariant(vIdx, { mrp: parseFloat(e.target.value) || 0 })}
                                className="h-7 text-xs text-slate-500"
                              />
                            </div>

                            <div className="sm:col-span-2 space-y-0.5 text-center">
                              <label className="text-[10px] font-semibold text-slate-500 block">Stock</label>
                              <button
                                type="button"
                                onClick={() => handleUpdateVariant(vIdx, { inStock: !v.inStock })}
                                className={`px-2 py-1 rounded text-[10px] font-bold w-full transition-colors ${
                                  v.inStock
                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                }`}
                              >
                                {v.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
                              </button>
                            </div>

                            <div className="sm:col-span-1 flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-rose-500 hover:text-rose-700 hover:bg-rose-50"
                                onClick={() => handleDeleteVariant(vIdx)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Mobile App Simulator (5 Cols) */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <Card className="border-slate-800 shadow-xl overflow-hidden bg-slate-950 text-white">
            <CardHeader className="py-3 px-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-orange-400" />
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                    Live Mobile Simulator
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-emerald-400">Stream Live</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 space-y-4">
              {/* Phone Frame */}
              <div
                className="w-full rounded-[24px] overflow-hidden border-[4px] border-slate-800 p-3 shadow-2xl relative transition-all"
                style={{
                  background: `linear-gradient(180deg, #18181B 0%, ${currentProduct?.glowColor || '#3A4A14'}25 50%, #09090B 100%)`
                }}
              >
                {/* Header Section */}
                <div className="text-center space-y-1 pt-1 pb-3">
                  <span className="text-[9px] font-black tracking-widest text-orange-400 uppercase bg-orange-950/60 border border-orange-800/40 px-2 py-0.5 rounded-full inline-block">
                    {settings.kicker}
                  </span>
                  <h3 className="text-base font-extrabold text-white tracking-tight">
                    {settings.title}{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                      {settings.titleAccent}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 max-w-[260px] mx-auto leading-tight">
                    {settings.subtitle}
                  </p>
                </div>

                {/* Stone Mortar & Pestle Interactive Animation Stage */}
                <div className="relative my-2 py-6 px-4 rounded-2xl overflow-hidden border border-white/10 bg-black/40 flex flex-col items-center justify-center min-h-[220px]">
                  
                  {/* Radial Color Aura Glow from powderColor */}
                  <div
                    className="absolute inset-0 opacity-40 blur-2xl transition-all duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 65%, ${currentProduct?.powderColor || '#6B7A2A'} 0%, transparent 70%)`
                    }}
                  />

                  {/* Stone Pestle (Interactive / Animated) */}
                  <div
                    className="relative z-20 transition-transform duration-150 cursor-pointer"
                    style={{
                      transform: `rotate(${pestleAngle}deg) translateY(${isPounding ? '14px' : '0px'})`
                    }}
                    onClick={triggerPoundingSimulation}
                    title="Click to Pound in Stone!"
                  >
                    <div className="w-7 h-24 rounded-t-full rounded-b-md bg-gradient-to-r from-stone-600 via-stone-400 to-stone-700 shadow-xl border border-stone-500/50 flex flex-col items-center justify-between p-1">
                      <div className="w-4 h-4 rounded-full bg-stone-700/60" />
                      <span className="text-[7px] font-bold text-stone-200 tracking-tighter uppercase opacity-60">
                        STONE
                      </span>
                      <div className="w-5 h-3 rounded-full bg-stone-800/80" />
                    </div>
                  </div>

                  {/* Stone Mortar Bowl */}
                  <div className="relative z-10 -mt-3 w-40 h-24 rounded-b-[70px] rounded-t-[20px] bg-gradient-to-b from-stone-700 via-stone-800 to-stone-900 border-4 border-stone-600 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                    
                    {/* Mortar Inner Well */}
                    <div className="w-32 h-14 rounded-full bg-gradient-to-b from-stone-900 to-black shadow-inner flex items-center justify-center relative overflow-hidden">
                      
                      {/* Fresh Ground Powder Mound */}
                      <div
                        className="w-24 h-9 rounded-full blur-[0.5px] transition-all duration-500 shadow-lg flex items-center justify-center text-white/70 text-[9px] font-black"
                        style={{
                          backgroundColor: currentProduct?.powderColor || '#6B7A2A',
                          boxShadow: `0 0 16px ${currentProduct?.accentColor || '#A8D86A'}66`
                        }}
                      >
                        <span className="drop-shadow">FRESH PODI</span>
                      </div>

                      {/* Floating Whole Ingredients (throwIn) */}
                      <div className="absolute inset-0 flex items-center justify-around pointer-events-none px-2">
                        {currentProduct?.throwIn?.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className={`transition-all duration-300 ${
                              isPounding ? 'scale-125 -translate-y-1' : 'animate-bounce'
                            }`}
                            style={{ animationDelay: `${idx * 0.2}s` }}
                          >
                            <span className="text-xs">
                              {item.name.toLowerCase().includes('chilli') ? '🌶️' : item.name.toLowerCase().includes('moringa') || item.name.toLowerCase().includes('curry') ? '🍃' : '✨'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stone Ground Today Card Tag */}
                  <div className="absolute top-2 left-2 z-20">
                    <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                      {settings.cardTag}
                    </span>
                  </div>

                  {/* Heat Level Indicator */}
                  <div className="absolute top-2 right-2 z-20 flex items-center gap-0.5 bg-black/60 backdrop-blur px-1.5 py-0.5 rounded-full border border-white/10">
                    <span className="text-[9px] font-bold text-orange-400">
                      {'🔥'.repeat(Math.min(3, Math.max(1, currentProduct?.heat || 1)))}
                    </span>
                  </div>

                  {/* Interactive Simulation Trigger Button */}
                  <div className="mt-4 z-20">
                    <Button
                      type="button"
                      size="sm"
                      onClick={triggerPoundingSimulation}
                      disabled={isPounding}
                      className="h-6 text-[10px] font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-600 gap-1 rounded-full px-2.5 shadow"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      {isPounding ? 'Pounding Spice...' : 'Simulate Stone Pounding'}
                    </Button>
                  </div>
                </div>

                {/* Product Detail Card in Phone */}
                <div className="rounded-xl bg-white text-slate-900 p-3 space-y-2 shadow-lg mt-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {currentProduct?.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {currentProduct?.tagline}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-700 block">
                        ₹{currentProduct?.variants?.[selectedVariantIdx]?.price || currentProduct?.variants?.[0]?.price || 129}
                      </span>
                      {((currentProduct?.variants?.[selectedVariantIdx]?.mrp || 0) > (currentProduct?.variants?.[selectedVariantIdx]?.price || 0)) && (
                        <span className="text-[9px] text-slate-400 line-through">
                          ₹{currentProduct?.variants?.[selectedVariantIdx]?.mrp}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Ingredient Chips */}
                  {currentProduct?.chips && currentProduct.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {currentProduct.chips.map((chip, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[10px] font-medium bg-orange-50 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-600" />
                          {chip.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Weight Variant Pills */}
                  <div className="flex items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 mr-1">Weight:</span>
                    {currentProduct?.variants?.map((v, vIdx) => (
                      <button
                        key={v.id || vIdx}
                        type="button"
                        onClick={() => setSelectedVariantIdx(vIdx)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition-all ${
                          selectedVariantIdx === vIdx
                            ? 'bg-slate-900 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    type="button"
                    className="w-full h-8 text-xs font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow mt-1 gap-1.5"
                    onClick={() => {
                      toast.success(`Added ${currentProduct?.name} (${currentProduct?.variants?.[selectedVariantIdx]?.label || '100g'}) to cart!`);
                    }}
                  >
                    <ShoppingBag className="h-3 w-3" />
                    Add to Cart • ₹{currentProduct?.variants?.[selectedVariantIdx]?.price || 129}
                  </Button>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  Live Sync to Mobile App
                </div>
                <p>
                  When you save, <code>SpiceGrinderWebView</code> on mobile phones receives this payload instantly via live stream and renders this interactive animation without app reload.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* JSON Payload Modal */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <Card className="w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl border-slate-700 bg-slate-900 text-white">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-800 py-3">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-orange-400" />
                <CardTitle className="text-base text-white">
                  JSON Payload: spices_grinder
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent className="p-4 overflow-y-auto font-mono text-xs text-emerald-400 bg-black/50 rounded-b-lg">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(
                  {
                    doc_id: "spices_grinder",
                    content: {
                      settings: config.settings,
                      products: config.products
                    }
                  },
                  null,
                  2
                )}
              </pre>
            </CardContent>
            <div className="p-3 border-t border-slate-800 flex justify-end gap-2 bg-slate-900">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(
                      {
                        doc_id: "spices_grinder",
                        content: {
                          settings: config.settings,
                          products: config.products
                        }
                      },
                      null,
                      2
                    )
                  );
                  toast.success("Payload copied to clipboard!");
                }}
                className="text-xs"
              >
                Copy JSON
              </Button>
              <Button
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
