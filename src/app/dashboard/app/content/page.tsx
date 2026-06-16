'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Data Structure expected in Firestore: app_data/home_content
interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  actionUrl: string;
}

interface Story {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  title: string;
}

interface Category {
  id: string;
  name: string;
  iconUrl: string;
  order: number;
}

export default function ContentManager() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    setIsLoading(true)
    try {
      const docRef = doc(db, 'app_data', 'home_content')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        setBanners(data.banners || [])
        setStories(data.stories || [])
        setCategories(data.categories || [])
      } else {
        // Init empty data structure if not exists
        setBanners([])
        setStories([])
        setCategories([])
      }
    } catch (error) {
      console.error('Error fetching content:', error)
      toast.error('Failed to load content configuration')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const docRef = doc(db, 'app_data', 'home_content')
      await updateDoc(docRef, {
        banners,
        stories,
        categories
      })
      toast.success('App Home Content updated successfully!')
    } catch (error) {
      console.error('Error saving content:', error)
      toast.error('Failed to save content. Ensure the document exists.')
    } finally {
      setIsSaving(false)
    }
  }

  // Generic add/remove/update helpers
  const addItem = (setter: any, itemTemplate: any) => {
    setter((prev: any) => [...prev, { id: Date.now().toString(), ...itemTemplate }])
  }
  
  const removeItem = (setter: any, index: number) => {
    setter((prev: any) => prev.filter((_: any, i: number) => i !== index))
  }

  const updateItem = (setter: any, index: number, field: string, value: any) => {
    setter((prev: any) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  if (isLoading) {
    return <div className="flex h-[400px] items-center justify-center text-slate-500">Loading App Content...</div>
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ImageIcon className="h-6 w-6 text-[#f97316]" />
            App Content Manager
          </h2>
          <p className="text-slate-500">Manage the home page banners, stories, and categories in the mobile app.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="banners" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-slate-100 dark:bg-slate-800">
          <TabsTrigger value="banners">Home Banners</TabsTrigger>
          <TabsTrigger value="stories">Stories (Reels)</TabsTrigger>
          <TabsTrigger value="categories">Categories Layout</TabsTrigger>
        </TabsList>
        
        {/* BANNERS TAB */}
        <TabsContent value="banners" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Promotional Banners</CardTitle>
                  <CardDescription>Top carousel banners shown on the app home screen.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addItem(setBanners, { imageUrl: '', title: '', actionUrl: '' })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Banner
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {banners.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed">No banners added yet.</div>
              ) : (
                banners.map((banner, idx) => (
                  <div key={banner.id} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg bg-white relative group transition-colors hover:border-orange-200">
                    <div className="col-span-3">
                      <div className="aspect-[2/1] bg-slate-100 rounded-md overflow-hidden flex items-center justify-center border">
                        {banner.imageUrl ? (
                          <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-slate-300" />
                        )}
                      </div>
                    </div>
                    <div className="col-span-8 space-y-3">
                      <Input 
                        placeholder="Banner Title (internal)" 
                        value={banner.title} 
                        onChange={(e) => updateItem(setBanners, idx, 'title', e.target.value)}
                        className="text-sm font-medium h-9"
                      />
                      <Input 
                        placeholder="Image URL (HTTPS)" 
                        value={banner.imageUrl} 
                        onChange={(e) => updateItem(setBanners, idx, 'imageUrl', e.target.value)}
                        className="text-xs font-mono h-9"
                      />
                      <Input 
                        placeholder="Action URL (e.g., /product/mango-pickle)" 
                        value={banner.actionUrl} 
                        onChange={(e) => updateItem(setBanners, idx, 'actionUrl', e.target.value)}
                        className="text-xs h-9"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(setBanners, idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* STORIES TAB */}
        <TabsContent value="stories" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Stories / Reels</CardTitle>
                  <CardDescription>Short vertical videos shown below banners.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addItem(setStories, { thumbnailUrl: '', videoUrl: '', title: '' })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Story
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {stories.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed">No stories added yet.</div>
              ) : (
                stories.map((story, idx) => (
                  <div key={story.id} className="grid grid-cols-12 gap-4 items-start p-4 border rounded-lg bg-white relative group transition-colors hover:border-orange-200">
                    <div className="col-span-2">
                      <div className="aspect-[9/16] bg-slate-100 rounded-md overflow-hidden flex items-center justify-center border">
                        {story.thumbnailUrl ? (
                          <img src={story.thumbnailUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-slate-400">Thumb</span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-9 space-y-3">
                      <Input 
                        placeholder="Story Title" 
                        value={story.title} 
                        onChange={(e) => updateItem(setStories, idx, 'title', e.target.value)}
                        className="text-sm font-medium h-9"
                      />
                      <Input 
                        placeholder="Thumbnail Image URL" 
                        value={story.thumbnailUrl} 
                        onChange={(e) => updateItem(setStories, idx, 'thumbnailUrl', e.target.value)}
                        className="text-xs font-mono h-9"
                      />
                      <Input 
                        placeholder="Video URL (.mp4)" 
                        value={story.videoUrl} 
                        onChange={(e) => updateItem(setStories, idx, 'videoUrl', e.target.value)}
                        className="text-xs font-mono h-9"
                      />
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <Button variant="ghost" size="icon" onClick={() => removeItem(setStories, idx)} className="text-slate-400 hover:text-red-500 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CATEGORIES TAB */}
        <TabsContent value="categories" className="space-y-4">
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Category Grid</CardTitle>
                  <CardDescription>Define the categories shown in the app's browse section.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => addItem(setCategories, { name: '', iconUrl: '', order: categories.length + 1 })}>
                  <Plus className="h-4 w-4 mr-1" /> Add Category
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg border border-dashed">No categories added yet.</div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categories.sort((a,b) => a.order - b.order).map((cat, idx) => (
                    <div key={cat.id} className="p-4 border rounded-lg bg-white relative group space-y-3">
                      <div className="flex justify-between items-start">
                        <Input 
                          type="number" 
                          value={cat.order} 
                          onChange={(e) => updateItem(setCategories, idx, 'order', parseInt(e.target.value) || 0)}
                          className="w-16 h-8 text-xs text-center p-1"
                          title="Display Order"
                        />
                        <Button variant="ghost" size="icon" onClick={() => removeItem(setCategories, idx)} className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 -mt-1 -mr-1">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="h-16 w-16 mx-auto bg-orange-50 rounded-full flex items-center justify-center overflow-hidden border border-orange-100">
                        {cat.iconUrl ? (
                          <img src={cat.iconUrl} alt="Icon" className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="h-6 w-6 text-orange-300" />
                        )}
                      </div>
                      <Input 
                        placeholder="Category Name" 
                        value={cat.name} 
                        onChange={(e) => updateItem(setCategories, idx, 'name', e.target.value)}
                        className="text-sm font-semibold h-8 text-center border-dashed focus:border-solid"
                      />
                      <Input 
                        placeholder="Icon URL" 
                        value={cat.iconUrl} 
                        onChange={(e) => updateItem(setCategories, idx, 'iconUrl', e.target.value)}
                        className="text-[10px] font-mono h-7"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
