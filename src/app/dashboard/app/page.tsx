'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, ShoppingBag, Users, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart, CartesianGrid } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

interface DashboardStats {
  totalRevenue: number;
  totalOrderCount: number;
  totalUserCount: number;
  activeOrders: number;
  salesData: { name: string; total: number }[];
  productData: { name: string; sales: number }[];
  recentOrders: { id: string; customer: string; total: number; status: string; time: string }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  accepted: "bg-blue-100 text-blue-800 border-blue-200",
  packing: "bg-orange-100 text-orange-800 border-orange-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  out_for_delivery: "bg-indigo-100 text-indigo-800 border-indigo-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function AppManagement() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/dashboard/app/api/stats');
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }
      setStats(data.data as DashboardStats);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while fetching stats.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-semibold text-slate-800">Failed to load Dashboard</h2>
        <p className="text-slate-500">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <RefreshCw className="h-4 w-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <span className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg text-orange-600 dark:text-orange-400">📱</span>
          App Analytics & Management
        </h2>
        <p className="text-slate-500 text-lg">
          Monitor your application's telemetry, user base, and active orders.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow duration-300 border-none bg-gradient-to-br from-orange-500 to-amber-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total App Revenue</CardTitle>
            <DollarSign className="h-4 w-4 opacity-75" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : `₹${stats?.totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs opacity-75">All time revenue</p>
          </CardContent>
        </Card>
        <Link href="/dashboard/app/orders" className="block cursor-pointer">
          <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.totalOrderCount.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">All-time processed</p>
            </CardContent>
          </Card>
        </Link>
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "..." : stats?.totalUserCount.toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">Registered customers</p>
          </CardContent>
        </Card>
        <Link href="/dashboard/app/orders" className="block cursor-pointer">
          <Card className="hover:shadow-lg transition-shadow duration-300 h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.activeOrders}
              </div>
              <p className="text-xs text-slate-500">Currently in-transit/processing</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>
              A line chart showing revenue across the last 7 months.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading ? (
              <div className="h-[350px] flex items-center justify-center text-slate-400">Loading chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={stats?.salesData || []} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#888888" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `₹${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="var(--color-primary, #f97316)" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: 'var(--color-primary, #f97316)' }} 
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="col-span-1 lg:col-span-3 hover:shadow-md transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Top Selling Pickles</CardTitle>
            <CardDescription>
              Which products are generating the most sales volume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="h-[350px] flex items-center justify-center text-slate-400">Loading chart...</div>
            ) : stats?.productData?.length === 0 ? (
              <div className="h-[350px] flex items-center justify-center text-slate-400">No product sales data</div>
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={stats?.productData || []} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    axisLine={false} 
                    tickLine={false} 
                    fontSize={12} 
                    width={90}
                  />
                  <Tooltip 
                    cursor={{fill: 'transparent'}} 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar 
                    dataKey="sales" 
                    fill="var(--color-primary, #f97316)" 
                    radius={[0, 4, 4, 0]} 
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders placed on the platform.</CardDescription>
          </div>
          <Link href="/dashboard/app/orders" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Orders &rarr;
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
             <div className="py-8 text-center text-slate-400">Loading recent orders...</div>
          ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentOrders.map((order) => {
                    const statusClass = STATUS_COLORS[order.status.toLowerCase()] || STATUS_COLORS['pending'];
                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium text-slate-900">{order.id}</TableCell>
                        <TableCell>{order.customer}</TableCell>
                        <TableCell className="text-slate-500">{order.time}</TableCell>
                        <TableCell>
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-md border shrink-0 uppercase tracking-widest ${statusClass}`}>
                            {order.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right font-semibold">₹{order.total}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400">No recent orders found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
