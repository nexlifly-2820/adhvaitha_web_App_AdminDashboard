'use client';

import React, { useState, useEffect } from 'react';
import {
  Search, Check, Clock, Package, Truck, Home,
  X, ChevronRight, Phone, MapPin, CreditCard, User, AlertCircle
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
  { id: 'accepted', label: 'Order Accepted', icon: Check },
  { id: 'packing', label: 'Packing', icon: Package },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
  { id: 'delivered', label: 'Delivered', icon: Home },
];

// --- MAIN PAGE ---

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastOrder, setToastOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Simulate real-time new order toast
    const timer = setTimeout(() => {
      const newOrder: Order = {
        id: "ORD-2051", customer: "Priya S.", phone: "+91 99988 77766",
        address: "Plot 12, Madhapur, Hyderabad",
        items: [{ name: "Mango Pickle 1kg", qty: 1, price: 320 }],
        delivery: 40, payment: "UPI Paid",
        status: "pending", time: "Just now", note: ""
      };
      setToastOrder(newOrder);
      setShowToast(true);

      // Auto-dismiss toast
      setTimeout(() => setShowToast(false), 8000);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus, reason?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, status: newStatus, rejectionReason: reason };
      }
      return o;
    }));
  };

  const handleAcceptToast = () => {
    if (toastOrder) {
      setOrders(prev => [{ ...toastOrder, status: 'accepted' }, ...prev]);
      setShowToast(false);
    }
  };

  const handleRejectToast = () => {
    if (toastOrder) {
      setOrders(prev => [{ ...toastOrder, status: 'rejected', rejectionReason: 'Rejected via toast' }, ...prev]);
      setShowToast(false);
    }
  };

  const filteredOrders = orders.filter(o => {
    if (filter !== 'All' && o.status !== filter.toLowerCase().replace(/ /g, '_')) return false;
    if (search && !o.customer.toLowerCase().includes(search.toLowerCase()) && !o.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedOrder = orders.find(o => o.id === selectedOrderId);

  return (
    <div className="flex h-full w-full bg-[#f9fafb] text-slate-900 font-sans overflow-hidden">
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
      <div className="flex-1 overflow-y-auto">
        {selectedOrder ? (
          <OrderDetail
            order={selectedOrder}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-400">
            <div className="text-center">
              <Package className="mx-auto h-12 w-12 text-slate-300 mb-4" />
              <p>Select an order to view details</p>
            </div>
          </div>
        )}
      </div>

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
    <div className="w-[400px] border-r border-[#e5e7eb] bg-white flex flex-col h-full shrink-0">
      <div className="p-4 border-b border-[#e5e7eb] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Orders <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">{allOrdersCount}</span>
          </h2>
          {pendingCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              {pendingCount} new
            </div>
          )}
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or customer..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-[#e5e7eb] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
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

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {orders.length === 0 ? (
          <p className="text-center text-sm text-slate-500 mt-10">No orders found.</p>
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
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').substring(0, 2);
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
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold text-sm">
            {getInitials(order.customer)}
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-900">{order.customer}</p>
            <p className="text-xs text-slate-500">{order.id}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-semibold text-sm text-slate-900">₹{total}</p>
          <div className="flex items-center justify-end gap-1.5 mt-0.5">
            {isNew && <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>}
            <span className="text-[11px] text-slate-500">{order.time}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-2">
        <p className="text-xs text-slate-500 truncate max-w-[180px]">
          {order.items.length} item(s) • {order.payment}
        </p>
        <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${STATUS_COLORS[order.status]}`}>
          {STATUS_LABELS[order.status]}
        </span>
      </div>
    </div>
  );
}

// --- RIGHT PANEL ---

function OrderDetail({ order, onUpdateStatus }: { order: Order, onUpdateStatus: (id: string, s: OrderStatus, reason?: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Simulate loading on order change
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(t);
  }, [order.id]);

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

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6 pb-24">
      {/* SECTION 1: Header */}
      <div className="flex justify-between items-start bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold">{order.id}</h1>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_COLORS[order.status]}`}>
              {STATUS_LABELS[order.status]}
            </span>
          </div>
          <p className="text-sm text-slate-500">Placed on {order.time} • {order.items.length} items</p>
        </div>

        {order.status === 'pending' && (
          <div className="flex gap-3">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* SECTION 2: Timeline */}
          <div className="bg-white p-6 rounded-xl border border-[#e5e7eb] shadow-sm">
            <h3 className="text-lg font-semibold mb-6">Order Status</h3>
            <TrackingTimeline status={order.status} rejectionReason={order.rejectionReason} />

            {/* SECTION 3: Admin Control */}
            {['accepted', 'packing', 'shipped', 'out_for_delivery'].includes(order.status) && (
              <div className="mt-8 pt-6 border-t flex justify-end">
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
        </div>
      </div>
    </div>
  );
}

function TrackingTimeline({ status, rejectionReason }: { status: OrderStatus, rejectionReason?: string }) {
  const isRejected = status === 'rejected';

  const getStageState = (stageId: OrderStatus, index: number) => {
    if (isRejected) return index === 0 ? 'rejected' : 'upcoming';
    if (status === 'pending') return 'upcoming';

    const sequence: OrderStatus[] = ['accepted', 'packing', 'shipped', 'out_for_delivery', 'delivered'];
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

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5"><User className="h-4 w-4" /></div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Name</p>
            <p className="text-sm font-medium text-slate-900">{order.customer}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5"><Phone className="h-4 w-4" /></div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Phone</p>
            <p className="text-sm font-medium text-slate-900">{order.phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5"><MapPin className="h-4 w-4" /></div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Delivery Address</p>
            <p className="text-sm font-medium text-slate-900 leading-snug">{order.address}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-slate-50 rounded-lg text-slate-500 mt-0.5"><CreditCard className="h-4 w-4" /></div>
          <div>
            <p className="text-xs text-slate-500 mb-0.5">Payment Method</p>
            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full border ${order.payment.includes('UPI') ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'
              }`}>
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
