'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  ShieldCheck, 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Palette, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  Copy,
  Star,
  Leaf,
  Home,
  Truck,
  Shield,
  Heart,
  Sun,
  HandMetal,
  ShoppingBag,
  Award,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export interface PromiseTagItem {
  title: string;
  sub: string;
  icon: 'leaf' | 'home' | 'truck' | 'shield' | 'heart' | 'star' | 'sun' | 'hand' | string;
  color1: string;
  color2: string;
}

export interface ShelfCategoryItem {
  label: string;
  image: string;
  category: string;
}

export interface TrustConfig {
  enabled: boolean;
  eyebrow: string;
  heading: string;
  headingAccent: string;
  ribbon: string;
  logo: string;
  rating: string;
  footer: string;
  tags: PromiseTagItem[];
  shelf: ShelfCategoryItem[];
}

export const DEFAULT_TRUST: TrustConfig = {
  enabled: true,
  eyebrow: 'THE AMBHUJAKSHI PROMISE',
  heading: 'Everything we make comes',
  headingAccent: 'four promises',
  ribbon: 'SINCE 1982',
  logo: 'assets/images/AMBHUJAKSHI  logo.png',
  rating: '4.9',
  footer: 'Loved by 12,000+ families',
  tags: [
    {
      title: '100%\nNatural',
      sub: 'No preservatives',
      icon: 'leaf',
      color1: '#3FA34D',
      color2: '#1F7A35'
    },
    {
      title: "Amma's\nRecipe",
      sub: 'Authentic taste',
      icon: 'home',
      color1: '#E96446',
      color2: '#C23A22'
    },
    {
      title: 'Fast\nDelivery',
      sub: 'Freshness intact',
      icon: 'truck',
      color1: '#4A90E2',
      color2: '#2A64B2'
    },
    {
      title: 'Secure\nPacking',
      sub: 'No leaks or spills',
      icon: 'shield',
      color1: '#9B59B6',
      color2: '#7A2C9B'
    }
  ],
  shelf: [
    {
      label: 'Pickles',
      image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      category: 'Pickles'
    },
    {
      label: 'Powders',
      image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
      category: 'Powders'
    },
    {
      label: 'Sweets',
      image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
      category: 'Sweets'
    },
    {
      label: 'Snacks',
      image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
      category: 'Snacks'
    },
    {
      label: 'Gifts',
      image: 'assets/images/good_food_text.png',
      category: 'Gifts'
    }
  ]
};

const VALID_ICONS = [
  { id: 'leaf', label: 'Leaf (Natural)', icon: Leaf },
  { id: 'home', label: "Home (Amma's)", icon: Home },
  { id: 'truck', label: 'Truck (Fast Delivery)', icon: Truck },
  { id: 'shield', label: 'Shield (Secure Packing)', icon: Shield },
  { id: 'heart', label: 'Heart (Loved & Pure)', icon: Heart },
  { id: 'star', label: 'Star (Premium Quality)', icon: Star },
  { id: 'sun', label: 'Sun (Sun-Dried Spices)', icon: Sun },
  { id: 'hand', label: 'Hand (Hand-Pounded)', icon: HandMetal }
];

const PRESET_GRADIENTS = [
  { name: 'Emerald Green', c1: '#3FA34D', c2: '#1F7A35' },
  { name: 'Terracotta Red', c1: '#E96446', c2: '#C23A22' },
  { name: 'Royal Blue', c1: '#4A90E2', c2: '#2A64B2' },
  { name: 'Imperial Violet', c1: '#9B59B6', c2: '#7A2C9B' },
  { name: 'Saffron Gold', c1: '#F59E2B', c2: '#B45309' },
  { name: 'Rosewood Pink', c1: '#E11D48', c2: '#9F1239' }
];

