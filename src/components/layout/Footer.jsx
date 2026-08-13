'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Mail,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
  Send,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { categories } from '@/data/categories';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      addToast('Please provide a valid email address.', 'error');
      return;
    }
    setSubscribed(true);
    addToast('Thank you for subscribing! Your 15% discount code is WELCOME15', 'success');
    setEmail('');
  };

  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-24 lg:pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Newsletter & Value Subscription Strip */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-900/40 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Stay in the Loop
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Unlock 15% OFF your next order
              </h3>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Subscribe to receive early access to VIP drops, weekly curated lifestyle trends, and members-only flash deals.
              </p>
            </div>

            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all shrink-0"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                  <span>{subscribed ? 'Subscribed!' : 'Subscribe'}</span>
                </button>
              </form>
              <p className="text-[11px] text-slate-500 mt-2">
                By subscribing you agree to our <Link href="/privacy" className="underline hover:text-slate-400">Privacy Policy</Link>. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">
                Care<span className="text-sky-400">Zoon</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              CareZoon is a modern lifestyle and tech destination designed for those who appreciate premium craftsmanship, thoughtful aesthetics, and uncompromising performance.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>100 Market Street, Suite 800, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+1 (800) 555-CARE (2273) • Mon - Sun, 24/7</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Global Express Dispatch within 24 hours</span>
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-sky-400 transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/account?tab=orders" className="hover:text-sky-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-sky-400 transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-sky-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sky-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  Our Quality Guarantee
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition-colors">
                  About CareZoon
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-sky-400 transition-colors">
                  Journal & Editorial
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-sky-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sky-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-sky-400 transition-colors">
                  Shipping & Customs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareZoon Inc. All rights reserved. Crafted for excellence.</p>

          {/* Payment Method Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {['Visa', 'Mastercard', 'Amex', 'PayPal', 'Apple Pay', 'Google Pay', 'COD'].map((method, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300 shadow-xs"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
