'use client';

import React from 'react';
import Link from 'next/link';
import { brands } from '@/data/brands';
import { Award } from 'lucide-react';

export default function BrandShowcase() {
  return (
    <section className="py-14 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 my-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <h3 className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Trusted Brand Partners
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            100% Authentic Guaranteed Direct from Authorized Manufacturers
          </p>
        </div>

        {/* Brands Logo Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/products?brand=${encodeURIComponent(brand.name)}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md hover:border-sky-500/40 transition-all text-center group"
            >
              <span className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {brand.logo}
              </span>
              <span className="text-[10px] text-slate-400 mt-1">{brand.category}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
