'use client'
import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Phone, Mail, MapPin, Instagram, Facebook, Link as LinkIcon } from "lucide-react"

export default function ContactManagement() {
  const [data, setData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/dashboard/app/api/web-data?docId=contact_web');
        const json = await res.json();
        
        const actualData = (json.success && json.data) ? (json.data.data ? json.data.data : json.data) : null;
        
        if (actualData && Object.keys(actualData).length > 0) {
          setData(actualData);
        } else {
          // DEFAULT DATA
          setData({
            phone: '+91 98765 43210',
            email: 'hello@adhvaithafoods.in',
            address: '123 Heritage Lane, Jubilee Hills, Hyderabad, Telangana 500033',
            whatsapp: '+91 98765 43210',
            socials: {
              instagram: 'https://instagram.com/adhvaithafoods',
              facebook: 'https://facebook.com/adhvaithafoods',
            },
            workingHours: 'Mon - Sat: 9:00 AM - 6:00 PM'
          });
        }
      } catch (error) {
        console.error("Error fetching contact data:", error);
      }
    }
    fetchData();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/dashboard/app/api/web-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: 'contact_web', ...data })
      });
      toast.success("Contact info updated live!");
    } catch (error) { 
      toast.error("Failed to save."); 
    } finally { 
      setIsSaving(false); 
    }
  };

  if (!data) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto w-8 h-8 text-orange-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div className="flex justify-between items-center sticky top-0 bg-background/95 p-4 z-50 border-b">
        <div>
          <h2 className="text-3xl font-bold">📞 Contact Info</h2>
          <p className="text-slate-500 text-sm mt-1">Update phone, email, and social links for your website footer and contact pages.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-700 text-white">
          {isSaving ? "Saving..." : "Publish to Live Site"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {/* Core Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Phone className="w-5 h-5" /> Primary Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input 
                value={data.phone} 
                onChange={(e) => setData({...data, phone: e.target.value})} 
                placeholder="+91 98765 43210"
              />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                value={data.email} 
                onChange={(e) => setData({...data, email: e.target.value})} 
                placeholder="hello@adhvaithafoods.in"
              />
            </div>
            <div className="space-y-2">
              <Label>WhatsApp Number</Label>
              <Input 
                value={data.whatsapp} 
                onChange={(e) => setData({...data, whatsapp: e.target.value})} 
                placeholder="+91 98765 43210"
              />
            </div>
          </CardContent>
        </Card>

        {/* Location & Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5" /> Location & Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Physical Address</Label>
              <Textarea 
                value={data.address} 
                onChange={(e) => setData({...data, address: e.target.value})} 
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Working Hours</Label>
              <Input 
                value={data.workingHours} 
                onChange={(e) => setData({...data, workingHours: e.target.value})} 
                placeholder="Mon - Sat: 9:00 AM - 6:00 PM"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><LinkIcon className="w-5 h-5" /> Social Media Links</CardTitle>
            <CardDescription>Links for social icons on your website</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-pink-600"><Instagram className="w-4 h-4" /> Instagram URL</Label>
              <Input 
                value={data.socials?.instagram || ''} 
                onChange={(e) => setData({...data, socials: {...data.socials, instagram: e.target.value}})} 
                placeholder="https://instagram.com/adhvaithafoods"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-blue-600"><Facebook className="w-4 h-4" /> Facebook URL</Label>
              <Input 
                value={data.socials?.facebook || ''} 
                onChange={(e) => setData({...data, socials: {...data.socials, facebook: e.target.value}})} 
                placeholder="https://facebook.com/adhvaithafoods"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
