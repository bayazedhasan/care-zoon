'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Clock, ArrowRight, Sparkles, User } from 'lucide-react';
import { blogs } from '@/data/blogs';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredBlogs = selectedCategory === 'all'
    ? blogs
    : blogs.filter((b) => b.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog & Editorial' }]} />

        {/* Hero Header */}
        <div className="my-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold">
            <BookOpen className="w-3.5 h-3.5" /> CareZoon Journal
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Stories, Tech Guides & Lifestyle Inspiration
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Curated deep dives into spatial audio, Scandinavian ergonomics, organic wellness, and modern living.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {['all', 'Tech & Audio', 'Home & Living', 'Wellness & Beauty'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {cat === 'all' ? 'All Articles' : cat}
            </button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              className="flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative w-full aspect-16/10 overflow-hidden bg-slate-100 dark:bg-slate-800">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold">
                  {blog.category}
                </span>
              </div>

              <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {blog.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${blog.slug}`}>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-7 h-7 rounded-full overflow-hidden">
                      <Image src={blog.author.avatar} alt={blog.author.name} fill sizes="28px" className="object-cover" />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{blog.author.name}</span>
                  </div>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
