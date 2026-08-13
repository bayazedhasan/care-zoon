'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Zap, ShieldCheck, Truck } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    badge: 'NEW GENERATION AUDIO 2026',
    title: 'Acoustic Perfection. Wireless Freedom.',
    highlight: 'AuraStudio Pro ANC',
    subtitle: 'Hybrid noise-cancellation with 45-hour battery life and studio-grade beryllium drivers for audiophiles.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
    primaryCta: 'Shop Headphones',
    primaryHref: '/products/prod-1',
    secondaryCta: 'Explore Electronics',
    secondaryHref: '/category/electronics',
    discountTag: 'Save 28% This Week',
    accentColor: 'from-sky-500 to-blue-700',
  },
  {
    id: 2,
    badge: 'SPRING / SUMMER 2026 DROP',
    title: 'Timeless Silhouettes & Modern Craft.',
    highlight: 'Signature Collection',
    subtitle: 'Tailored Italian wool blend coats, heavyweight organic hoodies, and minimalist everyday luxury.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80',
    primaryCta: 'Shop Fashion',
    primaryHref: '/category/fashion',
    secondaryCta: 'View Lookbook',
    secondaryHref: '/products',
    discountTag: 'VIP Early Access',
    accentColor: 'from-amber-500 to-orange-700',
  },
  {
    id: 3,
    badge: 'SCANDINAVIAN LIVING',
    title: 'Elevate Your Home Sanctuary.',
    highlight: 'Minimalist Furniture & Decor',
    subtitle: '100% Solid European Oak craft, warm ambient lighting, and artisanal ceramic coffee sets.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    primaryCta: 'Shop Home Decor',
    primaryHref: '/category/home',
    secondaryCta: 'Explore Deals',
    secondaryHref: '/products?filter=deals',
    discountTag: 'Up to 30% OFF',
    accentColor: 'from-emerald-500 to-teal-700',
  },
];

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <section className="relative w-full overflow-hidden bg-slate-900 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center opacity-40 transform scale-105 transition-all duration-1000 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
          </div>

          {/* Slide Content */}
          <div className="relative z-20 max-w-2xl px-6 sm:px-12 py-12 flex flex-col justify-center">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white text-xs font-bold w-fit mb-4 animate-fade-in shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>{slide.badge}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              <span className="text-amber-300">{slide.discountTag}</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight animate-fade-in">
              {slide.title}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-400">
                {slide.highlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl animate-fade-in">
              {slide.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5 animate-fade-in">
              <Link
                href={slide.primaryCta.includes('Headphones') ? slide.primaryHref : slide.primaryHref}
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 active:scale-95 transition-all"
              >
                <span>{slide.primaryCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={slide.secondaryHref}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all"
              >
                <span>{slide.secondaryCta}</span>
              </Link>
            </div>

            {/* Feature Highlights Micro Bar */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-sky-400" />
                <span>Free Worldwide Express</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>2-Year Full Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Same-Day Dispatch</span>
              </div>
            </div>
          </div>

          {/* Slider Controls (Prev / Next Buttons) */}
          <div className="absolute right-6 bottom-6 z-20 hidden sm:flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)}
              className="p-3 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 backdrop-blur-md transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 sm:left-12 sm:translate-x-0 z-20 flex items-center gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-sky-500' : 'w-2 bg-white/30 hover:bg-white/50'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
