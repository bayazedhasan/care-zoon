'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, TrendingUp, Award, Clock, Star } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/common/ProductCard';

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('trending');

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'bestsellers', label: 'Best Sellers', icon: Award },
    { id: 'new', label: 'New Arrivals', icon: Clock },
    { id: 'toprated', label: 'Top Rated', icon: Star },
  ];

  let filtered = products;
  if (activeTab === 'trending') {
    filtered = products.filter((p) => p.isFeatured).slice(0, 8);
  } else if (activeTab === 'bestsellers') {
    filtered = products.filter((p) => p.isBestSeller).slice(0, 8);
  } else if (activeTab === 'new') {
    filtered = products.filter((p) => p.isNew).slice(0, 8);
  } else if (activeTab === 'toprated') {
    filtered = [...products].sort((a, b) => b.rating - a.rating).slice(0, 8);
  }

  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Products
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Engineered with uncompromising quality and designed for everyday joy.
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm border border-slate-200/60 dark:border-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 font-bold text-sm shadow-lg transition-all"
          >
            <span>Explore All {products.length}+ Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
