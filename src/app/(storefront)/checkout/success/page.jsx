'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, Truck, ArrowRight, Printer, Sparkles, MapPin } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '@/context/AuthContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-2026-8821';
  const { orders } = useAuth();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    // Launch Confetti Celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen py-10 sm:py-16 bg-transparent">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-12 text-center space-y-6">
          {/* Success Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Payment Successful
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Thank you for your order!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
              We have received your order and dispatched confirmation details to your email.
            </p>
          </div>

          {/* Order Meta Box */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Order Number</span>
              <strong className="text-slate-900 dark:text-white font-mono text-sm">{orderId}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Date</span>
              <strong className="text-slate-900 dark:text-white">{currentOrder?.date || new Date().toISOString().split('T')[0]}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Total Paid</span>
              <strong className="text-sky-600 dark:text-sky-400 text-sm font-bold">${currentOrder?.total?.toFixed(2) || '245.99'}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Est. Delivery</span>
              <strong className="text-emerald-600 dark:text-emerald-400 font-bold">In 2-3 Days</strong>
            </div>
          </div>

          {/* Tracking Timeline Preview */}
          <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 text-left space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
              <span className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-600" /> Courier Status: Preparing Dispatch
              </span>
              <span className="font-mono text-slate-400">{currentOrder?.trackingNumber || 'TRK-982187342US'}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full w-1/4" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/account?tab=orders"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/25 transition-all"
            >
              <Package className="w-4 h-4" />
              <span>Track Order in Dashboard</span>
            </Link>

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200 font-bold text-xs transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice Receipt</span>
            </button>

            <Link
              href="/products"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold text-xs transition-colors"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="max-w-3xl mx-auto p-12 text-center text-sm font-semibold">Loading Confirmation...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
