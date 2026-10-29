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
  Palette, 
  Check, 
  Layers, 
  ArrowUp, 
  ArrowDown, 
  Code2, 
  Copy,
  Clock,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Image as ImageIcon,
  ZoomIn,
  Move,
  Film,
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export interface PickleShot {
  url: string;
  caption: string;
  scaleFrom?: number;
  scaleTo?: number;
  panXFrom?: number;
  panXTo?: number;
  panYFrom?: number;
  panYTo?: number;
  ms: number;
}

export interface PickleTheme {
  c1: string;
  c2: string;
  accent: string;
  accent2: string;
  glow: string;
}

export interface PickleItem {
  productId: string;
  variantId: string;
  name: string;
  tag: string;
  description: string;
  cureNote: string;
  thumb: string;
  spice: number;
  price: number;
  mrp: number;
  theme: PickleTheme;
  shots: PickleShot[];
}

export interface PicklesSettings {
  enabled: boolean;
  eyebrow: string;
  title: string;
  viewAllLabel: string;
  addLabel: string;
  chilliIcon: string;
}

export interface PicklesConfig {
  settings: PicklesSettings;
  pickles: PickleItem[];
}

export const DEFAULT_PICKLES_CONFIG: PicklesConfig = {
  settings: {
    enabled: true,
    eyebrow: 'HAND-MIXED · SUN-CURED',
    title: "Amma's Pickles",
    viewAllLabel: 'View all →',
    addLabel: 'Add to cart',
    chilliIcon: 'assets/images/chilli.png'
  },
  pickles: [
    {
      productId: 'mango_avakaya',
      variantId: '500g',
      name: 'Mango Avakaya',
      tag: 'Best Seller',
      description: 'Sun-dried raw mangoes with Guntur chillies & cold-pressed sesame oil.',
      cureNote: '3-week sun cured',
      thumb: 'assets/images/mango_close.jpg',
      spice: 4,
      price: 349,
      mrp: 399,
      theme: {
        c1: '#C2273A',
        c2: '#7A0F12',
        accent: '#FFD58A',
        accent2: '#E9C46A',
        glow: '#FFB450'
      },
      shots: [
        {
          url: 'assets/images/mango_bowl.jpg',
          caption: 'Tossed by hand in small batches',
          scaleFrom: 1.15,
          scaleTo: 1.0,
          ms: 3500
        },
        {
          url: 'assets/images/mango_jar.jpg',
          caption: 'Preserved in traditional bharanis',
          scaleFrom: 1.1,
          scaleTo: 1.1,
          panXFrom: 0,
          panXTo: 0.08,
          ms: 2500
        },
        {
          url: 'assets/images/mango_spoon.jpg',
          caption: 'Pairs perfectly with hot rice & ghee',
          scaleFrom: 1.0,
          scaleTo: 1.12,
          ms: 3000
        }
      ]
    },
    {
      productId: 'lemon_pickle',
      variantId: '250g',
      name: 'Lemon Pickle',
      tag: "Ammamma's Recipe",
      description: 'Juicy lemons aged with rock salt and roasted fenugreek.',
      cureNote: '1-year aged',
      thumb: 'assets/images/lemon_close.jpg',
      spice: 2,
      price: 149,
      mrp: 175,
      theme: {
        c1: '#D4AF37',
        c2: '#8A5A19',
        accent: '#FFF3E0',
        accent2: '#FFE0B2',
        glow: '#FFD54F'
      },
      shots: [
        {
          url: 'assets/images/lemon_bowl.jpg',
          caption: 'Freshly squeezed lemons',
          scaleFrom: 1.1,
          scaleTo: 1.0,
          ms: 3000
        },
        {
          url: 'assets/images/lemon_jar.jpg',
          caption: 'Aged to perfection',
          scaleFrom: 1.0,
          scaleTo: 1.1,
          panYFrom: 0,
          panYTo: 0.05,
          ms: 2800
        },
        {
          url: 'assets/images/lemon_spoon.jpg',
          caption: 'Tangy, spicy, and irresistible',
          scaleFrom: 1.05,
          scaleTo: 1.15,
          ms: 3200
        }
      ]
    },
    {
      productId: 'gongura_pickle',
      variantId: '250g',
      name: 'Gongura Pickle',
      tag: 'Andhra Special',
      description: 'Hand-picked sorrel leaves cooked with red chillies & garlic.',
      cureNote: 'Wood-fired',
      thumb: 'assets/images/gongura_close.jpg',
      spice: 5,
      price: 179,
      mrp: 210,
      theme: {
        c1: '#1F5A1E',
        c2: '#0B2E0B',
        accent: '#C5E1A5',
        accent2: '#9CCC65',
        glow: '#AED581'
      },
      shots: [
        {
          url: 'assets/images/gongura_bowl.jpg',
          caption: 'Farm fresh Gongura leaves',
          scaleFrom: 1.2,
          scaleTo: 1.0,
          ms: 3200
        },
        {
          url: 'assets/images/gongura_jar.jpg',
          caption: 'The authentic taste of Andhra',
          scaleFrom: 1.0,
          scaleTo: 1.05,
          panXFrom: -0.05,
          panXTo: 0.05,
          ms: 2500
        },
        {
          url: 'assets/images/gongura_spoon.jpg',
          caption: 'A burst of tangy heat',
          scaleFrom: 1.0,
          scaleTo: 1.1,
          ms: 3300
        }
      ]
    },
    {
      productId: 'garlic_pickle',
      variantId: '250g',
      name: 'Garlic Pickle',
      tag: 'Immunity Booster',
      description: 'Peeled garlic cloves roasted in mustard oil with traditional spices.',
      cureNote: 'Slow-roasted',
      thumb: 'assets/images/garlic_close.jpg',
      spice: 3,
      price: 199,
      mrp: 240,
      theme: {
        c1: '#8A4A1C',
        c2: '#3A1A05',
        accent: '#FFCC80',
        accent2: '#FFA726',
        glow: '#FFB74D'
      },
      shots: [
        {
          url: 'assets/images/garlic_bowl.jpg',
          caption: 'Plump garlic cloves roasted slow',
          scaleFrom: 1.1,
          scaleTo: 1.0,
          ms: 3000
        },
        {
          url: 'assets/images/garlic_jar.jpg',
          caption: 'Infused with cold-pressed mustard oil',
          scaleFrom: 1.0,
          scaleTo: 1.1,
          panXFrom: 0,
          panXTo: 0.06,
          ms: 2700
        },
        {
          url: 'assets/images/garlic_spoon.jpg',
          caption: 'Deep, savory & aromatic heat',
          scaleFrom: 1.05,
          scaleTo: 1.12,
          ms: 3100
        }
      ]
    }
  ]
};

