'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Heart, ShoppingBag, Check, Star, ShieldCheck, ArrowRight, Truck } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import RatingStars from './RatingStars';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView } = useModal();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setSelectedImage(quickViewProduct.image);
      setSelectedColor(quickViewProduct.colors?.[0]?.name || null);
      setSelectedSize(quickViewProduct.sizes?.[0] || null);
      setQuantity(1);
      setAdded(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [quickViewProduct]);

  if (!quickViewProduct) return null;

  const inWishlist = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = quickViewProduct.images?.length ? quickViewProduct.images : [quickViewProduct.image];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors z-20"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Gallery Column */}
          <div className="flex flex-col gap-4">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800">
              <Image
                src={selectedImage || quickViewProduct.image}
                alt={quickViewProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover"
              />
              {quickViewProduct.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white bg-rose-600 rounded-full shadow">
                  Save {quickViewProduct.discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedImage === img
                        ? 'border-sky-500 shadow-md ring-2 ring-sky-500/20'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="thumbnail" fill sizes="64px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {quickViewProduct.brand}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> In Stock ({quickViewProduct.stock})
              </span>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
              {quickViewProduct.name}
            </h2>

            <div className="mt-2.5 flex items-center gap-3">
              <RatingStars rating={quickViewProduct.rating} reviewCount={quickViewProduct.reviewCount} />
              <span className="text-xs text-slate-400">|</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">SKU: {quickViewProduct.sku}</span>
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${quickViewProduct.price.toFixed(2)}
              </span>
              {quickViewProduct.originalPrice > quickViewProduct.price && (
                <span className="text-lg text-slate-400 line-through">
                  ${quickViewProduct.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {quickViewProduct.shortDescription || quickViewProduct.description}
            </p>

            {/* Colors */}
            {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
              <div className="mt-5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Color: <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-2">
                  {quickViewProduct.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        selectedColor === c.name
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {quickViewProduct.sizes && quickViewProduct.sizes.length > 1 && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Size / Option: <span className="text-sky-600 dark:text-sky-400 font-bold">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.sizes.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                        selectedSize === s
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2.5 font-bold text-sm text-slate-900 dark:text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(quickViewProduct.stock || 10, quantity + 1))}
                    className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/25 active:scale-95 transition-all"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Cart!
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Cart — ${(quickViewProduct.price * quantity).toFixed(2)}
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(quickViewProduct)}
                  className={`p-3 rounded-xl border transition-all ${
                    inWishlist
                      ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-sky-500" /> Free shipping on orders over $99
                </span>
                <Link
                  href={`/products/${quickViewProduct.id}`}
                  onClick={closeQuickView}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
                >
                  Full Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
