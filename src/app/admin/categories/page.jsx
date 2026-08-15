'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { apiFetch } from '@/lib/admin-api';
import {
  Card,
  PageHeader,
  PrimaryButton,
  EmptyState,
  TableWrap,
  Th,
  Td,
  ConfirmModal,
} from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

const EMPTY = { name: '', slug: '', description: '', icon: '', image: '', featured: false, parentId: '' };

export default function CategoriesPage() {
  const { addToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState(EMPTY);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const d = await apiFetch('/categories');
      setCategories(d.categories);
    } finally {
      setLoading(false);
    }
  }, []);

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
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      icon: c.icon || '',
      image: c.image || '',
      featured: c.featured,
      parentId: c.parentId || '',
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, parentId: form.parentId || null };
      if (editing) {
        await apiFetch(`/categories?id=${editing.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
        addToast('Category updated', 'success');
      } else {
        await apiFetch('/categories', { method: 'POST', body: JSON.stringify(payload) });
        addToast('Category created', 'success');
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
      const d = await apiFetch(`/categories?id=${deleteTarget.id}`, { method: 'DELETE' });
      if (d.hasChildren) {
        addToast('Category has subcategories — remove them first', 'error');
      } else {
        addToast('Category deleted', 'success');
      }
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const topLevel = categories.filter((c) => !c.parentId);
  const childrenOf = (id) => categories.filter((c) => c.parentId === id);

  const inputCls =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div>
      <PageHeader
        title="Categories"
        subtitle="Organize your catalog with nested categories."
        actions={
          <PrimaryButton onClick={openCreate}>
            <Plus size={16} /> Add Category
          </PrimaryButton>
        }
      />

      <Card>
        <TableWrap>
          <thead>
            <tr>
              <Th>Category</Th>
              <Th>Slug</Th>
              <Th>Subcategories</Th>
              <Th>Products</Th>
              <Th>Featured</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6}><div className="h-32" /></td></tr>
            ) : !topLevel.length ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState title="No categories yet" icon={FolderTree} />
                </td>
              </tr>
            ) : (
              topLevel.map((c) => (
                <React.Fragment key={c.id}>
                  <tr className="bg-slate-50/60 hover:bg-slate-50 dark:bg-slate-800/30 dark:hover:bg-slate-800/40">
                    <Td className="font-semibold text-slate-900 dark:text-white">{c.name}</Td>
                    <Td className="font-mono text-xs">{c.slug}</Td>
                    <Td>{c.children?.length || 0}</Td>
                    <Td>{c._count?.products ?? '—'}</Td>
                    <Td>{c.featured ? 'Yes' : '—'}</Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openEdit(c)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800" aria-label="Edit category">
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => setDeleteTarget(c)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800" aria-label="Delete category">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </Td>
                  </tr>
                  {childrenOf(c.id).map((child) => (
                    <tr key={child.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <Td className="pl-10 text-slate-700 dark:text-slate-300">↳ {child.name}</Td>
                      <Td className="font-mono text-xs">{child.slug}</Td>
                      <Td>—</Td>
                      <Td>{child._count?.products ?? '—'}</Td>
                      <Td>{child.featured ? 'Yes' : '—'}</Td>
                      <Td className="text-right">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => openEdit(child)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800" aria-label="Edit category">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => setDeleteTarget(child)} className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800" aria-label="Delete category">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </Td>
                    </tr>
                  ))}
                </React.Fragment>
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
              {editing ? 'Edit Category' : 'Create Category'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Name</label>
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Parent category</label>
                <select className={inputCls} value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>
                  <option value="">None (top level)</option>
                  {categories.filter((c) => c.id !== editing?.id).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Description</label>
                <textarea rows={2} className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Icon name</label>
                  <input className={inputCls} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Smartphone" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Image URL</label>
                  <input className={inputCls} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
                </div>
              </div>
              <label className="flex cursor-pointer items-center justify-between">
                <span className="text-sm text-slate-700 dark:text-slate-200">Featured</span>
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="h-4 w-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
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
        title="Delete category?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
