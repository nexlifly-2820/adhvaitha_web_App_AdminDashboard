'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Crown, 
  Medal, 
  TrendingUp, 
  TrendingDown, 
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
  Star, 
  Flame, 
  Layers, 
  Clock, 
  Tag
} from 'lucide-react';
import { toast } from 'sonner';

export interface BestSellerItem {
  id: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  sold: string;
  rating: number;
  move: 'up' | 'down' | 'new' | '';
  moveBy: number;
}

export interface BestSellerCategory {
  id: string;
  name: string;
  emoji: string;
  items: BestSellerItem[];
}

export interface BestSellersSettings {
  enabled: boolean;
  kicker: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  intervalMs: number;
  rows: number;
}

export interface BestSellersConfig {
  settings: BestSellersSettings;
  categories: BestSellerCategory[];
}

export const DEFAULT_BEST_SELLERS: BestSellersConfig = {
  settings: {
    enabled: true,
    kicker: "THIS MONTH'S CHAMPIONS",
    title: "Best",
    titleAccent: "sellers",
    subtitle: "Ranked by real orders from 12,000+ homes",
    intervalMs: 4000,
    rows: 3
  },
  categories: [
    {
      id: "all",
      name: "All",
      emoji: "🔥",
      items: [
        {
          id: "p1",
          variantId: "v1",
          name: "Bellam Avakaya",
          image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
          price: 120,
          mrp: 136,
          sold: "12K+",
          rating: 4.8,
          move: "up",
          moveBy: 2
        },
        {
          id: "p2",
          variantId: "v4",
          name: "Idli Karam Podi",
          image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg",
          price: 139,
          mrp: 150,
          sold: "9.8K+",
          rating: 4.9,
          move: "up",
          moveBy: 1
        },
        {
          id: "p3",
          variantId: "v8",
          name: "Sunnunda Laddu",
          image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
          price: 199,
          mrp: 220,
          sold: "8.4K+",
          rating: 4.9,
          move: "new",
          moveBy: 0
        },
        {
          id: "p4",
          variantId: "v6",
          name: "Kara Murukku",
          image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg",
          price: 129,
          mrp: 140,
          sold: "6.2K+",
          rating: 4.7,
          move: "up",
          moveBy: 3
        }
      ]
    },
    {
      id: "pickles",
      name: "Pickles",
      emoji: "🥭",
      items: [
        {
          id: "p1",
          variantId: "v1",
          name: "Bellam Avakaya",
          image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg",
          price: 120,
          mrp: 136,
          sold: "12K+",
          rating: 4.8,
          move: "up",
          moveBy: 2
        }
      ]
    }
  ]
};

const IMAGE_PRESETS = [
  { label: 'Bellam Avakaya', path: 'assets/images/avakaya_pickle.png' },
  { label: 'Special Idli Karam Podi', path: 'assets/images/special_idli_karam_podi.png' },
  { label: 'Sunnunda Laddu', path: 'assets/images/sunnundalu.png' },
  { label: 'Kara Murukku', path: 'assets/images/chakralu.png' },
  { label: 'Khara Mixture', path: 'assets/images/mixture.png' },
  { label: 'Potato Chips (Allu Chips)', path: 'assets/images/potato_chips.png' },
  { label: 'Dry Fruits Laddu', path: 'assets/images/dry_fruit_laddu.png' },
  { label: 'Palli Chikki', path: 'assets/images/palli_chikki.png' },
  { label: 'Nuvvula Chikki', path: 'assets/images/nuvvula_chikki.png' },
  { label: 'Special Kura Karam Podi', path: 'assets/images/special_kura_karam_podi.png' }
];

