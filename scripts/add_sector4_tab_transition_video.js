const fs = require('fs');
const path = 'c:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/src/app/dashboard/app/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Loader2, Layers, Clock to imports
const oldImports = `import { Plus, Trash2, Save, Image as ImageIcon, Box, AlertCircle, Video, ExternalLink, Copy, Smartphone, Sparkles, Palette } from 'lucide-react'`;
const newImports = `import { Plus, Trash2, Save, Image as ImageIcon, Box, AlertCircle, Video, ExternalLink, Copy, Smartphone, Sparkles, Palette, Loader2, Layers, Clock } from 'lucide-react'`;

if (!content.includes(oldImports)) {
  console.error('ERROR: oldImports not found!');
  process.exit(1);
}
content = content.replace(oldImports, newImports);

// 2. Add TabTransitionVideoConfig interface
const oldInterfaceTarget = `interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;
const newTabInterface = `interface TabTransitionVideoConfig {
  enabled: boolean;
  duration_ms: number;
  video_url: string;
  caption: string;
  show_spinner: boolean;
}

interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;

if (!content.includes(oldInterfaceTarget)) {
  console.error('ERROR: oldInterfaceTarget not found!');
  process.exit(1);
}
content = content.replace(oldInterfaceTarget, newTabInterface);

// 3. Update videoSubTab state type and add tabTransitionVideo state
const oldSubTabState = `  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'sector3' | 'both'>('sector1')`;
const newSubTabState = `  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'sector3' | 'sector4' | 'both'>('sector1')`;

if (!content.includes(oldSubTabState)) {
  console.error('ERROR: oldSubTabState not found!');
  process.exit(1);
}
content = content.replace(oldSubTabState, newSubTabState);

// Update useEffect and handleTabChange
const oldTabEffect = `          if (savedTab === 'home_header_video') setVideoSubTab('sector1');
          if (savedTab === 'featured_video') setVideoSubTab('sector2');
          if (savedTab === 'heritage_video') setVideoSubTab('sector3');`;

const newTabEffect = `          if (savedTab === 'home_header_video') setVideoSubTab('sector1');
          if (savedTab === 'featured_video') setVideoSubTab('sector2');
          if (savedTab === 'heritage_video') setVideoSubTab('sector3');
          if (savedTab === 'tab_transition_video') setVideoSubTab('sector4');`;

if (!content.includes(oldTabEffect)) {
  console.error('ERROR: oldTabEffect not found!');
  process.exit(1);
}
content = content.replace(oldTabEffect, newTabEffect);

const oldTabChange = `    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');
    if (value === 'heritage_video') setVideoSubTab('sector3');`;

const newTabChange = `    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');
    if (value === 'heritage_video') setVideoSubTab('sector3');
    if (value === 'tab_transition_video') setVideoSubTab('sector4');`;

if (!content.includes(oldTabChange)) {
  console.error('ERROR: oldTabChange not found!');
  process.exit(1);
}
content = content.replace(oldTabChange, newTabChange);

// Add tabTransitionVideo state variable
const oldVideoStateTarget = `  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;
const newTabTransitionState = `  const [tabTransitionVideo, setTabTransitionVideo] = useState<TabTransitionVideoConfig>({
    enabled: true,
    duration_ms: 1200,
    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
    caption: 'Swapping Heritage Kitchens...',
    show_spinner: true
  })
  const [isSimulatingTabSwitch, setIsSimulatingTabSwitch] = useState(false)
  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;

if (!content.includes(oldVideoStateTarget)) {
  console.error('ERROR: oldVideoStateTarget not found!');
  process.exit(1);
}
content = content.replace(oldVideoStateTarget, newTabTransitionState);

// 4. Update fetchAllContent Promise.all
const oldFetchTarget = `getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'), getDocData('featured_video_section'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)`;

const newFetchTarget = `getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'), getDocData('featured_video_section'), getDocData('tab_transition_video'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)`;