const SUGGESTED_SHELF_IMAGES = [
  { label: 'Pickles Jar', path: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg' },
  { label: 'Idli Podi Pouch', path: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg' },
  { label: 'Sunnunda Laddu', path: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg' },
  { label: 'Karam Murukku', path: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg' },
  { label: 'Good Food Gifting', path: 'assets/images/good_food_text.png' },
  { label: 'Banner Heritage', path: 'assets/images/banner_1.jpg' }
];

const STANDARD_CATEGORIES = ['Pickles', 'Powders', 'Sweets', 'Snacks', 'Gifts', 'Combos'];

interface TrustPromiseManagerProps {
  config: TrustConfig;
  onChange: (config: TrustConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function TrustPromiseManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: TrustPromiseManagerProps) {
  const [activeTab, setActiveTab] = useState<'tags' | 'shelf' | 'branding'>('tags');
  const [selectedTagIdx, setSelectedTagIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: TrustConfig = {
    enabled: config?.enabled ?? true,
    eyebrow: config?.eyebrow || 'THE AMBHUJAKSHI PROMISE',
    heading: config?.heading || 'Everything we make comes',
    headingAccent: config?.headingAccent || 'four promises',
    ribbon: config?.ribbon || 'SINCE 1982',
    logo: config?.logo || 'assets/images/AMBHUJAKSHI  logo.png',
    rating: config?.rating || '4.9',
    footer: config?.footer || 'Loved by 12,000+ families',
    tags: Array.isArray(config?.tags) && config.tags.length === 4
      ? config.tags
      : DEFAULT_TRUST.tags,
    shelf: Array.isArray(config?.shelf) && config.shelf.length > 0
      ? config.shelf
      : DEFAULT_TRUST.shelf
  };

  const updateRoot = <K extends keyof TrustConfig>(key: K, value: TrustConfig[K]) => {
    onChange({
      ...safeConfig,
      [key]: value
    });
  };

  const updateTag = (index: number, patch: Partial<PromiseTagItem>) => {
    const updated = [...safeConfig.tags];
    updated[index] = { ...updated[index], ...patch };
    updateRoot('tags', updated);
  };

  const updateShelfItem = (index: number, patch: Partial<ShelfCategoryItem>) => {
    const updated = [...safeConfig.shelf];
    updated[index] = { ...updated[index], ...patch };
    updateRoot('shelf', updated);
  };

  const handleAddShelfItem = () => {
    if (safeConfig.shelf.length >= 6) {
      toast.error('The wooden shelf accommodates up to 6 product categories cleanly.');
      return;
    }
    const newItem: ShelfCategoryItem = {
      label: 'New Category',
      image: 'assets/images/banner_1.jpg',
      category: 'Pickles'
    };
    updateRoot('shelf', [...safeConfig.shelf, newItem]);
    toast.success('Added shelf item!');
  };

  const handleDeleteShelfItem = (index: number) => {
    if (safeConfig.shelf.length <= 3) {
      toast.error('Keep at least 3 categories on the wooden shelf.');
      return;
    }
    updateRoot('shelf', safeConfig.shelf.filter((_, i) => i !== index));
    toast.success('Removed shelf item.');
  };

  const handleMoveShelfItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= safeConfig.shelf.length) return;
    const updated = [...safeConfig.shelf];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    updateRoot('shelf', updated);
  };

  const handleCopyJson = () => {
    const payload = {
      doc_id: 'trust',
      content: safeConfig
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success('Copied exact JSON payload to clipboard!');
  };

  // Helper to render icon component dynamically
  const renderTagIcon = (iconName: string, className = 'h-4 w-4') => {
    const match = VALID_ICONS.find(i => i.id === iconName);
    const IconComp = match ? match.icon : Leaf;
    return <IconComp className={className} />;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-900 via-orange-950 to-stone-900 text-white shadow-xl border border-amber-700/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              The AmbhuJakshi Promise
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 font-medium">
                Trust Section
              </span>
            </h2>
          </div>
          <p className="text-xs text-amber-200/80">
            Saffron festive card · Central brand medallion & ribbon · 4 tied kraft-paper promise tags · Wooden pantry shelf
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
            className="text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold gap-1.5 shadow-lg shadow-amber-950/50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Trust Section'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Tabs) & Right Mobile Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('tags')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tags'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Award className="h-4 w-4 text-amber-600" />
              4 Promise Tags ({safeConfig.tags.length})
            </button>
            <button
              onClick={() => setActiveTab('shelf')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'shelf'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-orange-600" />
              Wooden Shelf ({safeConfig.shelf.length})
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'branding'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Palette className="h-4 w-4 text-pink-600" />
              Medallion & Branding
            </button>
          </div>

          {/* TAB 1: THE 4 PROMISE TAGS */}
          {activeTab === 'tags' && (
            <div className="space-y-4">
              {/* Tags Quick Switcher */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <span>The 4 Kraft-Paper Promise Tags</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
                          Strictly 4 Required
                        </span>
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Tied with strings to the central medallion on the mobile home screen.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {safeConfig.tags.map((tag, idx) => {
                      const isSelected = idx === selectedTagIdx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedTagIdx(idx)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400">
                              Tag #{idx + 1}
                            </span>
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs"
                              style={{
                                background: `linear-gradient(135deg, ${tag.color1}, ${tag.color2})`
                              }}
                            >
                              {renderTagIcon(tag.icon, 'h-3 w-3')}
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 whitespace-pre-line leading-tight">
                            {tag.title.replace('\n', ' ')}
                          </p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                            {tag.sub}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Selected Tag Editor Form */}
              {safeConfig.tags[selectedTagIdx] && (
                <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                  <CardHeader className="p-4 pb-3 border-b flex flex-row items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-white shadow-md"
                        style={{
                          background: `linear-gradient(135deg, ${safeConfig.tags[selectedTagIdx].color1}, ${safeConfig.tags[selectedTagIdx].color2})`
                        }}
                      >
                        {renderTagIcon(safeConfig.tags[selectedTagIdx].icon, 'h-4 w-4')}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          Editing Tag #{selectedTagIdx + 1}: {safeConfig.tags[selectedTagIdx].title.replace('\n', ' ')}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {selectedTagIdx === 0 && 'Position: Top-Left (-5° tilt)'}
                          {selectedTagIdx === 1 && 'Position: Bottom-Left (+4° tilt)'}
                          {selectedTagIdx === 2 && 'Position: Top-Right (+5° tilt)'}
                          {selectedTagIdx === 3 && 'Position: Bottom-Right (-4° tilt)'}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* Title & Subtitle */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                            Tag Title (supports \n for 2 lines)
                          </label>
                        </div>
                        <Input
                          value={safeConfig.tags[selectedTagIdx].title}
                          onChange={e => updateTag(selectedTagIdx, { title: e.target.value })}
                          placeholder="100%\nNatural"
                          className="h-8 text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Subtitle (Trust Note)
                        </label>
                        <Input
                          value={safeConfig.tags[selectedTagIdx].sub}
                          onChange={e => updateTag(selectedTagIdx, { sub: e.target.value })}
                          placeholder="No preservatives"
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Icon Selection */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-2">
                        Tag Icon (Pick from supported icons)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {VALID_ICONS.map(item => {
                          const isCurrent = safeConfig.tags[selectedTagIdx].icon === item.id;
                          const IconC = item.icon;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => updateTag(selectedTagIdx, { icon: item.id })}
                              className={`p-2 rounded-lg border flex items-center gap-2 text-xs transition-all ${
                                isCurrent
                                  ? 'bg-amber-100/80 text-amber-900 border-amber-500 font-bold shadow-2xs'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <IconC className={`h-4 w-4 ${isCurrent ? 'text-amber-700' : 'text-slate-500'}`} />
                              <span className="truncate">{item.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Gradient Colors */}
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-pink-600" />
                        Tag Gradient Colors
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            Color 1 (Top Gradient)
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={safeConfig.tags[selectedTagIdx].color1}
                              onChange={e => updateTag(selectedTagIdx, { color1: e.target.value })}
                              className="h-8 w-10 p-0 rounded border cursor-pointer"
                            />
                            <Input
                              value={safeConfig.tags[selectedTagIdx].color1}
                              onChange={e => updateTag(selectedTagIdx, { color1: e.target.value })}
                              placeholder="#3FA34D"
                              className="h-8 text-xs font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            Color 2 (Bottom Gradient)
                          </label>
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="color"
                              value={safeConfig.tags[selectedTagIdx].color2}
                              onChange={e => updateTag(selectedTagIdx, { color2: e.target.value })}
                              className="h-8 w-10 p-0 rounded border cursor-pointer"
                            />
                            <Input
                              value={safeConfig.tags[selectedTagIdx].color2}
                              onChange={e => updateTag(selectedTagIdx, { color2: e.target.value })}
                              placeholder="#1F7A35"
                              className="h-8 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 mr-1">Presets:</span>
                        {PRESET_GRADIENTS.map((p, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => updateTag(selectedTagIdx, { color1: p.c1, color2: p.c2 })}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs hover:scale-105 transition-transform text-white"
                            style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: WOODEN SHELF CATEGORIES */}
          {activeTab === 'shelf' && (
            <div className="space-y-4">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <span>Wooden Shelf Categories</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold">
                        {safeConfig.shelf.length} Items (4-6 recommended)
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Categories displayed on the mahogany shelf. Tapping automatically opens that category page.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddShelfItem}
                    disabled={safeConfig.shelf.length >= 6}
                    className="h-8 text-xs bg-orange-600 hover:bg-orange-500 text-white gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Category
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-0 space-y-3">
                  {safeConfig.shelf.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 text-xs font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.label || `Item #${idx + 1}`}
                          </span>
                        </div>

                        {/* Order & Delete */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === 0}
                            onClick={() => handleMoveShelfItem(idx, 'up')}
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            disabled={idx === safeConfig.shelf.length - 1}
                            onClick={() => handleMoveShelfItem(idx, 'down')}
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                            onClick={() => handleDeleteShelfItem(idx)}
                            title="Delete Item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            Shelf Label
                          </label>
                          <Input
                            value={item.label}
                            onChange={e => updateShelfItem(idx, { label: e.target.value })}
                            placeholder="e.g. Pickles"
                            className="h-8 text-xs mt-1"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            Category Link
                          </label>
                          <select
                            value={item.category}
                            onChange={e => updateShelfItem(idx, { category: e.target.value })}
                            className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 mt-1"
                          >
                            {STANDARD_CATEGORIES.map(cat => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                            Image Path / URL
                          </label>
                          <Input
                            value={item.image}
                            onChange={e => updateShelfItem(idx, { image: e.target.value })}
                            placeholder="assets/images/..."
                            className="h-8 text-xs mt-1"
                          />
                        </div>
                      </div>

                      {/* Quick Image Suggestions */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-slate-500 mr-1">Image Presets:</span>
                        {SUGGESTED_SHELF_IMAGES.map((img, imgIdx) => (
                          <button
                            key={imgIdx}
                            type="button"
                            onClick={() => updateShelfItem(idx, { image: img.path })}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:border-orange-500 border border-transparent transition-colors"
                          >
                            {img.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: MEDALLION & BRANDING SETTINGS */}
          {activeTab === 'branding' && (
            <div className="space-y-4">
              {/* Visibility Switch */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Section Visibility</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeConfig.enabled}
                        onChange={e => updateRoot('enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                    </label>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Instantly show or hide the Trust section from all customer devices.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Header Titles */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Header Titles</CardTitle>
                  <CardDescription className="text-xs">
                    Festive cream pill kicker and royal heading typography.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Eyebrow Kicker Pill
                    </label>
                    <Input
                      value={safeConfig.eyebrow}
                      onChange={e => updateRoot('eyebrow', e.target.value)}
                      placeholder="THE AMBHUJAKSHI PROMISE"
                      className="h-8 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Heading First Line
                      </label>
                      <Input
                        value={safeConfig.heading}
                        onChange={e => updateRoot('heading', e.target.value)}
                        placeholder="Everything we make comes"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Heading Accent (prefixed with "with")
                      </label>
                      <Input
                        value={safeConfig.headingAccent}
                        onChange={e => updateRoot('headingAccent', e.target.value)}
                        placeholder="four promises"
                        className="h-8 text-xs mt-1 font-serif text-pink-700 font-bold"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Central Medallion & Trust Footer */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Central Medallion & Trust Proof</CardTitle>
                  <CardDescription className="text-xs">
                    Branded gold medallion, ribbon banner, star rating, and customer proof footer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Ribbon Sash Banner
                      </label>
                      <Input
                        value={safeConfig.ribbon}
                        onChange={e => updateRoot('ribbon', e.target.value)}
                        placeholder="SINCE 1982"
                        className="h-8 text-xs mt-1 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Logo Path / URL
                      </label>
                      <Input
                        value={safeConfig.logo}
                        onChange={e => updateRoot('logo', e.target.value)}
                        placeholder="assets/images/AMBHUJAKSHI  logo.png"
                        className="h-8 text-xs mt-1 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Star Rating
                      </label>
                      <Input
                        value={safeConfig.rating}
                        onChange={e => updateRoot('rating', e.target.value)}
                        placeholder="4.9"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Footer Families Proof
                      </label>
                      <Input
                        value={safeConfig.footer}
                        onChange={e => updateRoot('footer', e.target.value)}
                        placeholder="Loved by 12,000+ families"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MOBILE PHONE PREVIEW (Aspect Ratio 362/420) */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="mx-auto w-full max-w-[340px] bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Mobile Surface: 362 x 420 Scaled Festive Card */}
            <div
              className="relative overflow-hidden rounded-[26px] select-none shadow-2xl transition-all"
              style={{
                height: '460px',
                background: 'radial-gradient(circle at 50% 4%, #FFF3C8 0%, #FFD66B 40%, #F59E2B 78%, #E0701A 100%)'
              }}
            >
              {/* Subtle Mandala / Festive Texture */}
              <div 
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
                  backgroundSize: '14px 14px'
                }}
              />

              {/* 1. Header (Kicker & Heading) */}
              <div className="relative z-10 pt-3 text-center px-4">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FFF6DC] text-[#9E1B2C] text-[8.5px] font-black tracking-widest uppercase shadow-xs">
                  {safeConfig.eyebrow}
                </span>
                <h3 className="text-base font-serif font-bold text-[#4A0E14] leading-tight mt-1.5">
                  {safeConfig.heading}
                </h3>
                <h3 className="text-base font-serif font-bold leading-tight">
                  <span className="text-[#4A0E14]">with </span>
                  <span className="text-[#C2185B] italic font-semibold">{safeConfig.headingAccent}</span>
                </h3>
              </div>

              {/* 2. String Lines & 4 Tied Kraft Tags + Center Medallion */}
              <div className="relative z-10 h-[220px] w-full px-2 mt-2">
                {/* SVG Strings connecting tag eyelets to center medallion */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {/* String to Tag 0 (Top Left) */}
                  <line x1="68" y1="36" x2="160" y2="88" stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                  {/* String to Tag 1 (Bottom Left) */}
                  <line x1="68" y1="130" x2="160" y2="108" stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                  {/* String to Tag 2 (Top Right) */}
                  <line x1="250" y1="36" x2="160" y2="88" stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                  {/* String to Tag 3 (Bottom Right) */}
                  <line x1="250" y1="130" x2="160" y2="108" stroke="#8B5A2B" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
                </svg>

                {/* Center Medallion */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                  {/* Sunburst Scalloped Medallion Outer */}
                  <div
                    className="w-24 h-24 rounded-full p-1.5 shadow-xl flex items-center justify-center relative border-2 border-[#D4AF37]"
                    style={{
                      background: 'radial-gradient(circle, #FFE599 0%, #D4AF37 70%, #996515 100%)'
                    }}
                  >
                    {/* Inner Medallion Core */}
                    <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-2 shadow-inner border border-amber-200">
                      <img
                        src="/assets/images/AMBHUJAKSHI  logo.png"
                        alt="Logo"
                        className="w-12 h-12 object-contain"
                        onError={e => {
                          // Fallback icon
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span className="text-[7px] font-black text-[#5A1030] tracking-wider uppercase text-center mt-0.5">
                        AMBHUJAKSHI
                      </span>
                    </div>

                    {/* Ribbon Sash pinned at the bottom */}
                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#996515] text-[#3D1402] text-[8px] font-black px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider border border-amber-200">
                      {safeConfig.ribbon}
                    </div>
                  </div>
                </div>

                {/* TAG 0: Top Left (-5deg) */}
                <div
                  className="absolute left-1 top-2 w-[100px] bg-[#FFF8EB] p-2 rounded-lg shadow-lg border border-amber-200/80 cursor-pointer hover:scale-105 transition-transform z-10"
                  style={{ transform: 'rotate(-5deg)' }}
                  onClick={() => { setActiveTab('tags'); setSelectedTagIdx(0); }}
                >
                  {/* Metallic Eyelet */}
                  <div className="absolute -top-1.5 right-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white mb-1 shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${safeConfig.tags[0].color1}, ${safeConfig.tags[0].color2})` }}
                  >
                    {renderTagIcon(safeConfig.tags[0].icon, 'h-3 w-3')}
                  </div>
                  <p className="text-[10px] font-black leading-tight text-[#4A0E14] whitespace-pre-line">
                    {safeConfig.tags[0].title}
                  </p>
                  <p className="text-[8px] text-slate-500 truncate mt-0.5">
                    {safeConfig.tags[0].sub}
                  </p>
                </div>

                {/* TAG 1: Bottom Left (+4deg) */}
                <div
                  className="absolute left-1 bottom-1 w-[100px] bg-[#FFF8EB] p-2 rounded-lg shadow-lg border border-amber-200/80 cursor-pointer hover:scale-105 transition-transform z-10"
                  style={{ transform: 'rotate(4deg)' }}
                  onClick={() => { setActiveTab('tags'); setSelectedTagIdx(1); }}
                >
                  <div className="absolute -top-1.5 right-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white mb-1 shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${safeConfig.tags[1].color1}, ${safeConfig.tags[1].color2})` }}
                  >
                    {renderTagIcon(safeConfig.tags[1].icon, 'h-3 w-3')}
                  </div>
                  <p className="text-[10px] font-black leading-tight text-[#4A0E14] whitespace-pre-line">
                    {safeConfig.tags[1].title}
                  </p>
                  <p className="text-[8px] text-slate-500 truncate mt-0.5">
                    {safeConfig.tags[1].sub}
                  </p>
                </div>

                {/* TAG 2: Top Right (+5deg) */}
                <div
                  className="absolute right-1 top-2 w-[100px] bg-[#FFF8EB] p-2 rounded-lg shadow-lg border border-amber-200/80 cursor-pointer hover:scale-105 transition-transform z-10"
                  style={{ transform: 'rotate(5deg)' }}
                  onClick={() => { setActiveTab('tags'); setSelectedTagIdx(2); }}
                >
                  <div className="absolute -top-1.5 left-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white mb-1 shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${safeConfig.tags[2].color1}, ${safeConfig.tags[2].color2})` }}
                  >
                    {renderTagIcon(safeConfig.tags[2].icon, 'h-3 w-3')}
                  </div>
                  <p className="text-[10px] font-black leading-tight text-[#4A0E14] whitespace-pre-line">
                    {safeConfig.tags[2].title}
                  </p>
                  <p className="text-[8px] text-slate-500 truncate mt-0.5">
                    {safeConfig.tags[2].sub}
                  </p>
                </div>

                {/* TAG 3: Bottom Right (-4deg) */}
                <div
                  className="absolute right-1 bottom-1 w-[100px] bg-[#FFF8EB] p-2 rounded-lg shadow-lg border border-amber-200/80 cursor-pointer hover:scale-105 transition-transform z-10"
                  style={{ transform: 'rotate(-4deg)' }}
                  onClick={() => { setActiveTab('tags'); setSelectedTagIdx(3); }}
                >
                  <div className="absolute -top-1.5 left-2 w-3 h-3 rounded-full bg-slate-300 border border-slate-500 shadow-2xs flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white mb-1 shadow-xs"
                    style={{ background: `linear-gradient(135deg, ${safeConfig.tags[3].color1}, ${safeConfig.tags[3].color2})` }}
                  >
                    {renderTagIcon(safeConfig.tags[3].icon, 'h-3 w-3')}
                  </div>
                  <p className="text-[10px] font-black leading-tight text-[#4A0E14] whitespace-pre-line">
                    {safeConfig.tags[3].title}
                  </p>
                  <p className="text-[8px] text-slate-500 truncate mt-0.5">
                    {safeConfig.tags[3].sub}
                  </p>
                </div>
              </div>

              {/* 3. Wooden Shelf (Bottom Pantry Plank) */}
              <div className="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none z-10">
                {/* Shelf Bevel Top Edge */}
                <div className="absolute top-[36px] left-0 right-0 h-1.5 bg-gradient-to-b from-[#E58A4E] to-[#B4542A] shadow-md z-20" />

                {/* Mahogany Shelf Face */}
                <div
                  className="absolute top-[42px] bottom-0 left-0 right-0"
                  style={{
                    background: 'linear-gradient(180deg, #5A2D0A 0%, #3B1B04 60%, #200D01 100%)'
                  }}
                />

                {/* Shelf Items sitting on the plank */}
                <div className="absolute top-0 left-0 right-0 flex justify-center items-end gap-2 px-2 pointer-events-auto z-30">
                  {safeConfig.shelf.map((s, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center cursor-pointer group"
                      onClick={() => setActiveTab('shelf')}
                    >
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-100 border-2 border-amber-300 shadow-xl group-hover:scale-110 transition-transform">
                        <img
                          src={s.image.startsWith('assets/') ? `/${s.image}` : s.image}
                          alt={s.label}
                          className="w-full h-full object-cover"
                          onError={e => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-[#FFE7B8] uppercase tracking-wider mt-1 truncate max-w-[50px] text-center">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 4. Rating Footer Pill */}
                <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-auto z-30">
                  <div className="px-3.5 py-1 rounded-full bg-[#4A0E14] text-[#FFE7B8] text-[9.5px] font-bold shadow-lg border border-amber-900/50 flex items-center gap-1.5">
                    <span className="text-amber-400">⭐ {safeConfig.rating}</span>
                    <span className="text-white/40">·</span>
                    <span className="text-white/90">{safeConfig.footer}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Below Phone */}
            <div className="mt-3 text-center text-[11px] text-slate-400">
              Live Phone Preview · Tap any tag or shelf item to edit
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
                <Code2 className="h-4 w-4 text-amber-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Exact Backend JSON Payload (doc_id: "trust")
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

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-amber-400 custom-scrollbar">
              <pre>{JSON.stringify({
                doc_id: 'trust',
                content: safeConfig
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
                className="text-xs bg-amber-600 hover:bg-amber-500 text-white"
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
