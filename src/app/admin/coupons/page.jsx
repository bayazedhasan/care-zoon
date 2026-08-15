'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Tags, Pencil, Trash2 } from 'lucide-react';
import { apiFetch, formatDate } from '@/lib/admin-api';
import {
  Card,
  PageHeader,
  PrimaryButton,
  SearchInput,
  StatusBadge,
  EmptyState,
  TableWrap,
  Th,
  Td,
  ConfirmModal,
} from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const EMPTY = { code: '', type: 'FIXED', value: '', minSpend: '', usageLimit: '', expiresAt: '', active: true };

export default function CouponsPage() {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch(`/coupons${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setCoupons(d.coupons);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditing(c);
    setForm({
      code: c.code,
      type: c.type,
      value: String(c.value),
      minSpend: c.minSpend != null ? String(c.minSpend) : '',
      usageLimit: c.usageLimit != null ? String(c.usageLimit) : '',
      expiresAt: c.expiresAt ? c.expiresAt.slice(0, 10) : '',
      active: c.active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        value: Number(form.value),
        minSpend: form.minSpend ? Number(form.minSpend) : null,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
        expiresAt: form.expiresAt || null,
      };
      if (editing) {
        await apiFetch(`/coupons?id=${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        addToast('Coupon updated', 'success');
      } else {
        await apiFetch('/coupons', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Coupon created', 'success');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await apiFetch(`/coupons?id=${deleteTarget.id}`, { method: 'DELETE' });
      addToast('Coupon deleted', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div>
      <PageHeader
        title="Marketing & Promotions"
        subtitle="Manage discount codes and campaigns."
        actions={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Add Coupon
          </PrimaryButton>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <SearchInput value={q} onChange={setQ} placeholder="Search coupon code…" className="sm:max-w-xs" />
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Code</Th>
              <Th>Value</Th>
              <Th>Min Spend</Th>
              <Th>Used</Th>
              <Th>Expires</Th>
              <Th>Status</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7}><div className="h-32" /></td></tr>
            ) : !coupons.length ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState title="No coupons yet" message="Create your first discount code." icon={Tags} />
                </td>
              </tr>
            ) : (
              coupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td className="font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">{c.code}</Td>
                  <Td>
                    {c.type === 'PERCENTAGE' ? `${Number(c.value)}%` : `$${Number(c.value).toFixed(2)}`}
                    <span className="ml-1 text-xs text-slate-400">{c.type === 'PERCENTAGE' ? 'off' : 'off'}</span>
                  </Td>
                  <Td>{c.minSpend != null ? `$${Number(c.minSpend).toFixed(2)}` : '—'}</Td>
                  <Td>{c.usedCount}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</Td>
                  <Td>{c.expiresAt ? formatDate(c.expiresAt) : '—'}</Td>
                  <Td><StatusBadge status={c.active ? 'ACTIVE' : 'DRAFT'} /></Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800" aria-label="Edit coupon">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => setDeleteTarget(c)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800" aria-label="Delete coupon">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrap>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative max-h-[90vh] w-full max-w-md animate-slide-down overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 font-heading text-lg font-bold text-slate-900 dark:text-white">
              {editing ? 'Edit Coupon' : 'Create Coupon'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Code</label>
                <input className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type</label>
                  <select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option value="FIXED">Fixed ($)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Value</label>
                  <input type="number" step="0.01" className={inputCls} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Min spend</label>
                  <input type="number" step="0.01" className={inputCls} value={form.minSpend} onChange={(e) => setForm({ ...form, minSpend: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Usage limit</label>
                  <input type="number" className={inputCls} value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Expires</label>
                <input type="date" className={inputCls} value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-200">Active</span>
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Cancel
              </button>
              <PrimaryButton onClick={handleSave} disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete coupon?"
        message={`"${deleteTarget?.code}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
