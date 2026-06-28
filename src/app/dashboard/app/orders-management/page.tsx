"use client";

import React, { useState, useMemo, useEffect } from "react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersPagination } from "@/components/orders/OrdersPagination";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { mockOrders } from "@/data/mock-orders";
import { OrderDetails } from "@/types/order";

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Simulate network loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredOrders = useMemo(() => {
    return mockOrders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.mobileNumber.includes(searchTerm);
        
      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchTerm, statusFilter, paymentFilter]);

  const totalRecords = filteredOrders.length;
  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, paymentFilter, pageSize]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setPaymentFilter("all");
  };

  const handleRowClick = (order: OrderDetails) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  return (
    <div className="container mx-auto pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl h-[calc(100vh-2rem)] flex flex-col">
      <div className="mb-4 space-y-2 shrink-0">
        <button 
          onClick={() => window.history.back()} 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Orders Management</h1>
          <p className="text-muted-foreground mt-2">Manage and view all customer orders</p>
        </div>
      </div>

      <div className="shrink-0 mb-4">
        <OrdersFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
          onClearFilters={handleClearFilters}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-hidden mb-4 rounded-md border bg-card flex flex-col">
        <OrdersTable
          data={paginatedOrders}
          isLoading={isLoading}
          onRowClick={handleRowClick}
          startIndex={(currentPage - 1) * pageSize}
        />
      </div>

      <div className="shrink-0 mt-auto">
        <OrdersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