const THEME_PRESETS = [
  {
    name: 'Avakaya Crimson',
    c1: '#C2273A',
    c2: '#7A0F12',
    accent: '#FFD58A',
    accent2: '#E9C46A',
    glow: '#FFB450'
  },
  {
    name: 'Aged Lemon Gold',
    c1: '#D4AF37',
    c2: '#8A5A19',
    accent: '#FFF3E0',
    accent2: '#FFE0B2',
    glow: '#FFD54F'
  },
  {
    name: 'Gongura Sorrel Emerald',
    c1: '#1F5A1E',
    c2: '#0B2E0B',
    accent: '#C5E1A5',
    accent2: '#9CCC65',
    glow: '#AED581'
  },
  {
    name: 'Roasted Garlic Amber',
    c1: '#8A4A1C',
    c2: '#3A1A05',
    accent: '#FFCC80',
    accent2: '#FFA726',
    glow: '#FFB74D'
  }
];

const SUGGESTED_ASSETS = [
  { label: 'Mango Bowl', path: 'assets/images/mango_bowl.jpg' },
  { label: 'Mango Jar', path: 'assets/images/mango_jar.jpg' },
  { label: 'Mango Spoon', path: 'assets/images/mango_spoon.jpg' },
  { label: 'Mango Close', path: 'assets/images/mango_close.jpg' },
  { label: 'Lemon Bowl', path: 'assets/images/lemon_bowl.jpg' },
  { label: 'Lemon Jar', path: 'assets/images/lemon_jar.jpg' },
  { label: 'Lemon Spoon', path: 'assets/images/lemon_spoon.jpg' },
  { label: 'Lemon Close', path: 'assets/images/lemon_close.jpg' },
  { label: 'Gongura Bowl', path: 'assets/images/gongura_bowl.jpg' },
  { label: 'Gongura Jar', path: 'assets/images/gongura_jar.jpg' },
  { label: 'Gongura Spoon', path: 'assets/images/gongura_spoon.jpg' },
  { label: 'Gongura Close', path: 'assets/images/gongura_close.jpg' },
  { label: 'Garlic Bowl', path: 'assets/images/garlic_bowl.jpg' },
  { label: 'Garlic Jar', path: 'assets/images/garlic_jar.jpg' },
  { label: 'Garlic Spoon', path: 'assets/images/garlic_spoon.jpg' },
  { label: 'Garlic Close', path: 'assets/images/garlic_close.jpg' }
];

