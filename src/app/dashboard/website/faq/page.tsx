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
import { Loader2, Trash2 } from "lucide-react"

export default function FaqManagement() {
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const docSnap = await getDoc(doc(db, 'faq_web', 'main'));
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        // EXACT DEFAULT DATA FROM YOUR CURRENT WEBSITE
        setData({
          faqs: [
            { question: "Are Adhvaitha's products vegetarian?", answer: "Yes, all of our products are 100% vegetarian and made with pure, plant-based ingredients.", color: "#C1B4E5" },
            { question: "Do your products contain preservatives or artificial colours?", answer: "No, we never use any artificial colors, flavors, or chemical preservatives. Our pickles are naturally preserved using salt, oil, and traditional sun-drying methods.", color: "#FFCE35" },
            { question: "Where are Adhvaitha's products made?", answer: "Our products are proudly handcrafted in India, following authentic regional recipes passed down through generations.", color: "#FF4B12" },
            { question: "How should I store your products?", answer: "Store them in a cool, dry place away from direct sunlight. Always use a clean, dry spoon to prevent contamination.", color: "#47B8E6" },
            { question: "Do I need to refrigerate the pickles after opening?", answer: "While not strictly necessary if stored properly in a cool place, refrigeration after opening is highly recommended to extend freshness and shelf life.", color: "#EAE0BA" },
            { question: "What is the shelf life of your products?", answer: "Our pickles have a shelf life of 12 months from the date of manufacture when stored correctly.", color: "#85E0C2" },
            { question: "Is the oil used cold-pressed?", answer: "Yes, we use premium cold-pressed sesame and groundnut oils, which retain natural nutrients and authentic flavor.", color: "#C1B4E5" },
            { question: "Are your products gluten-free?", answer: "Most of our traditional pickles are naturally gluten-free. However, please check the specific ingredient list on each product page if you have severe allergies.", color: "#FFCE35" },
            { question: "How spicy are the pickles?", answer: "We use premium Guntur chilies which provide a rich, robust, and authentic Indian spice level. They pack a flavorful punch!", color: "#FF4B12" },
            { question: "What type of salt do you use?", answer: "We use high-quality, pure sea salt and crystal salt, which acts as a natural preservative and enhances the traditional taste.", color: "#47B8E6" },
            { question: "Do you ship across India?", answer: "Yes, we proudly offer pan-India shipping. No matter where you are, you can enjoy the authentic taste of Adhvaitha Foods.", color: "#EAE0BA" },
            { question: "How long does delivery take?", answer: "Orders are typically processed within 24 hours and delivered within 3-5 business days depending on your location.", color: "#85E0C2" },
            { question: "Is your packaging safe and eco-friendly?", answer: "Yes! We pack exclusively in sterilized glass jars to maintain absolute purity and prevent plastic chemical leaching. We use secure, drop-tested packaging for transit.", color: "#C1B4E5" },
            { question: "Can I order in bulk for events or gifting?", answer: "Absolutely! Our artisanal pickles make wonderful gifts for weddings, corporate events, and festivals. Please reach out to us via the Contact page for bulk pricing.", color: "#FFCE35" },
            { question: "Do you offer returns or refunds?", answer: "Due to the perishable nature of our products, we generally do not accept returns. However, if your order arrives damaged, please contact us within 48 hours for a prompt replacement.", color: "#FF4B12" }
          ]
        });
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'faq_web', 'main'), data);
      toast.success("FAQ updated live!");
    } catch (error) { toast.error("Failed to save."); } 
    finally { setIsSaving(false); }
  };
  
  if (!data) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-orange-500" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 p-4 z-50 border-b">
        <h2 className="text-3xl font-bold">❓ FAQ CMS</h2>
        <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 text-white">
          {isSaving ? "Saving..." : "Publish to Live Site"}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Manage Frequently Asked Questions</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {data.faqs.map((faq: any, i: number) => (
            <div key={i} className="flex flex-col gap-4 border p-4 rounded bg-white dark:bg-slate-950 relative">
              <Button variant="ghost" className="absolute top-2 right-2" onClick={() => setData({...data, faqs: data.faqs.filter((_, idx) => idx !== i)})}><Trash2 className="text-red-500 w-4 h-4" /></Button>
              
              <div className="flex flex-col md:flex-row gap-4 md:items-center pr-10">
                <div className="flex-1 space-y-2">
                  <Label>Question</Label>
                  <Input value={faq.question} onChange={(e) => { const n = [...data.faqs]; n[i].question = e.target.value; setData({...data, faqs: n})}} />
                </div>
                <div>
                  <Label>Card Color Hex</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <Input type="color" className="w-12 h-10 p-1" value={faq.color} onChange={(e) => { const n = [...data.faqs]; n[i].color = e.target.value; setData({...data, faqs: n})}} />
                    <Input className="w-24 uppercase" value={faq.color} onChange={(e) => { const n = [...data.faqs]; n[i].color = e.target.value; setData({...data, faqs: n})}} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea value={faq.answer} onChange={(e) => { const n = [...data.faqs]; n[i].answer = e.target.value; setData({...data, faqs: n})}} />
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full border-dashed py-8 mt-4" onClick={() => setData({...data, faqs: [...data.faqs, {question:'', answer:'', color:'#C1B4E5'}]})}>
            + Add New FAQ
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
