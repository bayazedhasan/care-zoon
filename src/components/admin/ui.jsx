'use client';

import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Search, AlertTriangle } from 'lucide-react';

const STATUS_STYLES = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  PROCESSING: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  SHIPPED: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-400',
  DELIVERED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  REFUNDED: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  PAID: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  UNPAID: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  FAILED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  PARTIALLY_REFUNDED: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-400',
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  DRAFT: 'bg-slate-200 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300',
  ARCHIVED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  APPROVED: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  blocked: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  requested: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  REQUESTED: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
};

export function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}>
      {String(status || '—').toLowerCase().replace(/_/g, ' ')}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function SecondaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

export function DangerButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export function SearchInput({ value, onChange, placeholder = 'Search…', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
      />
    </div>
  );
}

export function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
    >
      {children}
    </select>
  );
}

export function Pagination({ pagination, onPage }) {
  const { page, pages, total } = pagination || {};
  if (!pages || pages <= 1) return null;
  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-800">
      <p className="text-xs text-slate-500">
        Page {page} of {pages} · {total} records
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40 dark:border-slate-700"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page >= pages}
          className="rounded-md border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40 dark:border-slate-700"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ title = 'No results found', message, icon: Icon = AlertTriangle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
        <Icon size={22} />
      </div>
      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{title}</p>
      {message && <p className="mt-1 max-w-sm text-xs text-slate-500">{message}</p>}
    </div>
  );
}

export function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-4">
          <div className="h-4 w-full max-w-[160px] rounded bg-slate-100 dark:bg-slate-800" />
        </td>
      ))}
    </tr>
  );
}

export function ConfirmModal({ open, title, message, confirmLabel = 'Confirm', onConfirm, onClose, danger = true }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md animate-slide-down rounded-xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-700 dark:bg-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        {message && <p className="mt-2 text-sm text-slate-500">{message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm?.();
            }}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white ${
              danger ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function TableWrap({ children }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = '' }) {
  return (
    <th className={`whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-800 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = '' }) {
  return <td className={`border-b border-slate-100 px-4 py-3 text-sm text-slate-700 dark:border-slate-800/60 dark:text-slate-300 ${className}`}>{children}</td>;
}
