'use client';

import React from 'react';
import Image from 'next/image';
import { Star, ShieldCheck, Quote, Sparkles } from 'lucide-react';
import { testimonials } from '@/data/testimonials';
import RatingStars from '@/components/common/RatingStars';

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Verified Experiences
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Loved by Over 45,000+ Customers Worldwide
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Real feedback from verified purchasers who trust CareZoon for everyday excellence.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <RatingStars rating={t.rating} size="sm" showScore={false} />
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3" /> Verified
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  &ldquo;{t.comment}&rdquo;
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                  <Image src={t.avatar} alt={t.name} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{t.location} • {t.product}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
