'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Tag,
  Eye,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { apiFetch, formatMoney, timeAgo } from '@/lib/admin-api';
import { Card, PageHeader, StatusBadge, PrimaryButton } from '@/components/admin/ui';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  SHIPPED: '#6366f1',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#64748b',
};

function StatCard({ title, value, icon: Icon, iconClass, sub }) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
          <p className="mt-2 font-heading text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
          <Icon size={20} />
        </span>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch(`/dashboard?period=${period}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const summary = data?.summary;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Store overview and performance at a glance."
        actions={
          <div className="flex items-center gap-2">
            <Link href="/admin/products/new">
              <PrimaryButton>
                <Plus size={16} /> Add Product
              </PrimaryButton>
            </Link>
            <Link href="/admin/coupons">
              <PrimaryButton className="!bg-slate-800 hover:!bg-slate-700 dark:!bg-slate-700 dark:hover:!bg-slate-600">
                <Tag size={16} /> Add Coupon
              </PrimaryButton>
            </Link>
            <Link href="/admin/orders">
              <PrimaryButton className="!bg-emerald-600 hover:!bg-emerald-500">
                <Eye size={16} /> View Orders
              </PrimaryButton>
            </Link>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={loading ? '—' : formatMoney(summary?.totalRevenue)}
          icon={DollarSign}
          iconClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
        />
        <StatCard
          title="Total Orders"
          value={loading ? '—' : summary?.totalOrders?.toLocaleString()}
          icon={ShoppingCart}
          iconClass="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
        />
        <StatCard
          title="Total Customers"
          value={loading ? '—' : summary?.totalCustomers?.toLocaleString()}
          icon={Users}
          iconClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-400"
        />
        <StatCard
          title="Active Products"
          value={loading ? '—' : summary?.totalProducts?.toLocaleString()}
          icon={Package}
          iconClass="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Sales chart */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <div>
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Sales Overview</h2>
              <p className="text-xs text-slate-500">Revenue and order volume</p>
            </div>
            <div className="flex gap-1">
              {[
                { key: '7d', label: '7D' },
                { key: '30d', label: '30D' },
                { key: '90d', label: '90D' },
                { key: '12m', label: '12M' },
                { key: 'all', label: 'All' },
              ].map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                    period === p.key
                      ? 'bg-sky-500 text-white'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-5">
            {loading || !data?.salesSeries?.length ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">
                {loading ? 'Loading chart…' : 'No sales data yet'}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.salesSeries} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.15)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={56} />
                  <Tooltip
                    formatter={(v, name) => (name === 'revenue' ? [formatMoney(v), 'Revenue'] : [v, 'Orders'])}
                    contentStyle={{
                      borderRadius: 10,
                      border: '1px solid rgba(100,116,139,0.2)',
                      background: 'rgba(255,255,255,0.95)',
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        {/* Status breakdown */}
        <Card>
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Order Status</h2>
            <p className="text-xs text-slate-500">Breakdown by status</p>
          </div>
          <div className="p-5">
            {loading || !data?.statusBreakdown?.length ? (
              <div className="flex h-64 items-center justify-center text-sm text-slate-400">No data</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={data.statusBreakdown} dataKey="count" nameKey="status" innerRadius={50} outerRadius={75} paddingAngle={3}>
                      {data.statusBreakdown.map((s) => (
                        <Cell key={s.status} fill={STATUS_COLORS[s.status] || '#64748b'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <ul className="mt-3 space-y-2">
                  {data.statusBreakdown.map((s) => (
                    <li key={s.status} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLORS[s.status] }} />
                        {String(s.status).toLowerCase().replace(/_/g, ' ')}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">{s.count}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent orders */}
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Recent Orders</h2>
            <Link href="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).map((o) => (
                  <tr key={o.id} className="border-t border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40">
                    <td className="px-5 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{o.customer?.name || o.email}</td>
                    <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{formatMoney(o.total)}</td>
                    <td className="px-5 py-3 text-slate-500">{timeAgo(o.createdAt)}</td>
                  </tr>
                ))}
                {!loading && !data?.recentOrders?.length && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No orders yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Side column */}
        <div className="space-y-6">
          {/* Low stock */}
          <Card>
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <AlertTriangle size={16} className="text-amber-500" />
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Low Stock Alerts</h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.lowStock || []).map((p) => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/products/${p.id}`} className="block truncate font-medium text-slate-700 hover:text-sky-600 dark:text-slate-200">
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-400">SKU: {p.sku}</p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.stock === 0
                        ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                    }`}
                  >
                    {p.stock === 0 ? 'Out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
              {!loading && !data?.lowStock?.length && (
                <li className="px-5 py-8 text-center text-sm text-slate-400">All good — no low stock items</li>
              )}
            </ul>
          </Card>

          {/* Recent signups */}
          <Card>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Recent Signups</h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {(data?.recentCustomers || []).map((c) => (
                <li key={c.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-600 dark:text-sky-400">
                    {c.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{c.name}</p>
                    <p className="truncate text-xs text-slate-400">{c.email}</p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400">{timeAgo(c.createdAt)}</span>
                </li>
              ))}
              {!loading && !data?.recentCustomers?.length && (
                <li className="px-5 py-8 text-center text-sm text-slate-400">No signups yet</li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
