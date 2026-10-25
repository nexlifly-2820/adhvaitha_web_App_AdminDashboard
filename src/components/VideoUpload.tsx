'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { 
  UploadCloud, 
  Loader2, 
  Video as VideoIcon, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Trash2,
  ExternalLink 
} from 'lucide-react'

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
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }

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
          toast.error('Cloudinary Error: ' + errorMsg);
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

  const videoSrc = value
    ? (value.startsWith('assets/')
        ? `/${value}`
        : (value.startsWith('/') ? `https://adhvaithafoods.in${value}` : value))
    : '';

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
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 aspect-video bg-black flex items-center justify-center shadow-sm">
          <video 
            ref={videoRef}
            src={videoSrc} 
            className={`object-cover w-full h-full ${videoError ? 'hidden' : 'block'}`} 
            autoPlay 
            muted={isMuted} 
            loop 
            playsInline
            onError={() => setVideoError(true)}
            onLoadStart={() => setVideoError(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Fallback if video cannot load */}
          {videoError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-900 p-4">
              <VideoIcon className="h-10 w-10 mb-2 opacity-50 text-orange-500" />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Video Preview Unavailable</span>
              <span className="text-xs text-center px-4 mt-1 mb-3 text-slate-500">
                URL may be offline or local asset. Click below to upload a fresh MP4 video.
              </span>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="bg-white dark:bg-slate-800 shadow-sm"
              >
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <UploadCloud className="h-4 w-4 mr-1" />}
                Upload New Video
              </Button>
            </div>
          )}

          {/* Interactive Player Controls Overlay */}
          {!videoError && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/30 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
              {/* Top controls: Badges & Fullscreen Preview */}
              <div className="flex items-center justify-between">
                <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Preview Mode
                </span>
                <div className="flex items-center gap-1.5">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => setIsPreviewModalOpen(true)}
                    className="h-8 w-8 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-lg border border-white/20"
                    title="Fullscreen Preview with Controls"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => onChange('')}
                    className="h-8 w-8 text-white bg-black/50 hover:bg-red-600/80 hover:text-white rounded-lg border border-white/20"
                    title="Remove Video"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Bottom controls: Play/Pause, Mute/Unmute, Change Video */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={togglePlay}
                    className="h-8 w-8 text-white bg-black/60 hover:bg-white hover:text-black rounded-full border border-white/30 transition-all"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={toggleMute}
                    className="h-8 w-8 text-white bg-black/60 hover:bg-white hover:text-black rounded-full border border-white/30 transition-all"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <span className="text-[11px] text-white/80 font-medium hidden sm:inline">
                    {isMuted ? 'Muted' : 'Sound On'}
                  </span>
                </div>

                <Button 
                  type="button" 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs shadow-md"
                >
                  {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <UploadCloud className="h-3.5 w-3.5 mr-1" />}
                  {isUploading ? `${uploadProgress}%` : 'Change Video'}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="h-28 border-dashed border-2 border-orange-300 dark:border-orange-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:border-orange-500 bg-orange-50/40 dark:bg-slate-900/50 rounded-xl transition-all"
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-orange-600" />
              <span className="font-semibold text-sm">Uploading Video {uploadProgress}% to Cloudinary...</span>
              <span className="text-xs text-slate-400">Please keep this window open</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <div className="h-10 w-10 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600">
                <UploadCloud className="h-5 w-5" />
              </div>
              <span className="font-semibold text-sm">Click to Upload MP4 Video</span>
              <span className="text-xs text-slate-400">Uploads directly to Cloudinary (up to {maxSizeMB}MB)</span>
            </div>
          )}
        </Button>
      )}
      
      {/* Upload Error Banner */}
      {errorMessage && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/50 p-2.5 rounded-lg border border-red-200 dark:border-red-900 font-medium break-words">
          Upload Error: {errorMessage}
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewModalOpen && value && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-white">Full Video Player Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={videoSrc} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  Open Raw URL
                </a>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="aspect-video bg-black flex items-center justify-center">
              <video 
                src={videoSrc} 
                controls 
                autoPlay 
                playsInline
                className="w-full h-full max-h-[70vh] object-contain"
              />
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <span className="truncate max-w-md font-mono text-[11px] text-slate-300">{value}</span>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-xs"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
