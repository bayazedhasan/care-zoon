'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-sm text-slate-500 dark:text-slate-400">
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <li className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="text-xs sm:text-sm font-medium">Home</span>
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5 sm:gap-2">
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              {isLast || !item.href ? (
                <span className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-xs sm:text-sm font-medium hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
