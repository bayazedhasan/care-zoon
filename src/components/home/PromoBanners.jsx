'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function PromoBanners() {
  return (
    <section className="py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[360px] bg-slate-900 border border-slate-800 shadow-xl flex items-center p-8 sm:p-10 group">
            <Image
              src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80"
              alt="Next-Gen Wearables"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 max-w-md">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold border border-sky-500/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Wearables
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Lumix Horizon AMOLED GPS Fitness Series
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Precision tracking with dual-band multi-satellite GPS and 14-day battery reserve.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/products/prod-2"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
                >
                  <span>Shop Smart Watches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-amber-400 font-extrabold text-sm">Save $50 Today</span>
              </div>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative rounded-3xl overflow-hidden min-h-[320px] sm:min-h-[360px] bg-slate-900 border border-slate-800 shadow-xl flex items-center p-8 sm:p-10 group">
            <Image
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80"
              alt="Organic Skincare"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-35 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />

            <div className="relative z-10 max-w-md">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 mb-3">
                <Zap className="w-3.5 h-3.5" /> 100% Organic & Vegan
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Botanical Radiance Vitamin C + Peptides
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Dermatologist-formulated lipid-soluble Vitamin C for clinical glow and deep hydration.
              </p>
              <div className="mt-6 flex items-center gap-4">
                <Link
                  href="/category/beauty"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <span>Explore Skincare</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-emerald-400 font-extrabold text-sm">Free Gift with $60+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
