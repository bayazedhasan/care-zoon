'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search, HelpCircle, MessageSquare, Sparkles } from 'lucide-react';
import { faqs, faqCategories } from '@/data/faqs';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const filteredFaqs = faqs.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Help & FAQ' }]} />

        {/* Header */}
        <div className="my-8 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold">
            <HelpCircle className="w-3.5 h-3.5" /> CareZoon Knowledge Base
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Find immediate answers regarding orders, express shipping, warranty claims, returns, and payment options.
          </p>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto pt-2">
            <Search className="w-4 h-4 text-sky-600 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help questions (e.g., returns, tracking, coupons)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Topics
          </button>
          {faqCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openItems.includes(index);
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-slate-900 dark:text-white hover:text-sky-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3 animate-slide-down">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">No answers found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                }}
                className="mt-3 text-xs font-bold text-sky-600 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Still have questions banner */}
        <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-sky-900 to-indigo-950 text-white text-center space-y-3 border border-sky-800">
          <h3 className="text-xl font-bold">Still have questions?</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            Our customer care specialists are available 24/7 to help resolve any query.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors"
          >
            <MessageSquare className="w-4 h-4" /> Contact Customer Care
          </Link>
        </div>
      </div>
    </div>
  );
}
