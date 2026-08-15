'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, CheckCircle2, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function ReturnsPolicyPage() {
  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Returns & Refunds' }]} />

        <div className="my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-8 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" /> 30-Day Guarantee
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Return & Refund Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Hassle-free 30-day money back guarantee</p>
          </div>

          {/* 3 Step Return Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              { step: '1', title: 'Initiate Return', desc: 'Go to your account dashboard, select the order item, and request a return.' },
              { step: '2', title: 'Print Free Label', desc: 'Download the pre-paid courier shipping label and attach it to your parcel.' },
              { step: '3', title: 'Get Fast Refund', desc: 'Once scanned by the courier, your refund is processed within 3 business days.' },
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">{s.title}</h3>
                <p className="text-xs text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Eligible Items</h2>
            <p>
              Items must be in original condition, with tags and packaging intact. Electronics must include all original cables and accessories.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Refund Processing Times</h2>
            <p>
              Credit card refunds typically appear on your billing statement within 3 to 5 business days after warehouse arrival. PayPal and digital wallet refunds post within 24 hours.
            </p>
          </section>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Need help returning an item?</span>
            <Link
              href="/account?tab=orders"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md"
            >
              <span>Go to Order History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
