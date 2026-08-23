'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Store, Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { login } from '@/lib/auth-client';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 pl-10 text-sm text-slate-900 placeholder-slate-400 outline-none transition-colors focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white';

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-1 border-b border-slate-100 p-8 pb-6 text-center dark:border-slate-800">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-white">
              <Store size={24} />
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Admin Console</h1>
            <p className="text-sm text-slate-500">Sign in to manage your store</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-8 pt-6">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="relative">
              <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@carezoon.com"
                autoComplete="email"
                required
                className={inputClasses}
              />
            </div>

            <div className="relative">
              <Lock size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                required
                className={inputClasses}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              ) : (
                <>
                  Sign in <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="border-t border-slate-100 px-8 py-4 text-center dark:border-slate-800">
            <p className="text-xs text-slate-400">
              Default seed login: <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">admin@carezoon.com</code> /{' '}
              <code className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">admin123</code>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <Link href="/" className="text-sky-600 hover:underline dark:text-sky-400">
            ← Back to storefront
          </Link>
        </p>
      </div>
    </div>
  );
}
