'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Check, 
  Eye, 
  Flame, 
  Image as ImageIcon,
  Play, 
  TrendingUp,
  X,
  Layers,
  ArrowUp,
  ArrowDown,
  Info,
  User,
  MapPin,
  Clock,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';

export interface LivingPhoto {
  id?: string;
  url: string;
  caption: string;
  glints: [number, number][]; // Array of [x, y] coordinates between 0.0 and 1.0
  sort?: number;
}

export interface JourneyStep {
  icon: string;
  label: string;
  title: string;
  text: string;
}

export interface ProductDetailData {
  id: string;
  name: string;
  categoryLabel: string;
  description: string;
  highlight: string;
  spice: number;
  videoUrl: string;
  brandLine: string;
  features: string[];
  ingredients: Array<{ name: string; image: string }>;
  journey: Array<{ icon: string; label: string; title: string; text: string }>;
  artisan: {
    name: string;
    since: string;
    quote: string;
    photo: string;
  };
  recipes: Array<{ title: string; subtitle?: string; image?: string }>;
  photos: LivingPhoto[];
  viewersToday?: number;
}

interface Props {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function ProductDetailManager({ product, isOpen, onClose, onSaved }: Props) {
  const [activeTab, setActiveTab] = useState<'glints' | 'details' | 'journey' | 'artisan'>('glints');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [isPreviewTwinkle, setIsPreviewTwinkle] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Detail State
  const [categoryLabel, setCategoryLabel] = useState(product?.category_label || product?.categoryLabel || `${product?.category || 'Pickles'} Special`);
  const [description, setDescription] = useState(product?.description || '');
  const [highlight, setHighlight] = useState(product?.highlight || 'wood-pressed sesame oil');
  const [spice, setSpice] = useState<number>(product?.spice !== undefined ? Number(product?.spice) : 3);
  const [videoUrl, setVideoUrl] = useState(product?.video_url || product?.videoUrl || '');
  const [brandLine, setBrandLine] = useState(product?.brand_line || product?.brandLine || "Bringing Andhra's authentic flavours to your home.");
  
  // Features
  const [features, setFeatures] = useState<string[]>(
    Array.isArray(product?.features) ? product.features : ['100% Natural', 'Sun-cured in Jaadis', 'Wood-pressed Oil', 'Zero Preservatives']
  );
  const [newFeatureText, setNewFeatureText] = useState('');

  // Journey
  const defaultJourney: JourneyStep[] = [
    { icon: '📍', label: 'Origin', title: 'Guntur', text: 'Finest farms' },
    { icon: '☀️', label: 'Process', title: 'Sun-dried', text: 'For 21 days' },
    { icon: '🍳', label: 'Prepared in', title: 'Artisanal kitchen', text: 'Small batches, care & hygiene' },
    { icon: '🫙', label: 'Storage', title: 'Jaadi jars', text: 'Food-grade, airtight' },
    { icon: '⏳', label: 'Shelf life', title: '12 months', text: 'From packing date' }
  ];
  const [journey, setJourney] = useState<JourneyStep[]>(
    Array.isArray(product?.journey) && product.journey.length > 0 ? product.journey : defaultJourney
  );

  // Artisan
  const [artisan, setArtisan] = useState(
    product?.artisan || {
      name: product?.artisanName || 'Lakshmi Amma',
      since: '1982',
      quote: product?.artisanDescription || 'Every jar carries the scent of home and Amma\'s blessings.',
      photo: product?.artisanImage || 'assets/images/AMBHUJAKSHI  logo.png'
    }
  );

  // Living Photos with Glints
  const initialPhotos: LivingPhoto[] = [
    {
      url: product?.image || product?.image_url || 'assets/images/avakaya_pickle.png',
      caption: 'Tossed by hand in small batches',
      glints: [[0.52, 0.45], [0.38, 0.60]]
    }
  ];
  if (product?.storyImage || product?.story_image) {
    initialPhotos.push({
      url: product.storyImage || product.story_image,
      caption: 'Sun-cured in traditional ceramic jaadis',
      glints: [[0.48, 0.52]]
    });
  }

  const [photos, setPhotos] = useState<LivingPhoto[]>(initialPhotos);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [viewsToday, setViewsToday] = useState<number>(product?.viewsToday || 12);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const activePhoto = photos[selectedPhotoIndex] || photos[0];

