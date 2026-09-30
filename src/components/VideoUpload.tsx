'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UploadCloud, Loader2, Video as VideoIcon } from 'lucide-react'
import { storage } from '@/lib/firebase-app'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  maxSizeMB?: number;
}

export function VideoUpload({ value, onChange, folder = 'uploads/videos', className = '', maxSizeMB = 50 }: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoError, setVideoError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Video must be less than ${maxSizeMB}MB`)
      setErrorMessage(`Video must be less than ${maxSizeMB}MB`)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage(null)
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary environment variables are missing. Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in Vercel.');
      }

      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      // Optional: Store it in a specific folder in Cloudinary
      formData.append('folder', 'adhvaitha_foods_videos');

      // Use XMLHttpRequest to track upload progress accurately
      const xhr = new XMLHttpRequest();
      xhr.open('POST', CLOUDINARY_URL, true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';

        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          onChange(response.secure_url);
          toast.success('Video uploaded perfectly to Cloudinary!');
        } else {
          let errorMsg = 'Failed to upload video';
          try {
            errorMsg = JSON.parse(xhr.responseText).error.message;
          } catch(e) {}
          setErrorMessage(`Cloudinary Error: ${errorMsg}`);
          toast.error('Cloudinary Error');
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setErrorMessage('Network error during upload to Cloudinary');
        toast.error('Upload failed. Network error.');
      };

      xhr.send(formData);

    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload video.')
      setErrorMessage(error.message || 'Failed to upload video.')
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <input
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value ? (
        <div className="relative group rounded-md overflow-hidden border border-slate-200 aspect-video bg-slate-50 flex items-center justify-center h-48">
          <video 
            src={value.startsWith('assets/') ? `/${value}` : (value.startsWith('/') ? `https://adhvaithafoods.in${value}` : value)} 
            className={`object-cover w-full h-full ${videoError ? 'hidden' : 'block'}`} 
            autoPlay 
            muted 
            loop 
            playsInline
            onError={() => setVideoError(true)}
            onLoadStart={() => setVideoError(false)}
          />
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100">
              <VideoIcon className="h-8 w-8 mb-2 opacity-50" />
              <span className="text-sm font-medium">Video Not Found</span>
              <span className="text-xs text-center px-4 mt-1 mb-3">
                (If this is an 'assets/...' path, it only exists in the mobile app)
              </span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-white"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Upload Video'}
              </Button>
            </div>
          )}
          <div className={`absolute inset-0 bg-black/50 transition-opacity flex items-center justify-center gap-2 ${videoError ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Change Video'}
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
              <span>Uploading {uploadProgress}%...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <UploadCloud className="h-5 w-5" />
              <span>Click to Upload Video</span>
            </div>
          )}
        </Button>
      )}
      
      {/* Fallback to text input for manual entry or if upload fails */}
      <div className="text-xs text-slate-400 mt-2">
        Or URL: 
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="ml-2 bg-transparent border-b border-slate-200 focus:outline-none focus:border-slate-400 w-full truncate max-w-[200px]"
          placeholder="https://..."
        />
        {errorMessage && (
          <div className="text-red-500 mt-2 font-medium break-words">
            Upload Error: {errorMessage}
          </div>
        )}
      </div>
    </div>
  )
}
