'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Image as ImageIcon, Box, AlertCircle, Video, ExternalLink, Copy, Smartphone, Sparkles, Palette, Loader2, Layers, Clock, UtensilsCrossed, ArrowRightLeft, RefreshCw, Check, Crown, ArrowUp, ArrowDown, BookOpen, RotateCcw, ShoppingBag, ChevronLeft, ChevronRight, Heart, Trophy, Flame, Mail, ShieldCheck } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from '@/components/ImageUpload'
import { VideoUpload } from '@/components/VideoUpload'
import { MostLovedManager, DEFAULT_MOST_LOVED, MostLovedConfig } from './components/MostLovedManager'
import { BestSellersManager, DEFAULT_BEST_SELLERS, BestSellersConfig } from './components/BestSellersManager'
import { SweetsThaliManager, DEFAULT_SWEETS, SweetsConfig } from './components/SweetsThaliManager'
import { SpiceGrinderManager, DEFAULT_SPICE_GRINDER, SpiceGrinderConfig } from './components/SpiceGrinderManager'
import { FreshPicksManager, DEFAULT_FRESH_PICKS, FreshPicksConfig } from './components/FreshPicksManager'
import { LettersFromHomeManager, DEFAULT_REVIEWS, ReviewsConfig } from './components/LettersFromHomeManager'
import { TrustPromiseManager, DEFAULT_TRUST, TrustConfig } from './components/TrustPromiseManager'
import { PicklesShowcaseManager, DEFAULT_PICKLES_CONFIG, PicklesConfig } from './components/PicklesShowcaseManager'
import { WishlistPantryManager, DEFAULT_WISHLIST_CONFIG, WishlistConfig } from './components/WishlistPantryManager'

// Schemas based on Data Guide
interface MainBanner { title: string; category: string; image: string }
interface AdBanner { tag: string; title: string; sub: string; img: string }
interface Story { label: string; icon: string; tag: string }
interface BentoSelection { section_title: string; best_seller_product: string; card1_label: string; card2_label: string; card2_sub: string; card2_icon: string; card3_label: string; card3_sub: string; card3_icon: string }
interface CategoryParentCard { img: string; }
interface Category { label: string; img: string; tag: string; title_line_1: string; title_line_2: string; description: string; subtitle: string; }
interface CategoryPageConfig { hero_title: string; hero_subtitle: string; hero_image: string; hero_tag: string }
interface Coupon { type: 'image' | 'video'; image?: string; video_url?: string }
interface Packaging { title: string; desc: string; img: string }
interface OnboardingStep { title: string; subtitle: string; desc: string; img: string; overlay?: string }
interface HomeVideoConfig {
  header_video_enabled: boolean;
  header_video_url: string;
  enabled: boolean;
  video_url: string;
  featured_video_url?: string;
  title: string;
}
interface FestivalTheme {
  bgTop: string;
  bgBottom: string;
  tile: string;
  line: string;
  title: string;
  kicker: string;
  strip: string;
  chipBg: string;
  accent: string;
}

interface FestivalTile {
  title: string;
  image: string;
  image2?: string;
  link: {
    category?: string;
    tag?: string;
  };
}

interface FestivalChip {
  title: string;
  image: string;
  link: {
    tag?: string;
    category?: string;
    maxPrice?: number;
  };
}

interface FestivalConfig {
  enabled: boolean;
  id: string;
  kicker: string;
  title: string;
  subtitle: string;
  chipsTitle: string;
  theme: FestivalTheme;
  tiles: FestivalTile[];
  strip: string[];
  chips: FestivalChip[];
  products: {
    tag: string;
    limit: number;
  };
}

interface HeritageVideoConfig {
  enabled: boolean;
  tag: string;
  title: string;
  subtitle: string;
  video_url: string;
}

interface TabTransitionVideoConfig {
  enabled: boolean;
  duration_ms: number;
  video_url: string;
  caption: string;
  show_spinner: boolean;
  display_mode?: 'fullscreen' | 'card';
  is_fullscreen?: boolean;
}

interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }

export interface SnackStoryIngredient {
  name: string;
  image: string;
}

export interface SnackStory {
  id: string;
  name: string;
  image: string;
  price: number;
  story: string;
  since: string;
  ingredients: SnackStoryIngredient[];
  // Backwards compatibility
  product_name?: string;
  storyImage?: string;
  description?: string;
  trustBadges?: string[];
}

