'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  X,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Check,
  Star,
  Search
} from 'lucide-react';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { brands } from '@/data/brands';
import ProductCard from '@/components/common/ProductCard';
import Breadcrumbs from '@/components/common/Breadcrumbs';

function ProductCatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialCategory = searchParams.get('category') || 'all';
  const initialBrand = searchParams.get('brand') || '';
  const initialFilter = searchParams.get('filter') || '';

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrands, setSelectedBrands] = useState(initialBrand ? [initialBrand] : []);
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [dealsOnly, setDealsOnly] = useState(initialFilter === 'deals');
  const [selectedColor, setSelectedColor] = useState('');

  // View and Sorting States
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }
      // Price
      if (p.price < priceRange[0] || p.price > priceRange[1]) {
        return false;
      }
      // Rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }
      // In Stock
      if (inStockOnly && p.stock <= 0) {
        return false;
      }
      // Deals Only
      if (dealsOnly && !p.isFlashDeal && p.discountPercentage <= 0) {
        return false;
      }
      // Color
      if (selectedColor && !p.colors?.some((c) => c.name.toLowerCase().includes(selectedColor.toLowerCase()))) {
        return false;
      }
      return true;
    });
  }, [selectedCategory, selectedBrands, priceRange, minRating, inStockOnly, dealsOnly, selectedColor]);

  // Sort Logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    }
    if (sortBy === 'newest') {
      return list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }
    if (sortBy === 'bestseller') {
      return list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
    return list; // default featured
  }, [filteredProducts, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleBrand = (brandName) => {
    setSelectedBrands((prev) =>
      prev.includes(brandName) ? prev.filter((b) => b !== brandName) : [...prev, brandName]
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBrands([]);
    setPriceRange([0, 600]);
    setMinRating(0);
    setInStockOnly(false);
    setDealsOnly(false);
    setSelectedColor('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 600 ||
    minRating > 0 ||
    inStockOnly ||
    dealsOnly ||
    selectedColor !== '';

  const filterSidebarContent = (
    <div className="space-y-6 text-sm">
      {/* Header with Reset */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
          <SlidersHorizontal className="w-4 h-4 text-sky-600 dark:text-sky-400" />
          <span>Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        )}
      </div>

      {/* Category Tree */}
      <div>
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
          Categories
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
              selectedCategory === 'all'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <span>All Products</span>
            <span className="text-[10px] opacity-75">{products.length}</span>
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSelectedCategory(c.id);
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors ${
                selectedCategory === c.id
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{c.name}</span>
              <span className="text-[10px] opacity-75">
                {products.filter((p) => p.category === c.id).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
            Price Range
          </h4>
          <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
            ${priceRange[0]} — ${priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="600"
          step="10"
          value={priceRange[1]}
          onChange={(e) => {
            setPriceRange([priceRange[0], Number(e.target.value)]);
            setCurrentPage(1);
          }}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-600"
        />
        <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
          <span>$0</span>
          <span>$300</span>
          <span>$600+</span>
        </div>
      </div>

      {/* Brand Selector */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
          Brands
        </h4>
        <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label
              key={b.id}
              className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.name)}
                onChange={() => toggleBrand(b.name)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 rounded-md cursor-pointer"
              />
              <span className="flex-1">{b.name}</span>
              <span className="text-[10px] text-slate-400">
                ({products.filter((p) => p.brand === b.name).length})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Customer Rating Filter */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
          Rating
        </h4>
        <div className="space-y-1.5">
          {[4.5, 4.0, 3.5].map((star) => (
            <button
              key={star}
              onClick={() => {
                setMinRating(minRating === star ? 0 : star);
                setCurrentPage(1);
              }}
              className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors ${
                minRating === star
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{star} Stars & Above</span>
              </div>
              {minRating === star && <Check className="w-3.5 h-3.5 text-sky-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles: In Stock & Flash Deals */}
      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
        <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <span>In Stock Only</span>
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 cursor-pointer"
          />
        </label>
        <label className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
            <Sparkles className="w-3.5 h-3.5" /> Discount / Deals Only
          </span>
          <input
            type="checkbox"
            checked={dealsOnly}
            onChange={(e) => {
              setDealsOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/products' },
            ...(selectedCategory !== 'all'
              ? [
                  {
                    label:
                      categories.find((c) => c.id === selectedCategory)?.name ||
                      selectedCategory,
                  },
                ]
              : []),
          ]}
        />

        {/* Page Title & Stats */}
        <div className="mt-2 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedCategory === 'all'
                ? 'All Products'
                : categories.find((c) => c.id === selectedCategory)?.name || 'Catalog'}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing <strong className="text-slate-800 dark:text-slate-200">{sortedProducts.length}</strong> available items
            </p>
          </div>

          {/* Top Controls: Mobile Filter Button, Sort Dropdown, Grid/List Toggles */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs"
            >
              <Filter className="w-4 h-4 text-sky-600" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none px-4 py-2.5 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs cursor-pointer"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="bestseller">Sort by: Best Selling</option>
                <option value="newest">Sort by: Newest Arrivals</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
            </div>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-900 text-sky-600 shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 p-3 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40">
            <span className="text-xs font-semibold text-slate-500 mr-1">Active:</span>
            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-sky-600 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedBrands.map((b) => (
              <span
                key={b}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-sky-600 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700"
              >
                {b}
                <button onClick={() => toggleBrand(b)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {dealsOnly && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-rose-600 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700">
                Deals Only
                <button onClick={() => setDealsOnly(false)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {minRating > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-amber-600 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700">
                ★ {minRating}+
                <button onClick={() => setMinRating(0)}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-24">
            {filterSidebarContent}
          </aside>

          {/* Product Listing Area */}
          <div className="lg:col-span-3">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
                  No matching products found
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                  Try adjusting your filter preferences or resetting all active filters to view available items.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                      : 'flex flex-col gap-4'
                  }
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode={viewMode} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-9 h-9 rounded-xl text-xs font-bold transition-colors ${
                          currentPage === pageNum
                            ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                            : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {pageNum}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white dark:bg-slate-900 p-6 shadow-2xl overflow-y-auto z-10 animate-slide-down flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Filter Products</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {filterSidebarContent}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-lg"
              >
                Apply Filters ({sortedProducts.length} items)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductCatalogPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm font-semibold">Loading Catalog...</div>}>
      <ProductCatalogContent />
    </Suspense>
  );
}
