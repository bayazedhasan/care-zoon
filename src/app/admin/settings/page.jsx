'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { apiFetch } from '@/lib/admin-api';
import { Card, PageHeader, PrimaryButton, SecondaryButton } from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const TABS = [
  { key: 'store', label: 'General' },
  { key: 'payments', label: 'Payments' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'tax', label: 'Tax' },
];

const inputCls =
  'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

export default function SettingsPage() {
  const { addToast } = useToast();
  const [tab, setTab] = useState('store');
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch('/settings');
      const map = {};
      d.settings.forEach((s) => {
        map[s.key] = s.value || {};
      });
      setSettings(map);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (group, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: value },
    }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await apiFetch('/settings', {
        method: 'POST',
        body: JSON.stringify({ key: tab, value: settings[tab] || {}, group: tab }),
      });
      addToast('Settings saved', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const store = settings.store || {};
  const payments = settings.payments || {};
  const shipping = settings.shipping || {};
  const tax = settings.tax || {};

  return (
    <div>
      <PageHeader
        title="Settings"
        subtitle="Configure your store, payments, shipping and tax."
        actions={<PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</PrimaryButton>}
      />

      <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1 dark:border-slate-800 dark:bg-slate-900">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-sky-500 text-white'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center text-sm text-slate-400">
          <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-500" /> Loading…
        </div>
      ) : (
        <div className="max-w-2xl">
          <Card className="p-6">
            {tab === 'store' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Store name</label>
                    <input className={inputCls} value={store.name || ''} onChange={(e) => set('store', 'name', e.target.value)} />
                  </div>
                  <div>
                    <label className={labelCls}>Store email</label>
                    <input className={inputCls} value={store.email || ''} onChange={(e) => set('store', 'email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Tagline</label>
                  <input className={inputCls} value={store.tagline || ''} onChange={(e) => set('store', 'tagline', e.target.value)} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Currency</label>
                    <select className={inputCls} value={store.currency || 'USD'} onChange={(e) => set('store', 'currency', e.target.value)}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="BDT">BDT (৳)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Timezone</label>
                    <input className={inputCls} value={store.timezone || 'UTC'} onChange={(e) => set('store', 'timezone', e.target.value)} />
                  </div>
                </div>
              </div>
            )}

            {tab === 'payments' && (
              <div className="space-y-6">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-heading text-sm font-bold text-slate-900 dark:text-white">Stripe</p>
                      <p className="text-xs text-slate-400">Test or live secret key</p>
                    </div>
                    <label className="flex cursor-pointer items-center">
                      <input type="checkbox" checked={payments.stripe?.enabled || false} onChange={(e) => set('payments', 'stripe', { ...(payments.stripe || {}), enabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                    </label>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>Publishable key</label>
                      <input className={inputCls} value={payments.stripe?.publishableKey || ''} onChange={(e) => set('payments', 'stripe', { ...(payments.stripe || {}), publishableKey: e.target.value })} placeholder="pk_test_…" />
                    </div>
                    <div>
                      <label className={labelCls}>Secret key</label>
                      <input className={inputCls} value={payments.stripe?.secretKey || ''} onChange={(e) => set('payments', 'stripe', { ...(payments.stripe || {}), secretKey: e.target.value })} placeholder="sk_test_…" />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-heading text-sm font-bold text-slate-900 dark:text-white">PayPal</p>
                      <p className="text-xs text-slate-400">Client ID & secret (sandbox)</p>
                    </div>
                    <label className="flex cursor-pointer items-center">
                      <input type="checkbox" checked={payments.paypal?.enabled || false} onChange={(e) => set('payments', 'paypal', { ...(payments.paypal || {}), enabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                    </label>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>Client ID</label>
                      <input className={inputCls} value={payments.paypal?.clientId || ''} onChange={(e) => set('payments', 'paypal', { ...(payments.paypal || {}), clientId: e.target.value })} />
                    </div>
                    <div>
                      <label className={labelCls}>Secret</label>
                      <input className={inputCls} value={payments.paypal?.secret || ''} onChange={(e) => set('payments', 'paypal', { ...(payments.paypal || {}), secret: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <p className="font-heading text-sm font-bold text-slate-900 dark:text-white">Cash on Delivery</p>
                      <p className="text-xs text-slate-400">Allow customers to pay on delivery</p>
                    </div>
                    <label className="flex cursor-pointer items-center">
                      <input type="checkbox" checked={payments.cod?.enabled ?? true} onChange={(e) => set('payments', 'cod', { ...(payments.cod || {}), enabled: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {tab === 'shipping' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Flat rate ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={shipping.flatRate ?? ''} onChange={(e) => set('shipping', 'flatRate', Number(e.target.value))} />
                  </div>
                  <div>
                    <label className={labelCls}>Free shipping threshold ($)</label>
                    <input type="number" step="0.01" className={inputCls} value={shipping.freeShippingThreshold ?? ''} onChange={(e) => set('shipping', 'freeShippingThreshold', Number(e.target.value))} />
                  </div>
                </div>
                <p className="text-xs text-slate-400">Shipping zones and delivery methods (courier, pickup) can be added here in a future iteration.</p>
              </div>
            )}

            {tab === 'tax' && (
              <div className="space-y-4">
                <div>
                  <label className={labelCls}>Default tax rate (%)</label>
                  <input type="number" step="0.01" className={inputCls} value={tax.defaultRate ?? 0} onChange={(e) => set('tax', 'defaultRate', Number(e.target.value))} />
                </div>
                <p className="text-xs text-slate-400">Per-region tax configuration can be added in a future iteration.</p>
              </div>
            )}

            <div className="mt-6 flex justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
              <PrimaryButton onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Settings'}</PrimaryButton>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
