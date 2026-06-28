'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-web"
import { Loader2 } from "lucide-react"

export default function RecipesPageCMS() {
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, 'recipes-page_web', 'main'));
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        // EXACT DEFAULT DATA FROM YOUR CURRENT WEBSITE
        setData({
          hero: {
            eyebrow: "WHAT'S INSIDE",
            title: "SIMPLE THINGS\nDONE RIGHT"
          },
          middleSection: {
            title: "A STORY IN\nEVERY BITE.",
            subtitle: "FROM FRESH FARMS TO YOUR HANDS EVERY LAYER MATTERS."
          },
          cta: {
            title: "FEEL THE CHANGE",
            subtitle: "Bring these magical authentic flavors directly to your kitchen.",
            buttonText: "ORDER NOW"
          }
        });
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'recipes-page_web', 'main'), data);
      toast.success("Recipes Page updated live!");
    } catch (error) { toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };
  
  if (!data) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-orange-500" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 p-4 z-50 border-b">
        <h2 className="text-3xl font-bold">📜 Recipes Page CMS</h2>
        <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 text-white">
          {isSaving ? "Saving..." : "Publish to Live Site"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>1. Hero Section (Top)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Eyebrow Text</Label><Input value={data.hero.eyebrow} onChange={(e) => setData({...data, hero: {...data.hero, eyebrow: e.target.value}})} /></div>
          <div><Label>Main Title</Label><Textarea value={data.hero.title} onChange={(e) => setData({...data, hero: {...data.hero, title: e.target.value}})} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. Middle Header (Above the scrolling recipes)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Title</Label><Textarea value={data.middleSection.title} onChange={(e) => setData({...data, middleSection: {...data.middleSection, title: e.target.value}})} /></div>
          <div><Label>Subtitle</Label><Input value={data.middleSection.subtitle} onChange={(e) => setData({...data, middleSection: {...data.middleSection, subtitle: e.target.value}})} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3. Bottom CTA Section (Red section)</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Title</Label><Input value={data.cta.title} onChange={(e) => setData({...data, cta: {...data.cta, title: e.target.value}})} /></div>
          <div><Label>Subtitle</Label><Input value={data.cta.subtitle} onChange={(e) => setData({...data, cta: {...data.cta, subtitle: e.target.value}})} /></div>
          <div><Label>Button Text</Label><Input value={data.cta.buttonText} onChange={(e) => setData({...data, cta: {...data.cta, buttonText: e.target.value}})} /></div>
        </CardContent>
      </Card>
    </div>
  )
}
