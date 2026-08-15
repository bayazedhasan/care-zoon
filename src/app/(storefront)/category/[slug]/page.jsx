'use client';

import React, { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import ProductCard from '@/components/common/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Sparkles, ArrowRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function CategoryDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
    notFound();
  }

  const categoryProducts = products.filter((p) => p.category === category.id);

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/products' },
            { label: category.name },
          ]}
        />

        {/* Category Hero Header Banner */}
        <div className="relative mt-4 mb-10 rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl p-8 sm:p-12 flex items-center min-h-[260px] sm:min-h-[300px]">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-35 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Curated Category
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {category.name}
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed max-w-lg">
              {category.description}
            </p>

            {/* Subcategory Pills */}
            {category.subcategories && (
              <div className="mt-4 flex flex-wrap gap-2">
                {category.subcategories.map((sub, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-medium border border-white/15"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Products Grid */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing <strong className="text-slate-900 dark:text-white">{categoryProducts.length}</strong> items in {category.name}
          </p>
          <Link
            href="/products"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            All Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              More products arriving soon in this category!
            </h3>
            <Link
              href="/products"
              className="mt-4 inline-block px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
