'use client';

import React, { useState, useEffect } from 'react';
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
  Sparkles,
  Copy,
  Check,
  Package,
  MapPin,
  LogOut,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';
import { categories } from '@/data/categories';

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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setAccountMenuOpen(false);
    setCategoryDropdownOpen(false);
  }, [pathname]);

  const copyPromoCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    addToast(`Promo code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <header className="w-full sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md transition-all duration-200">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="font-medium text-slate-200 text-[11px] sm:text-xs">
              ⚡ Flash Weekend Deals: Up to <span className="text-amber-400 font-bold">50% OFF</span> + Free Express Delivery on orders over $99
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-0.5 rounded-full text-[11px]">
              <span className="text-slate-300">Use Code:</span>
              <span className="font-mono font-bold text-amber-300">SAVE20</span>
              <button
                onClick={() => copyPromoCode('SAVE20')}
                className="p-0.5 hover:text-amber-200 transition-colors ml-0.5"
                title="Copy code"
              >
                {copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-300">
              <Link href="/faq" className="hover:text-white transition-colors">Help & FAQ</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-200 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger & Brand Logo */}
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
                  Premium Lifestyle & Gear
                </span>
              </div>
            </Link>
          </div>

          {/* Center Search Trigger Bar (Command Palette style) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-6">
            <button
              onClick={openSearch}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-slate-500 dark:text-slate-400 hover:border-sky-500 dark:hover:border-sky-500 shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-medium">Search products, tech, fashion...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded border border-slate-200 dark:border-slate-600 shadow-xs">
                  Ctrl+K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right Action Icons: Theme, Search (Mobile), Wishlist, Cart, Account */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search icon (mobile) */}
            <button
              onClick={openSearch}
              className="md:hidden p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle Theme"
            >
              {mounted && isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Wishlist Icon */}
            <Link
              href="/account?tab=wishlist"
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                  {totalWishlistItems}
                </span>
              )}
            </Link>

            {/* Cart Icon Trigger */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 p-2 sm:px-3.5 sm:py-2 rounded-2xl bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/60 transition-all shadow-xs"
              aria-label="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="hidden lg:block text-xs font-bold">
                ${subtotal.toFixed(2)}
              </span>
            </button>

            {/* User Account Menu Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setAccountMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <span className="hidden xl:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                      {user.name}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                  </button>

                  {/* Account Dropdown Menu */}
                  {accountMenuOpen && (
                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-slide-down">
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account?tab=orders"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Package className="w-4 h-4 text-indigo-500" />
                          <span>My Orders & Tracking</span>
                        </Link>
                        <Link
                          href="/account?tab=addresses"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-emerald-500" />
                          <span>Saved Addresses</span>
                        </Link>
                        <Link
                          href="/account?tab=wishlist"
                          onClick={() => setAccountMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500" />
                          <span>Wishlist ({totalWishlistItems})</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setAccountMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="hidden sm:inline-flex px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Category Navigation Bar */}
        <nav className="hidden lg:flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-3 mt-3">
          <div className="flex items-center gap-6">
            {/* Mega Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-colors shadow-sm shadow-sky-600/20"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>All Categories</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {categoryDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-slide-down">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-sky-50 dark:hover:bg-slate-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors group"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-sky-500">
                        {cat.itemCount} items
                      </span>
                    </Link>
                  ))}
                  <div className="p-2 border-t border-slate-100 dark:border-slate-800 mt-1">
                    <Link
                      href="/products"
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
                    >
                      Browse Entire Catalog →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <Link
              href="/"
              className={`text-xs font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                pathname === '/' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Home
            </Link>
            <Link
              href="/products"
              className={`text-xs font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                pathname === '/products' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Shop All
            </Link>
            <Link
              href="/products?filter=deals"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <Zap className="w-3 h-3 fill-rose-500" /> Flash Deals
            </Link>
            <Link
              href="/blog"
              className={`text-xs font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                pathname.startsWith('/blog') ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Blog
            </Link>
            <Link
              href="/about"
              className={`text-xs font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                pathname === '/about' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`text-xs font-semibold hover:text-sky-600 dark:hover:text-sky-400 transition-colors ${
                pathname === '/contact' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Authorized Warranty
            </span>
          </div>
        </nav>
      </div>
    </header>
  );
}
