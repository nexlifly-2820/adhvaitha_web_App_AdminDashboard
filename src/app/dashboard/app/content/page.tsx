'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Image as ImageIcon, Box } from 'lucide-react'
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ImageUpload } from '@/components/ImageUpload'

// Schemas based on Data Guide
interface MainBanner { title: string; sub: string; img: string }
interface AdBanner { tag: string; title: string; sub: string; img: string }
interface Story { label: string; icon: string; tag: string }
interface BentoSelection { section_title: string; best_seller_product: string; card1_label: string; card2_label: string; card2_sub: string; card2_icon: string; card3_label: string; card3_sub: string; card3_icon: string }
interface Category { label: string; img: string }
interface Coupon { code: string; title: string; sub: string }
interface Packaging { title: string; desc: string; img: string }
interface OnboardingStep { title: string; subtitle: string; desc: string; img: string }
interface TasteOption { title: string; sub: string; icon: string; color: string }
interface Pairing { title: string; pairing: string; desc: string; product_name: string; image: string }

export default function ContentManager() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('banners')

  // Data States
  const [mainBanners, setMainBanners] = useState<MainBanner[]>([])
  const [adBanners, setAdBanners] = useState<AdBanner[]>([])
  
  const [stories, setStories] = useState<Story[]>([])
  
  const [bento, setBento] = useState<BentoSelection>({
    section_title: '', best_seller_product: '', card1_label: '', card2_label: '', card2_sub: '', card2_icon: '', card3_label: '', card3_sub: '', card3_icon: ''
  })
  
  const [categories, setCategories] = useState<Category[]>([])
  const [deals, setDeals] = useState<{product_names: string[], end_time: string | null, title: string}>({
    product_names: [], end_time: null, title: 'DEALS OF THE DAY'
  })
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [packaging, setPackaging] = useState<Packaging[]>([])
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>([])
  const [tasteOptions, setTasteOptions] = useState<TasteOption[]>([])
  
  // Pairing & Products State
  const [pairings, setPairings] = useState<Pairing[]>([])
  const [productNames, setProductNames] = useState<string[]>([])
  const [allProducts, setAllProducts] = useState<any[]>([])

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

      const [bannersDoc, storiesDoc, bentoDoc, catDoc, dealsDoc, couponsDoc, pkgDoc, onboardDoc, pairingsDoc, productsRes] = await Promise.all([
        getDocData('banners'), getDocData('stories'), getDocData('bento_selection'),
        getDocData('categories'), getDocData('deals'), getDocData('coupons'), getDocData('packaging'), getDocData('onboarding'), getDocData('pairings'),
        fetch('/dashboard/app/api/products').then(res => res.json()).catch(() => null)
      ])

      if (bannersDoc) {
        setMainBanners(bannersDoc.main_banners || [])
        setAdBanners(bannersDoc.ad_banners || [])
      }
      if (storiesDoc) setStories(storiesDoc.list || [])
      if (bentoDoc) setBento(bentoDoc as BentoSelection)
      if (catDoc) setCategories(catDoc.list || [])
      if (dealsDoc) {
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
      if (couponsDoc) setCoupons(couponsDoc.active_list || [])
      if (pkgDoc) setPackaging(pkgDoc.list || [])
      if (onboardDoc) {
        setOnboardingSteps(onboardDoc.steps || [])
        setTasteOptions(onboardDoc.taste_options || [])
      }
      if (pairingsDoc) setPairings(pairingsDoc.list || [])
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
        let endTimeTimestamp = null;
        if (deals.end_time) {
          endTimeTimestamp = Timestamp.fromDate(new Date(deals.end_time));
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

      await Promise.all([
        setDoc(doc(db, 'app_data', 'banners'), {
          main_banners: [{ title: 'Handmade Pickles', sub: 'Since 1982', img: img1 }],
          ad_banners: [{ tag: 'FEATURED', title: 'Summer Sale', sub: 'Up to 20% off', img: img2 }]
        }),
        setDoc(doc(db, 'app_data', 'stories'), {
          list: [
            { label: 'Our Origin', icon: 'auto_stories', tag: 'ORIGIN' },
            { label: 'Packaging', icon: 'inventory_2', tag: 'PACKAGING' }
          ]
        }),
        setDoc(doc(db, 'app_data', 'bento_selection'), {
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
        setDoc(doc(db, 'app_data', 'categories'), {
          list: [
            { label: 'Pickles', img: img1 },
            { label: 'Sweets', img: img2 },
            { label: 'Spices', img: img3 }
          ]
        }),
        setDoc(doc(db, 'app_data', 'deals'), {
          product_names: [defaultProduct],
          end_time: Timestamp.fromDate(new Date(Date.now() + 86400000)),
          title: 'DEALS OF THE DAY'
        }),
        setDoc(doc(db, 'app_data', 'coupons'), {
          active_list: [{ code: 'ROYAL10', title: '10% OFF', sub: 'On your first order' }]
        }),
        setDoc(doc(db, 'app_data', 'packaging'), {
          list: [{ title: 'Premium Glass Jars', desc: 'Sealed for freshness', img: img4 }]
        }),
        setDoc(doc(db, 'app_data', 'onboarding'), {
          steps: [
            { title: 'Welcome to Adhvaitha', subtitle: 'Authentic Taste', desc: 'Discover the traditional flavors of our handmade delicacies.', img: img1 }
          ],
          taste_options: [
            { title: 'Spicy', sub: 'Traditional heat', icon: 'local_fire_department', color: '#ff4500' },
            { title: 'Sweet', sub: 'Pure jaggery', icon: 'eco', color: '#8b4513' }
          ]
        }),
        setDoc(doc(db, 'app_data', 'pairings'), {
          list: [
            { title: 'THE COASTAL CLASSIC', pairing: 'Rice + Ghee + Avakaya', desc: 'A timeless combination that brings out the best of Andhra flavors.', product_name: defaultProduct, image: img1 }
          ]
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
          <Button onClick={handleSeedData} disabled={isSaving} variant="outline" className="text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
            Seed Demo Data
          </Button>
          <Button onClick={saveCurrentTab} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : `Save ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex gap-6 flex-col lg:flex-row">
        <TabsList className="flex flex-col justify-start h-auto bg-slate-100 dark:bg-slate-900 w-full lg:w-48 items-stretch p-2 gap-2 shrink-0">
          <TabsTrigger value="banners" className="justify-start data-[state=active]:bg-white">Banners</TabsTrigger>
          <TabsTrigger value="stories" className="justify-start data-[state=active]:bg-white">Stories</TabsTrigger>
          <TabsTrigger value="bento" className="justify-start data-[state=active]:bg-white">Bento Selection</TabsTrigger>
          <TabsTrigger value="categories" className="justify-start data-[state=active]:bg-white">Categories</TabsTrigger>
          <TabsTrigger value="deals" className="justify-start data-[state=active]:bg-white">Deals of the Day</TabsTrigger>
          <TabsTrigger value="coupons" className="justify-start data-[state=active]:bg-white">Active Coupons</TabsTrigger>
          <TabsTrigger value="packaging" className="justify-start data-[state=active]:bg-white">Packaging</TabsTrigger>
          <TabsTrigger value="onboarding" className="justify-start data-[state=active]:bg-white">Onboarding</TabsTrigger>
          <TabsTrigger value="pairings" className="justify-start data-[state=active]:bg-white">Art of Pairing</TabsTrigger>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COUPONS */}
          <TabsContent value="coupons" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div><CardTitle>Active Coupons</CardTitle><CardDescription>Discount codes displayed in the app</CardDescription></div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setCoupons, { code: '', title: '', sub: '' })}>+ Add Coupon</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {coupons.map((coupon, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-3 border rounded">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <Input placeholder="Code (e.g. ROYAL10)" value={coupon.code} onChange={e => updateArray(setCoupons, idx, 'code', e.target.value)} />
                      <Input placeholder="Title" value={coupon.title} onChange={e => updateArray(setCoupons, idx, 'title', e.target.value)} />
                      <Input placeholder="Subtitle" value={coupon.sub} onChange={e => updateArray(setCoupons, idx, 'sub', e.target.value)} className="col-span-2" />
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

          {/* ART OF PAIRING */}
          <TabsContent value="pairings" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row justify-between items-center pb-2 border-b mb-4">
                <div>
                  <CardTitle>The Art of Pairing</CardTitle>
                  <CardDescription>Manage the beautiful pairing cards shown in the app.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addToArray(setPairings, { title: '', pairing: '', desc: '', product_name: '', image: '' })}>
                  + Add Pairing
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {pairings.map((pairing, idx) => (
                  <div key={idx} className="flex flex-col gap-4 p-4 border rounded bg-slate-50 dark:bg-slate-900/50">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300">Pairing #{idx + 1}</h4>
                      <Button variant="ghost" className="text-red-500 h-8 w-8 p-0" onClick={() => removeFromArray(setPairings, idx)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Top Tag (Title)</label>
                          <Input placeholder="e.g. THE COASTAL CLASSIC" value={pairing.title} onChange={e => updateArray(setPairings, idx, 'title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Main Pairing Text</label>
                          <Input placeholder="e.g. Rice + Ghee + Avakaya" value={pairing.pairing} onChange={e => updateArray(setPairings, idx, 'pairing', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                          <textarea 
                            value={pairing.desc} 
                            onChange={e => updateArray(setPairings, idx, 'desc', e.target.value)}
                            className="w-full min-h-[80px] rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950" 
                            placeholder="Describe the pairing..."
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Linked Product</label>
                          <select 
                            value={pairing.product_name} 
                            onChange={e => updateArray(setPairings, idx, 'product_name', e.target.value)}
                            className="w-full rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950"
                          >
                            <option value="">-- Select a Product --</option>
                            {productNames.map(name => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                          <p className="text-[10px] text-slate-400">This ensures the exact spelling matches your database.</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-slate-500 uppercase">Background Image</label>
                          <ImageUpload value={pairing.image} onChange={url => updateArray(setPairings, idx, 'image', url)} folder="app_content" />
                        </div>
                      </div>
                    </div>
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
