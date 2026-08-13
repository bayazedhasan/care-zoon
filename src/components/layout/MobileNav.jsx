'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  ShoppingBag,
  Heart,
  User,
  X,
  Sparkles,
  Grid,
  Zap,
  BookOpen,
  HelpCircle,
  Phone,
  Info,
  LogOut,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { categories } from '@/data/categories';

export default function MobileNav({ isOpen, onClose }) {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();
  const { totalWishlistItems } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <>
      {/* 1. Slide-out Mobile Navigation Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={onClose}
          />

          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col justify-between z-10 animate-slide-down">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Link href="/" onClick={onClose} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="font-bold text-lg text-slate-900 dark:text-white">CareZoon</span>
              </Link>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Summary */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</h4>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 text-center rounded-xl bg-sky-600 text-white text-xs font-bold shadow-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={onClose}
                    className="flex-1 py-2 px-3 text-center rounded-xl border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Scrollable Links */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Categories
                </p>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] text-slate-400">{cat.itemCount}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Quick Navigation
                </p>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Grid className="w-4 h-4 text-sky-500" />
                    <span>Shop All Products</span>
                  </Link>
                  <Link
                    href="/products?filter=deals"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Flash Deals</span>
                  </Link>
                  <Link
                    href="/blog"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                    <span>Blog & Insights</span>
                  </Link>
                  <Link
                    href="/about"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Info className="w-4 h-4 text-amber-500" />
                    <span>About Us</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <Phone className="w-4 h-4 text-teal-500" />
                    <span>Contact Support</span>
                  </Link>
                  <Link
                    href="/faq"
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <HelpCircle className="w-4 h-4 text-sky-500" />
                    <span>Help & FAQ</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
                <span>{isDark ? 'Light Theme' : 'Dark Theme'}</span>
              </button>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-600"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Sticky Mobile Bottom App Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-3 py-2">
        <div className="grid grid-cols-5 items-center text-center">
          {/* Home */}
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              pathname === '/' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px]">Home</span>
          </Link>

          {/* Shop */}
          <Link
            href="/products"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              pathname === '/products' ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px]">Shop</span>
          </Link>

          {/* Wishlist */}
          <Link
            href="/account?tab=wishlist"
            className={`relative flex flex-col items-center gap-1 py-1 transition-colors ${
              pathname.includes('wishlist') ? 'text-sky-600 dark:text-sky-400 font-bold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5" />
              {totalWishlistItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalWishlistItems}
                </span>
              )}
            </div>
            <span className="text-[10px]">Wishlist</span>
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative flex flex-col items-center gap-1 py-1 text-slate-500 dark:text-slate-400 hover:text-sky-600 transition-colors"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-full bg-sky-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px]">Cart</span>
          </button>

          {/* Account */}
          <Link
            href="/account"
            className={`flex flex-col items-center gap-1 py-1 transition-colors ${
              pathname.startsWith('/account') || pathname.startsWith('/auth')
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px]">Account</span>
          </Link>
        </div>
      </div>
    </>
  );
}
