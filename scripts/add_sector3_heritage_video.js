const fs = require('fs');
const path = 'c:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/src/app/dashboard/app/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add HeritageVideoConfig interface
const oldInterfaceTarget = `interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;
const newHeritageInterface = `interface HeritageVideoConfig {
  enabled: boolean;
  tag: string;
  title: string;
  subtitle: string;
  video_url: string;
}

interface SplashVideoConfig { enabled: boolean; video_url: string; title: string }`;

if (!content.includes(oldInterfaceTarget)) {
  console.error('ERROR: oldInterfaceTarget not found!');
  process.exit(1);
}
content = content.replace(oldInterfaceTarget, newHeritageInterface);

// 2. Add heritageVideo state and update videoSubTab
const oldSubTabState = `  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'both'>('sector1')`;
const newSubTabState = `  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'sector3' | 'both'>('sector1')`;

if (!content.includes(oldSubTabState)) {
  console.error('ERROR: oldSubTabState not found!');
  process.exit(1);
}
content = content.replace(oldSubTabState, newSubTabState);

// Update useEffect and handleTabChange
const oldTabEffect = `          if (savedTab === 'home_header_video') setVideoSubTab('sector1');
          if (savedTab === 'featured_video') setVideoSubTab('sector2');`;

const newTabEffect = `          if (savedTab === 'home_header_video') setVideoSubTab('sector1');
          if (savedTab === 'featured_video') setVideoSubTab('sector2');
          if (savedTab === 'heritage_video') setVideoSubTab('sector3');`;

if (!content.includes(oldTabEffect)) {
  console.error('ERROR: oldTabEffect not found!');
  process.exit(1);
}
content = content.replace(oldTabEffect, newTabEffect);

const oldTabChange = `    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');`;

const newTabChange = `    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');
    if (value === 'heritage_video') setVideoSubTab('sector3');`;

if (!content.includes(oldTabChange)) {
  console.error('ERROR: oldTabChange not found!');
  process.exit(1);
}
content = content.replace(oldTabChange, newTabChange);

// 3. Add heritageVideo state variable
const oldVideoStateTarget = `  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;
const newHeritageState = `  const [heritageVideo, setHeritageVideo] = useState<HeritageVideoConfig>({
    enabled: true,
    tag: 'HERITAGE IN MOTION',
    title: 'Behind the Craft: Our Sun-Dried Tradition',
    subtitle: 'Watch how our 40-year-old authentic recipes come to life.',
    video_url: 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4'
  })
  const [splashVideo, setSplashVideo] = useState<SplashVideoConfig>({ enabled: true, video_url: '', title: '' })`;

if (!content.includes(oldVideoStateTarget)) {
  console.error('ERROR: oldVideoStateTarget not found!');
  process.exit(1);
}
content = content.replace(oldVideoStateTarget, newHeritageState);

// 4. Update fetchAllContent Promise.all
const oldFetchTarget = `getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)`;

const newFetchTarget = `getDocData('delivery_config'), getDocData('cart_config'), getDocData('billing_config'), getDocData('home_video'), getDocData('splash_video'), getDocData('snacks_with_story'), getDocData('festival_config'), getDocData('featured_video_section'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)`;

if (!content.includes(oldFetchTarget)) {
  console.error('ERROR: oldFetchTarget not found!');
  process.exit(1);
}
content = content.replace(oldFetchTarget, newFetchTarget);

// Update destructuring
const oldDestruct = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, productsRes] = await Promise.all([`;

const newDestruct = `const [bannersDoc, storiesDoc, bentoDoc, catParentDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, kitchenStoryDoc, searchConfigDoc, catPageConfigDoc, deliveryConfigDoc, cartConfigDoc, billingConfigDoc, homeVideoDoc, splashVideoDoc, snackStoryDoc, festivalDoc, heritageVideoDoc, productsRes] = await Promise.all([`;

if (!content.includes(oldDestruct)) {
  console.error('ERROR: oldDestruct not found!');
  process.exit(1);
}
content = content.replace(oldDestruct, newDestruct);

// Populate heritageVideo
const oldPopulateTarget = `      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;
const newHeritagePopulate = `      if (heritageVideoDoc && Object.keys(heritageVideoDoc).length > 0) {
        setHeritageVideo({
          enabled: heritageVideoDoc.enabled ?? true,
          tag: heritageVideoDoc.tag || 'HERITAGE IN MOTION',
          title: heritageVideoDoc.title || 'Behind the Craft: Our Sun-Dried Tradition',
          subtitle: heritageVideoDoc.subtitle || 'Watch how our 40-year-old authentic recipes come to life.',
          video_url: heritageVideoDoc.video_url || 'https://res.cloudinary.com/dxynqm0zo/video/upload/v1790916130/adhvaitha_foods_videos/mxcycwegghdykjsnilyo.mp4'
        });
      }
      if (splashVideoDoc && Object.keys(splashVideoDoc).length > 0) setSplashVideo(splashVideoDoc as SplashVideoConfig)`;

if (!content.includes(oldPopulateTarget)) {
  console.error('ERROR: oldPopulateTarget not found!');
  process.exit(1);
}
content = content.replace(oldPopulateTarget, newHeritagePopulate);

// 5. Update saveCurrentTab
const oldSaveCase = `      case 'festival':
        handleSaveTab('festival_config', festivalConfig)
        break`;

const newSaveCase = `      case 'festival':
        handleSaveTab('festival_config', festivalConfig)
        break
      case 'heritage_video':
      case 'featured_video_section':
        handleSaveTab('featured_video_section', heritageVideo)
        break`;

if (!content.includes(oldSaveCase)) {
  console.error('ERROR: oldSaveCase not found!');
  process.exit(1);
}
content = content.replace(oldSaveCase, newSaveCase);

// 6. Update top save button text
const oldTopSaveBtn = `activeTab === 'home_video'
                    ? 'Save Both Video Sectors'
                    : activeTab === 'festival'
                      ? 'Publish Festival Live'
                      : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\``;

