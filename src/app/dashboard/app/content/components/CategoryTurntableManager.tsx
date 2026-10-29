'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  RotateCw, 
  RotateCcw,
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  Palette, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  Copy,
  Layers,
  ChevronLeft,
  ChevronRight,
  Disc,
  ExternalLink,
  Tag,
  Eye,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';

export interface TurntableCategoryItem {
  id: string;
  slug: string;
  name: string;
  label: string;
  subtitle: string;
  image: string;
  color1: string; // Top radial highlight
  color2: string; // Main background color
  color3: string; // Deep vignette
  count: number;
  products?: Array<{
    id: string;
    name: string;
    image: string;
    price: number;
  }>;
}

export interface TurntableSettings {
  enabled: boolean;
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  hint: string;
  products: boolean;
}

export interface CategoryTurntableConfig {
  settings: TurntableSettings;
  categories: TurntableCategoryItem[];
}

export const DEFAULT_TURNTABLE_CONFIG: CategoryTurntableConfig = {
  settings: {
    enabled: true,
    eyebrow: 'SHOP BY CATEGORY',
    titleStart: "Spin Amma's",
    titleAccent: 'lazy susan',
    hint: '👆 Tap a bowl, a name or swipe to choose',
    products: true
  },
  categories: [
    {
      id: '1',
      slug: 'pickle',
      name: 'Pickles',
      label: 'BESTSELLERS',
      subtitle: 'Sun-cured in jaadis',
      image: 'assets/images/avakaya_pickle.png',
      color1: '#E8432B',
      color2: '#9E1424',
      color3: '#4A0A0E',
      count: 12,
      products: []
    },
    {
      id: '2',
      slug: 'snack',
      name: 'Snacks',
      label: 'CRISPY',
      subtitle: 'Crunchy, tea-time ready',
      image: 'assets/images/murukku_rings.png',
      color1: '#F59E2B',
      color2: '#C2410C',
      color3: '#5A1E04',
      count: 9,
      products: []
    },
    {
      id: '3',
      slug: 'podi',
      name: 'Podis',
      label: 'MADE DAILY',
      subtitle: 'Stone-ground fresh every week',
      image: 'assets/images/karivepaku_podi.png',
      color1: '#3FA34D',
      color2: '#1D6B33',
      color3: '#0A2E16',
      count: 8,
      products: []
    },
    {
      id: '4',
      slug: 'sweet',
      name: 'Sweets',
      label: 'FESTIVE',
      subtitle: 'Pure ghee & jaggery',
      image: 'assets/images/sweets.png',
      color1: '#E0579A',
      color2: '#9D174D',
      color3: '#4A0A26',
      count: 10,
      products: []
    },
    {
      id: '5',
      slug: 'vadiyalu',
      name: 'Vadiyalu',
      label: 'FRY & ENJOY',
      subtitle: 'Sun-dried on the terrace',
      image: 'assets/images/snacks.png',
      color1: '#8B5CF6',
      color2: '#5B21B6',
      color3: '#26104F',
      count: 6,
      products: []
    },
    {
      id: '6',
      slug: 'masala',
      name: 'Masalas',
      label: 'AROMATIC',
      subtitle: 'Whole spices, slow-roasted',
      image: 'assets/images/pickles.png',
      color1: '#B7791F',
      color2: '#7A4512',
      color3: '#3A1E06',
      count: 7,
      products: []
    }
  ]
};

