'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, Share2, Sparkles, BookOpen } from 'lucide-react';
import { blogs } from '@/data/blogs';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { useToast } from '@/context/ToastContext';

export default function BlogDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { slug } = unwrappedParams;
  const { addToast } = useToast();

  const blog = blogs.find((b) => b.slug === slug);
  if (!blog) {
    notFound();
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Article link copied to clipboard!', 'success');
  };

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Blog', href: '/blog' }, { label: blog.title }]} />

        <article className="my-8 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold">
              {blog.category}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-slate-200 dark:border-slate-800 pb-4 text-xs text-slate-500">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                  <Image src={blog.author.avatar} alt={blog.author.name} fill sizes="40px" className="object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{blog.author.name}</h4>
                  <span>Editorial Contributor</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {blog.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {blog.readTime}
                </span>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1 text-sky-600 hover:underline font-bold"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative w-full aspect-16/9 rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
            <Image src={blog.image} alt={blog.title} fill sizes="1000px" className="object-cover" priority />
          </div>

          {/* Article Text Body */}
          <div className="prose dark:prose-invert max-w-none text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
            <p className="text-lg font-medium text-slate-900 dark:text-white leading-relaxed">
              {blog.excerpt}
            </p>
            <p>
              In our fast-paced modern world, the objects we interact with daily shape our environment, focus, and state of mind. Whether it is selecting high-fidelity sound gear that removes urban distraction or choosing natural solid oak furniture that anchors a room in organic calm, deliberate curation makes all the difference.
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white pt-4">
              Material Integrity & Everyday Function
            </h2>
            <p>
              When evaluating premium design, looks are only the opening chapter. Longevity and material integrity determine whether a product becomes a cherished daily staple or ends up in a landfill. That is why CareZoon prioritizes repairable architectures, aerospace-grade alloys, and certified organic textiles.
            </p>
          </div>

          {/* Footer Navigation */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-sky-600"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Journal
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md hover:bg-sky-500"
            >
              Explore Products in Article
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
