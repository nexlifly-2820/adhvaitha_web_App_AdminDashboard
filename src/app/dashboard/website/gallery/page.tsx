'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ImageUpload } from '@/components/ImageUpload';
import { toast } from 'sonner';
import Swal from 'sweetalert2';
import { Loader2, Trash2, Image as ImageIcon, CheckCircle2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

export default function WebsiteGallery() {
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);

  // Preview States
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await fetch('/api/get/website/gallery');
      const data = await response.json();
      if (data.images && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
      toast.error('Failed to load existing gallery images.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (url: string) => {
    if (images.length < 3) {
      setImages((prev) => [...prev, url]);
    }
  };

  const handleRemoveClick = (indexToRemove: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you want to remove this image?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
        toast.success('Image removed.');
      }
    });
  };

  const handlePublish = async () => {
    if (images.length !== 3) {
      toast.error('Please upload exactly 3 images before publishing.');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch('/api/post/website/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ images }),
      });

      const data = await response.json();
      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          text: data.message || 'Gallery published successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
      } else {
        Swal.fire('Error', data.error || 'Failed to publish gallery.', 'error');
      }
    } catch (error) {
      console.error('Error publishing gallery:', error);
      Swal.fire('Error', 'An error occurred while publishing.', 'error');
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreviewClick = async () => {
    setIsPreviewLoading(true);
    try {
      const response = await fetch('/api/get/website/gallery');
      const data = await response.json();
      if (data.images && Array.isArray(data.images) && data.images.length > 0) {
        setPreviewImages(data.images);
        setCurrentPreviewIndex(0);
        setIsPreviewOpen(true);
      } else {
        Swal.fire('No Images', 'There are no published images to preview.', 'info');
      }
    } catch (error) {
      console.error('Failed to fetch preview:', error);
      Swal.fire('Error', 'Failed to load preview images.', 'error');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
          <span className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg text-indigo-600 dark:text-indigo-400">
            <ImageIcon className="w-6 h-6" />
          </span>
          Website Gallery
        </h2>
        <p className="text-slate-500 text-lg">
          Manage the gallery section of your website. Upload exactly 3 high-quality images.
        </p>
      </div>

      <Card className="border-none bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
          <CardDescription>
            You can upload a maximum of 3 images. Each image should be less than 10MB in size.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {images.map((url, index) => (
              <div key={index} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video shadow-sm transition-all hover:shadow-md">
                <img src={url} alt={`Gallery ${index + 1}`} className="object-cover w-full h-full" />
                <div className="absolute top-2 right-2 transition-opacity duration-300 z-10">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveClick(index)}
                    className="shadow-md h-8 w-8 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md backdrop-blur-md">
                  Image {index + 1}
                </div>
              </div>
            ))}

            {images.length < 3 && (
              <div className="h-full flex flex-col justify-center">
                <ImageUpload
                  value=""
                  onChange={handleImageUpload}
                  maxSizeMB={10}
                  folder="website_gallery"
                />
                <p className="text-center text-xs text-slate-500 mt-2">
                  {3 - images.length} slot(s) remaining
                </p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 p-6 flex justify-between items-center rounded-b-xl flex-wrap gap-4">
          <div className="text-sm text-slate-500">
            {images.length === 3 ? (
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Ready to publish
              </span>
            ) : (
              <span>Upload {3 - images.length} more image(s) to publish.</span>
            )}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={handlePreviewClick}
              disabled={isPreviewLoading}
              className="bg-white dark:bg-slate-900"
            >
              {isPreviewLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
              Preview Gallery
            </Button>
            <Button
              onClick={handlePublish}
              disabled={images.length !== 3 || isPublishing}
              className="min-w-[140px] bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all hover:shadow-lg disabled:opacity-50"
              size="lg"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                'Publish Gallery'
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl border-none shadow-none bg-black/90 text-white flex flex-col items-center justify-center p-0 overflow-hidden h-[90vh]">
          <DialogHeader className="absolute top-4 left-4 z-50">
            <DialogTitle className="text-white text-xl">Published Gallery Preview</DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-full flex items-center justify-center p-12">
            {previewImages.length > 0 && (
              <img
                src={previewImages[currentPreviewIndex]}
                alt={`Preview ${currentPreviewIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            )}

            {previewImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 z-20"
                  onClick={() => setCurrentPreviewIndex((prev) => (prev > 0 ? prev - 1 : previewImages.length - 1))}
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white rounded-full w-12 h-12 z-20"
                  onClick={() => setCurrentPreviewIndex((prev) => (prev < previewImages.length - 1 ? prev + 1 : 0))}
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>
          <div className="absolute bottom-6 z-50 text-white bg-black/50 px-4 py-1 rounded-full text-sm">
            {currentPreviewIndex + 1} / {previewImages.length}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
