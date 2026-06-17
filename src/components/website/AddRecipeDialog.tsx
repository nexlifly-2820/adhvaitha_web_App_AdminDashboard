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
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Trash2, Plus } from "lucide-react";
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

  const [recipeName, setRecipeName] = useState(initialData?.recipeName || initialData?.name || "");
  const [recipeDescription, setRecipeDescription] = useState(initialData?.recipeDescription || initialData?.description || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [makingTimeInput, setMakingTimeInput] = useState(initialData?.makingTime?.value || "");
  const [makingTimeUnit, setMakingTimeUnit] = useState(initialData?.makingTime?.unit || "minutes");
  const [difficulty, setDifficulty] = useState(initialData?.difficulty || "");
  const [ingredients, setIngredients] = useState<string[]>(initialData?.ingredients || [""]);
  const [makingProcess, setMakingProcess] = useState(initialData?.makingProcess || "");
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

    setIsPublishing(true);
    try {
      const payload = {
        recipeName,
        recipeDescription,
        category,
        makingTimeInput,
        makingTimeUnit,
        difficulty,
        ingredients: validIngredients,
        makingProcess
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
      });
      onRecipeAdded();
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
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {!isControlled && (
        <DialogTrigger asChild>
          <Button>Add Recipe</Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Recipe" : "Add New Recipe"}</DialogTitle>
          <DialogDescription>
            Add a new recipe to be displayed on the website.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
        </div>
        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={handleReset} disabled={isPublishing}>Reset</Button>
          <Button onClick={handlePublish} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