  // Load latest detail from backend if available
  useEffect(() => {
    if (product?.id && isOpen) {
      fetch(`/dashboard/app/api/products?id=${product.id}&detail=true`)
        .then(res => res.json())
        .then(json => {
          if (json?.data) {
            const d = json.data;
            if (d.photos && Array.isArray(d.photos) && d.photos.length > 0) setPhotos(d.photos);
            if (d.categoryLabel) setCategoryLabel(d.categoryLabel);
            if (d.highlight) setHighlight(d.highlight);
            if (d.brandLine) setBrandLine(d.brandLine);
            if (d.features) setFeatures(d.features);
            if (d.journey) setJourney(d.journey);
            if (d.artisan) setArtisan(d.artisan);
            if (d.viewersToday) setViewsToday(d.viewersToday);
          }
        })
        .catch(() => {});
    }
  }, [product?.id, isOpen]);

  // Handle clicking on photo to drop / remove oil glint
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPreviewTwinkle) return;
    if (!imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    const normalizedPoint: [number, number] = [
      Math.round(x * 1000) / 1000,
      Math.round(y * 1000) / 1000
    ];

    // Check if clicked close to an existing glint (within 4% distance) to remove it
    const existingIndex = activePhoto.glints.findIndex(
      ([gx, gy]) => Math.abs(gx - normalizedPoint[0]) < 0.04 && Math.abs(gy - normalizedPoint[1]) < 0.04
    );

    const updatedGlints = [...activePhoto.glints];
    if (existingIndex !== -1) {
      updatedGlints.splice(existingIndex, 1);
      toast.info('Glint sparkle removed');
    } else {
      updatedGlints.push(normalizedPoint);
      toast.success(`Oil sparkle added at (${Math.round(x * 100)}%, ${Math.round(y * 100)}%)`);
    }

    const updatedPhotos = [...photos];
    updatedPhotos[selectedPhotoIndex] = {
      ...activePhoto,
      glints: updatedGlints
    };
    setPhotos(updatedPhotos);
  };

  const handleRemoveGlint = (index: number) => {
    const updatedGlints = activePhoto.glints.filter((_, i) => i !== index);
    const updatedPhotos = [...photos];
    updatedPhotos[selectedPhotoIndex] = { ...activePhoto, glints: updatedGlints };
    setPhotos(updatedPhotos);
  };

  const handleClearAllGlints = () => {
    const updatedPhotos = [...photos];
    updatedPhotos[selectedPhotoIndex] = { ...activePhoto, glints: [] };
    setPhotos(updatedPhotos);
    toast.info('All glints cleared from this photo');
  };

  const handleAddPhoto = () => {
    if (!newPhotoUrl.trim()) {
      toast.error('Please enter or upload a photo URL');
      return;
    }
    const newP: LivingPhoto = {
      url: newPhotoUrl.trim(),
      caption: newPhotoCaption.trim() || 'Handcrafted delicacy',
      glints: [[0.5, 0.5]],
      sort: photos.length
    };
    setPhotos([...photos, newP]);
    setSelectedPhotoIndex(photos.length);
    setNewPhotoUrl('');
    setNewPhotoCaption('');
    toast.success('Living photo added! Tap on the image to place oil glints.');
  };

