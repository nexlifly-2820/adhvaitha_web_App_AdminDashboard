"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStatsCardProps {
  totalOrders?: number;
  isLoading?: boolean;
}

export function DashboardStatsCard({ totalOrders, isLoading = false }: DashboardStatsCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-md hover:-translate-y-1"
      onClick={() => mounted && router.push("/dashboard/orders")}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-[100px]" />
        ) : (
          <div className="text-2xl font-bold">{totalOrders || 0}</div>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          Click to view all orders
        </p>
      </CardContent>
    </Card>
  );
}
