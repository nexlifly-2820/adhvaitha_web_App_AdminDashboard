'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase-app'

export default function SettingsPage() {
  // Banners & Coupons
  const [coupons, setCoupons] = useState<any[]>([])
  const [mainBanners, setMainBanners] = useState<string[]>([])
  const [adBanners, setAdBanners] = useState<string[]>([])
  
  // App Homepage Data
  const [stories, setStories] = useState<{label: string, icon: string, tag: string}[]>([])
  const [bento, setBento] = useState({best_seller_product: '', section_title: '', card2_label: '', card2_category: ''})
  const [deals, setDeals] = useState<string[]>([])
  const [packaging, setPackaging] = useState<{title: string, desc: string, img: string}[]>([])
  const [categories, setCategories] = useState<{label: string, img: string}[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({})

  const fetchAppData = async () => {
    try {
      setIsLoading(true)
      const [couponsRes, bannersRes, storiesRes, bentoRes, dealsRes, packagingRes, categoriesRes] = await Promise.all([
        fetch('/dashboard/app/api/app-data?docId=coupons'),
        fetch('/dashboard/app/api/app-data?docId=banners'),
        fetch('/dashboard/app/api/app-data?docId=stories'),
        fetch('/dashboard/app/api/app-data?docId=bento_selection'),
        fetch('/dashboard/app/api/app-data?docId=deals'),
        fetch('/dashboard/app/api/app-data?docId=packaging'),
        fetch('/dashboard/app/api/app-data?docId=categories')
      ])
      
      const cData = await couponsRes.json()
      if (cData.success && cData.data?.active_list) setCoupons(cData.data.active_list)

      const bData = await bannersRes.json()
      if (bData.success && bData.data) {
        setMainBanners(bData.data.main_banners || [])
        setAdBanners(bData.data.ad_banners || [])
      }

      const sData = await storiesRes.json()
      if (sData.success && sData.data?.list) setStories(sData.data.list)

      const bentoData = await bentoRes.json()
      if (bentoData.success && bentoData.data) {
        setBento({
          best_seller_product: bentoData.data.best_seller_product || '',
          section_title: bentoData.data.section_title || '',
          card2_label: bentoData.data.card2_label || '',
          card2_category: bentoData.data.card2_category || ''
        })
      }

      const dData = await dealsRes.json()
      if (dData.success && dData.data?.product_names) setDeals(dData.data.product_names)

      const pData = await packagingRes.json()
      if (pData.success && pData.data?.list) setPackaging(pData.data.list)

      const catData = await categoriesRes.json()
      if (catData.success && catData.data?.list) setCategories(catData.data.list)

    } catch (err) {
      console.error('Error fetching app data', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAppData()
  }, [])

  // Generic Save Handler
  const saveDocument = async (docId: string, data: any, stateKey: string) => {
    setIsSaving(prev => ({...prev, [stateKey]: true}))
    try {
      const res = await fetch('/dashboard/app/api/app-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, ...data })
      })
      if (res.ok) alert(`${stateKey} saved successfully!`)
      else alert(`Failed to save ${stateKey}`)
    } catch (err) {
      console.error(err)
      alert(`Error saving ${stateKey}`)
    } finally {
      setIsSaving(prev => ({...prev, [stateKey]: false}))
    }
  }

  // File Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      alert("Uploading image... Please wait.");
      const fileRef = ref(storage, `app_assets/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const downloadURL = await getDownloadURL(fileRef)
      callback(downloadURL)
      alert("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error)
      alert("Failed to upload image. Please check Firebase Storage rules.")
    }
  }

  // Reusable Image Upload Input Component
  const ImageUploadInput = ({ value, onChange, placeholder }: { value: string, onChange: (val: string) => void, placeholder: string }) => (
    <div className="flex-1 flex gap-2">
      <Input placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} className="flex-1" />
      <div className="relative overflow-hidden w-10 h-10 shrink-0 border dark:border-slate-700 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Upload Image">
        <Upload className="h-4 w-4 text-slate-500" />
        <input 
          type="file" 
          accept="image/*" 
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" 
          onChange={(e) => handleFileUpload(e, onChange)} 
        />
      </div>
    </div>
  )

  return (
    <div className="flex-1 space-y-6 p-2 sm:p-8 pt-6 pb-20">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">App Content Settings</h2>
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading App Data...</p>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* COLUMN 1: Homepage Content */}
          <div className="space-y-6">
            
            {/* STORIES */}
            <Card className="border-none shadow-md border-t-4 border-t-blue-500">
              <CardHeader>
                <CardTitle>Stories Section</CardTitle>
                <CardDescription>Manage the circular stories at the top of the app.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {stories.map((story, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center p-3 border rounded-md dark:border-slate-800">
                    <Input placeholder="Label (e.g. Origin)" value={story.label} onChange={(e) => { const n = [...stories]; n[idx].label = e.target.value; setStories(n) }} className="w-32" />
                    <Input placeholder="Tag (e.g. NEW)" value={story.tag} onChange={(e) => { const n = [...stories]; n[idx].tag = e.target.value; setStories(n) }} className="w-24" />
                    
                    <div className="flex-1 min-w-[200px]">
                      <ImageUploadInput 
                        placeholder="Icon URL or Upload" 
                        value={story.icon} 
                        onChange={(val) => { const n = [...stories]; n[idx].icon = val; setStories(n) }} 
                      />
                    </div>
                    
                    <Button variant="destructive" size="sm" onClick={() => setStories(stories.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStories([...stories, {label:'', icon:'', tag:''}])}>+ Add Story</Button>
                  <Button onClick={() => saveDocument('stories', {list: stories}, 'Stories')} disabled={isSaving['Stories']}>
                    {isSaving['Stories'] ? 'Saving...' : 'Save Stories'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* BENTO SELECTION */}
            <Card className="border-none shadow-md border-t-4 border-t-purple-500">
              <CardHeader>
                <CardTitle>Today's Selection (Bento)</CardTitle>
                <CardDescription>Manage the main Bento cards section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Section Title</label>
                  <Input placeholder="e.g. Today's Selection" value={bento.section_title} onChange={(e) => setBento({...bento, section_title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500">Best Seller Product (Big Card)</label>
                  <Input placeholder="Exact Pickle Name (e.g. Mango Pickle)" value={bento.best_seller_product} onChange={(e) => setBento({...bento, best_seller_product: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Card 2 Label</label>
                    <Input placeholder="e.g. Royal" value={bento.card2_label} onChange={(e) => setBento({...bento, card2_label: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-500">Card 2 Category</label>
                    <Input placeholder="e.g. Spices" value={bento.card2_category} onChange={(e) => setBento({...bento, card2_category: e.target.value})} />
                  </div>
                </div>
                <Button onClick={() => saveDocument('bento_selection', bento, 'Bento Section')} disabled={isSaving['Bento Section']}>
                  {isSaving['Bento Section'] ? 'Saving...' : 'Save Bento Section'}
                </Button>
              </CardContent>
            </Card>

            {/* DEALS */}
            <Card className="border-none shadow-md border-t-4 border-t-green-500">
              <CardHeader>
                <CardTitle>Deals of the Day</CardTitle>
                <CardDescription>Enter product names to show in the dark Deals section.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {deals.map((deal, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <Input placeholder="Product Name (e.g. Lemon Pickle)" value={deal} onChange={(e) => { const n = [...deals]; n[idx] = e.target.value; setDeals(n) }} />
                    <Button variant="destructive" size="sm" onClick={() => setDeals(deals.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setDeals([...deals, ''])}>+ Add Product to Deals</Button>
                  <Button onClick={() => saveDocument('deals', {product_names: deals}, 'Deals')} disabled={isSaving['Deals']}>
                    {isSaving['Deals'] ? 'Saving...' : 'Save Deals'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* PACKAGING */}
            <Card className="border-none shadow-md border-t-4 border-t-yellow-500">
              <CardHeader>
                <CardTitle>Royal Packaging Section</CardTitle>
                <CardDescription>Manage the packaging highlight cards.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {packaging.map((pack, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-start p-3 border rounded-md dark:border-slate-800">
                    <div className="flex flex-col gap-2 flex-1 min-w-[200px]">
                      <Input placeholder="Title (e.g. Premium Glass)" value={pack.title} onChange={(e) => { const n = [...packaging]; n[idx].title = e.target.value; setPackaging(n) }} />
                      <Input placeholder="Description" value={pack.desc} onChange={(e) => { const n = [...packaging]; n[idx].desc = e.target.value; setPackaging(n) }} />
                      <ImageUploadInput 
                        placeholder="Image URL or Upload" 
                        value={pack.img} 
                        onChange={(val) => { const n = [...packaging]; n[idx].img = val; setPackaging(n) }} 
                      />
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => setPackaging(packaging.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setPackaging([...packaging, {title:'', desc:'', img:''}])}>+ Add Packaging Item</Button>
                  <Button onClick={() => saveDocument('packaging', {list: packaging}, 'Packaging')} disabled={isSaving['Packaging']}>
                    {isSaving['Packaging'] ? 'Saving...' : 'Save Packaging'}
                  </Button>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* COLUMN 2: Promos, Banners & Categories */}
          <div className="space-y-6">
            
            {/* CATEGORIES */}
            <Card className="border-none shadow-md border-t-4 border-t-emerald-500">
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage product categories shown on the Home page.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((cat, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center p-3 border rounded-md dark:border-slate-800">
                    <Input placeholder="Label (e.g. Pickles)" value={cat.label} onChange={(e) => { const n = [...categories]; n[idx].label = e.target.value; setCategories(n) }} className="w-32" />
                    
                    <div className="flex-1 min-w-[200px]">
                      <ImageUploadInput 
                        placeholder="Image URL or Upload" 
                        value={cat.img} 
                        onChange={(val) => { const n = [...categories]; n[idx].img = val; setCategories(n) }} 
                      />
                    </div>
                    
                    <Button variant="destructive" size="sm" onClick={() => setCategories(categories.filter((_, i) => i !== idx))}>Remove</Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCategories([...categories, {label:'', img:''}])}>+ Add Category</Button>
                  <Button onClick={() => saveDocument('categories', {list: categories}, 'Categories')} disabled={isSaving['Categories']}>
                    {isSaving['Categories'] ? 'Saving...' : 'Save Categories'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* COUPONS */}
            <Card className="border-none shadow-md border-t-4 border-t-orange-500">
              <CardHeader>
                <CardTitle>Coupons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {coupons.map((coupon, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center p-3 border rounded-md dark:border-slate-800">
                    <Input placeholder="Code" value={coupon.code} onChange={(e) => { const n = [...coupons]; n[idx].code = e.target.value; setCoupons(n) }} className="w-24" />
                    <Input placeholder="Title" value={coupon.title} onChange={(e) => { const n = [...coupons]; n[idx].title = e.target.value; setCoupons(n) }} className="flex-1 min-w-[120px]" />
                    <Input placeholder="Min Spend" type="number" value={coupon.min} onChange={(e) => { const n = [...coupons]; n[idx].min = Number(e.target.value); setCoupons(n) }} className="w-24" />
                    <Button variant="destructive" size="sm" onClick={() => setCoupons(coupons.filter((_, i) => i !== idx))}>X</Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCoupons([...coupons, { code: '', title: '', sub: '', min: 0, color: '#000000' }])}>+ Add</Button>
                  <Button onClick={() => saveDocument('coupons', {active_list: coupons}, 'Coupons')} disabled={isSaving['Coupons']}>
                    {isSaving['Coupons'] ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* BANNERS */}
            <Card className="border-none shadow-md border-t-4 border-t-pink-500">
              <CardHeader>
                <CardTitle>Banners</CardTitle>
                <CardDescription>Main and Ad Banners for the App. Click the icon to upload from your PC.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-sm border-b pb-1">Main Banners</h3>
                  {mainBanners.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <ImageUploadInput 
                        placeholder="Image URL or Upload" 
                        value={url} 
                        onChange={(val) => { const n = [...mainBanners]; n[idx] = val; setMainBanners(n) }} 
                      />
                      <Button variant="destructive" size="sm" onClick={() => setMainBanners(mainBanners.filter((_, i) => i !== idx))}>X</Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setMainBanners([...mainBanners, ''])}>+ Add Main</Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm border-b pb-1">Ad Banners</h3>
                  {adBanners.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <ImageUploadInput 
                        placeholder="Image URL or Upload" 
                        value={url} 
                        onChange={(val) => { const n = [...adBanners]; n[idx] = val; setAdBanners(n) }} 
                      />
                      <Button variant="destructive" size="sm" onClick={() => setAdBanners(adBanners.filter((_, i) => i !== idx))}>X</Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setAdBanners([...adBanners, ''])}>+ Add Ad</Button>
                </div>

                <Button onClick={() => saveDocument('banners', {main_banners: mainBanners, ad_banners: adBanners}, 'Banners')} disabled={isSaving['Banners']} className="w-full">
                  {isSaving['Banners'] ? 'Saving...' : 'Save All Banners'}
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      )}
    </div>
  )
}
