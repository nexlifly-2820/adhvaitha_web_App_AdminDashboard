const fs = require('fs');
const path = 'c:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/src/app/dashboard/app/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Sparkles and Palette to imports
const oldImports = `import { Plus, Trash2, Save, Image as ImageIcon, Box, AlertCircle, Video, ExternalLink, Copy, Smartphone } from 'lucide-react'`;
const newImports = `import { Plus, Trash2, Save, Image as ImageIcon, Box, AlertCircle, Video, ExternalLink, Copy, Smartphone, Sparkles, Palette } from 'lucide-react'`;

if (!content.includes(oldImports)) {
  console.error('ERROR: oldImports not found!');
  process.exit(1);
}
content = content.replace(oldImports, newImports);

// 2. Add Festival interfaces
const oldInterfacesEnd = `interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;
const newFestivalInterfaces = `interface FestivalTheme {
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

interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;

if (!content.includes(oldInterfacesEnd)) {
  console.error('ERROR: oldInterfacesEnd not found!');
  process.exit(1);
}
content = content.replace(oldInterfacesEnd, newFestivalInterfaces);

// 3. Add festivalConfig state
const oldStateTarget = `  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;
const newFestivalState = `  const [festivalConfig, setFestivalConfig] = useState<FestivalConfig>({
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
      { title: 'Pindi\\nVantalu', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
      { title: 'Festive\\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
      { title: 'Gifting\\nCorner', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
      { title: 'Pickles\\n& Podis', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
    ],
    strip: ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
    chips: [
      { title: 'Sankranti\\nEssentials', image: 'assets/images/sweets.png', link: { tag: 'sankranti' } },
      { title: 'Snacks\\n& More', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
      { title: 'Under\\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
    ],
    products: { tag: 'sankranti-2027', limit: 10 }
  })
  const [newSloganInput, setNewSloganInput] = useState('')
  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;

if (!content.includes(oldStateTarget)) {
  console.error('ERROR: oldStateTarget not found!');
  process.exit(1);
}
content = content.replace(oldStateTarget, newFestivalState);

// 4. Update fetchAllContent to load festival_config
const oldFetchAll = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, productsRes] = await Promise.all([
        getDocData('banners'), getDocData('stories'), getDocData('bento_selection'),
        getDocData('category_parent_cards'), getDocData('categories'), getDocData('deals'), getDocData('coupons'), getDocData('packaging'), getDocData('onboarding'), getDocData('pairings'), getDocData('kitchen_story'), getDocData('search_config'), getDocData('category_page_config'),
        getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)
      ])`;

const newFetchAll = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, productsRes] = await Promise.all([
        getDocData('banners'), getDocData('stories'), getDocData('bento_selection'),
        getDocData('category_parent_cards'), getDocData('categories'), getDocData('deals'), getDocData('coupons'), getDocData('packaging'), getDocData('onboarding'), getDocData('pairings'), getDocData('kitchen_story'), getDocData('search_config'), getDocData('category_page_config'),
        getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)
      ])`;

if (!content.includes(oldFetchAll)) {
  console.error('ERROR: oldFetchAll not found!');
  process.exit(1);
}
content = content.replace(oldFetchAll, newFetchAll);

// 5. Populate festivalConfig from festivalDoc
const oldPopulateTarget = `      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;
const newPopulate = `      if (festivalDoc && Object.keys(festivalDoc).length > 0) {
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
            { title: 'Pindi\\nVantalu', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
            { title: 'Festive\\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
            { title: 'Gifting\\nCorner', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
            { title: 'Pickles\\n& Podis', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
          ],
          strip: (festivalDoc.strip && Array.isArray(festivalDoc.strip)) ? festivalDoc.strip : ['HOMEMADE', 'STONE-GROUND', 'FRESH BATCHES', 'PAN-INDIA'],
          chips: (festivalDoc.chips && Array.isArray(festivalDoc.chips)) ? festivalDoc.chips : [
            { title: 'Sankranti\\nEssentials', image: 'assets/images/sweets.png', link: { tag: 'sankranti' } },
            { title: 'Snacks\\n& More', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
            { title: 'Under\\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
          ],
          products: festivalDoc.products || { tag: festivalDoc.id || 'sankranti-2027', limit: 10 }
        });
      }
      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;

if (!content.includes(oldPopulateTarget)) {
  console.error('ERROR: oldPopulateTarget not found!');
  process.exit(1);
}
content = content.replace(oldPopulateTarget, newPopulate);

// 6. Add case 'festival' in saveCurrentTab
const oldSaveCase = `      case 'snacks_story':
        handleSaveTab('snacks_with_story', { list: snackStories })
        break`;

const newSaveCase = `      case 'snacks_story':
        handleSaveTab('snacks_with_story', { list: snackStories })
        break
      case 'festival':
        handleSaveTab('festival_config', festivalConfig)
        break`;

if (!content.includes(oldSaveCase)) {
  console.error('ERROR: oldSaveCase not found!');
  process.exit(1);
}
content = content.replace(oldSaveCase, newSaveCase);

// 7. Update top save button label
const oldSaveButton = `activeTab === 'home_video'
                    ? 'Save Both Video Sectors'
                    : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\`}`;

const newSaveButton = `activeTab === 'home_video'
                    ? 'Save Both Video Sectors'
                    : activeTab === 'festival'
                      ? 'Publish Festival Live'
                      : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\`}`;

if (!content.includes(oldSaveButton)) {
  console.error('ERROR: oldSaveButton not found!');
  process.exit(1);
}
content = content.replace(oldSaveButton, newSaveButton);

// 8. Add applyFestivalPreset helper before `if (isLoading)`
const oldIsLoading = `  if (isLoading) return <div className="flex h-[400px] items-center justify-center">Loading Content...</div>`;

const presetHelper = `  const applyFestivalPreset = (presetKey: 'sankranti' | 'diwali' | 'mango' | 'ugadi') => {
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
          { title: 'Pindi\\nVantalu', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Festive\\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Gifting\\nCorner', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
          { title: 'Pickles\\n& Podis', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
        ],
        chips: [
          { title: 'Sankranti\\nEssentials', image: 'assets/images/sweets.png', link: { tag: 'sankranti' } },
          { title: 'Snacks\\n& More', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
          { title: 'Under\\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
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
          { title: 'Royal\\nSweets', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Crunchy\\nNamkeen', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Diwali\\nGift Hampers', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } },
          { title: 'Festive\\nPickles', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } }
        ],
        chips: [
          { title: 'Diwali\\nHampers', image: 'assets/images/combos.png', link: { tag: 'diwali' } },
          { title: 'Pure Ghee\\nSweets', image: 'assets/images/sweets.png', link: { category: 'Sweets' } },
          { title: 'Gift Boxes\\nUnder ₹499', image: 'assets/images/spices.png', link: { maxPrice: 499 } }
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
          { title: 'Avakaya\\nPickles', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } },
          { title: 'Sweet\\nMango Special', image: 'assets/images/pickles.png', image2: 'assets/images/sweets.png', link: { category: 'Pickles' } },
          { title: 'Mango\\nSnacks', image: 'assets/images/snacks.png', image2: 'assets/images/spices.png', link: { category: 'Snacks' } },
          { title: 'Traditional\\nPodis', image: 'assets/images/spices.png', image2: 'assets/images/pickles.png', link: { category: 'Podis' } }
        ],
        chips: [
          { title: 'Avakaya\\nSpecials', image: 'assets/images/pickles.png', link: { tag: 'mango' } },
          { title: 'Summer\\nSnacks', image: 'assets/images/snacks.png', link: { category: 'Snacks' } },
          { title: 'Combo Packs\\nUnder ₹399', image: 'assets/images/combos.png', link: { maxPrice: 399 } }
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
          { title: 'Festive\\nBobbatlu', image: 'assets/images/sweets.png', image2: 'assets/images/snacks.png', link: { category: 'Sweets' } },
          { title: 'Ugadi\\nPachadi Kits', image: 'assets/images/pickles.png', image2: 'assets/images/spices.png', link: { category: 'Pickles' } },
          { title: 'Crispy\\nSnacks', image: 'assets/images/snacks.png', image2: 'assets/images/sweets.png', link: { category: 'Snacks' } },
          { title: 'Royal\\nCombos', image: 'assets/images/combos.png', image2: 'assets/images/pickles.png', link: { category: 'Combos' } }
        ],
        chips: [
          { title: 'Ugadi\\nSpecials', image: 'assets/images/sweets.png', link: { tag: 'ugadi' } },
          { title: 'Traditional\\nSweets', image: 'assets/images/sweets.png', link: { category: 'Sweets' } },
          { title: 'Under\\n₹299', image: 'assets/images/spices.png', link: { maxPrice: 299 } }
        ],
        products: { tag: 'ugadi-2027', limit: 10 }
      }));
      toast.success('🌿 Ugadi festive preset applied!');
    }
  };`;

if (!content.includes(oldIsLoading)) {
  console.error('ERROR: oldIsLoading not found!');
  process.exit(1);
}
content = content.replace(oldIsLoading, presetHelper + '\n\n' + oldIsLoading);

// 9. Add TabsTrigger in TabsList
const oldBannersTrigger = `          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>`;

const newBannersWithFestivalTrigger = `          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>
          
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
          </TabsTrigger>`;

if (!content.includes(oldBannersTrigger)) {
  console.error('ERROR: oldBannersTrigger not found!');
  process.exit(1);
}
content = content.replace(oldBannersTrigger, newBannersWithFestivalTrigger);

// 10. Add TabsContent for festival right before splash_video
const oldSplashVideoStart = `          {/* SPLASH VIDEO */}`;

const festivalTabsContent = `          {/* FESTIVAL CAMPAIGN TAB CONTENT */}
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
                    <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold \${
                      festivalConfig.enabled 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }\`}>
                      <span className={\`h-2 w-2 rounded-full \${festivalConfig.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}\`}></span>
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
                                className="h-8 text-xs font-mono"
                              />
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
                          background: \`linear-gradient(180deg, \${festivalConfig.theme.bgTop} 0%, \${festivalConfig.theme.bgBottom} 100%)\`
                        }}
                      >
                        {/* Decorative Top Pill */}
                        <div className="flex items-center justify-between mb-2">
                          <span 
                            className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                            style={{ 
                              color: festivalConfig.theme.kicker,
                              backgroundColor: 'rgba(255,255,255,0.45)',
                              border: \`1px solid \${festivalConfig.theme.line}\`
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
                                border: \`1.5px solid \${festivalConfig.theme.line}\`
                              }}
                            >
                              <span className="text-xs font-black text-white leading-tight whitespace-pre-line z-10 drop-shadow-sm">
                                {t.title}
                              </span>
                              <div className="self-start z-10">
                                <span className="text-[9px] font-bold text-amber-200 underline">Explore &rarr;</span>
                              </div>
                              {/* Product Cutout Mockup Graphic */}
                              <div className="absolute -right-2 -bottom-2 w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
                                {i === 0 ? '🥨' : i === 1 ? '🍬' : i === 2 ? '🎁' : '🫙'}
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
                              <span>{cIdx === 0 ? '🌾' : cIdx === 1 ? '🥨' : '💰'}</span>
                              <span className="text-slate-800 whitespace-nowrap">{chip.title.replace('\\n', ' ')}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>`;

if (!content.includes(oldSplashVideoStart)) {
  console.error('ERROR: oldSplashVideoStart not found!');
  process.exit(1);
}
content = content.replace(oldSplashVideoStart, festivalTabsContent + '\n\n' + oldSplashVideoStart);

fs.writeFileSync(path, content, 'utf8');
console.log('SUCCESS: Festival Campaign tab integrated into page.tsx successfully!');