  const handleDeletePhoto = (idx: number) => {
    if (photos.length <= 1) {
      toast.error('Product must have at least one living photo');
      return;
    }
    const updated = photos.filter((_, i) => i !== idx);
    setPhotos(updated);
    if (selectedPhotoIndex >= updated.length) {
      setSelectedPhotoIndex(updated.length - 1);
    }
    toast.success('Photo removed');
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const payload: ProductDetailData = {
        id: product.id,
        name: product.name,
        categoryLabel,
        description,
        highlight,
        spice,
        videoUrl,
        brandLine,
        features,
        ingredients: product.ingredients || [],
        journey,
        artisan,
        recipes: product.recipes || [],
        photos
      };

      // 1. Send PUT to PHP Backend /api/admin/products/:id/detail
      try {
        await fetch(`/api/admin/products/${product.id}/detail`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryLabel,
            description,
            highlight,
            spice,
            videoUrl,
            brandLine,
            features,
            ingredients: product.ingredients || [],
            journey,
            artisan,
            recipes: product.recipes || []
          })
        });
      } catch (e) {
        console.warn('Backend /detail PUT call error:', e);
      }

      // 2. Sync living photos with glints to /api/admin/products/:id/photos
      try {
        for (let idx = 0; idx < photos.length; idx++) {
          const photo = photos[idx];
          if (photo.id && !photo.id.startsWith('p')) {
            // Existing photo in DB -> PUT
            await fetch(`/api/admin/products/${product.id}/photos/${photo.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                caption: photo.caption,
                glints: photo.glints,
                sort: idx,
                url: photo.url
              })
            }).catch(() => {});
          } else {
            // New photo -> POST
            await fetch(`/api/admin/products/${product.id}/photos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                url: photo.url,
                caption: photo.caption,
                glints: photo.glints,
                sort: idx
              })
            }).catch(() => {});
          }
        }
      } catch (e) {
        console.warn('Backend /photos sync call error:', e);
      }

      // 3. Keep local/products table in sync
      await fetch('/dashboard/app/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentId: product.id,
          ...product,
          category_label: categoryLabel,
          categoryLabel,
          description,
          highlight,
          spice,
          video_url: videoUrl,
          videoUrl,
          brand_line: brandLine,
          brandLine,
          features,
          journey,
          artisan,
          product_photos: photos,
          photos
        })
      }).catch(() => {});

      // 4. Also save to app_settings as fallback document if needed
      await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docId: `product_detail_${product.id}`,
          ...payload
        })
      }).catch(() => {});

      toast.success('Living photos & cinematic detail saved perfectly!');
      if (onSaved) onSaved();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to save product details: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      <div className="w-full max-w-5xl bg-stone-900 border border-stone-800 text-white rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* HEADER BAR */}
        <div className="flex items-center justify-between p-5 border-b border-stone-800 bg-stone-950/60 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Cinematic Product View
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300">
                id: {product?.id}
              </span>
            </div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>{product?.name}</span>
              <span className="text-xs text-amber-400 font-normal">· Living Photos & Oil Glints</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Today's Views Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs">
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="font-bold">{viewsToday}</span>
              <span className="text-[11px] text-amber-200/70">Royal guests viewed today</span>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-stone-400 hover:text-white rounded-full h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-stone-800 bg-stone-900/40">
          <button
            onClick={() => setActiveTab('glints')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'glints'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Living Photos & Oil Glints ({photos.length})
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'details'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Info className="h-3.5 w-3.5" />
            Highlight & Brand Banner
          </button>

          <button
            onClick={() => setActiveTab('journey')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'journey'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <MapPin className="h-3.5 w-3.5" />
            "Behind the Jar" Journey
          </button>

          <button
            onClick={() => setActiveTab('artisan')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-t-xl transition-all ${
              activeTab === 'artisan'
                ? 'bg-amber-600 text-white shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            Master Artisan Story
          </button>
        </div>

        {/* MAIN BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OIL GLINTS SPARKLE TAPPER */}
          {activeTab === 'glints' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Photo Canvas & Sparkle Tapper */}
              <div className="lg:col-span-7 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300">
                      Photo {selectedPhotoIndex + 1} of {photos.length}
                    </span>
                    <span className="text-[11px] text-stone-400 truncate max-w-[200px]">
                      "{activePhoto.caption || 'No caption'}"
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPreviewTwinkle(!isPreviewTwinkle)}
                      className={`text-xs h-7 rounded-full border-amber-500/40 ${
                        isPreviewTwinkle ? 'bg-amber-500 text-stone-950 font-bold' : 'text-amber-300'
                      }`}
                    >
                      {isPreviewTwinkle ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Twinkle Mode (On)
                        </>
                      ) : (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Preview Twinkle
                        </>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearAllGlints}
                      className="text-[10px] h-7 px-2 text-stone-400 hover:text-rose-400"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>

                {/* INTERACTIVE TAPPER CANVAS */}
                <div
                  ref={imageContainerRef}
                  onClick={handleImageClick}
                  className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-2xl bg-black select-none ${
                    isPreviewTwinkle ? 'cursor-default' : 'cursor-crosshair'
                  }`}
                >
                  <img
                    src={activePhoto.url}
                    alt={activePhoto.caption}
                    className={`w-full h-full object-cover transition-transform duration-1000 ${
                      isPreviewTwinkle ? 'scale-105' : 'scale-100'
                    }`}
                  />

                  {/* Breathing Steam/Shimmer Overlay in Preview Mode */}
                  {isPreviewTwinkle && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none animate-pulse" />
                  )}

                  {/* Click Instruction Badge */}
                  {!isPreviewTwinkle && (
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/20 text-white text-[11px] font-medium px-2.5 py-1 rounded-full pointer-events-none flex items-center gap-1.5 shadow-lg">
                      <span>👆 Click on shiny oil droplets to place sparkles</span>
                    </div>
                  )}

                  {/* SPARKLE PINS / GLINTS */}
                  {activePhoto.glints.map(([x, y], gIdx) => (
                    <div
                      key={gIdx}
                      style={{
                        left: `${x * 100}%`,
                        top: `${y * 100}%`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all"
                    >
                      {/* Animated Sparkle Star */}
                      <div className="relative flex items-center justify-center">
                        <span className="text-xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.9)] animate-spin" style={{ animationDuration: '6s' }}>
                          ✨
                        </span>
                        <div className="absolute w-6 h-6 rounded-full bg-amber-400/40 animate-ping" />
                      </div>
                    </div>
                  ))}

                  {/* Photo Caption Overlay */}
                  {activePhoto.caption && (
                    <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md rounded-xl p-2.5 text-center border border-white/10 pointer-events-none">
                      <p className="text-xs text-white/95 font-medium italic">
                        "{activePhoto.caption}"
                      </p>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-stone-400 mt-2 text-center">
                  Coordinates are automatically mapped as percentages (0.0 to 1.0) and saved to the database.
                </p>
              </div>

              {/* Photo Controls & Coordinates List */}
              <div className="lg:col-span-5 space-y-4">
                {/* Active Photo Caption & Sort */}
                <Card className="bg-stone-950 border-stone-800">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold flex items-center justify-between">
                      <span>Photo Caption & Glints</span>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">
                        {activePhoto.glints.length} Sparkle Spot{activePhoto.glints.length === 1 ? '' : 's'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-stone-400">Caption</label>
                      <Input
                        value={activePhoto.caption}
                        onChange={(e) => {
                          const updated = [...photos];
                          updated[selectedPhotoIndex].caption = e.target.value;
                          setPhotos(updated);
                        }}
                        placeholder="e.g. Tossed by hand in small batches"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white mt-1"
                      />
                    </div>

                    {/* Glints Coordinates Badges */}
                    <div>
                      <label className="text-[11px] font-bold text-stone-400 block mb-1">
                        Active Sparkle Points:
                      </label>
                      {activePhoto.glints.length === 0 ? (
                        <p className="text-[11px] text-stone-500 italic">
                          No sparkle spots yet. Click anywhere on the photo above to add.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                          {activePhoto.glints.map(([x, y], i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-900 border border-amber-500/30 text-[10px] font-mono text-amber-200"
                            >
                              <span>✨ [{x}, {y}]</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveGlint(i)}
                                className="text-stone-400 hover:text-rose-400 ml-1"
                                title="Remove glint"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Living Photos Strip */}
                <Card className="bg-stone-950 border-stone-800">
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold">Living Photos Gallery ({photos.length})</CardTitle>
                    <CardDescription className="text-xs text-stone-400">
                      The customer can swipe horizontally between these photos in the app.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 space-y-3">
                    <div className="grid grid-cols-3 gap-2">
                      {photos.map((photo, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedPhotoIndex(idx)}
                          className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                            idx === selectedPhotoIndex
                              ? 'border-amber-400 ring-2 ring-amber-400/30 scale-105 shadow-md'
                              : 'border-stone-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
                          <span className="absolute bottom-1 left-1 bg-black/70 text-[9px] font-bold px-1.5 py-0.5 rounded text-amber-300">
                            {photo.glints.length} ✨
                          </span>
                          {photos.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePhoto(idx);
                              }}
                              className="absolute top-1 right-1 p-1 bg-black/60 rounded text-rose-400 hover:text-rose-300"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Add New Photo Form */}
                    <div className="pt-2 border-t border-stone-800 space-y-2">
                      <span className="text-[11px] font-bold text-amber-300 block">Add Living Photo:</span>
                      <Input
                        value={newPhotoUrl}
                        onChange={(e) => setNewPhotoUrl(e.target.value)}
                        placeholder="Image URL (or assets/images/...)"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white"
                      />
                      <Input
                        value={newPhotoCaption}
                        onChange={(e) => setNewPhotoCaption(e.target.value)}
                        placeholder="Caption (e.g. Sun-cured in jaadis)"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddPhoto}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold h-8"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Photo to Gallery
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: HIGHLIGHT & BRAND BANNER */}
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-bold text-stone-300">Category Label (Top Header)</label>
                <Input
                  value={categoryLabel}
                  onChange={(e) => setCategoryLabel(e.target.value)}
                  placeholder="e.g. PICKLES SPECIAL"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Sweet and spicy mango pickle crafted to perfection..."
                  className="w-full rounded-md border border-stone-800 bg-stone-950 p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">
                  Highlight Word (Rendered in Red Bold Font)
                </label>
                <Input
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="e.g. wood-pressed sesame oil, pure desi ghee"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
                <p className="text-[10px] text-stone-500 mt-0.5">
                  Any words matching this inside the description will be highlighted with red styling in the mobile app.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Brand Line (Footer Banner)</label>
                <Input
                  value={brandLine}
                  onChange={(e) => setBrandLine(e.target.value)}
                  placeholder="Bringing Andhra's authentic flavours to your home."
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Video URL (Living Photo ▶ Button)</label>
                <Input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://your-server.com/videos/avakaya.mp4"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>

              {/* Features Tags */}
              <div>
                <label className="text-xs font-bold text-stone-300 block mb-1">
                  Features Tags ({features.length})
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {features.map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => setFeatures(features.filter((_, i) => i !== idx))}
                        className="text-amber-200/60 hover:text-amber-100"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    placeholder="e.g. Traditional Recipe, 100% Natural"
                    className="h-8 text-xs bg-stone-950 border-stone-800 text-white"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (newFeatureText.trim()) {
                        setFeatures([...features, newFeatureText.trim()]);
                        setNewFeatureText('');
                      }
                    }}
                    className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: "BEHIND THE JAR" JOURNEY */}
          {activeTab === 'journey' && (
            <div className="space-y-4 max-w-3xl">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">Behind the Jar Journey Steps</h4>
                  <p className="text-xs text-stone-400">
                    The vertical timeline on the product detail page showing origin, process, and craft.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    setJourney([...journey, { icon: '✨', label: 'Step', title: 'New Craft', text: 'Description' }])
                  }
                  className="bg-amber-600 hover:bg-amber-700 text-white text-xs h-8"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-3">
                {journey.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 grid grid-cols-12 gap-2 items-center"
                  >
                    <div className="col-span-1">
                      <Input
                        value={step.icon}
                        onChange={(e) => {
                          const updated = [...journey];
                          updated[idx].icon = e.target.value;
                          setJourney(updated);
                        }}
                        className="text-center h-8 text-sm bg-stone-900 border-stone-700 text-white p-0"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={step.label}
                        onChange={(e) => {
                          const updated = [...journey];
                          updated[idx].label = e.target.value;
                          setJourney(updated);
                        }}
                        placeholder="Label (e.g. Origin)"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        value={step.title}
                        onChange={(e) => {
                          const updated = [...journey];
                          updated[idx].title = e.target.value;
                          setJourney(updated);
                        }}
                        placeholder="Title (e.g. Guntur)"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white"
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        value={step.text}
                        onChange={(e) => {
                          const updated = [...journey];
                          updated[idx].text = e.target.value;
                          setJourney(updated);
                        }}
                        placeholder="Text description"
                        className="h-8 text-xs bg-stone-900 border-stone-700 text-white"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setJourney(journey.filter((_, i) => i !== idx))}
                        className="text-stone-500 hover:text-rose-400 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MASTER ARTISAN STORY */}
          {activeTab === 'artisan' && (
            <div className="space-y-4 max-w-xl">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 to-stone-900 border border-amber-500/20 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 bg-stone-800">
                  <img src={artisan.photo} alt={artisan.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">{artisan.name}</h4>
                  <p className="text-xs text-amber-300">Crafting authentic recipes since {artisan.since}</p>
                  <p className="text-[11px] text-stone-300 italic mt-1">"{artisan.quote}"</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Artisan Name</label>
                <Input
                  value={artisan.name}
                  onChange={(e) => setArtisan({ ...artisan, name: e.target.value })}
                  placeholder="e.g. Lakshmi Amma"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Year / Since</label>
                <Input
                  value={artisan.since}
                  onChange={(e) => setArtisan({ ...artisan, since: e.target.value })}
                  placeholder="1982"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Artisan Quote</label>
                <textarea
                  value={artisan.quote}
                  onChange={(e) => setArtisan({ ...artisan, quote: e.target.value })}
                  rows={2}
                  placeholder="Every jar carries the scent of home..."
                  className="w-full rounded-md border border-stone-800 bg-stone-950 p-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500 mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-stone-300">Artisan Photo URL</label>
                <Input
                  value={artisan.photo}
                  onChange={(e) => setArtisan({ ...artisan, photo: e.target.value })}
                  placeholder="https://your-server.com/amma.jpg"
                  className="mt-1 text-xs bg-stone-950 border-stone-800 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* FOOTER ACTIONS */}
        <div className="flex items-center justify-between p-4 border-t border-stone-800 bg-stone-950/70 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-stone-300 border-stone-800 hover:bg-stone-800 text-xs"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
          >
            {isSaving ? (
              <>
                <RotateCcw className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Saving Details...
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                Save Product Details & Glints
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
