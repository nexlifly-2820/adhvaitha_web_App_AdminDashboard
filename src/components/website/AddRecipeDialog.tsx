"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Plus, X } from "lucide-react";
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

const PROCESS_LEVELS = ["easy", "medium", "hard"];
const TIME_UNITS = ["minutes", "hours"];

export function AddRecipeDialog({ onRecipeAdded, initialData, open, setOpen }: { onRecipeAdded: () => void, initialData?: any, open?: boolean, setOpen?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && setOpen !== undefined;
  const dialogOpen = isControlled ? open : internalOpen;
  const setDialogOpen = isControlled ? setOpen : setInternalOpen;

  const [hasChanges, setHasChanges] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (setDialogOpen) setDialogOpen(isOpen);
    if (!isOpen) {
      if (hasChanges) {
        onRecipeAdded();
        setHasChanges(false);
      }
      setTimeout(() => {
        handleReset();
      }, 300);
    }
  };

  const [recipeName, setRecipeName] = useState(initialData?.recipeName || initialData?.name || "");
  const [recipeDescription, setRecipeDescription] = useState(initialData?.recipeDescription || initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [makingTimeInput, setMakingTimeInput] = useState(initialData?.makingTime?.value || "");
  const [makingTimeUnit, setMakingTimeUnit] = useState(initialData?.makingTime?.unit || "minutes");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""]);
  const [makingProcess, setMakingProcess] = useState(initialData?.makingProcess || "");
  const [files, setFiles] = useState<File[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>(initialData?.images || []);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleReset = () => {
    setRecipeName(initialData?.recipeName || initialData?.name || "");
    setRecipeDescription(initialData?.recipeDescription || initialData?.description || "");
    setCategory(initialData?.category || "");
    setMakingTimeInput(initialData?.makingTime?.value || "");
    setMakingTimeUnit(initialData?.makingTime?.unit || "minutes");
    setDifficulty(initialData?.difficulty || "");
    setIngredients(initialData?.ingredients || [""]);
    setMakingProcess(initialData?.makingProcess || "");
    setFiles([]);
    setFileUrls([]);
    setExistingImages(initialData?.images || []);
  };

  const addIngredient = () => setIngredients([...ingredients, ""]);
  
  const updateIngredient = (index: number, val: string) => {
    const newArr = [...ingredients];
    newArr[index] = val;
    setIngredients(newArr);
  };
  
  const removeIngredient = (index: number) => {
    const newArr = [...ingredients];
    newArr.splice(index, 1);
    setIngredients(newArr);
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

  const handlePublish = async () => {
    // Strict Validation
    if (!recipeName || recipeName.length > 100) return toast.error("Recipe name is required (max 100 chars)");
    if (!recipeDescription || recipeDescription.length > 2000) return toast.error("Recipe description is required (max 2000 chars)");
    if (!category) return toast.error("Please select a category");
    if (!makingTimeInput || !makingTimeUnit) return toast.error("Making time is required");
    if (!difficulty) return toast.error("Please select a making process difficulty");
    if (!makingProcess || makingProcess.length > 5000) return toast.error("Making process is required (max 5000 chars)");
    
    const validIngredients = ingredients.filter(i => i.trim() !== "");
    if (validIngredients.length === 0) return toast.error("At least one ingredient is required");
    if (existingImages.length === 0 && files.length === 0) return toast.error("At least one image is required");

    setIsPublishing(true);
    try {
      const documentId = initialData?.id || crypto.randomUUID();
      const imageUrls: string[] = [...existingImages];

      // 1. Upload Images
      for (const file of files) {
        const storageRef = ref(storage, `website/recipes/${documentId}/${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        imageUrls.push(downloadURL);
      }

      const payload = {
        id: documentId,
        recipeName,
        recipeDescription,
        category,
        makingTimeInput,
        makingTimeUnit,
        difficulty,
        ingredients: validIngredients,
        makingProcess,
        images: imageUrls,
        isNew: !initialData?.id
      };

      const res = await fetch("/dashboard/website/api/publish-website-recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to publish recipe");
      }

      Swal.fire({
        title: "Success",
        text: data.message || "Recipe published successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setHasChanges(true);
      });
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Failed to publish recipe",
        icon: "error",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>Add Recipe</Button>
        </DialogTrigger>
      )}
      <DialogContent 
        className="sm:max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden p-0"
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('.swal2-container')) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader className="shrink-0 p-6 pb-2">
          <DialogTitle>{initialData ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
          <DialogDescription>
            Add a new recipe to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-6 py-2 overflow-y-auto flex-1">
          <div className="grid gap-2">
            <Label htmlFor="recipeName">Recipe Name *</Label>
            <Input id="recipeName" value={recipeName} onChange={e => setRecipeName(e.target.value)} placeholder="e.g. Traditional Mango Pickle" maxLength={100} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="recipeDescription">Recipe Description *</Label>
            <Textarea 
              id="recipeDescription" 
              className="min-h-[150px]" 
              value={recipeDescription} 
              onChange={e => setRecipeDescription(e.target.value)} 
              placeholder="Briefly describe this recipe..." 
              maxLength={2000}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="grid gap-2">
              <Label>Process Difficulty *</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  {PROCESS_LEVELS.map(level => (
                    <SelectItem key={level} value={level} className="capitalize">{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Making Time *</Label>
            <div className="flex gap-2">
              <Input type="number" value={makingTimeInput} onChange={e => setMakingTimeInput(e.target.value)} placeholder="e.g. 45" />
              <Select value={makingTimeUnit} onValueChange={setMakingTimeUnit}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Ingredients *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Input 
                    value={ing} 
                    onChange={e => updateIngredient(idx, e.target.value)} 
                    placeholder={`Ingredient ${idx + 1}`} 
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(idx)} disabled={ingredients.length === 1}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="makingProcess">Making Process *</Label>
            <Textarea 
              id="makingProcess" 
              className="min-h-[150px]" 
              value={makingProcess} 
              onChange={e => setMakingProcess(e.target.value)} 
              placeholder="Step by step instructions..." 
              maxLength={5000}
            />
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
          <Button variant="outline" onClick={handleReset} disabled={isPublishing}>Reset</Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish"}
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
