"use client";

import React, { useState, useMemo, useEffect } from "react";
import { OrdersTable } from "@/components/orders/OrdersTable";
import { OrdersFilters } from "@/components/orders/OrdersFilters";
import { OrdersPagination } from "@/components/orders/OrdersPagination";
import { OrderDetailsDrawer } from "@/components/orders/OrderDetailsDrawer";
import { OrderDetails } from "@/types/order";
import { onSnapshot, query, orderBy } from "firebase/firestore";
import { appOrdersCollection } from "@/lib/firebase-app";

export default function OrdersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Fetch orders from Firestore
  useEffect(() => {
    // Removed orderBy to prevent Firebase missing index errors
    const q = query(appOrdersCollection);
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: OrderDetails[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        
        return {
          id: doc.id,
          customerName: data.customerName || data.userId || 'Guest User',
          mobileNumber: data.mobileNumber || 'N/A',
          productName: data.items && data.items.length > 0 ? data.items[0].name || data.items[0].title : 'Products',
          quantity: data.items ? data.items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0) : 1,
          totalAmount: data.total || 0,
          orderDate: data.createdAt || new Date().toISOString(),
          paymentStatus: data.paymentMethod && data.paymentMethod.toUpperCase().includes('COD') ? 'Unpaid' : 'Paid',
          paymentMethod: data.paymentMethod || 'Unknown',
          orderStatus: data.status || 'Placed',
          deliveryAddress: data.shippingAddress || '',
          trackingId: data.trackingId || '',
          courierName: data.courierName || '',
          customerInfo: {
            name: data.customerName || 'Guest User',
            email: data.email || '',
            mobileNumber: data.mobileNumber || ''
          },
          shippingInfo: {
            address: data.shippingAddress || '',
            city: '', state: '', zipCode: '', country: ''
          },
          products: data.items || [],
          timeline: [
            {
              status: 'Placed',
              date: data.createdAt || new Date().toISOString(),
              description: 'Order placed by customer'
            }
          ]
        };
      });

      // Sort locally by createdAt descending
      fetchedOrders.sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime());

      console.log("Firebase Orders fetched:", fetchedOrders.length);
      console.log("Orders Data:", fetchedOrders);

      setOrders(fetchedOrders);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching orders: ", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const safeId = order.id || "";
      const safeName = order.customerName || "";
      const safePhone = order.mobileNumber || "";
      const search = searchTerm.toLowerCase();

      const matchesSearch = 
        safeId.toLowerCase().includes(search) ||
        safeName.toLowerCase().includes(search) ||
        safePhone.includes(search);
        
      const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter]);

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
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 max-w-7xl">
      <div className="mb-8 space-y-4">
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

      <OrdersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        paymentFilter={paymentFilter}
        onPaymentFilterChange={setPaymentFilter}
        onClearFilters={handleClearFilters}
      />

      <OrdersTable
        data={paginatedOrders}
        isLoading={isLoading}
        onRowClick={handleRowClick}
      />

      <OrdersPagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <OrderDetailsDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
}
