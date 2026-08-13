'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ShieldCheck, Heart, Globe, Award, Users, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function AboutPage() {
  const stats = [
    { value: '45K+', label: 'Delighted Customers Worldwide' },
    { value: '99.4%', label: 'Positive Verified Satisfaction' },
    { value: '65+', label: 'Countries Supported with Express Dispatch' },
    { value: '24/7', label: 'Dedicated Customer Care Squad' },
  ];

  const values = [
    {
      icon: Award,
      title: 'Obsessive Craftsmanship',
      desc: 'We partner exclusively with certified artisan workshops and tier-one manufacturers who share our unrelenting dedication to build quality and material excellence.',
    },
    {
      icon: Globe,
      title: 'Sustainable Sourcing',
      desc: 'From FSC-certified European hardwoods to 100% recyclable biodegradable packaging and carbon-neutral transit, our environmental commitment is authentic.',
    },
    {
      icon: Heart,
      title: 'Customer-First Ethics',
      desc: 'Transparent honest pricing with zero hidden fees, 30-day money-back guarantee, and round-the-clock live human support whenever you need assistance.',
    },
  ];

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About Us' }]} />

        {/* Hero Section */}
        <div className="my-8 text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" /> Our Story & Mission
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            Curating Products that Bring Function, Joy & Timeless Elegance
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            CareZoon was founded with a singular conviction: modern living should be filled with thoughtful, durable, and inspiring design rather than disposable convenience.
          </p>
        </div>

        {/* Story Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-16">
          <div className="lg:col-span-6 relative aspect-4/3 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800">
            <Image
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
              alt="CareZoon Design Studio"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Designed in San Francisco, Crafted Worldwide
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              What started as a small design studio in 2021 has grown into a globally celebrated lifestyle destination. We obsess over the micro-details: the tactile feel of CNC-milled aluminum dials, the natural grain of sustainably harvested European oak, and the gentle drape of organic French terry cotton.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every item featured in the CareZoon catalog undergoes rigorous testing for durability, ergonomics, and acoustic or material performance before it earns our seal of approval.
            </p>
            <div className="pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
              >
                <span>Explore the Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 my-16">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-sm"
            >
              <span className="text-3xl sm:text-4xl font-black text-sky-600 dark:text-sky-400 block mb-1">
                {stat.value}
              </span>
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="my-16 space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Our Core Commitments</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              The fundamental principles guiding every product we curate and every customer relationship we nurture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                  <v.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{v.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
