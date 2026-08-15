'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Package, Pencil, MoreHorizontal } from 'lucide-react';
import { apiFetch, formatMoney } from '@/lib/admin-api';
import {
  Card,
  PageHeader,
  PrimaryButton,
  SearchInput,
  Select,
  StatusBadge,
  Pagination,
  EmptyState,
  SkeletonRow,
  TableWrap,
  Th,
  Td,
  ConfirmModal,
} from '@/components/admin/ui';
import { useToast } from '@/context/ToastContext';

export default function ProductsPage() {
  const { addToast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page) });
      if (q) params.set('q', q);
      if (status) params.set('status', status);
      if (stock) params.set('stock', stock);
      if (category) params.set('category', category);
      const d = await apiFetch(`/products?${params}`);
      setData(d);
    } finally {
      setLoading(false);
    }
  }, [page, q, status, stock, category]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    apiFetch('/categories')
      .then((d) => setCategories(d.categories))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [q, status, stock, category]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await apiFetch(`/products/${deleteTarget.id}`, { method: 'DELETE' });
      addToast('Product archived', 'success');
      setDeleteTarget(null);
      load();
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your catalog, inventory and pricing."
        actions={
          <Link href="/admin/products/new">
            <PrimaryButton>
              <Plus size={16} /> Add Product
            </PrimaryButton>
          </Link>
        }
      />

      <Card>
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center dark:border-slate-800">
          <SearchInput value={q} onChange={setQ} placeholder="Search by name or SKU…" className="sm:max-w-xs" />
          <div className="flex flex-wrap gap-2">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">All statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </Select>
            <Select value={stock} onChange={(e) => setStock(e.target.value)}>
              <option value="">All stock</option>
              <option value="in">In stock</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
            </Select>
            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </div>
        </div>

        <TableWrap>
          <thead>
            <tr>
              <Th>Product</Th>
              <Th>SKU</Th>
              <Th>Category</Th>
              <Th>Price</Th>
              <Th>Stock</Th>
              <Th>Status</Th>
              <Th>Rating</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} cols={8} />)
            ) : !data?.items?.length ? (
              <tr>
                <td colSpan={8}>
                  <EmptyState title="No products found" message="Try adjusting your filters or add a new product." icon={Package} />
                </td>
              </tr>
            ) : (
              data.items.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <Td>
                    <div className="flex items-center gap-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400 dark:bg-slate-800">
                          <Package size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <Link href={`/admin/products/${p.id}`} className="block max-w-[260px] truncate font-medium text-slate-800 hover:text-sky-600 dark:text-slate-100">
                          {p.name}
                        </Link>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-mono text-xs">{p.sku}</Td>
                  <Td>{p.category?.name || '—'}</Td>
                  <Td>
                    <span className="font-medium text-slate-900 dark:text-white">{formatMoney(p.price)}</span>
                    {p.originalPrice && Number(p.originalPrice) > Number(p.price) && (
                      <span className="ml-1.5 text-xs text-slate-400 line-through">{formatMoney(p.originalPrice)}</span>
                    )}
                  </Td>
                  <Td>
                    <span
                      className={`font-medium ${
                        p.stock === 0 ? 'text-red-500' : p.stock <= p.lowStockThreshold ? 'text-amber-500' : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </Td>
                  <Td><StatusBadge status={p.status} /></Td>
                  <Td>
                    <span className="text-slate-600 dark:text-slate-300">
                      ★ {Number(p.rating || 0).toFixed(1)} <span className="text-xs text-slate-400">({p.reviewCount})</span>
                    </span>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-sky-600 dark:hover:bg-slate-800"
                        aria-label="Edit product"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-slate-800"
                        aria-label="Archive product"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </TableWrap>

        <Pagination pagination={data?.pagination} onPage={setPage} />
      </Card>

      <ConfirmModal
        open={!!deleteTarget}
        title="Archive product?"
        message={`"${deleteTarget?.name}" will be moved to Archived and hidden from the storefront.`}
        confirmLabel="Archive"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
