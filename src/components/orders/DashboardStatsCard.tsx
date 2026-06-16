"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardStatsCardProps {
  totalOrders: number;
}

export function DashboardStatsCard({ totalOrders }: DashboardStatsCardProps) {
  const [loading, setLoading] = useState(true);

  // Simulate a network loading state for the skeleton
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Card className="w-full rounded-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          <Skeleton className="h-4 w-4 rounded-full" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href="/dashboard/orders-management" className="block w-full">
      <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-l-4 border-l-primary group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            Total Orders
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all time
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
