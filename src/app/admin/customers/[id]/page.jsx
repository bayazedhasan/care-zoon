'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Ban, CheckCircle2 } from 'lucide-react';
import { apiFetch, formatMoney } from '@/lib/admin-api';
import { Card, PageHeader, StatusBadge, PrimaryButton, SecondaryButton } from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch(`/customers/${params.id}`);
      setCustomer(d.customer);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [params.id, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleBlock = async () => {
    setToggling(true);
    try {
      const nextStatus = customer.status === 'blocked' ? 'active' : 'blocked';
      await apiFetch(`/customers/${customer.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: nextStatus }),
      });
      addToast(nextStatus === 'blocked' ? 'Customer blocked' : 'Customer unblocked', 'success');
      load();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" /> Loading…
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div>
      <Link href="/admin/customers" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-sky-600 dark:hover:text-sky-400">
        <ArrowLeft size={16} /> Back to customers
      </Link>

      <PageHeader
        title={customer.name}
        subtitle={customer.email}
        actions={
          customer.status === 'blocked' ? (
            <PrimaryButton onClick={toggleBlock} disabled={toggling}>
              <CheckCircle2 size={16} /> Unblock
            </PrimaryButton>
          ) : (
            <SecondaryButton onClick={toggleBlock} disabled={toggling} className="!border-red-300 !text-red-600 hover:!bg-red-50 dark:!border-red-500/40 dark:!text-red-400">
              <Ban size={16} /> Block customer
            </SecondaryButton>
          )
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-1">
          <Card className="p-5">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Profile</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={customer.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Phone</span>
                <span className="text-slate-700 dark:text-slate-200">{customer.phone || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total spent</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatMoney(customer.totalSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Orders</span>
                <span className="font-semibold text-slate-900 dark:text-white">{customer.ordersCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Joined</span>
                <span className="text-slate-700 dark:text-slate-200">
                  {new Date(customer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              {customer.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {customer.tags.map((t) => (
                    <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {customer.notes && (
            <Card className="p-5">
              <h2 className="mb-2 font-heading text-base font-bold text-slate-900 dark:text-white">Support Notes</h2>
              <p className="whitespace-pre-wrap text-sm text-slate-600 dark:text-slate-300">{customer.notes}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6 xl:col-span-2">
          <Card>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Order History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Order</th>
                    <th className="px-5 py-3">Items</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Total</th>
                    <th className="px-5 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.orders.map((o) => (
                    <tr key={o.id} className="border-t border-slate-100 dark:border-slate-800">
                      <td className="px-5 py-3">
                        <Link href={`/admin/orders/${o.id}`} className="font-semibold text-sky-600 hover:underline dark:text-sky-400">
                          {o.orderNumber}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-slate-500">{o.items?.reduce((s, i) => s + i.quantity, 0)}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status} /></td>
                      <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{formatMoney(o.total)}</td>
                      <td className="px-5 py-3 text-slate-500">
                        {new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))}
                  {!customer.orders?.length && (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-400">No orders yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {customer.reviews?.length > 0 && (
            <Card>
              <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Reviews</h2>
              </div>
              <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                {customer.reviews.map((r) => (
                  <li key={r.id} className="px-5 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800 dark:text-slate-100">
                        {'★'.repeat(r.rating)} <span className="text-xs text-slate-400">({r.rating})</span>
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{r.comment}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
