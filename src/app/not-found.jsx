'use client';

import React from 'react';
import Link from 'next/link';
import { Home, Search, Sparkles, ArrowRight, Grid } from 'lucide-react';
import { categories } from '@/data/categories';

export default function NotFound() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center py-16 px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        <div className="relative inline-block">
          <span className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600">
            404
          </span>
          <div className="absolute -bottom-2 inset-x-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-full" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Oops! Page Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          The page you are looking for may have been moved, renamed, or might never have existed. Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/products"
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-50 transition-all"
          >
            <Grid className="w-4 h-4" />
            <span>Explore All Products</span>
          </Link>
        </div>

        {/* Popular Categories Shortcut */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.slice(0, 4).map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.slug}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