if (!content.includes(oldFetchTarget)) {
  console.error('ERROR: oldFetchTarget not found!');
  process.exit(1);
}
content = content.replace(oldFetchTarget, newFetchTarget);

// Update destructuring
const oldDestruct = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, heritageVideoDoc, productsRes] = await Promise.all([`;

const newDestruct = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, heritageVideoDoc, tabTransitionDoc, productsRes] = await Promise.all([`;

if (!content.includes(oldDestruct)) {
  console.error('ERROR: oldDestruct not found!');
  process.exit(1);
}
content = content.replace(oldDestruct, newDestruct);

// Populate tabTransitionVideo
const oldPopulateTarget = `      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;
const newTabPopulate = `      if (tabTransitionDoc && Object.keys(tabTransitionDoc).length > 0) {
        setTabTransitionVideo({
          enabled: tabTransitionDoc.enabled ?? true,
          duration_ms: tabTransitionDoc.duration_ms || 1200,
          video_url: tabTransitionDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4',
          caption: tabTransitionDoc.caption || 'Swapping Heritage Kitchens...',
          show_spinner: tabTransitionDoc.show_spinner ?? true
        });
      }
      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;

if (!content.includes(oldPopulateTarget)) {
  console.error('ERROR: oldPopulateTarget not found!');
  process.exit(1);
}
content = content.replace(oldPopulateTarget, newTabPopulate);

// 5. Update saveCurrentTab
const oldSaveCase = `      case 'heritage_video':
      case 'featured_video_section':
        handleSaveTab('featured_video_section', heritageVideo)
        break`;

const newSaveCase = `      case 'heritage_video':
      case 'featured_video_section':
        handleSaveTab('featured_video_section', heritageVideo)
        break
      case 'tab_transition_video':
        handleSaveTab('tab_transition_video', tabTransitionVideo)
        break`;

if (!content.includes(oldSaveCase)) {
  console.error('ERROR: oldSaveCase not found!');
  process.exit(1);
}
content = content.replace(oldSaveCase, newSaveCase);

// 6. Update top save button text
const oldTopSaveBtn = `activeTab === 'home_video'
                    ? 'Save All Video Sectors'
                    : activeTab === 'heritage_video'
                      ? 'Save Sector 3 (Heritage Video)'
                      : activeTab === 'festival'
                        ? 'Publish Festival Live'
                        : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\``;

const newTopSaveBtn = `activeTab === 'home_video'
                    ? 'Save All Video Sectors'
                    : activeTab === 'heritage_video'
                      ? 'Save Sector 3 (Heritage Video)'
                      : activeTab === 'tab_transition_video'
                        ? 'Save Sector 4 (Tab Switch Video)'
                        : activeTab === 'festival'
                          ? 'Publish Festival Live'
                          : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\``;

if (!content.includes(oldTopSaveBtn)) {
  console.error('ERROR: oldTopSaveBtn not found!');
  process.exit(1);
}
content = content.replace(oldTopSaveBtn, newTopSaveBtn);

// 7. Update renderSectorSwitcher to include Sector 4
const oldSwitcherButton = `      <button
        type="button"
        onClick={() => {
          setActiveTab('home_video');
          setVideoSubTab('both');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'home_video');
        }}
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'home_video' && videoSubTab === 'both'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span>Full Mobile View (All 3 Videos)</span>
      </button>`;

const newSwitcherButtons = `      <button
        type="button"
        onClick={() => {
          setActiveTab('tab_transition_video');
          setVideoSubTab('sector4');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'tab_transition_video');
        }}
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'tab_transition_video' || (activeTab === 'home_video' && videoSubTab === 'sector4')
            ? 'bg-emerald-700 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
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
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'home_video' && videoSubTab === 'both'
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
      >
        <Smartphone className="h-3.5 w-3.5" />
        <span>Full Mobile View (All Videos)</span>
      </button>`;

if (!content.includes(oldSwitcherButton)) {
  console.error('ERROR: oldSwitcherButton not found!');
  process.exit(1);
}
content = content.replace(oldSwitcherButton, newSwitcherButtons);

// 8. Add renderSector4 helper right before renderDualPreview
const oldDualPreviewStart = `  const renderDualPreview = () => (`;

const renderSector4Def = `  const renderSector4 = () => (
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
          <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold \${
            tabTransitionVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }\`}>
            <span className={\`h-2 w-2 rounded-full \${tabTransitionVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}\`}></span>
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

            {/* Direct Cloudinary Video Upload */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Upload Transition Video File (Direct to Cloudinary)
                </label>
                {tabTransitionVideo.video_url && (
                  <a 
                    href={tabTransitionVideo.video_url} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Preview in new tab
                  </a>
                )}
              </div>
              <VideoUpload 
                value={tabTransitionVideo.video_url} 
                onChange={url => setTabTransitionVideo(prev => ({ ...prev, video_url: url }))} 
              />
              <p className="text-xs text-slate-500">
                Upload any short looping MP4 video (cooking process, gold sparkles, ladle stirring pickle, sweets packaging).
              </p>
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

            <div className="w-full max-w-[340px] rounded-[28px] overflow-hidden border-[4px] border-slate-900 shadow-2xl bg-[#F8F5EC] relative h-[440px] flex flex-col justify-between">
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
                  className={\`absolute inset-0 z-20 flex flex-col items-center justify-center p-4 transition-opacity duration-300 \${
                    isSimulatingTabSwitch ? 'opacity-100' : 'opacity-95'
                  }\`}
                  style={{ backgroundColor: 'rgba(24, 69, 59, 0.94)' }}
                >
                  {/* Video Box with Gold Border */}
                  <div 
                    className="w-44 h-44 rounded-2xl overflow-hidden shadow-2xl relative bg-black shrink-0"
                    style={{ border: '3px solid #F6C453' }}
                  >
                    {tabTransitionVideo.video_url ? (
                      <video 
                        src={tabTransitionVideo.video_url} 
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                        No Video
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

`;

if (!content.includes(oldDualPreviewStart)) {
  console.error('ERROR: oldDualPreviewStart not found!');
  process.exit(1);
}
content = content.replace(oldDualPreviewStart, renderSector4Def + oldDualPreviewStart);

// 9. Add TabsTrigger in TabsList
const oldHeritageTriggerTarget = `          {/* SECTOR 3 TAB TRIGGER */}
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
          </TabsTrigger>`;

const newTriggers = `          {/* SECTOR 3 TAB TRIGGER */}
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
          </TabsTrigger>`;

if (!content.includes(oldHeritageTriggerTarget)) {
  console.error('ERROR: oldHeritageTriggerTarget not found!');
  process.exit(1);
}
content = content.replace(oldHeritageTriggerTarget, newTriggers);

// 10. Add TabsContent for tab_transition_video and update home_video
const oldTabsContentTarget = `          {/* SECTOR 3: HERITAGE VIDEO SHOWCASE (AFTER ROYAL COLLECTIONS) */}
          <TabsContent value="heritage_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector3()}
          </TabsContent>

          {/* UNIFIED / LEGACY TAB (ALL SECTORS) */}
          <TabsContent value="home_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {videoSubTab === 'sector1' && renderSector1()}
            {videoSubTab === 'sector2' && renderSector2()}
            {videoSubTab === 'sector3' && renderSector3()}
            {videoSubTab === 'both' && renderDualPreview()}
          </TabsContent>`;

const newTabsContentTarget = `          {/* SECTOR 3: HERITAGE VIDEO SHOWCASE (AFTER ROYAL COLLECTIONS) */}
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
          </TabsContent>`;

if (!content.includes(oldTabsContentTarget)) {
  console.error('ERROR: oldTabsContentTarget not found!');
  process.exit(1);
}
content = content.replace(oldTabsContentTarget, newTabsContentTarget);

fs.writeFileSync(path, content, 'utf8');
console.log('SUCCESS: Sector 4 Tab Transition Video Overlay integrated into page.tsx successfully!');
