'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Star, Check, X } from 'lucide-react';
import { apiFetch, timeAgo } from '@/lib/admin-api';
import {
  Card,
  PageHeader,
  Select,
  StatusBadge,
  Pagination,
  EmptyState,
  TableWrap,
  Th,
  Td,
} from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

export default function ReviewsPage() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [reported, setReported] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (status) params.set('status', status);
      if (reported) params.set('reported', reported);
      const d = await apiFetch(`/reviews?${params}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [page, status, reported]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [status, reported]);

  const moderate = async (review, nextStatus) => {
    try {
      await apiFetch(`/reviews/${review.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      addToast(`Review ${nextStatus.toLowerCase()}`, 'success');
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  return (
    <div>
      <PageHeader title="Reviews & Ratings" subtitle="Moderate customer reviews and replies." />

      <Card>
        <div className="flex flex-wrap gap-2 border-b border-slate-100 p-4 dark:border-slate-800">
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </Select>
          <Select value={reported} onChange={(e) => setReported(e.target.value)}>
            <option value="">All reviews</option>
            <option value="1">Reported only</option>
          </Select>
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Review</Th>
              <Th>Product</Th>
              <Th>Author</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
              <Th>Date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="h-32" /></td></tr>
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState title="No reviews found" icon={Star} />
                </td>
              </tr>
            ) : (
              data.items.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td className="max-w-xs">
                    <p className="truncate text-slate-700 dark:text-slate-200">{r.comment}</p>
                    {r.reported && <span className="mt-1 inline-block rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-500/15 dark:text-red-400">REPORTED</span>}
                  </Td>
                  <Td className="max-w-[160px]">
                    <p className="truncate font-medium text-slate-800 dark:text-slate-100">{r.product?.name || '—'}</p>
                  </Td>
                  <Td>
                    <div className="text-slate-700 dark:text-slate-200">{r.author}</div>
                    {r.verified && <div className="text-xs text-emerald-500">Verified buyer</div>}
                  </Td>
                  <Td className="font-semibold text-amber-500">★ {r.rating}</Td>
                  <Td><StatusBadge status={r.status} /></Td>
                  <Td className="text-slate-500">{timeAgo(r.createdAt)}</Td>
                  <Td className="text-right">
                    {r.status !== 'APPROVED' && (
                      <button onClick={() => moderate(r, 'APPROVED')} className="rounded-md p-1.5 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-500/10" aria-label="Approve review">
                        <Check size={16} />
                      </button>
                    )}
                    {r.status !== 'REJECTED' && (
                      <button onClick={() => moderate(r, 'REJECTED')} className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10" aria-label="Reject review">
                        <X size={16} />
                      </button>
                    )}
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
