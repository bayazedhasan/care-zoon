'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  Zap,
  Tag,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';
import { categories } from '@/data/categories';
import { brands } from '@/data/brands';

export default function Navbar({ onMobileMenuOpen }) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, openCart, subtotal } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();
  const { openSearch } = useModal();
  const { addToast } = useToast();

  const [copiedCode, setCopiedCode] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Third nav state
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState('');

  const brandRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setAccountMenuOpen(false);
    setCategoryDropdownOpen(false);
    setBrandDropdownOpen(false);
    setActiveCategoryId(null);
  }, [pathname]);

  // Close brand dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (brandRef.current && !brandRef.current.contains(e.target)) {
        setBrandDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    addToast(`Promo code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(brandSearch.toLowerCase())
  );

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-200">
      {/* Row 1: Top Announcement Bar - Continuous Marquee */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 text-white text-xs py-2 px-3 sm:px-4 border-b border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="relative overflow-hidden w-full py-0.5 [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
            <div className="animate-marquee gap-8 text-[11px] sm:text-xs text-slate-200">
              <div className="flex items-center gap-8 shrink-0">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="text-amber-400 font-bold">&#9889; Flash Weekend Deals:</span> Up to <span className="text-amber-300 font-extrabold">50% OFF</span> on Tech, Fashion &amp; Living!
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🎁 Use Code <span className="font-mono font-bold text-amber-300 bg-white/10 px-1.5 py-0.5 rounded">SAVE20</span> for 20% Extra OFF
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🚚 <span className="text-sky-300 font-semibold">Free Express Shipping</span> on orders over $99
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🛡️ 30-Day Free Returns &amp; 2-Year Full Warranty
                </span>
                <span className="text-white/30">•</span>
              </div>
              <div className="flex items-center gap-8 shrink-0" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <span className="text-amber-400 font-bold">&#9889; Flash Weekend Deals:</span> Up to <span className="text-amber-300 font-extrabold">50% OFF</span> on Tech, Fashion &amp; Living!
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🎁 Use Code <span className="font-mono font-bold text-amber-300 bg-white/10 px-1.5 py-0.5 rounded">SAVE20</span> for 20% Extra OFF
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🚚 <span className="text-sky-300 font-semibold">Free Express Shipping</span> on orders over $99
                </span>
                <span className="text-white/30">•</span>
                <span className="inline-flex items-center gap-1.5 font-medium">
                  🛡️ 30-Day Free Returns &amp; 2-Year Full Warranty
                </span>
                <span className="text-white/30">•</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Main Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMobileMenuOpen}
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 fill-white/20" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center">
                  Care<span className="text-sky-600 dark:text-sky-400">Zoon</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 dark:text-slate-500 font-semibold uppercase -mt-1 hidden sm:block">
                  Premium Lifestyle &amp; Gear
                </span>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <button
              onClick={openSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:border-sky-500 dark:hover:border-sky-500 shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Search products, tech, fashion...</span>
              </div>
              <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600 shadow-xs">
                Ctrl+K
              </kbd>
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button onClick={openSearch} className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={toggleTheme} className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle Theme">
              {mounted && isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <Link href="/account?tab=wishlist" className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">{totalWishlistItems}</span>
              )}
            </Link>
            <button onClick={openCart} className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 transition-all shadow-xs" aria-label="Shopping Cart">
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center shadow">{totalItems}</span>
                )}
              </div>
              <span className="hidden lg:block text-xs font-bold">${subtotal.toFixed(2)}</span>
            </button>

            {/* Account Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button onClick={() => setAccountMenuOpen((p) => !p)} className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all">
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                      {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name.charAt(0)}
                    </div>
                    <span className="hidden xl:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link href="/account" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><User className="w-4 h-4 text-sky-600 dark:text-sky-400" /><span>My Account</span></Link>
                        <Link href="/account?tab=orders" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Package className="w-4 h-4 text-indigo-500" /><span>My Orders &amp; Tracking</span></Link>
                        <Link href="/account?tab=addresses" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><MapPin className="w-4 h-4 text-emerald-500" /><span>Saved Addresses</span></Link>
                        <Link href="/account?tab=wishlist" onClick={() => setAccountMenuOpen(false)} className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"><Heart className="w-4 h-4 text-rose-500" /><span>Wishlist ({totalWishlistItems})</span></Link>
                      </div>
                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button onClick={() => { logout(); setAccountMenuOpen(false); }} className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left">
                          <LogOut className="w-4 h-4" /><span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/auth/login" className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Sign In</Link>
                  <Link href="/auth/signup" className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Row 3: Category Nav + Dynamic Subcategory Pills + Brand Dropdown ── */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-2.5 mt-3">

          {/* Left: All Categories dropdown + dynamic category/subcategory pills */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto no-scrollbar">

            {/* All Categories Mega Button */}
            <div className="relative mr-2 shrink-0">
              <button
                onClick={() => setCategoryDropdownOpen((p) => !p)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm shadow-sky-600/20"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>All Categories</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-slide-down">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setCategoryDropdownOpen(false);
                        // Toggle: if already selected → go back to main categories view
                        setActiveCategoryId(activeCategoryId === cat.id ? null : cat.id);
                        router.push(`/products?category=${cat.slug}`);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-colors group ${
                        activeCategoryId === cat.id
                          ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <div className="flex items-center gap-2">
                        {activeCategoryId === cat.id && (
                          <span className="text-[9px] bg-sky-500 text-white px-1.5 py-0.5 rounded-full font-bold">Active</span>
                        )}
                        <span className="text-[10px] text-slate-400 group-hover:text-sky-500">{cat.itemCount} items</span>
                        <ChevronRight className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <Link href="/products" onClick={() => setCategoryDropdownOpen(false)} className="block text-center text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline">
                      Browse Entire Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

            {/* Dynamic Pills: show subcategories if a category is active, else show main categories */}
            {activeCategoryId ? (
              /* ── Subcategory mode ── */
              <>
                {/* Back button to return to main categories */}
                <button
                  onClick={() => setActiveCategoryId(null)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                  title="Back to all categories"
                >
                  <ChevronRight className="w-3 h-3 rotate-180" />
                  <span className="text-sky-600 dark:text-sky-400 font-bold">
                    {categories.find(c => c.id === activeCategoryId)?.name.split(' &')[0]}
                  </span>
                </button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />

                {/* All [Category] pill */}
                <Link
                  href={`/products?category=${categories.find(c => c.id === activeCategoryId)?.slug}`}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors shrink-0 whitespace-nowrap"
                >
                  All
                </Link>

                {/* Subcategory pills */}
                {categories.find(c => c.id === activeCategoryId)?.subcategories?.map((sub) => (
                  <Link
                    key={sub}
                    href={`/products?category=${categories.find(c => c.id === activeCategoryId)?.slug}&sub=${encodeURIComponent(sub)}`}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {sub}
                  </Link>
                ))}
              </>
            ) : (
              /* ── Default mode: show main category pills ── */
              <>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      router.push(`/products?category=${cat.slug}`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 whitespace-nowrap"
                  >
                    {cat.name.split(' &')[0].split(' and')[0]}
                    {cat.subcategories?.length > 0 && (
                      <ChevronDown className="w-2.5 h-2.5" />
                    )}
                  </button>
                ))}

                {/* Divider before quick links */}
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-0.5 shrink-0" />
                <Link
                  href="/products?filter=deals"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors whitespace-nowrap shrink-0"
                >
                  <Zap className="w-3 h-3 fill-rose-500" /> Flash Deals
                </Link>
                <Link
                  href="/blog"
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                    pathname.startsWith('/blog')
                      ? 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30'
                      : 'text-slate-600 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Blog
                </Link>
              </>
            )}
          </div>

          {/* Right: Brand Button — always visible */}
          <div ref={brandRef} className="relative shrink-0 ml-4">
            <button
              id="navbar-brand-btn"
              onClick={() => {
                setBrandDropdownOpen((p) => !p);
                setBrandSearch('');
              }}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                brandDropdownOpen
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:border-indigo-400 hover:text-indigo-600 dark:hover:border-indigo-500 dark:hover:text-indigo-400'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Brand</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${brandDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Brand Searchable Dropdown */}
            {brandDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 animate-slide-down overflow-hidden">
                {/* Live Search Input */}
                <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus-within:border-indigo-400 transition-colors">
                    <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search brands..."
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder-slate-400 outline-none"
                      autoFocus
                    />
                    {brandSearch && (
                      <button onClick={() => setBrandSearch('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Brand Results */}
                <div className="max-h-72 overflow-y-auto py-1.5">
                  {filteredBrands.length > 0 ? (
                    filteredBrands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/products?brand=${encodeURIComponent(brand.name)}`}
                        onClick={() => { setBrandDropdownOpen(false); setBrandSearch(''); }}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg leading-none">{brand.logo.split(' ')[0]}</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {brand.name}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{brand.category}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-medium">
                          {brand.productCount}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-xs text-slate-400">No brands found for &ldquo;{brandSearch}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Footer CTA */}
                <div className="border-t border-slate-100 dark:border-slate-800 p-2.5">
                  <Link
                    href="/products"
                    onClick={() => setBrandDropdownOpen(false)}
                    className="block text-center text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Browse All Brands →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

      </div>
    </header>
  );
}