interface BestSellersManagerProps {
  config: BestSellersConfig;
  onChange: (config: BestSellersConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
}

export function BestSellersManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults
}: BestSellersManagerProps) {
  const [activeCategoryIdx, setActiveCategoryIdx] = useState<number>(0);
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: BestSellersConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      kicker: config?.settings?.kicker || "THIS MONTH'S CHAMPIONS",
      title: config?.settings?.title || 'Best',
      titleAccent: config?.settings?.titleAccent || 'sellers',
      subtitle: config?.settings?.subtitle || 'Ranked by real orders from 12,000+ homes',
      intervalMs: config?.settings?.intervalMs || 4000,
      rows: config?.settings?.rows || 3
    },
    categories: Array.isArray(config?.categories) && config.categories.length > 0 
      ? config.categories 
      : DEFAULT_BEST_SELLERS.categories
  };

  const currentCategory = safeConfig.categories[activeCategoryIdx] || safeConfig.categories[0];
  const items = currentCategory?.items || [];
  const activeItem = items[selectedItemIdx] || items[0];

  const getDisplayImage = (imgUrl?: string) => {
    if (!imgUrl) return '/assets/images/avakaya_pickle.png';
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  const updateSetting = (field: keyof BestSellersSettings, value: any) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [field]: value
      }
    });
  };

  const updateItem = (itemIdx: number, field: keyof BestSellerItem, value: any) => {
    const updatedCategories = [...safeConfig.categories];
    const category = { ...updatedCategories[activeCategoryIdx] };
    const updatedItems = [...category.items];
    updatedItems[itemIdx] = { ...updatedItems[itemIdx], [field]: value };
    category.items = updatedItems;
    updatedCategories[activeCategoryIdx] = category;
    onChange({ ...safeConfig, categories: updatedCategories });
  };

  const moveItem = (fromIdx: number, direction: 'up' | 'down') => {
    const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
    if (toIdx < 0 || toIdx >= items.length) return;
    const updatedCategories = [...safeConfig.categories];
    const category = { ...updatedCategories[activeCategoryIdx] };
    const updatedItems = [...category.items];
    const temp = updatedItems[fromIdx];
    updatedItems[fromIdx] = updatedItems[toIdx];
    updatedItems[toIdx] = temp;
    category.items = updatedItems;
    updatedCategories[activeCategoryIdx] = category;
    onChange({ ...safeConfig, categories: updatedCategories });
    setSelectedItemIdx(toIdx);
    toast.success(`Swapped rank #${fromIdx + 1} with #${toIdx + 1}`);
  };

  const addItem = () => {
    const newIdx = items.length + 1;
    const newItem: BestSellerItem = {
      id: `p${Date.now()}`,
      variantId: `v${Date.now()}`,
      name: 'New Champion Delicacy',
      image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      price: 149,
      mrp: 170,
      sold: '5K+',
      rating: 4.8,
      move: 'new',
      moveBy: 0
    };
    const updatedCategories = [...safeConfig.categories];
    const category = { ...updatedCategories[activeCategoryIdx] };
    category.items = [...category.items, newItem];
    updatedCategories[activeCategoryIdx] = category;
    onChange({ ...safeConfig, categories: updatedCategories });
    setSelectedItemIdx(category.items.length - 1);
    toast.success(`Added new product to Rank #${newIdx}`);
  };

  const removeItem = (itemIdx: number) => {
    if (items.length <= 1) {
      toast.error('Each category must have at least 1 item.');
      return;
    }
    const updatedCategories = [...safeConfig.categories];
    const category = { ...updatedCategories[activeCategoryIdx] };
    category.items = category.items.filter((_, i) => i !== itemIdx);
    updatedCategories[activeCategoryIdx] = category;
    onChange({ ...safeConfig, categories: updatedCategories });
    setSelectedItemIdx(0);
    toast.success('Item removed from ranking');
  };

  const addCategory = () => {
    const newCatId = `cat_${Date.now()}`;
    const newCategory: BestSellerCategory = {
      id: newCatId,
      name: 'New Category',
      emoji: '🌶️',
      items: [
        {
          id: `p_${Date.now()}`,
          variantId: `v_${Date.now()}`,
          name: 'Featured Best Seller',
          image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
          price: 139,
          mrp: 150,
          sold: '7.5K+',
          rating: 4.9,
          move: 'up',
          moveBy: 1
        }
      ]
    };
    const updatedCategories = [...safeConfig.categories, newCategory];
    onChange({ ...safeConfig, categories: updatedCategories });
    setActiveCategoryIdx(safeConfig.categories.length);
    setSelectedItemIdx(0);
    toast.success('New category added');
  };

  const removeCategory = (catIdx: number) => {
    if (safeConfig.categories.length <= 1) {
      toast.error('You must keep at least 1 category.');
      return;
    }
    const updatedCategories = safeConfig.categories.filter((_, i) => i !== catIdx);
    onChange({ ...safeConfig, categories: updatedCategories });
    setActiveCategoryIdx(0);
    setSelectedItemIdx(0);
    toast.success('Category removed');
  };

  const updateCategoryMeta = (field: 'name' | 'emoji', value: string) => {
    const updatedCategories = [...safeConfig.categories];
    updatedCategories[activeCategoryIdx] = {
      ...updatedCategories[activeCategoryIdx],
      [field]: value
    };
    onChange({ ...safeConfig, categories: updatedCategories });
  };

  const getRankBadge = (rankIdx: number) => {
    if (rankIdx === 0) {
      return {
        label: '#1 GOLD',
        icon: '👑',
        bg: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-200',
        ring: 'ring-amber-500/30'
      };
    }
    if (rankIdx === 1) {
      return {
        label: '#2 SILVER',
        icon: '🥈',
        bg: 'bg-slate-200 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200',
        ring: 'ring-slate-400/30'
      };
    }
    if (rankIdx === 2) {
      return {
        label: '#3 BRONZE',
        icon: '🥉',
        bg: 'bg-amber-700/10 text-amber-800 border-amber-600/30 dark:bg-amber-900/30 dark:text-amber-300',
        ring: 'ring-amber-700/30'
      };
    }
    return {
      label: `#${rankIdx + 1} RUNNER-UP`,
      icon: '🎖️',
      bg: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900 dark:text-slate-400',
      ring: ''
    };
  };

  return (
    <div className="space-y-6">
      {/* HEADER CARD */}
      <Card className="border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-50/50 via-white to-orange-50/30 dark:from-slate-900 dark:to-slate-950 shadow-sm">
        <CardHeader className="pb-4 border-b border-amber-100 dark:border-slate-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center ring-1 ring-amber-500/20">
                  <Trophy className="h-5 w-5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      Best Sellers Champions Podium
                    </CardTitle>
                    <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      Live Stream Sync
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    Subscribes live to <code className="font-mono text-amber-600 dark:text-amber-400">AppConfigRepository().getBestSellersStream()</code>. Dynamically updates rankings, podium pedestals, and rank movements on users' screens.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-3">
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
                placeholder="THIS MONTH'S CHAMPIONS"
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
                  placeholder="Best"
                  className="h-8 text-xs font-medium w-1/2"
                />
                <Input
                  value={safeConfig.settings.titleAccent}
                  onChange={e => updateSetting('titleAccent', e.target.value)}
                  placeholder="sellers"
                  className="h-8 text-xs font-medium text-amber-600 w-1/2"
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
                placeholder="Ranked by real orders from 12,000+ homes"
                className="h-8 text-xs"
              />
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Interval
                </label>
                <span className="text-[11px] font-mono text-amber-600 font-bold">
                  {safeConfig.settings.intervalMs}ms
                </span>
              </div>
              <Input
                type="number"
                step="500"
                min="1000"
                max="10000"
                value={safeConfig.settings.intervalMs}
                onChange={e => updateSetting('intervalMs', parseInt(e.target.value) || 4000)}
                className="h-8 text-xs font-mono"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CATEGORY TABS SELECTOR */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 custom-scrollbar">
        <div className="flex items-center gap-2">
          {safeConfig.categories.map((cat, idx) => {
            const isSelected = activeCategoryIdx === idx;
            return (
              <button
                key={cat.id || idx}
                type="button"
                onClick={() => {
                  setActiveCategoryIdx(idx);
                  setSelectedItemIdx(0);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'bg-amber-500 text-white border-amber-600 shadow-sm shadow-amber-500/20 font-bold'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                }`}>
                  {cat.items?.length || 0}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="outline"
            onClick={addCategory}
            className="text-xs border-dashed border-amber-300 dark:border-amber-900 text-amber-700 hover:bg-amber-50"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Category
          </Button>
          {safeConfig.categories.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeCategory(activeCategoryIdx)}
              className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              Delete Category
            </Button>
          )}
        </div>
      </div>

      {/* CATEGORY METADATA ROW */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-semibold text-slate-600 dark:text-slate-400 shrink-0">Category Settings:</span>
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-500">Emoji:</label>
          <Input
            value={currentCategory.emoji}
            onChange={e => updateCategoryMeta('emoji', e.target.value)}
            className="h-7 w-12 text-center text-sm p-0"
          />
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-xs">
          <label className="text-[11px] text-slate-500">Name:</label>
          <Input
            value={currentCategory.name}
            onChange={e => updateCategoryMeta('name', e.target.value)}
            className="h-7 text-xs font-semibold"
          />
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PODIUM RANKING LIST & EDITOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Ranked Champions for "{currentCategory.name}" ({items.length})
              </h3>
            </div>
            <Button
              size="sm"
              onClick={addItem}
              className="text-xs bg-amber-600 hover:bg-amber-700 text-white h-8"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add Champion
            </Button>
          </div>

          {/* RANKED ITEMS CARDS LIST */}
          <div className="space-y-2.5">
            {items.map((item, idx) => {
              const isSelected = selectedItemIdx === idx;
              const badge = getRankBadge(idx);
              const isTop3 = idx < 3;

              return (
                <div
                  key={item.id || idx}
                  onClick={() => setSelectedItemIdx(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    {/* Rank Indicator & Image */}
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col items-center justify-center shrink-0 w-10">
                        <span className="text-xl">{badge.icon}</span>
                        <span className="text-[10px] font-black text-slate-500 mt-0.5">#{idx + 1}</span>
                      </div>

                      <div className="h-12 w-12 rounded-xl overflow-hidden border shrink-0 bg-white relative">
                        <img
                          src={getDisplayImage(item.image)}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        {isTop3 && (
                          <div className="absolute top-0 right-0 bg-amber-500 text-white text-[8px] font-black px-1 rounded-bl">
                            TOP 3
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {item.name}
                          </h4>
                          {/* Movement Chip */}
                          {item.move === 'up' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded">
                              <TrendingUp className="h-2.5 w-2.5" />
                              ▲{item.moveBy || 1}
                            </span>
                          )}
                          {item.move === 'down' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-700 bg-red-100 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.2 rounded">
                              <TrendingDown className="h-2.5 w-2.5" />
                              ▼{item.moveBy || 1}
                            </span>
                          )}
                          {item.move === 'new' && (
                            <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200 dark:bg-amber-950 dark:text-amber-300 px-1.5 py-0.2 rounded">
                              ✨ NEW
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="font-bold text-amber-600">₹{item.price}</span>
                          <span className="line-through text-slate-400">₹{item.mrp}</span>
                          <span>•</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-300">🔥 {item.sold} sold</span>
                          <span>•</span>
                          <span>⭐ {item.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rank Reorder & Delete Actions */}
                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === 0}
                        onClick={() => moveItem(idx, 'up')}
                        className="h-7 w-7 p-0"
                        title="Move Up in Rank"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={idx === items.length - 1}
                        onClick={() => moveItem(idx, 'down')}
                        className="h-7 w-7 p-0"
                        title="Move Down in Rank"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(idx)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ACTIVE ITEM DETAIL EDITOR */}
          {activeItem && (
            <Card className="border-slate-200 dark:border-slate-800 mt-4">
              <CardHeader className="pb-3 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getRankBadge(selectedItemIdx).icon}</span>
                    <CardTitle className="text-sm font-bold">
                      Edit Rank #{selectedItemIdx + 1} Champion: {activeItem.name}
                    </CardTitle>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getRankBadge(selectedItemIdx).bg}`}>
                    {getRankBadge(selectedItemIdx).label}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product Name
                    </label>
                    <Input
                      value={activeItem.name}
                      onChange={e => updateItem(selectedItemIdx, 'name', e.target.value)}
                      placeholder="Bellam Avakaya"
                      className="h-8 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Units Sold Metric (e.g. 12K+, 9.8K+)
                    </label>
                    <Input
                      value={activeItem.sold}
                      onChange={e => updateItem(selectedItemIdx, 'sold', e.target.value)}
                      placeholder="12K+"
                      className="h-8 text-xs font-bold text-amber-600"
                    />
                  </div>
                </div>

                {/* Rank Movement Controls */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                    Rank Movement Indicator (Real-Time Badge on Podium)
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="text-[11px] text-slate-500 block mb-1">Movement Type:</span>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { val: 'up', label: '▲ Up', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
                          { val: 'down', label: '▼ Down', color: 'bg-red-100 text-red-800 border-red-300' },
                          { val: 'new', label: '✨ New', color: 'bg-amber-100 text-amber-800 border-amber-300' },
                          { val: '', label: 'None', color: 'bg-slate-100 text-slate-700 border-slate-300' }
                        ].map(opt => (
                          <button
                            key={opt.val}
                            type="button"
                            onClick={() => updateItem(selectedItemIdx, 'move', opt.val)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-all ${
                              activeItem.move === opt.val
                                ? `${opt.color} ring-2 ring-amber-500/20 shadow-xs`
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(activeItem.move === 'up' || activeItem.move === 'down') && (
                      <div>
                        <span className="text-[11px] text-slate-500 block mb-1">Positions Jumped (moveBy):</span>
                        <Input
                          type="number"
                          min="1"
                          max="20"
                          value={activeItem.moveBy}
                          onChange={e => updateItem(selectedItemIdx, 'moveBy', parseInt(e.target.value) || 1)}
                          className="h-8 text-xs font-bold w-24"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Pricing & Rating Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Price (₹)
                    </label>
                    <Input
                      type="number"
                      value={activeItem.price}
                      onChange={e => updateItem(selectedItemIdx, 'price', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs font-bold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      MRP (₹)
                    </label>
                    <Input
                      type="number"
                      value={activeItem.mrp}
                      onChange={e => updateItem(selectedItemIdx, 'mrp', parseFloat(e.target.value) || 0)}
                      className="h-8 text-xs text-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Rating (⭐)
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={activeItem.rating}
                      onChange={e => updateItem(selectedItemIdx, 'rating', parseFloat(e.target.value) || 4.8)}
                      className="h-8 text-xs font-bold text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Product ID
                    </label>
                    <Input
                      value={activeItem.id}
                      onChange={e => updateItem(selectedItemIdx, 'id', e.target.value)}
                      placeholder="p1"
                      className="h-8 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Image Path & Presets */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Image Path / URL
                  </label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={activeItem.image}
                      onChange={e => updateItem(selectedItemIdx, 'image', e.target.value)}
                      placeholder="assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
                      className="h-8 text-xs font-mono flex-1"
                    />
                    <img
                      src={getDisplayImage(activeItem.image)}
                      alt="Preview"
                      className="h-8 w-8 rounded-lg object-cover border shrink-0 bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {IMAGE_PRESETS.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => updateItem(selectedItemIdx, 'image', img.path)}
                        className="text-[10px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
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
            <span className="text-[10px] font-mono text-slate-500">
              Category: {currentCategory.name}
            </span>
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
                    {safeConfig.settings.kicker || "THIS MONTH'S CHAMPIONS"}
                  </span>
                  <span className="text-[9px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded-full">
                    🏆 Top 10
                  </span>
                </div>
                <h3 className="text-lg font-serif font-black tracking-tight text-slate-900 leading-tight">
                  {safeConfig.settings.title || 'Best'}{' '}
                  <span className="text-[#B81D3B] italic">
                    {safeConfig.settings.titleAccent || 'sellers'}
                  </span>
                </h3>
                <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                  {safeConfig.settings.subtitle || 'Ranked by real orders from 12,000+ homes'}
                </p>

                {/* CATEGORY CHIPS */}
                <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 no-scrollbar">
                  {safeConfig.categories.map((c, i) => (
                    <div
                      key={c.id || i}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold shrink-0 transition-all ${
                        activeCategoryIdx === i
                          ? 'bg-[#B81D3B] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200'
                      }`}
                    >
                      {c.emoji} {c.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3D CHAMPIONS PODIUM */}
              <div className="my-3">
                <div className="grid grid-cols-3 gap-2 items-end pt-4 pb-2">
                  {/* #2 SILVER PODIUM (LEFT) */}
                  {items[1] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-1">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-slate-300 shadow-md bg-white">
                          <img
                            src={getDisplayImage(items[1].image)}
                            alt={items[1].name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="absolute -top-1 -right-1 text-xs">🥈</span>
                        {items[1].move === 'up' && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-emerald-600 text-white font-bold px-1 rounded-full">
                            ▲{items[1].moveBy}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-center line-clamp-1 text-slate-800">
                        {items[1].name}
                      </span>
                      <span className="text-[9px] font-bold text-amber-700">₹{items[1].price}</span>

                      {/* Pedestal */}
                      <div className="w-full h-16 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-lg flex flex-col items-center justify-center text-slate-700 shadow-inner mt-1">
                        <span className="text-sm font-black">#2</span>
                        <span className="text-[8px] font-bold text-slate-500">{items[1].sold}</span>
                      </div>
                    </div>
                  )}

                  {/* #1 GOLD PODIUM (CENTER - TALLEST) */}
                  {items[0] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-1">
                        <div className="h-18 w-18 rounded-full overflow-hidden border-3 border-amber-400 shadow-xl bg-white ring-2 ring-amber-400/40">
                          <img
                            src={getDisplayImage(items[0].image)}
                            alt={items[0].name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-base">👑</span>
                        {items[0].move === 'up' && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-emerald-600 text-white font-bold px-1 rounded-full">
                            ▲{items[0].moveBy}
                          </span>
                        )}
                        {items[0].move === 'new' && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] bg-amber-500 text-white font-black px-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-black text-center line-clamp-1 text-slate-900">
                        {items[0].name}
                      </span>
                      <span className="text-[10px] font-black text-[#B81D3B]">₹{items[0].price}</span>

                      {/* Pedestal */}
                      <div className="w-full h-24 bg-gradient-to-t from-amber-400 to-amber-200 rounded-t-xl flex flex-col items-center justify-center text-amber-950 shadow-md mt-1 border-t-2 border-amber-300">
                        <span className="text-base font-black">#1</span>
                        <span className="text-[9px] font-extrabold text-amber-900/80">🏆 {items[0].sold}</span>
                      </div>
                    </div>
                  )}

                  {/* #3 BRONZE PODIUM (RIGHT) */}
                  {items[2] && (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-1">
                        <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-amber-700/40 shadow-md bg-white">
                          <img
                            src={getDisplayImage(items[2].image)}
                            alt={items[2].name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="absolute -top-1 -right-1 text-xs">🥉</span>
                        {items[2].move === 'new' && (
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[7px] bg-amber-500 text-white font-black px-1 rounded-full">
                            NEW
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-center line-clamp-1 text-slate-800">
                        {items[2].name}
                      </span>
                      <span className="text-[9px] font-bold text-amber-700">₹{items[2].price}</span>

                      {/* Pedestal */}
                      <div className="w-full h-12 bg-gradient-to-t from-amber-700/30 to-amber-600/20 rounded-t-lg flex flex-col items-center justify-center text-amber-950 shadow-inner mt-1">
                        <span className="text-sm font-black">#3</span>
                        <span className="text-[8px] font-bold text-amber-900/70">{items[2].sold}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RUNNER-UP ROWS (#4+) */}
              {items.length > 3 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Runner-up Ranks
                  </span>
                  {items.slice(3, 5).map((item, i) => (
                    <div
                      key={item.id || i}
                      className="p-1.5 rounded-lg bg-white border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[10px] text-slate-400 w-4 text-center">#{i + 4}</span>
                        <div className="h-6 w-6 rounded-md overflow-hidden bg-slate-100 shrink-0">
                          <img src={getDisplayImage(item.image)} alt="" className="h-full w-full object-cover" />
                        </div>
                        <span className="font-bold text-[10px] line-clamp-1 text-slate-800">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-700">₹{item.price}</span>
                        {item.move === 'up' && (
                          <span className="text-[8px] text-emerald-700 font-bold bg-emerald-50 px-1 rounded">▲{item.moveBy}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Mock Tab Bar */}
              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-around text-[9px] text-slate-400 font-medium mt-2">
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
                  Live JSON Payload for <code className="font-mono text-amber-600">best_sellers</code>
                </h3>
                <p className="text-xs text-slate-500">
                  POST payload delivered to <code className="font-mono">/api/app_settings.php?doc_id=best_sellers</code>
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
                doc_id: "best_sellers",
                content: {
                  settings: safeConfig.settings,
                  categories: safeConfig.categories
                }
              }, null, 2)}
            </pre>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify({
                    doc_id: "best_sellers",
                    content: {
                      settings: safeConfig.settings,
                      categories: safeConfig.categories
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