const newTopSaveBtn = `activeTab === 'home_video'
                    ? 'Save All Video Sectors'
                    : activeTab === 'heritage_video'
                      ? 'Save Sector 3 (Heritage Video)'
                      : activeTab === 'festival'
                        ? 'Publish Festival Live'
                        : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\``;

if (!content.includes(oldTopSaveBtn)) {
  console.error('ERROR: oldTopSaveBtn not found!');
  process.exit(1);
}
content = content.replace(oldTopSaveBtn, newTopSaveBtn);

// 7. Update renderSectorSwitcher to include Sector 3
const oldSwitcher = `      <button
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
        <span>Full Mobile View (Both Videos)</span>
      </button>`;

const newSwitcher = `      <button
        type="button"
        onClick={() => {
          setActiveTab('heritage_video');
          setVideoSubTab('sector3');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'heritage_video');
        }}
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'heritage_video' || (activeTab === 'home_video' && videoSubTab === 'sector3')
            ? 'bg-purple-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
      >
        <Video className="h-3.5 w-3.5" />
        <span>Sector 3: Heritage Showcase (After Royal Collections)</span>
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
        <span>Full Mobile View (All 3 Videos)</span>
      </button>`;

if (!content.includes(oldSwitcher)) {
  console.error('ERROR: oldSwitcher not found!');
  process.exit(1);
}
content = content.replace(oldSwitcher, newSwitcher);

// 8. Add renderSector3 helper right before renderDualPreview
const oldDualPreviewStart = `  const renderDualPreview = () => (`;

const renderSector3Def = `  const renderSector3 = () => (
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
          <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold \${
            heritageVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }\`}>
            <span className={\`h-2 w-2 rounded-full \${heritageVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}\`}></span>
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

`;

if (!content.includes(oldDualPreviewStart)) {
  console.error('ERROR: oldDualPreviewStart not found!');
  process.exit(1);
}
content = content.replace(oldDualPreviewStart, renderSector3Def + oldDualPreviewStart);

// 9. Add Sector 3 to renderDualPreview
const oldDualCardTarget = `          {/* SECTOR 2: Featured Video Card Below Header */}
          <div className="bg-[#F8F5EC] p-3 pb-4">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">FEATURED VIDEO SECTION (BELOW HEADER)</p>
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
          </div>`;

const newDualCardTarget = `          {/* SECTOR 2: Featured Video Card Below Header */}
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
          </div>`;

if (!content.includes(oldDualCardTarget)) {
  console.error('ERROR: oldDualCardTarget not found!');
  process.exit(1);
}
content = content.replace(oldDualCardTarget, newDualCardTarget);

// 10. Add TabsTrigger in TabsList
const oldTriggerTarget = `          {/* SECTOR 2 TAB TRIGGER */}
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
          </TabsTrigger>`;

const newTriggers = `          {/* SECTOR 2 TAB TRIGGER */}
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
          </TabsTrigger>`;

if (!content.includes(oldTriggerTarget)) {
  console.error('ERROR: oldTriggerTarget not found!');
  process.exit(1);
}
content = content.replace(oldTriggerTarget, newTriggers);

// 11. Add TabsContent for heritage_video and update home_video
const oldTabsContentBlock = `          {/* SECTOR 2: FEATURED VIDEO (AFTER HEADER) */}
          <TabsContent value="featured_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector2()}
          </TabsContent>

          {/* UNIFIED / LEGACY TAB (BOTH SECTORS) */}
          <TabsContent value="home_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {videoSubTab === 'sector1' && renderSector1()}
            {videoSubTab === 'sector2' && renderSector2()}
            {videoSubTab === 'both' && renderDualPreview()}
          </TabsContent>`;

const newTabsContentBlock = `          {/* SECTOR 2: FEATURED VIDEO (AFTER HEADER) */}
          <TabsContent value="featured_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector2()}
          </TabsContent>

          {/* SECTOR 3: HERITAGE VIDEO SHOWCASE (AFTER ROYAL COLLECTIONS) */}
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

if (!content.includes(oldTabsContentBlock)) {
  console.error('ERROR: oldTabsContentBlock not found!');
  process.exit(1);
}
content = content.replace(oldTabsContentBlock, newTabsContentBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('SUCCESS: Sector 3 Heritage Video Showcase integrated into page.tsx successfully!');
