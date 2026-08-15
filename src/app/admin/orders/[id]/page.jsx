'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CreditCard, Truck, ExternalLink } from 'lucide-react';
import { apiFetch, formatMoney } from '@/lib/admin-api';
import { Card, StatusBadge, PrimaryButton, SecondaryButton } from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-sm text-slate-700 dark:text-slate-200">{value || '—'}</p>
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [paying, setPaying] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch(`/orders/${params.id}`);
      setOrder(d.order);
      setNewStatus(d.order.status);
      setTrackingNumber(d.order.trackingNumber || '');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [params.id, addToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const d = await apiFetch(`/orders/${order.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus, trackingNumber, note }),
      });
      setOrder(d.order);
      setTrackingNumber(d.order.trackingNumber || '');
      addToast('Order updated', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handlePay = async () => {
    setPaying(true);
    try {
      const d = await apiFetch(`/payments/stripe/checkout/${order.id}`, { method: 'POST' });
      window.location.href = d.checkoutUrl;
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-400">
        <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" /> Loading…
      </div>
    );
  }

  if (!order) return null;

  const shippingAddress = order.shippingAddress || {};

  return (
    <div>
      <Link href="/admin/orders" className="mb-4 flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-sky-600 dark:hover:text-sky-400">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">{order.orderNumber}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Placed {new Date(order.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="flex gap-2">
          {order.paymentStatus === 'UNPAID' && (
            <PrimaryButton onClick={handlePay} disabled={paying}>
              <CreditCard size={16} /> {paying ? 'Opening…' : 'Collect via Stripe'}
            </PrimaryButton>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          {/* Items */}
          <Card>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          {item.image && <img src={item.image} alt="" className="h-11 w-11 rounded-lg object-cover" />}
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">{item.productName}</p>
                            <p className="text-xs text-slate-400">
                              {item.variant || '—'} · {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-500">× {item.quantity}</td>
                      <td className="px-5 py-3 text-right font-medium text-slate-900 dark:text-white">{formatMoney(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-1.5 px-5 py-4 text-sm">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>{formatMoney(order.subtotal)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Discount</span><span>-{formatMoney(order.discount)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Shipping</span><span>{formatMoney(order.shipping)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax</span><span>{formatMoney(order.tax)}</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total</span><span>{formatMoney(order.total, order.currency)}</span>
              </div>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-heading text-base font-bold text-slate-900 dark:text-white">Order Timeline</h2>
            </div>
            <ol className="space-y-0 px-5 py-4">
              {order.timeline.map((t, i) => (
                <li key={t.id} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < order.timeline.length - 1 && <span className="absolute left-[7px] top-4 h-full w-px bg-slate-200 dark:bg-slate-700" />}
                  <span className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-sky-500 bg-white dark:bg-slate-900" />
                  <div>
                    <p className="text-sm font-medium capitalize text-slate-800 dark:text-slate-100">{t.status.toLowerCase()}</p>
                    <p className="text-xs text-slate-400">{t.note}</p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(t.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </li>
              ))}
              {!order.timeline.length && <p className="py-4 text-sm text-slate-400">No timeline events yet.</p>}
            </ol>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Update status */}
          <Card className="p-5">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Update Status</h2>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Order status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Tracking number</label>
                <input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g. 1Z999AA10123456784"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Internal note</label>
                <textarea
                  rows={2}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <PrimaryButton className="w-full" onClick={handleStatusUpdate} disabled={updating}>
                <Truck size={16} /> {updating ? 'Saving…' : 'Save & Update'}
              </PrimaryButton>
            </div>
          </Card>

          {/* Customer */}
          <Card className="p-5">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Customer</h2>
            {order.customer ? (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-600 dark:text-sky-400">
                  {order.customer.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <Link href={`/admin/customers/${order.customer.id}`} className="block truncate text-sm font-medium text-sky-600 hover:underline dark:text-sky-400">
                    {order.customer.name}
                  </Link>
                  <p className="truncate text-xs text-slate-400">{order.customer.email}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500">{order.email} (Guest)</p>
            )}
          </Card>

          {/* Shipping & payment */}
          <Card className="p-5">
            <h2 className="mb-4 font-heading text-base font-bold text-slate-900 dark:text-white">Details</h2>
            <div className="space-y-4">
              <Field label="Payment status" value={<StatusBadge status={order.paymentStatus} />} />
              <Field label="Payment method" value={order.paymentMethod} />
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Shipping address</p>
                {shippingAddress && Object.keys(shippingAddress).length > 0 ? (
                  <p className="text-sm text-slate-700 dark:text-slate-200">
                    {[shippingAddress.name, shippingAddress.street, shippingAddress.city, shippingAddress.state, shippingAddress.zip, shippingAddress.country].filter(Boolean).join(', ')}
                  </p>
                ) : (
                  <p className="text-sm text-slate-400">—</p>
                )}
              </div>
              {order.trackingNumber && (
                <Field label="Tracking" value={<span className="font-mono text-xs">{order.trackingNumber}</span>} />
              )}
            </div>
          </Card>

          {/* Transactions */}
          {order.transactions?.length > 0 && (
            <Card className="p-5">
              <h2 className="mb-3 font-heading text-base font-bold text-slate-900 dark:text-white">Transactions</h2>
              <ul className="space-y-3">
                {order.transactions.map((t) => (
                  <li key={t.id} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium capitalize text-slate-700 dark:text-slate-200">{t.gateway} · {t.type.toLowerCase()}</p>
                      <p className="font-mono text-xs text-slate-400">{t.gatewayRef || '—'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-slate-900 dark:text-white">{formatMoney(t.amount)}</p>
                      <p className="text-xs"><StatusBadge status={t.status} /></p>
                    </div>
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
