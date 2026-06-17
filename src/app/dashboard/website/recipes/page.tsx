"use client";

import { useState, useEffect, useCallback } from "react";
import { RecipesTable, WebsiteRecipe } from "@/components/website/RecipesTable";
import { AddRecipeDialog } from "@/components/website/AddRecipeDialog";

export default function WebsiteRecipesPage() {
  const [recipes, setRecipes] = useState<WebsiteRecipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/dashboard/website/api/get-website-recipes');
      const result = await response.json();
      if (result.success) {
        setRecipes(result.data);
      } else {
        console.error("Failed to fetch recipes:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Website Recipes</h2>
          <p className="text-muted-foreground mt-1">
            Manage the recipes displayed on the public website.
          </p>
        </div>
        <AddRecipeDialog onRecipeAdded={fetchRecipes} />
      </div>

      <RecipesTable data={recipes} isLoading={isLoading} onRefresh={fetchRecipes} />
    </div>
  );
}
