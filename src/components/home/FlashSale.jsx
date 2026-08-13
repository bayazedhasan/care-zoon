'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Timer, ArrowRight, Flame } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/common/ProductCard';

export default function FlashSale() {
  // Countdown Timer: 18h 42m 15s initial
  const [timeLeft, setTimeLeft] = useState({
    hours: 18,
    minutes: 42,
    seconds: 15,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = products.filter((p) => p.isFlashDeal).slice(0, 4);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white rounded-3xl my-8 mx-4 sm:mx-6 lg:mx-8 border border-slate-800 shadow-2xl relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        {/* Header with Countdown Timer */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-bold mb-3">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500 animate-bounce" />
              <span>LIMITED QUANTITY DEALS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white flex items-center gap-2">
              Flash Weekend Deals <Zap className="w-6 h-6 text-amber-400 fill-amber-400" />
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Top curated picks at deep seasonal discounts. Snag them before the timer runs out!
            </p>
          </div>

          {/* Countdown Clock Display */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mr-1 hidden sm:flex">
              <Timer className="w-4 h-4 text-amber-400" /> Ends In:
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xl text-amber-400 shadow-inner">
                  {String(timeLeft.hours).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">HOURS</span>
              </div>
              <span className="text-xl font-bold text-slate-600 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xl text-amber-400 shadow-inner">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">MINS</span>
              </div>
              <span className="text-xl font-bold text-slate-600 -mt-4">:</span>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xl text-amber-400 shadow-inner">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold mt-1">SECS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flash Deals Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10">
          {flashProducts.map((p) => (
            <div key={p.id} className="flex flex-col">
              <ProductCard product={p} />
              {/* Claimed progress bar */}
              <div className="mt-3 px-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Claimed: <strong className="text-rose-400">{p.claimedPercentage || 75}%</strong></span>
                  <span className="text-slate-500">Only {p.stock} units left</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full"
                    style={{ width: `${p.claimedPercentage || 75}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Link */}
        <div className="mt-12 text-center">
          <Link
            href="/products?filter=deals"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-md border border-white/15 transition-all shadow-md"
          >
            <span>View All {products.filter((p) => p.isFlashDeal).length}+ Flash Deals</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
