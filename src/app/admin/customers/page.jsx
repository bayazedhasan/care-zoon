'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
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

export default function CustomersPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      const d = await apiFetch(`/customers?${params}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [page, q, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [q, status]);

  return (
    <div>
      <PageHeader title="Customers" subtitle="View and manage your customer base." />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center dark:border-slate-800">
          <SearchInput value={q} onChange={setQ} placeholder="Search name, email or phone…" className="sm:max-w-xs" />
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </Select>
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Customer</Th>
              <Th>Contact</Th>
              <Th>Orders</Th>
              <Th>Total Spent</Th>
              <Th>Status</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={6} />)
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title="No customers found" message="Try adjusting your search." icon={Users} />
                </td>
              </tr>
            ) : (
              data.items.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td>
                    <Link href={`/admin/customers/${c.id}`} className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-600 dark:text-sky-400">
                        {c.name?.[0]?.toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800 hover:text-sky-600 dark:text-slate-100">{c.name}</span>
                    </Link>
                  </Td>
                  <Td>
                    <div className="text-slate-700 dark:text-slate-200">{c.email}</div>
                    <div className="text-xs text-slate-400">{c.phone || '—'}</div>
                  </Td>
                  <Td>{c.ordersCount}</Td>
                  <Td className="font-medium text-slate-900 dark:text-white">{formatMoney(c.totalSpent)}</Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td className="text-slate-500">
                    {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </Td>
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
