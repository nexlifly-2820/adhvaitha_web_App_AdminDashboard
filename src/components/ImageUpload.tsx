'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase-app'
import { toast } from 'sonner'
import { UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = 'uploads', className = '' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size (e.g. 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setIsUploading(true)
    try {
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const storageRef = ref(storage, `${folder}/${fileName}`)
      
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      onChange(downloadURL)
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload image')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-slate-200 aspect-video bg-slate-50 flex items-center justify-center h-24">
          <img src={value} alt="Uploaded preview" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Change'}
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="h-24 border-dashed border-2 text-slate-500 hover:text-slate-700 hover:border-slate-400 bg-slate-50"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              <span>Click to Upload Image</span>
            </div>
          )}
        </Button>
      )}
      
      {/* Fallback to text input for manual entry or if upload fails */}
      <div className="text-xs text-slate-400">
        Or URL: 
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="ml-2 bg-transparent border-b border-slate-200 focus:outline-none focus:border-slate-400 w-full truncate max-w-[200px]"
          placeholder="https://..."
        />
      </div>
    </div>
  )
}
