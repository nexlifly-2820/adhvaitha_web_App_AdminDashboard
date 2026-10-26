'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  ExternalLink,
  Smartphone,
  Monitor,
  Maximize,
  Minimize,
  Link as LinkIcon,
  Check,
  Sparkles
} from 'lucide-react'

interface VideoUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
  maxSizeMB?: number;
  aspectRatio?: 'landscape' | 'portrait' | 'auto';
  label?: string;
}

export function VideoUpload({ 
  value, 
  onChange, 
  folder = 'uploads/videos', 
  className = '', 
  maxSizeMB = 100,
  aspectRatio = 'auto',
  label
}: VideoUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoError, setVideoError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
  const [isVertical, setIsVertical] = useState(false)
  const [currentAspect, setCurrentAspect] = useState<'landscape' | 'portrait'>(
    aspectRatio === 'portrait' ? 'portrait' : 'landscape'
  )
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover')
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false)
  const [urlInputValue, setUrlInputValue] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Detect if current media is an animated GIF
  const isGif = Boolean(value && (value.toLowerCase().endsWith('.gif') || value.toLowerCase().includes('.gif')));

  // Sync aspect ratio when prop changes
  useEffect(() => {
    if (aspectRatio === 'portrait') {
      setCurrentAspect('portrait')
    } else if (aspectRatio === 'landscape') {
      setCurrentAspect('landscape')
    }
  }, [aspectRatio])

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

  const handleLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const v = e.currentTarget;
    if (v.videoHeight && v.videoWidth) {
      const isVert = v.videoHeight > v.videoWidth;
      setIsVertical(isVert);
      // Auto-switch to portrait for full screen videos unless explicitly forced by prop
      if (aspectRatio === 'auto') {
        setCurrentAspect(isVert ? 'portrait' : 'landscape');
      }
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileSizeMB = file.size / (1024 * 1024);

    // Validate size (defaults to 100MB standard Cloudinary unsigned limit)
    if (fileSizeMB > maxSizeMB) {
      const msg = `Selected file is ${fileSizeMB.toFixed(1)}MB. Limit is ${maxSizeMB}MB. For best mobile app performance, please compress under 100MB.`;
      toast.error(msg);
      setErrorMessage(msg);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true)
    setUploadProgress(0)
    setErrorMessage(null)
    
    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error('Cloudinary environment variables missing. Please configure NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME & NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.');
      }

      // Use /auto/upload to handle both MP4/MOV videos AND animated GIFs (.gif) seamlessly
      const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', 'adhvaitha_foods_videos');

      // Use XMLHttpRequest to track live upload progress
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
          setVideoError(false);
          toast.success(file.name.endsWith('.gif') ? 'Full-screen GIF animation uploaded to Cloudinary!' : 'Video uploaded successfully to Cloudinary!');
        } else {
          let errorMsg = 'Failed to upload file';
          try {
            const errJson = JSON.parse(xhr.responseText);
            errorMsg = errJson.error?.message || xhr.statusText;
          } catch(e) {}
          
          if (errorMsg.includes('File size too large')) {
            errorMsg = 'Cloudinary size limit reached (max 100MB). Please compress the video or export under 100MB.';
          }
          setErrorMessage(`Cloudinary Error: ${errorMsg}`);
          toast.error(errorMsg);
        }
      };

      xhr.onerror = () => {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setErrorMessage('Network error during upload to Cloudinary. Please check your connection.');
        toast.error('Upload failed due to network error.');
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

  const handleApplyUrl = () => {
    if (!urlInputValue.trim()) return;
    onChange(urlInputValue.trim());
    setIsUrlModalOpen(false);
    setUrlInputValue('');
    setVideoError(false);
    toast.success('Media URL updated successfully!');
  };

  const videoSrc = value
    ? (value.startsWith('assets/')
        ? `/${value}`
        : (value.startsWith('/') ? `https://adhvaithafoods.in${value}` : value))
    : '';

  const isPortraitMode = currentAspect === 'portrait';

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Hidden file input supporting full-screen videos (MP4, MOV, WebM) AND animated GIFs */}
      <input
        type="file"
        accept="video/*,image/gif,.mp4,.mov,.webm,.m4v,.gif"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      {value ? (
        <div className="flex flex-col items-center">
          {/* Main Video/GIF Card Container with dynamic Aspect Ratio */}
          <div 
            className={`relative group overflow-hidden bg-black flex items-center justify-center shadow-lg transition-all duration-300 ${
              isPortraitMode 
                ? 'w-full max-w-[270px] aspect-[9/16] rounded-[24px] border-[3px] border-slate-800 dark:border-slate-700 shadow-2xl' 
                : 'w-full aspect-video rounded-xl border border-slate-200 dark:border-slate-800'
            }`}
          >
            {/* Mobile phone camera notch indicator for portrait full-screen */}
            {isPortraitMode && (
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-20 h-1.5 w-14 bg-white/30 rounded-full pointer-events-none" />
            )}

            {isGif ? (
              <img 
                src={videoSrc}
                alt="Full-Screen Animation"
                className={`w-full h-full transition-all duration-200 ${
                  fitMode === 'cover' ? 'object-cover' : 'object-contain'
                } ${videoError ? 'hidden' : 'block'}`}
                onError={() => setVideoError(true)}
                onLoad={(e) => {
                  setVideoError(false);
                  const img = e.currentTarget;
                  if (img.naturalHeight && img.naturalWidth) {
                    const isVert = img.naturalHeight > img.naturalWidth;
                    setIsVertical(isVert);
                    if (aspectRatio === 'auto') {
                      setCurrentAspect(isVert ? 'portrait' : 'landscape');
                    }
                  }
                }}
              />
            ) : (
              <video 
                ref={videoRef}
                src={videoSrc} 
                className={`w-full h-full transition-all duration-200 ${
                  fitMode === 'cover' ? 'object-cover' : 'object-contain'
                } ${videoError ? 'hidden' : 'block'}`} 
                autoPlay 
                muted={isMuted} 
                loop 
                playsInline
                onLoadedMetadata={handleLoadedMetadata}
                onError={() => setVideoError(true)}
                onLoadStart={() => setVideoError(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            )}

            {/* Fallback if media cannot load */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-900 p-4 z-10">
                <VideoIcon className="h-10 w-10 mb-2 opacity-50 text-orange-500" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Media Preview Unavailable</span>
                <span className="text-xs text-center px-4 mt-1 mb-3 text-slate-500">
                  URL may be an internal Flutter asset or requires network access.
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white dark:bg-slate-800 shadow-sm text-xs"
                  >
                    {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <UploadCloud className="h-3.5 w-3.5 mr-1" />}
                    Upload New File
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUrlInputValue(value);
                      setIsUrlModalOpen(true);
                    }}
                    className="text-xs text-slate-600 hover:text-slate-900 dark:text-slate-400"
                  >
                    Edit URL
                  </Button>
                </div>
              </div>
            )}

            {/* Interactive Player Controls Overlay */}
            {!videoError && (
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 z-10">
                {/* Top controls: Badges & Aspect switchers */}
                <div className="flex items-center justify-between gap-1">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {isGif ? '✨ Animated GIF' : (isPortraitMode ? '9:16 Full Screen' : '16:9 Landscape')}
                  </span>
                  
                  <div className="flex items-center gap-1">
                    {/* Aspect Ratio Switcher */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setCurrentAspect(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
                      className="h-7 w-7 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-lg border border-white/20"
                      title={isPortraitMode ? "Switch to 16:9 Landscape Box" : "Switch to 9:16 Full-Screen Mobile Box"}
                    >
                      {isPortraitMode ? <Monitor className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                    </Button>

                    {/* Fit Mode Switcher */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setFitMode(prev => prev === 'cover' ? 'contain' : 'cover')}
                      className="h-7 w-7 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-lg border border-white/20 text-[10px] font-bold"
                      title={fitMode === 'cover' ? "Switch to Fit (No Crop)" : "Switch to Fill (Cover Screen)"}
                    >
                      {fitMode === 'cover' ? <Minimize className="h-3.5 w-3.5" /> : <Maximize className="h-3.5 w-3.5" />}
                    </Button>

                    {/* Fullscreen Modal Preview */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="h-7 w-7 text-white bg-black/50 hover:bg-black/80 hover:text-white rounded-lg border border-white/20"
                      title="Fullscreen Preview with Controls"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                    </Button>

                    {/* Remove Media */}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => onChange('')}
                      className="h-7 w-7 text-white bg-black/50 hover:bg-red-600/80 hover:text-white rounded-lg border border-white/20"
                      title="Remove Media"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Bottom controls: Play/Pause, Mute/Unmute, Change Video */}
                <div className="flex items-center justify-between gap-1">
                  {!isGif ? (
                    <div className="flex items-center gap-1.5">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={togglePlay}
                        className="h-7 w-7 text-white bg-black/60 hover:bg-white hover:text-black rounded-full border border-white/30 transition-all"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={toggleMute}
                        className="h-7 w-7 text-white bg-black/60 hover:bg-white hover:text-black rounded-full border border-white/30 transition-all"
                        title={isMuted ? "Unmute Audio" : "Mute Audio"}
                      >
                        {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                      </Button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-white/90 font-medium px-2 py-0.5 bg-black/50 rounded-full border border-white/20 flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-amber-400" /> Auto-Looping Animation
                    </span>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Button 
                      type="button" 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="h-7 px-2.5 bg-white/90 hover:bg-white text-slate-900 font-semibold text-xs shadow-md"
                    >
                      {isUploading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : <UploadCloud className="h-3 w-3 mr-1" />}
                      {isUploading ? `${uploadProgress}%` : 'Replace File'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick toggle bar below video for easy switching */}
          <div className="mt-2 flex items-center justify-between w-full max-w-[270px] text-[11px] text-slate-500">
            <button
              type="button"
              onClick={() => setCurrentAspect(prev => prev === 'portrait' ? 'landscape' : 'portrait')}
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium transition"
            >
              {isPortraitMode ? <Monitor className="h-3 w-3" /> : <Smartphone className="h-3 w-3" />}
              {isPortraitMode ? 'View as 16:9' : 'View as 9:16 Full Screen'}
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlInputValue(value);
                setIsUrlModalOpen(true);
              }}
              className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-medium transition"
            >
              <LinkIcon className="h-3 w-3" />
              Edit URL
            </button>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div className="flex flex-col gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="min-h-[140px] border-dashed border-2 border-orange-300 dark:border-orange-800 text-slate-600 dark:text-slate-300 hover:text-orange-600 hover:border-orange-500 bg-orange-50/40 dark:bg-slate-900/50 rounded-2xl transition-all p-4 flex flex-col justify-center"
          >
            {isUploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
                <span className="font-semibold text-sm">Uploading File to Cloudinary ({uploadProgress}%)...</span>
                <div className="w-48 bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-orange-600 h-full transition-all duration-150"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">Please keep this page open until complete</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="h-11 w-11 rounded-full bg-orange-100 dark:bg-orange-950 flex items-center justify-center text-orange-600 shadow-sm">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-bold text-sm block text-slate-800 dark:text-slate-200">
                    Click to Upload Video or Animated GIF (Full-Screen 9:16 & 16:9)
                  </span>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    Supports high-res mobile MP4, MOV, WebM, and GIF (up to {maxSizeMB}MB)
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Smartphone className="h-3 w-3" /> Full-Screen 9:16 Ready
                  </span>
                  <span className="text-[10px] bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded-full">
                    GIF & MP4 Auto-Detect
                  </span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full">
                    Cloudinary CDN
                  </span>
                </div>
              </div>
            )}
          </Button>

          {/* Quick Option to Paste Direct Video URL */}
          <div className="flex items-center justify-between px-1 text-xs text-slate-500">
            <span>Already have a Cloudinary, CDN, or GIF URL?</span>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => {
                setUrlInputValue('');
                setIsUrlModalOpen(true);
              }}
              className="text-xs text-orange-600 dark:text-orange-400 h-auto p-0 font-semibold hover:underline"
            >
              Paste Direct URL
            </Button>
          </div>
        </div>
      )}
      
      {/* Upload Error Banner */}
      {errorMessage && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-xl border border-red-200 dark:border-red-900 font-medium break-words space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <X className="h-3.5 w-3.5" /> Upload Failed
          </div>
          <div>{errorMessage}</div>
          <div className="text-[11px] text-slate-500 pt-1">
            Tip: You can also paste an existing Cloudinary or CDN URL directly using the "Paste Direct URL" button.
          </div>
        </div>
      )}

      {/* FULLSCREEN PREVIEW MODAL */}
      {isPreviewModalOpen && value && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className={`relative w-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col ${
            isPortraitMode ? 'max-w-md' : 'max-w-4xl'
          }`}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <VideoIcon className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-semibold text-white">
                  {isGif ? '✨ Animated GIF Preview' : (isPortraitMode ? '9:16 Full-Screen Mobile Preview' : '16:9 Video Preview')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <a 
                  href={videoSrc} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  Raw URL
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
            
            <div className={`bg-black flex items-center justify-center ${
              isPortraitMode ? 'aspect-[9/16] max-h-[75vh]' : 'aspect-video max-h-[70vh]'
            }`}>
              {isGif ? (
                <img 
                  src={videoSrc}
                  alt="Full-Screen Animation Preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={videoSrc} 
                  controls 
                  autoPlay 
                  playsInline
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between gap-2">
              <span className="truncate max-w-xs font-mono text-[11px] text-slate-300">{value}</span>
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={() => setIsPreviewModalOpen(false)}
                className="text-xs shrink-0"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* DIRECT URL MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 w-full max-w-md shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-orange-600" />
                Set Direct Media URL
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Paste any Cloudinary, CDN, or local asset link (e.g. assets/images/ambhujakshi_loading_fullscreen.gif or .mp4)
              </p>
            </div>

            <Input 
              placeholder="https://res.cloudinary.com/... or assets/images/....gif" 
              value={urlInputValue}
              onChange={e => setUrlInputValue(e.target.value)}
              className="text-xs font-mono"
              autoFocus
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsUrlModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleApplyUrl}
                disabled={!urlInputValue.trim()}
                className="text-xs bg-orange-600 hover:bg-orange-700 text-white font-semibold"
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Apply Media URL
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