interface PicklesShowcaseManagerProps {
  config: PicklesConfig;
  onChange: (config: PicklesConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
  allProducts?: any[];
}

export function PicklesShowcaseManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults,
  allProducts = []
}: PicklesShowcaseManagerProps) {
  const [selectedPickleIdx, setSelectedPickleIdx] = useState<number>(0);
  const [currentShotIdx, setCurrentShotIdx] = useState<number>(0);
  const [isPlayingShots, setIsPlayingShots] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'pickles' | 'settings'>('pickles');
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: PicklesConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      eyebrow: config?.settings?.eyebrow || 'HAND-MIXED · SUN-CURED',
      title: config?.settings?.title || "Amma's Pickles",
      viewAllLabel: config?.settings?.viewAllLabel || 'View all →',
      addLabel: config?.settings?.addLabel || 'Add to cart',
      chilliIcon: config?.settings?.chilliIcon || 'assets/images/chilli.png'
    },
    pickles: Array.isArray(config?.pickles) && config.pickles.length > 0
      ? config.pickles
      : DEFAULT_PICKLES_CONFIG.pickles
  };

  const currentPickle = safeConfig.pickles[selectedPickleIdx] || safeConfig.pickles[0];
  const safeShots = Array.isArray(currentPickle.shots) && currentPickle.shots.length > 0
    ? currentPickle.shots
    : [{ url: currentPickle.thumb, caption: currentPickle.name, ms: 3000 }];
  const currentShot = safeShots[currentShotIdx % safeShots.length];

  // Auto-cycle through shots of active pickle in live preview
  useEffect(() => {
    if (!isPlayingShots || safeShots.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentShotIdx(prev => (prev + 1) % safeShots.length);
    }, currentShot.ms || 3000);
    return () => clearInterval(interval);
  }, [isPlayingShots, safeShots.length, currentShot.ms, selectedPickleIdx]);

  const updateSettings = <K extends keyof PicklesSettings>(key: K, value: PicklesSettings[K]) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [key]: value
      }
    });
  };

  const updatePickle = (index: number, patch: Partial<PickleItem>) => {
    const updated = [...safeConfig.pickles];
    updated[index] = { ...updated[index], ...patch };
    onChange({
      ...safeConfig,
      pickles: updated
    });
  };

  const handleAddPickle = () => {
    const newPickle: PickleItem = {
      productId: 'new_pickle',
      variantId: '250g',
      name: 'New Heritage Pickle',
      tag: "Amma's Special",
      description: 'Handcrafted seasonal pickle cured under the golden Andhra sun.',
      cureNote: 'Fresh Batch',
      thumb: 'assets/images/mango_close.jpg',
      spice: 3,
      price: 199,
      mrp: 230,
      theme: {
        c1: '#C2273A',
        c2: '#7A0F12',
        accent: '#FFD58A',
        accent2: '#E9C46A',
        glow: '#FFB450'
      },
      shots: [
        {
          url: 'assets/images/mango_bowl.jpg',
          caption: 'Freshly mixed with stone-pounded spices',
          scaleFrom: 1.15,
          scaleTo: 1.0,
          ms: 3200
        }
      ]
    };
    const updated = [...safeConfig.pickles, newPickle];
    onChange({ ...safeConfig, pickles: updated });
    setSelectedPickleIdx(updated.length - 1);
    setCurrentShotIdx(0);
    toast.success('Added new pickle showcase item!');
  };

  const handleDuplicatePickle = (index: number) => {
    const target = safeConfig.pickles[index];
    if (!target) return;
    const cloned: PickleItem = {
      ...target,
      name: `${target.name} (Copy)`,
      productId: `${target.productId}_copy`
    };
    const updated = [...safeConfig.pickles];
    updated.splice(index + 1, 0, cloned);
    onChange({ ...safeConfig, pickles: updated });
    setSelectedPickleIdx(index + 1);
    toast.success('Cloned pickle showcase item!');
  };

  const handleDeletePickle = (index: number) => {
    if (safeConfig.pickles.length <= 1) {
      toast.error('Keep at least 1 pickle in the showcase.');
      return;
    }
    const updated = safeConfig.pickles.filter((_, i) => i !== index);
    onChange({ ...safeConfig, pickles: updated });
    setSelectedPickleIdx(Math.max(0, index - 1));
    toast.success('Removed pickle from showcase.');
  };

  const handleMovePickle = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= safeConfig.pickles.length) return;
    const updated = [...safeConfig.pickles];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ ...safeConfig, pickles: updated });
    setSelectedPickleIdx(targetIdx);
  };

  // Shot helpers
  const handleAddShot = () => {
    const newShot: PickleShot = {
      url: currentPickle.thumb || 'assets/images/mango_bowl.jpg',
      caption: 'Tossed by hand in small batches',
      scaleFrom: 1.12,
      scaleTo: 1.0,
      ms: 3000
    };
    updatePickle(selectedPickleIdx, {
      shots: [...safeShots, newShot]
    });
    setCurrentShotIdx(safeShots.length);
    toast.success('Added cinematic camera shot!');
  };

  const handleDeleteShot = (shotIdx: number) => {
    if (safeShots.length <= 1) {
      toast.error('Each pickle needs at least 1 camera shot.');
      return;
    }
    const updatedShots = safeShots.filter((_, i) => i !== shotIdx);
    updatePickle(selectedPickleIdx, { shots: updatedShots });
    setCurrentShotIdx(Math.max(0, shotIdx - 1));
    toast.success('Removed camera shot.');
  };

  const updateCurrentShot = (shotIdx: number, patch: Partial<PickleShot>) => {
    const updatedShots = [...safeShots];
    updatedShots[shotIdx] = { ...updatedShots[shotIdx], ...patch };
    updatePickle(selectedPickleIdx, { shots: updatedShots });
  };

  const handleCopyJson = () => {
    const payload = {
      doc_id: 'pickles',
      content: {
        settings: safeConfig.settings,
        pickles: safeConfig.pickles
      }
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success('Copied exact JSON payload to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-red-950 via-rose-900 to-slate-900 text-white shadow-xl border border-rose-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/30">
              <Flame className="h-5 w-5 fill-red-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Amma's Pickles
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/30 text-red-200 border border-red-400/40 font-medium">
                Pickles Showcase
              </span>
            </h2>
          </div>
          <p className="text-xs text-red-200/80">
            Gold-framed photo window · Cinematic Ken Burns camera moves · Dynamic colour themes per pickle · Chilli spice meter
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
            className="text-xs bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold gap-1.5 shadow-lg shadow-rose-950/50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Pickles'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Tabs) & Right Mobile Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls & Pickles Editor */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('pickles')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'pickles'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-rose-600" />
              Pickles Items ({safeConfig.pickles.length})
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
              Showcase Header & Settings
            </button>
          </div>

          {/* TAB 1: PICKLES ITEMS */}
          {activeTab === 'pickles' && (
            <div className="space-y-4">
              {/* Pickles Carousel Selector */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <span>Pickles in Showcase</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold">
                        {safeConfig.pickles.length} Pickles
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Select a pickle to edit its photos, cinematic camera moves, and color theme.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddPickle}
                    className="h-8 text-xs bg-rose-600 hover:bg-rose-500 text-white gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New Pickle
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {safeConfig.pickles.map((pickle, idx) => {
                      const isSelected = idx === selectedPickleIdx;
                      return (
                        <button
                          key={pickle.productId || idx}
                          onClick={() => {
                            setSelectedPickleIdx(idx);
                            setCurrentShotIdx(0);
                          }}
                          className={`flex-shrink-0 text-left p-2.5 rounded-xl border transition-all w-48 ${
                            isSelected
                              ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-500 ring-1 ring-rose-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span
                              className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: pickle.theme?.c1 || '#C2273A',
                                color: pickle.theme?.accent || '#FFF'
                              }}
                            >
                              {pickle.tag || 'Special'}
                            </span>
                            <div className="flex items-center text-red-500 text-[10px]">
                              {'🌶️'.repeat(pickle.spice || 3)}
                            </div>
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {pickle.name}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="font-extrabold text-slate-900 dark:text-slate-100">
                              ₹{pickle.price}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {pickle.shots?.length || 0} camera shots
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* CURRENT SELECTED PICKLE FORM */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: currentPickle.theme?.c1 || '#C2273A' }}
                    >
                      {selectedPickleIdx + 1}
                    </span>
                    <div>
                      <CardTitle className="text-sm font-bold">
                        Editing: {currentPickle.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Product ID: <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{currentPickle.productId}</code> · Variant: {currentPickle.variantId}
                      </CardDescription>
                    </div>
                  </div>

                  {/* Move & Actions */}
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={selectedPickleIdx === 0}
                      onClick={() => handleMovePickle(selectedPickleIdx, 'up')}
                      title="Move Up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={selectedPickleIdx === safeConfig.pickles.length - 1}
                      onClick={() => handleMovePickle(selectedPickleIdx, 'down')}
                      title="Move Down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-slate-600"
                      onClick={() => handleDuplicatePickle(selectedPickleIdx)}
                      title="Duplicate Pickle"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      onClick={() => handleDeletePickle(selectedPickleIdx)}
                      title="Delete Pickle"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* Basic Info: Name, ProductId, VariantId */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Pickle Name
                      </label>
                      <Input
                        value={currentPickle.name}
                        onChange={e => updatePickle(selectedPickleIdx, { name: e.target.value })}
                        placeholder="e.g. Mango Avakaya"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Product ID (for cart)
                      </label>
                      <Input
                        value={currentPickle.productId}
                        onChange={e => updatePickle(selectedPickleIdx, { productId: e.target.value })}
                        placeholder="e.g. mango_avakaya"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Variant ID
                      </label>
                      <Input
                        value={currentPickle.variantId}
                        onChange={e => updatePickle(selectedPickleIdx, { variantId: e.target.value })}
                        placeholder="e.g. 500g"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Tag, Cure Note, Spice */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Badge Tag
                      </label>
                      <Input
                        value={currentPickle.tag}
                        onChange={e => updatePickle(selectedPickleIdx, { tag: e.target.value })}
                        placeholder="Best Seller"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Cure Note
                      </label>
                      <Input
                        value={currentPickle.cureNote}
                        onChange={e => updatePickle(selectedPickleIdx, { cureNote: e.target.value })}
                        placeholder="3-week sun cured"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Spice Meter (0 to 5)
                      </label>
                      <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(lvl => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => updatePickle(selectedPickleIdx, { spice: lvl })}
                            className="text-base hover:scale-125 transition-transform"
                          >
                            {lvl <= currentPickle.spice ? '🌶️' : '⚪'}
                          </button>
                        ))}
                        <span className="text-xs font-bold ml-1 text-slate-700 dark:text-slate-300">
                          {currentPickle.spice}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Price & MRP */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Selling Price (₹)
                      </label>
                      <Input
                        type="number"
                        value={currentPickle.price}
                        onChange={e => updatePickle(selectedPickleIdx, { price: parseFloat(e.target.value) || 0 })}
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        MRP (₹)
                      </label>
                      <Input
                        type="number"
                        value={currentPickle.mrp}
                        onChange={e => updatePickle(selectedPickleIdx, { mrp: parseFloat(e.target.value) || 0 })}
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Thumbnail Asset Path
                      </label>
                      <Input
                        value={currentPickle.thumb}
                        onChange={e => updatePickle(selectedPickleIdx, { thumb: e.target.value })}
                        placeholder="assets/images/mango_close.jpg"
                        className="h-8 text-xs mt-1 font-mono"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Description Note
                    </label>
                    <textarea
                      value={currentPickle.description}
                      onChange={e => updatePickle(selectedPickleIdx, { description: e.target.value })}
                      placeholder="Sun-dried raw mangoes with Guntur chillies..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 mt-1"
                    />
                  </div>

                  {/* Color Theme Customizer */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Palette className="h-3.5 w-3.5 text-pink-600" />
                        Pickle Color Theme (Background Gradient & Glow)
                      </span>
                      {/* Presets */}
                      <div className="flex items-center gap-1">
                        {THEME_PRESETS.map((tp, tpIdx) => (
                          <button
                            key={tpIdx}
                            type="button"
                            onClick={() => updatePickle(selectedPickleIdx, { theme: tp })}
                            className="text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-2xs hover:scale-105 transition-transform text-white"
                            style={{ background: `linear-gradient(135deg, ${tp.c1}, ${tp.c2})` }}
                            title={tp.name}
                          >
                            {tp.name.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      <div>
                        <label className="text-[10px] font-medium text-slate-500">c1 (Primary)</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="color"
                            value={currentPickle.theme?.c1 || '#C2273A'}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, c1: e.target.value } })}
                            className="h-7 w-7 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentPickle.theme?.c1}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, c1: e.target.value } })}
                            className="h-7 text-[10px] font-mono px-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-500">c2 (Dark Tone)</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="color"
                            value={currentPickle.theme?.c2 || '#7A0F12'}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, c2: e.target.value } })}
                            className="h-7 w-7 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentPickle.theme?.c2}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, c2: e.target.value } })}
                            className="h-7 text-[10px] font-mono px-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-500">accent</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="color"
                            value={currentPickle.theme?.accent || '#FFD58A'}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, accent: e.target.value } })}
                            className="h-7 w-7 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentPickle.theme?.accent}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, accent: e.target.value } })}
                            className="h-7 text-[10px] font-mono px-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-500">accent2</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="color"
                            value={currentPickle.theme?.accent2 || '#E9C46A'}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, accent2: e.target.value } })}
                            className="h-7 w-7 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentPickle.theme?.accent2}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, accent2: e.target.value } })}
                            className="h-7 text-[10px] font-mono px-1"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-500">glow</label>
                        <div className="flex items-center gap-1 mt-1">
                          <input
                            type="color"
                            value={currentPickle.theme?.glow || '#FFB450'}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, glow: e.target.value } })}
                            className="h-7 w-7 p-0 rounded border cursor-pointer"
                          />
                          <Input
                            value={currentPickle.theme?.glow}
                            onChange={e => updatePickle(selectedPickleIdx, { theme: { ...currentPickle.theme, glow: e.target.value } })}
                            className="h-7 text-[10px] font-mono px-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cinematic Ken Burns Camera Shots */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                          <Film className="h-3.5 w-3.5 text-blue-600" />
                          Cinematic Camera Shots ({safeShots.length})
                        </span>
                        <p className="text-[10px] text-slate-500">
                          Each shot animates with a slow Ken Burns camera move (zoom & pan) and crossfades seamlessly.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        onClick={handleAddShot}
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-500 text-white gap-1"
                      >
                        <Plus className="h-3 w-3" />
                        Add Shot
                      </Button>
                    </div>

                    {/* Shots List */}
                    <div className="space-y-3">
                      {safeShots.map((shot, sIdx) => {
                        const isCurrentShot = sIdx === currentShotIdx;
                        return (
                          <div
                            key={sIdx}
                            className={`p-3 rounded-xl border text-xs transition-all ${
                              isCurrentShot
                                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-400 ring-1 ring-blue-400'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold flex items-center gap-1.5">
                                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-bold">
                                  {sIdx + 1}
                                </span>
                                Shot #{sIdx + 1} · {shot.caption || 'Camera Shot'}
                              </span>

                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setCurrentShotIdx(sIdx)}
                                  className="h-6 text-[10px] px-2 text-blue-600"
                                >
                                  Preview Shot
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteShot(sIdx)}
                                  className="h-6 w-6 text-rose-600 hover:bg-rose-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Photo URL</label>
                                <Input
                                  value={shot.url}
                                  onChange={e => updateCurrentShot(sIdx, { url: e.target.value })}
                                  placeholder="assets/images/mango_bowl.jpg"
                                  className="h-7 text-[11px] font-mono mt-0.5"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Caption</label>
                                <Input
                                  value={shot.caption}
                                  onChange={e => updateCurrentShot(sIdx, { caption: e.target.value })}
                                  placeholder="Tossed by hand in small batches"
                                  className="h-7 text-[11px] mt-0.5"
                                />
                              </div>
                            </div>

                            {/* Camera Motion Controls: Duration, Zoom, Pan */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Duration (ms)</label>
                                <Input
                                  type="number"
                                  step="100"
                                  value={shot.ms}
                                  onChange={e => updateCurrentShot(sIdx, { ms: parseInt(e.target.value) || 3000 })}
                                  className="h-7 text-[11px] font-mono mt-0.5"
                                />
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Zoom (scaleFrom → scaleTo)</label>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Input
                                    type="number"
                                    step="0.05"
                                    value={shot.scaleFrom ?? 1.15}
                                    onChange={e => updateCurrentShot(sIdx, { scaleFrom: parseFloat(e.target.value) || 1.0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                  <span className="text-[10px] text-slate-400">→</span>
                                  <Input
                                    type="number"
                                    step="0.05"
                                    value={shot.scaleTo ?? 1.0}
                                    onChange={e => updateCurrentShot(sIdx, { scaleTo: parseFloat(e.target.value) || 1.0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Pan X (panXFrom → panXTo)</label>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Input
                                    type="number"
                                    step="0.02"
                                    value={shot.panXFrom ?? 0}
                                    onChange={e => updateCurrentShot(sIdx, { panXFrom: parseFloat(e.target.value) || 0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                  <span className="text-[10px] text-slate-400">→</span>
                                  <Input
                                    type="number"
                                    step="0.02"
                                    value={shot.panXTo ?? 0}
                                    onChange={e => updateCurrentShot(sIdx, { panXTo: parseFloat(e.target.value) || 0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="text-[10px] font-medium text-slate-500">Pan Y (panYFrom → panYTo)</label>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Input
                                    type="number"
                                    step="0.02"
                                    value={shot.panYFrom ?? 0}
                                    onChange={e => updateCurrentShot(sIdx, { panYFrom: parseFloat(e.target.value) || 0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                  <span className="text-[10px] text-slate-400">→</span>
                                  <Input
                                    type="number"
                                    step="0.02"
                                    value={shot.panYTo ?? 0}
                                    onChange={e => updateCurrentShot(sIdx, { panYTo: parseFloat(e.target.value) || 0 })}
                                    className="h-7 text-[10px] font-mono px-1"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Quick suggested assets */}
                    <div className="pt-1">
                      <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Preset Assets Quick-Insert
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {SUGGESTED_ASSETS.map((sa, saIdx) => (
                          <button
                            key={saIdx}
                            type="button"
                            onClick={() => updateCurrentShot(currentShotIdx, { url: sa.path })}
                            className="text-[10px] px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-colors"
                          >
                            {sa.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 2: SHOWCASE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Showcase Visibility</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeConfig.settings.enabled}
                        onChange={e => updateSettings('enabled', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-rose-600"></div>
                    </label>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Instantly show or hide the Amma's Pickles showcase section on the homepage.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Header Titles & Labels</CardTitle>
                  <CardDescription className="text-xs">
                    Header typography and action button texts.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Eyebrow Kicker
                      </label>
                      <Input
                        value={safeConfig.settings.eyebrow}
                        onChange={e => updateSettings('eyebrow', e.target.value)}
                        placeholder="HAND-MIXED · SUN-CURED"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Section Title
                      </label>
                      <Input
                        value={safeConfig.settings.title}
                        onChange={e => updateSettings('title', e.target.value)}
                        placeholder="Amma's Pickles"
                        className="h-8 text-xs mt-1 font-serif font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        View All Label
                      </label>
                      <Input
                        value={safeConfig.settings.viewAllLabel}
                        onChange={e => updateSettings('viewAllLabel', e.target.value)}
                        placeholder="View all →"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Add to Cart Button
                      </label>
                      <Input
                        value={safeConfig.settings.addLabel}
                        onChange={e => updateSettings('addLabel', e.target.value)}
                        placeholder="Add to cart"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Chilli Icon Asset Path
                      </label>
                      <Input
                        value={safeConfig.settings.chilliIcon}
                        onChange={e => updateSettings('chilliIcon', e.target.value)}
                        placeholder="assets/images/chilli.png"
                        className="h-8 text-xs mt-1 font-mono"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE MOBILE SIMULATOR */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="mx-auto w-full max-w-[340px] bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Mobile Showcase Surface */}
            <div
              className="relative overflow-hidden rounded-[26px] select-none shadow-2xl transition-all duration-700 text-white"
              style={{
                height: '520px',
                background: `radial-gradient(circle at 50% 18%, ${currentPickle.theme?.c1 || '#C2273A'} 0%, ${currentPickle.theme?.c2 || '#7A0F12'} 100%)`
              }}
            >
              {/* Radial Glow Layer */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${currentPickle.theme?.glow || '#FFB450'} 0%, transparent 70%)`
                }}
              />

              {/* 1. Header Row */}
              <div className="relative z-10 px-4 pt-3 flex items-center justify-between">
                <div>
                  <span
                    className="text-[8px] font-black uppercase tracking-widest block"
                    style={{ color: currentPickle.theme?.accent || '#FFD58A' }}
                  >
                    {safeConfig.settings.eyebrow}
                  </span>
                  <h3 className="text-base font-serif font-black tracking-tight leading-tight">
                    {safeConfig.settings.title}
                  </h3>
                </div>

                <span
                  className="text-[10px] font-bold"
                  style={{ color: currentPickle.theme?.accent2 || '#E9C46A' }}
                >
                  {safeConfig.settings.viewAllLabel}
                </span>
              </div>

              {/* 2. Gold-Framed Ken Burns Photo Window */}
              <div className="relative z-10 px-4 pt-2">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden p-1 shadow-2xl border-2 border-[#D4AF37] bg-gradient-to-br from-[#FFE599] via-[#D4AF37] to-[#8B5A19]">
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
                    {/* Simulated Ken Burns Photo */}
                    <img
                      src={currentShot.url.startsWith('assets/') ? `/${currentShot.url}` : currentShot.url}
                      alt={currentShot.caption}
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out"
                      style={{
                        transform: `scale(${currentShot.scaleFrom ?? 1.12})`
                      }}
                      onError={e => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />

                    {/* Top Shot Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {currentPickle.tag}
                      </span>
                    </div>

                    {/* Bottom Caption Pill */}
                    <div className="absolute bottom-2 left-2 right-2 z-10">
                      <div className="px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-sm text-center border border-white/10">
                        <p className="text-[9px] font-medium text-amber-200 truncate">
                          "{currentShot.caption}"
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Glassmorphic Info Panel */}
              <div className="relative z-10 px-4 pt-2">
                <div className="p-2.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 space-y-1.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-serif font-bold text-white truncate leading-tight">
                        {currentPickle.name}
                      </h4>
                      <p className="text-[9px] text-amber-200/80 truncate">
                        {currentPickle.cureNote}
                      </p>
                    </div>

                    {/* Chilli Spice Meter */}
                    <div className="text-[10px]">
                      {'🌶️'.repeat(currentPickle.spice || 3)}
                    </div>
                  </div>

                  <p className="text-[8.5px] text-white/70 line-clamp-1 italic">
                    {currentPickle.description}
                  </p>

                  <div className="flex items-center justify-between pt-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-black text-white">
                        ₹{currentPickle.price}
                      </span>
                      {currentPickle.mrp > currentPickle.price && (
                        <span className="text-[9px] text-white/50 line-through">
                          ₹{currentPickle.mrp}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-full text-[9px] font-black text-slate-950 shadow-md flex items-center gap-1"
                      style={{
                        background: `linear-gradient(135deg, ${currentPickle.theme?.accent || '#FFD58A'}, ${currentPickle.theme?.accent2 || '#E9C46A'})`
                      }}
                    >
                      <ShoppingBag className="h-2.5 w-2.5" />
                      {safeConfig.settings.addLabel}
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Bottom Pickles Thumbnails Row with Progress Rings */}
              <div className="absolute bottom-2 left-4 right-4 flex items-center justify-center gap-3 z-10">
                {safeConfig.pickles.map((p, idx) => {
                  const isSelected = idx === selectedPickleIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedPickleIdx(idx);
                        setCurrentShotIdx(0);
                      }}
                      className={`relative w-8 h-8 rounded-full overflow-hidden transition-all ${
                        isSelected
                          ? 'ring-2 ring-amber-300 scale-110 shadow-lg'
                          : 'opacity-60 hover:opacity-100 ring-1 ring-white/30'
                      }`}
                    >
                      <img
                        src={p.thumb.startsWith('assets/') ? `/${p.thumb}` : p.thumb}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Shot Controls Bar */}
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => {
                    const prev = (currentShotIdx - 1 + safeShots.length) % safeShots.length;
                    setCurrentShotIdx(prev);
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-slate-300 hover:text-white hover:bg-slate-800"
                  onClick={() => setIsPlayingShots(!isPlayingShots)}
                  title={isPlayingShots ? 'Pause Shot Cycling' : 'Play Shot Cycling'}
                >
                  {isPlayingShots ? (
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
                    const next = (currentShotIdx + 1) % safeShots.length;
                    setCurrentShotIdx(next);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-[11px] font-mono">
                Shot {currentShotIdx + 1} / {safeShots.length}
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
                <Code2 className="h-4 w-4 text-rose-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Exact Backend JSON Payload (doc_id: "pickles")
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

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-rose-400 custom-scrollbar">
              <pre>{JSON.stringify({
                doc_id: 'pickles',
                content: {
                  settings: safeConfig.settings,
                  pickles: safeConfig.pickles
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
                className="text-xs bg-rose-600 hover:bg-rose-500 text-white"
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
