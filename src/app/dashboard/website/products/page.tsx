"use client";

import { useState, useEffect, useCallback } from "react";
import { ProductsTable, WebsiteProduct } from "@/components/website/ProductsTable";
import { AddProductDialog } from "@/components/website/AddProductDialog";

export default function WebsiteProductsPage() {
  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/dashboard/website/api/get-website-products');
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
      } else {
        console.error("Failed to fetch products:", result.error);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] p-8 pt-6 space-y-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Website Products</h2>
          <p className="text-muted-foreground mt-1">
            Manage the products displayed on the public website menu.
          </p>
        </div>
        <AddProductDialog onProductAdded={fetchProducts} />
      </div>

      <div className="flex-1 overflow-hidden">
        <ProductsTable data={products} isLoading={isLoading} onRefresh={fetchProducts} />
      </div>
    </div>
  );
}
