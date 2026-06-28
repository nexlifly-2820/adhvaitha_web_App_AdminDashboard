"use client";

import { useState, useMemo } from "react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters, FiltersState } from "@/components/orders/OrdersFilters";
import { OrdersPagination } from "@/components/orders/OrdersPagination";
import { SearchInput } from "@/components/orders/SearchInput";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { mockOrders } from "@/data/mock-orders";
import { OrderDetails } from "@/types/order";
import { isWithinInterval, subDays, startOfMonth } from "date-fns";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FiltersState>({
    orderStatus: "All",
    paymentStatus: "All",
    dateRange: "All",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Memoized filtered data
  const filteredData = useMemo(() => {
    let data = mockOrders;

    // Search filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.mobileNumber.toLowerCase().includes(query)
      );
    }

    // Status filters
    if (filters.orderStatus !== "All") {
      data = data.filter((order) => order.orderStatus === filters.orderStatus);
    }
    
    if (filters.paymentStatus !== "All") {
      data = data.filter((order) => order.paymentStatus === filters.paymentStatus);
    }

    // Date range filter
    if (filters.dateRange !== "All") {
      const now = new Date();
      data = data.filter((order) => {
        const orderDate = new Date(order.orderDate);
        if (filters.dateRange === "Last 7 Days") {
          return isWithinInterval(orderDate, { start: subDays(now, 7), end: now });
        }
        if (filters.dateRange === "Last 30 Days") {
          return isWithinInterval(orderDate, { start: subDays(now, 30), end: now });
        }
        if (filters.dateRange === "This Month") {
          return isWithinInterval(orderDate, { start: startOfMonth(now), end: now });
        }
        return true;
      });
    }

    return data;
  }, [searchQuery, filters]);

  // Pagination calculations
  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredData.slice(startIndex, startIndex + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // Handlers
  const handleFilterChange = (key: keyof FiltersState, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({ orderStatus: "All", paymentStatus: "All", dateRange: "All" });
    setSearchQuery("");
    setCurrentPage(1);
  };

  const handleRowClick = (order: OrderDetails) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground mt-1">
            Manage your store orders and track their status.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Toolbar: Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-card p-4 rounded-lg border shadow-sm">
          <div className="w-full sm:w-auto flex-1 max-w-sm">
            <SearchInput
              value={searchQuery}
              onChange={(v) => {
                setSearchQuery(v);
                setCurrentPage(1);
              }}
              placeholder="Search ID, Customer, Phone..."
            />
          </div>
          <OrdersFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Data Table */}
        <OrdersTable
          data={paginatedData}
          onRowClick={handleRowClick}
        />

        {/* Pagination */}
        {totalRecords > 0 && (
          <div className="bg-card px-4 py-1 rounded-lg border shadow-sm">
            <OrdersPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalRecords={totalRecords}
              onPageChange={setCurrentPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
            />
          </div>
        )}
      </div>

      {/* View Order Drawer */}
      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
