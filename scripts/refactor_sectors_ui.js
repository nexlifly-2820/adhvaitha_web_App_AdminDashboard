const fs = require('fs');
const path = 'c:/Users/DELL/OneDrive/Documents/adhvaitha_web_App_AdminDashboard/src/app/dashboard/app/content/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add videoSubTab state
const oldStateBlock = `  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('banners')

  // Load saved tab on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('contentActiveTab');
      if (savedTab) {
        setActiveTab(savedTab);
      }
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentActiveTab', value);
    }
  };`;

const newStateBlock = `  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('banners')
  const [videoSubTab, setVideoSubTab] = useState<'sector1' | 'sector2' | 'both'>('sector1')

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
        }
      }
    }
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'home_header_video') setVideoSubTab('sector1');
    if (value === 'featured_video') setVideoSubTab('sector2');
    if (typeof window !== 'undefined') {
      localStorage.setItem('contentActiveTab', value);
    }
  };`;

if (!content.includes(oldStateBlock)) {
  console.error('ERROR: oldStateBlock not found!');
  process.exit(1);
}
content = content.replace(oldStateBlock, newStateBlock);

// 2. Update saveCurrentTab switch
const oldSwitchCase = `      case 'home_video':
        handleSaveTab('home_video', homeVideo)
        break`;

const newSwitchCase = `      case 'home_header_video':
      case 'featured_video':
      case 'home_video':
        handleSaveTab('home_video', homeVideo)
        break`;

if (!content.includes(oldSwitchCase)) {
  console.error('ERROR: oldSwitchCase not found!');
  process.exit(1);
}
content = content.replace(oldSwitchCase, newSwitchCase);

// 3. Update top save button text
const oldSaveBtn = `<Button onClick={saveCurrentTab} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\`}
          </Button>`;

const newSaveBtn = `<Button onClick={saveCurrentTab} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving 
              ? 'Saving...' 
              : activeTab === 'home_header_video' 
                ? 'Save Sector 1 (Header Video)' 
                : activeTab === 'featured_video' 
                  ? 'Save Sector 2 (After Header Video)' 
                  : activeTab === 'home_video'
                    ? 'Save Both Video Sectors'
                    : \`Save \${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}\`}
          </Button>`;

if (!content.includes(oldSaveBtn)) {
  console.error('ERROR: oldSaveBtn not found!');
  process.exit(1);
}
content = content.replace(oldSaveBtn, newSaveBtn);

// 4. Update TabsTrigger
const oldTrigger = `          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>
          <TabsTrigger value="home_video" className="justify-start data-[state=active]:bg-white flex items-center justify-between group">
            <span className="flex items-center gap-2">
              <Video className="h-4 w-4 text-orange-600" />
              <span>Home Header Video</span>
            </span>
            <span className="text-[10px] bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold px-1.5 py-0.5 rounded uppercase">Opt 1</span>
          </TabsTrigger>
          <TabsTrigger value="stories" className="justify-start data-[state=active]:bg-white">Stories</TabsTrigger>`;

const newTrigger = `          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>
          
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

          <TabsTrigger value="stories" className="justify-start data-[state=active]:bg-white">Stories</TabsTrigger>`;

if (!content.includes(oldTrigger)) {
  console.error('ERROR: oldTrigger not found!');
  process.exit(1);
}
content = content.replace(oldTrigger, newTrigger);

// 5. Add render functions before `if (isLoading)`
const renderFunctions = `  // Sector switchers & Render Helpers for Dual Video Sectors
  const renderSectorSwitcher = () => (
    <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-fit mb-5">
      <button
        type="button"
        onClick={() => {
          setActiveTab('home_header_video');
          setVideoSubTab('sector1');
          if (typeof window !== 'undefined') localStorage.setItem('contentActiveTab', 'home_header_video');
        }}
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'home_header_video' || (activeTab === 'home_video' && videoSubTab === 'sector1')
            ? 'bg-orange-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
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
        className={\`px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 \${
          activeTab === 'featured_video' || (activeTab === 'home_video' && videoSubTab === 'sector2')
            ? 'bg-blue-600 text-white shadow'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 dark:hover:bg-slate-800'
        }\`}
      >
        <Video className="h-3.5 w-3.5" />
        <span>Sector 2: After Home Header Video</span>
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
        <span>Full Mobile View (Both Videos)</span>
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
          <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold \${
            homeVideo.header_video_enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
          }\`}>
            <span className={\`h-2 w-2 rounded-full \${homeVideo.header_video_enabled ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}\`}></span>
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
          <span className={\`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold \${
            homeVideo.enabled 
              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
              : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
          }\`}>
            <span className={\`h-2 w-2 rounded-full \${homeVideo.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}\`}></span>
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
`;

const oldIsLoadingLine = `  if (isLoading) return <div className="flex h-[400px] items-center justify-center">Loading Content...</div>`;
if (!content.includes(oldIsLoadingLine)) {
  console.error('ERROR: oldIsLoadingLine not found!');
  process.exit(1);
}
content = content.replace(oldIsLoadingLine, renderFunctions + '\n\n' + oldIsLoadingLine);

// 6. Replace TabsContent for home_video
const oldTabsContentStart = `          {/* HOME VIDEO (TWO DISTINCT SECTORS) */}
          <TabsContent value="home_video" className="mt-0 space-y-6">`;

const oldTabsContentEnd = `            </Card>
          </TabsContent>
          
          {/* SPLASH VIDEO */}`;

const startIndex = content.indexOf(oldTabsContentStart);
const endIndex = content.indexOf(oldTabsContentEnd);

if (startIndex === -1 || endIndex === -1) {
  console.error('ERROR: oldTabsContent boundaries not found!');
  process.exit(1);
}

const newTabsContentBlock = `          {/* SECTOR 1: HOME HEADER VIDEO */}
          <TabsContent value="home_header_video" className="mt-0 space-y-4">
            {renderSectorSwitcher()}
            {renderSector1()}
          </TabsContent>

          {/* SECTOR 2: FEATURED VIDEO (AFTER HEADER) */}
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
          </TabsContent>
          
          {/* SPLASH VIDEO */}`;

content = content.substring(0, startIndex) + newTabsContentBlock + content.substring(endIndex + oldTabsContentEnd.length - '          {/* SPLASH VIDEO */}'.length);

fs.writeFileSync(path, content, 'utf8');
console.log('SUCCESS: page.tsx successfully updated with Sector 1 and Sector 2!');