export const DEFAULT_STORY_SNACKS: SnackStory[] = [
  {
    id: "murukku",
    name: "Kara Murukku",
    image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg",
    price: 129,
    story: "A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings.",
    since: "1985",
    ingredients: [
      { name: "Rice Flour", image: "assets/images/rice_papad_crispy_rice_flour_papadums.jpg" },
      { name: "Urad Dal", image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg" },
      { name: "Spices", image: "assets/images/special_kura_karam_podi_all-purpose_curry_powder.jpg" }
    ]
  },
  {
    id: "mixture",
    name: "Khara Mixture",
    image: "assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg",
    price: 149,
    story: "A delicious assortment of spiced boondi, peanuts, and sev tossed with roasted curry leaves in pure oil.",
    since: "1992",
    ingredients: [
      { name: "Gram Flour", image: "assets/images/bundhi_crispy_spiced_gram_flour_droplets.jpg" },
      { name: "Peanuts", image: "assets/images/palli_patti_peanut_and_jaggery_chikki.jpg" },
      { name: "Curry Leaves", image: "assets/images/karvepaku_karam_podi_curry_leaves_powder.jpg" }
    ]
  },
  {
    id: "sunnunda",
    name: "Sunnunda Laddu",
    image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg",
    price: 199,
    story: "Traditional roasted urad dal laddus sweetened with organic bellam (jaggery) and rich cow ghee.",
    since: "1978",
    ingredients: [
      { name: "Urad Dal", image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg" },
      { name: "Pure Ghee", image: "assets/images/good_food_text.png" },
      { name: "Bellam", image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg" }
    ]
  },
  {
    id: "chips",
    name: "Banana Chips",
    image: "assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg",
    price: 119,
    story: "Thinly sliced raw bananas fried in cold-pressed coconut oil and sprinkled with sea salt & black pepper.",
    since: "1998",
    ingredients: [
      { name: "Raw Banana", image: "assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg" },
      { name: "Coconut Oil", image: "assets/images/good_food_text.png" },
      { name: "Sea Salt", image: "assets/images/uppava_traditional_salted_pickle.jpg" }
    ]
  }
];
interface TasteOption { title: string; sub: string; icon: string; color: string }
export interface PairItem {
  id: string;
  tag: string;
  imageA: string;
  imageB: string;
  name: string;
  bestWith: string;
  price: number;
}

export interface HeroCombo {
  id: string;
  kicker: string;
  title: string;
  desc: string;
  price: number;
  imageA: string;
  imageB: string;
  colors: string[];
  pairs: PairItem[];
}

export type PairingSibling = PairItem;
export type PairingParent = HeroCombo;

export const DEFAULT_PAIRINGS: HeroCombo[] = [
  {
    id: 'breakfast',
    kicker: 'BREAKFAST',
    title: "Dosa's Best Friends",
    desc: 'Karam Podi + Avakaya',
    price: 379,
    imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
    imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
    colors: ['#5C0A0D', '#7A0F12', '#9B1D22'],
    pairs: [
      {
        id: 'br1',
        tag: 'BESTSELLER',
        imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        name: 'Karam Podi + Avakaya',
        bestWith: 'Dosa · Idli',
        price: 379
      },
      {
        id: 'br2',
        tag: 'POPULAR',
        imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Karam Podi + Masala Peanuts',
        bestWith: 'Dosa · Idli',
        price: 299
      },
      {
        id: 'br3',
        tag: '',
        imageA: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Avakaya + Masala Peanuts',
        bestWith: 'Dosa · Upma',
        price: 329
      }
    ]
  },
  {
    id: 'evening_tea',
    kicker: 'EVENING TEA',
    title: "Chai's Crunchy Partners",
    desc: 'Murukku + Banana Chips',
    price: 299,
    imageA: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
    imageB: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
    colors: ['#18453B', '#235D4E', '#2E7563'],
    pairs: [
      {
        id: 'et1',
        tag: 'CRUNCHY',
        imageA: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        imageB: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
        name: 'Murukku + Banana Chips',
        bestWith: 'Evening tea',
        price: 299
      },
      {
        id: 'et2',
        tag: '',
        imageA: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        imageB: 'assets/images/palli_patti_peanut_and_jaggery_chikki.jpg',
        name: 'Spicy Mixture + Masala Peanuts',
        bestWith: 'Evening tea',
        price: 279
      },
      {
        id: 'et3',
        tag: '',
        imageA: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        imageB: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        name: 'Murukku + Spicy Mixture',
        bestWith: 'Evening tea',
        price: 319
      }
    ]
  },
  {
    id: 'after_meals',
    kicker: 'AFTER MEALS',
    title: 'Sweet Endings',
    desc: 'Sunnunda Laddu + Murukku',
    price: 399,
    imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
    imageB: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
    colors: ['#8B4513', '#A0522D', '#B8860B'],
    pairs: [
      {
        id: 'am1',
        tag: 'TRADITIONAL',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
        name: 'Sunnunda Laddu + Murukku',
        bestWith: 'After meals · Gifting',
        price: 399
      },
      {
        id: 'am2',
        tag: '',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/allu_chips_thinly_sliced_indian_potato_chips.jpg',
        name: 'Sunnunda Laddu + Banana Chips',
        bestWith: 'After meals · Gifting',
        price: 379
      },
      {
        id: 'am3',
        tag: '',
        imageA: 'assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg',
        imageB: 'assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg',
        name: 'Sunnunda Laddu + Spicy Mixture',
        bestWith: 'After meals · Gifting',
        price: 389
      }
    ]
  }
];

export interface SpecialLightItem {
  id: string;
  name: string;
  image: string;
}

export const DEFAULT_SPECIALS_LIGHT: SpecialLightItem[] = [
  {
    id: "avakaya",
    name: "Avakaya",
    image: "assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg"
  },
  {
    id: "karam_podi",
    name: "Karam Podi",
    image: "assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg"
  },
  {
    id: "murukku",
    name: "Murukku",
    image: "assets/images/karam_janthukalu_murukku_strings_snack.jpg"
  },
  {
    id: "sunnunda",
    name: "Sunnunda",
    image: "assets/images/sunnunda_laddu_roasted_urad_dal_laddu.jpg"
  },
  {
    id: "mixture",
    name: "Mixture",
    image: "assets/images/khara_mixture_assorted_crunchy_savory_mix.jpg"
  },
  {
    id: "potato_chips",
    name: "Potato Chips",
    image: "assets/images/potato_chips.png"
  }
];

export interface AutoBannerLink {
  category?: string;
  tag?: string;
  productId?: string;
  url?: string;
}

export interface AutoBannerItem {
  id: string;
  image: string;
  link: AutoBannerLink;
  title?: string;
  subtitle?: string;
}

export const DEFAULT_AUTO_BANNERS: AutoBannerItem[] = [
  {
    id: "b1",
    image: "assets/images/banner_1.jpg",
    link: { category: "Pickles" },
    title: "Heritage Pickles",
    subtitle: "Sun-dried spices & cold-pressed oil"
  },
  {
    id: "b2",
    image: "assets/images/banner_2.jpg",
    link: { category: "Powders" },
    title: "Stone-Ground Podis",
    subtitle: "Aromatic gun powders & Andhra karams"
  },
  {
    id: "b3",
    image: "assets/images/banner_3.jpg",
    link: { category: "Sweets" },
    title: "Traditional Sweets",
    subtitle: "Pure ghee, organic jaggery & dry fruits"
  },
  {
    id: "b4",
    image: "assets/images/banner_4.jpg",
    link: { category: "Snacks" },
    title: "Handcrafted Snacks",
    subtitle: "Crispy murukku, mixture & spiced chips"
  }
];

interface DeliveryConfig { free_threshold: number; base_fee: number; packing_fee: number; gst_percentage: number }
interface CartConfig { freshness_tagline: string; dispatch_reassurance: string; upsell_section_title: string }
interface BillingConfig { delivery_estimate_text: string; support_chat_text: string; savings_highlight_text: string }

interface KitchenStoryIngredient { image_url: string; text: string; is_left: boolean }
interface KitchenStory {
  app_bar: { title: string };
  sections: {
    beginning: { image_url: string; label: string; angle: number; has_pin: boolean };
    history: { text: string };
    authentic: { image_url: string; banner_text: string; angle: number };
    ingredients: { header_text: string; items: KitchenStoryIngredient[]; footer_title: string; footer_subtitle: string };
    vision: { main_text: string; highlight_text: string; suffix_text: string };
    reach: { image_url: string; label: string; description: string };
    footer: { image_url: string; top_text: string; big_text: string; cursive_text: string };
  }
}

export default function ContentManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('banners')
  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'sector3' | 'sector4' | 'both'>('sector1')

  // Load saved tab on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('contentActiveTab');
      if (savedTab) {
        if (savedTab === 'home_video') {
          setActiveTab('home_header_video');
          setVideoSubTab('sector1');
        } else {
          setActiveTab(savedTab);
          if (savedTab === 'home_header_video') setVideoSubTab('sector1');
          if (savedTab === 'featured_video') setVideoSubTab('sector2');
          if (savedTab === 'heritage_video') setVideoSubTab('sector3');
          if (savedTab === 'tab_transition_video') setVideoSubTab('sector4');
        }
      }
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');
    if (value === 'heritage_video') setVideoSubTab('sector3');
    if (value === 'tab_transition_video') setVideoSubTab('sector4');
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentActiveTab', value);
    }
  };

  // Data States
  const [mainBanners, setMainBanners] = useState<MainBanner[]>([])
  const [adBanners, setAdBanners] = useState<AdBanner[]>([])
  
  const [stories, setStories] = useState<Story[]>([])
  
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig>({
    free_threshold: 500, base_fee: 40, packing_fee: 20, gst_percentage: 5
  })
  const [cartConfig, setCartConfig] = useState<CartConfig>({
    freshness_tagline: 'FRESHNESS GUARANTEED', dispatch_reassurance: 'Order in the next 2 hrs for same-day dispatch.', upsell_section_title: 'COMPLETES THE EXPERIENCE'
  })
  const [billingConfig, setBillingConfig] = useState<BillingConfig>({
    delivery_estimate_text: 'Estimated Delivery: 3-5 Business Days', support_chat_text: 'Need help? Chat with our heritage kitchen', savings_highlight_text: 'Total Savings on this order:'
  })

  const [bento, setBento] = useState<BentoSelection>({
    section_title: '', best_seller_product: '', card1_label: '', card2_label: '', card2_sub: '', card2_icon: '', card3_label: '', card3_sub: '', card3_icon: ''
  })
  
  const [categoryParentCards, setCategoryParentCards] = useState<CategoryParentCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryPageConfig, setCategoryPageConfig] = useState<CategoryPageConfig>({
    hero_title: '', hero_subtitle: '', hero_image: '', hero_tag: ''
  })
  const [deals, setDeals] = useState<{product_names: string[], end_time: string | null, title: string}>({
    product_names: [], end_time: null, title: 'DEALS OF THE DAY'
  })
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [packaging, setPackaging] = useState<Packaging[]>([])
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([])
  const [homeVideo, setHomeVideo] = useState<HomeVideoConfig>({
    header_video_enabled: true,
    header_video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
    enabled: true,
    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
    featured_video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
    title: 'AmbhuJakshi Royal Collection'
  })
  const [festivalConfig, setFestivalConfig] = useState<FestivalConfig>({
    enabled: true,
    id: 'sankranti-2027',
    kicker: 'CELEBRATE',
    title: 'Sankranti',
    subtitle: 'Pindi vantalu, sweets & gift boxes, made fresh',
    chipsTitle: 'FESTIVE SPECIALS',
    theme: {
      bgTop: '#F9DFB3',
      bgBottom: '#F6D6A2',
      tile: '#B81D3B',
      line: '#EFCF8C',
      title: '#7A1240',
      kicker: '#5A1030',
      strip: '#D98F2E',
      chipBg: '#FDF3DD',
      accent: '#E9952C',
    },
    tiles: [
      { title: 'Pindi\nVantalu', image: 'assets/images/chakralu.png', image2: 'assets/images/karam_boondi.png', link: { category: 'Snacks' } },
      { title: 'Festive\nSweets', image: 'assets/images/sunnundalu.png', image2: 'assets/images/dry_fruit_laddu.png', link: { category: 'Sweets' } },
      { title: 'Gifting\nCorner', image: 'assets/images/gond_laddu.png', image2: 'assets/images/palli_chikki.png', link: { category: 'Combos' } },
      { title: 'Pickles\n& Podis', image: 'assets/images/avakaya_pickle.png', image2: 'assets/images/special_idli_karam_podi.png', link: { category: 'Pickles' } }
    ],
    strip: ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
    chips: [
      { title: 'Sankranti\nEssentials', image: 'assets/images/sunnundalu.png', link: { tag: 'sankranti' } },
      { title: 'Snacks\n& More', image: 'assets/images/chakralu.png', link: { category: 'Snacks' } },
      { title: 'Under\n₹299', image: 'assets/images/special_idli_karam_podi.png', link: { maxPrice: 299 } },
      { title: 'Best\nSellers', image: 'assets/images/avakaya_pickle.png', link: { tag: 'bestseller' } },
      { title: 'Gift\nBoxes', image: 'assets/images/dry_fruit_laddu.png', link: { category: 'Combos' } }
    ],
    products: { tag: 'sankranti-2027', limit: 10 }
  })
  const [newSloganInput, setNewSloganInput] = useState('')
  const [heritageVideo, setHeritageVideo] = useState<HeritageVideoConfig>({
    enabled: true,
    tag: 'HERITAGE IN MOTION',
    title: 'Behind the Craft: Our Sun-Dried Tradition',
    subtitle: 'Watch how our 40-year-old authentic recipes come to life.',
    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4'
  })
  const [tabTransitionVideo, setTabTransitionVideo] = useState<TabTransitionVideoConfig>({
    enabled: true,
    duration_ms: 1200,
    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793005669/adhvaitha_foods_videos/ofnsjz4frs9ur2pzpufe.mp4',
    caption: 'Swapping Heritage Kitchens...',
    show_spinner: true,
    display_mode: 'fullscreen',
    is_fullscreen: true
  })
  const [isSimulatingTabSwitch, setIsSimulatingTabSwitch] = useState(false)
  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })
  const [snackStories, setSnackStories] = useState<SnackStory[]>(DEFAULT_STORY_SNACKS)
  const [tasteOptions, setTasteOptions] = useState<TasteOption[]>([])
  
  const [kitchenStory, setKitchenStory] = useState<KitchenStory>({
    app_bar: { title: "OUR JOURNEY" },
    sections: {
      beginning: { image_url: "", label: "OUR BEGINNING", angle: -0.05, has_pin: true },
      history: { text: "Founded with a passion for tradition..." },
      authentic: { image_url: "", banner_text: "PURE & AUTHENTIC", angle: 0.05 },
      ingredients: { header_text: "WHILE YOU ARE BROWSING OUR APP\nWE'RE PROBABLY OUT", items: [], footer_title: "& CHOOSING THE PUREST\nCOLD-PRESSED OILS", footer_subtitle: "FROM DIFFERENT\nFARMS ACROSS\nINDIA" },
      vision: { main_text: "Our vision of making ", highlight_text: "HONESTLY\nGOOD", suffix_text: ", authentic and traditional Indian food came to life" },
      reach: { image_url: "", label: "OUR REACH", description: "The same love and authenticity goes into every Adhvaitha pack!" },
      footer: { image_url: "", top_text: "Bring home the taste of tradition.", big_text: "SO TRADITIONAL", cursive_text: "good" }
    }
  })
  
  // Pairing & Products State (The Art of Pairing)
  const [pairings, setPairings] = useState<HeroCombo[]>(DEFAULT_PAIRINGS)
  const [activeComboIndex, setActiveComboIndex] = useState<number>(0)

  const getPairingDisplayImg = (imgUrl?: string, fallback: 'powder' | 'pickle' | 'snack' | 'sweet' = 'pickle') => {
    if (!imgUrl) {
      return fallback === 'powder'
        ? '/assets/images/special_idli_karam_podi.png'
        : fallback === 'sweet'
        ? '/assets/images/sunnundalu.png'
        : fallback === 'snack'
        ? '/assets/images/chakralu.png'
        : '/assets/images/avakaya_pickle.png';
    }
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  const updateCombo = (idx: number, field: keyof HeroCombo, val: any) => {
    setPairings(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const updateComboColor = (comboIdx: number, colorIdx: number, colorVal: string) => {
    setPairings(prev => {
      const next = [...prev];
      const newColors = [...(next[comboIdx].colors || ['#5C0A0D', '#7A0F12', '#9B1D22'])];
      newColors[colorIdx] = colorVal;
      next[comboIdx] = { ...next[comboIdx], colors: newColors };
      return next;
    });
  };

  const applyGradientPreset = (comboIdx: number, colors: string[]) => {
    setPairings(prev => {
      const next = [...prev];
      next[comboIdx] = { ...next[comboIdx], colors };
      return next;
    });
  };

  const swapComboImages = (comboIdx: number) => {
    setPairings(prev => {
      const next = [...prev];
      const curA = next[comboIdx].imageA;
      const curB = next[comboIdx].imageB;
      next[comboIdx] = { ...next[comboIdx], imageA: curB, imageB: curA };
      return next;
    });
    toast.success('Swapped Image A & Image B');
  };

  const addSubPair = (comboIdx: number) => {
    setPairings(prev => {
      const next = [...prev];
      const combo = next[comboIdx];
      const newPair: PairItem = {
        id: `pair-${Date.now()}`,
        tag: '',
        imageA: combo.imageA || 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
        imageB: combo.imageB || 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
        name: `${combo.title} Duo`,
        bestWith: 'Hot rice / Dosa',
        price: combo.price || 349
      };
      next[comboIdx] = {
        ...combo,
        pairs: [...(combo.pairs || []), newPair]
      };
      return next;
    });
  };

  const updateSubPair = (comboIdx: number, pairIdx: number, field: keyof PairItem, val: any) => {
    setPairings(prev => {
      const next = [...prev];
      const pairs = [...(next[comboIdx].pairs || [])];
      pairs[pairIdx] = { ...pairs[pairIdx], [field]: val };
      next[comboIdx] = { ...next[comboIdx], pairs };
      return next;
    });
  };

  const removeSubPair = (comboIdx: number, pairIdx: number) => {
    setPairings(prev => {
      const next = [...prev];
      const pairs = [...(next[comboIdx].pairs || [])];
      pairs.splice(pairIdx, 1);
      next[comboIdx] = { ...next[comboIdx], pairs };
      return next;
    });
  };

  const addNewCombo = () => {
    const newCombo: HeroCombo = {
      id: `combo-${Date.now()}`,
      kicker: 'NEW COMBO',
      title: 'Heritage Pairing',
      desc: 'Pickle + Crunchy Snack',
      price: 349,
      imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
      imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
      colors: ['#5C0A0D', '#7A0F12', '#9B1D22'],
      pairs: [
        {
          id: `p-${Date.now()}-1`,
          tag: 'SPECIAL',
          imageA: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
          imageB: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
          name: 'Signature Duo',
          bestWith: 'Hot Meals',
          price: 349
        }
      ]
    };
    setPairings(prev => [...prev, newCombo]);
    setActiveComboIndex(pairings.length);
    toast.success('Added new pairing combo');
  };

  const removeCombo = (comboIdx: number) => {
    if (pairings.length <= 1) {
      toast.error('You must keep at least one Pairing Combo.');
      return;
    }
    if (!confirm(`Delete combo "${pairings[comboIdx]?.title || 'Untitled'}"?`)) return;
    setPairings(prev => prev.filter((_, idx) => idx !== comboIdx));
    setActiveComboIndex(0);
    toast.success('Combo deleted');
  };

  const restoreDefaultPairings = () => {
    if (!confirm('Reset all pairing combos to the 3 authentic presets (Breakfast, Evening Tea, After Meals)?')) return;
    setPairings(DEFAULT_PAIRINGS);
    setActiveComboIndex(0);
    toast.success('Restored 3 Authentic Pairing Presets!');
  };

  // Backwards compatibility helpers
  const updatePairingSub = (pIdx: number, sIdx: number, field: string, val: any) => updateSubPair(pIdx, sIdx, field as any, val);
  const addPairingSub = (pIdx: number) => addSubPair(pIdx);
  const removePairingSub = (pIdx: number, sIdx: number) => removeSubPair(pIdx, sIdx);


  const [productNames, setProductNames] = useState<string[]>([])
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>(['Mango Special', 'New Snacks', 'Spicy Chicken', 'Ladoo', 'Combos'])
  const [allProducts, setAllProducts] = useState<any[]>([])

  // AmbhuJakshi Specials (specials_light) State & Helpers
  const [specialsLight, setSpecialsLight] = useState<SpecialLightItem[]>(DEFAULT_SPECIALS_LIGHT)

  const updateSpecialItem = (idx: number, field: keyof SpecialLightItem, val: string) => {
    setSpecialsLight(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const addSpecialItem = () => {
    const newItem: SpecialLightItem = {
      id: `special_${Date.now()}`,
      name: 'New Special',
      image: 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg'
    };
    setSpecialsLight(prev => [...prev, newItem]);
    toast.success('Special tile added');
  };

  const removeSpecialItem = (idx: number) => {
    if (specialsLight.length <= 1) {
      toast.error('You must keep at least 1 special tile.');
      return;
    }
    setSpecialsLight(prev => prev.filter((_, i) => i !== idx));
    toast.success('Special tile removed');
  };

  const moveSpecialItem = (idx: number, direction: 'up' | 'down') => {
    setSpecialsLight(prev => {
      const next = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
  };

  const restoreDefaultSpecialsLight = () => {
    if (!confirm('Reset AmbhuJakshi Specials to the 6 authentic presets?')) return;
    setSpecialsLight(DEFAULT_SPECIALS_LIGHT);
    toast.success('Restored 6 Authentic Specials Presets!');
  };

  // Snacks with a Story (SnacksStoryFlip / story_snacks) State & Helpers
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0)
  const [isStoryFlipped, setIsStoryFlipped] = useState<boolean>(false)

  const updateStorySnack = (idx: number, field: keyof SnackStory, val: any) => {
    setSnackStories(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const addStoryIngredient = (snackIdx: number) => {
    setSnackStories(prev => {
      const next = [...prev];
      const cur = next[snackIdx];
      const newIng: SnackStoryIngredient = {
        name: 'Fresh Ingredient',
        image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg'
      };
      next[snackIdx] = {
        ...cur,
        ingredients: [...(cur.ingredients || []), newIng]
      };
      return next;
    });
  };

  const updateStoryIngredient = (snackIdx: number, ingIdx: number, field: keyof SnackStoryIngredient, val: string) => {
    setSnackStories(prev => {
      const next = [...prev];
      const cur = next[snackIdx];
      const ings = [...(cur.ingredients || [])];
      ings[ingIdx] = { ...ings[ingIdx], [field]: val };
      next[snackIdx] = { ...cur, ingredients: ings };
      return next;
    });
  };

  const removeStoryIngredient = (snackIdx: number, ingIdx: number) => {
    setSnackStories(prev => {
      const next = [...prev];
      const cur = next[snackIdx];
      const ings = [...(cur.ingredients || [])];
      ings.splice(ingIdx, 1);
      next[snackIdx] = { ...cur, ingredients: ings };
      return next;
    });
  };

  const addStorySnack = () => {
    const newSnack: SnackStory = {
      id: `snack_${Date.now()}`,
      name: 'New Heritage Snack',
      image: 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
      price: 139,
      story: 'Traditional family snack made with love and time-honored techniques.',
      since: '1995',
      ingredients: [
        { name: 'Rice Flour', image: 'assets/images/rice_papad_crispy_rice_flour_papadums.jpg' }
      ]
    };
    setSnackStories(prev => [...prev, newSnack]);
    setActiveStoryIdx(snackStories.length);
    toast.success('Story snack added');
  };

  const removeStorySnack = (idx: number) => {
    if (snackStories.length <= 1) {
      toast.error('You must keep at least 1 story snack.');
      return;
    }
    setSnackStories(prev => prev.filter((_, i) => i !== idx));
    setActiveStoryIdx(0);
    toast.success('Story snack removed');
  };

  const restoreDefaultStorySnacks = () => {
    if (!confirm('Reset Snacks with a Story to authentic presets (Kara Murukku & Khara Mixture)?')) return;
    setSnackStories(DEFAULT_STORY_SNACKS);
    setActiveStoryIdx(0);
    toast.success('Restored Authentic Story Snacks Presets!');
  };

  const getStoryDisplayImg = (imgUrl?: string) => {
    if (!imgUrl) return '/assets/images/chakralu.png';
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  const getDisplayImage = getStoryDisplayImg;

  // Auto Banner Carousel (AutoBannerCarousel / auto_banners) State & Helpers
  const [autoBanners, setAutoBanners] = useState<AutoBannerItem[]>(DEFAULT_AUTO_BANNERS)
  const [activeBannerIdx, setActiveBannerIdx] = useState<number>(0)
  const [bannerSubTab, setBannerSubTab] = useState<'carousel' | 'ad_banners'>('carousel')

  const updateAutoBanner = (idx: number, field: keyof AutoBannerItem, val: any) => {
    setAutoBanners(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: val };
      return next;
    });
  };

  const updateAutoBannerLink = (idx: number, linkField: keyof AutoBannerLink, val: string) => {
    setAutoBanners(prev => {
      const next = [...prev];
      const curLink = next[idx].link || {};
      next[idx] = { ...next[idx], link: { ...curLink, [linkField]: val } };
      return next;
    });
  };

  const addAutoBanner = () => {
    const newBanner: AutoBannerItem = {
      id: `b${Date.now()}`,
      image: 'assets/images/banner_1.jpg',
      link: { category: 'Pickles' },
      title: 'New Featured Banner',
      subtitle: 'Limited authentic harvest batches'
    };
    setAutoBanners(prev => [...prev, newBanner]);
    setActiveBannerIdx(autoBanners.length);
    toast.success('Auto banner added');
  };

  const removeAutoBanner = (idx: number) => {
    if (autoBanners.length <= 1) {
      toast.error('You must keep at least 1 banner in the carousel.');
      return;
    }
    setAutoBanners(prev => prev.filter((_, i) => i !== idx));
    setActiveBannerIdx(0);
    toast.success('Banner removed');
  };

  const moveAutoBanner = (idx: number, direction: 'up' | 'down') => {
    setAutoBanners(prev => {
      const next = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= next.length) return prev;
      const temp = next[idx];
      next[idx] = next[targetIdx];
      next[targetIdx] = temp;
      return next;
    });
    setActiveBannerIdx(direction === 'up' ? Math.max(0, idx - 1) : Math.min(autoBanners.length - 1, idx + 1));
  };

  const restoreDefaultAutoBanners = () => {
    if (!confirm('Reset Auto Banner Carousel to the 4 authentic presets (Pickles, Powders, Sweets, Snacks)?')) return;
    setAutoBanners(DEFAULT_AUTO_BANNERS);
    setActiveBannerIdx(0);
    toast.success('Restored 4 Authentic Banner Presets!');
  };

  const getBannerDisplayImg = (imgUrl?: string, category?: string) => {
    if (!imgUrl) return '/assets/images/banner_1.jpg';
    if (imgUrl.startsWith('http://') || imgUrl.startsWith('https://') || imgUrl.startsWith('data:')) return imgUrl;
    if (imgUrl.startsWith('assets/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('images/')) return `/${imgUrl}`;
    if (imgUrl.startsWith('/')) return imgUrl;
    return `/assets/images/${imgUrl}`;
  };

  // The Love Chart (Most Loved Products / most_loved) State
  const [mostLoved, setMostLoved] = useState<MostLovedConfig>(DEFAULT_MOST_LOVED);

  // Best Sellers Champions Podium (BestSellersSection / best_sellers) State
  const [bestSellers, setBestSellers] = useState<BestSellersConfig>(DEFAULT_BEST_SELLERS);

  // Mithai Thali Sweets Section (SweetsThaliSection / sweets) State
  const [sweetsThali, setSweetsThali] = useState<SweetsConfig>(DEFAULT_SWEETS);

  // Spice Grinder Section (SpiceGrinderWebView / spices_grinder) State
  const [spiceGrinder, setSpiceGrinder] = useState<SpiceGrinderConfig>(DEFAULT_SPICE_GRINDER);

  // Fresh Picks from Amma's Kitchen Section (FreshPicksSection / fresh_picks) State
  const [freshPicks, setFreshPicks] = useState<FreshPicksConfig>(DEFAULT_FRESH_PICKS);

  // Letters from Home (Customer Reviews / reviews) State
  const [reviewsConfig, setReviewsConfig] = useState<ReviewsConfig>(DEFAULT_REVIEWS);

  // The AmbhuJakshi Promise (Trust Section / trust) State
  const [trustConfig, setTrustConfig] = useState<TrustConfig>(DEFAULT_TRUST);

  // Amma's Pickles Showcase (PicklesShowcaseSection / pickles) State
  const [picklesConfig, setPicklesConfig] = useState<PicklesConfig>(DEFAULT_PICKLES_CONFIG);

  // Amma's Pantry (Wishlist / wishlist) State
  const [wishlistConfig, setWishlistConfig] = useState<WishlistConfig>(DEFAULT_WISHLIST_CONFIG);

  useEffect(() => {
    fetchAllContent()
  }, [])

  const fetchAllContent = async () => {
    setIsLoading(true)
    try {
      const getDocData = async (docId: string) => {
        const res = await fetch(`/dashboard/app/api/app-data?docId=${docId}`)
        const json = await res.json()
        return (json.success && json.data) ? json.data : null
      }

      const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, heritageVideoDoc, tabTransitionDoc, specialsLightDoc, storySnacksDoc, autoBannersDoc, mostLovedDoc, bestSellersDoc, sweetsDoc, spicesGrinderDoc, freshPicksDoc, reviewsDoc, trustDoc, picklesDoc, wishlistDoc, productsRes] = await Promise.all([
        getDocData('banners'), getDocData('stories'), getDocData('bento_selection'),
        getDocData('category_parent_cards'), getDocData('categories'), getDocData('deals'), getDocData('coupons'), getDocData('packaging'), getDocData('onboarding'), getDocData('pairings'), getDocData('kitchen_story'), getDocData('search_config'), getDocData('category_page_config'),
        getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'), getDocData('featured_video_section'), getDocData('tab_transition_video'), getDocData('specials_light'), getDocData('story_snacks'), getDocData('auto_banners'), getDocData('most_loved'), getDocData('best_sellers'), getDocData('sweets'), getDocData('spices_grinder'), getDocData('fresh_picks'), getDocData('reviews'), getDocData('trust'), getDocData('pickles'), getDocData('wishlist'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)
      ])

      if (bannersDoc && Object.keys(bannersDoc).length > 0) {
        setMainBanners(bannersDoc.main_banners || [])
        setAdBanners(bannersDoc.ad_banners || [])
      }
      if (storiesDoc && Object.keys(storiesDoc).length > 0) setStories(storiesDoc.list || [])
      if (bentoDoc && Object.keys(bentoDoc).length > 0) setBento(bentoDoc as BentoSelection)
      if (catParentDoc && Object.keys(catParentDoc).length > 0) setCategoryParentCards(catParentDoc.list || [])
      if (catDoc && Object.keys(catDoc).length > 0) setCategories(catDoc.list || [])
      if (dealsDoc && Object.keys(dealsDoc).length > 0) {
        let end_time_str = '';
        if (dealsDoc.end_time && dealsDoc.end_time.toDate) {
          const d = dealsDoc.end_time.toDate();
          end_time_str = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        } else if (typeof dealsDoc.end_time === 'string') {
          end_time_str = dealsDoc.end_time.substring(0, 16);
        }
        setDeals({
          product_names: dealsDoc.product_names || [],
          end_time: end_time_str,
          title: dealsDoc.title || 'DEALS OF THE DAY'
        })
      }
      if (couponsDoc && Object.keys(couponsDoc).length > 0) setCoupons(couponsDoc.active_list || [])
      if (pkgDoc && Object.keys(pkgDoc).length > 0) setPackaging(pkgDoc.list || [])
      if (onboardDoc && Object.keys(onboardDoc).length > 0) {
        setOnboardingSteps(onboardDoc.steps || [])
        setTasteOptions(onboardDoc.taste_options || [])
      }
      if (pairingsDoc && Object.keys(pairingsDoc).length > 0) {
        const rawList = pairingsDoc.list || (Array.isArray(pairingsDoc) ? pairingsDoc : []);
        if (Array.isArray(rawList) && rawList.length > 0) {
          const formatted: HeroCombo[] = rawList.map((item: any, idx: number) => {
            const colors = Array.isArray(item.colors) && item.colors.length >= 3
              ? item.colors
              : ['#5C0A0D', '#7A0F12', '#9B1D22'];
            const rawPairs = item.pairs || item.subs || item.subPairings || [];
            const pairs: PairItem[] = Array.isArray(rawPairs) ? rawPairs.map((p: any, pIdx: number) => ({
              id: p.id || `pair-${idx}-${pIdx}`,
              tag: p.tag || '',
              imageA: p.imageA || p.img || item.imageA || 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
              imageB: p.imageB || item.imageB || 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
              name: p.name || p.title || `Combo Item ${pIdx + 1}`,
              bestWith: p.bestWith || p.sub || '',
              price: Number(p.price) || 299
            })) : [];

            return {
              id: item.id || `combo-${idx}`,
              kicker: item.kicker || (item.tagline ? item.tagline.toUpperCase() : 'COMBO'),
              title: item.title || 'Curated Combo',
              desc: item.desc || item.subtitle || '',
              price: Number(item.price) || 349,
              imageA: item.imageA || item.img || 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg',
              imageB: item.imageB || 'assets/images/bellam_avakaya_sweet_jaggery_mango_pickle.jpg',
              colors,
              pairs
            };
          });
          setPairings(formatted);
        } else {
          setPairings(DEFAULT_PAIRINGS);
        }
      }
      if (kitchenStoryDoc && Object.keys(kitchenStoryDoc).length > 0) setKitchenStory(kitchenStoryDoc as KitchenStory)
      if (searchConfigDoc && searchConfigDoc.trending_keywords) setTrendingKeywords(searchConfigDoc.trending_keywords)
      if (catPageConfigDoc && Object.keys(catPageConfigDoc).length > 0) setCategoryPageConfig(catPageConfigDoc as CategoryPageConfig)
      if (deliveryConfigDoc && Object.keys(deliveryConfigDoc).length > 0) setDeliveryConfig(deliveryConfigDoc as DeliveryConfig)
      if (cartConfigDoc && Object.keys(cartConfigDoc).length > 0) setCartConfig(cartConfigDoc as CartConfig)
      if (billingConfigDoc && Object.keys(billingConfigDoc).length > 0) setBillingConfig(billingConfigDoc as BillingConfig)
      if (homeVideoDoc && Object.keys(homeVideoDoc).length > 0) {
        setHomeVideo({
          header_video_enabled: homeVideoDoc.header_video_enabled ?? true,
          header_video_url: homeVideoDoc.header_video_url || homeVideoDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
          enabled: homeVideoDoc.enabled ?? true,
          video_url: homeVideoDoc.video_url || homeVideoDoc.featured_video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
          featured_video_url: homeVideoDoc.featured_video_url || homeVideoDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
          title: homeVideoDoc.title || 'AmbhuJakshi Royal Collection'
        })
      }
      if (festivalDoc && Object.keys(festivalDoc).length > 0) {
        setFestivalConfig({
          enabled: festivalDoc.enabled ?? true,
          id: festivalDoc.id || 'sankranti-2027',
          kicker: festivalDoc.kicker || 'CELEBRATE',
          title: festivalDoc.title || 'Sankranti',
          subtitle: festivalDoc.subtitle || 'Pindi vantalu, sweets & gift boxes, made fresh',
          chipsTitle: festivalDoc.chipsTitle || 'FESTIVE SPECIALS',
          theme: {
            bgTop: festivalDoc.theme?.bgTop || '#F9DFB3',
            bgBottom: festivalDoc.theme?.bgBottom || '#F6D6A2',
            tile: festivalDoc.theme?.tile || '#B81D3B',
            line: festivalDoc.theme?.line || '#EFCF8C',
            title: festivalDoc.theme?.title || '#7A1240',
            kicker: festivalDoc.theme?.kicker || '#5A1030',
            strip: festivalDoc.theme?.strip || '#D98F2E',
            chipBg: festivalDoc.theme?.chipBg || '#FDF3DD',
            accent: festivalDoc.theme?.accent || '#E9952C',
          },
          tiles: (festivalDoc.tiles && Array.isArray(festivalDoc.tiles)) ? festivalDoc.tiles : [
            { title: 'Pindi\nVantalu', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
            { title: 'Festive\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
            { title: 'Gifting\nCorner', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
            { title: 'Pickles\n& Podis', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
          ],
          strip: (festivalDoc.strip && Array.isArray(festivalDoc.strip)) ? festivalDoc.strip : ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
          chips: (festivalDoc.chips && Array.isArray(festivalDoc.chips)) ? festivalDoc.chips : [
            { title: 'Sankranti\nEssentials', image: 'assets/images/sweets.png', link: { tag: 'sankranti' } },
            { title: 'Snacks\n& More', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
            { title: 'Under\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
          ],
          products: festivalDoc.products || { tag: festivalDoc.id || 'sankranti-2027', limit: 10 }
        });
      }
      if (heritageVideoDoc && Object.keys(heritageVideoDoc).length > 0) {
        setHeritageVideo({
          enabled: heritageVideoDoc.enabled ?? true,
          tag: heritageVideoDoc.tag || 'HERITAGE IN MOTION',
          title: heritageVideoDoc.title || 'Behind the Craft: Our Sun-Dried Tradition',
          subtitle: heritageVideoDoc.subtitle || 'Watch how our 40-year-old authentic recipes come to life.',
          video_url: heritageVideoDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4'
        });
      }
      if (tabTransitionDoc && Object.keys(tabTransitionDoc).length > 0) {
        setTabTransitionVideo({
          enabled: tabTransitionDoc.enabled ?? true,
          duration_ms: tabTransitionDoc.duration_ms || 1200,
          video_url: tabTransitionDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793005669/adhvaitha_foods_videos/ofnsjz4frs9ur2pzpufe.mp4',
          caption: tabTransitionDoc.caption || 'Swapping Heritage Kitchens...',
          show_spinner: tabTransitionDoc.show_spinner ?? true,
          display_mode: tabTransitionDoc.display_mode || 'fullscreen',
          is_fullscreen: tabTransitionDoc.is_fullscreen ?? true
        });
      }
      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)
      const storySnacksRaw = (storySnacksDoc && Object.keys(storySnacksDoc).length > 0) ? storySnacksDoc : snackStoryDoc;
      if (storySnacksRaw && Object.keys(storySnacksRaw).length > 0) {
        const rawList = storySnacksRaw.list || (Array.isArray(storySnacksRaw) ? storySnacksRaw : []);
        if (Array.isArray(rawList) && rawList.length > 0) {
          const formatted: SnackStory[] = rawList.map((s: any, idx: number) => ({
            id: s.id || `snack_${idx}`,
            name: s.name || s.product_name || 'Heritage Snack',
            image: s.image || s.storyImage || 'assets/images/karam_janthukalu_murukku_strings_snack.jpg',
            price: Number(s.price) || 129,
            story: s.story || s.description || 'A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings.',
            since: s.since || '1985',
            ingredients: Array.isArray(s.ingredients) ? s.ingredients.map((i: any) => ({
              name: i.name || 'Pure Ingredient',
              image: i.image || 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg'
            })) : [
              { name: 'Rice Flour', image: 'assets/images/rice_papad_crispy_rice_flour_papadums.jpg' },
              { name: 'Urad Dal', image: 'assets/images/special_idli_karam_podi_gun_powder_spice_for_idlis.jpg' }
            ]
          }));
          setSnackStories(formatted);
        } else {
          setSnackStories(DEFAULT_STORY_SNACKS);
        }
      }
      if (specialsLightDoc && Object.keys(specialsLightDoc).length > 0) {
        const list = specialsLightDoc.list || (Array.isArray(specialsLightDoc) ? specialsLightDoc : []);
        if (Array.isArray(list) && list.length > 0) {
          setSpecialsLight(list);
        } else {
          setSpecialsLight(DEFAULT_SPECIALS_LIGHT);
        }
      }
      if (autoBannersDoc && Object.keys(autoBannersDoc).length > 0) {
        const rawBanners = autoBannersDoc.banners || (Array.isArray(autoBannersDoc) ? autoBannersDoc : []);
        if (Array.isArray(rawBanners) && rawBanners.length > 0) {
          const formatted: AutoBannerItem[] = rawBanners.map((b: any, idx: number) => ({
            id: b.id || `b${idx + 1}`,
            image: b.image || b.img || 'assets/images/banner_1.jpg',
            link: {
              category: b.link?.category || b.category || 'Pickles',
              tag: b.link?.tag || '',
              productId: b.link?.productId || b.productId || '',
              url: b.link?.url || ''
            },
            title: b.title || (b.link?.category ? `${b.link.category} Collection` : `Banner #${idx + 1}`),
            subtitle: b.subtitle || 'Handcrafted & Stone-Ground'
          }));
          setAutoBanners(formatted);
        } else {
          setAutoBanners(DEFAULT_AUTO_BANNERS);
        }
      } else if (bannersDoc && bannersDoc.main_banners && bannersDoc.main_banners.length > 0) {
        const formatted: AutoBannerItem[] = bannersDoc.main_banners.map((b: any, idx: number) => ({
          id: `b${idx + 1}`,
          image: b.image || 'assets/images/banner_1.jpg',
          link: { category: b.category || 'Pickles' },
          title: b.title || 'Authentic Heritage',
          subtitle: 'From Grandmother\'s Kitchen'
        }));
        setAutoBanners(formatted);
      }
      if (mostLovedDoc && Object.keys(mostLovedDoc).length > 0) {
        const settings = mostLovedDoc.settings || DEFAULT_MOST_LOVED.settings;
        const products = Array.isArray(mostLovedDoc.products) && mostLovedDoc.products.length > 0
          ? mostLovedDoc.products
          : DEFAULT_MOST_LOVED.products;
        setMostLoved({
          settings: {
            enabled: settings.enabled ?? true,
            kicker: settings.kicker || 'THE LOVE CHART',
            title: settings.title || 'Most loved',
            titleAccent: settings.titleAccent || 'products',
            intervalMs: settings.intervalMs || 2500,
            maxItems: settings.maxItems || 10
          },
          products: products
        });
      } else {
        setMostLoved(DEFAULT_MOST_LOVED);
      }
      if (bestSellersDoc && Object.keys(bestSellersDoc).length > 0) {
        const settings = bestSellersDoc.settings || DEFAULT_BEST_SELLERS.settings;
        const categories = Array.isArray(bestSellersDoc.categories) && bestSellersDoc.categories.length > 0
          ? bestSellersDoc.categories
          : DEFAULT_BEST_SELLERS.categories;
        setBestSellers({
          settings: {
            enabled: settings.enabled ?? true,
            kicker: settings.kicker || "THIS MONTH'S CHAMPIONS",
            title: settings.title || 'Best',
            titleAccent: settings.titleAccent || 'sellers',
            subtitle: settings.subtitle || 'Ranked by real orders from 12,000+ homes',
            intervalMs: settings.intervalMs || 4000,
            rows: settings.rows || 3
          },
          categories: categories
        });
      } else {
        setBestSellers(DEFAULT_BEST_SELLERS);
      }
      if (sweetsDoc && Object.keys(sweetsDoc).length > 0) {
        const settings = sweetsDoc.settings || DEFAULT_SWEETS.settings;
        const products = Array.isArray(sweetsDoc.products) && sweetsDoc.products.length > 0
          ? sweetsDoc.products
          : DEFAULT_SWEETS.products;
        setSweetsThali({
          settings: {
            enabled: settings.enabled ?? true,
            kicker: settings.kicker || "MITHAI THALI",
            title: settings.title || 'Traditional sweets,',
            titleAccent: settings.titleAccent || 'timeless joy',
            subtitle: settings.subtitle || 'Pure ghee. Jaggery. Just like Ammamma made.',
            intervalMs: settings.intervalMs || 2800,
            badges: Array.isArray(settings.badges) ? settings.badges : DEFAULT_SWEETS.settings.badges,
            giftTag: settings.giftTag || '🎁 Gift box available'
          },
          products: products
        });
      } else {
        setSweetsThali(DEFAULT_SWEETS);
      }
      if (spicesGrinderDoc && Object.keys(spicesGrinderDoc).length > 0) {
        const settings = spicesGrinderDoc.settings || DEFAULT_SPICE_GRINDER.settings;
        const products = Array.isArray(spicesGrinderDoc.products) && spicesGrinderDoc.products.length > 0
          ? spicesGrinderDoc.products
          : DEFAULT_SPICE_GRINDER.products;
        setSpiceGrinder({
          settings: {
            enabled: settings.enabled ?? true,
            kicker: settings.kicker || 'FROM WHOLE SPICE TO PODI',
            title: settings.title || 'Fresh ground',
            titleAccent: settings.titleAccent || 'spices',
            subtitle: settings.subtitle || 'Pounded in stone, the way Ammamma did.',
            cardTag: settings.cardTag || '🪨 STONE-GROUND TODAY'
          },
          products: products
        });
      } else {
        setSpiceGrinder(DEFAULT_SPICE_GRINDER);
      }
      if (freshPicksDoc && Object.keys(freshPicksDoc).length > 0) {
        const settings = freshPicksDoc.settings || DEFAULT_FRESH_PICKS.settings;
        const products = Array.isArray(freshPicksDoc.products) && freshPicksDoc.products.length > 0
          ? freshPicksDoc.products
          : DEFAULT_FRESH_PICKS.products;
        setFreshPicks({
          settings: {
            enabled: settings.enabled ?? true,
            kicker: settings.kicker || 'FRESH OFF THE STOVE',
            title: settings.title || 'Fresh picks,',
            titleAccent: settings.titleAccent || 'just for you',
            subtitle: settings.subtitle || "new from Amma's kitchen this week",
            intervalMs: settings.intervalMs || 3400
          },
          products: products
        });
      } else {
        setFreshPicks(DEFAULT_FRESH_PICKS);
      }
      if (reviewsDoc && Object.keys(reviewsDoc).length > 0) {
        const settings = reviewsDoc.settings || DEFAULT_REVIEWS.settings;
        const summary = reviewsDoc.summary || DEFAULT_REVIEWS.summary;
        const reviews = Array.isArray(reviewsDoc.reviews) && reviewsDoc.reviews.length > 0
          ? reviewsDoc.reviews
          : DEFAULT_REVIEWS.reviews;
        setReviewsConfig({
          settings: {
            enabled: settings.enabled ?? true,
            eyebrow: settings.eyebrow || 'LETTERS FROM HOME',
            title: settings.title || 'What families',
            titleAccent: settings.titleAccent || 'write to Amma',
            subtitle: settings.subtitle || 'Real notes from real kitchens 💌',
            seeAllLabel: settings.seeAllLabel || 'See all',
            writeLabel: settings.writeLabel || '✍️ Write to Amma',
            ringText: settings.ringText || '★ 1.2k REVIEWS ★ MADE WITH LOVE ★ ',
            wallTop: settings.wallTop || '#1F6B55',
            wallMid: settings.wallMid || '#0F3F33',
            wallBottom: settings.wallBottom || '#082520',
            accent: settings.accent || '#FFD58A',
            gold: settings.gold || '#E9C46A',
            autoplayMs: settings.autoplayMs || 4200
          },
          summary: {
            average: summary.average ?? 4.9,
            count: summary.count ?? 1248
          },
          reviews: reviews
        });
      } else {
        setReviewsConfig(DEFAULT_REVIEWS);
      }
      if (trustDoc && Object.keys(trustDoc).length > 0) {
        setTrustConfig({
          enabled: trustDoc.enabled ?? true,
          eyebrow: trustDoc.eyebrow || 'THE AMBHUJAKSHI PROMISE',
          heading: trustDoc.heading || 'Everything we make comes',
          headingAccent: trustDoc.headingAccent || 'four promises',
          ribbon: trustDoc.ribbon || 'SINCE 1982',
          logo: trustDoc.logo || 'assets/images/AMBHUJAKSHI  logo.png',
          rating: trustDoc.rating || '4.9',
          footer: trustDoc.footer || 'Loved by 12,000+ families',
          tags: (Array.isArray(trustDoc.tags) && trustDoc.tags.length === 4)
            ? trustDoc.tags
            : DEFAULT_TRUST.tags,
          shelf: (Array.isArray(trustDoc.shelf) && trustDoc.shelf.length > 0)
            ? trustDoc.shelf
            : DEFAULT_TRUST.shelf
        });
      } else {
        setTrustConfig(DEFAULT_TRUST);
      }
      if (picklesDoc && Object.keys(picklesDoc).length > 0) {
        const settings = picklesDoc.settings || DEFAULT_PICKLES_CONFIG.settings;
        const picklesList = Array.isArray(picklesDoc.pickles) && picklesDoc.pickles.length > 0
          ? picklesDoc.pickles
          : DEFAULT_PICKLES_CONFIG.pickles;
        setPicklesConfig({
          settings: {
            enabled: settings.enabled ?? true,
            eyebrow: settings.eyebrow || 'HAND-MIXED · SUN-CURED',
            title: settings.title || "Amma's Pickles",
            viewAllLabel: settings.viewAllLabel || 'View all →',
            addLabel: settings.addLabel || 'Add to cart',
            chilliIcon: settings.chilliIcon || 'assets/images/chilli.png'
          },
          pickles: picklesList
        });
      } else {
        setPicklesConfig(DEFAULT_PICKLES_CONFIG);
      }
      if (wishlistDoc && Object.keys(wishlistDoc).length > 0) {
        const settings = wishlistDoc.settings || DEFAULT_WISHLIST_CONFIG.settings;
        const items = Array.isArray(wishlistDoc.items) && wishlistDoc.items.length > 0
          ? wishlistDoc.items
          : DEFAULT_WISHLIST_CONFIG.items;
        setWishlistConfig({
          settings: {
            enabled: settings.enabled ?? true,
            eyebrow: settings.eyebrow || 'MY WISHLIST',
            titleStart: settings.titleStart || "Amma's",
            titleAccent: settings.titleAccent || 'pantry',
            titleEnd: settings.titleEnd || 'for you',
            shareLabel: settings.shareLabel || '↗ Share my shelf',
            fillLabel: settings.fillLabel || 'Fill my basket',
            fairyLights: settings.fairyLights ?? true,
            shareBase: settings.shareBase || 'https://ambhujakshi.com/wishlist/'
          },
          items
        });
      } else {
        setWishlistConfig(DEFAULT_WISHLIST_CONFIG);
      }
      if (productsRes && productsRes.success && productsRes.data) {
        const prods = Object.values(productsRes.data)
        setProductNames(prods.map((p: any) => p.name))
        setAllProducts(prods)
      }

    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveTab = async (docId: string, data: any) => {
    setIsSaving(true)
    try {
      await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, ...data })
      })
      toast.success(`${docId} updated successfully!`)
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error(`Failed to save ${docId}.`)
    } finally {
      setIsSaving(false)
    }
  }

  const saveCurrentTab = () => {
    switch (activeTab) {
      case 'banners':
        handleSaveTab('auto_banners', { banners: autoBanners });
        const legacyMain = autoBanners.map(b => ({
          title: b.title || '',
          category: b.link?.category || '',
          image: b.image || ''
        }));
        handleSaveTab('banners', { main_banners: legacyMain, ad_banners: adBanners });
        break
      case 'stories':
        handleSaveTab('stories', { list: stories })
        break
      case 'bento':
        handleSaveTab('bento_selection', bento)
        break
      case 'categories':
        handleSaveTab('category_parent_cards', { list: categoryParentCards })
        handleSaveTab('categories', { list: categories })
        handleSaveTab('category_page_config', categoryPageConfig)
        break
      case 'deals':
        let endTimeTimestamp = null;
        if (deals.end_time) {
          endTimeTimestamp = new Date(deals.end_time).toISOString();
        }
        handleSaveTab('deals', { 
          product_names: deals.product_names,
          end_time: endTimeTimestamp,
          title: deals.title
        })
        break
      case 'coupons':
        handleSaveTab('coupons', { active_list: coupons })
        break
      case 'packaging':
        handleSaveTab('packaging', { list: packaging })
        break
      case 'onboarding':
        handleSaveTab('onboarding', { steps: onboardingSteps, taste_options: tasteOptions })
        break
      case 'pairings':
        handleSaveTab('pairings', { list: pairings })
        break
      case 'kitchen_story':
        handleSaveTab('kitchen_story', kitchenStory)
        break
      case 'trending_searches':
        handleSaveTab('search_config', { trending_keywords: trendingKeywords })
        break
      case 'cart_delivery':
        handleSaveTab('delivery_config', deliveryConfig)
        handleSaveTab('cart_config', cartConfig)
        handleSaveTab('billing_config', billingConfig)
        break
      case 'home_header_video':
      case 'featured_video':
      case 'home_video':
        handleSaveTab('home_video', homeVideo)
        break
      case 'splash_video':
        handleSaveTab('splash_video', splashVideo)
        break
      case 'snacks_story':
        handleSaveTab('story_snacks', { list: snackStories })
        handleSaveTab('snacks_with_story', { list: snackStories })
        break
      case 'festival':
        handleSaveTab('festival_config', festivalConfig)
        break
      case 'heritage_video':
      case 'featured_video_section':
        handleSaveTab('featured_video_section', heritageVideo)
        break
      case 'tab_transition_video':
        handleSaveTab('tab_transition_video', tabTransitionVideo)
        break
      case 'specials_light':
        handleSaveTab('specials_light', { list: specialsLight })
        break
    }
  }

  const handleSeedData = async (productsToUse?: any[]) => {
    if (!confirm('This will overwrite all current content with demo data. Are you sure?')) return;
    setIsSaving(true)
    try {
      const activeProducts = productsToUse || allProducts;
      const getImg = (keywords: string[]) => {
        const prod = activeProducts.find(p => p.image && keywords.some(k => p.name.toLowerCase().includes(k.toLowerCase())))
        if (prod) return prod.image
        const anyProdWithImg = activeProducts.find(p => p.image)
        return anyProdWithImg ? anyProdWithImg.image : 'https://placehold.co/600x400'
      }

      const img1 = getImg(['bellam', 'avakaya', 'pickle'])
      const img2 = getImg(['laddu', 'sweet', 'jamun'])
      const img3 = getImg(['podi', 'masala', 'spice'])
      const img4 = getImg(['chips', 'mixture', 'snack'])
      
      const defaultProduct = activeProducts.length > 0 ? activeProducts[0].name : 'Bellam Avakaya'

      const postConfig = (docId: string, data: any) => fetch('/dashboard/app/api/app-data', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ docId, ...data }) })

      await Promise.all([
        postConfig('auto_banners', {
          banners: [
            { id: 'b1', image: img1, link: { category: 'Pickles' }, title: 'Heritage Pickles', subtitle: 'Sun-dried spices & cold-pressed oil' },
            { id: 'b2', image: img3, link: { category: 'Powders' }, title: 'Stone-Ground Podis', subtitle: 'Aromatic gun powders & Andhra karams' },
            { id: 'b3', image: img2, link: { category: 'Sweets' }, title: 'Traditional Sweets', subtitle: 'Pure ghee, organic jaggery & dry fruits' },
            { id: 'b4', image: img4, link: { category: 'Snacks' }, title: 'Handcrafted Snacks', subtitle: 'Crispy murukku, mixture & spiced chips' }
          ]
        }),
        postConfig('banners', {
          main_banners: [
            { title: 'AUTHENTIC ANDHRA', category: 'Pickles', image: img1 },
            { title: 'TRADITIONAL SNACKS', category: 'Snacks', image: img2 },
            { title: 'PURE SPICES', category: 'Spices', image: img3 }
          ],
          ad_banners: [{ tag: 'FEATURED', title: 'Summer Sale', sub: 'Up to 20% off', img: img2 }]
        }),
        postConfig('stories', {
          list: [
            { label: 'Our Origin', icon: 'auto_stories', tag: 'ORIGIN' },
            { label: 'Packaging', icon: 'inventory_2', tag: 'PACKAGING' }
          ]
        }),
        postConfig('bento_selection', {
          section_title: "Today's Selection",
          best_seller_product: defaultProduct,
          card1_label: "Best Seller",
          card2_label: "Royal",
          card2_sub: "Spices",
          card2_icon: "auto_awesome",
          card3_label: "Crunchy",
          card3_sub: "Snacks",
          card3_icon: "restaurant_menu_rounded"
        }),
        postConfig('categories', {
          list: [
            { label: 'Pickles', img: img1 },
            { label: 'Sweets', img: img2 },
            { label: 'Spices', img: img3 }
          ]
        }),
        postConfig('deals', {
          product_names: [defaultProduct],
          end_time: new Date(Date.now() + 86400000).toISOString(),
          title: 'DEALS OF THE DAY'
        }),
        postConfig('coupons', {
          active_list: [{ type: 'image', image: img1 }]
        }),
        postConfig('packaging', {
          list: [{ title: 'Premium Glass Jars', desc: 'Sealed for freshness', img: img4 }]
        }),
        postConfig('onboarding', {
          steps: [
            { title: 'Welcome to Adhvaitha', subtitle: 'Authentic Taste', desc: 'Discover the traditional flavors of our handmade delicacies.', img: img1 }
          ],
          taste_options: [
            { title: 'Spicy', sub: 'Traditional heat', icon: 'local_fire_department', color: '#ff4500' },
            { title: 'Sweet', sub: 'Pure jaggery', icon: 'eco', color: '#8b4513' }
          ]
        }),
        postConfig('pairings', {
          list: DEFAULT_PAIRINGS
        }),
        postConfig('specials_light', {
          list: DEFAULT_SPECIALS_LIGHT
        }),
        postConfig('story_snacks', {
          list: DEFAULT_STORY_SNACKS
        }),
        postConfig('snacks_with_story', {
          list: DEFAULT_STORY_SNACKS
        }),
        postConfig('most_loved', {
          settings: DEFAULT_MOST_LOVED.settings,
          products: DEFAULT_MOST_LOVED.products
        }),
        postConfig('best_sellers', {
          settings: DEFAULT_BEST_SELLERS.settings,
          categories: DEFAULT_BEST_SELLERS.categories
        }),
        postConfig('sweets', {
          settings: DEFAULT_SWEETS.settings,
          products: DEFAULT_SWEETS.products
        }),
        postConfig('spices_grinder', {
          settings: DEFAULT_SPICE_GRINDER.settings,
          products: DEFAULT_SPICE_GRINDER.products
        })
      ])
      toast.success('Demo data seeded successfully!')
      fetchAllContent()
    } catch (error) {
      console.error('Error seeding data:', error)
      toast.error('Failed to seed data.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleMigrateImages = async () => {
    if (!confirm('This will upload all local product images to Firebase Storage. This might take a minute. Proceed?')) return;
    setIsSaving(true);
    
    let updatedProducts = [...allProducts];
    
    try {
      let migratedCount = 0;
      for (let i = 0; i < updatedProducts.length; i++) {
        const p = updatedProducts[i];
        if (p.image && p.image.startsWith('/images/')) {
          toast.loading(`Uploading image for ${p.name}...`, { id: 'migrate' });
          
          // Fetch local image
          const response = await fetch(p.image);
          const blob = await response.blob();
          
          // Create Firebase Storage ref
          const fileName = `${Date.now()}_${p.name.replace(/[^a-zA-Z0-9]/g, '_')}.jpeg`;
          const storageRef = ref(storage, `products/${fileName}`);
          
          // Upload and get URL
          await uploadBytes(storageRef, blob, { contentType: blob.type });
          const downloadURL = await getDownloadURL(storageRef);
          
          // Update product in DB
          await fetch('/dashboard/app/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...p, documentId: p.id, image: downloadURL })
          });
          
          updatedProducts[i].image = downloadURL;
          migratedCount++;
        }
      }
      
      setAllProducts(updatedProducts);
      
      if (migratedCount > 0) {
        toast.success(`Successfully uploaded ${migratedCount} images to Firebase Storage!`, { id: 'migrate' });
        // Automatically seed demo data with new Firebase URLs
        await handleSeedData(updatedProducts);
      } else {
        toast.success(`All product images are already in Firebase Storage.`, { id: 'migrate' });
      }
      
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to migrate images.', { id: 'migrate' });
    } finally {
      setIsSaving(false);
    }
  }

  // Array Helpers
  const addToArray = (setter: any, item: any) => setter((p: any) => [...p, item])
  const removeFromArray = (setter: any, idx: number) => setter((p: any) => p.filter((_: any, i: number) => i !== idx))
  const updateArray = (setter: any, idx: number, field: string, val: any) => {
    setter((p: any) => {
      const n = [...p]
      n[idx] = { ...n[idx], [field]: val }
      return n
    })
  }

  // Sector switchers & Render Helpers for Dual Video Sectors
  const renderSectorSwitcher = () => (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit mb-5">
      <button
        type="button"
        onClick={() => {
          setActiveTab('home_header_video');
          setVideoSubTab('sector1');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'home_header_video');
        }}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
          activeTab === 'home_header_video' || (activeTab === 'home_video' && videoSubTab === 'sector1')
            ? 'bg-orange-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }`}
      >
        <Video className="h-3.5 w-3.5" />
        <span>Sector 1: Home Header Video</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab('featured_video');
          setVideoSubTab('sector2');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'featured_video');
        }}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
          activeTab === 'featured_video' || (activeTab === 'home_video' && videoSubTab === 'sector2')
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }`}
      >
        <Video className="h-3.5 w-3.5" />
        <span>Sector 2: After Home Header Video</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab('heritage_video');
          setVideoSubTab('sector3');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'heritage_video');
        }}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
          activeTab === 'heritage_video' || (activeTab === 'home_video' && videoSubTab === 'sector3')
            ? 'bg-purple-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }`}
      >
        <Video className="h-3.5 w-3.5" />
        <span>Sector 3: Heritage Showcase (After Royal Collections)</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab('tab_transition_video');
          setVideoSubTab('sector4');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'tab_transition_video');
        }}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
          activeTab === 'tab_transition_video' || (activeTab === 'home_video' && videoSubTab === 'sector4')
            ? 'bg-emerald-700 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }`}
      >
        <Layers className="h-3.5 w-3.5" />
        <span>Sector 4: Tab Transition Overlay (Loading Video)</span>
      </button>

      <button
        type="button"
        onClick={() => {
          setActiveTab('home_video');
          setVideoSubTab('both');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'home_video');
        }}
        className={`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
          activeTab === 'home_video' && videoSubTab === 'both'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }`}
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span>Full Mobile View (All Videos)</span>
      </button>
    </div>
  );

  const renderSector1 = () => (
    <Card className="border-orange-200 dark:border-orange-900/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-orange-50/70 to-amber-50/40 dark:from-slate-900 dark:to-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Video className="h-5 w-5 text-orange-600" />
              Sector 1: Home Header Video Upload
            </CardTitle>
            <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              Top Header Loop
            </span>
          </div>
          <CardDescription className="mt-1">
            Upload & manage the background video playing behind the greeting, location, search bar, and category chips at the top of the app.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            homeVideo.header_video_enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${homeVideo.header_video_enabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            {homeVideo.header_video_enabled ? 'Active Header Video Loop' : 'Maroon Festive Gradient Fallback'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <label htmlFor="enable-header-video-1" className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
                  Enable Header Video Background
                </label>
                <p className="text-xs text-slate-500">
                  When enabled, loops your festive Cloudinary MP4 video. When disabled or offline, smoothly falls back to the Royal Maroon festive gradient.
                </p>
              </div>
              <input 
                type="checkbox" 
                id="enable-header-video-1" 
                className="w-5 h-5 accent-orange-600 cursor-pointer"
                checked={homeVideo.header_video_enabled} 
                onChange={e => setHomeVideo(prev => ({ ...prev, header_video_enabled: e.target.checked }))} 
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upload Header Video File (Direct to Cloudinary)
                </label>
                {homeVideo.header_video_url && (
                  <a 
                    href={homeVideo.header_video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview in new tab
                  </a>
                )}
              </div>
              <VideoUpload 
                value={homeVideo.header_video_url} 
                onChange={url => setHomeVideo(prev => ({ ...prev, header_video_url: url }))} 
              />
              <p className="text-xs text-slate-500">
                Upload an MP4 video to loop in the header (e.g. festive backgrounds, fireworks, gold sparkles, traditional crafts).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Header Video CDN / Cloudinary URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://res.cloudinary.com/dxynqm0zo/video/upload/.../video.mp4" 
                  value={homeVideo.header_video_url} 
                  onChange={e => setHomeVideo(prev => ({ ...prev, header_video_url: e.target.value }))}
                  className="font-mono text-xs" 
                />
                {homeVideo.header_video_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(homeVideo.header_video_url);
                      toast.success('Header video URL copied to clipboard!');
                    }}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Saves Sector 1 changes directly to BigRock database.
              </div>
              <Button 
                type="button" 
                disabled={isSaving}
                onClick={() => handleSaveTab('home_video', homeVideo)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Sector 1 Header Video'}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Header Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full text-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Top Header Simulation</span>
            </div>
            <div className="w-full max-w-[340px] rounded-[28px] overflow-hidden border-[4px] border-slate-900 shadow-2xl bg-[#7A0F12] relative">
              <div className="relative h-[330px] w-full overflow-hidden">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(110% 110% at 50% 45%, #C4262B 0%, #7A0F12 50%, #3A0406 100%)'
                  }}
                />
                {homeVideo.header_video_enabled && homeVideo.header_video_url && (
                  <video 
                    src={homeVideo.header_video_url} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 pointer-events-none"
                  />
                )}
                <div className="relative z-10 p-4 pt-5 flex flex-col justify-between h-full select-none text-white">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1 text-[#F6C453] font-bold text-xs">
                          <span>📍</span>
                          <span className="truncate max-w-[130px]">Hyderabad, Jubilee Hills</span>
                          <span>▾</span>
                        </div>
                        <p className="text-white/70 text-xs mt-0.5">Good Afternoon 👋</p>
                        <h3 className="text-lg font-black text-white tracking-tight mt-0.5">
                          Hemanth Silla
                        </h3>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="h-6 w-6 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-[10px]">🤍</span>
                          <span className="h-6 w-6 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-[10px]">👤</span>
                          <div className="relative">
                            <span className="h-6 w-6 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-[10px]">🛍️</span>
                            <span className="absolute -top-1 -right-1 bg-emerald-600 text-[8px] text-white font-bold h-3 w-3 rounded-full flex items-center justify-center">2</span>
                          </div>
                        </div>
                        <span className="text-[#F6C453] text-[9px] font-semibold italic">Taste Tradition Every Day</span>
                      </div>
                    </div>

                    <div className="mt-3.5 bg-white rounded-xl py-2 px-3 shadow-md flex items-center justify-between text-slate-700">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>🔍</span>
                        <span className="text-slate-600 text-xs">Search royal flavors...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-px h-3 bg-slate-200"></span>
                        <span className="text-slate-500 text-xs">🎙️</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 pb-1 border-t border-white/10 text-xs">
                    <div className="flex flex-col items-center">
                      <span className="text-sm">🛍️</span>
                      <span className="font-bold text-[9px] mt-0.5 text-white">All</span>
                      <span className="w-3 h-0.5 bg-white rounded-full mt-0.5"></span>
                    </div>
                    <div className="flex flex-col items-center opacity-85">
                      <span className="text-sm">🫙</span>
                      <span className="text-[9px] mt-0.5">Pickles</span>
                    </div>
                    <div className="flex flex-col items-center opacity-85 relative">
                      <span className="absolute -top-1.5 -right-2 bg-red-600 text-[6px] font-bold px-1 rounded-sm text-white">New</span>
                      <span className="text-sm">🥨</span>
                      <span className="text-[9px] mt-0.5">Snacks</span>
                    </div>
                    <div className="flex flex-col items-center opacity-85">
                      <span className="text-sm">🍬</span>
                      <span className="text-[9px] mt-0.5">Sweets</span>
                    </div>
                    <div className="flex flex-col items-center opacity-85">
                      <span className="text-sm">🌶️</span>
                      <span className="text-[9px] mt-0.5">Podis</span>
                    </div>
                    <div className="flex flex-col items-center opacity-85">
                      <span className="text-sm">🎁</span>
                      <span className="text-[9px] mt-0.5">Combos</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSector2 = () => (
    <Card className="border-blue-200 dark:border-blue-900/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50/70 to-indigo-50/40 dark:from-slate-900 dark:to-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Video className="h-5 w-5 text-blue-600" />
              Sector 2: After Home Header Video Upload
            </CardTitle>
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              Below Header Card
            </span>
          </div>
          <CardDescription className="mt-1">
            Upload & manage the promotional video banner that appears right after the header on the Home Screen (as shown in your mobile screenshot).
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            homeVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${homeVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {homeVideo.enabled ? 'Active on App' : 'Hidden'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <label htmlFor="enable-featured-video-2" className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
                  Display Featured Video Section
                </label>
                <p className="text-xs text-slate-500">
                  When enabled, shows the video card below the header with your title badge and playback.
                </p>
              </div>
              <input 
                type="checkbox" 
                id="enable-featured-video-2" 
                className="w-5 h-5 accent-blue-600 cursor-pointer"
                checked={homeVideo.enabled} 
                onChange={e => setHomeVideo(prev => ({ ...prev, enabled: e.target.checked }))} 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Video Badge / Caption Title</label>
              <Input 
                placeholder="e.g. AmbhuJakshi Royal Collection" 
                value={homeVideo.title} 
                onChange={e => setHomeVideo(prev => ({ ...prev, title: e.target.value }))} 
              />
              <p className="text-xs text-slate-500">
                This text appears inside the pill overlay badge on the bottom left of the video card.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upload Featured Video File (Direct to Cloudinary)
                </label>
                {homeVideo.video_url && (
                  <a 
                    href={homeVideo.video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview in new tab
                  </a>
                )}
              </div>
              <VideoUpload 
                value={homeVideo.video_url} 
                onChange={url => setHomeVideo(prev => ({ ...prev, video_url: url, featured_video_url: url }))} 
              />
              <p className="text-xs text-slate-500">
                Upload your promotional product story, recipe highlights, or snacks demonstration video (e.g. AmbhuJakshi Royal Collection).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Featured Video CDN / Cloudinary URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://res.cloudinary.com/dxynqm0zo/video/upload/.../video.mp4" 
                  value={homeVideo.video_url} 
                  onChange={e => setHomeVideo(prev => ({ ...prev, video_url: e.target.value, featured_video_url: e.target.value }))}
                  className="font-mono text-xs" 
                />
                {homeVideo.video_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(homeVideo.video_url);
                      toast.success('Featured video URL copied to clipboard!');
                    }}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Saves Sector 2 changes directly to BigRock database.
              </div>
              <Button 
                type="button" 
                disabled={isSaving}
                onClick={() => handleSaveTab('home_video', homeVideo)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Sector 2 After Header Video'}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Featured Card Preview */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full text-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Below-Header Card Simulation</span>
            </div>
            <div className="w-full max-w-[340px] rounded-[24px] overflow-hidden border-[4px] border-slate-900 shadow-2xl bg-[#F8F5EC] p-3">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">FEATURED VIDEO SECTION (BELOW HEADER)</p>
              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md bg-black border border-slate-200">
                {homeVideo.enabled && homeVideo.video_url ? (
                  <video 
                    src={homeVideo.video_url} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 text-xs">
                    <span>Featured Video Hidden</span>
                  </div>
                )}
                {homeVideo.enabled && (
                  <div className="absolute left-3 bottom-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white font-bold text-[11px] flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {homeVideo.title || 'AmbhuJakshi Royal Collection'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSector3 = () => (
    <Card className="border-purple-200 dark:border-purple-900/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-purple-50/70 to-indigo-50/40 dark:from-slate-900 dark:to-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Video className="h-5 w-5 text-purple-600" />
              Sector 3: Heritage Video Showcase Upload
            </CardTitle>
            <span className="bg-purple-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              After Royal Collections
            </span>
          </div>
          <CardDescription className="mt-1">
            Upload & customize the interactive video showcase placed immediately after Royal Collections on the Home Page.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            heritageVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${heritageVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {heritageVideo.enabled ? 'Showcase Active on App' : 'Showcase Hidden'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <label htmlFor="enable-heritage-video" className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
                  Display Heritage Video Showcase
                </label>
                <p className="text-xs text-slate-500">
                  When enabled, renders the interactive video card after Royal Collections with play/pause and mute controls.
                </p>
              </div>
              <input 
                type="checkbox" 
                id="enable-heritage-video" 
                className="w-5 h-5 accent-purple-600 cursor-pointer"
                checked={heritageVideo.enabled} 
                onChange={e => setHeritageVideo(prev => ({ ...prev, enabled: e.target.checked }))} 
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">Section Tag / Kicker</label>
                <Input 
                  placeholder="e.g. HERITAGE IN MOTION" 
                  value={heritageVideo.tag} 
                  onChange={e => setHeritageVideo(prev => ({ ...prev, tag: e.target.value }))} 
                  className="font-bold uppercase text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">Showcase Title</label>
                <Input 
                  placeholder="e.g. Behind the Craft: Our Sun-Dried Tradition" 
                  value={heritageVideo.title} 
                  onChange={e => setHeritageVideo(prev => ({ ...prev, title: e.target.value }))} 
                  className="font-bold text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">Showcase Subtitle Description</label>
              <Input 
                placeholder="e.g. Watch how our 40-year-old authentic recipes come to life." 
                value={heritageVideo.subtitle} 
                onChange={e => setHeritageVideo(prev => ({ ...prev, subtitle: e.target.value }))} 
                className="text-xs"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upload Showcase Video File (Direct to Cloudinary)
                </label>
                {heritageVideo.video_url && (
                  <a 
                    href={heritageVideo.video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-medium hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview in new tab
                  </a>
                )}
              </div>
              <VideoUpload 
                value={heritageVideo.video_url} 
                onChange={url => setHeritageVideo(prev => ({ ...prev, video_url: url }))} 
              />
              <p className="text-xs text-slate-500">
                Upload your documentary, behind-the-scenes craft, or recipe preparation video (e.g. Behind the Craft).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Showcase Video CDN / Cloudinary URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://res.cloudinary.com/dxynqm0zo/video/upload/.../video.mp4" 
                  value={heritageVideo.video_url} 
                  onChange={e => setHeritageVideo(prev => ({ ...prev, video_url: e.target.value }))} 
                  className="font-mono text-xs" 
                />
                {heritageVideo.video_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(heritageVideo.video_url);
                      toast.success('Heritage video URL copied to clipboard!');
                    }}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Saves Sector 3 changes to BigRock database and updates the mobile app live.
              </div>
              <Button 
                type="button" 
                disabled={isSaving}
                onClick={() => handleSaveTab('featured_video_section', heritageVideo)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium shadow"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Sector 3 Heritage Video'}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Showcase Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full text-center mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Showcase Simulation (After Royal Collections)</span>
            </div>
            <div className="w-full max-w-[340px] rounded-[24px] overflow-hidden border-[4px] border-slate-900 shadow-2xl bg-white p-3 space-y-2">
              <div>
                <span className="text-[9px] font-black tracking-widest text-[#D4AF37] uppercase bg-black/5 px-2 py-0.5 rounded">
                  {heritageVideo.tag || 'HERITAGE IN MOTION'}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1 leading-tight">
                  {heritageVideo.title || 'Behind the Craft: Our Sun-Dried Tradition'}
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                  {heritageVideo.subtitle || 'Watch how our 40-year-old authentic recipes come to life.'}
                </p>
              </div>

              <div className="relative h-44 rounded-2xl overflow-hidden shadow-md bg-black border border-slate-200">
                {heritageVideo.enabled && heritageVideo.video_url ? (
                  <video 
                    src={heritageVideo.video_url} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900 text-xs">
                    <span>Showcase Hidden</span>
                  </div>
                )}
                {heritageVideo.enabled && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute left-3 bottom-3 text-white">
                      <span className="text-[9px] font-bold text-amber-300 block">ADVAITHA CRAFT</span>
                      <span className="text-xs font-black">{heritageVideo.title || 'Behind the Craft'}</span>
                    </div>
                    <div className="absolute right-3 bottom-3 bg-black/60 backdrop-blur-sm p-1.5 rounded-full text-white text-[10px]">
                      🔊
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderSector4 = () => (
    <Card className="border-emerald-200 dark:border-emerald-900/50 shadow-sm overflow-hidden">
      <CardHeader className="pb-4 border-b bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-green-50/30 dark:from-slate-900 dark:to-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Layers className="h-5 w-5 text-emerald-700" />
              Sector 4: Tab Transition Video Overlay (Loading Video)
            </CardTitle>
            <span className="bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
              Tab Switch Animation
            </span>
          </div>
          <CardDescription className="mt-1">
            Upload & configure the animated video overlay and loading message displayed during tab switching across the mobile app.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            tabTransitionVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }`}>
            <span className={`h-2 w-2 rounded-full ${tabTransitionVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
            {tabTransitionVideo.enabled ? 'Transition Overlay Active' : 'Overlay Disabled'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Upload Controls */}
          <div className="lg:col-span-7 space-y-6">
            {/* Master Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
              <div className="space-y-0.5">
                <label htmlFor="enable-tab-transition" className="text-sm font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
                  Enable Tab Transition Video Overlay
                </label>
                <p className="text-xs text-slate-500">
                  When enabled, shows the animated video card with gold border and spinner whenever users switch between bottom tabs.
                </p>
              </div>
              <input 
                type="checkbox" 
                id="enable-tab-transition" 
                className="w-5 h-5 accent-emerald-700 cursor-pointer"
                checked={tabTransitionVideo.enabled} 
                onChange={e => setTabTransitionVideo(prev => ({ ...prev, enabled: e.target.checked }))} 
              />
            </div>

            {/* Spinner Toggle & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                <div className="space-y-0.5">
                  <label htmlFor="show-spinner-toggle" className="text-xs font-semibold text-slate-900 dark:text-slate-100 cursor-pointer">
                    Show Loading Spinner
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Revolving spinner under video
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  id="show-spinner-toggle" 
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                  checked={tabTransitionVideo.show_spinner} 
                  onChange={e => setTabTransitionVideo(prev => ({ ...prev, show_spinner: e.target.checked }))} 
                />
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-emerald-700" /> Duration (ms)
                  </label>
                  <span className="text-xs font-mono font-bold text-emerald-700">
                    {tabTransitionVideo.duration_ms}ms ({ (tabTransitionVideo.duration_ms / 1000).toFixed(1) }s)
                  </span>
                </div>
                <Input 
                  type="number"
                  min="500"
                  max="4000"
                  step="100"
                  value={tabTransitionVideo.duration_ms} 
                  onChange={e => setTabTransitionVideo(prev => ({ ...prev, duration_ms: Number(e.target.value) || 1200 }))} 
                  className="h-8 text-xs font-mono"
                />
              </div>
            </div>

            {/* Custom Caption Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Transition Caption Message
              </label>
              <Input 
                placeholder="e.g. Swapping Heritage Kitchens..." 
                value={tabTransitionVideo.caption} 
                onChange={e => setTabTransitionVideo(prev => ({ ...prev, caption: e.target.value }))} 
                className="text-xs font-medium"
              />
              <p className="text-[11px] text-slate-500">
                Displayed in golden philosopher typography beneath the video during the tab switch.
              </p>
            </div>

            {/* Display Mode Switcher (Full Screen vs Card) */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wide flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-emerald-700" />
                Overlay Display Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setTabTransitionVideo(prev => ({ ...prev, display_mode: 'fullscreen', is_fullscreen: true }))}
                  className={`p-3 rounded-lg text-left transition border ${
                    tabTransitionVideo.display_mode !== 'card'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                      : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Smartphone className="h-4 w-4" />
                    <span>Full-Screen Video (Recommended)</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${tabTransitionVideo.display_mode !== 'card' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Video expands to cover 100% of the mobile screen like splash/loading screen.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setTabTransitionVideo(prev => ({ ...prev, display_mode: 'card', is_fullscreen: false }))}
                  className={`p-3 rounded-lg text-left transition border ${
                    tabTransitionVideo.display_mode === 'card'
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow'
                      : 'bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-xs">
                    <Box className="h-4 w-4" />
                    <span>Floating Gold Card (220x220)</span>
                  </div>
                  <p className={`text-[11px] mt-1 ${tabTransitionVideo.display_mode === 'card' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Video is shown inside a centered floating card with a rich gold border.
                  </p>
                </button>
              </div>
            </div>

            {/* Direct Cloudinary Video Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Upload Loading Video (Full-Screen 9:16 Supported)
                  </label>
                  <span className="text-[11px] text-emerald-700 font-semibold ml-2">
                    Up to 100MB MP4 / MOV
                  </span>
                </div>
                {tabTransitionVideo.video_url && (
                  <a 
                    href={tabTransitionVideo.video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview URL
                  </a>
                )}
              </div>

              <VideoUpload 
                value={tabTransitionVideo.video_url} 
                onChange={url => setTabTransitionVideo(prev => ({ ...prev, video_url: url }))} 
                aspectRatio="portrait"
                maxSizeMB={100}
              />

              {/* 1-Click Ready Presets */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Quick Presets:
                </span>
                <button
                  type="button"
                  onClick={() => setTabTransitionVideo(prev => ({
                    ...prev,
                    video_url: 'https://res.cloudinary.com/dxynqm0zo/image/upload/v1793006733/adhvaitha_foods_videos/bilvtnnkusx16rdofh82.gif',
                    display_mode: 'fullscreen',
                    is_fullscreen: true
                  }))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 hover:bg-amber-100 font-medium transition flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="h-3 w-3 text-amber-600" /> AmbhuJakshi Full-Screen GIF (Live)
                </button>
                <button
                  type="button"
                  onClick={() => setTabTransitionVideo(prev => ({
                    ...prev,
                    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793005669/adhvaitha_foods_videos/ofnsjz4frs9ur2pzpufe.mp4',
                    display_mode: 'fullscreen',
                    is_fullscreen: true
                  }))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 font-medium transition flex items-center gap-1 shadow-sm"
                >
                  <Smartphone className="h-3 w-3" /> AmbhuJakshi Full-Screen MP4
                </button>
                <button
                  type="button"
                  onClick={() => setTabTransitionVideo(prev => ({
                    ...prev,
                    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793003773/adhvaitha_foods_videos/obgj28qbng83ndziq5k4.mp4',
                    display_mode: 'fullscreen',
                    is_fullscreen: true
                  }))}
                  className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-medium transition shadow-sm"
                >
                  Carousel Loading Video
                </button>
              </div>
            </div>

            {/* Direct URL Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">Transition Video CDN / Cloudinary URL</label>
              <div className="flex gap-2">
                <Input 
                  placeholder="https://res.cloudinary.com/dxynqm0zo/video/upload/.../video.mp4" 
                  value={tabTransitionVideo.video_url} 
                  onChange={e => setTabTransitionVideo(prev => ({ ...prev, video_url: e.target.value }))} 
                  className="font-mono text-xs" 
                />
                {tabTransitionVideo.video_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      navigator.clipboard.writeText(tabTransitionVideo.video_url);
                      toast.success('Transition video URL copied to clipboard!');
                    }}
                    title="Copy URL"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-4 border-t flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Saves Sector 4 changes to BigRock database and updates app tab switching live.
              </div>
              <Button 
                type="button" 
                disabled={isSaving}
                onClick={() => handleSaveTab('tab_transition_video', tabTransitionVideo)}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Sector 4 Tab Transition Video'}
              </Button>
            </div>
          </div>

          {/* Right Column: Live Mobile Tab Transition Simulation */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full text-center mb-2 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Live Tab Switch Overlay Simulation
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsSimulatingTabSwitch(true);
                  setTimeout(() => setIsSimulatingTabSwitch(false), tabTransitionVideo.duration_ms || 1200);
                }}
                className="text-xs h-7 border-emerald-700 text-emerald-800 hover:bg-emerald-50"
              >
                Test Switch Animation
              </Button>
            </div>

            <div className="w-full max-w-[340px] rounded-[28px] overflow-hidden border-[4px] border-slate-900 shadow-2xl bg-[#F8F5EC] relative h-[480px] flex flex-col justify-between">
              {/* Underlying App Screen */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Categories</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Screen</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="h-20 bg-slate-200/80 rounded-xl" />
                  <div className="h-20 bg-slate-200/80 rounded-xl" />
                  <div className="h-20 bg-slate-200/80 rounded-xl" />
                  <div className="h-20 bg-slate-200/80 rounded-xl" />
                </div>
              </div>

              {/* Transition Video Overlay (Shown if active or simulated) */}
              {(isSimulatingTabSwitch || tabTransitionVideo.enabled) && (
                <div 
                  className={`absolute inset-0 z-20 flex flex-col transition-opacity duration-300 ${
                    isSimulatingTabSwitch ? 'opacity-100' : 'opacity-95'
                  }`}
                >
                  {tabTransitionVideo.display_mode === 'card' ? (
                    /* Centered Floating Gold Card Mode */
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center p-4"
                      style={{ backgroundColor: 'rgba(24, 69, 59, 0.94)' }}
                    >
                      <div 
                        className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl relative bg-black shrink-0"
                        style={{ border: '3px solid #F6C453' }}
                      >
                        {tabTransitionVideo.video_url ? (
                          tabTransitionVideo.video_url.toLowerCase().includes('.gif') ? (
                            <img 
                              src={tabTransitionVideo.video_url} 
                              alt="Loading Animation"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={tabTransitionVideo.video_url} 
                              autoPlay 
                              muted 
                              loop 
                              playsInline
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                            No Media
                          </div>
                        )}
                      </div>

                      {/* Spinner & Caption */}
                      <div className="mt-4 flex flex-col items-center space-y-2 text-center">
                        {tabTransitionVideo.show_spinner && (
                          <Loader2 className="h-5 w-5 text-[#F6C453] animate-spin" />
                        )}
                        <p 
                          className="text-xs font-bold tracking-wide"
                          style={{ color: '#F6C453', fontFamily: 'serif' }}
                        >
                          {tabTransitionVideo.caption || 'Swapping Heritage Kitchens...'}
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* FULL-SCREEN VIDEO / GIF MODE (100% COVER) */
                    <div className="absolute inset-0 z-20 flex flex-col justify-between overflow-hidden bg-black">
                      {/* Video / GIF Player */}
                      {tabTransitionVideo.video_url ? (
                        tabTransitionVideo.video_url.toLowerCase().includes('.gif') ? (
                          <img 
                            src={tabTransitionVideo.video_url} 
                            alt="Full-Screen Loading Animation"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        ) : (
                          <video 
                            src={tabTransitionVideo.video_url} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs z-0">
                          No Video Selected
                        </div>
                      )}

                      {/* Dark Gradient Overlay for perfect typography readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/45 z-10 pointer-events-none" />

                      {/* Top Status */}
                      <div className="relative z-20 p-3 flex justify-between items-center">
                        <span className="text-[10px] bg-black/60 backdrop-blur-md text-[#F6C453] font-bold px-2 py-0.5 rounded-full border border-[#F6C453]/30 flex items-center gap-1">
                          <Smartphone className="h-3 w-3" /> Full-Screen Loading Active
                        </span>
                      </div>

                      {/* Center / Bottom Spinner & Caption */}
                      <div className="relative z-20 p-4 pb-6 flex flex-col items-center space-y-2 text-center">
                        {tabTransitionVideo.show_spinner && (
                          <Loader2 className="h-6 w-6 text-[#F6C453] animate-spin drop-shadow" />
                        )}
                        <p 
                          className="text-xs font-bold tracking-wide drop-shadow-md max-w-[240px]"
                          style={{ color: '#F6C453', fontFamily: 'serif' }}
                        >
                          {tabTransitionVideo.caption || 'Swapping Heritage Kitchens...'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Nav Bar Simulation */}
              <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-[10px] text-slate-600 z-30">
                <div 
                  className="flex flex-col items-center cursor-pointer hover:text-emerald-700"
                  onClick={() => {
                    setIsSimulatingTabSwitch(true);
                    setTimeout(() => setIsSimulatingTabSwitch(false), tabTransitionVideo.duration_ms || 1200);
                  }}
                >
                  <span>🏠</span>
                  <span>Home</span>
                </div>
                <div 
                  className="flex flex-col items-center font-bold text-emerald-800 cursor-pointer"
                  onClick={() => {
                    setIsSimulatingTabSwitch(true);
                    setTimeout(() => setIsSimulatingTabSwitch(false), tabTransitionVideo.duration_ms || 1200);
                  }}
                >
                  <span>🛍️</span>
                  <span>Categories</span>
                </div>
                <div 
                  className="flex flex-col items-center cursor-pointer hover:text-emerald-700"
                  onClick={() => {
                    setIsSimulatingTabSwitch(true);
                    setTimeout(() => setIsSimulatingTabSwitch(false), tabTransitionVideo.duration_ms || 1200);
                  }}
                >
                  <span>🛒</span>
                  <span>Cart</span>
                </div>
                <div 
                  className="flex flex-col items-center cursor-pointer hover:text-emerald-700"
                  onClick={() => {
                    setIsSimulatingTabSwitch(true);
                    setTimeout(() => setIsSimulatingTabSwitch(false), tabTransitionVideo.duration_ms || 1200);
                  }}
                >
                  <span>👤</span>
                  <span>Profile</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDualPreview = () => (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-orange-600" />
            <CardTitle className="text-base font-semibold">Full Mobile App Dual Video Simulation</CardTitle>
          </div>
          <span className="text-xs text-slate-500 font-medium">Sequential Mobile View (Header + After Header)</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-950/50">
        <div className="w-full max-w-[390px] rounded-[32px] overflow-hidden border-[5px] border-slate-900 shadow-2xl bg-[#7A0F12] relative">
          {/* SECTOR 1: Dynamic Header Video */}
          <div className="relative h-[330px] w-full overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(110% 110% at 50% 45%, #C4262B 0%, #7A0F12 50%, #3A0406 100%)'
              }}
            />
            {homeVideo.header_video_enabled && homeVideo.header_video_url && (
              <video 
                src={homeVideo.header_video_url} 
                autoPlay 
                muted 
                loop 
                playsInline
                className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-90 pointer-events-none"
              />
            )}
            <div className="relative z-10 p-4 pt-5 flex flex-col justify-between h-full select-none text-white">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-[#F6C453] font-bold text-xs">
                      <span>📍</span>
                      <span className="truncate max-w-[130px]">Hyderabad, Jubilee Hills</span>
                      <span>▾</span>
                    </div>
                    <p className="text-white/70 text-xs mt-0.5">Good Afternoon 👋</p>
                    <h3 className="text-xl font-black text-white tracking-tight mt-0.5">
                      Hemanth Silla
                    </h3>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                      <span className="h-7 w-7 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-xs">🤍</span>
                      <span className="h-7 w-7 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-xs">👤</span>
                      <div className="relative">
                        <span className="h-7 w-7 rounded-full bg-black/35 border border-[#F6C453]/45 flex items-center justify-center text-xs">🛍️</span>
                        <span className="absolute -top-1 -right-1 bg-emerald-600 text-[9px] text-white font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center">2</span>
                      </div>
                    </div>
                    <span className="text-[#F6C453] text-[10px] font-semibold italic">Taste Tradition Every Day</span>
                  </div>
                </div>

                <div className="mt-3.5 bg-white rounded-xl py-2 px-3 shadow-md flex items-center justify-between text-slate-700">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>🔍</span>
                    <span className="text-slate-600">Search royal flavors...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-px h-3.5 bg-slate-200"></span>
                    <span className="text-slate-500 text-xs">🎙️</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 pb-1 border-t border-white/10 text-xs">
                <div className="flex flex-col items-center">
                  <span className="text-base">🛍️</span>
                  <span className="font-bold text-[10px] mt-0.5 text-white">All</span>
                  <span className="w-4 h-0.5 bg-white rounded-full mt-0.5"></span>
                </div>
                <div className="flex flex-col items-center opacity-85">
                  <span className="text-base">🫙</span>
                  <span className="text-[10px] mt-0.5">Pickles</span>
                </div>
                <div className="flex flex-col items-center opacity-85 relative">
                  <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-[7px] font-bold px-1 rounded-sm text-white">New</span>
                  <span className="text-base">🥨</span>
                  <span className="text-[10px] mt-0.5">Snacks</span>
                </div>
                <div className="flex flex-col items-center opacity-85">
                  <span className="text-base">🍬</span>
                  <span className="text-[10px] mt-0.5">Sweets</span>
                </div>
                <div className="flex flex-col items-center opacity-85">
                  <span className="text-base">🌶️</span>
                  <span className="text-[10px] mt-0.5">Podis</span>
                </div>
                <div className="flex flex-col items-center opacity-85">
                  <span className="text-base">🎁</span>
                  <span className="text-[10px] mt-0.5">Combos</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTOR 2: Featured Video Card Below Header */}
          <div className="bg-[#F8F5EC] p-3 pb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">SECTOR 2: VIDEO CARD (BELOW HEADER)</p>
            <div className="relative h-40 rounded-2xl overflow-hidden shadow-md bg-black border border-slate-200">
              {homeVideo.enabled && homeVideo.video_url && (
                <video 
                  src={homeVideo.video_url} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute left-3 bottom-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg text-white font-bold text-[11px] flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {homeVideo.title || 'AmbhuJakshi Royal Collection'}
              </div>
            </div>
          </div>

          {/* SECTOR 3: Heritage Showcase (After Royal Collections) */}
          <div className="bg-white p-3 border-t border-slate-200">
            <span className="text-[9px] font-black tracking-widest text-[#D4AF37] uppercase bg-black/5 px-2 py-0.5 rounded">
              {heritageVideo.tag || 'HERITAGE IN MOTION'}
            </span>
            <p className="text-xs font-bold text-slate-900 mt-1">{heritageVideo.title || 'Behind the Craft'}</p>
            <div className="relative h-36 rounded-xl overflow-hidden shadow-md bg-black mt-2">
              {heritageVideo.enabled && heritageVideo.video_url && (
                <video 
                  src={heritageVideo.video_url} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute left-2.5 bottom-2.5 text-white">
                <span className="text-[10px] font-bold">SECTOR 3 SHOWCASE</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button 
            type="button" 
            disabled={isSaving}
            onClick={() => handleSaveTab('home_video', homeVideo)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Both Video Sectors'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );


  const applyFestivalPreset = (presetKey: 'sankranti' | 'diwali' | 'mango' | 'ugadi') => {
    if (presetKey === 'sankranti') {
      setFestivalConfig(prev => ({
        ...prev,
        id: 'sankranti-2027',
        kicker: 'CELEBRATE',
        title: 'Sankranti',
        subtitle: 'Pindi vantalu, sweets & gift boxes, made fresh',
        chipsTitle: 'FESTIVE SPECIALS',
        theme: {
          bgTop: '#F9DFB3',
          bgBottom: '#F6D6A2',
          tile: '#B81D3B',
          line: '#EFCF8C',
          title: '#7A1240',
          kicker: '#5A1030',
          strip: '#D98F2E',
          chipBg: '#FDF3DD',
          accent: '#E9952C',
        },
        strip: ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
        tiles: [
          { title: 'Pindi\nVantalu', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Festive\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Gifting\nCorner', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
          { title: 'Pickles\n& Podis', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
        ],
        chips: [
          { title: 'Sankranti\nEssentials', image: 'assets/images/sweets.png', link: { tag: 'sankranti' } },
          { title: 'Snacks\n& More', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
          { title: 'Under\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
        ],
        products: { tag: 'sankranti-2027', limit: 10 }
      }));
      toast.success('🌾 Sankranti campaign preset applied!');
    } else if (presetKey === 'diwali') {
      setFestivalConfig(prev => ({
        ...prev,
        id: 'diwali-2026',
        kicker: 'CELEBRATE',
        title: 'Diwali',
        subtitle: 'Pure khoya sweets, crisp savories & royal gift sets',
        chipsTitle: 'DIWALI SPECIALS',
        theme: {
          bgTop: '#FBE0B8',
          bgBottom: '#F7CF96',
          tile: '#9B1457',
          line: '#E6C387',
          title: '#5A0E32',
          kicker: '#450926',
          strip: '#C76F26',
          chipBg: '#FDF2DE',
          accent: '#E68222',
        },
        strip: ['DIWALI SPECIALS', 'PURE GHEE SWEETS', 'ROYAL HAMPERS', 'SAME DAY DISPATCH'],
        tiles: [
          { title: 'Royal\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Crunchy\nNamkeen', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Diwali\nGift Hampers', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
          { title: 'Festive\nPickles', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
        ],
        chips: [
          { title: 'Diwali\nHampers', image: 'assets/images/combos.png', link: { tag: 'diwali' } },
          { title: 'Pure Ghee\nSweets', image: 'assets/images/sweets.png', link: { category: 'Sweets' } },
          { title: 'Gift Boxes\nUnder ₹499', image: 'assets/images/spices.png', link: { maxPrice: 499 } }
        ],
        products: { tag: 'diwali-2026', limit: 10 }
      }));
      toast.success('🪔 Diwali campaign preset applied!');
    } else if (presetKey === 'mango') {
      setFestivalConfig(prev => ({
        ...prev,
        id: 'mango-season-2027',
        kicker: 'FRESH SEASON',
        title: 'Avakaya',
        subtitle: 'Sun-dried raw mango pickles & hand-ground podis',
        chipsTitle: 'MANGO SPECIALS',
        theme: {
          bgTop: '#FFF1C2',
          bgBottom: '#FFD978',
          tile: '#2E7D32',
          line: '#E8C55C',
          title: '#1B5E20',
          kicker: '#0E3D12',
          strip: '#D48B12',
          chipBg: '#FFF8E1',
          accent: '#F59E0B',
        },
        strip: ['FRESH AVAKAYA', 'LIMITED BATCH', 'COLD-PRESSED OIL', 'AUTHENTIC TASTE'],
        tiles: [
          { title: 'Avakaya\nPickles', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } },
          { title: 'Sweet\nMango Special', image: 'assets/images/pickles.png', image2: 'assets/images/sweets.png', link: { category: 'Pickles' } },
          { title: 'Mango\nSnacks', image: 'assets/images/snacks.png', image2: 'assets/images/spices.png', link: { category: 'Snacks' } },
          { title: 'Traditional\nPodis', image: 'assets/images/spices.png', image2: 'assets/images/pickles.png', link: { category: 'Podis' } }
        ],
        chips: [
          { title: 'Avakaya\nSpecials', image: 'assets/images/pickles.png', link: { tag: 'mango' } },
          { title: 'Summer\nSnacks', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
          { title: 'Combo Packs\nUnder ₹399', image: 'assets/images/combos.png', link: { maxPrice: 399 } }
        ],
        products: { tag: 'mango-season-2027', limit: 10 }
      }));
      toast.success('🥭 Mango Season preset applied!');
    } else if (presetKey === 'ugadi') {
      setFestivalConfig(prev => ({
        ...prev,
        id: 'ugadi-2027',
        kicker: 'NEW BEGINNINGS',
        title: 'Ugadi',
        subtitle: 'Shadruchulu, festive obbattu, bobbatlu & traditional pachadi delicacies',
        chipsTitle: 'UGADI SPECIALS',
        theme: {
          bgTop: '#E8F5E9',
          bgBottom: '#C8E6C9',
          tile: '#1B5E20',
          line: '#A5D6A7',
          title: '#0F3F13',
          kicker: '#0A2B0D',
          strip: '#2E7D32',
          chipBg: '#F1F8E9',
          accent: '#43A047',
        },
        strip: ['SHADRUCHULU', 'FESTIVE BOBBATLU', 'PURE GHEE', 'TRADITIONAL RECIPES'],
        tiles: [
          { title: 'Festive\nBobbatlu', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Ugadi\nPachadi Kits', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } },
          { title: 'Crispy\nSnacks', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Royal\nCombos', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } }
        ],
        chips: [
          { title: 'Ugadi\nSpecials', image: 'assets/images/sweets.png', link: { tag: 'ugadi' } },
          { title: 'Traditional\nSweets', image: 'assets/images/sweets.png', link: { category: 'Sweets' } },
          { title: 'Under\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
        ],
        products: { tag: 'ugadi-2027', limit: 10 }
      }));
      toast.success('🌿 Ugadi festive preset applied!');
    }
  };

  if (isLoading) return <div className="flex h-[400px] items-center justify-center">Loading Content...</div>

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 pb-20">
      <div className="flex items-center justify-between sticky top-0 z-20 bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-sm py-4 -mx-4 px-4 sm:-mx-6 sm:px-6 border-b border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-[#f97316]" />
            App Content Manager
          </h2>
          <p className="text-slate-500">Manage all app_data documents reflecting directly in the app.</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleMigrateImages} disabled={isSaving} variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
            Migrate Images
          </Button>
          <Button onClick={() => handleSeedData()} disabled={isSaving} variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
            Seed Demo Data
          </Button>
          <Button onClick={saveCurrentTab} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving 
              ? 'Saving...' 
              : activeTab === 'home_header_video' 
                ? 'Save Sector 1 (Header Video)' 
                : activeTab === 'featured_video' 
                  ? 'Save Sector 2 (After Header Video)' 
                  : activeTab === 'home_video'
                    ? 'Save All Video Sectors'
                    : activeTab === 'heritage_video'
                      ? 'Save Sector 3 (Heritage Video)'
                      : activeTab === 'tab_transition_video'
                        ? 'Save Sector 4 (Tab Switch Video)'
                        : activeTab === 'festival'
                          ? 'Publish Festival Live'
                          : activeTab === 'pairings'
                            ? 'Publish Pairings Live'
                            : activeTab === 'specials_light'
                              ? 'Publish Specials Live'
                              : activeTab === 'snacks_story'
                                ? 'Publish Story Snacks Live'
                                : activeTab === 'banners'
                                  ? 'Publish Auto Banners Live'
                                  : `Save ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full flex gap-6 flex-col lg:flex-row items-start lg:h-[calc(100vh-180px)]">
        <TabsList className="flex flex-col justify-start bg-slate-100 dark:bg-slate-900 w-full lg:w-56 items-stretch p-2 gap-2 shrink-0 lg:h-full overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-xl custom-scrollbar">
          {/* AUTO BANNER CAROUSEL TAB TRIGGER */}
          <TabsTrigger 
            value="banners" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-600" />
              <span className="font-semibold text-xs text-left">Auto Banner Carousel</span>
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase">Live Sync</span>
          </TabsTrigger>
          
          {/* FESTIVAL CAMPAIGN TAB TRIGGER */}
          <TabsTrigger 
            value="festival" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-left">Festival Campaign</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">Live Sync</span>
          </TabsTrigger>
          
          {/* SECTOR 1 TAB TRIGGER */}
          <TabsTrigger 
            value="home_header_video" 
            onClick={() => setVideoSubTab('sector1')}
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-xs text-left">Sector 1: Header Video</span>
            </span>
            <span className="text-[9px] bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold px-1.5 py-0.5 rounded uppercase">Top Header</span>
          </TabsTrigger>

          {/* SECTOR 2 TAB TRIGGER */}
          <TabsTrigger 
            value="featured_video" 
            onClick={() => setVideoSubTab('sector2')}
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-600" />
              <span className="font-semibold text-xs text-left">Sector 2: After Header Video</span>
            </span>
            <span className="text-[9px] bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold px-1.5 py-0.5 rounded uppercase">Below Header</span>
          </TabsTrigger>

          {/* SECTOR 3 TAB TRIGGER */}
          <TabsTrigger 
            value="heritage_video" 
            onClick={() => setVideoSubTab('sector3')}
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-purple-600" />
              <span className="font-semibold text-xs text-left">Sector 3: Heritage Showcase</span>
            </span>
            <span className="text-[9px] bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold px-1.5 py-0.5 rounded uppercase">Showcase</span>
          </TabsTrigger>

          {/* SECTOR 4 TAB TRIGGER */}
          <TabsTrigger 
            value="tab_transition_video" 
            onClick={() => setVideoSubTab('sector4')}
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-700" />
              <span className="font-semibold text-xs text-left">Sector 4: Tab Switch Video</span>
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase">Loading</span>
          </TabsTrigger>

          <TabsTrigger value="stories" className="justify-start data-[state=active]:bg-white">Stories</TabsTrigger>
          <TabsTrigger value="bento" className="justify-start data-[state=active]:bg-white">Bento Selection</TabsTrigger>
          <TabsTrigger value="categories" className="justify-start data-[state=active]:bg-white">Categories</TabsTrigger>
          <TabsTrigger value="deals" className="justify-start data-[state=active]:bg-white">Deals of the Day</TabsTrigger>
          <TabsTrigger value="coupons" className="justify-start data-[state=active]:bg-white">Active Coupons</TabsTrigger>
          <TabsTrigger value="packaging" className="justify-start data-[state=active]:bg-white">Packaging</TabsTrigger>
          <TabsTrigger value="onboarding" className="justify-start data-[state=active]:bg-white">Onboarding</TabsTrigger>
          {/* ART OF PAIRING TAB TRIGGER */}
          <TabsTrigger 
            value="pairings" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-rose-600" />
              <span className="font-semibold text-xs text-left">Art of Pairing</span>
            </span>
            <span className="text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded uppercase">Combos</span>
          </TabsTrigger>

          {/* AMBHUJAKSHI SPECIALS (SPECIALS_LIGHT) TAB TRIGGER */}
          <TabsTrigger 
            value="specials_light" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-amber-600" />
              <span className="font-semibold text-xs text-left">AmbhuJakshi Specials</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">6 Tiles</span>
          </TabsTrigger>
          <TabsTrigger value="kitchen_story" className="justify-start data-[state=active]:bg-white">Kitchen Story</TabsTrigger>
          <TabsTrigger value="trending_searches" className="justify-start data-[state=active]:bg-white">Trending Searches</TabsTrigger>
          <TabsTrigger value="cart_delivery" className="justify-start data-[state=active]:bg-white">Cart & Billing</TabsTrigger>
          <TabsTrigger value="splash_video" className="justify-start data-[state=active]:bg-white">Splash Video</TabsTrigger>
          {/* SNACKS WITH A STORY (SNACKS STORY FLIP) TAB TRIGGER */}
          <TabsTrigger 
            value="snacks_story" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-amber-700" />
              <span className="font-semibold text-xs text-left">Snacks Story Flip</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">Flip Cards</span>
          </TabsTrigger>
          {/* THE LOVE CHART (MOST LOVED PRODUCTS) TAB TRIGGER */}
          <TabsTrigger 
            value="most_loved" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
              <span className="font-semibold text-xs text-left">The Love Chart</span>
            </span>
            <span className="text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded uppercase">Most Loved</span>
          </TabsTrigger>
          {/* BEST SELLERS CHAMPIONS PODIUM TAB TRIGGER */}
          <TabsTrigger 
            value="best_sellers" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="font-semibold text-xs text-left">Best Sellers Podium</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">Champions</span>
          </TabsTrigger>
          {/* MITHAI THALI SWEETS TAB TRIGGER */}
          <TabsTrigger 
            value="sweets_thali" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-600 fill-amber-500" />
              <span className="font-semibold text-xs text-left">Mithai Thali Sweets</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">Brass Thali</span>
          </TabsTrigger>
          {/* SPICE GRINDER (STONE-GROUND PODI) TAB TRIGGER */}
          <TabsTrigger 
            value="spice_grinder" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="font-semibold text-xs text-left">Spice Grinder</span>
            </span>
            <span className="text-[9px] bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold px-1.5 py-0.5 rounded uppercase">Stone Podi</span>
          </TabsTrigger>
          {/* FRESH PICKS (AMMA'S KITCHEN) TAB TRIGGER */}
          <TabsTrigger 
            value="fresh_picks" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-600 fill-orange-500" />
              <span className="font-semibold text-xs text-left">Fresh Picks</span>
            </span>
            <span className="text-[9px] bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold px-1.5 py-0.5 rounded uppercase">Amma's Kadai</span>
          </TabsTrigger>
          {/* LETTERS FROM HOME (CUSTOMER REVIEWS) TAB TRIGGER */}
          <TabsTrigger 
            value="reviews" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-600 fill-emerald-500/20" />
              <span className="font-semibold text-xs text-left">Letters from Home</span>
            </span>
            <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.5 rounded uppercase">Reviews</span>
          </TabsTrigger>
          {/* THE AMBHUJAKSHI PROMISE (TRUST SECTION) TAB TRIGGER */}
          <TabsTrigger 
            value="trust" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-amber-600 fill-amber-500/20" />
              <span className="font-semibold text-xs text-left">The Promise</span>
            </span>
            <span className="text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-1.5 py-0.5 rounded uppercase">Trust</span>
          </TabsTrigger>
          {/* AMMA'S PICKLES (PICKLES SHOWCASE) TAB TRIGGER */}
          <TabsTrigger 
            value="pickles_showcase" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-red-600 fill-red-500/20" />
              <span className="font-semibold text-xs text-left">Amma's Pickles</span>
            </span>
            <span className="text-[9px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 font-bold px-1.5 py-0.5 rounded uppercase">Showcase</span>
          </TabsTrigger>
          {/* AMMA'S PANTRY (WISHLIST) TAB TRIGGER */}
          <TabsTrigger 
            value="wishlist" 
            className="justify-start data-[state=active]:bg-white flex items-center justify-between group"
          >
            <span className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-600 fill-pink-500/20" />
              <span className="font-semibold text-xs text-left">Amma's Pantry</span>
            </span>
            <span className="text-[9px] bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 font-bold px-1.5 py-0.5 rounded uppercase">Wishlist</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-w-0 lg:h-full overflow-y-auto pr-2 pb-20 custom-scrollbar">
          {/* SECTOR 1: HOME HEADER VIDEO */}
          <TabsContent value="home_header_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector1()}
          </TabsContent>

          {/* SECTOR 2: FEATURED VIDEO (AFTER HEADER) */}
          <TabsContent value="featured_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector2()}
          </TabsContent>

          {/* SECTOR 3: HERITAGE VIDEO SHOWCASE (AFTER ROYAL COLLECTIONS) */}
          <TabsContent value="heritage_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector3()}
          </TabsContent>

          {/* SECTOR 4: TAB TRANSITION VIDEO OVERLAY (LOADING VIDEO) */}
          <TabsContent value="tab_transition_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector4()}
          </TabsContent>

          {/* UNIFIED / LEGACY TAB (ALL SECTORS) */}
          <TabsContent value="home_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {videoSubTab === 'sector1' && renderSector1()}
            {videoSubTab === 'sector2' && renderSector2()}
            {videoSubTab === 'sector3' && renderSector3()}
            {videoSubTab === 'sector4' && renderSector4()}
            {videoSubTab === 'both' && renderDualPreview()}
          </TabsContent>
          
          {/* FESTIVAL CAMPAIGN TAB CONTENT */}
          <TabsContent value="festival" className="mt-0 space-y-6">
            {/* Top Campaign Header & Presets Card */}
            <Card className="border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-yellow-50/30 dark:from-slate-900 dark:to-slate-900/80">
              <CardHeader className="pb-4 border-b border-amber-200/60 dark:border-amber-900/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-amber-500 text-white rounded-xl shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                            Festival Campaign Manager
                          </CardTitle>
                          <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Live App Sync
                          </span>
                        </div>
                        <CardDescription className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          Configure festival themes, colors, titles, feature tiles, and banner chips live on the app home screen.
                        </CardDescription>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                      festivalConfig.enabled 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      <span className={`h-2 w-2 rounded-full ${festivalConfig.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                      {festivalConfig.enabled ? 'Festival Live on App' : 'Festival Section Hidden'}
                    </span>
                  </div>
                </div>

                {/* 1-Click Campaign Presets */}
                <div className="mt-4 pt-4 border-t border-amber-200/50 dark:border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
                    <Palette className="h-3.5 w-3.5 text-amber-600" />
                    Quick Presets:
                  </span>
                  <button
                    type="button"
                    onClick={() => applyFestivalPreset('sankranti')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-amber-100/70 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>🌾</span> Sankranti Specials
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFestivalPreset('diwali')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-amber-100/70 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>🪔</span> Diwali Lights
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFestivalPreset('mango')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-amber-100/70 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>🥭</span> Mango Season (Avakaya)
                  </button>
                  <button
                    type="button"
                    onClick={() => applyFestivalPreset('ugadi')}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-amber-100/70 dark:hover:bg-amber-950 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-200 transition shadow-sm flex items-center gap-1.5"
                  >
                    <span>🌿</span> Ugadi Delicacies
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-6 bg-white dark:bg-slate-900/50">
                {/* Master Active Switch */}
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm mb-6">
                  <div className="space-y-0.5">
                    <label htmlFor="enable-festival-campaign" className="text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                      Festival Campaign Section Active
                    </label>
                    <p className="text-xs text-slate-500">
                      When enabled, the festive campaign is prominently displayed on the Home Page. When disabled, the section is completely hidden from users.
                    </p>
                  </div>
                  <input 
                    type="checkbox" 
                    id="enable-festival-campaign" 
                    className="w-5 h-5 accent-amber-600 cursor-pointer"
                    checked={festivalConfig.enabled} 
                    onChange={e => setFestivalConfig(prev => ({ ...prev, enabled: e.target.checked }))} 
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form & Settings (7 cols) */}
                  <div className="xl:col-span-7 space-y-6">
                    {/* 1. Campaign Details */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <span>📝</span> 1. Festival Campaign Copy & Identifiers
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Festival Title (Hero)</label>
                          <Input 
                            placeholder="e.g. Sankranti, Diwali, Avakaya" 
                            value={festivalConfig.title} 
                            onChange={e => setFestivalConfig(prev => ({ ...prev, title: e.target.value }))}
                            className="bg-white dark:bg-slate-950 font-bold"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Kicker Tag</label>
                          <Input 
                            placeholder="e.g. CELEBRATE, FRESH SEASON" 
                            value={festivalConfig.kicker} 
                            onChange={e => setFestivalConfig(prev => ({ ...prev, kicker: e.target.value }))}
                            className="bg-white dark:bg-slate-950 uppercase"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subtitle / Tagline Description</label>
                        <Input 
                          placeholder="e.g. Pindi vantalu, sweets & gift boxes, made fresh" 
                          value={festivalConfig.subtitle} 
                          onChange={e => setFestivalConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                          className="bg-white dark:bg-slate-950"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Chips Section Title</label>
                          <Input 
                            placeholder="e.g. FESTIVE SPECIALS" 
                            value={festivalConfig.chipsTitle} 
                            onChange={e => setFestivalConfig(prev => ({ ...prev, chipsTitle: e.target.value }))}
                            className="bg-white dark:bg-slate-950 uppercase"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Campaign ID / Product Tag</label>
                          <Input 
                            placeholder="e.g. sankranti-2027" 
                            value={festivalConfig.id} 
                            onChange={e => setFestivalConfig(prev => ({ 
                              ...prev, 
                              id: e.target.value,
                              products: { ...prev.products, tag: e.target.value }
                            }))}
                            className="bg-white dark:bg-slate-950 font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. Theme Colors (9 Palette Tokens) */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                          <span>🎨</span> 2. Theme Color Palette Customizer
                        </h4>
                        <span className="text-[11px] text-slate-500">Pick native swatch or type Hex</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { key: 'bgTop', label: 'Background Top' },
                          { key: 'bgBottom', label: 'Background Bottom' },
                          { key: 'tile', label: 'Tile Card Color' },
                          { key: 'line', label: 'Tile Border Line' },
                          { key: 'title', label: 'Title Text Color' },
                          { key: 'kicker', label: 'Kicker Tag Color' },
                          { key: 'strip', label: 'Slogan Strip Color' },
                          { key: 'chipBg', label: 'Chip Background' },
                          { key: 'accent', label: 'Accent Highlight' },
                        ].map(({ key, label }) => {
                          const val = (festivalConfig.theme as any)[key] || '#FFFFFF';
                          return (
                            <div key={key} className="p-2.5 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 shadow-sm">
                              <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400 truncate">{label}</span>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="color" 
                                  value={val} 
                                  onChange={e => {
                                    const c = e.target.value;
                                    setFestivalConfig(prev => ({ ...prev, theme: { ...prev.theme, [key]: c } }));
                                  }}
                                  className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white shrink-0" 
                                />
                                <Input 
                                  value={val} 
                                  onChange={e => {
                                    const c = e.target.value;
                                    setFestivalConfig(prev => ({ ...prev, theme: { ...prev.theme, [key]: c } }));
                                  }}
                                  className="h-8 font-mono text-xs uppercase px-2"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 3. Strip Slogans */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <span>🏷️</span> 3. Slogan Ticker Strip
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {festivalConfig.strip.map((slogan, sIdx) => (
                          <div 
                            key={sIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm"
                            style={{ borderLeftColor: festivalConfig.theme.strip, borderLeftWidth: '4px' }}
                          >
                            <span>{slogan}</span>
                            <button
                              type="button"
                              onClick={() => setFestivalConfig(prev => ({ ...prev, strip: prev.strip.filter((_, i) => i !== sIdx) }))}
                              className="text-slate-400 hover:text-red-500 transition ml-1"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add new ticker slogan (e.g. 100% PURE GHEE)" 
                          value={newSloganInput} 
                          onChange={e => setNewSloganInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && newSloganInput.trim()) {
                              e.preventDefault();
                              setFestivalConfig(prev => ({ ...prev, strip: [...prev.strip, newSloganInput.trim().toUpperCase()] }));
                              setNewSloganInput('');
                            }
                          }}
                          className="bg-white dark:bg-slate-950 text-xs uppercase"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            if (newSloganInput.trim()) {
                              setFestivalConfig(prev => ({ ...prev, strip: [...prev.strip, newSloganInput.trim().toUpperCase()] }));
                              setNewSloganInput('');
                            }
                          }}
                          className="shrink-0"
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add
                        </Button>
                      </div>
                    </div>

                    {/* 4. Four Feature Tiles */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <span>📦</span> 4. Four Feature Tiles (2x2 Grid)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {festivalConfig.tiles.slice(0, 4).map((tile, tIdx) => (
                          <div key={tIdx} className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Tile #{tIdx + 1}</span>
                              <div 
                                className="h-3 w-3 rounded-full border border-black/20" 
                                style={{ backgroundColor: festivalConfig.theme.tile }}
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-500">Title (Multiline supported)</label>
                              <Input 
                                value={tile.title} 
                                onChange={e => {
                                  const v = e.target.value;
                                  setFestivalConfig(prev => {
                                    const next = [...prev.tiles];
                                    next[tIdx] = { ...next[tIdx], title: v };
                                    return { ...prev, tiles: next };
                                  });
                                }}
                                className="h-8 text-xs font-semibold"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-500">Primary Cutout Image (PNG / URL)</label>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg border border-amber-300 overflow-hidden bg-slate-900 shrink-0">
                                  <img 
                                    src={getDisplayImage(tile.image)} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                    onError={e => {
                                      (e.target as HTMLImageElement).src = '/assets/images/chakralu.png';
                                    }} 
                                  />
                                </div>
                                <Input 
                                  value={tile.image} 
                                  onChange={e => {
                                    const v = e.target.value;
                                    setFestivalConfig(prev => {
                                      const next = [...prev.tiles];
                                      next[tIdx] = { ...next[tIdx], image: v };
                                      return { ...prev, tiles: next };
                                    });
                                  }}
                                  className="h-8 text-xs font-mono flex-1"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-500">Target Category</label>
                              <Input 
                                value={tile.link?.category || ''} 
                                onChange={e => {
                                  const v = e.target.value;
                                  setFestivalConfig(prev => {
                                    const next = [...prev.tiles];
                                    next[tIdx] = { ...next[tIdx], link: { ...next[tIdx].link, category: v } };
                                    return { ...prev, tiles: next };
                                  });
                                }}
                                placeholder="e.g. Snacks, Sweets, Combos, Pickles"
                                className="h-8 text-xs"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Instant Save / Publish Button */}
                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Saves to BigRock MySQL database and immediately reflects across all mobile apps via live stream.
                      </div>
                      <Button 
                        type="button" 
                        disabled={isSaving}
                        onClick={() => handleSaveTab('festival_config', festivalConfig)}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md px-6"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        {isSaving ? 'Publishing...' : 'Publish Festival Campaign Live'}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Live Mobile App Simulation (5 cols) */}
                  <div className="xl:col-span-5 flex flex-col items-center">
                    <div className="w-full text-center mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
                        <Smartphone className="h-3.5 w-3.5 text-amber-600" />
                        Live Mobile Festival Section Simulation
                      </span>
                    </div>

                    <div className="w-full max-w-[360px] rounded-[32px] overflow-hidden border-[5px] border-slate-900 shadow-2xl bg-[#F4F1EA] relative">
                      {/* Festival Section Hero Container */}
                      <div 
                        className="p-4 relative overflow-hidden transition-all duration-300"
                        style={{
                          background: `linear-gradient(180deg, ${festivalConfig.theme.bgTop} 0%, ${festivalConfig.theme.bgBottom} 100%)`
                        }}
                      >
                        {/* Decorative Top Pill */}
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                            style={{ 
                              color: festivalConfig.theme.kicker,
                              backgroundColor: 'rgba(255,255,255,0.45)',
                              border: `1px solid ${festivalConfig.theme.line}`
                            }}
                          >
                            {festivalConfig.kicker || 'CELEBRATE'}
                          </span>
                          <span className="text-[11px] font-bold text-amber-900/60">Festive Season 2027</span>
                        </div>

                        {/* Title & Subtitle */}
                        <h2 
                          className="text-3xl font-black tracking-tight"
                          style={{ color: festivalConfig.theme.title }}
                        >
                          {festivalConfig.title || 'Sankranti'}
                        </h2>
                        <p className="text-xs text-amber-950/70 mt-0.5 font-medium leading-relaxed max-w-[280px]">
                          {festivalConfig.subtitle || 'Pindi vantalu, sweets & gift boxes, made fresh'}
                        </p>

                        {/* 4 Feature Tiles Grid */}
                        <div className="grid grid-cols-2 gap-2.5 mt-3.5">
                          {festivalConfig.tiles.slice(0, 4).map((t, i) => (
                            <div 
                              key={i}
                              className="h-24 rounded-2xl p-2.5 relative flex flex-col justify-between shadow-sm overflow-hidden"
                              style={{
                                backgroundColor: festivalConfig.theme.tile,
                                border: `1.5px solid ${festivalConfig.theme.line}`
                              }}
                            >
                              <span className="text-xs font-black text-white leading-tight whitespace-pre-line z-10 drop-shadow-sm">
                                {t.title}
                              </span>
                              <div className="self-start z-10">
                                <span className="text-[9px] font-bold text-amber-200 underline">Explore &rarr;</span>
                              </div>
                              {/* Product Cutout Mockup Graphic with authentic photo */}
                              <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full bg-white/20 border border-white/40 overflow-hidden flex items-center justify-center shadow-md">
                                <img
                                  src={getDisplayImage(t.image)}
                                  alt={t.title}
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src = i === 0 ? '/assets/images/chakralu.png' : i === 1 ? '/assets/images/sunnundalu.png' : i === 2 ? '/assets/images/gond_laddu.png' : '/assets/images/avakaya_pickle.png';
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Slogan Ticker Strip */}
                      <div 
                        className="py-2 px-3 flex items-center justify-around text-white font-black text-[10px] tracking-widest shadow-inner overflow-hidden select-none"
                        style={{ backgroundColor: festivalConfig.theme.strip }}
                      >
                        {festivalConfig.strip.slice(0, 3).map((s, idx) => (
                          <span key={idx} className="flex items-center gap-1.5">
                            <span>★</span>
                            <span>{s}</span>
                          </span>
                        ))}
                      </div>

                      {/* Chips Row Mockup */}
                      <div className="p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-black text-slate-700 tracking-wider uppercase">
                            {festivalConfig.chipsTitle || 'FESTIVE SPECIALS'}
                          </span>
                          <span className="text-[10px] font-bold text-amber-700">View All</span>
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {festivalConfig.chips.map((chip, cIdx) => (
                            <div 
                              key={cIdx}
                              className="shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-1.5 border border-slate-200"
                              style={{ backgroundColor: festivalConfig.theme.chipBg }}
                            >
                              <div className="w-4 h-4 rounded-full overflow-hidden bg-white border border-amber-400/50 shrink-0">
                                <img
                                  src={getDisplayImage(chip.image)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={e => {
                                    (e.target as HTMLImageElement).src = '/assets/images/sunnundalu.png';
                                  }}
                                />
                              </div>
                              <span className="text-slate-800 whitespace-nowrap">{chip.title.replace('\n', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SPLASH VIDEO */}
          <TabsContent value="splash_video" className="mt-0 space-y-6">
            <Card className="border-orange-200 dark:border-orange-950/60 shadow-sm overflow-hidden">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-orange-50/80 via-amber-50/50 to-yellow-50/30 dark:from-slate-900 dark:to-slate-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl flex items-center gap-2 text-slate-900 dark:text-slate-100">
                      <Smartphone className="h-5 w-5 text-orange-600" />
                      Splash Screen Video (App Launch)
                    </CardTitle>
                    <span className="bg-orange-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                      Full-Screen 9:16
                    </span>
                  </div>
                  <CardDescription className="mt-1">
                    Configure the background full-screen video played when users first open the mobile app.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    splashVideo.enabled 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                      : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    <span className={`h-2 w-2 rounded-full ${splashVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {splashVideo.enabled ? 'Splash Video Active' : 'Disabled'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form & Upload */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="space-y-0.5">
                        <label htmlFor="enable-splash-video" className="text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer">
                          Enable Splash Screen Video
                        </label>
                        <p className="text-xs text-slate-500">
                          Plays the full-screen branding video before presenting the home feed.
                        </p>
                      </div>
                      <input 
                        type="checkbox" 
                        id="enable-splash-video" 
                        className="w-5 h-5 accent-orange-600 cursor-pointer"
                        checked={splashVideo.enabled} 
                        onChange={e => setSplashVideo(prev => ({ ...prev, enabled: e.target.checked }))} 
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            Upload Splash Video (Full-Screen 9:16 Supported)
                          </label>
                          <span className="text-[11px] text-orange-600 font-semibold ml-2">
                            Up to 100MB MP4 / MOV
                          </span>
                        </div>
                        {splashVideo.video_url && (
                          <a 
                            href={splashVideo.video_url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium hover:underline"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Preview URL
                          </a>
                        )}
                      </div>

                      <VideoUpload 
                        value={splashVideo.video_url} 
                        onChange={url => setSplashVideo(prev => ({ ...prev, video_url: url }))} 
                        aspectRatio="portrait"
                        maxSizeMB={100}
                      />

                      {/* 1-Click Quick Presets */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                          Presets:
                        </span>
                        <button
                          type="button"
                          onClick={() => setSplashVideo(prev => ({
                            ...prev,
                            video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793005669/adhvaitha_foods_videos/ofnsjz4frs9ur2pzpufe.mp4',
                            title: 'AmbhuJakshi Royal Collection'
                          }))}
                          className="px-2.5 py-1 text-xs rounded-lg border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 hover:bg-orange-100 font-medium transition flex items-center gap-1 shadow-sm"
                        >
                          <Smartphone className="h-3 w-3" /> AmbhuJakshi Full-Screen Video
                        </button>
                        <button
                          type="button"
                          onClick={() => setSplashVideo(prev => ({
                            ...prev,
                            video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1793003773/adhvaitha_foods_videos/obgj28qbng83ndziq5k4.mp4',
                            title: 'Heritage Craft Video'
                          }))}
                          className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 font-medium transition shadow-sm"
                        >
                          Carousel Video
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-900 dark:text-slate-100">Splash Video Title / Caption</label>
                      <Input 
                        placeholder="e.g. AmbhuJakshi Royal Collection" 
                        value={splashVideo.title} 
                        onChange={e => setSplashVideo(prev => ({ ...prev, title: e.target.value }))} 
                        className="text-xs font-medium"
                      />
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        Updates the app startup splash video in BigRock database.
                      </div>
                      <Button 
                        type="button" 
                        disabled={isSaving}
                        onClick={() => handleSaveTab('splash_video', splashVideo)}
                        className="bg-orange-600 hover:bg-orange-700 text-white font-medium shadow"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Splash Video'}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Live Mobile Splash Screen Simulation */}
                  <div className="lg:col-span-5 flex flex-col items-center">
                    <div className="w-full text-center mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Splash Screen Mobile Preview
                      </span>
                      <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-bold px-2 py-0.5 rounded-full">
                        Full-Screen 9:16
                      </span>
                    </div>

                    <div className="w-full max-w-[320px] rounded-[32px] overflow-hidden border-[5px] border-slate-900 shadow-2xl bg-black relative h-[500px] flex flex-col justify-between">
                      {/* Fullscreen Video / GIF */}
                      {splashVideo.video_url ? (
                        splashVideo.video_url.toLowerCase().includes('.gif') ? (
                          <img 
                            src={splashVideo.video_url} 
                            alt="Splash Animation"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        ) : (
                          <video 
                            src={splashVideo.video_url} 
                            autoPlay 
                            muted 
                            loop 
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover z-0"
                          />
                        )
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 text-xs z-0 p-4 text-center">
                          <Smartphone className="h-10 w-10 mb-2 opacity-40 text-orange-500" />
                          <span>No Media Uploaded</span>
                          <span className="text-[10px] text-slate-600 mt-1">Upload a vertical 9:16 full-screen video or GIF</span>
                        </div>
                      )}

                      {/* Top Camera Notch */}
                      <div className="relative z-20 pt-2.5 flex justify-center pointer-events-none">
                        <div className="h-2 w-16 bg-white/30 rounded-full" />
                      </div>

                      {/* Gradient Overlay for Title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 z-10 pointer-events-none" />

                      {/* Bottom Title & Loader */}
                      <div className="relative z-20 p-5 pb-7 flex flex-col items-center space-y-2 text-center">
                        <Loader2 className="h-6 w-6 text-orange-400 animate-spin" />
                        <h3 className="text-sm font-bold text-white tracking-wide">
                          {splashVideo.title || 'AmbhuJakshi Royal Collection'}
                        </h3>
                        <span className="text-[10px] text-white/70 tracking-widest uppercase font-semibold">
                          Pure Authentic Flavours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* SNACKS WITH A STORY (SnacksStoryFlip) */}
          <TabsContent value="snacks_story" className="mt-0 space-y-6">
            {/* Header / Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 shadow-sm backdrop-blur-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
                    <BookOpen className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Snacks with a Story
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      SnacksStoryFlip
                    </span>
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                  Manage heritage story flip cards with origin stories, vintage years, and stone-ground ingredients. Syncs live with mobile home page via <code className="text-xs font-mono bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">AppConfigRepository().getStorySnacksStream()</code>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={restoreDefaultStorySnacks}
                  className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Restore Presets
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addStorySnack}
                  className="gap-1.5 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Story Snack
                </Button>
                <Button
                  onClick={() => {
                    handleSaveTab('story_snacks', { list: snackStories });
                    handleSaveTab('snacks_with_story', { list: snackStories });
                  }}
                  disabled={isSaving}
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Publishing Live...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Publish Story Snacks Live
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Snack Selector Tabs / Carousel Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                Story Cards ({snackStories.length}):
              </span>
              {snackStories.map((snack, idx) => {
                const isActive = idx === activeStoryIdx;
                return (
                  <button
                    key={snack.id || idx}
                    onClick={() => {
                      setActiveStoryIdx(idx);
                      setIsStoryFlipped(false);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-transparent shadow-md shadow-amber-500/20'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-semibold">{snack.name || `Snack #${idx + 1}`}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {snack.since ? `ESTD. ${snack.since}` : `₹${snack.price}`}
                    </span>
                  </button>
                );
              })}
              <button
                onClick={addStorySnack}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-amber-600 dark:text-amber-400 border border-dashed border-amber-500/40 hover:bg-amber-500/5 transition-all shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Snack
              </button>
            </div>

            {/* Main Two-Column Layout: Left = Editor, Right = Interactive 3D Flip Phone Preview */}
            {(() => {
              const cIdx = Math.min(activeStoryIdx, Math.max(0, snackStories.length - 1));
              const currentSnack = snackStories[cIdx] || {
                id: 'murukku',
                name: 'Kara Murukku',
                image: '',
                price: 129,
                story: '',
                since: '1985',
                ingredients: []
              };

              return (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Form Editor (xl:col-span-7) */}
                  <div className="xl:col-span-7 space-y-6">
                    {/* Card 1: Snack Identification & Heritage Metadata */}
                    <Card className="border-amber-500/20 shadow-sm">
                      <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">
                              {cIdx + 1}
                            </span>
                            <CardTitle className="text-base font-semibold">
                              Heritage Snack Details
                            </CardTitle>
                          </div>
                          <span className="text-xs font-mono text-slate-400">
                            doc_id: story_snacks → list[{cIdx}]
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Snack Name / Title <span className="text-red-500">*</span>
                            </label>
                            <Input
                              value={currentSnack.name || ''}
                              onChange={e => updateStorySnack(cIdx, 'name', e.target.value)}
                              placeholder="e.g. Kara Murukku, Khara Mixture"
                              className="font-medium"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Unique Identifier (id)
                            </label>
                            <Input
                              value={currentSnack.id || ''}
                              onChange={e => updateStorySnack(cIdx, 'id', e.target.value)}
                              placeholder="e.g. murukku, mixture"
                              className="font-mono text-xs"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <Input
                              type="number"
                              value={currentSnack.price ?? 129}
                              onChange={e => updateStorySnack(cIdx, 'price', Number(e.target.value) || 0)}
                              placeholder="129"
                              className="font-semibold"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Heritage Year / Since (Vintage)
                            </label>
                            <Input
                              value={currentSnack.since || ''}
                              onChange={e => updateStorySnack(cIdx, 'since', e.target.value)}
                              placeholder="e.g. 1985, 1992"
                            />
                            <p className="text-[10px] text-slate-400">Displays "ESTD. 1985" on card</p>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                              Quick Pick Product
                            </label>
                            <select
                              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs"
                              onChange={e => {
                                const selected = allProducts.find(p => p.name === e.target.value);
                                if (selected) {
                                  updateStorySnack(cIdx, 'name', selected.name);
                                  if (selected.price) updateStorySnack(cIdx, 'price', Number(selected.price));
                                  if (selected.image_url) updateStorySnack(cIdx, 'image', selected.image_url);
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">-- Autofill from catalog --</option>
                              {allProducts.map((p, pIdx) => (
                                <option key={p.id || pIdx} value={p.name}>
                                  {p.name} ({p.price ? `₹${p.price}` : ''})
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        {/* Hero Image */}
                        <div className="space-y-2 pt-2 border-t">
                          <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                            <span>Snack Hero Image (Front of Card)</span>
                            <span className="text-[11px] text-slate-400 font-normal">
                              Supports direct upload, CDN URL, or local asset path
                            </span>
                          </label>
                          <ImageUpload
                            value={currentSnack.image || ''}
                            onChange={url => updateStorySnack(cIdx, 'image', url)}
                            folder="story_snacks"
                          />
                          <div className="flex items-center gap-2">
                            <Input
                              value={currentSnack.image || ''}
                              onChange={e => updateStorySnack(cIdx, 'image', e.target.value)}
                              placeholder="assets/images/karam_janthukalu_murukku_strings_snack.jpg or https://..."
                              className="text-xs font-mono"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 2: The Heritage Craft Story Description */}
                    <Card className="border-amber-500/20 shadow-sm">
                      <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-base font-semibold flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-amber-500" />
                          Heritage Story Narrative (Back of Card)
                        </CardTitle>
                        <CardDescription className="text-xs">
                          The authentic story read by customers when they flip the card. Highlight family traditions, culinary origin, and grandmother's recipe.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-2">
                        <textarea
                          rows={4}
                          value={currentSnack.story || ''}
                          onChange={e => updateStorySnack(cIdx, 'story', e.target.value)}
                          placeholder="e.g. A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings..."
                          className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30 leading-relaxed font-sans"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>Characters: {(currentSnack.story || '').length}</span>
                          <span className="text-amber-600 dark:text-amber-400 font-medium">
                            Tip: 80 - 150 characters fits beautifully on mobile cards
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Card 3: Stone-Ground Ingredients Manager */}
                    <Card className="border-amber-500/20 shadow-sm">
                      <CardHeader className="pb-3 border-b">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                              <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                              Stone-Ground Ingredients ({(currentSnack.ingredients || []).length})
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Key wholesome ingredients shown with circle photo badges on the flipped heritage card.
                            </CardDescription>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addStoryIngredient(cIdx)}
                            className="gap-1 text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/10"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            + Add Ingredient
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-3">
                        {(!currentSnack.ingredients || currentSnack.ingredients.length === 0) ? (
                          <div className="text-center py-6 border border-dashed rounded-xl border-amber-500/20">
                            <p className="text-xs text-slate-500 mb-2">No ingredients added yet.</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addStoryIngredient(cIdx)}
                              className="text-xs gap-1"
                            >
                              <Plus className="w-3 h-3" /> Add First Ingredient
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {currentSnack.ingredients.map((ing, ingIdx) => (
                              <div
                                key={ingIdx}
                                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex flex-col sm:flex-row items-start sm:items-center gap-3"
                              >
                                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center justify-center shrink-0">
                                  {ingIdx + 1}
                                </span>

                                <div className="flex-1 w-full space-y-1">
                                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                                    Ingredient Name
                                  </label>
                                  <Input
                                    value={ing.name || ''}
                                    onChange={e => updateStoryIngredient(cIdx, ingIdx, 'name', e.target.value)}
                                    placeholder="e.g. Rice Flour, Urad Dal, Spices"
                                    className="h-8 text-xs font-medium"
                                  />
                                </div>

                                <div className="flex-1 w-full space-y-1">
                                  <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                                    <span>Image (Upload / Asset)</span>
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={ing.image || ''}
                                      onChange={e => updateStoryIngredient(cIdx, ingIdx, 'image', e.target.value)}
                                      placeholder="assets/images/... or url"
                                      className="h-8 text-xs font-mono"
                                    />
                                    <div className="w-8 h-8 rounded-full border border-amber-500/30 overflow-hidden shrink-0 bg-amber-500/10">
                                      <img
                                        src={getStoryDisplayImg(ing.image)}
                                        alt={ing.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = '/assets/images/garlic_0.png';
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => removeStoryIngredient(cIdx, ingIdx)}
                                  className="text-slate-400 hover:text-red-500 transition-colors p-1.5 self-end sm:self-center"
                                  title="Delete Ingredient"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Bottom Actions Row for Current Snack */}
                    <div className="flex items-center justify-between pt-2">
                      {snackStories.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeStorySnack(cIdx)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete This Story Snack
                        </Button>
                      ) : (
                        <div />
                      )}

                      <Button
                        onClick={() => {
                          handleSaveTab('story_snacks', { list: snackStories });
                          handleSaveTab('snacks_with_story', { list: snackStories });
                        }}
                        disabled={isSaving}
                        className="gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save & Publish Story Snacks
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Right Column: Interactive 3D Flip Card Mobile Simulation (xl:col-span-5) */}
                  <div className="xl:col-span-5 flex flex-col items-center">
                    <div className="w-full max-w-[370px] bg-slate-950 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
                      {/* Speaker / Camera Notch */}
                      <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

                      {/* Screen Container */}
                      <div className="bg-[#120805] text-slate-100 rounded-[28px] overflow-hidden border border-amber-950/60 p-4 relative min-h-[580px] flex flex-col justify-between select-none">
                        {/* Status Bar */}
                        <div className="flex justify-between items-center text-[10px] text-amber-200/60 mb-2 font-mono">
                          <span>09:41</span>
                          <span className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Stream
                          </span>
                        </div>

                        {/* Section Header inside App */}
                        <div className="text-center mb-4 space-y-1">
                          <span className="inline-block text-[9px] font-bold tracking-widest uppercase text-amber-400 bg-amber-950/60 border border-amber-800/40 px-2.5 py-0.5 rounded-full">
                            HANDCRAFTED HERITAGE
                          </span>
                          <h3 className="text-lg font-serif font-bold text-amber-100 tracking-wide">
                            Snacks with a Story
                          </h3>
                          <p className="text-[10px] text-amber-200/70 max-w-[240px] mx-auto leading-tight">
                            Flip to discover authentic grandmother recipes & stone-ground craft.
                          </p>
                        </div>

                        {/* 3D Flip Card Container */}
                        <div
                          className="relative w-full h-[380px] cursor-pointer group"
                          style={{ perspective: '1000px' }}
                          onClick={() => setIsStoryFlipped(!isStoryFlipped)}
                          title="Click anywhere to flip the card!"
                        >
                          <div
                            className="w-full h-full relative duration-700 transition-transform"
                            style={{
                              transformStyle: 'preserve-3d',
                              transform: isStoryFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {/* FRONT FACE (Photo, Price, Estd, Title) */}
                            <div
                              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-amber-500/30 shadow-xl flex flex-col justify-between p-4 bg-slate-900"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                              }}
                            >
                              {/* Background Image */}
                              <img
                                src={getStoryDisplayImg(currentSnack.image)}
                                alt={currentSnack.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/assets/images/chakralu.png';
                                }}
                              />
                              {/* Dark Gradient Overlay for Readability */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />

                              {/* Front Top Row */}
                              <div className="relative z-10 flex items-center justify-between">
                                <span className="bg-amber-900/80 backdrop-blur-md text-amber-200 border border-amber-400/40 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">
                                  ESTD. {currentSnack.since || '1985'}
                                </span>
                                <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                                  ₹{currentSnack.price || 129}
                                </span>
                              </div>

                              {/* Front Bottom Content */}
                              <div className="relative z-10 space-y-2">
                                <div>
                                  <h4 className="text-xl font-serif font-bold text-white drop-shadow-md">
                                    {currentSnack.name || 'Kara Murukku'}
                                  </h4>
                                  <p className="text-[11px] text-amber-200/80 line-clamp-1">
                                    {(currentSnack.ingredients || []).map(i => i.name).join(' · ') || 'Authentic stone-ground recipe'}
                                  </p>
                                </div>

                                <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                                  <span className="text-[10px] text-amber-300 font-medium flex items-center gap-1 group-hover:underline">
                                    <RotateCcw className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                                    Tap to Read Heritage Story ↷
                                  </span>
                                  <span className="text-[9px] bg-white/20 text-white px-2 py-0.5 rounded-full">
                                    Flip Card
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* BACK FACE (Warm Parchment / Heritage Narrative & Ingredients) */}
                            <div
                              className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl p-4 flex flex-col justify-between bg-gradient-to-br from-[#2b140d] via-[#1f0d08] to-[#120704] text-amber-100"
                              style={{
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                                transform: 'rotateY(180deg)',
                              }}
                            >
                              {/* Subtle Ornate Heritage Border Corners */}
                              <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-amber-400/40" />
                              <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-amber-400/40" />
                              <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-amber-400/40" />
                              <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-amber-400/40" />

                              {/* Back Top Header */}
                              <div>
                                <div className="flex items-center justify-between border-b border-amber-500/20 pb-2 mb-2">
                                  <span className="text-[9px] uppercase tracking-widest font-bold text-amber-400">
                                    THE HERITAGE CRAFT
                                  </span>
                                  <span className="text-[10px] font-mono text-amber-300/70">
                                    Since {currentSnack.since || '1985'}
                                  </span>
                                </div>
                                <h4 className="text-base font-serif font-bold text-amber-100">
                                  {currentSnack.name || 'Kara Murukku'}
                                </h4>
                                <p className="text-[11px] leading-relaxed text-amber-200/90 font-serif italic mt-1 line-clamp-4">
                                  "{currentSnack.story || 'A crispy spiral snack made from rice flour and urad dal, prepared in our family kitchen for festive evenings.'}"
                                </p>
                              </div>

                              {/* Back Middle: Stone-Ground Ingredients Avatars */}
                              <div className="space-y-1.5 my-auto">
                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80 block">
                                  Stone-Ground Ingredients:
                                </span>
                                <div className="flex items-center justify-start gap-2.5 overflow-x-auto pb-1">
                                  {(currentSnack.ingredients || []).slice(0, 4).map((ing, iIdx) => (
                                    <div key={iIdx} className="flex flex-col items-center shrink-0 w-14">
                                      <div className="w-10 h-10 rounded-full border-2 border-amber-400/60 overflow-hidden shadow-md bg-amber-950">
                                        <img
                                          src={getStoryDisplayImg(ing.image)}
                                          alt={ing.name}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/assets/images/curry_leaves_0.png';
                                          }}
                                        />
                                      </div>
                                      <span className="text-[9px] text-amber-200/90 text-center font-medium mt-1 truncate w-full">
                                        {ing.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Back Bottom CTA Bar */}
                              <div className="pt-2 border-t border-amber-500/20 flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] text-amber-300/60 uppercase block">Price</span>
                                  <span className="text-sm font-bold text-white">
                                    ₹{currentSnack.price || 129}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all">
                                  <ShoppingBag className="w-3.5 h-3.5" />
                                  <span>Add to Box</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Flip Card Switcher Button below simulation */}
                        <div className="mt-3 pt-2 border-t border-amber-950/80 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setIsStoryFlipped(!isStoryFlipped)}
                            className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            {isStoryFlipped ? 'Show Front Photo' : 'Show Story & Ingredients'}
                          </button>
                          <span className="text-[10px] text-amber-300/50">
                            Card {cIdx + 1} of {snackStories.length}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Live Stream Sync Note below phone */}
                    <div className="mt-3 text-center space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live Stream: AppConfigRepository().getStorySnacksStream()
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Changes published here update live on the mobile home page instantly.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>
          {/* AUTO BANNER CAROUSEL (AutoBannerCarousel / auto_banners) */}
          <TabsContent value="banners" className="mt-0 space-y-6">
            {/* Header / Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/20 shadow-sm backdrop-blur-md">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Layers className="w-5 h-5" />
                  </span>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    Auto Banner Carousel
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      AutoBannerCarousel
                    </span>
                  </h2>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
                  Manage dynamic rotating hero banners at the very top of the mobile home page. Subscribes live to <code className="text-xs font-mono bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded">AppConfigRepository().getAutoBannersStream()</code>.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={restoreDefaultAutoBanners}
                  className="gap-1.5 text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  Restore Presets
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addAutoBanner}
                  className="gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/10"
                >
                  <Plus className="w-3.5 h-3.5" />
                  + Add Auto Banner
                </Button>
                <Button
                  onClick={() => {
                    handleSaveTab('auto_banners', { banners: autoBanners });
                    const legacyMain = autoBanners.map(b => ({
                      title: b.title || '',
                      category: b.link?.category || '',
                      image: b.image || ''
                    }));
                    handleSaveTab('banners', { main_banners: legacyMain, ad_banners: adBanners });
                  }}
                  disabled={isSaving}
                  size="sm"
                  className="gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Publishing Live...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Publish Banners Live
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Sub-Tabs: Auto Banner Carousel vs Secondary Ad Banners */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-2">
              <button
                type="button"
                onClick={() => setBannerSubTab('carousel')}
                className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
                  bannerSubTab === 'carousel'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-4 h-4" />
                Auto Banner Carousel ({autoBanners.length})
                <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                  Live Stream
                </span>
              </button>
              <button
                type="button"
                onClick={() => setBannerSubTab('ad_banners')}
                className={`py-2 px-4 text-xs font-semibold rounded-t-lg transition-colors border-b-2 flex items-center gap-2 ${
                  bannerSubTab === 'ad_banners'
                    ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Box className="w-4 h-4" />
                Secondary Ad Banners ({adBanners.length})
              </button>
            </div>

            {bannerSubTab === 'carousel' ? (
              <div className="space-y-6">
                {/* Horizontal Carousel Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                    Carousel Slides ({autoBanners.length}):
                  </span>
                  {autoBanners.map((banner, idx) => {
                    const isActive = idx === activeBannerIdx;
                    return (
                      <button
                        key={banner.id || idx}
                        onClick={() => setActiveBannerIdx(idx)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 border ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md shadow-emerald-500/20'
                            : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isActive ? 'bg-white/20 text-white' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="font-semibold">
                          {banner.link?.category || banner.title || `Banner #${idx + 1}`}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                        }`}>
                          {banner.id || `b${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                  <button
                    onClick={addAutoBanner}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-dashed border-emerald-500/40 hover:bg-emerald-500/5 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Banner
                  </button>
                </div>

                {/* Two-Column Layout */}
                {(() => {
                  const bIdx = Math.min(activeBannerIdx, Math.max(0, autoBanners.length - 1));
                  const currentBanner = autoBanners[bIdx] || {
                    id: 'b1',
                    image: 'assets/images/banner_1.jpg',
                    link: { category: 'Pickles' },
                    title: 'Heritage Pickles',
                    subtitle: 'Sun-dried spices & cold-pressed oil'
                  };

                  return (
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                      {/* Left Column: Form Editor (xl:col-span-7) */}
                      <div className="xl:col-span-7 space-y-6">
                        <Card className="border-emerald-500/20 shadow-sm">
                          <CardHeader className="pb-3 border-b">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xs font-bold">
                                  {bIdx + 1}
                                </span>
                                <CardTitle className="text-base font-semibold">
                                  Banner Configuration
                                </CardTitle>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveAutoBanner(bIdx, 'up')}
                                  disabled={bIdx === 0}
                                  className="h-7 px-2 text-xs"
                                  title="Move Up"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => moveAutoBanner(bIdx, 'down')}
                                  disabled={bIdx === autoBanners.length - 1}
                                  className="h-7 px-2 text-xs"
                                  title="Move Down"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </Button>
                                <span className="text-xs font-mono text-slate-400 ml-2">
                                  doc_id: auto_banners → banners[{bIdx}]
                                </span>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Banner ID <span className="text-red-500">*</span>
                                </label>
                                <Input
                                  value={currentBanner.id || ''}
                                  onChange={e => updateAutoBanner(bIdx, 'id', e.target.value)}
                                  placeholder="e.g. b1, b2, b3"
                                  className="font-mono text-xs"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Category Navigation Link <span className="text-red-500">*</span>
                                </label>
                                <select
                                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-xs font-medium"
                                  value={currentBanner.link?.category || 'Pickles'}
                                  onChange={e => updateAutoBannerLink(bIdx, 'category', e.target.value)}
                                >
                                  <option value="Pickles">Pickles (Avakaya & Chutneys)</option>
                                  <option value="Powders">Powders (Karam Podis & Masalas)</option>
                                  <option value="Sweets">Sweets (Sunnunda & Traditional)</option>
                                  <option value="Snacks">Snacks (Murukku & Mixtures)</option>
                                  <option value="Combos">Combos & Pairings</option>
                                  <option value="Gifting">Royal Festive Gifting</option>
                                  <option value="All">All Products</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Banner Title / Header Text
                                </label>
                                <Input
                                  value={currentBanner.title || ''}
                                  onChange={e => updateAutoBanner(bIdx, 'title', e.target.value)}
                                  placeholder="e.g. Heritage Pickles, Stone-Ground Podis"
                                  className="font-medium"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Banner Subtitle / Tagline
                                </label>
                                <Input
                                  value={currentBanner.subtitle || ''}
                                  onChange={e => updateAutoBanner(bIdx, 'subtitle', e.target.value)}
                                  placeholder="e.g. Sun-dried spices & cold-pressed oil"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Specific Tag Filter (Optional)
                                </label>
                                <Input
                                  value={currentBanner.link?.tag || ''}
                                  onChange={e => updateAutoBannerLink(bIdx, 'tag', e.target.value)}
                                  placeholder="e.g. bestseller, festive, new_harvest"
                                  className="text-xs font-mono"
                                />
                              </div>

                              <div className="space-y-1.5">
                                <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                  Custom Target URL / Route (Optional)
                                </label>
                                <Input
                                  value={currentBanner.link?.url || ''}
                                  onChange={e => updateAutoBannerLink(bIdx, 'url', e.target.value)}
                                  placeholder="e.g. /category/pickles or https://..."
                                  className="text-xs font-mono"
                                />
                              </div>
                            </div>

                            {/* Banner Image Upload */}
                            <div className="space-y-2 pt-2 border-t">
                              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between">
                                <span>Banner Hero Graphic</span>
                                <span className="text-[11px] text-slate-400 font-normal">
                                  Direct upload, Cloudinary URL, or local asset (e.g. assets/images/banner_1.jpg)
                                </span>
                              </label>
                              <ImageUpload
                                value={currentBanner.image || ''}
                                onChange={url => updateAutoBanner(bIdx, 'image', url)}
                                folder="auto_banners"
                              />
                              <div className="flex items-center gap-2">
                                <Input
                                  value={currentBanner.image || ''}
                                  onChange={e => updateAutoBanner(bIdx, 'image', e.target.value)}
                                  placeholder="assets/images/banner_1.jpg or https://..."
                                  className="text-xs font-mono"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Bottom Actions Row */}
                        <div className="flex items-center justify-between pt-2">
                          {autoBanners.length > 1 ? (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAutoBanner(bIdx)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 text-xs"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete This Banner
                            </Button>
                          ) : (
                            <div />
                          )}

                          <Button
                            onClick={() => {
                              handleSaveTab('auto_banners', { banners: autoBanners });
                              const legacyMain = autoBanners.map(b => ({
                                title: b.title || '',
                                category: b.link?.category || '',
                                image: b.image || ''
                              }));
                              handleSaveTab('banners', { main_banners: legacyMain, ad_banners: adBanners });
                            }}
                            disabled={isSaving}
                            className="gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-sm"
                          >
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Publishing...
                              </>
                            ) : (
                              <>
                                <Save className="w-4 h-4" />
                                Save & Publish Auto Banners
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Right Column: Live Mobile Simulation (xl:col-span-5) */}
                      <div className="xl:col-span-5 flex flex-col items-center">
                        <div className="w-full max-w-[370px] bg-slate-950 p-4 rounded-[40px] shadow-2xl border-4 border-slate-800 relative">
                          {/* Speaker / Camera Notch */}
                          <div className="w-28 h-4 bg-slate-800 rounded-full mx-auto mb-3" />

                          {/* Screen Container */}
                          <div className="bg-[#100705] text-slate-100 rounded-[28px] overflow-hidden border border-amber-950/60 p-4 relative min-h-[560px] flex flex-col justify-between select-none">
                            {/* Status Bar */}
                            <div className="flex justify-between items-center text-[10px] text-amber-200/60 mb-2 font-mono">
                              <span>09:41</span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Live Carousel Stream
                              </span>
                            </div>

                            {/* Mobile Header Bar */}
                            <div className="mb-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-[10px] text-amber-400 font-bold tracking-wider uppercase block">
                                    Adhvaitha Kitchens
                                  </span>
                                  <h4 className="text-sm font-serif font-bold text-white">
                                    Heritage Flavors
                                  </h4>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="w-6 h-6 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-[10px]">
                                    🔍
                                  </span>
                                  <span className="w-6 h-6 rounded-full bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-[10px]">
                                    🛍️
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Auto Banner Carousel Mobile Component Simulation */}
                            <div className="my-auto space-y-2">
                              <div className="relative w-full h-[190px] rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-xl group">
                                {/* Banner Image */}
                                <img
                                  src={getBannerDisplayImg(currentBanner.image, currentBanner.link?.category)}
                                  alt={currentBanner.title || 'Banner'}
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/assets/images/avakaya_pickle.png';
                                  }}
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

                                {/* Category Tag Pill */}
                                <div className="absolute top-3 left-3 z-10">
                                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
                                    {currentBanner.link?.category || 'FEATURED'}
                                  </span>
                                </div>

                                {/* Banner ID pill */}
                                <div className="absolute top-3 right-3 z-10">
                                  <span className="bg-black/50 backdrop-blur-md text-amber-200 border border-amber-400/30 text-[9px] font-mono px-2 py-0.5 rounded-full">
                                    {currentBanner.id || `b${bIdx + 1}`}
                                  </span>
                                </div>

                                {/* Banner Bottom Content */}
                                <div className="absolute bottom-3 left-3 right-3 z-10 space-y-1">
                                  <h4 className="text-base font-serif font-bold text-white drop-shadow-md leading-tight">
                                    {currentBanner.title || 'Authentic Andhra Heritage'}
                                  </h4>
                                  <p className="text-[10px] text-amber-200/90 line-clamp-1 leading-snug">
                                    {currentBanner.subtitle || 'Handcrafted fresh in small batches'}
                                  </p>
                                  <div className="pt-1 flex items-center justify-between">
                                    <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1 group-hover:underline">
                                      Explore {currentBanner.link?.category || 'Collection'} →
                                    </span>
                                  </div>
                                </div>

                                {/* Interactive Navigation Arrows */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveBannerIdx((bIdx - 1 + autoBanners.length) % autoBanners.length);
                                  }}
                                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-all z-20"
                                  title="Previous Banner"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveBannerIdx((bIdx + 1) % autoBanners.length);
                                  }}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition-all z-20"
                                  title="Next Banner"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Dot Indicators */}
                              <div className="flex items-center justify-center gap-1.5 pt-1">
                                {autoBanners.map((_, dotIdx) => (
                                  <button
                                    key={dotIdx}
                                    type="button"
                                    onClick={() => setActiveBannerIdx(dotIdx)}
                                    className={`transition-all duration-300 rounded-full ${
                                      dotIdx === bIdx
                                        ? 'w-6 h-1.5 bg-amber-400 shadow-sm shadow-amber-400/50'
                                        : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/60'
                                    }`}
                                    title={`Slide ${dotIdx + 1}`}
                                  />
                                ))}
                              </div>
                            </div>

                            {/* Section below carousel in app preview */}
                            <div className="mt-auto space-y-2 pt-2 border-t border-amber-950/70">
                              <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold block">
                                Quick Heritage Categories
                              </span>
                              <div className="grid grid-cols-4 gap-1.5 text-center">
                                {['Pickles', 'Powders', 'Sweets', 'Snacks'].map((cat, cI) => (
                                  <div
                                    key={cI}
                                    className={`p-1.5 rounded-xl border text-[9px] font-medium transition-all ${
                                      currentBanner.link?.category?.toLowerCase() === cat.toLowerCase()
                                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                                        : 'bg-white/5 border-white/10 text-white/70'
                                    }`}
                                  >
                                    {cat}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Live Stream Sync Note */}
                        <div className="mt-3 text-center space-y-1">
                          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Live Stream: AppConfigRepository().getAutoBannersStream()
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Publishing changes updates the hero carousel live across all mobile users.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* Secondary Ad Banners Editor */
              <Card>
                <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                  <div>
                    <CardTitle className="text-base font-semibold">Secondary Promotional Ad Banners</CardTitle>
                    <CardDescription className="text-xs">
                      Mid-page promotional cards for campaigns, flash sales, and special offers.
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addToArray(setAdBanners, { tag: '', title: '', sub: '', img: '' })}
                    className="gap-1 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Ad Banner
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  {adBanners.length === 0 ? (
                    <div className="text-center py-6 border border-dashed rounded-xl border-slate-200 dark:border-slate-800">
                      <p className="text-xs text-slate-500 mb-2">No promotional ad banners configured.</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addToArray(setAdBanners, { tag: 'MEGA DEAL', title: 'Summer Festival Sale', sub: 'Up to 25% off heritage gift boxes', img: 'assets/images/banner_2.jpg' })}
                        className="text-xs"
                      >
                        + Add Demo Ad Banner
                      </Button>
                    </div>
                  ) : (
                    adBanners.map((banner, idx) => (
                      <div key={idx} className="flex gap-4 items-center p-3 border rounded-xl bg-slate-50/50 dark:bg-slate-900/40">
                        <div className="flex-1 space-y-2">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Tag (e.g. MEGA DEAL)"
                              value={banner.tag}
                              onChange={e => updateArray(setAdBanners, idx, 'tag', e.target.value)}
                              className="w-1/3 text-xs"
                            />
                            <Input
                              placeholder="Title (e.g. Summer Festival Sale)"
                              value={banner.title}
                              onChange={e => updateArray(setAdBanners, idx, 'title', e.target.value)}
                              className="w-2/3 text-xs font-medium"
                            />
                          </div>
                          <Input
                            placeholder="Subtitle (e.g. Up to 25% off heritage gift boxes)"
                            value={banner.sub}
                            onChange={e => updateArray(setAdBanners, idx, 'sub', e.target.value)}
                            className="text-xs"
                          />
                          <ImageUpload
                            value={banner.img}
                            onChange={url => updateArray(setAdBanners, idx, 'img', url)}
                            folder="app_content"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2"
                          onClick={() => removeFromArray(setAdBanners, idx)}
                          title="Delete Ad Banner"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* STORIES */}
          <TabsContent value="stories" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Stories / Quick Links</CardTitle><CardDescription>Circle icons (e.g., auto_stories, card_giftcard)</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setStories, { label: '', icon: '', tag: '' })}>+ Add Story</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {stories.map((story, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <Input placeholder="Label" value={story.label} onChange={e => updateArray(setStories, idx, 'label', e.target.value)} />
                      <Input placeholder="Icon Name" value={story.icon} onChange={e => updateArray(setStories, idx, 'icon', e.target.value)} />
                      <Input placeholder="Tag (URL/Route)" value={story.tag} onChange={e => updateArray(setStories, idx, 'tag', e.target.value)} />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setStories, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* BENTO SELECTION */}
          <TabsContent value="bento" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Bento Selection</CardTitle>
                <CardDescription>Today's featured grid selection settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Section Title</label>
                    <Input value={bento.section_title} onChange={e => setBento({...bento, section_title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Best Seller Product (Exact Name)</label>
                    <Input value={bento.best_seller_product} onChange={e => setBento({...bento, best_seller_product: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 1 Label</label>
                    <Input value={bento.card1_label} onChange={e => setBento({...bento, card1_label: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 2 Label</label>
                    <Input value={bento.card2_label} onChange={e => setBento({...bento, card2_label: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 2 Sub</label>
                    <Input value={bento.card2_sub} onChange={e => setBento({...bento, card2_sub: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 2 Icon</label>
                    <Input value={bento.card2_icon} onChange={e => setBento({...bento, card2_icon: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 3 Label</label>
                    <Input value={bento.card3_label} onChange={e => setBento({...bento, card3_label: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 3 Sub</label>
                    <Input value={bento.card3_sub} onChange={e => setBento({...bento, card3_sub: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 3 Icon</label>
                    <Input value={bento.card3_icon} onChange={e => setBento({...bento, card3_icon: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Page Hero Banner</CardTitle>
                <CardDescription>Configure the featured collection banner at the top of the Categories page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tag / Label</label>
                    <Input 
                      placeholder="e.g. FEATURED COLLECTION" 
                      value={categoryPageConfig.hero_tag} 
                      onChange={e => setCategoryPageConfig({ ...categoryPageConfig, hero_tag: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hero Title</label>
                    <Input 
                      placeholder="e.g. The Royal Summer Festival" 
                      value={categoryPageConfig.hero_title} 
                      onChange={e => setCategoryPageConfig({ ...categoryPageConfig, hero_title: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Hero Subtitle</label>
                    <Input 
                      placeholder="e.g. Authentic sun-dried mango delicacies" 
                      value={categoryPageConfig.hero_subtitle} 
                      onChange={e => setCategoryPageConfig({ ...categoryPageConfig, hero_subtitle: e.target.value })} 
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium">Hero Image</label>
                    <ImageUpload 
                      value={categoryPageConfig.hero_image} 
                      onChange={url => setCategoryPageConfig({ ...categoryPageConfig, hero_image: url })} 
                      folder="app_content" 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Category Parent Ad Banners</CardTitle>
                  <CardDescription>Manage the top carousel ad banners for the Shop / Categories section.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCategoryParentCards, { img: '' })}>
                  + Add Ad Banner
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryParentCards.map((cat, pIdx) => (
                  <div key={pIdx} className="p-6 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 relative">
                    <Button variant="destructive" size="icon" className="absolute top-4 right-4 h-8 w-8" onClick={() => removeFromArray(setCategoryParentCards, pIdx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <h4 className="text-lg font-bold mb-4">Ad Banner {pIdx + 1}</h4>
                    <div className="space-y-2 max-w-md">
                      <label className="text-sm font-medium">Banner Image (No Text Overlay)</label>
                      <ImageUpload value={cat.img || ''} onChange={url => updateArray(setCategoryParentCards, pIdx, 'img', url)} folder="app_content" />
                    </div>
                  </div>
                ))}
                {categoryParentCards.length === 0 && (
                  <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                    No parent ad banners configured yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Categories & Product Listing Banners</CardTitle><CardDescription>Manage Category Banners, Titles, Descriptions, and Subtitles dynamically</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCategories, { label: '', img: '', tag: '', title_line_1: '', title_line_2: '', description: '', subtitle: '' })}>+ Add Category</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex flex-col gap-4 p-4 border rounded bg-white dark:bg-slate-900 relative">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-red-500 h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => removeFromArray(setCategories, idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pr-10">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category Label (System)</label>
                        <Input placeholder="e.g. Snacks" value={cat.label || ''} onChange={e => updateArray(setCategories, idx, 'label', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Top Tag</label>
                        <Input placeholder="e.g. CRISPY HERITAGE DELIGHTS" value={cat.tag || ''} onChange={e => updateArray(setCategories, idx, 'tag', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title Line 1</label>
                        <Input placeholder="e.g. Traditional\n" value={cat.title_line_1 || ''} onChange={e => updateArray(setCategories, idx, 'title_line_1', e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Title Line 2</label>
                        <Input placeholder="e.g. Indian Snacks" value={cat.title_line_2 || ''} onChange={e => updateArray(setCategories, idx, 'title_line_2', e.target.value)} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Subtitle (Bottom text)</label>
                        <Input placeholder="e.g. Traditional Bites, Timeless Taste" value={cat.subtitle || ''} onChange={e => updateArray(setCategories, idx, 'subtitle', e.target.value)} />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Description</label>
                        <textarea 
                          className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-transparent px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 min-h-[60px]"
                          placeholder="e.g. Authentic flavors crafted with love and tradition." 
                          value={cat.description || ''} 
                          onChange={e => updateArray(setCategories, idx, 'description', e.target.value)} 
                        />
                      </div>
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Category Banner Image</label>
                        <ImageUpload value={cat.img || ''} onChange={url => updateArray(setCategories, idx, 'img', url)} folder="app_content" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DEALS OF THE DAY */}
          <TabsContent value="deals" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Deals of the Day</CardTitle>
                <CardDescription>Configure the dynamic deals section on the home page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Section Title</label>
                  <Input 
                    placeholder="e.g., DEALS OF THE DAY" 
                    value={deals.title} 
                    onChange={e => setDeals({ ...deals, title: e.target.value })} 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deal Expiry Time</label>
                  <Input 
                    type="datetime-local" 
                    value={deals.end_time || ''} 
                    onChange={e => setDeals({ ...deals, end_time: e.target.value })} 
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Selected Products</label>
                    <span className="text-xs text-slate-500">{deals.product_names.length} selected</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                    {productNames.map(name => (
                      <label key={name} className="flex items-center space-x-2 border p-2 rounded cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <input 
                          type="checkbox" 
                          checked={deals.product_names.includes(name)}
                          onChange={(e) => {
                            const newProducts = e.target.checked 
                              ? [...deals.product_names, name]
                              : deals.product_names.filter(p => p !== name);
                            setDeals({ ...deals, product_names: newProducts });
                          }}
                          className="rounded border-slate-300 w-4 h-4 text-orange-600 focus:ring-orange-600"
                        />
                        <span className="text-sm line-clamp-1">{name}</span>
                      </label>
                    ))}
                  </div>
                  {productNames.length === 0 && (
                    <p className="text-sm text-slate-500 italic p-4 border rounded bg-slate-50 dark:bg-slate-900">No products found. Please add products first.</p>
                  )}
                  {deals.product_names.length < 3 && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-semibold text-amber-800">Minimum 3 Products Required</h4>
                        <p className="text-xs text-amber-700 mt-0.5">You have selected fewer than 3 products. The app will automatically fill the remaining slots with random products to maintain the "minimum three" UI design rule.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COUPONS */}
          <TabsContent value="coupons" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Home Page Coupons / Privileges</CardTitle>
                  <CardDescription>Manage the media-only coupon cards displayed on the home page.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCoupons, { type: 'image', image: '' })}>+ Add Coupon Card</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {coupons.map((coupon, idx) => (
                  <div key={idx} className="flex flex-col gap-4 p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 relative">
                    <Button variant="ghost" className="absolute top-2 right-2 text-red-500 h-8 w-8 hover:bg-red-50 dark:hover:bg-red-950/50" onClick={() => removeFromArray(setCoupons, idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-10">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Media Type</label>
                        <select 
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={coupon.type || 'image'} 
                          onChange={e => {
                            const newType = e.target.value as 'image' | 'video';
                            const n = [...coupons];
                            n[idx] = { type: newType, image: coupon.image || '', video_url: coupon.video_url || '' };
                            setCoupons(n);
                          }}
                        >
                          <option value="image">Image Card</option>
                          <option value="video">Video Card</option>
                        </select>
                      </div>
                      
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium">Upload Media (No Text Overlays)</label>
                        {(!coupon.type || coupon.type === 'image') ? (
                          <ImageUpload value={coupon.image || ''} onChange={url => updateArray(setCoupons, idx, 'image', url)} folder="app_content" />
                        ) : (
                          <VideoUpload value={coupon.video_url || ''} onChange={url => updateArray(setCoupons, idx, 'video_url', url)} />
                        )}
                        <p className="text-xs text-slate-500">The app displays only the raw media (image or video) with zero text overlays, so all design/text must be baked into your uploaded media file.</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* PACKAGING */}
          <TabsContent value="packaging" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Royal Packaging Gallery</CardTitle><CardDescription>Images showcasing your packaging</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setPackaging, { title: '', desc: '', img: '' })}>+ Add Packaging</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {packaging.map((pkg, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Title" value={pkg.title} onChange={e => updateArray(setPackaging, idx, 'title', e.target.value)} className="w-1/3" />
                        <Input placeholder="Description" value={pkg.desc} onChange={e => updateArray(setPackaging, idx, 'desc', e.target.value)} className="w-2/3" />
                      </div>
                      <ImageUpload value={pkg.img} onChange={url => updateArray(setPackaging, idx, 'img', url)} folder="app_content" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setPackaging, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ONBOARDING */}
          <TabsContent value="onboarding" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Onboarding Steps</CardTitle><CardDescription>App introduction screens</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setOnboardingSteps, { title: '', subtitle: '', desc: '', img: '', overlay: '' })}>+ Add Step</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {onboardingSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Title" value={step.title} onChange={e => updateArray(setOnboardingSteps, idx, 'title', e.target.value)} className="w-1/2" />
                        <Input placeholder="Subtitle" value={step.subtitle} onChange={e => updateArray(setOnboardingSteps, idx, 'subtitle', e.target.value)} className="w-1/2" />
                      </div>
                      <Input placeholder="Description" value={step.desc} onChange={e => updateArray(setOnboardingSteps, idx, 'desc', e.target.value)} />
                      <Input placeholder="Overlay Text (Optional)" value={step.overlay || ''} onChange={e => updateArray(setOnboardingSteps, idx, 'overlay', e.target.value)} />
                      <ImageUpload value={step.img} onChange={url => updateArray(setOnboardingSteps, idx, 'img', url)} folder="app_content" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setOnboardingSteps, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Taste Options</CardTitle><CardDescription>Flavor profiles (e.g. eco, balance, whatshot)</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setTasteOptions, { title: '', sub: '', icon: '', color: '' })}>+ Add Taste</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {tasteOptions.map((taste, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input placeholder="Title" value={taste.title} onChange={e => updateArray(setTasteOptions, idx, 'title', e.target.value)} />
                      <Input placeholder="Subtitle" value={taste.sub} onChange={e => updateArray(setTasteOptions, idx, 'sub', e.target.value)} />
                      <Input placeholder="Icon Name (e.g. eco)" value={taste.icon} onChange={e => updateArray(setTasteOptions, idx, 'icon', e.target.value)} />
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded border shrink-0">
                          <input 
                            type="color" 
                            title="Pick a color"
                            value={taste.color?.startsWith('0xFF') ? '#' + taste.color.slice(4) : (taste.color?.startsWith('#') ? taste.color : '#000000')} 
                            onChange={e => updateArray(setTasteOptions, idx, 'color', '0xFF' + e.target.value.slice(1).toUpperCase())} 
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                        <Input placeholder="Color Hex (e.g. 0xFF18453B)" value={taste.color} onChange={e => updateArray(setTasteOptions, idx, 'color', e.target.value)} />
                      </div>
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setTasteOptions, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* ART OF PAIRING */}
          <TabsContent value="pairings" className="mt-0">
            {pairings.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>The Art of Pairing (Curated Combos)</CardTitle>
                  <CardDescription>No pairing combos configured. Restore authentic defaults to start.</CardDescription>
                </CardHeader>
                <CardContent className="py-12 text-center space-y-4">
                  <UtensilsCrossed className="h-12 w-12 mx-auto text-rose-500/70" />
                  <p className="text-sm text-slate-500">Initialize with the 3 authentic curated combos (Breakfast, Evening Tea, After Meals).</p>
                  <Button onClick={restoreDefaultPairings} className="bg-rose-600 hover:bg-rose-700 text-white">
                    <Sparkles className="h-4 w-4 mr-2" /> Restore 3 Authentic Presets
                  </Button>
                </CardContent>
              </Card>
            ) : (() => {
              const currentCombo = pairings[activeComboIndex] || pairings[0];
              const curColors = currentCombo.colors && currentCombo.colors.length >= 3 
                ? currentCombo.colors 
                : ['#5C0A0D', '#7A0F12', '#9B1D22'];

              return (
                <div className="space-y-6">
                  {/* Top Bar with Combo Switcher */}
                  <Card className="border-slate-200 dark:border-slate-800">
                    <CardHeader className="pb-3 border-b">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <UtensilsCrossed className="h-5 w-5 text-rose-600" />
                            <CardTitle className="text-xl">The Art of Pairing (Curated Combos)</CardTitle>
                            <span className="text-[10px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Live Stream Sync
                            </span>
                          </div>
                          <CardDescription className="mt-1">
                            Manage hero pairing combos, dual circular product images, 3-color linear gradients, and 'Pairs Well With' sub-cards.
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap shrink-0">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={restoreDefaultPairings}
                            className="text-xs text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                          >
                            <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-500" />
                            Restore Presets
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addNewCombo}
                            className="text-xs text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800 bg-rose-50/50 dark:bg-rose-950/30"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1" />
                            Add Combo
                          </Button>
                          <Button 
                            size="sm"
                            disabled={isSaving}
                            onClick={() => handleSaveTab('pairings', { list: pairings })}
                            className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm text-xs"
                          >
                            <Sparkles className="h-3.5 w-3.5 mr-1" />
                            {isSaving ? 'Publishing...' : 'Publish Pairings Live'}
                          </Button>
                        </div>
                      </div>

                      {/* Combo Switcher Pills */}
                      <div className="flex items-center gap-2 pt-3 overflow-x-auto custom-scrollbar">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 shrink-0 mr-1">
                          Combos ({pairings.length}):
                        </span>
                        {pairings.map((c, idx) => {
                          const isActive = idx === activeComboIndex;
                          const cColors = c.colors && c.colors.length >= 3 ? c.colors : ['#5C0A0D', '#7A0F12', '#9B1D22'];
                          return (
                            <button
                              key={c.id || idx}
                              type="button"
                              onClick={() => setActiveComboIndex(idx)}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 border ${
                                isActive 
                                  ? 'bg-white dark:bg-slate-900 border-rose-500 text-rose-700 dark:text-rose-300 shadow-sm ring-2 ring-rose-500/20' 
                                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                              }`}
                            >
                              <span 
                                className="h-3 w-3 rounded-full border border-white/50 shrink-0 shadow-xs"
                                style={{
                                  background: `linear-gradient(135deg, ${cColors[0]}, ${cColors[1]}, ${cColors[2]})`
                                }}
                              />
                              <span className="font-bold">{c.kicker || `COMBO #${idx + 1}`}</span>
                              <span className="text-slate-400 font-normal truncate max-w-[120px]">
                                {c.title || 'Untitled'}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Main Two-Column Layout */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                    {/* LEFT COLUMN: HERO COMBO & SUB-PAIRS SETTINGS (7 cols) */}
                    <div className="xl:col-span-7 space-y-6">
                      {/* 1. HERO COMBO CARD */}
                      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-3 border-b bg-slate-50/70 dark:bg-slate-900/40 flex flex-row items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span 
                              className="h-4 w-4 rounded-full border border-white/60 shadow-xs shrink-0"
                              style={{
                                background: `linear-gradient(135deg, ${curColors[0]}, ${curColors[1]}, ${curColors[2]})`
                              }}
                            />
                            <div>
                              <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                                Hero Combo #{activeComboIndex + 1}: {currentCombo.title || 'Untitled'}
                              </CardTitle>
                              <CardDescription className="text-xs">
                                Configure the main spotlight card and dual product circles.
                              </CardDescription>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => removeCombo(activeComboIndex)}
                            disabled={pairings.length <= 1}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 h-8 px-2 text-xs"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Combo
                          </Button>
                        </CardHeader>

                        <CardContent className="p-5 space-y-5">
                          {/* Top 4 Fields */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Kicker Category Tag
                              </label>
                              <Input 
                                placeholder="e.g. BREAKFAST, EVENING TEA" 
                                value={currentCombo.kicker} 
                                onChange={e => updateCombo(activeComboIndex, 'kicker', e.target.value.toUpperCase())}
                                className="font-bold uppercase tracking-wider text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Title
                              </label>
                              <Input 
                                placeholder="e.g. Dosa's Best Friends" 
                                value={currentCombo.title} 
                                onChange={e => updateCombo(activeComboIndex, 'title', e.target.value)}
                                className="font-bold text-sm"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Subtitle / Description
                              </label>
                              <Input 
                                placeholder="e.g. Karam Podi + Avakaya" 
                                value={currentCombo.desc} 
                                onChange={e => updateCombo(activeComboIndex, 'desc', e.target.value)}
                                className="text-xs"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                Combo Offer Price (₹)
                              </label>
                              <Input 
                                type="number" 
                                placeholder="379" 
                                value={currentCombo.price || ''} 
                                onChange={e => updateCombo(activeComboIndex, 'price', Number(e.target.value) || 0)}
                                className="font-bold text-xs"
                              />
                            </div>
                          </div>

                          {/* Dual Circular Images Showcase */}
                          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                  Dual Overlapping Product Images (Circle A & Circle B)
                                </span>
                              </div>
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                onClick={() => swapComboImages(activeComboIndex)}
                                className="h-7 text-[11px] gap-1 text-slate-600 dark:text-slate-400"
                              >
                                <ArrowRightLeft className="h-3 w-3" /> Swap A & B
                              </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {/* Product A */}
                              <div className="space-y-2 p-3 bg-white dark:bg-slate-950 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                                    Circle A (Left Product)
                                  </label>
                                  <span className="text-[10px] text-slate-400">e.g. Podi / Powder</span>
                                </div>
                                <Input 
                                  placeholder="Path or URL (e.g. assets/images/...)" 
                                  value={currentCombo.imageA} 
                                  onChange={e => updateCombo(activeComboIndex, 'imageA', e.target.value)}
                                  className="text-xs h-8"
                                />
                                <ImageUpload 
                                  value={currentCombo.imageA} 
                                  onChange={url => updateCombo(activeComboIndex, 'imageA', url)} 
                                  folder="app_content" 
                                />
                                {productNames.length > 0 && (
                                  <select 
                                    className="w-full text-xs h-7 rounded border border-slate-200 dark:border-slate-800 bg-transparent px-2 text-slate-600 dark:text-slate-400"
                                    onChange={e => {
                                      const p = allProducts.find(prod => prod.name === e.target.value);
                                      if (p?.image) updateCombo(activeComboIndex, 'imageA', p.image);
                                    }}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>-- Quick pick from Products --</option>
                                    {productNames.map(name => <option key={name} value={name}>{name}</option>)}
                                  </select>
                                )}
                              </div>

                              {/* Product B */}
                              <div className="space-y-2 p-3 bg-white dark:bg-slate-950 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                                    Circle B (Right Product)
                                  </label>
                                  <span className="text-[10px] text-slate-400">e.g. Pickle / Snack</span>
                                </div>
                                <Input 
                                  placeholder="Path or URL (e.g. assets/images/...)" 
                                  value={currentCombo.imageB} 
                                  onChange={e => updateCombo(activeComboIndex, 'imageB', e.target.value)}
                                  className="text-xs h-8"
                                />
                                <ImageUpload 
                                  value={currentCombo.imageB} 
                                  onChange={url => updateCombo(activeComboIndex, 'imageB', url)} 
                                  folder="app_content" 
                                />
                                {productNames.length > 0 && (
                                  <select 
                                    className="w-full text-xs h-7 rounded border border-slate-200 dark:border-slate-800 bg-transparent px-2 text-slate-600 dark:text-slate-400"
                                    onChange={e => {
                                      const p = allProducts.find(prod => prod.name === e.target.value);
                                      if (p?.image) updateCombo(activeComboIndex, 'imageB', p.image);
                                    }}
                                    defaultValue=""
                                  >
                                    <option value="" disabled>-- Quick pick from Products --</option>
                                    {productNames.map(name => <option key={name} value={name}>{name}</option>)}
                                  </select>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 3-Color Gradient Customizer */}
                          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                                <Palette className="h-3.5 w-3.5 text-purple-600" />
                                3-Color Linear Gradient Palette
                              </span>
                              <span className="text-[11px] font-mono text-slate-500">
                                {curColors.join(' → ')}
                              </span>
                            </div>

                            {/* Gradient preview bar */}
                            <div 
                              className="h-6 w-full rounded-lg border border-slate-300 dark:border-slate-700 shadow-inner transition-all duration-300"
                              style={{
                                background: `linear-gradient(90deg, ${curColors[0]}, ${curColors[1]}, ${curColors[2]})`
                              }}
                            />

                            {/* 3 Color Pickers */}
                            <div className="grid grid-cols-3 gap-3">
                              {[0, 1, 2].map(cIdx => (
                                <div key={cIdx} className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                                    {cIdx === 0 ? 'Color 1 (Start)' : cIdx === 1 ? 'Color 2 (Mid)' : 'Color 3 (End)'}
                                  </label>
                                  <div className="flex items-center gap-1.5 bg-white dark:bg-slate-950 p-1.5 border rounded-md">
                                    <input 
                                      type="color" 
                                      value={curColors[cIdx]} 
                                      onChange={e => updateComboColor(activeComboIndex, cIdx, e.target.value.toUpperCase())}
                                      className="h-6 w-6 rounded cursor-pointer border-0 bg-transparent p-0"
                                    />
                                    <Input 
                                      value={curColors[cIdx]} 
                                      onChange={e => updateComboColor(activeComboIndex, cIdx, e.target.value.toUpperCase())}
                                      className="h-6 text-[11px] font-mono px-1 border-0 shadow-none focus-visible:ring-0 uppercase"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* 1-Click Palette Presets */}
                            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                                Authentic Palette Presets:
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { name: 'Royal Crimson', colors: ['#5C0A0D', '#7A0F12', '#9B1D22'] },
                                  { name: 'Heritage Emerald', colors: ['#18453B', '#235D4E', '#2E7563'] },
                                  { name: 'Golden Bronze', colors: ['#8B4513', '#A0522D', '#B8860B'] },
                                  { name: 'Imperial Purple', colors: ['#3E103F', '#5E1B5F', '#7E2580'] },
                                  { name: 'Deep Ocean', colors: ['#0D2538', '#163B59', '#1E527B'] },
                                  { name: 'Warm Terracotta', colors: ['#6E260E', '#8C3112', '#AA3C16'] },
                                ].map(p => (
                                  <button
                                    key={p.name}
                                    type="button"
                                    onClick={() => applyGradientPreset(activeComboIndex, p.colors)}
                                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-medium hover:bg-slate-100 flex items-center gap-1.5 transition shadow-2xs"
                                  >
                                    <span 
                                      className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0" 
                                      style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]}, ${p.colors[2]})` }}
                                    />
                                    {p.name}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* 2. SUB-PAIRS SECTION ("PAIRS WELL WITH") */}
                      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
                        <CardHeader className="pb-3 border-b bg-slate-50/70 dark:bg-slate-900/40 flex flex-row items-center justify-between">
                          <div>
                            <CardTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
                              Sub-Pairs for "{currentCombo.title || currentCombo.kicker}" ({currentCombo.pairs?.length || 0})
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Curated combination cards shown in the mobile carousel under the spotlight card.
                            </CardDescription>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => addSubPair(activeComboIndex)}
                            className="text-xs bg-white dark:bg-slate-900"
                          >
                            <Plus className="h-3.5 w-3.5 mr-1 text-rose-600" /> Add Sub-Pair
                          </Button>
                        </CardHeader>

                        <CardContent className="p-5 space-y-4">
                          {(currentCombo.pairs || []).map((pair, sIdx) => (
                            <div 
                              key={pair.id || sIdx}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-2xs space-y-3 relative group"
                            >
                              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-900">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-400">#{sIdx + 1}</span>
                                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                                    {pair.name || 'Untitled Duo'}
                                  </span>
                                  {pair.tag && (
                                    <span className="text-[9px] bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold px-1.5 py-0.5 rounded uppercase">
                                      {pair.tag}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      updateSubPair(activeComboIndex, sIdx, 'imageA', currentCombo.imageA);
                                      updateSubPair(activeComboIndex, sIdx, 'imageB', currentCombo.imageB);
                                      toast.success('Copied Hero images to sub-pair');
                                    }}
                                    className="h-7 text-[10px] text-slate-500 hover:text-slate-800 px-2"
                                  >
                                    Copy Hero Imgs
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => removeSubPair(activeComboIndex, sIdx)}
                                    className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>

                              {/* Form Fields for Sub-Pair */}
                              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Pair Name</label>
                                  <Input 
                                    placeholder="e.g. Karam Podi + Avakaya" 
                                    value={pair.name} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'name', e.target.value)}
                                    className="text-xs font-semibold h-8"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Best With</label>
                                  <Input 
                                    placeholder="e.g. Dosa · Idli" 
                                    value={pair.bestWith} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'bestWith', e.target.value)}
                                    className="text-xs h-8"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Price (₹)</label>
                                  <Input 
                                    type="number"
                                    placeholder="379" 
                                    value={pair.price || ''} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'price', Number(e.target.value) || 0)}
                                    className="text-xs font-bold h-8"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Tag (Optional)</label>
                                  <Input 
                                    placeholder="e.g. BESTSELLER, CRUNCHY" 
                                    value={pair.tag || ''} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'tag', e.target.value.toUpperCase())}
                                    className="text-xs font-bold h-8 uppercase"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Image A (Path/URL)</label>
                                  <Input 
                                    placeholder="assets/images/... or https://" 
                                    value={pair.imageA} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'imageA', e.target.value)}
                                    className="text-xs h-8"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-500 uppercase">Image B (Path/URL)</label>
                                  <Input 
                                    placeholder="assets/images/... or https://" 
                                    value={pair.imageB} 
                                    onChange={e => updateSubPair(activeComboIndex, sIdx, 'imageB', e.target.value)}
                                    className="text-xs h-8"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}

                          {(currentCombo.pairs || []).length === 0 && (
                            <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 text-xs space-y-2">
                              <p>No sub-pairs added for this combo yet.</p>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => addSubPair(activeComboIndex)}
                                className="text-xs"
                              >
                                + Add First Sub-Pair
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Instant Save Bar */}
                      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          Saves to BigRock MySQL database and immediately triggers <code className="text-rose-600 font-mono text-[11px]">AppConfigRepository().getPairingsStream()</code> live across all user mobile apps.
                        </div>
                        <Button 
                          type="button" 
                          disabled={isSaving}
                          onClick={() => handleSaveTab('pairings', { list: pairings })}
                          className="bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-md px-6 shrink-0"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {isSaving ? 'Publishing...' : 'Publish Pairings Live'}
                        </Button>
                      </div>
                    </div>

                    {/* RIGHT COLUMN: LIVE MOBILE APP SIMULATION (5 cols) */}
                    <div className="xl:col-span-5 flex flex-col items-center">
                      <div className="w-full text-center mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-rose-600" />
                          Live Mobile "Art of Pairing" Simulation
                        </span>
                      </div>

                      {/* Phone Bezel */}
                      <div className="w-full max-w-[370px] rounded-[38px] overflow-hidden border-[6px] border-slate-900 shadow-2xl bg-[#F8F5EE] relative flex flex-col">
                        {/* Status Bar */}
                        <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[11px] font-bold text-slate-700 bg-white/70 backdrop-blur-xs border-b border-black/5">
                          <span>9:41</span>
                          <div className="h-4 w-16 bg-slate-900 rounded-full mx-auto" />
                          <div className="flex items-center gap-1">
                            <span className="text-[10px]">5G</span>
                            <div className="w-4 h-2 border border-slate-700 rounded-xs p-0.5">
                              <div className="w-full h-full bg-slate-700 rounded-2xs" />
                            </div>
                          </div>
                        </div>

                        {/* App Section Header */}
                        <div className="p-4 pb-2 bg-gradient-to-b from-[#F8F5EE] to-[#F3EDE2]">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black tracking-widest text-[#8B1D24] uppercase">
                              AUTHENTIC HERITAGE
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">Curated Combos</span>
                          </div>
                          <h3 className="text-lg font-serif font-black tracking-tight text-[#3B0E11] mt-0.5">
                            The Art of Pairing
                          </h3>
                          <p className="text-[11px] text-slate-600 font-medium">
                            Handcrafted combinations that elevate every bite
                          </p>

                          {/* Category Switcher in Simulation */}
                          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1 scrollbar-none">
                            {pairings.map((c, idx) => {
                              const isSimActive = idx === activeComboIndex;
                              const cColors = c.colors && c.colors.length >= 3 ? c.colors : ['#5C0A0D', '#7A0F12', '#9B1D22'];
                              return (
                                <button
                                  key={c.id || idx}
                                  type="button"
                                  onClick={() => setActiveComboIndex(idx)}
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 transition flex items-center gap-1 shadow-2xs ${
                                    isSimActive
                                      ? 'text-white border border-amber-300/40 shadow-sm'
                                      : 'bg-white/80 text-slate-600 border border-slate-200'
                                  }`}
                                  style={isSimActive ? {
                                    background: `linear-gradient(135deg, ${cColors[0]}, ${cColors[1]})`
                                  } : {}}
                                >
                                  <span>{c.kicker || `COMBO ${idx + 1}`}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Mobile Body Content */}
                        <div className="p-4 space-y-4 max-h-[560px] overflow-y-auto custom-scrollbar">
                          {/* HERO SPOTLIGHT CARD */}
                          <div 
                            className="p-4 rounded-2xl text-white shadow-lg relative overflow-hidden transition-all duration-300"
                            style={{
                              background: `linear-gradient(135deg, ${curColors[0]} 0%, ${curColors[1]} 55%, ${curColors[2]} 100%)`
                            }}
                          >
                            {/* Decorative background overlay */}
                            <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-black/25 pointer-events-none" />

                            <div className="relative z-10 space-y-3">
                              {/* Top Tag & Price */}
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-200 shadow-2xs">
                                  {currentCombo.kicker || 'BREAKFAST'}
                                </span>
                                <span className="text-xs font-black text-white px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-xs border border-white/20">
                                  ₹{currentCombo.price || 379}
                                </span>
                              </div>

                              {/* Title & Description */}
                              <div>
                                <h4 className="text-xl font-serif font-black tracking-wide text-white drop-shadow-xs">
                                  {currentCombo.title || "Dosa's Best Friends"}
                                </h4>
                                <p className="text-xs text-amber-100/90 font-medium mt-0.5">
                                  {currentCombo.desc || "Karam Podi + Avakaya"}
                                </p>
                              </div>

                              {/* Dual Overlapping Product Image Circles */}
                              <div className="pt-2 pb-1 flex items-center justify-center">
                                <div className="relative flex items-center justify-center">
                                  {/* Left Circle A */}
                                  <div className="h-20 w-20 rounded-full border-[3px] border-[#F3C64D] shadow-md overflow-hidden bg-white/20 shrink-0 relative z-10 transform -rotate-3 hover:scale-105 transition">
                                    <img 
                                      src={getPairingDisplayImg(currentCombo.imageA, 'powder')} 
                                      alt="Product A" 
                                      className="h-full w-full object-cover"
                                      onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/images/kandi_podi.png';
                                      }}
                                    />
                                  </div>

                                  {/* Floating Center Plus Connector */}
                                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#FFE380] to-[#E5A824] text-slate-900 border-2 border-white font-black text-xs flex items-center justify-center shadow-lg relative z-30 -mx-3">
                                    +
                                  </div>

                                  {/* Right Circle B (Overlapping) */}
                                  <div className="h-20 w-20 rounded-full border-[3px] border-[#F3C64D] shadow-md overflow-hidden bg-white/20 shrink-0 relative z-20 transform rotate-3 hover:scale-105 transition">
                                    <img 
                                      src={getPairingDisplayImg(currentCombo.imageB, 'pickle')} 
                                      alt="Product B" 
                                      className="h-full w-full object-cover"
                                      onError={(e: any) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/images/avakaya_pickle.png';
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Action Button */}
                              <button 
                                type="button"
                                className="w-full py-2 px-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                              >
                                <span>Order Combo Pack</span>
                                <span className="text-amber-200">· ₹{currentCombo.price || 379}</span>
                              </button>
                            </div>
                          </div>

                          {/* "PAIRS WELL WITH" CURATED SUB-ITEMS */}
                          <div className="space-y-2 pt-1">
                            <div className="flex items-center justify-between px-1">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-700">
                                EXPLORE PAIRINGS ({currentCombo.pairs?.length || 0})
                              </span>
                              <span className="text-[10px] text-rose-700 font-bold">Handcrafted Duos</span>
                            </div>

                            <div className="space-y-2">
                              {(currentCombo.pairs || []).map((pair, pIdx) => (
                                <div 
                                  key={pair.id || pIdx}
                                  className="p-2.5 rounded-xl bg-white border border-amber-900/10 shadow-xs flex items-center justify-between gap-3 hover:border-amber-400/40 transition"
                                >
                                  {/* Dual Mini Thumbnails */}
                                  <div className="flex items-center shrink-0">
                                    <div className="h-10 w-10 rounded-full border border-amber-300 shadow-2xs overflow-hidden bg-slate-100 relative z-10">
                                      <img 
                                        src={getPairingDisplayImg(pair.imageA, 'powder')} 
                                        alt="A" 
                                        className="h-full w-full object-cover" 
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src = '/assets/images/kandi_podi.png';
                                        }}
                                      />
                                    </div>
                                    <div className="h-4 w-4 rounded-full bg-amber-400 text-slate-900 font-black text-[9px] flex items-center justify-center shadow-xs -mx-1.5 relative z-30 border border-white">
                                      +
                                    </div>
                                    <div className="h-10 w-10 rounded-full border border-amber-300 shadow-2xs overflow-hidden bg-slate-100 relative z-20">
                                      <img 
                                        src={getPairingDisplayImg(pair.imageB, 'pickle')} 
                                        alt="B" 
                                        className="h-full w-full object-cover" 
                                        onError={(e: any) => {
                                          e.target.onerror = null;
                                          e.target.src = '/assets/images/avakaya_pickle.png';
                                        }}
                                      />
                                    </div>
                                  </div>

                                  {/* Middle Texts */}
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <h5 className="text-xs font-bold text-slate-900 truncate">
                                        {pair.name || 'Curated Duo'}
                                      </h5>
                                      {pair.tag && (
                                        <span className="text-[8px] bg-rose-50 text-rose-700 font-black px-1.5 py-0.2 rounded-xs border border-rose-200">
                                          {pair.tag}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                      Best with: {pair.bestWith || 'Hot Meals'}
                                    </p>
                                  </div>

                                  {/* Price & Add Button */}
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs font-black text-[#5C0A0D]">
                                      ₹{pair.price || 299}
                                    </span>
                                    <div className="h-6 w-6 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center font-bold text-xs shadow-2xs cursor-pointer">
                                      +
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Live Sync Footer in Phone */}
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[10px] text-emerald-800 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            <span>
                              Stream live connected to <strong>AppConfigRepository().getPairingsStream()</strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </TabsContent>

          {/* AMBHUJAKSHI SPECIALS (SPECIALS_LIGHT) */}
          <TabsContent value="specials_light" className="mt-0 space-y-6">
            <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-xl">AmbhuJakshi Specials (SpecialsLightSection)</CardTitle>
                      <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Live Stream Sync
                      </span>
                    </div>
                    <CardDescription className="mt-1">
                      Manage the 6 signature specials featured prominently in the spotlight section on the home page. Reorder, rename, or swap images in real time.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={restoreDefaultSpecialsLight}
                      className="text-xs text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700"
                    >
                      <RefreshCw className="h-3.5 w-3.5 mr-1 text-slate-500" />
                      Restore 6 Presets
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={addSpecialItem}
                      className="text-xs text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/30"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Special Tile
                    </Button>
                    <Button 
                      size="sm"
                      disabled={isSaving}
                      onClick={() => handleSaveTab('specials_light', { list: specialsLight })}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-sm text-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1" />
                      {isSaving ? 'Publishing...' : 'Publish Specials Live'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              {/* LEFT COLUMN: 6 SPECIALS TILES MANAGER (7 cols) */}
              <div className="xl:col-span-7 space-y-4">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Specials Tiles ({specialsLight.length} configured):
                  </span>
                  <span className="text-xs text-slate-400">
                    Use ▲ and ▼ to reorder tiles on the home screen
                  </span>
                </div>

                <div className="space-y-3">
                  {specialsLight.map((item, idx) => (
                    <Card key={item.id || idx} className="border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
                      <div className="p-3 bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {item.name || 'Untitled Special'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({item.id})
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={idx === 0}
                            onClick={() => moveSpecialItem(idx, 'up')}
                            className="h-7 w-7 p-0 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={idx === specialsLight.length - 1}
                            onClick={() => moveSpecialItem(idx, 'down')}
                            className="h-7 w-7 p-0 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            disabled={specialsLight.length <= 1}
                            onClick={() => removeSpecialItem(idx)}
                            className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-30 ml-1"
                            title="Delete Tile"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-4 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                              Special Title / Name
                            </label>
                            <Input 
                              placeholder="e.g. Avakaya, Karam Podi" 
                              value={item.name} 
                              onChange={e => updateSpecialItem(idx, 'name', e.target.value)}
                              className="font-bold text-xs h-8"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                              Unique Identifier (id)
                            </label>
                            <Input 
                              placeholder="e.g. avakaya, karam_podi" 
                              value={item.id} 
                              onChange={e => updateSpecialItem(idx, 'id', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                              className="font-mono text-xs h-8"
                            />
                          </div>
                        </div>

                        {/* Image field & Upload */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between">
                            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase">
                              Tile Image (Local Asset Path or Cloudinary URL)
                            </label>
                            {productNames.length > 0 && (
                              <select 
                                className="text-xs h-6 rounded border border-slate-200 dark:border-slate-800 bg-transparent px-2 text-slate-600 dark:text-slate-400"
                                onChange={e => {
                                  const p = allProducts.find(prod => prod.name === e.target.value);
                                  if (p) {
                                    updateSpecialItem(idx, 'name', p.name);
                                    if (p.image) updateSpecialItem(idx, 'image', p.image);
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="" disabled>-- Auto-fill from Product --</option>
                                {productNames.map(name => <option key={name} value={name}>{name}</option>)}
                              </select>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl border border-amber-300/80 shadow-xs overflow-hidden bg-slate-100 shrink-0">
                              <img 
                                src={getPairingDisplayImg(item.image, 'pickle')} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                                onError={(e: any) => {
                                  e.target.onerror = null;
                                  e.target.src = '/assets/images/avakaya_pickle.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 space-y-1.5">
                              <Input 
                                placeholder="assets/images/... or https://" 
                                value={item.image} 
                                onChange={e => updateSpecialItem(idx, 'image', e.target.value)}
                                className="text-xs h-8"
                              />
                            </div>
                          </div>

                          <div className="pt-1">
                            <ImageUpload 
                              value={item.image} 
                              onChange={url => updateSpecialItem(idx, 'image', url)} 
                              folder="app_content" 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Add Tile Button */}
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={addSpecialItem}
                  className="w-full border-dashed border-2 py-4 text-xs font-semibold text-slate-600 hover:text-amber-700 hover:border-amber-400"
                >
                  <Plus className="h-4 w-4 mr-1 text-amber-600" />
                  + Add Another Special Tile
                </Button>

                {/* Instant Save Bar */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    Saves to BigRock MySQL database under <code className="text-amber-600 font-mono text-[11px]">specials_light</code> and instantly broadcasts through <code className="text-amber-600 font-mono text-[11px]">AppConfigRepository().getSpecialsLightStream()</code> to live app users.
                  </div>
                  <Button 
                    type="button" 
                    disabled={isSaving}
                    onClick={() => handleSaveTab('specials_light', { list: specialsLight })}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md px-6 shrink-0"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {isSaving ? 'Publishing...' : 'Publish Specials Live'}
                  </Button>
                </div>
              </div>

              {/* RIGHT COLUMN: LIVE MOBILE APP SIMULATION (5 cols) */}
              <div className="xl:col-span-5 flex flex-col items-center">
                <div className="w-full text-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-amber-600" />
                    Live Mobile "AmbhuJakshi Specials" Simulation
                  </span>
                </div>

                {/* Phone Bezel */}
                <div className="w-full max-w-[370px] rounded-[38px] overflow-hidden border-[6px] border-slate-900 shadow-2xl bg-[#F8F5EE] relative flex flex-col">
                  {/* Status Bar */}
                  <div className="pt-3 px-6 pb-2 flex justify-between items-center text-[11px] font-bold text-slate-700 bg-white/70 backdrop-blur-xs border-b border-black/5">
                    <span>9:41</span>
                    <div className="h-4 w-16 bg-slate-900 rounded-full mx-auto" />
                    <div className="flex items-center gap-1">
                      <span className="text-[10px]">5G</span>
                      <div className="w-4 h-2 border border-slate-700 rounded-xs p-0.5">
                        <div className="w-full h-full bg-slate-700 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Context Header */}
                  <div className="p-4 pb-2 bg-gradient-to-b from-[#F8F5EE] to-[#F3EDE2] border-b border-black/5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black tracking-widest text-[#9A6700] uppercase flex items-center gap-1">
                        <Crown className="h-3 w-3 text-amber-600" />
                        SIGNATURE FAVORITES
                      </span>
                      <span className="text-[10px] font-bold text-[#8B1D24] flex items-center gap-0.5 cursor-pointer hover:underline">
                        Explore All →
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-black tracking-tight text-[#3B0E11] mt-0.5">
                      AmbhuJakshi Specials
                    </h3>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Traditional handcrafted culinary marvels, made fresh
                    </p>
                  </div>

                  {/* Mobile Grid Showcase */}
                  <div className="p-4 space-y-3 max-h-[580px] overflow-y-auto custom-scrollbar">
                    {/* 3x2 Grid of Specials */}
                    <div className="grid grid-cols-3 gap-2.5">
                      {specialsLight.map((item, idx) => (
                        <div 
                          key={item.id || idx}
                          className="bg-white rounded-2xl p-2.5 border border-[#E8DFC9] shadow-xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col items-center text-center relative group"
                        >
                          {/* Mini badge */}
                          <div className="absolute top-1.5 right-1.5 h-3.5 w-3.5 rounded-full bg-amber-100 text-amber-800 text-[8px] font-bold flex items-center justify-center">
                            ★
                          </div>

                          {/* Circular Product Image with Gold Ring */}
                          <div className="h-16 w-16 rounded-full border-[2.5px] border-[#E8C56A] shadow-xs overflow-hidden bg-slate-50 my-1 group-hover:scale-105 transition-transform duration-200">
                            <img 
                              src={getPairingDisplayImg(item.image, 'pickle')} 
                              alt={item.name} 
                              className="h-full w-full object-cover"
                              onError={(e: any) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/avakaya_pickle.png';
                              }}
                            />
                          </div>

                          {/* Item Title */}
                          <span className="text-xs font-bold text-slate-800 line-clamp-1 mt-1 leading-tight">
                            {item.name || 'Special'}
                          </span>

                          <span className="text-[9px] text-amber-700 font-semibold mt-0.5">
                            Handcrafted
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Promo Ribbon inside Mobile View */}
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-[#5C0A0D] to-[#8B1D24] text-white shadow-sm flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                          AUTHENTIC BATCHES
                        </span>
                        <p className="text-xs font-bold">100% Cold-Pressed & Stone-Ground</p>
                      </div>
                      <span className="text-xs font-black bg-white/20 px-2 py-1 rounded-lg backdrop-blur-xs">
                        Pure
                      </span>
                    </div>

                    {/* Live Stream Connectivity Notice */}
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[10px] text-emerald-800 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      <span>
                        Stream live connected to <strong>AppConfigRepository().getSpecialsLightStream()</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* THE LOVE CHART (MOST LOVED PRODUCTS) */}
          <TabsContent value="most_loved" className="mt-0 space-y-6">
            <MostLovedManager
              config={mostLoved}
              onChange={setMostLoved}
              onSave={async () => {
                await handleSaveTab('most_loved', {
                  settings: mostLoved.settings,
                  products: mostLoved.products
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm('Reset The Love Chart to authentic presets (Bellam Avakaya & Idli Karam Podi)?')) return;
                setMostLoved(DEFAULT_MOST_LOVED);
                toast.success('Restored Authentic Most Loved Defaults!');
              }}
            />
          </TabsContent>

          {/* BEST SELLERS CHAMPIONS PODIUM */}
          <TabsContent value="best_sellers" className="mt-0 space-y-6">
            <BestSellersManager
              config={bestSellers}
              onChange={setBestSellers}
              onSave={async () => {
                await handleSaveTab('best_sellers', {
                  settings: bestSellers.settings,
                  categories: bestSellers.categories
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Best Sellers Champions to authentic defaults?")) return;
                setBestSellers(DEFAULT_BEST_SELLERS);
                toast.success('Restored Authentic Best Sellers Defaults!');
              }}
            />
          </TabsContent>

          {/* MITHAI THALI SWEETS SECTION */}
          <TabsContent value="sweets_thali" className="mt-0 space-y-6">
            <SweetsThaliManager
              config={sweetsThali}
              onChange={setSweetsThali}
              onSave={async () => {
                await handleSaveTab('sweets', {
                  settings: sweetsThali.settings,
                  products: sweetsThali.products
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Mithai Thali Sweets to authentic defaults?")) return;
                setSweetsThali(DEFAULT_SWEETS);
                toast.success('Restored Authentic Mithai Thali Defaults!');
              }}
            />
          </TabsContent>

          {/* SPICE GRINDER SECTION */}
          <TabsContent value="spice_grinder" className="mt-0 space-y-6">
            <SpiceGrinderManager
              config={spiceGrinder}
              onChange={setSpiceGrinder}
              onSave={async () => {
                await handleSaveTab('spices_grinder', {
                  settings: spiceGrinder.settings,
                  products: spiceGrinder.products
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Spice Grinder section to authentic defaults?")) return;
                setSpiceGrinder(DEFAULT_SPICE_GRINDER);
                toast.success('Restored Authentic Spice Grinder Defaults!');
              }}
            />
          </TabsContent>

          {/* FRESH PICKS (AMMA'S KITCHEN) SECTION */}
          <TabsContent value="fresh_picks" className="mt-0 space-y-6">
            <FreshPicksManager
              config={freshPicks}
              onChange={setFreshPicks}
              onSave={async () => {
                await handleSaveTab('fresh_picks', {
                  settings: freshPicks.settings,
                  products: freshPicks.products
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Fresh Picks to authentic defaults?")) return;
                setFreshPicks(DEFAULT_FRESH_PICKS);
                toast.success('Restored Authentic Fresh Picks Defaults!');
              }}
            />
          </TabsContent>

          {/* LETTERS FROM HOME (CUSTOMER REVIEWS) SECTION */}
          <TabsContent value="reviews" className="mt-0 space-y-6">
            <LettersFromHomeManager
              config={reviewsConfig}
              onChange={setReviewsConfig}
              onSave={async () => {
                await handleSaveTab('reviews', {
                  settings: reviewsConfig.settings,
                  summary: reviewsConfig.summary,
                  reviews: reviewsConfig.reviews
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Letters from Home reviews to authentic defaults?")) return;
                setReviewsConfig(DEFAULT_REVIEWS);
                toast.success('Restored Authentic Reviews Defaults!');
              }}
              allProducts={allProducts}
            />
          </TabsContent>

          {/* THE AMBHUJAKSHI PROMISE (TRUST SECTION) */}
          <TabsContent value="trust" className="mt-0 space-y-6">
            <TrustPromiseManager
              config={trustConfig}
              onChange={setTrustConfig}
              onSave={async () => {
                await handleSaveTab('trust', trustConfig);
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset The AmbhuJakshi Promise to authentic defaults?")) return;
                setTrustConfig(DEFAULT_TRUST);
                toast.success('Restored Authentic Trust Defaults!');
              }}
            />
          </TabsContent>

          {/* AMMA'S PICKLES (PICKLES SHOWCASE) SECTION */}
          <TabsContent value="pickles_showcase" className="mt-0 space-y-6">
            <PicklesShowcaseManager
              config={picklesConfig}
              onChange={setPicklesConfig}
              onSave={async () => {
                await handleSaveTab('pickles', {
                  settings: picklesConfig.settings,
                  pickles: picklesConfig.pickles
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Amma's Pickles showcase to authentic defaults?")) return;
                setPicklesConfig(DEFAULT_PICKLES_CONFIG);
                toast.success('Restored Authentic Pickles Showcase Defaults!');
              }}
              allProducts={allProducts}
            />
          </TabsContent>

          {/* AMMA'S PANTRY (WISHLIST) SECTION */}
          <TabsContent value="wishlist" className="mt-0 space-y-6">
            <WishlistPantryManager
              config={wishlistConfig}
              onChange={setWishlistConfig}
              onSave={async () => {
                await handleSaveTab('wishlist', {
                  settings: wishlistConfig.settings,
                  items: wishlistConfig.items
                });
              }}
              isSaving={isSaving}
              onResetDefaults={() => {
                if (!confirm("Reset Amma's Pantry Wishlist to authentic defaults?")) return;
                setWishlistConfig(DEFAULT_WISHLIST_CONFIG);
                toast.success('Restored Authentic Wishlist Defaults!');
              }}
              allProducts={allProducts}
            />
          </TabsContent>

          <TabsContent value="kitchen_story" className="space-y-6 mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Kitchen Story (Our Journey)</CardTitle>
                  <CardDescription>Manage the completely dynamic 'Our Journey' vertical scrolling page.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Header */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">1. Header Settings</h3>
                  <div>
                    <label className="text-sm font-medium">App Bar Title</label>
                    <Input 
                      value={kitchenStory.app_bar.title} 
                      onChange={e => setKitchenStory({ ...kitchenStory, app_bar: { title: e.target.value } })} 
                    />
                  </div>
                </div>

                {/* Beginning */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">2. The Beginning & History</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">Polaroid Image</label>
                      <ImageUpload 
                        value={kitchenStory.sections.beginning.image_url} 
                        onChange={(url) => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, beginning: { ...kitchenStory.sections.beginning, image_url: url } } })} 
                        folder="app_content"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Image Label</label>
                        <Input 
                          value={kitchenStory.sections.beginning.label} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, beginning: { ...kitchenStory.sections.beginning, label: e.target.value } } })} 
                        />
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <input 
                          type="checkbox" 
                          id="hasPin"
                          checked={kitchenStory.sections.beginning.has_pin}
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, beginning: { ...kitchenStory.sections.beginning, has_pin: e.target.checked } } })}
                          className="w-4 h-4"
                        />
                        <label htmlFor="hasPin" className="text-sm font-medium">Show Red Pin on Photo</label>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium">History Text Paragraph</label>
                      <textarea 
                        className="w-full min-h-[100px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 mt-1"
                        value={kitchenStory.sections.history.text}
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, history: { ...kitchenStory.sections.history, text: e.target.value } } })}
                      />
                    </div>
                  </div>
                </div>

                {/* Authentic */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">3. Pure & Authentic Section</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium block mb-2">Main Image</label>
                      <ImageUpload 
                        value={kitchenStory.sections.authentic.image_url} 
                        onChange={(url) => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, authentic: { ...kitchenStory.sections.authentic, image_url: url } } })} 
                        folder="app_content"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Banner Text</label>
                      <Input 
                        value={kitchenStory.sections.authentic.banner_text} 
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, authentic: { ...kitchenStory.sections.authentic, banner_text: e.target.value } } })} 
                      />
                    </div>
                  </div>
                </div>

                {/* Ingredients List */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">4. Dynamic Ingredients Sourcing List</h3>
                  <div>
                    <label className="text-sm font-medium">Header Introduction Text</label>
                    <textarea 
                      className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none mt-1 mb-6"
                      value={kitchenStory.sections.ingredients.header_text}
                      onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, header_text: e.target.value } } })}
                    />
                  </div>
                  
                  <div className="space-y-4 border-l-2 border-slate-200 pl-4 ml-2">
                    {kitchenStory.sections.ingredients.items.map((item, i) => (
                      <div key={i} className="p-4 border border-slate-200 bg-white dark:bg-slate-950 rounded-xl relative">
                        <button 
                          onClick={() => {
                            const n = [...kitchenStory.sections.ingredients.items];
                            n.splice(i, 1);
                            setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, items: n } } });
                          }}
                          className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium block mb-2">Ingredient Image</label>
                            <ImageUpload 
                              value={item.image_url} 
                              onChange={(url) => {
                                const n = [...kitchenStory.sections.ingredients.items];
                                n[i].image_url = url;
                                setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, items: n } } });
                              }} 
                              folder="app_content"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm font-medium block">Text Layout Side</label>
                              <select 
                                className="w-full h-10 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm mt-1"
                                value={item.is_left ? "left" : "right"}
                                onChange={e => {
                                  const n = [...kitchenStory.sections.ingredients.items];
                                  n[i].is_left = e.target.value === "left";
                                  setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, items: n } } });
                                }}
                              >
                                <option value="left">Text on Left, Image on Right</option>
                                <option value="right">Text on Right, Image on Left</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm font-medium block">Action Text (Multi-line)</label>
                              <textarea 
                                className="w-full min-h-[80px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm mt-1"
                                value={item.text}
                                onChange={e => {
                                  const n = [...kitchenStory.sections.ingredients.items];
                                  n[i].text = e.target.value;
                                  setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, items: n } } });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" onClick={() => {
                      const n = [...kitchenStory.sections.ingredients.items, { image_url: '', text: '', is_left: true }];
                      setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, items: n } } });
                    }} className="w-full">
                      <Plus className="w-4 h-4 mr-2" /> Add Ingredient Block
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                    <div>
                      <label className="text-sm font-medium block">Footer Title (e.g. & CHOOSING...)</label>
                      <textarea 
                        className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm mt-1"
                        value={kitchenStory.sections.ingredients.footer_title}
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, footer_title: e.target.value } } })}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block">Footer Subtitle (e.g. FROM FARMS...)</label>
                      <textarea 
                        className="w-full min-h-[60px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm mt-1"
                        value={kitchenStory.sections.ingredients.footer_subtitle}
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, ingredients: { ...kitchenStory.sections.ingredients, footer_subtitle: e.target.value } } })}
                      />
                    </div>
                  </div>
                </div>

                {/* Vision */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">5. Vision Statement Editor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">Normal Prefix Text</label>
                      <Input 
                        value={kitchenStory.sections.vision.main_text} 
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, vision: { ...kitchenStory.sections.vision, main_text: e.target.value } } })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-blue-600 font-bold">Highlighted Bold Text</label>
                      <textarea 
                        className="w-full min-h-[40px] rounded-md border border-input bg-background px-3 py-2 text-sm font-bold mt-1 text-center"
                        value={kitchenStory.sections.vision.highlight_text} 
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, vision: { ...kitchenStory.sections.vision, highlight_text: e.target.value } } })} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">Normal Suffix Text</label>
                      <Input 
                        value={kitchenStory.sections.vision.suffix_text} 
                        onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, vision: { ...kitchenStory.sections.vision, suffix_text: e.target.value } } })} 
                      />
                    </div>
                  </div>
                </div>

                {/* Reach & Footer */}
                <div className="p-4 border rounded-xl bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">6. Reach & Footer Branding</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-200 pb-8">
                    <div>
                      <label className="text-sm font-medium block mb-2">Reach Map Image</label>
                      <ImageUpload 
                        value={kitchenStory.sections.reach.image_url} 
                        onChange={(url) => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, reach: { ...kitchenStory.sections.reach, image_url: url } } })} 
                        folder="app_content"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Reach Label (e.g. OUR REACH)</label>
                        <Input 
                          value={kitchenStory.sections.reach.label} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, reach: { ...kitchenStory.sections.reach, label: e.target.value } } })} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description Paragraph</label>
                        <textarea 
                          className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                          value={kitchenStory.sections.reach.description} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, reach: { ...kitchenStory.sections.reach, description: e.target.value } } })} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div>
                      <label className="text-sm font-medium block mb-2">Footer Signature Image</label>
                      <ImageUpload 
                        value={kitchenStory.sections.footer.image_url} 
                        onChange={(url) => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, footer: { ...kitchenStory.sections.footer, image_url: url } } })} 
                        folder="app_content"
                      />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Top Intro Text</label>
                        <Input 
                          value={kitchenStory.sections.footer.top_text} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, footer: { ...kitchenStory.sections.footer, top_text: e.target.value } } })} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Big Bold Text</label>
                        <Input 
                          value={kitchenStory.sections.footer.big_text} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, footer: { ...kitchenStory.sections.footer, big_text: e.target.value } } })} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium font-serif italic text-rose-600">Cursive Accent Word</label>
                        <Input 
                          value={kitchenStory.sections.footer.cursive_text} 
                          onChange={e => setKitchenStory({ ...kitchenStory, sections: { ...kitchenStory.sections, footer: { ...kitchenStory.sections.footer, cursive_text: e.target.value } } })} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CART & DELIVERY CONFIG */}
          <TabsContent value="cart_delivery" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Delivery Logic</CardTitle>
                  <CardDescription>Configure base fees and the threshold to trigger the free delivery progress bar.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Free Delivery Threshold (₹)</label>
                    <Input type="number" value={deliveryConfig.free_threshold} onChange={e => setDeliveryConfig({ ...deliveryConfig, free_threshold: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Base Delivery Fee (₹)</label>
                    <Input type="number" value={deliveryConfig.base_fee} onChange={e => setDeliveryConfig({ ...deliveryConfig, base_fee: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Packing Fee (₹)</label>
                    <Input type="number" value={deliveryConfig.packing_fee} onChange={e => setDeliveryConfig({ ...deliveryConfig, packing_fee: Number(e.target.value) })} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GST Percentage (%)</label>
                    <Input type="number" value={deliveryConfig.gst_percentage} onChange={e => setDeliveryConfig({ ...deliveryConfig, gst_percentage: Number(e.target.value) })} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Cart Messaging</CardTitle>
                  <CardDescription>Manage the marketing and urgency text shown in the cart.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Freshness Tagline</label>
                    <Input value={cartConfig.freshness_tagline} onChange={e => setCartConfig({ ...cartConfig, freshness_tagline: e.target.value })} placeholder="e.g. FRESHNESS GUARANTEED" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Dispatch Reassurance (Great for Holidays!)</label>
                    <Input value={cartConfig.dispatch_reassurance} onChange={e => setCartConfig({ ...cartConfig, dispatch_reassurance: e.target.value })} placeholder="e.g. Order in the next 2 hrs for same-day dispatch." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upsell Section Title</label>
                    <Input value={cartConfig.upsell_section_title} onChange={e => setCartConfig({ ...cartConfig, upsell_section_title: e.target.value })} placeholder="e.g. COMPLETES THE EXPERIENCE" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Billing Page Marketing</CardTitle>
                  <CardDescription>Manage the urgency, support, and reassurance text right before payment.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estimated Delivery Text</label>
                    <Input value={billingConfig.delivery_estimate_text} onChange={e => setBillingConfig({ ...billingConfig, delivery_estimate_text: e.target.value })} placeholder="e.g. Estimated Delivery: 3-5 Business Days" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Support Chat Text</label>
                    <Input value={billingConfig.support_chat_text} onChange={e => setBillingConfig({ ...billingConfig, support_chat_text: e.target.value })} placeholder="e.g. Need help? Chat with our heritage kitchen" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Savings Highlight Text</label>
                    <Input value={billingConfig.savings_highlight_text} onChange={e => setBillingConfig({ ...billingConfig, savings_highlight_text: e.target.value })} placeholder="e.g. Total Savings on this order:" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TRENDING SEARCHES */}
          <TabsContent value="trending_searches" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>Trending Searches</CardTitle>
                  <CardDescription>Manage the search keyword chips shown below the app search bar</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setTrendingKeywords, '')}>
                  + Add Keyword
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {trendingKeywords.map((keyword, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <Input 
                      placeholder="e.g. Mango Pickle" 
                      value={keyword} 
                      onChange={e => {
                        const newKeywords = [...trendingKeywords];
                        newKeywords[idx] = e.target.value;
                        setTrendingKeywords(newKeywords);
                      }} 
                      className="flex-1"
                    />
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setTrendingKeywords, idx)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
