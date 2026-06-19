'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Check, Clock, Package, Truck, Home,
  X, ChevronRight, Phone, MapPin, CreditCard, User, AlertCircle,
  Fingerprint, Calendar, BookOpen, Save
} from 'lucide-react';

// --- TYPES & DATA ---

type OrderStatus = 'pending' | 'accepted' | 'packing' | 'shipped' | 'out_for_delivery' | 'delivered' | 'rejected';

type OrderItem = {
  name: string;
  qty: number;
  price: number;
};

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  items: OrderItem[];
  delivery: number;
  payment: string;
  status: OrderStatus;
  time: string;
  note: string;
  rejectionReason?: string;
  shiprocketOrderId?: string;
  rawOrder?: any;
  batchId?: string;
  preparationDate?: string;
  spiceOrigin?: string;
};

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2047", customer: "Rahul Sharma",
    phone: "+91 98765 43210",
    address: "12, MG Road, Near SBI Bank, Hyderabad 500001",
    items: [
      { name: "Mango Pickle 500g", qty: 2, price: 180 },
      { name: "Gongura Chutney 250g", qty: 1, price: 120 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "packing", time: "10 mins ago",
    note: "Please pack carefully"
  },
  {
    id: "ORD-2046", customer: "Priya Nair",
    phone: "+91 91234 56789",
    address: "Flat 4B, Green Valley Apts, Banjara Hills, Hyderabad",
    items: [
      { name: "Mixed Pickle 1kg", qty: 1, price: 320 },
      { name: "Tomato Pickle 250g", qty: 2, price: 100 }
    ],
    delivery: 40, payment: "Cash on Delivery",
    status: "delivered", time: "2 hrs ago",
    note: ""
  },
  {
    id: "ORD-2045", customer: "Ankit Verma",
    phone: "+91 87654 32109",
    address: "Plot 7, KPHB Colony, Kukatpally, Hyderabad 500072",
    items: [
      { name: "Avakaya 500g", qty: 3, price: 200 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "rejected", time: "3 hrs ago",
    note: "No onion no garlic",
    rejectionReason: "Item out of stock"
  },
  {
    id: "ORD-2044", customer: "Sneha Reddy",
    phone: "+91 99887 76655",
    address: "8-2-293, Road No.82, Jubilee Hills, Hyderabad",
    items: [
      { name: "Gongura Pickle 500g", qty: 1, price: 180 },
      { name: "Homemade Sambar Powder", qty: 2, price: 150 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "pending", time: "1 min ago",
    note: ""
  },
  {
    id: "ORD-2043", customer: "Vikram Das",
    phone: "+91 77665 54433",
    address: "3-6-201, Himayat Nagar, Hyderabad 500029",
    items: [
      { name: "Lemon Pickle 250g", qty: 4, price: 90 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "out_for_delivery", time: "45 mins ago",
    note: "Call before delivery"
  },
  {
    id: "ORD-2042", customer: "Ramesh Babu",
    phone: "+91 88877 66655",
    address: "Kondapur Main Road, Near RTO Office, Hyderabad",
    items: [
      { name: "Pulihora Paste 250g", qty: 2, price: 110 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "shipped", time: "1 hr ago",
    note: ""
  },
  {
    id: "ORD-2041", customer: "Aditi Rao",
    phone: "+91 77766 55544",
    address: "Hitech City, Cyber Towers back side, Hyderabad",
    items: [
      { name: "Garlic Pickle 500g", qty: 1, price: 250 }
    ],
    delivery: 40, payment: "Cash on Delivery",
    status: "accepted", time: "2 hrs ago",
    note: "Knock door loudly"
  },
  {
    id: "ORD-2040", customer: "Sanjay Gupta",
    phone: "+91 66655 44433",
    address: "Gachibowli, Telecom Nagar, Phase 2, Hyderabad",
    items: [
      { name: "Red Chilli Pickle 250g", qty: 3, price: 120 }
    ],
    delivery: 40, payment: "UPI Paid",
    status: "delivered", time: "5 hrs ago",
    note: ""
  }
];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  packing: "bg-orange-100 text-orange-800 border-orange-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  accepted: "Accepted",
  packing: "Packing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  rejected: "Rejected",
};

const STAGES: { id: OrderStatus; label: string; icon: React.FC<any> }[] = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'accepted', label: 'Order Accepted', icon: Check },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

// --- MAIN PAGE ---

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastOrder, setToastOrder] = useState<Order | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/dashboard/app/api/orders');
      const data = await res.json();
      if (data.success && data.data) {
        const liveOrders: Order[] = Object.values(data.data).map((o: any) => {
          // Map Firestore order to UI Order format
          const statusMap: Record<string, OrderStatus> = {
            'Placed': 'pending',
            'Pending': 'pending',
            'Accepted': 'accepted',
            'Processing': 'packing',
            'Shipped': 'shipped',
            'Out for Delivery': 'out_for_delivery',
            'Delivered': 'delivered',
            'Cancelled': 'rejected'
          };
          
          let uiStatus: OrderStatus = statusMap[o.orderStatus] || statusMap[o.status] || 'pending';
          
          // Reverse map handling if the DB has lowercase
          if (['pending', 'accepted', 'packing', 'shipped', 'out_for_delivery', 'delivered', 'rejected'].includes(o.status)) {
            uiStatus = o.status as OrderStatus;
          }

          const items: OrderItem[] = (o.products || o.items || []).map((item: any) => ({
            name: item.name || 'Product',
            qty: item.quantity || item.qty || 1,
            price: item.unitPrice || item.price || 0
          }));

          const address = typeof o.shippingAddress === 'string' 
            ? o.shippingAddress 
            : o.shippingInfo?.address ? `${o.shippingInfo.address}, ${o.shippingInfo.city}` : o.deliveryAddress || 'Unknown Address';

          // Try to extract name from address or use a fallback
          let customerName = o.customerName || o.customerInfo?.name;
          if (!customerName && address.includes('\n')) {
             customerName = address.split('\n')[0];
          }
          if (!customerName) customerName = `User (${o.userId?.substring(0, 5) || 'Unknown'})`;

          // Try to extract phone
          let phone = o.mobileNumber || o.customerInfo?.mobileNumber || o.phone;
          if (!phone) {
             const phoneMatch = address.match(/\d{10}/);
             if (phoneMatch) phone = phoneMatch[0];
             else phone = 'Not provided';
          }

          // Try to extract date
          let timeString = 'Recent';
          if (o.orderDate) timeString = new Date(o.orderDate).toLocaleString();
          else if (o.createdAt?.seconds) timeString = new Date(o.createdAt.seconds * 1000).toLocaleString();
          else if (o.createdAt) timeString = new Date(o.createdAt).toLocaleString();
          else {
             // Fallback to Order ID timestamp if ADH-17...
             const idMatch = (o.orderId || o.id || '').match(/ADH-(\d+)/);
             if (idMatch && idMatch[1]) {
                timeString = new Date(parseInt(idMatch[1])).toLocaleString();
             }
          }

          return {
            id: o.orderId || o.id,
            customer: customerName,
            phone: phone,
            address: address,
            items: items,
            delivery: o.deliveryFee || 40,
            payment: o.paymentMethod || o.paymentStatus || 'Online',
            status: uiStatus,
            time: timeString,
            note: o.note || '',
            rejectionReason: o.rejectionReason,
            shiprocketOrderId: o.shiprocketOrderId,
            rawOrder: o,
            batchId: o.batchId,
            preparationDate: o.preparationDate,
            spiceOrigin: o.spiceOrigin
          };
        });

        // Sort by time descending
        liveOrders.sort((a, b) => new Date(b.rawOrder?.createdAt || 0).getTime() - new Date(a.rawOrder?.createdAt || 0).getTime());
        setOrders(liveOrders);
      }
    } catch (err) {
      console.error('Failed to fetch live orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Removed mock toast for brevity
  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus, reason?: string) => {
    // Optimistic update
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, rejectionReason: reason };
      }
      return o;
    }));

    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (orderToUpdate) {
        await fetch('/dashboard/app/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentId: orderToUpdate.rawOrder?.id || orderId,
            status: newStatus,
            rejectionReason: reason || ''
          })
        });
      }
    } catch(err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdateHeritage = async (orderId: string, heritage: any) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, ...heritage };
      }
      return o;
    }));

    try {
      const orderToUpdate = orders.find(o => o.id === orderId);
      if (orderToUpdate) {
        await fetch('/dashboard/app/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            documentId: orderToUpdate.rawOrder?.id || orderId,
            ...heritage
          })
        });
      }
    } catch(err) {
      console.error('Failed to update heritage', err);
    }
  };

  const handleAcceptToast = () => setShowToast(false);
  const handleRejectToast = () => setShowToast(false);

  const filteredOrders = orders.filter(o => {
    if (filter !== 'All' && o.status !== filter.toLowerCase().replace(/ /g, '_')) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading Orders...</div>;
  }

  return (
    <div className="h-full w-full bg-[#f9fafb] text-slate-900 font-sans overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <OrderList
          orders={filteredOrders}
          allOrdersCount={orders.length}
          pendingCount={orders.filter(o => o.status === 'pending').length}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
        />
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#f9fafb] w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl relative border border-slate-200 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedOrderId(null)}
              className="absolute top-6 right-6 p-2 bg-white rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 shadow-sm z-50 border transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <OrderDetail
              order={selectedOrder}
              onUpdateStatus={handleUpdateStatus}
              onUpdateHeritage={handleUpdateHeritage}
            />
          </div>
        </div>
      )}

      {showToast && toastOrder && (
        <NewOrderToast
          order={toastOrder}
          onAccept={handleAcceptToast}
          onReject={handleRejectToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}

// --- LEFT PANEL ---

function OrderList({
  orders, allOrdersCount, pendingCount, filter, setFilter,
  search, setSearch, selectedOrderId, onSelectOrder
}: any) {
  const tabs = ['All', 'Pending', 'Accepted', 'Packing', 'Shipped', 'Out for Delivery', 'Delivered', 'Rejected'];

  return (
    <div className="w-full bg-[#f9fafb] flex flex-col p-6">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            Orders <span className="bg-slate-200 text-slate-700 text-sm px-3 py-1 rounded-full">{allOrdersCount}</span>
          </h2>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 px-3 py-1.5 rounded-full border border-red-100">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {pendingCount} new orders
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full max-w-xl">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or customer name..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map(t => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filter === t
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {t}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {orders.length === 0 ? (
          <div className="col-span-full py-20 text-center">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <p className="text-lg font-medium text-slate-500">No orders found.</p>
          </div>
        ) : (
          orders.map((order: Order) => (
            <OrderCard
              key={order.id}
              order={order}
              isSelected={selectedOrderId === order.id}
              onClick={() => onSelectOrder(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, isSelected, onClick }: { order: Order, isSelected: boolean, onClick: () => void }) {
  const getInitials = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z0-9 ]/g, '').trim();
    return cleanName ? cleanName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };
  const total = order.items.reduce((sum, i) => sum + (i.price * i.qty), 0) + order.delivery;
  const isNew = order.status === 'pending';

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 ${isSelected
        ? 'border-[#2563eb] bg-blue-50/50 shadow-sm'
        : 'border-[#e5e7eb] bg-white hover:border-slate-300 hover:shadow-sm'
        }`}
      style={{
        borderLeftWidth: isSelected ? '4px' : '1px',
      }}
    >
      <div className="flex justify-between items-start mb-4 gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold text-sm shadow-sm border border-white">
            {getInitials(order.customer)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-slate-800 truncate tracking-tight">
              {order.customer.length > 20 && !order.customer.includes(' ') ? `User (${order.customer.substring(0, 5)})` : order.customer}
            </p>
            <p className="text-[11px] font-medium text-slate-400 truncate mt-0.5 uppercase tracking-wider">{order.id}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-extrabold text-base text-slate-900 tracking-tight">₹{total}</p>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            {isNew && <span className="h-2 w-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>}
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{order.time}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100 gap-2">
        <p className="text-xs text-slate-500 truncate flex-1 font-medium min-w-0">
          <span className="text-slate-700 font-semibold">{order.items.length}</span> item(s) • <span className="truncate">{order.payment}</span>
        </p>
        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border shrink-0 uppercase tracking-widest ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>
    </div>
  );
}

// --- RIGHT PANEL ---

function OrderDetail({ order, onUpdateStatus, onUpdateHeritage }: { order: Order, onUpdateStatus: (id: string, s: OrderStatus, reason?: string) => void, onUpdateHeritage: (id: string, heritage: any) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  const [batchId, setBatchId] = useState(order.batchId || '');
  const [preparationDate, setPreparationDate] = useState(order.preparationDate || '');
  const [spiceOrigin, setSpiceOrigin] = useState(order.spiceOrigin || '');
  const [isSavingHeritage, setIsSavingHeritage] = useState(false);

  // Simulate loading on order change
  useEffect(() => {
    setIsLoading(true);
    setBatchId(order.batchId || '');
    setPreparationDate(order.preparationDate || '');
    setSpiceOrigin(order.spiceOrigin || '');
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [order.id, order.batchId, order.preparationDate, order.spiceOrigin]);

  const handleSaveHeritage = async () => {
    setIsSavingHeritage(true);
    await onUpdateHeritage(order.id, { batchId, preparationDate, spiceOrigin });
    setIsSavingHeritage(false);
  };

  if (isLoading) {
    return (
      <div className="p-8 animate-pulse">
        <div className="h-8 bg-slate-200 rounded w-1/3 mb-6"></div>
        <div className="h-32 bg-slate-200 rounded-xl mb-6"></div>
        <div className="h-64 bg-slate-200 rounded-xl mb-6"></div>
      </div>
    );
  }

  const handleNextStage = () => {
    const sequence: OrderStatus[] = ['accepted', 'packing', 'shipped', 'out_for_delivery', 'delivered'];
    const idx = sequence.indexOf(order.status);
    if (idx >= 0 && idx < sequence.length - 1) {
      onUpdateStatus(order.id, sequence[idx + 1]);
    }
  };

  const getNextStageLabel = () => {
    switch (order.status) {
      case 'accepted': return 'Start Packing';
      case 'packing': return 'Mark as Shipped';
      case 'shipped': return 'Mark Out for Delivery';
      case 'out_for_delivery': return 'Mark as Delivered';
      default: return '';
    }
  };

  const handlePushToShiprocket = async () => {
    if (!order.rawOrder) {
      alert("Raw order data missing!");
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await fetch('/dashboard/app/api/shiprocket/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: order.rawOrder })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Pushed to Shiprocket successfully! Tracking ID: ${data.shiprocketOrderId}`);
        // Optionally update UI here
        order.shiprocketOrderId = data.shiprocketOrderId;
      } else {
        alert(`Failed: ${data.error}`);
      }
    } catch(err) {
      console.error(err);
      alert("Failed to push to Shiprocket");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-12 max-w-6xl mx-auto space-y-8 pb-24">
      {/* SECTION 1: Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h1 className="text-2xl font-bold truncate max-w-[280px] md:max-w-full" title={order.id}>{order.id}</h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border shrink-0 ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm text-slate-500 truncate">Placed on {order.time} • {order.items.length} items</p>
        </div>

        {order.status === 'pending' && (
          <div className="flex gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-4 py-2 border-2 border-red-200 text-red-600 rounded-lg font-medium text-sm hover:bg-red-50 transition-colors"
            >
              Reject Order
            </button>
            <button
              onClick={() => onUpdateStatus(order.id, 'accepted')}
              className="px-4 py-2 bg-[#16a34a] text-white rounded-lg font-medium text-sm hover:bg-green-700 shadow-sm transition-colors"
            >
              Accept Order
            </button>
          </div>
        )}
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold mb-4">Reject Order</h3>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Reason for rejection..."
              className="w-full border rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[100px] mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button
                onClick={() => {
                  onUpdateStatus(order.id, 'rejected', rejectReason);
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* SECTION 2: Timeline */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Order Status</h3>
            <TrackingTimeline status={order.status} rejectionReason={order.rejectionReason} />

            {/* SECTION 3: Admin Control */}
            {['accepted', 'packing', 'shipped', 'out_for_delivery'].includes(order.status) && (
              <div className="mt-8 pt-6 border-t flex justify-end gap-3">
                {['accepted', 'packing'].includes(order.status) && (
                  <button
                    onClick={handlePushToShiprocket}
                    disabled={!!order.shiprocketOrderId}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm transition-all ${
                      order.shiprocketOrderId 
                        ? 'bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed' 
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    <Truck className="h-4 w-4" /> 
                    {order.shiprocketOrderId ? `Shiprocket ID: ${order.shiprocketOrderId}` : 'Push to Shiprocket'}
                  </button>
                )}
                
                <button
                  onClick={handleNextStage}
                  className="px-6 py-2.5 bg-[#2563eb] text-white rounded-lg font-medium text-sm hover:bg-blue-700 shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  {getNextStageLabel()} <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* SECTION 4: Items */}
          <OrderItems order={order} />
        </div>

        <div className="space-y-6">
          {/* SECTION 5: Customer Info */}
          <CustomerInfo order={order} />

          {/* SECTION 6: Batch Heritage */}
          <div className="bg-white p-6 rounded-xl border border-amber-200 shadow-[0_4px_20px_-4px_rgba(251,191,36,0.15)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-500" /> Batch Heritage
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                  <Fingerprint className="h-3.5 w-3.5" /> Batch Tracking Code
                </label>
                <input 
                  type="text" 
                  value={batchId}
                  onChange={e => setBatchId(e.target.value)}
                  placeholder="e.g. BATCH-102-AP"
                  className="w-full text-sm border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Preparation Date
                </label>
                <input 
                  type="date" 
                  value={preparationDate}
                  onChange={e => setPreparationDate(e.target.value)}
                  className="w-full text-sm border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Spice Origin
                </label>
                <input 
                  type="text" 
                  value={spiceOrigin}
                  onChange={e => setSpiceOrigin(e.target.value)}
                  placeholder="e.g. Stone-ground Guntur Chillies"
                  className="w-full text-sm border-slate-200 rounded-lg px-3 py-2 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>

              <button 
                onClick={handleSaveHeritage}
                disabled={isSavingHeritage}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 font-semibold py-2 rounded-lg transition-colors text-sm"
              >
                <Save className="h-4 w-4" /> 
                {isSavingHeritage ? 'Saving...' : 'Save Heritage Details'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackingTimeline({ status, rejectionReason }: { status: OrderStatus, rejectionReason?: string }) {
  const isRejected = status === 'rejected';

  const getStageState = (stageId: OrderStatus, index: number) => {
    if (isRejected) return index === 0 ? 'rejected' : 'upcoming';

    const sequence: OrderStatus[] = ['pending', 'accepted', 'packing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIdx = sequence.indexOf(status);

    if (index < currentIdx) return 'completed';
    if (index === currentIdx) return 'current';
    return 'upcoming';
  };

  return (
    <div className="ml-4 space-y-0">
      {STAGES.map((stage, idx) => {
        const state = getStageState(stage.id, idx);
        const isLast = idx === STAGES.length - 1;

        return (
          <div key={stage.id} className="relative flex gap-6 pb-8 last:pb-0 group">
            {/* Connector Line */}
            {!isLast && (
              <div className={`absolute left-[11px] top-8 bottom-0 w-[2px] transition-colors duration-500 ${state === 'completed' || (state === 'current' && !isRejected) ? 'bg-[#16a34a]' : 'bg-slate-200 dashed-line'
                }`}
                style={state === 'completed' ? {} : { backgroundImage: 'linear-gradient(to bottom, #e5e7eb 50%, transparent 50%)', backgroundSize: '100% 8px', backgroundColor: 'transparent' }}
              />
            )}

            {/* Node */}
            <div className="relative z-10 shrink-0">
              {state === 'completed' && (
                <div className="w-6 h-6 rounded-full bg-[#16a34a] flex items-center justify-center text-white ring-4 ring-white shadow-sm transition-all duration-500 scale-110">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
              {state === 'current' && (
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30 scale-150"></div>
                  <div className="w-6 h-6 rounded-full bg-[#2563eb] flex items-center justify-center text-white ring-4 ring-white shadow-sm z-10 transition-all duration-500">
                    <stage.icon className="h-3 w-3" />
                  </div>
                </div>
              )}
              {state === 'upcoming' && (
                <div className="w-6 h-6 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center ring-4 ring-white transition-all duration-500">
                  <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                </div>
              )}
              {state === 'rejected' && (
                <div className="w-6 h-6 rounded-full bg-[#dc2626] flex items-center justify-center text-white ring-4 ring-white shadow-sm scale-110">
                  <X className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 -mt-1.5 transition-all duration-500 ${state === 'upcoming' ? 'opacity-50' : 'opacity-100'
              }`}>
              <div className="flex items-center gap-3">
                <h4 className={`text-sm font-semibold ${state === 'rejected' ? 'text-red-600' :
                  state === 'current' ? 'text-slate-900' :
                    state === 'completed' ? 'text-slate-800' : 'text-slate-500'
                  }`}>
                  {state === 'rejected' ? 'Order Rejected' : stage.label}
                </h4>
                {state === 'current' && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    In Progress
                  </span>
                )}
              </div>

              {state === 'completed' && (
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Update recorded
                </p>
              )}

              {state === 'rejected' && (
                <p className="text-xs text-red-500 mt-1.5 font-medium flex items-start gap-1.5 p-2 bg-red-50 rounded-md border border-red-100 w-fit">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  Reason: {rejectionReason || "Canceled by admin"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderItems({ order }: { order: Order }) {
  const itemsTotal = order.items.reduce((s, i) => s + (i.price * i.qty), 0);

  return (
    <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Order Items</h3>
      <div className="space-y-4">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center group">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-50 flex items-center justify-center text-xl shadow-sm border border-orange-100">
                {item.name.toLowerCase().includes('pickle') ? '🫙' : '🥫'}
              </div>
              <div>
                <p className="font-medium text-sm text-slate-900 group-hover:text-[#2563eb] transition-colors">{item.name}</p>
                <p className="text-xs text-slate-500">₹{item.price} × {item.qty}</p>
              </div>
            </div>
            <p className="font-medium text-sm">₹{item.price * item.qty}</p>
          </div>
        ))}
      </div>

      <hr className="my-5 border-[#e5e7eb]" />

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-slate-600">
          <p>Subtotal</p>
          <p>₹{itemsTotal}</p>
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <p>Delivery Fee</p>
          <p>₹{order.delivery}</p>
        </div>
        <div className="flex justify-between font-bold text-lg pt-3 border-t text-slate-900">
          <p>Total</p>
          <p>₹{itemsTotal + order.delivery}</p>
        </div>
      </div>
    </div>
  );
}

function CustomerInfo({ order }: { order: Order }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm space-y-6">
      <h3 className="text-lg font-semibold">Customer Details</h3>

      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <User className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-0.5">Name</p>
            <p className="text-sm font-medium text-slate-900 truncate" title={order.customer}>
              {order.customer.length > 20 && !order.customer.includes(' ') ? `User (${order.customer.substring(0, 5)})` : order.customer}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <Phone className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-0.5">Phone</p>
            <p className="text-sm font-medium text-slate-900 truncate">{order.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MapPin className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-0.5">Delivery Address</p>
            <p className="text-sm font-medium text-slate-900 leading-snug">{order.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <CreditCard className="h-5 w-5 text-slate-400 mt-0.5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-0.5">Payment Method</p>
            <span className={`inline-block max-w-full truncate px-2 py-0.5 text-xs font-semibold rounded-full border ${order.payment.includes('UPI') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
              }`} title={order.payment}>
              {order.payment}
            </span>
          </div>
        </div>
      </div>

      {order.note && (
        <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-lg">
          <p className="text-xs font-bold text-yellow-800 mb-1 uppercase tracking-wider">Note from Customer</p>
          <p className="text-sm text-yellow-900 italic">"{order.note}"</p>
        </div>
      )}
    </div>
  );
}

function NewOrderToast({ order, onAccept, onReject, onClose }: any) {
  const total = order.items.reduce((sum: number, i: any) => sum + (i.price * i.qty), 0) + order.delivery;

  return (
    <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-white rounded-xl shadow-2xl border border-[#2563eb] p-4 w-[360px] overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#2563eb] animate-[shrink_8s_linear]"></div>

        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 text-[#2563eb] font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2563eb] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2563eb]"></span>
            </span>
            New Order Received!
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
        </div>

        <p className="text-sm text-slate-700 font-medium mb-1">
          {order.customer} placed {order.id}
        </p>
        <p className="text-xs text-slate-500 mb-4">
          Total value: <span className="font-bold text-slate-900">₹{total}</span> • {order.items.length} items
        </p>

        <div className="flex gap-2">
          <button
            onClick={onReject}
            className="flex-1 px-3 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="flex-1 px-3 py-2 bg-[#16a34a] text-white rounded-lg text-xs font-semibold hover:bg-green-700 shadow-sm transition-colors"
          >
            Accept Now
          </button>
        </div>

        <style>{`
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}</style>
      </div>
    </div>
  );
}
