'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Heart, 
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
  ShoppingBag,
  Share2,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Tag,
  PackageCheck,
  PackageX,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

export interface WishlistItem {
  productId: string;
  variantId: string;
  name: string;
  image: string;
  price: number;
  mrp: number;
  addedPrice: number;
  inStock: boolean;
  note?: string; // "₹40 OFF", "BACK!", or ""
}

export interface WishlistSettings {
  enabled: boolean;
  eyebrow: string;
  titleStart: string;
  titleAccent: string;
  titleEnd: string;
  shareLabel: string;
  fillLabel: string;
  fairyLights: boolean;
  shareBase: string;
}

export interface WishlistConfig {
  settings: WishlistSettings;
  items: WishlistItem[];
}

export const DEFAULT_WISHLIST_CONFIG: WishlistConfig = {
  settings: {
    enabled: true,
    eyebrow: 'MY WISHLIST',
    titleStart: "Amma's",
    titleAccent: 'pantry',
    titleEnd: 'for you',
    shareLabel: '↗ Share my shelf',
    fillLabel: 'Fill my basket',
    fairyLights: true,
    shareBase: 'https://ambhujakshi.com/wishlist/'
  },
  items: [
    {
      productId: 'mango_avakaya',
      variantId: '500g',
      name: 'Mango Avakaya',
      image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      price: 349,
      mrp: 399,
      addedPrice: 399,
      inStock: true,
      note: '₹50 OFF'
    },
    {
      productId: 'idli_karam',
      variantId: '250g',
      name: 'Special Idli Karam Podi',
      image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
      price: 190,
      mrp: 210,
      addedPrice: 190,
      inStock: true,
      note: 'BACK!'
    },
    {
      productId: 'sunnunda_laddu',
      variantId: '500g',
      name: 'Sunnunda Laddu',
      image: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
      price: 320,
      mrp: 350,
      addedPrice: 320,
      inStock: true,
      note: ''
    },
    {
      productId: 'kara_murukku',
      variantId: '250g',
      name: 'Kara Murukku',
      image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
      price: 129,
      mrp: 149,
      addedPrice: 149,
      inStock: true,
      note: '₹20 OFF'
    }
  ]
};

interface WishlistPantryManagerProps {
  config: WishlistConfig;
  onChange: (config: WishlistConfig) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
  onResetDefaults?: () => void;
  allProducts?: any[];
}

