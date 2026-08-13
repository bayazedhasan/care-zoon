'use client';

import React from 'react';
import { Truck, ShieldCheck, RefreshCw, Headphones, Zap, Award } from 'lucide-react';

export default function TrustBadges({ variant = 'horizontal' }) {
  const badges = [
    {
      icon: Truck,
      title: 'Free Express Shipping',
      subtitle: 'On all orders over $99',
      color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50',
    },
    {
      icon: ShieldCheck,
      title: '100% Secure Checkout',
      subtitle: '256-Bit SSL Encrypted',
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50',
    },
    {
      icon: RefreshCw,
      title: '30-Day Free Returns',
      subtitle: 'Hassle-free money back guarantee',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50',
    },
    {
      icon: Headphones,
      title: '24/7 Dedicated Support',
      subtitle: 'Instant live agent chat & call',
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50',
    },
  ];

  if (variant === 'compact') {
    return (
      <div className="grid grid-cols-2 gap-3 py-4 border-y border-slate-200 dark:border-slate-800">
        {badges.slice(0, 4).map((badge, idx) => (
          <div key={idx} className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${badge.color}`}>
              <badge.icon className="w-4 h-4 shrink-0" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100">{badge.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{badge.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="w-full py-10 bg-slate-50/80 dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`p-3.5 rounded-xl ${badge.color}`}>
                <badge.icon className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white text-base">
                  {badge.title}
                </h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
