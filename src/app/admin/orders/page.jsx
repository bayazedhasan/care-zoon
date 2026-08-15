'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { apiFetch, formatMoney } from '@/lib/admin-api';
import {
  Card,
  PageHeader,
  SearchInput,
  Select,
  StatusBadge,
  Pagination,
  EmptyState,
  SkeletonRow,
  TableWrap,
  Th,
  Td,
} from '@/components/admin/ui';

export default function OrdersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('ALL');
  const [paymentStatus, setPaymentStatus] = useState('ALL');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      if (paymentStatus) params.set('paymentStatus', paymentStatus);
      const d = await apiFetch(`/orders?${params}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [page, q, status, paymentStatus]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [q, status, paymentStatus]);

  return (
    <div>
      <PageHeader title="Orders" subtitle="Track, filter and manage all customer orders." />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center dark:border-slate-800">
          <SearchInput value={q} onChange={setQ} placeholder="Search order #, email, customer…" className="sm:max-w-xs" />
          <div className="flex flex-wrap gap-2">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </Select>
            <Select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option value="ALL">All payments</option>
              <option value="PAID">Paid</option>
              <option value="UNPAID">Unpaid</option>
              <option value="REFUNDED">Refunded</option>
              <option value="FAILED">Failed</option>
            </Select>
          </div>
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Order</Th>
              <Th>Customer</Th>
              <Th>Items</Th>
              <Th>Status</Th>
              <Th>Payment</Th>
              <Th>Total</Th>
              <Th>Date</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={7} />)
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState title="No orders found" message="Try adjusting your filters." icon={ShoppingCart} />
                </td>
              </tr>
            ) : (
              data.items.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                      {o.orderNumber}
                    </Link>
                  </Td>
                  <Td>
                    <div className="text-slate-700 dark:text-slate-200">{o.customer?.name || 'Guest'}</div>
                    <div className="text-xs text-slate-400">{o.email}</div>
                  </Td>
                  <Td>{o._count.items}</Td>
                  <Td><StatusBadge status={o.status} /></Td>
                  <Td><StatusBadge status={o.paymentStatus} /></Td>
                  <Td className="font-semibold text-slate-900 dark:text-white">{formatMoney(o.total)}</Td>
                  <Td className="text-slate-500">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrap>

        <Pagination pagination={data?.pagination} onPage={setPage} />
      </Card>
    </div>
  );
}
