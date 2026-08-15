'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, Filter, Sparkles, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/common/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('relevant');

  const searchResults = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return products;

    return products.filter((p) => {
      const matchQuery =
        p.name.toLowerCase().includes(term) ||
        p.brand.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.shortDescription?.toLowerCase().includes(term);

      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;

      return matchQuery && matchCategory;
    });
  }, [searchTerm, selectedCategory]);

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Search Results' }]} />

        {/* Search Header Bar */}
        <div className="mt-4 mb-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Search Our Catalog
          </h1>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products, brands, models..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics & Audio</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="home">Home & Living</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="sports">Sports & Outdoors</option>
              <option value="pets">Pet Supplies</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between pt-1">
            <span>
              Found <strong>{searchResults.length}</strong> matching products
              {searchTerm && <span> for &ldquo;{searchTerm}&rdquo;</span>}
            </span>
          </div>
        </div>

        {/* Results Grid */}
        {searchResults.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No products found matching &ldquo;{searchTerm}&rdquo;
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Check for typos or try searching for broader keywords like &quot;Audio&quot;, &quot;Watch&quot;, &quot;Chair&quot;, or &quot;Serum&quot;.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
            >
              View All Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm font-semibold">Loading Search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
