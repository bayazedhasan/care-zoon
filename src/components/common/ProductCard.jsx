'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, ShoppingBag, Check, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useModal } from '@/context/ModalContext';
import RatingStars from './RatingStars';

export default function ProductCard({ product, viewMode = 'grid' }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView } = useModal();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0] ? product.colors[0].name : null
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const secondaryImage =
    product.images && product.images.length > 1 ? product.images[1] : product.image;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, selectedColor, product.sizes?.[0] || 'Standard');
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  if (viewMode === 'list') {
    return (
      <div className="group flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Product Image */}
        <div className="relative w-full sm:w-56 h-56 shrink-0 overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </Link>
          {/* Badge */}
          {product.discountPercentage > 0 && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white bg-rose-600 rounded-full shadow">
              -{product.discountPercentage}%
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between w-full">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="uppercase tracking-wider font-semibold text-sky-600 dark:text-sky-400">
                {product.brand}
              </span>
              <span className="capitalize">{product.categoryName || product.category}</span>
            </div>

            <Link href={`/products/${product.id}`}>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                {product.name}
              </h3>
            </Link>

            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-2">
              {product.shortDescription || product.description}
            </p>

            <div className="mt-3">
              <RatingStars rating={product.rating} reviewCount={product.reviewCount} />
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleWishlistClick}
                className={`p-2.5 rounded-xl border transition-all ${
                  inWishlist
                    ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
                title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <button
                onClick={handleQuickViewClick}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="Quick View"
              >
                <Eye className="w-5 h-5" />
              </button>

              <button
                onClick={handleQuickAdd}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" /> Added!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" /> Add to Cart
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image & Quick Action Overlay */}
      <div className="relative w-full aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800/60">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={isHovered && secondaryImage ? secondaryImage : product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        </Link>

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="px-2.5 py-1 text-[11px] font-bold text-white bg-rose-600 rounded-full shadow-sm">
              -{product.discountPercentage}%
            </span>
          )}
          {product.isNew && (
            <span className="px-2.5 py-0.5 text-[11px] font-bold text-sky-900 bg-sky-100 dark:bg-sky-950 dark:text-sky-300 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {product.isBestSeller && !product.isNew && (
            <span className="px-2.5 py-0.5 text-[11px] font-bold text-amber-900 bg-amber-100 dark:bg-amber-950 dark:text-amber-300 rounded-full shadow-sm">
              HOT
            </span>
          )}
        </div>

        {/* Floating Quick Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          <button
            onClick={handleWishlistClick}
            className={`p-2 rounded-full backdrop-blur-md transition-all duration-200 shadow-md ${
              inWishlist
                ? 'bg-rose-500 text-white'
                : 'bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:text-rose-500 dark:hover:text-rose-400'
            }`}
            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={handleQuickViewClick}
            className="p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 backdrop-blur-md hover:text-sky-600 dark:hover:text-sky-400 transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
            title="Quick View"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Slide-Up Quick Add to Cart button on desktop hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:block opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900/95 dark:bg-sky-600 dark:hover:bg-sky-500 hover:bg-slate-800 text-white text-xs font-semibold backdrop-blur-md shadow-lg transition-colors active:scale-95"
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" /> Added to Cart!
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Details Container */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-sky-600 dark:text-sky-400">
              {product.brand}
            </span>
            <span className="text-[11px] capitalize">{product.category}</span>
          </div>

          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="sm" />
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] font-medium text-rose-500">
                Only {product.stock} left
              </span>
            )}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Mobile only quick add */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-lg bg-sky-600 text-white shadow-sm active:scale-90 transition-transform"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>

          {/* Color swatch previews on desktop */}
          {product.colors && product.colors.length > 1 && (
            <div className="hidden sm:flex items-center gap-1">
              {product.colors.slice(0, 3).map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedColor(c.name);
                  }}
                  className={`w-3.5 h-3.5 rounded-full border border-white dark:border-slate-800 transition-transform ${
                    selectedColor === c.name ? 'scale-125 ring-1 ring-sky-500' : 'opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
              {product.colors.length > 3 && (
                <span className="text-[10px] text-slate-400">+{product.colors.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
