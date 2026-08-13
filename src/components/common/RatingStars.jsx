'use client';

import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 5, reviewCount, size = 'sm', showScore = true }) {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-amber-400">
        {stars.map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;

          return (
            <div key={star} className="relative">
              <Star
                className={`${sizeClass} ${
                  filled
                    ? 'fill-amber-400 text-amber-400'
                    : half
                    ? 'fill-amber-400/50 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </div>
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-0.5">
          {rating.toFixed(1)}
        </span>
      )}
      {typeof reviewCount === 'number' && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          ({reviewCount})
        </span>
      )}
    </div>
  );
}
