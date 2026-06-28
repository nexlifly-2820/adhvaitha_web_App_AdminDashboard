'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ImageUpload"
import { toast } from "sonner"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase-web"
import { Loader2, Plus, Trash2 } from "lucide-react"

export default function CompleteHomepageManagement() {
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, 'homepage_web', 'main'));
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        // EXACT DEFAULT DATA FROM YOUR CURRENT WEBSITE
        setData({
          heroImages: ['/images/gallery1.jpg', '/images/gallery2.jpg', '/images/gallery3.jpg'],
          michaSlides: [
            { label: 'SPICY MANGO', bgColor: '#E3242B', img: '/images/slider_mango.png', particles: ['🥭', '🌶️', '✨'] },
            { label: 'GONGURA', bgColor: '#4A7C40', img: '/images/slider_gongura.png', particles: ['🌿', '🧄', '✨'] }
          ],
          productsHeader: { 
            eyebrow: 'IN OUR COLLECTION', 
            titlePart1: 'OUR BELOVED', 
            titlePart2: 'PICKLES', 
            description: 'Every jar tells a story of love and tradition — transforming simple meals into celebrations.' 
          },
          ingredientsHeader: 'What Goes Inside Every Jar',
          ingredients: [
             { name: 'Raw Green Mangoes', source: 'Andhra Orchards', img: '/images/ing_mango.png', bg: 'rgba(74,124,64,0.12)' },
             { name: 'Red Kashmiri Chilies', source: 'Sun-dried 7 days', img: '/images/ing_chili.png', bg: 'rgba(185,28,28,0.1)' },
             { name: 'Cold-pressed Sesame Oil', source: 'Stone Milled', img: '/images/ing_oil.png', bg: 'rgba(238,162,54,0.12)' }
          ],
          ingredientsQuote: { line1: 'No artificial colors.', line2: 'No preservatives. No shortcuts. Ever.' },
          highlight: { 
            eyebrow: 'Highlight of the Month', 
            title: 'The Classic\nMango\nAvakaya.', 
            cards: [
              { text: "This Month's Star! The absolute crowd favorite.", img: "/images/cards/star.png" },
              { text: "Made with the first catch of crunchy summer mangoes.", img: "/images/cards/mango.png" },
              { text: "Blended with pure, fiery Guntur chillies for authentic kick.", img: "/images/cards/chili.png" },
              { text: "A timeless explosion of Grandma's traditional spice!", img: "/images/cards/jar.png" },
              { text: "Marinated in rich, cold-pressed groundnut oil.", img: "/images/cards/oil.png" },
              { text: "The absolute perfect companion for hot rice and melted ghee!", img: "/images/cards/rice.png" }
            ] 
          },
          testimonialsHeader: 'What Our Pickle Lovers Say', 
          testimonials: [
            { text: "Exactly like my naani used to make! The mango avakaya is absolutely perfect — the right amount of spice and oil. Will never buy from a supermarket again.", author: "Priya Sharma", city: "", product: "TRADITIONAL MANGO AVAKAYA", productImg: "/images/ing_mango.png" },
            { text: "Ordered the combo pack and finished it in a week! The gongura pickle is outstanding. Pure authentic Andhra taste. Fast delivery too.", author: "Ravi Kumar", city: "", product: "ANDHRA GONGURA PICKLE", productImg: "/images/ing_leaves.png" },
            { text: "My mother cried when she tasted the lemon pickle — said it reminded her of her mother's recipe. That says everything. Thank you Avdaitha Foods.", author: "Meena Reddy", city: "", product: "TANGY LEMON PICKLE", productImg: "/images/ing_salt.png" }
          ],
          recipesHeader: { 
            eyebrow: 'IN THE KITCHEN', 
            titlePart1: 'COOK WITH OUR', 
            titlePart2: 'PICKLES', 
            description: "Grandmother's pickles aren't just condiments — they're the hero ingredient that transforms simple meals into celebrations." 
          },
          ctaBanner: { 
            title: "BIG CRAVING?\nWE'VE GOT YOU.", 
            subtitle: 'Authentic Indian Pickles for Families & Foodies', 
            description: "Order authentic flavors straight from the grandmother's kitchen that knows how to spice it up. Adhvaitha Foods style.", 
            disclaimer: '* Free delivery on orders above ₹499', 
            buttonText: 'Order Your Jar Today', 
            image: '/images/cta_ingredients_white.png' 
          }
        });
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'homepage_web', 'main'), data);
      toast.success("Homepage updated live!");
    } catch (error) { toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };

  if (!data) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-orange-500" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 p-4 z-50 border-b">
        <h2 className="text-3xl font-bold">🏠 Complete Homepage CMS</h2>
        <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 text-white">
          {isSaving ? "Saving..." : "Publish to Live Site"}
        </Button>
      </div>

      {/* 1. Hero Section */}
      <Card><CardHeader><CardTitle>1. Hero Images</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.heroImages.map((img: string, i: number) => (
            <div key={i} className="flex gap-4 items-center">
              <div className="flex-1"><ImageUpload value={img} onChange={(url) => { const n = [...data.heroImages]; n[i] = url; setData({...data, heroImages: n}); }} /></div>
              <Button variant="ghost" onClick={() => setData({...data, heroImages: data.heroImages.filter((_, idx) => idx !== i)})}><Trash2 className="text-red-500 w-4 h-4" /></Button>
            </div>
          ))}
          <Button variant="outline" onClick={() => setData({...data, heroImages: [...data.heroImages, '']})}>+ Add Hero Image</Button>
        </CardContent>
      </Card>

      {/* 2. Products Header */}
      <Card><CardHeader><CardTitle>2. Products Section Header</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Eyebrow Text</Label><Input value={data.productsHeader.eyebrow} onChange={(e) => setData({...data, productsHeader: {...data.productsHeader, eyebrow: e.target.value}})} /></div>
          <div><Label>Title (Black part)</Label><Input value={data.productsHeader.titlePart1} onChange={(e) => setData({...data, productsHeader: {...data.productsHeader, titlePart1: e.target.value}})} /></div>
          <div><Label>Title (Colored part)</Label><Input value={data.productsHeader.titlePart2} onChange={(e) => setData({...data, productsHeader: {...data.productsHeader, titlePart2: e.target.value}})} /></div>
          <div className="col-span-2"><Label>Description</Label><Textarea value={data.productsHeader.description} onChange={(e) => setData({...data, productsHeader: {...data.productsHeader, description: e.target.value}})} /></div>
        </CardContent>
      </Card>

      {/* 3. Ingredients Section */}
      <Card><CardHeader><CardTitle>3. Heritage Ingredients Section</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div><Label>Main Header</Label><Input value={data.ingredientsHeader} onChange={(e) => setData({...data, ingredientsHeader: e.target.value})} /></div>
          
          <div className="space-y-4 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
             <h3 className="font-semibold">Ingredient Cards</h3>
             {data.ingredients.map((ing: any, i: number) => (
                <div key={i} className="flex flex-col md:flex-row gap-4 items-center border p-4 rounded bg-white dark:bg-slate-950 relative">
                  <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setData({...data, ingredients: data.ingredients.filter((_, idx) => idx !== i)})}><Trash2 className="text-red-500 w-4 h-4" /></Button>
                  <div className="flex-1 space-y-2 w-full">
                    <Input value={ing.name} onChange={(e) => { const n = [...data.ingredients]; n[i].name = e.target.value; setData({...data, ingredients: n})}} placeholder="Ingredient Name" />
                    <Input value={ing.source} onChange={(e) => { const n = [...data.ingredients]; n[i].source = e.target.value; setData({...data, ingredients: n})}} placeholder="Source" />
                    <Input value={ing.bg} onChange={(e) => { const n = [...data.ingredients]; n[i].bg = e.target.value; setData({...data, ingredients: n})}} placeholder="Background RGBA" />
                  </div>
                  <div className="w-full md:w-48"><ImageUpload value={ing.img} onChange={(url) => { const n = [...data.ingredients]; n[i].img = url; setData({...data, ingredients: n})}} /></div>
                </div>
             ))}
             <Button variant="outline" onClick={() => setData({...data, ingredients: [...data.ingredients, {name:'', source:'', img:'', bg:''}]})}>+ Add Ingredient Card</Button>
          </div>

          <div className="space-y-4 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
            <h3 className="font-semibold">Bottom Quote Text</h3>
            <Input placeholder="Line 1" value={data.ingredientsQuote.line1} onChange={(e) => setData({...data, ingredientsQuote: {...data.ingredientsQuote, line1: e.target.value}})} />
            <Input placeholder="Line 2" value={data.ingredientsQuote.line2} onChange={(e) => setData({...data, ingredientsQuote: {...data.ingredientsQuote, line2: e.target.value}})} />
          </div>
        </CardContent>
      </Card>

      {/* 4. Highlight Section */}
      <Card><CardHeader><CardTitle>4. Sticky Highlight Section</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div><Label>Eyebrow Text</Label><Input value={data.highlight.eyebrow} onChange={(e) => setData({...data, highlight: {...data.highlight, eyebrow: e.target.value}})} /></div>
          <div><Label>Main Large Title</Label><Textarea value={data.highlight.title} onChange={(e) => setData({...data, highlight: {...data.highlight, title: e.target.value}})} rows={3} /></div>
          
          <div className="space-y-4 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
             <h3 className="font-semibold">Floating Cards</h3>
             {data.highlight.cards.map((card: any, i: number) => (
                <div key={i} className="flex flex-col sm:flex-row gap-4 items-center border p-4 rounded bg-white dark:bg-slate-950 relative">
                  <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setData({...data, highlight: {...data.highlight, cards: data.highlight.cards.filter((_, idx) => idx !== i)}})}><Trash2 className="text-red-500 w-4 h-4" /></Button>
                  <Textarea className="flex-1" value={card.text} onChange={(e) => { const n = [...data.highlight.cards]; n[i].text = e.target.value; setData({...data, highlight: {...data.highlight, cards: n}})}} placeholder="Card Text" />
                  <div className="w-full sm:w-32"><ImageUpload value={card.img} onChange={(url) => { const n = [...data.highlight.cards]; n[i].img = url; setData({...data, highlight: {...data.highlight, cards: n}})}} /></div>
                </div>
             ))}
             <Button variant="outline" onClick={() => setData({...data, highlight: {...data.highlight, cards: [...data.highlight.cards, {text:'', img:''}]}})}>+ Add Floating Card</Button>
          </div>
        </CardContent>
      </Card>

      {/* 5. Testimonials */}
      <Card><CardHeader><CardTitle>5. Testimonials Section</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div><Label>Section Header</Label><Input value={data.testimonialsHeader} onChange={(e) => setData({...data, testimonialsHeader: e.target.value})} /></div>
          
          <div className="space-y-4 border p-4 rounded bg-slate-50 dark:bg-slate-900/50">
             {data.testimonials.map((test: any, i: number) => (
                <div key={i} className="flex flex-col gap-4 border p-4 rounded bg-white dark:bg-slate-950 relative">
                  <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setData({...data, testimonials: data.testimonials.filter((_, idx) => idx !== i)})}><Trash2 className="text-red-500 w-4 h-4" /></Button>
                  
                  <div className="grid grid-cols-2 gap-4 max-w-[85%]">
                    <div><Label>Author</Label><Input value={test.author} onChange={(e) => { const n = [...data.testimonials]; n[i].author = e.target.value; setData({...data, testimonials: n})}} /></div>
                    <div><Label>Location/City</Label><Input value={test.city} onChange={(e) => { const n = [...data.testimonials]; n[i].city = e.target.value; setData({...data, testimonials: n})}} /></div>
                  </div>
                  <div><Label>Review Text</Label><Textarea value={test.text} onChange={(e) => { const n = [...data.testimonials]; n[i].text = e.target.value; setData({...data, testimonials: n})}} /></div>
                  
                  <div className="border-t pt-4 mt-2 grid md:grid-cols-2 gap-4">
                    <div><Label>Product Name (Bottom of card)</Label><Input value={test.product || ''} onChange={(e) => { const n = [...data.testimonials]; n[i].product = e.target.value; setData({...data, testimonials: n})}} placeholder="e.g. TRADITIONAL MANGO AVAKAYA"/></div>
                    <div><Label>Product Image</Label><ImageUpload value={test.productImg || ''} onChange={(url) => { const n = [...data.testimonials]; n[i].productImg = url; setData({...data, testimonials: n})}} /></div>
                  </div>
                </div>
             ))}
             <Button variant="outline" onClick={() => setData({...data, testimonials: [...data.testimonials, {text:'', author:'', city:'', product:'', productImg:''}]})}>+ Add Testimonial</Button>
          </div>
        </CardContent>
      </Card>

      {/* 6. Recipes Header */}
      <Card><CardHeader><CardTitle>6. Recipes Section Header</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Eyebrow Text</Label><Input value={data.recipesHeader?.eyebrow || ''} onChange={(e) => setData({...data, recipesHeader: {...data.recipesHeader, eyebrow: e.target.value}})} placeholder="IN THE KITCHEN" /></div>
          <div><Label>Title (Black part)</Label><Input value={data.recipesHeader?.titlePart1 || ''} onChange={(e) => setData({...data, recipesHeader: {...data.recipesHeader, titlePart1: e.target.value}})} placeholder="COOK WITH OUR" /></div>
          <div><Label>Title (Colored part)</Label><Input value={data.recipesHeader?.titlePart2 || ''} onChange={(e) => setData({...data, recipesHeader: {...data.recipesHeader, titlePart2: e.target.value}})} placeholder="PICKLES" /></div>
          <div className="col-span-2"><Label>Description</Label><Textarea value={data.recipesHeader?.description || ''} onChange={(e) => setData({...data, recipesHeader: {...data.recipesHeader, description: e.target.value}})} placeholder="Grandmother's pickles aren't just condiments..." /></div>
        </CardContent>
      </Card>

      {/* 7. CTA Banner */}
      <Card><CardHeader><CardTitle>7. CTA Banner (Orange Section)</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div><Label>Title</Label><Textarea value={data.ctaBanner.title} onChange={(e) => setData({...data, ctaBanner: {...data.ctaBanner, title: e.target.value}})} /></div>
          <div><Label>Subtitle</Label><Textarea value={data.ctaBanner.subtitle} onChange={(e) => setData({...data, ctaBanner: {...data.ctaBanner, subtitle: e.target.value}})} /></div>
          <div className="col-span-2"><Label>Description</Label><Textarea value={data.ctaBanner.description} onChange={(e) => setData({...data, ctaBanner: {...data.ctaBanner, description: e.target.value}})} /></div>
          <div><Label>Disclaimer / Footnote</Label><Input value={data.ctaBanner.disclaimer} onChange={(e) => setData({...data, ctaBanner: {...data.ctaBanner, disclaimer: e.target.value}})} /></div>
          <div><Label>Button Text</Label><Input value={data.ctaBanner.buttonText} onChange={(e) => setData({...data, ctaBanner: {...data.ctaBanner, buttonText: e.target.value}})} /></div>
          <div className="col-span-2"><Label>Side Image</Label><ImageUpload value={data.ctaBanner.image} onChange={(url) => setData({...data, ctaBanner: {...data.ctaBanner, image: url}})} /></div>
        </CardContent>
      </Card>
      
    </div>
  )
}
