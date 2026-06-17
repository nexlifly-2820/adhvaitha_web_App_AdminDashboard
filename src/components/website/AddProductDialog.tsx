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

  const [productName, setProductName] = useState(initialData?.productName || initialData?.name || "");
  const [productDescription, setProductDescription] = useState(initialData?.productDescription || initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [minInput, setMinInput] = useState(initialData?.minQuantity?.value || "");
  const [minUnit, setMinUnit] = useState(initialData?.minQuantity?.unit || "grams");
  const [maxInput, setMaxInput] = useState(initialData?.maxQuantity?.value || "");
  const [maxUnit, setMaxUnit] = useState(initialData?.maxQuantity?.unit || "kg");
  const [files, setFiles] = useState<File[]>([]);
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).slice(0, 3);
      setFiles(selected);
    }
  };

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handlePublish = async () => {
    // Strict Validation
    if (!productName || productName.length > 100) return toast.error("Product name is required (max 100 chars)");
    if (!productDescription || productDescription.length > 2000) return toast.error("Product description is required (max 2000 chars)");
    if (!category) return toast.error("Please select a category");
    if (!minInput || !minUnit) return toast.error("Min input and unit are required");
    if (!maxInput || !maxUnit) return toast.error("Max input and unit are required");
    if (!initialData && files.length === 0) return toast.error("At least one image is required");

    setIsUploading(true);
    try {
      const slug = generateSlug(productName);
      const imageUrls: string[] = initialData?.images ? [...initialData.images] : [];

      // 1. Upload Images
      for (const file of files) {
        const storageRef = ref(storage, `website/products/${slug}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }

      // 2. Call API Route
      const payload = {
        productName,
        productDescription,
        category,
        minInput,
        minUnit,
        maxInput,
        maxUnit,
        images: imageUrls
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
      });
      // Do not close the dialog per requirements: "stay in that dialog open only"
      onProductAdded();
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>Add Product</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogDescription>
            Add a new product to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
            <Input id="images" type="file" accept="image/*" multiple onChange={handleFileChange} />
            <span className="text-xs text-muted-foreground">{files.length} file(s) selected</span>
          </div>
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleReset} disabled={isUploading}>Reset</Button>
          <Button onClick={handlePublish} disabled={isUploading}>
            {isUploading ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