export function WishlistPantryManager({
  config,
  onChange,
  onSave,
  isSaving,
  onResetDefaults,
  allProducts = []
}: WishlistPantryManagerProps) {
  const [activeTab, setActiveTab] = useState<'items' | 'settings' | 'analytics'>('items');
  const [selectedItemIdx, setSelectedItemIdx] = useState<number>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);

  const safeConfig: WishlistConfig = {
    settings: {
      enabled: config?.settings?.enabled ?? true,
      eyebrow: config?.settings?.eyebrow || 'MY WISHLIST',
      titleStart: config?.settings?.titleStart || "Amma's",
      titleAccent: config?.settings?.titleAccent || 'pantry',
      titleEnd: config?.settings?.titleEnd || 'for you',
      shareLabel: config?.settings?.shareLabel || '↗ Share my shelf',
      fillLabel: config?.settings?.fillLabel || 'Fill my basket',
      fairyLights: config?.settings?.fairyLights ?? true,
      shareBase: config?.settings?.shareBase || 'https://ambhujakshi.com/wishlist/'
    },
    items: Array.isArray(config?.items) && config.items.length > 0
      ? config.items
      : DEFAULT_WISHLIST_CONFIG.items
  };

  const currentItem = safeConfig.items[selectedItemIdx] || safeConfig.items[0];

  const updateSettings = <K extends keyof WishlistSettings>(key: K, value: WishlistSettings[K]) => {
    onChange({
      ...safeConfig,
      settings: {
        ...safeConfig.settings,
        [key]: value
      }
    });
  };

  const updateItem = (index: number, patch: Partial<WishlistItem>) => {
    const updated = [...safeConfig.items];
    const prev = updated[index];
    const merged = { ...prev, ...patch };

    // Auto-calculate badge note if not explicitly manually set
    if (!patch.note) {
      if (merged.addedPrice > merged.price && merged.price > 0) {
        merged.note = `₹${Math.round(merged.addedPrice - merged.price)} OFF`;
      } else if (!prev.inStock && merged.inStock) {
        merged.note = 'BACK!';
      }
    }

    updated[index] = merged;
    onChange({
      ...safeConfig,
      items: updated
    });
  };

  const handleAddItem = () => {
    const newItem: WishlistItem = {
      productId: 'p_new',
      variantId: '250g',
      name: 'Gongura Pachadi',
      image: 'assets/images/gongura_close.jpg',
      price: 179,
      mrp: 210,
      addedPrice: 210,
      inStock: true,
      note: '₹31 OFF'
    };
    const updated = [...safeConfig.items, newItem];
    onChange({ ...safeConfig, items: updated });
    setSelectedItemIdx(updated.length - 1);
    toast.success('Added new product to wishlist shelf!');
  };

  const handleDeleteItem = (index: number) => {
    if (safeConfig.items.length <= 1) {
      toast.error('Keep at least 1 item on the wishlist shelf.');
      return;
    }
    const updated = safeConfig.items.filter((_, i) => i !== index);
    onChange({ ...safeConfig, items: updated });
    setSelectedItemIdx(Math.max(0, index - 1));
    toast.success('Removed item from wishlist.');
  };

  const handleMoveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= safeConfig.items.length) return;
    const updated = [...safeConfig.items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ ...safeConfig, items: updated });
    setSelectedItemIdx(targetIdx);
  };

  const handleCopyJson = () => {
    const payload = {
      doc_id: 'wishlist',
      content: {
        settings: safeConfig.settings,
        items: safeConfig.items
      }
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    toast.success('Copied exact JSON payload to clipboard!');
  };

  // Group items into rows of 2 for shelf layout
  const shelfRows: WishlistItem[][] = [];
  for (let i = 0; i < safeConfig.items.length; i += 2) {
    shelfRows.push(safeConfig.items.slice(i, i + 2));
  }

  // Calculate wishlist analytics
  const totalWishlistedValue = safeConfig.items.reduce((sum, item) => sum + item.price, 0);
  const outOfStockItems = safeConfig.items.filter(item => !item.inStock);
  const priceDropItems = safeConfig.items.filter(item => item.addedPrice > item.price);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-pink-950 via-rose-900 to-amber-950 text-white shadow-xl border border-rose-800/40">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-500/20 text-pink-300 border border-pink-500/30">
              <Heart className="h-5 w-5 fill-pink-400" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Amma's Pantry
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/30 text-pink-200 border border-pink-400/40 font-medium">
                Customer Wishlist
              </span>
            </h2>
          </div>
          <p className="text-xs text-rose-200/80">
            Warm kitchen wall · Twinkling fairy lights · Wooden shelves · Hanging kraft tags · Price-drop & Restock badges
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
            className="text-xs bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold gap-1.5 shadow-lg shadow-pink-950/50"
          >
            <Save className="h-3.5 w-3.5" />
            {isSaving ? 'Saving...' : 'Save Wishlist'}
          </Button>
        </div>
      </div>

      {/* Main Grid: Left Controls (Tabs) & Right Mobile Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Sub Navigation */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'items'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="h-4 w-4 text-pink-600" />
              Pantry Shelf Items ({safeConfig.items.length})
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'settings'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              Fairy Lights & Settings
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Demand Analytics
            </button>
          </div>

          {/* TAB 1: PANTRY SHELF ITEMS */}
          {activeTab === 'items' && (
            <div className="space-y-4">
              {/* Items Selector */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <span>Saved Products on Shelves</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 font-bold">
                        {safeConfig.items.length} Products
                      </span>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Manage the products customers see on their Amma's Pantry wishlist page.
                    </CardDescription>
                  </div>
                  <Button
                    size="sm"
                    onClick={handleAddItem}
                    className="h-8 text-xs bg-pink-600 hover:bg-pink-500 text-white gap-1 font-semibold"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Product
                  </Button>
                </CardHeader>

                <CardContent className="p-4 pt-0">
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {safeConfig.items.map((item, idx) => {
                      const isSelected = idx === selectedItemIdx;
                      return (
                        <button
                          key={item.productId || idx}
                          onClick={() => setSelectedItemIdx(idx)}
                          className={`flex-shrink-0 text-left p-2.5 rounded-xl border transition-all w-44 ${
                            isSelected
                              ? 'bg-pink-50/80 dark:bg-pink-950/40 border-pink-500 ring-1 ring-pink-500 shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-slate-400">
                              #{idx + 1}
                            </span>
                            {item.note && (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-rose-500 text-white">
                                {item.note}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between mt-1 text-[11px]">
                            <span className="font-extrabold text-pink-700 dark:text-pink-400">
                              ₹{item.price}
                            </span>
                            <span className={`text-[10px] ${item.inStock ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {item.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* CURRENT ITEM FORM */}
              {currentItem && (
                <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                  <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between border-b">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-pink-600 text-white font-bold text-xs flex items-center justify-center">
                        {selectedItemIdx + 1}
                      </span>
                      <div>
                        <CardTitle className="text-sm font-bold">
                          Editing: {currentItem.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          Product ID: <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{currentItem.productId}</code>
                        </CardDescription>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={selectedItemIdx === 0}
                        onClick={() => handleMoveItem(selectedItemIdx, 'up')}
                        title="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        disabled={selectedItemIdx === safeConfig.items.length - 1}
                        onClick={() => handleMoveItem(selectedItemIdx, 'down')}
                        title="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => handleDeleteItem(selectedItemIdx)}
                        title="Delete Item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 space-y-4">
                    {/* Catalog Picker */}
                    {allProducts.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-pink-50/60 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900/50">
                        <label className="text-[10px] font-bold text-pink-900 dark:text-pink-300 uppercase tracking-wider block mb-1">
                          Pick From Live Products Catalog
                        </label>
                        <select
                          className="w-full h-8 text-xs rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-2"
                          onChange={e => {
                            const val = e.target.value;
                            if (!val) return;
                            const found = allProducts.find(p => p.id === val || p.name === val);
                            if (found) {
                              updateItem(selectedItemIdx, {
                                productId: String(found.id || found.slug || val),
                                name: found.name,
                                image: found.image || currentItem.image,
                                price: Number(found.price) || currentItem.price,
                                mrp: Number(found.mrp) || Number(found.price) * 1.15 || currentItem.mrp,
                                addedPrice: Number(found.mrp) || currentItem.addedPrice
                              });
                              toast.success(`Populated details for ${found.name}`);
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Choose a product from store...</option>
                          {allProducts.map((p, pIdx) => (
                            <option key={p.id || pIdx} value={p.id || p.name}>
                              {p.name} (₹{p.price})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Product Name
                        </label>
                        <Input
                          value={currentItem.name}
                          onChange={e => updateItem(selectedItemIdx, { name: e.target.value })}
                          placeholder="Mango Avakaya"
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Product ID
                        </label>
                        <Input
                          value={currentItem.productId}
                          onChange={e => updateItem(selectedItemIdx, { productId: e.target.value })}
                          placeholder="mango_avakaya"
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Variant ID
                        </label>
                        <Input
                          value={currentItem.variantId}
                          onChange={e => updateItem(selectedItemIdx, { variantId: e.target.value })}
                          placeholder="500g"
                          className="h-8 text-xs mt-1"
                        />
                      </div>
                    </div>

                    {/* Pricing: Current Price, MRP, Added Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Current Price (₹)
                        </label>
                        <Input
                          type="number"
                          value={currentItem.price}
                          onChange={e => updateItem(selectedItemIdx, { price: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          MRP (₹)
                        </label>
                        <Input
                          type="number"
                          value={currentItem.mrp}
                          onChange={e => updateItem(selectedItemIdx, { mrp: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-xs mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Price When Wishlisted (₹)
                        </label>
                        <Input
                          type="number"
                          value={currentItem.addedPrice}
                          onChange={e => updateItem(selectedItemIdx, { addedPrice: parseFloat(e.target.value) || 0 })}
                          className="h-8 text-xs mt-1"
                        />
                        <span className="text-[10px] text-slate-400">
                          If higher than current price, generates "₹X OFF" badge.
                        </span>
                      </div>
                    </div>

                    {/* In Stock & Custom Note */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                        <input
                          type="checkbox"
                          id="item-instock"
                          checked={currentItem.inStock}
                          onChange={e => updateItem(selectedItemIdx, { inStock: e.target.checked })}
                          className="rounded border-slate-300 text-pink-600 focus:ring-pink-500 h-4 w-4 cursor-pointer"
                        />
                        <label
                          htmlFor="item-instock"
                          className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer flex items-center gap-1.5"
                        >
                          {currentItem.inStock ? (
                            <PackageCheck className="h-4 w-4 text-emerald-600" />
                          ) : (
                            <PackageX className="h-4 w-4 text-rose-600" />
                          )}
                          <span>Currently In Stock</span>
                        </label>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Custom Badge Note (or leave auto)
                        </label>
                        <Input
                          value={currentItem.note || ''}
                          onChange={e => updateItem(selectedItemIdx, { note: e.target.value })}
                          placeholder='e.g. "₹50 OFF" or "BACK!"'
                          className="h-8 text-xs mt-1 font-bold text-rose-600"
                        />
                      </div>
                    </div>

                    {/* Photo URL */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Product Photo URL / Asset Path
                      </label>
                      <Input
                        value={currentItem.image}
                        onChange={e => updateItem(selectedItemIdx, { image: e.target.value })}
                        placeholder="assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
                        className="h-8 text-xs mt-1 font-mono"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: FAIRY LIGHTS & SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center justify-between">
                    <span>Twinkling Fairy Lights</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={safeConfig.settings.fairyLights}
                        onChange={e => updateSettings('fairyLights', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-600"></div>
                    </label>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Enable or disable the animated warm golden fairy lights hanging across the top of the pantry.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Header Typography</CardTitle>
                  <CardDescription className="text-xs">
                    Customize the 3-part title ("Amma's" + "pantry" + "for you").
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Eyebrow Kicker
                    </label>
                    <Input
                      value={safeConfig.settings.eyebrow}
                      onChange={e => updateSettings('eyebrow', e.target.value)}
                      placeholder="MY WISHLIST"
                      className="h-8 text-xs mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Title Start
                      </label>
                      <Input
                        value={safeConfig.settings.titleStart}
                        onChange={e => updateSettings('titleStart', e.target.value)}
                        placeholder="Amma's"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Title Accent (Italic Pink)
                      </label>
                      <Input
                        value={safeConfig.settings.titleAccent}
                        onChange={e => updateSettings('titleAccent', e.target.value)}
                        placeholder="pantry"
                        className="h-8 text-xs mt-1 font-serif italic text-pink-700 font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Title End
                      </label>
                      <Input
                        value={safeConfig.settings.titleEnd}
                        onChange={e => updateSettings('titleEnd', e.target.value)}
                        placeholder="for you"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold">Action Button Labels & Share Link</CardTitle>
                  <CardDescription className="text-xs">
                    Labels for batch adding and shelf sharing.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Share Shelf Button
                      </label>
                      <Input
                        value={safeConfig.settings.shareLabel}
                        onChange={e => updateSettings('shareLabel', e.target.value)}
                        placeholder="↗ Share my shelf"
                        className="h-8 text-xs mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Fill Basket (Add All) Button
                      </label>
                      <Input
                        value={safeConfig.settings.fillLabel}
                        onChange={e => updateSettings('fillLabel', e.target.value)}
                        placeholder="Fill my basket"
                        className="h-8 text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Share Base URL
                    </label>
                    <Input
                      value={safeConfig.settings.shareBase}
                      onChange={e => updateSettings('shareBase', e.target.value)}
                      placeholder="https://ambhujakshi.com/wishlist/"
                      className="h-8 text-xs mt-1 font-mono"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* TAB 3: DEMAND ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900/50">
                  <span className="text-[10px] font-bold text-pink-700 dark:text-pink-300 uppercase">
                    Total Shelf Value
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    ₹{totalWishlistedValue}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Across {safeConfig.items.length} wishlisted items
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                  <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase">
                    Waiting for Restock
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {outOfStockItems.length} Products
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Currently out-of-stock items saved
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50">
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 uppercase">
                    Price Drops Active
                  </span>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {priceDropItems.length} Products
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Triggering customer discount badges
                  </p>
                </div>
              </div>

              {/* Restock Recommendations */}
              <Card className="border border-slate-200 dark:border-slate-800 shadow-xs">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-bold flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-emerald-600" />
                    Kitchen Restock Intelligence
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Customer demand insights from SQL: <code className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">SELECT p.name, COUNT(w.user_id) AS wished FROM wishlist_items...</code>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {safeConfig.items.map((item, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">
                              {item.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              ₹{item.price} · Variant: {item.variantId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.inStock ? (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold animate-pulse">
                              🔥 Restock Priority
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: INTERACTIVE LIVE MOBILE PHONE PREVIEW */}
        <div className="lg:col-span-5 sticky top-6">
          <div className="mx-auto w-full max-w-[340px] bg-slate-950 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 ring-1 ring-slate-700/50">
            {/* Phone Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                <div className="w-8 h-1 bg-slate-700 rounded-full"></div>
              </div>
            </div>

            {/* Mobile Wishlist Screen Surface */}
            <div
              className="relative overflow-hidden rounded-[26px] select-none shadow-2xl transition-all"
              style={{
                height: '520px',
                backgroundColor: '#FBE9D2'
              }}
            >
              {/* Subtle Kitchen Wall Pattern */}
              <div 
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(#8B4513 1px, transparent 1px)',
                  backgroundSize: '16px 16px'
                }}
              />

              {/* Twinkling Fairy Lights (if enabled) */}
              {safeConfig.settings.fairyLights && (
                <div className="absolute top-[82px] left-0 right-0 z-20 flex justify-around px-4 pointer-events-none">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-0.5 h-2 bg-[#6B4F35]" />
                      <div
                        className="w-2.5 h-2.5 rounded-full shadow-md animate-pulse"
                        style={{
                          backgroundColor: i % 2 === 0 ? '#FFD54F' : '#FFE082',
                          boxShadow: '0 0 6px #FFD54F',
                          animationDuration: `${1.2 + (i % 3) * 0.4}s`
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Fixed Header */}
              <div
                className="relative z-10 px-4 pt-3 pb-3 border-b shadow-xs"
                style={{
                  background: 'linear-gradient(180deg, #FBE9D2 70%, rgba(251, 233, 210, 0.9) 100%)',
                  borderColor: '#E8D0B3'
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] font-black uppercase tracking-widest text-[#B3123A] bg-[#FFF2DE] px-2 py-0.5 rounded-full shadow-2xs">
                    {safeConfig.settings.eyebrow}
                  </span>
                  <span className="text-[10px] font-bold text-[#C2185B]">
                    {safeConfig.items.length} items
                  </span>
                </div>

                <h3 className="text-base font-serif font-black text-[#2A1A12] leading-tight">
                  {safeConfig.settings.titleStart}{' '}
                  <span className="italic font-serif text-[#C2185B] font-semibold">
                    {safeConfig.settings.titleAccent}
                  </span>{' '}
                  {safeConfig.settings.titleEnd}
                </h3>

                {/* Header Action Buttons */}
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="text-[9px] font-bold text-[#C2185B] flex items-center gap-1 cursor-pointer">
                    <Share2 className="h-3 w-3" />
                    {safeConfig.settings.shareLabel}
                  </div>

                  <div className="px-3 py-1 rounded-full bg-[#C2185B] text-white text-[9px] font-bold shadow-md flex items-center gap-1 cursor-pointer">
                    <ShoppingBag className="h-2.5 w-2.5" />
                    {safeConfig.settings.fillLabel}
                  </div>
                </div>
              </div>

              {/* Wooden Shelves with Products (Scrollable in Phone) */}
              <div className="px-3 pt-6 pb-12 overflow-y-auto h-[380px] custom-scrollbar space-y-6">
                {shelfRows.map((row, rIdx) => (
                  <div key={rIdx} className="relative pt-2">
                    {/* Products sitting on shelf */}
                    <div className="flex justify-around items-end px-2 z-10 relative">
                      {row.map((item, iIdx) => (
                        <div
                          key={iIdx}
                          className="w-[120px] flex flex-col items-center cursor-pointer group"
                          onClick={() => {
                            setActiveTab('items');
                            setSelectedItemIdx(rIdx * 2 + iIdx);
                          }}
                        >
                          {/* Product Image & Badges */}
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white shadow-md border border-[#D7B48C] group-hover:scale-105 transition-transform">
                            <img
                              src={item.image.startsWith('assets/') ? `/${item.image}` : item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={e => {
                                (e.target as HTMLElement).style.display = 'none';
                              }}
                            />

                            {/* Heart Badge */}
                            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs">
                              <Heart className="h-3 w-3 fill-[#C2185B] text-[#C2185B]" />
                            </div>

                            {/* Discount / Restock Badge */}
                            {item.note && (
                              <div className="absolute bottom-1 left-1">
                                <span className="text-[7.5px] font-black uppercase px-1.5 py-0.5 rounded bg-[#C2185B] text-white shadow-xs">
                                  {item.note}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Hanging Kraft Price Tag */}
                          <div className="mt-1 text-center">
                            <p className="text-[9.5px] font-bold text-[#2A1A12] truncate max-w-[110px]">
                              {item.name}
                            </p>
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-[10px] font-extrabold text-[#C2185B]">
                                ₹{item.price}
                              </span>
                              {item.mrp > item.price && (
                                <span className="text-[8px] text-slate-400 line-through">
                                  ₹{item.mrp}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Wooden Shelf Plank */}
                    <div className="relative mt-1">
                      {/* Gold Top Trim */}
                      <div className="h-1 bg-gradient-to-r from-[#D4AF37] via-[#FFD700] to-[#D4AF37] shadow-xs" />
                      {/* Mahogany Shelf Face */}
                      <div
                        className="h-4 shadow-lg rounded-b-sm"
                        style={{
                          background: 'linear-gradient(180deg, #6B3A19 0%, #4A2209 100%)'
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hint Below Phone */}
            <div className="mt-3 text-center text-[11px] text-slate-400">
              Live Pantry Preview · Click any product on the shelf to edit
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
                <Code2 className="h-4 w-4 text-pink-600" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Exact Backend JSON Payload (doc_id: "wishlist")
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

            <div className="p-4 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-pink-400 custom-scrollbar">
              <pre>{JSON.stringify({
                doc_id: 'wishlist',
                content: {
                  settings: safeConfig.settings,
                  items: safeConfig.items
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
                className="text-xs bg-pink-600 hover:bg-pink-500 text-white"
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
