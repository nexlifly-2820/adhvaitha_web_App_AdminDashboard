'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Image as ImageIcon, Box } from 'lucide-react'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from '@/components/ImageUpload'

// Schemas based on Data Guide
interface MainBanner { title: string; sub: string; img: string }
interface AdBanner { tag: string; title: string; sub: string; img: string }
interface Story { label: string; icon: string; tag: string }
interface BentoSelection { section_title: string; best_seller_product: string; card1_label: string; card2_label: string; card2_icon: string; card3_label: string }
interface Category { label: string; img: string }
interface Coupon { code: string; title: string; sub: string; min: string; color: string }
interface Packaging { title: string; desc: string; img: string }
interface OnboardingStep { title: string; subtitle: string; desc: string; img: string }
interface TasteOption { title: string; sub: string; icon: string; color: string }

export default function ContentManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('banners')

  // Data States
  const [mainBanners, setMainBanners] = useState<MainBanner[]>([])
  const [adBanners, setAdBanners] = useState<AdBanner[]>([])
  
  const [stories, setStories] = useState<Story[]>([])
  
  const [bento, setBento] = useState<BentoSelection>({
    section_title: '', best_seller_product: '', card1_label: '', card2_label: '', card2_icon: '', card3_label: ''
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [deals, setDeals] = useState<string[]>([])
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [packaging, setPackaging] = useState<Packaging[]>([])
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([])
  const [tasteOptions, setTasteOptions] = useState<TasteOption[]>([])

  useEffect(() => {
    fetchAllContent()
  }, [])

  const fetchAllContent = async () => {
    setIsLoading(true)
    try {
      const getDocData = async (docId: string) => {
        const snap = await getDoc(doc(db, 'app_data', docId))
        return snap.exists() ? snap.data() : null
      }

      const [bannersDoc, storiesDoc, bentoDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc] = await Promise.all([
        getDocData('banners'), getDocData('stories'), getDocData('bento_selection'),
        getDocData('categories'), getDocData('deals'), getDocData('coupons'), getDocData('packaging'), getDocData('onboarding')
      ])

      if (bannersDoc) {
        setMainBanners(bannersDoc.main_banners || [])
        setAdBanners(bannersDoc.ad_banners || [])
      }
      if (storiesDoc) setStories(storiesDoc.list || [])
      if (bentoDoc) setBento(bentoDoc as BentoSelection)
      if (catDoc) setCategories(catDoc.list || [])
      if (dealsDoc) setDeals(dealsDoc.product_names || [])
      if (couponsDoc) setCoupons(couponsDoc.active_list || [])
      if (pkgDoc) setPackaging(pkgDoc.list || [])
      if (onboardDoc) {
        setOnboardingSteps(onboardDoc.steps || [])
        setTasteOptions(onboardDoc.taste_options || [])
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
      await setDoc(doc(db, 'app_data', docId), data)
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
        handleSaveTab('banners', { main_banners: mainBanners, ad_banners: adBanners })
        break
      case 'stories':
        handleSaveTab('stories', { list: stories })
        break
      case 'bento':
        handleSaveTab('bento_selection', bento)
        break
      case 'categories':
        handleSaveTab('categories', { list: categories })
        break
      case 'deals':
        handleSaveTab('deals', { product_names: deals })
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

  if (isLoading) return <div className="flex h-[400px] items-center justify-center">Loading Content...</div>

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-[#f97316]" />
            App Content Manager
          </h2>
          <p className="text-slate-500">Manage all app_data documents reflecting directly in the app.</p>
        </div>
        <Button onClick={saveCurrentTab} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : `Save ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex gap-6 flex-col lg:flex-row">
        <TabsList className="flex flex-col h-auto bg-slate-100 dark:bg-slate-900 w-full lg:w-48 items-stretch p-2 gap-2 shrink-0">
          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>
          <TabsTrigger value="stories" className="justify-start data-[state=active]:bg-white">Stories</TabsTrigger>
          <TabsTrigger value="bento" className="justify-start data-[state=active]:bg-white">Bento Selection</TabsTrigger>
          <TabsTrigger value="categories" className="justify-start data-[state=active]:bg-white">Categories</TabsTrigger>
          <TabsTrigger value="deals" className="justify-start data-[state=active]:bg-white">Deals of the Day</TabsTrigger>
          <TabsTrigger value="coupons" className="justify-start data-[state=active]:bg-white">Active Coupons</TabsTrigger>
          <TabsTrigger value="packaging" className="justify-start data-[state=active]:bg-white">Packaging</TabsTrigger>
          <TabsTrigger value="onboarding" className="justify-start data-[state=active]:bg-white">Onboarding</TabsTrigger>
        </TabsList>
        
        <div className="flex-1 min-w-0">
          {/* BANNERS */}
          <TabsContent value="banners" className="mt-0 space-y-6">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Main Banners</CardTitle><CardDescription>Hero carousels at the very top</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setMainBanners, { title: '', sub: '', img: '' })}>+ Add Main</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {mainBanners.map((banner, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 space-y-2">
                      <Input placeholder="Title" value={banner.title} onChange={e => updateArray(setMainBanners, idx, 'title', e.target.value)} />
                      <Input placeholder="Subtitle" value={banner.sub} onChange={e => updateArray(setMainBanners, idx, 'sub', e.target.value)} />
                      <ImageUpload value={banner.img} onChange={url => updateArray(setMainBanners, idx, 'img', url)} folder="app_content" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setMainBanners, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Ad Banners</CardTitle><CardDescription>Secondary promotional banners</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setAdBanners, { tag: '', title: '', sub: '', img: '' })}>+ Add Ad</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {adBanners.map((banner, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Tag (e.g. MEGA DEAL)" value={banner.tag} onChange={e => updateArray(setAdBanners, idx, 'tag', e.target.value)} className="w-1/3" />
                        <Input placeholder="Title" value={banner.title} onChange={e => updateArray(setAdBanners, idx, 'title', e.target.value)} className="w-2/3" />
                      </div>
                      <Input placeholder="Subtitle" value={banner.sub} onChange={e => updateArray(setAdBanners, idx, 'sub', e.target.value)} />
                      <ImageUpload value={banner.img} onChange={url => updateArray(setAdBanners, idx, 'img', url)} folder="app_content" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setAdBanners, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
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
                    <label className="text-sm font-medium">Card 2 Icon</label>
                    <Input value={bento.card2_icon} onChange={e => setBento({...bento, card2_icon: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Card 3 Label</label>
                    <Input value={bento.card3_label} onChange={e => setBento({...bento, card3_label: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CATEGORIES */}
          <TabsContent value="categories" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Royal Collections (Categories)</CardTitle><CardDescription>App category icons</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCategories, { label: '', img: '' })}>+ Add Category</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex gap-4 items-center p-3 border rounded">
                    <div className="flex-1 flex gap-2">
                      <Input placeholder="Label" value={cat.label} onChange={e => updateArray(setCategories, idx, 'label', e.target.value)} className="w-1/3" />
                      <ImageUpload value={cat.img} onChange={url => updateArray(setCategories, idx, 'img', url)} folder="app_content" className="w-2/3" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setCategories, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* DEALS OF THE DAY */}
          <TabsContent value="deals" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Deals of the Day</CardTitle><CardDescription>Exact product names to feature in the dark deals section.</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setDeals, '')}>+ Add Deal Product</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {deals.map((deal, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <Input placeholder="Exact Product Name (e.g., Bellam Avakaya)" value={deal} onChange={e => {
                      const n = [...deals]; n[idx] = e.target.value; setDeals(n)
                    }} />
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setDeals, idx)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* COUPONS */}
          <TabsContent value="coupons" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Active Coupons</CardTitle><CardDescription>Discount codes displayed in the app</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCoupons, { code: '', title: '', sub: '', min: '', color: '' })}>+ Add Coupon</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {coupons.map((coupon, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 border rounded">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input placeholder="Code (e.g. WELCOME10)" value={coupon.code} onChange={e => updateArray(setCoupons, idx, 'code', e.target.value)} />
                      <div className="flex gap-2">
                        <div className="relative w-10 h-10 overflow-hidden rounded border shrink-0">
                          <input 
                            type="color" 
                            title="Pick a color"
                            value={coupon.color?.startsWith('0xFF') ? '#' + coupon.color.slice(4) : (coupon.color?.startsWith('#') ? coupon.color : '#000000')} 
                            onChange={e => updateArray(setCoupons, idx, 'color', '0xFF' + e.target.value.slice(1).toUpperCase())} 
                            className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                          />
                        </div>
                        <Input placeholder="Color Hex (e.g. 0xFF18453B)" value={coupon.color} onChange={e => updateArray(setCoupons, idx, 'color', e.target.value)} />
                      </div>
                      <Input placeholder="Title" value={coupon.title} onChange={e => updateArray(setCoupons, idx, 'title', e.target.value)} />
                      <Input placeholder="Subtitle" value={coupon.sub} onChange={e => updateArray(setCoupons, idx, 'sub', e.target.value)} />
                      <Input placeholder="Minimum Order Text" value={coupon.min} onChange={e => updateArray(setCoupons, idx, 'min', e.target.value)} className="col-span-2" />
                    </div>
                    <Button variant="ghost" className="text-red-500" onClick={() => removeFromArray(setCoupons, idx)}><Trash2 className="h-4 w-4" /></Button>
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
                <Button variant="outline" size="sm" onClick={() => addToArray(setOnboardingSteps, { title: '', subtitle: '', desc: '', img: '' })}>+ Add Step</Button>
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
        </div>
      </Tabs>
    </div>
  )
}