const PRESET_BOWL_ASSETS = [
  { label: 'Avakaya Pickle Bowl', path: 'assets/images/avakaya_pickle.png' },
  { label: 'Murukku Rings Bowl', path: 'assets/images/murukku_rings.png' },
  { label: 'Karivepaku Podi Bowl', path: 'assets/images/karivepaku_podi.png' },
  { label: 'Traditional Sweets Platter', path: 'assets/images/sweets.png' },
  { label: 'Spiced Snacks Bowl', path: 'assets/images/snacks.png' },
  { label: 'Heritage Pickles Jaadi', path: 'assets/images/pickles.png' },
  { label: 'Bellam Avakaya Cutout', path: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg' },
  { label: 'Idli Karam Podi Cutout', path: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg' }
];

const PRESET_PALETTES = [
  { name: 'Heritage Chilli', color1: '#E8432B', color2: '#9E1424', color3: '#4A0A0E' },
  { name: 'Warm Turmeric', color1: '#F59E2B', color2: '#C2410C', color3: '#5A1E04' },
  { name: 'Fresh Curry Leaves', color1: '#3FA34D', color2: '#1D6B33', color3: '#0A2E16' },
  { name: 'Festive Mithai Rose', color1: '#E0579A', color2: '#9D174D', color3: '#4A0A26' },
  { name: 'Royal Purple Vadiyalu', color1: '#8B5CF6', color2: '#5B21B6', color3: '#26104F' },
  { name: 'Roasted Masala Gold', color1: '#B7791F', color2: '#7A4512', color3: '#3A1E06' },
  { name: 'Midnight Charcoal', color1: '#475569', color2: '#1E293B', color3: '#0F172A' }
];

interface Props {
  config: CategoryTurntableConfig;
  onChange: (config: CategoryTurntableConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function CategoryTurntableManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: Props) {
  const [activeTab, setActiveTab] = useState<'simulator' | 'bowls' | 'settings'>('simulator');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [showJsonModal, setShowJsonModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const categories = config.categories || [];
  const settings = config.settings || DEFAULT_TURNTABLE_CONFIG.settings;
  const currentCategory = categories[selectedIndex] || categories[0] || DEFAULT_TURNTABLE_CONFIG.categories[0];

  // Rotate turntable to selected category index
  useEffect(() => {
    if (categories.length > 0) {
      const anglePerItem = 360 / categories.length;
      setRotationAngle(-selectedIndex * anglePerItem);
    }
  }, [selectedIndex, categories.length]);

  const handleRotateLeft = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : categories.length - 1));
  };

  const handleRotateRight = () => {
    setSelectedIndex((prev) => (prev < categories.length - 1 ? prev + 1 : 0));
  };

  const updateSettings = (partial: Partial<TurntableSettings>) => {
    onChange({
      ...config,
      settings: { ...settings, ...partial }
    });
  };

  const updateCategory = (index: number, partial: Partial<TurntableCategoryItem>) => {
    const updated = [...categories];
    updated[index] = { ...updated[index], ...partial };
    onChange({ ...config, categories: updated });
  };

  const addCategory = () => {
    const newId = String(categories.length + 1);
    const newCategory: TurntableCategoryItem = {
      id: newId,
      slug: `category_${newId}`,
      name: `Category ${newId}`,
      label: 'NEW',
      subtitle: 'Amma\'s handmade recipe',
      image: 'assets/images/avakaya_pickle.png',
      color1: '#E8432B',
      color2: '#9E1424',
      color3: '#4A0A0E',
      count: 0,
      products: []
    };
    onChange({
      ...config,
      categories: [...categories, newCategory]
    });
    setSelectedIndex(categories.length);
    toast.success('New category bowl added to the Lazy Susan!');
  };

  const removeCategory = (index: number) => {
    if (categories.length <= 1) {
      toast.error('The Lazy Susan turntable requires at least 1 category bowl.');
      return;
    }
    const updated = categories.filter((_, i) => i !== index);
    onChange({ ...config, categories: updated });
    if (selectedIndex >= updated.length) {
      setSelectedIndex(updated.length - 1);
    }
    toast.success('Category bowl removed');
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    onChange({ ...config, categories: updated });
    setSelectedIndex(targetIndex);
  };

  const jsonPayloadString = JSON.stringify(
    {
      settings: config.settings,
      categories: config.categories
    },
    null,
    2
  );

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonPayloadString);
    setCopied(true);
    toast.success('JSON payload copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-900/60 p-6 rounded-2xl border border-amber-500/30 text-white shadow-xl backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              3D Turntable Engine
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              GET /api/shop/categories
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span>Spin Amma's Lazy Susan</span>
            <Disc className="h-6 w-6 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
          </h2>
          <p className="text-xs text-amber-200/80 mt-1 max-w-xl">
            Real 3D Lazy Susan turntable with transparent PNG bowls, dynamic radial wall lighting, and seamless routing directly to your authentic category grid layout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowJsonModal(true)}
            className="border-amber-400/40 text-amber-200 hover:bg-amber-500/20 text-xs"
          >
            <Code2 className="h-3.5 w-3.5 mr-1.5" />
            JSON Payload
          </Button>

          {onResetDefaults && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetDefaults}
              className="border-rose-400/40 text-rose-200 hover:bg-rose-500/20 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset Defaults
            </Button>
          )}

          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-lg shadow-amber-900/40"
          >
            {isSaving ? (
              <>
                <RotateCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Turntable
              </>
            )}
          </Button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-stone-200 dark:border-stone-800 pb-2">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'simulator'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
        >
          <Eye className="h-4 w-4" />
          Interactive 3D Simulator ({categories.length} Bowls)
        </button>

        <button
          onClick={() => setActiveTab('bowls')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'bowls'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
        >
          <Layers className="h-4 w-4" />
          Manage Bowls ({categories.length})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'settings'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900'
          }`}
        >
          <Palette className="h-4 w-4" />
          Display & Title Settings
        </button>
      </div>

      {/* TAB 1: INTERACTIVE 3D SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 3D TURNTABLE STAGE */}
          <div className="lg:col-span-8 flex flex-col items-center">
            <div className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-900/40 relative">
              {/* Dynamic Wall Backdrop */}
              <div
                className="relative w-full h-[640px] flex flex-col justify-between p-5 transition-all duration-700 ease-out select-none"
                style={{
                  background: `radial-gradient(90% 55% at 50% 42%, ${currentCategory.color1}, ${currentCategory.color2} 60%, ${currentCategory.color3})`
                }}
              >
                {/* Vintage Dot Pattern Overlay */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 14px 14px, #ffffff 1.5px, transparent 2px)',
                    backgroundSize: '28px 28px'
                  }}
                />

                {/* Rotating Sunburst Rays */}
                <div
                  className="absolute left-1/2 top-[300px] w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20 animate-spin"
                  style={{
                    animationDuration: '60s',
                    background:
                      'repeating-conic-gradient(rgba(255,255,255,0.15) 0 7deg, transparent 7deg 20deg)',
                    maskImage: 'radial-gradient(closest-side, #000 30%, transparent)'
                  }}
                />

                {/* HEADER SECTION IN MOBILE */}
                <div className="relative z-10 text-center">
                  <span className="text-[10px] font-extrabold tracking-[3px] text-white/70 uppercase">
                    {settings.eyebrow}
                  </span>
                  <h1 className="text-2xl font-serif font-normal text-white mt-0.5 tracking-tight">
                    {settings.titleStart}{' '}
                    <span className="italic font-serif font-medium text-amber-200">
                      {settings.titleAccent}
                    </span>
                  </h1>
                  <p className="text-[11px] text-white/80 mt-1 font-medium bg-black/20 backdrop-blur-sm inline-block px-3 py-1 rounded-full border border-white/10">
                    {settings.hint}
                  </p>
                </div>

                {/* 3D TURNTABLE TURNING PLATTER */}
                <div className="relative z-10 flex-1 flex items-center justify-center my-4">
                  {/* Perspective Stage */}
                  <div className="relative w-[320px] h-[320px] flex items-center justify-center">
                    {/* Brass/Wooden Turntable Edge Platter */}
                    <div
                      className="absolute w-[290px] h-[160px] rounded-[50%] top-[90px] border-4 border-amber-400/50 shadow-[0_20px_35px_rgba(0,0,0,0.6)]"
                      style={{
                        background:
                          'radial-gradient(ellipse at center, #6b3510 0%, #3d1b05 70%, #1a0b02 100%)',
                        transform: 'rotateX(55deg)'
                      }}
                    />

                    {/* Rotating Bowls Container */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-700 ease-out"
                      style={{
                        transform: `rotate(${rotationAngle}deg)`
                      }}
                    >
                      {categories.map((cat, i) => {
                        const angle = (i / categories.length) * (2 * Math.PI);
                        const radius = 105;
                        const x = Math.cos(angle) * radius;
                        const y = Math.sin(angle) * radius * 0.45; // flatten for 3D oval perspective
                        const isSelected = i === selectedIndex;

                        return (
                          <div
                            key={cat.id || i}
                            onClick={() => setSelectedIndex(i)}
                            className="absolute cursor-pointer transition-all duration-500 ease-out group"
                            style={{
                              transform: `translate(${x}px, ${y}px) rotate(${-rotationAngle}deg)`,
                              zIndex: Math.round(y + 200)
                            }}
                          >
                            <div className="relative flex flex-col items-center">
                              {/* Glowing Active Ring */}
                              {isSelected && (
                                <div className="absolute -inset-3 rounded-full bg-amber-400/30 blur-md animate-pulse pointer-events-none" />
                              )}

                              {/* Bowl Drop Shadow */}
                              <div className="w-16 h-4 bg-black/40 rounded-full blur-[3px] absolute bottom-1" />

                              {/* Bowl Image */}
                              <div
                                className={`relative w-20 h-20 transition-transform duration-300 ${
                                  isSelected ? 'scale-125' : 'scale-90 opacity-80 group-hover:scale-100 group-hover:opacity-100'
                                }`}
                              >
                                {cat.image.startsWith('http') ? (
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.5)]"
                                  />
                                ) : (
                                  <div className="w-full h-full rounded-full bg-white/10 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg p-2">
                                    <span className="text-2xl">🍲</span>
                                  </div>
                                )}
                              </div>

                              {/* Small Category Label Tag */}
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 whitespace-nowrap shadow-md transition-all ${
                                  isSelected
                                    ? 'bg-amber-400 text-stone-950 font-black scale-110'
                                    : 'bg-black/60 text-white/90 backdrop-blur-sm'
                                }`}
                              >
                                {cat.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* ACTIVE CATEGORY CARD SPOTLIGHT */}
                <div className="relative z-10 bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="flex items-center justify-between mb-1.5">
                    <button
                      onClick={handleRotateLeft}
                      className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                      title="Previous Category"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 font-mono">
                        {currentCategory.label || 'POPULAR'}
                      </span>
                      <span className="text-xs text-white/80 font-bold">
                        {currentCategory.count || 12} items
                      </span>
                    </div>

                    <button
                      onClick={handleRotateRight}
                      className="p-1.5 rounded-full bg-white/15 hover:bg-white/30 text-white transition-colors"
                      title="Next Category"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="text-xl font-black text-white">{currentCategory.name}</h3>
                  <p className="text-xs text-white/80 mt-0.5">{currentCategory.subtitle}</p>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCategory.color1 }} />
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCategory.color2 }} />
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: currentCategory.color3 }} />
                    <span className="text-[10px] text-white/60 font-mono">
                      {currentCategory.slug}
                    </span>
                  </div>
                </div>

                {/* BOTTOM PRODUCT STRIP PREVIEW */}
                {settings.products && (
                  <div className="relative z-10 mt-2 bg-white/10 backdrop-blur-md rounded-xl p-2.5 border border-white/15 text-white">
                    <div className="flex items-center justify-between text-[10px] font-bold text-white/80 mb-1.5">
                      <span>EXPLORE {currentCategory.name.toUpperCase()}</span>
                      <span className="text-amber-300">Tap bowl to view grid →</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="flex-1 bg-black/30 rounded-lg p-2 text-center text-[10px]">
                        <p className="font-bold truncate">Authentic {currentCategory.name}</p>
                        <p className="text-amber-300 font-semibold mt-0.5">₹149 - ₹399</p>
                      </div>
                      <div className="flex-1 bg-black/30 rounded-lg p-2 text-center text-[10px]">
                        <p className="font-bold truncate">Amma's Special</p>
                        <p className="text-amber-300 font-semibold mt-0.5">₹299</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ROTATION CONTROLS */}
            <div className="flex items-center gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotateLeft}
                className="rounded-full text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" />
                Spin Left
              </Button>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-mono font-bold">
                Bowl {selectedIndex + 1} of {categories.length}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotateRight}
                className="rounded-full text-xs"
              >
                Spin Right
                <RotateCw className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>

          {/* ACTIVE CATEGORY COLOR & QUICK EDIT PANEL */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="border-amber-200/50 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Selected Bowl Details</span>
                  <span className="text-xs font-mono bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
                    #{selectedIndex + 1}
                  </span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Customize the bowl image, labels, and 3-color radial background wall.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Category Name
                  </label>
                  <Input
                    value={currentCategory.name}
                    onChange={(e) => updateCategory(selectedIndex, { name: e.target.value })}
                    className="mt-1 text-xs"
                    placeholder="e.g. Pickles"
                    maxLength={14}
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Max 14 letters (displays on the spinning 3D bowl tag).
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Category Slug (maps to Product Listing)
                  </label>
                  <Input
                    value={currentCategory.slug}
                    onChange={(e) =>
                      updateCategory(selectedIndex, {
                        slug: e.target.value.toLowerCase().trim()
                      })
                    }
                    className="mt-1 text-xs font-mono"
                    placeholder="e.g. pickle, snack, podi"
                  />
                  <p className="text-[10px] text-stone-500 mt-0.5">
                    Must match product category filter when user taps the bowl.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Label / Tag
                    </label>
                    <Input
                      value={currentCategory.label}
                      onChange={(e) => updateCategory(selectedIndex, { label: e.target.value })}
                      className="mt-1 text-xs uppercase"
                      placeholder="e.g. BESTSELLERS"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                      Product Count
                    </label>
                    <Input
                      type="number"
                      value={currentCategory.count}
                      onChange={(e) =>
                        updateCategory(selectedIndex, { count: parseInt(e.target.value) || 0 })
                      }
                      className="mt-1 text-xs"
                      placeholder="12"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Subtitle
                  </label>
                  <Input
                    value={currentCategory.subtitle}
                    onChange={(e) => updateCategory(selectedIndex, { subtitle: e.target.value })}
                    className="mt-1 text-xs"
                    placeholder="e.g. Sun-cured in jaadis"
                  />
                </div>

                {/* BOWL IMAGE SELECTOR */}
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Transparent Bowl Image PNG
                  </label>
                  <Input
                    value={currentCategory.image}
                    onChange={(e) => updateCategory(selectedIndex, { image: e.target.value })}
                    className="mt-1 text-xs font-mono"
                    placeholder="assets/images/avakaya_pickle.png"
                  />

                  {/* Quick Select Presets */}
                  <div className="mt-2">
                    <label className="text-[10px] font-bold text-stone-500 uppercase">
                      Quick Pick Local Asset:
                    </label>
                    <div className="grid grid-cols-2 gap-1.5 mt-1 max-h-28 overflow-y-auto pr-1">
                      {PRESET_BOWL_ASSETS.map((asset) => (
                        <button
                          key={asset.path}
                          type="button"
                          onClick={() => updateCategory(selectedIndex, { image: asset.path })}
                          className={`text-left text-[10px] px-2 py-1 rounded border transition-colors truncate ${
                            currentCategory.image === asset.path
                              ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                              : 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                          }`}
                        >
                          {asset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* WALL BACKGROUND COLOR PALETTES */}
                <div>
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    3-Color Wall Gradient
                  </label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">Top Light</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={currentCategory.color1}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color1: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                        />
                        <Input
                          value={currentCategory.color1}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color1: e.target.value })
                          }
                          className="h-7 text-[10px] font-mono px-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">Mid Main</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={currentCategory.color2}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color2: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                        />
                        <Input
                          value={currentCategory.color2}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color2: e.target.value })
                          }
                          className="h-7 text-[10px] font-mono px-1.5"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 block mb-0.5">Dark Edge</span>
                      <div className="flex items-center gap-1">
                        <input
                          type="color"
                          value={currentCategory.color3}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color3: e.target.value })
                          }
                          className="w-6 h-6 rounded cursor-pointer border border-stone-300"
                        />
                        <Input
                          value={currentCategory.color3}
                          onChange={(e) =>
                            updateCategory(selectedIndex, { color3: e.target.value })
                          }
                          className="h-7 text-[10px] font-mono px-1.5"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preset Wall Palettes */}
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-stone-500 uppercase block mb-1">
                      Theme Presets:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_PALETTES.map((pal) => (
                        <button
                          key={pal.name}
                          type="button"
                          onClick={() =>
                            updateCategory(selectedIndex, {
                              color1: pal.color1,
                              color2: pal.color2,
                              color3: pal.color3
                            })
                          }
                          className="flex items-center gap-1.5 px-2 py-1 rounded-md border border-stone-200 dark:border-stone-800 text-[10px] hover:border-amber-400 bg-white dark:bg-stone-900"
                        >
                          <div
                            className="w-3.5 h-3.5 rounded-full border border-black/20"
                            style={{
                              background: `linear-gradient(135deg, ${pal.color1}, ${pal.color2})`
                            }}
                          />
                          <span>{pal.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: MANAGE BOWLS LIST */}
      {activeTab === 'bowls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Lazy Susan Bowls ({categories.length})
            </h3>
            <Button
              onClick={addCategory}
              size="sm"
              className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Bowl to Turntable
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <Card
                key={cat.id || idx}
                className={`relative transition-all border-2 ${
                  idx === selectedIndex
                    ? 'border-amber-500 shadow-lg ring-2 ring-amber-400/20'
                    : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-bold text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <div>
                        <CardTitle className="text-sm font-bold">{cat.name}</CardTitle>
                        <CardDescription className="text-[11px] font-mono">
                          slug: {cat.slug}
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveCategory(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => moveCategory(idx, 'down')}
                        disabled={idx === categories.length - 1}
                        className="p-1 text-stone-500 hover:text-stone-900 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeCategory(idx)}
                        className="p-1 text-rose-500 hover:text-rose-700 ml-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-1 space-y-3">
                  <div
                    className="h-20 rounded-xl flex items-center justify-between px-4 border border-white/20 shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${cat.color1}, ${cat.color2}, ${cat.color3})`
                    }}
                  >
                    <div className="text-white">
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-black/40">
                        {cat.label || 'TAG'}
                      </span>
                      <p className="text-xs font-semibold mt-1 max-w-[140px] truncate">
                        {cat.subtitle}
                      </p>
                    </div>

                    <div className="w-14 h-14 bg-white/20 rounded-full p-1.5 flex items-center justify-center backdrop-blur-sm">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-contain filter drop-shadow-md"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 font-bold">Name</span>
                      <Input
                        value={cat.name}
                        onChange={(e) => updateCategory(idx, { name: e.target.value })}
                        className="h-7 text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 font-bold">Slug</span>
                      <Input
                        value={cat.slug}
                        onChange={(e) => updateCategory(idx, { slug: e.target.value })}
                        className="h-7 text-xs mt-0.5 font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{ backgroundColor: cat.color1 }}
                        title="Color 1"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{ backgroundColor: cat.color2 }}
                        title="Color 2"
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border"
                        style={{ backgroundColor: cat.color3 }}
                        title="Color 3"
                      />
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedIndex(idx);
                        setActiveTab('simulator');
                      }}
                      className="text-xs text-amber-600 hover:text-amber-700 h-7 px-2"
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" />
                      View on Turntable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: DISPLAY & TITLE SETTINGS */}
      {activeTab === 'settings' && (
        <Card className="border-amber-200/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">Lazy Susan Display Settings</CardTitle>
            <CardDescription className="text-xs">
              Configure the heading texts, instruction hint, and bottom product strip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-white">
                  Enable 3D Turntable Section
                </p>
                <p className="text-[11px] text-stone-500">
                  When enabled, the 3D rotating Lazy Susan renders on the categories page.
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => updateSettings({ enabled: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
              <div>
                <p className="text-xs font-bold text-stone-900 dark:text-white">
                  Show Bottom Products Strip
                </p>
                <p className="text-[11px] text-stone-500">
                  Displays the mini product preview carousel under the turntable (height 760 vs 640).
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.products}
                onChange={(e) => updateSettings({ products: e.target.checked })}
                className="w-5 h-5 accent-amber-600 rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Eyebrow Text
              </label>
              <Input
                value={settings.eyebrow}
                onChange={(e) => updateSettings({ eyebrow: e.target.value })}
                className="mt-1 text-xs"
                placeholder="SHOP BY CATEGORY"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Title Start
                </label>
                <Input
                  value={settings.titleStart}
                  onChange={(e) => updateSettings({ titleStart: e.target.value })}
                  className="mt-1 text-xs"
                  placeholder="Spin Amma's"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                  Title Accent (Italic Font)
                </label>
                <Input
                  value={settings.titleAccent}
                  onChange={(e) => updateSettings({ titleAccent: e.target.value })}
                  className="mt-1 text-xs"
                  placeholder="lazy susan"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Hint / Instructions
              </label>
              <Input
                value={settings.hint}
                onChange={(e) => updateSettings({ hint: e.target.value })}
                className="mt-1 text-xs"
                placeholder="👆 Tap a bowl, a name or swipe to choose"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* JSON PAYLOAD MODAL */}
      {showJsonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-stone-900 border border-stone-800 text-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-stone-800">
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-amber-400" />
                <h3 className="font-bold text-sm">Turntable JSON Payload (GET /api/shop/categories)</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowJsonModal(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </Button>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-amber-200/90 bg-stone-950/60 rounded-lg m-4 border border-stone-800/80">
              <pre>{jsonPayloadString}</pre>
            </div>

            <div className="flex items-center justify-between p-4 border-t border-stone-800">
              <span className="text-[11px] text-stone-400">
                Served by PHP backend at GET /api/shop/categories
              </span>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopyJson}
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 mr-1" />
                      Copy JSON
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJsonModal(false)}
                  className="text-xs border-stone-700 text-stone-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
