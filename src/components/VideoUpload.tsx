'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { UploadCloud, Loader2, Video as VideoIcon } from 'lucide-react'

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
      const CHUNK_SIZE = 256 * 1024; // 256KB chunks to prevent Vercel 10s timeouts
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        
        // Use FormData to avoid ModSecurity JSON XSS blocks
        const formData = new FormData();
        formData.append('fileName', fileName);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());
        formData.append('chunkData', chunk); // Append Blob directly

        const response = await fetch('/dashboard/app/api/upload_chunk', {
          method: 'POST',
          body: formData
        });

        let data;
        try {
          data = await response.json();
        } catch (e) {
          const text = await response.text();
          throw new Error(`Server returned invalid JSON. Vercel timeout? Output: ${text.substring(0, 80)}`);
        }

        if (!response.ok || !data.success) {
          throw new Error(data.error || `Failed to upload chunk ${i}`);
        }

        // Update progress
        setUploadProgress(Math.round(((i + 1) / totalChunks) * 100));

        // If last chunk, it returns the final URL
        if (i === totalChunks - 1 && data.url) {
          onChange(data.url);
          toast.success('Video uploaded perfectly!');
        }
      }
    } catch (error: any) {
      console.error('Upload error:', error)
      toast.error(error.message || 'Failed to upload video.')
      setErrorMessage(error.message || 'Failed to upload video.')
    } finally {
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
