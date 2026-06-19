"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase-web";
import { toast } from "sonner";
import Swal from "sweetalert2";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { useEffect } from "react";

const CATEGORIES = [
  "Prepared foods",
  "ready to eat",
  "salt spices & soups",
  "Indian sweets and snacks"
];

const UNITS = ["grams", "kg"];

export function AddProductDialog({ onProductAdded, initialData, open, setOpen }: { onProductAdded: () => void, initialData?: any, open?: boolean, setOpen?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && setOpen !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? setOpen : setInternalOpen;

  const [hasChanges, setHasChanges] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (setDialogOpen) setDialogOpen(isOpen);
    if (!isOpen) {
      if (hasChanges) {
        onProductAdded();
        setHasChanges(false);
      }
      setTimeout(() => {
        handleReset();
      }, 300);
    }
  };

  const [productName, setProductName] = useState(initialData?.productName || initialData?.name || "");
  const [productDescription, setProductDescription] = useState(initialData?.productDescription || initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [minInput, setMinInput] = useState(initialData?.minQuantity?.value || "");
  const [minUnit, setMinUnit] = useState(initialData?.minQuantity?.unit || "grams");
  const [maxInput, setMaxInput] = useState(initialData?.maxQuantity?.value || "");
  const [maxUnit, setMaxUnit] = useState(initialData?.maxQuantity?.unit || "kg");
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleReset = () => {
    setProductName(initialData?.productName || initialData?.name || "");
    setProductDescription(initialData?.productDescription || initialData?.description || "");
    setCategory(initialData?.category || "");
    setMinInput(initialData?.minQuantity?.value || "");
    setMinUnit(initialData?.minQuantity?.unit || "grams");
    setMaxInput(initialData?.maxQuantity?.value || "");
    setMaxUnit(initialData?.maxQuantity?.unit || "kg");
    setFiles([]);
    setFileUrls([]);
    setExistingImages(initialData?.images || []);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => {
        const combined = [...prev, ...newFiles].slice(0, 3 - existingImages.length);
        // Clean up old URLs
        fileUrls.forEach(url => URL.revokeObjectURL(url));
        setFileUrls(combined.map(file => URL.createObjectURL(file)));
        return combined;
      });
    }
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(prev => {
      const newImages = [...prev];
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleRemoveImage = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles.splice(index, 1);
      
      const newUrls = [...fileUrls];
      URL.revokeObjectURL(newUrls[index]);
      newUrls.splice(index, 1);
      setFileUrls(newUrls);
      
      return newFiles;
    });
  };

  useEffect(() => {
    return () => {
      fileUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handlePublish = async () => {
    // Strict Validation
    if (!productName || productName.length > 100) return toast.error("Product name is required (max 100 chars)");
    if (!productDescription || productDescription.length > 2000) return toast.error("Product description is required (max 2000 chars)");
    if (!category) return toast.error("Please select a category");
    if (!minInput || !minUnit) return toast.error("Min input and unit are required");
    if (!maxInput || !maxUnit) return toast.error("Max input and unit are required");
    if (existingImages.length === 0 && files.length === 0) return toast.error("At least one image is required");

    setIsUploading(true);
    try {
      const documentId = initialData?.id || crypto.randomUUID();
      const imageUrls: string[] = [...existingImages];

      // 1. Upload Images
      for (const file of files) {
        const storageRef = ref(storage, `website/products/${documentId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }

      // 2. Call API Route
      const payload: any = {
        id: documentId,
        productName,
        productDescription,
        category: category.toUpperCase().replace(/ /g, '_'),
        minInput,
        minUnit,
        maxInput,
        maxUnit,
        images: imageUrls,
        isNew: !initialData?.id
      };

      const res = await fetch("/dashboard/website/api/publish-website-products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish product");
      }

      Swal.fire({
        title: "Success",
        text: data.message || "Product published successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Do not close the dialog per requirements: "stay in that dialog open only"
        setHasChanges(true);
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to publish product",
        icon: "error",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>Add Product</Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className="sm:max-w-[800px] max-h-[90vh] flex flex-col overflow-hidden p-0"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.swal2-container')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="shrink-0 p-6 pb-2">
          <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            Add a new product to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-6 py-2 overflow-y-auto flex-1">
          <div className="grid gap-2">
            <Label htmlFor="productName">Product Name *</Label>
            <Input id="productName" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Mango Pickle" maxLength={100} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="productDescription">Product Description *</Label>
            <Textarea 
              id="productDescription" 
              className="min-h-[150px]" 
              value={productDescription} 
              onChange={e => setProductDescription(e.target.value)} 
              placeholder="Describe the product..." 
              maxLength={2000}
            />
          </div>

          <div className="grid gap-2">
            <Label>Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Min Quantity *</Label>
              <div className="flex gap-2">
                <Input type="number" value={minInput} onChange={e => setMinInput(e.target.value)} placeholder="e.g. 500" />
                <Select value={minUnit} onValueChange={setMinUnit}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Max Quantity *</Label>
              <div className="flex gap-2">
                <Input type="number" value={maxInput} onChange={e => setMaxInput(e.target.value)} placeholder="e.g. 2" />
                <Select value={maxUnit} onValueChange={setMaxUnit}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="images">Images (Max 3) *</Label>
            <Input id="images" type="file" accept="image/*" multiple className="overflow-hidden text-ellipsis min-w-0" onChange={handleFileChange} disabled={existingImages.length + files.length >= 3} />
            
            {(existingImages.length > 0 || files.length > 0) && (
              <div className="flex gap-4 mt-2 flex-wrap">
                {existingImages.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative w-20 h-20 rounded-md border border-slate-200 shadow-sm shrink-0">
                    <img 
                      src={url} 
                      alt={`existing-preview-${idx}`} 
                      className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => setPreviewImage(url)}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingImage(idx)} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {fileUrls.map((url, idx) => (
                  <div key={`new-${idx}`} className="relative w-20 h-20 rounded-md border border-slate-200 shadow-sm shrink-0">
                    <img 
                      src={url} 
                      alt={`preview-${idx}`} 
                      className="w-full h-full object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={() => setPreviewImage(url)}
                    />
                    <button 
                      type="button" 
                      onClick={() => handleRemoveImage(idx)} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-sm z-10"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <span className="text-xs text-muted-foreground">{existingImages.length + files.length}/3 file(s) selected</span>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end shrink-0 p-6 pt-2">
          <Button variant="outline" onClick={handleReset} disabled={isUploading}>Reset</Button>
          <Button onClick={handlePublish} disabled={isUploading}>
            {isUploading ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      {/* Full Image Preview Overlay Inside DialogContent */}
      {previewImage && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm sm:rounded-lg">
          <button 
            type="button"
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full p-2 text-white transition-colors cursor-pointer z-50"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={previewImage} className="max-w-full max-h-full object-contain p-8 shadow-2xl" alt="Full Preview" />
        </div>
      )}
    </DialogContent>
    </Dialog>
  );
}
