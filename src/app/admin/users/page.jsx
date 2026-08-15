'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Shield, Pencil } from 'lucide-react';
import { apiFetch, timeAgo } from '@/lib/admin-api';
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
} from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const ROLE_STYLES = {
  ADMIN: 'bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-400',
  MANAGER: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  STAFF: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
};

export default function UsersPage() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch(`/users${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [q]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    try {
      await apiFetch('/users', { method: 'POST', body: JSON.stringify(form) });
      addToast('Staff member created', 'success');
      setModalOpen(false);
      setForm({ name: '', email: '', password: '' });
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
        title="Users & Permissions"
        subtitle="Manage admin, manager and staff accounts."
        actions={
          <PrimaryButton onClick={() => setModalOpen(true)}>
            <Plus size={16} /> Add Staff
          </PrimaryButton>
        }
      />

      <Card>
        <div className="border-b border-slate-100 p-4 dark:border-slate-800">
          <SearchInput value={q} onChange={setQ} placeholder="Search name or email…" className="sm:max-w-xs" />
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>User</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Last Login</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}><div className="h-32" /></td></tr>
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={5}>
                  <EmptyState title="No users found" icon={Shield} />
                </td>
              </tr>
            ) : (
              data.items.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-500 dark:bg-slate-800">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-slate-100">{u.name}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${ROLE_STYLES[u.role]}`}>{u.role}</span>
                  </Td>
                  <Td><StatusBadge status={u.active ? 'ACTIVE' : 'blocked'} /></Td>
                  <Td className="text-slate-500">{u.lastLoginAt ? timeAgo(u.lastLoginAt) : 'Never'}</Td>
                  <Td className="text-slate-500">{timeAgo(u.createdAt)}</Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrap>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative w-full max-w-md animate-slide-down rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
            <h3 className="mb-4 font-heading text-lg font-bold text-slate-900 dark:text-white">Add Staff Member</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Email</label>
                <input type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
                <input type="password" className={inputCls} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setModalOpen(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Cancel
              </button>
              <PrimaryButton onClick={handleCreate}>Create Staff</PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
