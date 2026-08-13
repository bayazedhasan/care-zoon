'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Search, X, TrendingUp, Sparkles, ArrowRight, Tag } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { products } from '@/data/products';
import { categories } from '@/data/categories';

export default function SearchCommandModal() {
  const { isSearchOpen, closeSearch } = useModal();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const POPULAR_SEARCHES = ['Wireless Headphones', 'Smart Watch', 'Vitamin C Serum', 'Oak Dining Chair', 'Running Shoes', 'Pet Bed'];

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.brand.toLowerCase().includes(query.toLowerCase()) ||
          p.shortDescription?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectPopular = (term) => {
    closeSearch();
    router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 bg-black/65 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Input */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900"
        >
          <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or categories..."
            className="flex-1 bg-transparent text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={closeSearch}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium"
          >
            ESC
          </button>
        </form>

        {/* Search Body Results / Suggestions */}
        <div className="overflow-y-auto p-5 space-y-6 flex-1">
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <span>Products matching &quot;{query}&quot;</span>
                <span>{filteredProducts.length} results</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filteredProducts.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      onClick={closeSearch}
                      className="flex items-center gap-3 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-sky-500/30 transition-all group"
                    >
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold uppercase tracking-wider">{p.brand}</p>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-sky-600">{p.name}</h4>
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">${p.price.toFixed(2)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    No exact matches found for &quot;{query}&quot;.
                  </p>
                  <button
                    onClick={handleSearchSubmit}
                    className="mt-3 text-xs font-bold text-sky-600 hover:underline flex items-center gap-1 mx-auto"
                  >
                    Search full catalog <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Popular Searches */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  <TrendingUp className="w-4 h-4 text-sky-500" />
                  <span>Trending Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectPopular(term)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950 dark:hover:text-sky-400 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Browse by Category */}
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Browse Categories</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      onClick={closeSearch}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Press <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-mono text-[10px] shadow-sm">Enter</kbd> to search
          </span>
          <button
            onClick={handleSearchSubmit}
            className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            Full Results <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
