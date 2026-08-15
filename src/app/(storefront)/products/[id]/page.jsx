'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, notFound } from 'next/navigation';
import {
  Heart,
  ShoppingBag,
  Zap,
  Check,
  Star,
  ShieldCheck,
  Truck,
  RefreshCw,
  Share2,
  Copy,
  ChevronRight,
  Info,
  Award,
  ThumbsUp,
  MessageSquare
} from 'lucide-react';
import { products } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import RatingStars from '@/components/common/RatingStars';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/common/ProductCard';

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const router = useRouter();

  const product = products.find((p) => p.id === id || p.slug === id);
  if (!product) {
    notFound();
  }

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToast } = useToast();

  const [activeImage, setActiveImage] = useState(product.image);
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors[0] ? product.colors[0].name : null
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes[0] ? product.sizes[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);

  // Review submission state
  const [reviewsList, setReviewsList] = useState(product.reviews || []);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  // Recently Viewed tracking
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carezoon_recent');
      let recent = stored ? JSON.parse(stored) : [];
      recent = recent.filter((p) => p.id !== product.id);
      recent.unshift(product);
      recent = recent.slice(0, 5);
      localStorage.setItem('carezoon_recent', JSON.stringify(recent));
      setRecentlyViewed(recent.filter((p) => p.id !== product.id).slice(0, 4));
    } catch (e) {
      console.error(e);
    }
  }, [product]);

  const inWishlist = isInWishlist(product.id);
  const galleryImages = product.images?.length ? product.images : [product.image];

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize, false);
    router.push('/checkout');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast('Product link copied to clipboard!', 'success');
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) {
      addToast('Please complete all required fields.', 'error');
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newReviewAuthor)}&background=0284c7&color=fff`,
      rating: newReviewRating,
      date: new Date().toISOString().split('T')[0],
      title: newReviewTitle || 'Great product!',
      comment: newReviewComment,
      verified: true,
      helpfulCount: 0,
    };
    setReviewsList([newRev, ...reviewsList]);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    setShowReviewForm(false);
    addToast('Review submitted for verification. Thank you!', 'success');
  };

  // Related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumbs
          items={[
            { label: 'Shop', href: '/products' },
            { label: product.categoryName || product.category, href: `/category/${product.category}` },
            { label: product.name },
          ]}
        />

        {/* Product Details Main Grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Gallery Column (5 cols) */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:w-20 shrink-0">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-16 sm:w-20 aspect-square rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImage === img
                        ? 'border-sky-600 ring-2 ring-sky-500/20 shadow-md scale-102'
                        : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-square rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md group">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Discount Badge */}
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-rose-600 text-white font-extrabold text-xs shadow-lg">
                  SAVE {product.discountPercentage}%
                </span>
              )}

              {/* Stock status chip */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-emerald-600 dark:text-emerald-400 text-xs font-bold shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" /> In Stock ({product.stock} left)
                </span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Actions (7 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Brand & Category */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Link
                  href={`/products?brand=${encodeURIComponent(product.brand)}`}
                  className="font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 hover:underline"
                >
                  {product.brand}
                </Link>
                <span className="font-mono text-slate-400">SKU: {product.sku}</span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review counter */}
              <div className="mt-3 flex items-center gap-4">
                <RatingStars rating={product.rating} reviewCount={product.reviewCount} size="md" />
                <span className="text-xs text-slate-400">|</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  98% Recommended by Buyers
                </span>
              </div>

              {/* Price Calculation Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-slate-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 font-bold text-xs">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Short description */}
              <p className="mt-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.shortDescription || product.description}
              </p>

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-6">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5">
                    Color: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2.5">
                    {product.colors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color.name)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          selectedColor === color.name
                            ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 shadow-sm ring-1 ring-sky-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span>{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size / Variant Selector */}
              {product.sizes && product.sizes.length > 1 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Select Option: <span className="text-sky-600 dark:text-sky-400 font-extrabold">{selectedSize}</span>
                    </label>
                    <span className="text-xs text-sky-600 dark:text-sky-400 hover:underline cursor-pointer">
                      Size & Fitting Guide
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                          selectedSize === s
                            ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-900 dark:text-sky-200 shadow-sm ring-1 ring-sky-600'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Counter & Primary Actions */}
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3.5">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-3 font-bold text-sm text-slate-900 dark:text-white min-w-[3rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                      className="px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-xl shadow-sky-600/25 active:scale-98 transition-all"
                  >
                    {added ? (
                      <>
                        <Check className="w-5 h-5" /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
                      </>
                    )}
                  </button>

                  {/* Wishlist Toggle Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      inWishlist
                        ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/50 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Share link"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Buy Now Direct Button */}
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm shadow-md transition-all active:scale-98"
                >
                  ⚡ Buy Now (Instant Checkout)
                </button>
              </div>

              {/* Value Assurances Box */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">30-Day Free Returns</span>
                </div>
                <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300">2-Year Full Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs: Description, Specs, Reviews, Shipping */}
        <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
          {/* Tab Navigation Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'description', label: 'Detailed Description' },
              { id: 'specifications', label: 'Technical Specifications' },
              { id: 'reviews', label: `Customer Reviews (${reviewsList.length})` },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab 1: Description */}
          {activeTab === 'description' && (
            <div className="py-8 max-w-4xl space-y-6 animate-fade-in text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
              <p>{product.description}</p>
              {product.features && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Key Features & Highlights
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Specifications */}
          {activeTab === 'specifications' && (
            <div className="py-8 max-w-3xl animate-fade-in">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-xs sm:text-sm text-left">
                  <tbody>
                    {product.specifications &&
                      Object.entries(product.specifications).map(([key, value], idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? 'bg-slate-50 dark:bg-slate-900/60' : 'bg-white dark:bg-slate-900'}
                        >
                          <td className="p-4 font-bold text-slate-900 dark:text-white w-1/3 border-b border-slate-200/60 dark:border-slate-800">
                            {key}
                          </td>
                          <td className="p-4 text-slate-600 dark:text-slate-300 border-b border-slate-200/60 dark:border-slate-800">
                            {value}
                          </td>
                        </tr>
                      ))}
                    <tr className="bg-slate-50 dark:bg-slate-900/60">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">Brand</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{product.brand}</td>
                    </tr>
                    <tr className="bg-white dark:bg-slate-900">
                      <td className="p-4 font-bold text-slate-900 dark:text-white">SKU</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300">{product.sku}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab 3: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="py-8 max-w-4xl animate-fade-in space-y-8">
              {/* Rating Summary Header */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{product.rating}</span>
                    <RatingStars rating={product.rating} size="md" showScore={false} />
                    <span className="text-xs text-slate-400 mt-1 block">Based on {reviewsList.length + 30} reviews</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowReviewForm((prev) => !prev)}
                  className="px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Write a Customer Review
                </button>
              </div>

              {/* Review Submission Form Modal / Box */}
              {showReviewForm && (
                <form
                  onSubmit={handleAddReview}
                  className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-sky-500/40 shadow-xl space-y-4 animate-slide-down"
                >
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">Submit Your Review</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        placeholder="e.g. Alex M."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Star Rating
                      </label>
                      <select
                        value={newReviewRating}
                        onChange={(e) => setNewReviewRating(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="5">★★★★★ 5 Stars (Excellent)</option>
                        <option value="4">★★★★☆ 4 Stars (Good)</option>
                        <option value="3">★★★☆☆ 3 Stars (Average)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      value={newReviewTitle}
                      onChange={(e) => setNewReviewTitle(e.target.value)}
                      placeholder="e.g. Best headphones I have ever bought!"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Your Detailed Feedback *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="Tell us what you liked or how it performed..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-md"
                    >
                      Publish Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.length > 0 ? (
                  reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                            <Image src={rev.avatar} alt={rev.author} fill sizes="36px" className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rev.author}</h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                              <span>{rev.date}</span>
                              {rev.verified && (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                  • <ShieldCheck className="w-3 h-3 inline" /> Verified Buyer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <RatingStars rating={rev.rating} size="sm" showScore={false} />
                      </div>

                      {rev.title && (
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white">{rev.title}</h5>
                      )}

                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="pt-2 flex items-center gap-4 text-xs text-slate-400">
                        <button className="flex items-center gap-1 hover:text-sky-600 transition-colors">
                          <ThumbsUp className="w-3.5 h-3.5" /> Helpful ({rev.helpfulCount || 0})
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No reviews yet. Be the first to share your experience!</p>
                )}
              </div>
            </div>
          )}

          {/* Tab 4: Shipping & Returns */}
          {activeTab === 'shipping' && (
            <div className="py-8 max-w-3xl space-y-4 animate-fade-in text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-sky-500" /> Free Global Express Shipping
                </h4>
                <p>
                  Orders over $99 qualify for Free Express Shipping via DHL / FedEx Priority. In-stock orders are packed and dispatched within 24 hours of placement.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-emerald-500" /> 30-Day Hassle-Free Returns
                </h4>
                <p>
                  If you are not completely thrilled with your purchase, initiate a return from your dashboard within 30 days of receipt for an immediate full refund or exchange.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  You Might Also Like
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Similar premium gear in {product.categoryName || product.category}
                </p>
              </div>
              <Link
                href={`/category/${product.category}`}
                className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products */}
        {recentlyViewed.length > 0 && (
          <section className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
              Recently Viewed Items
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {recentlyViewed.map((rec) => (
                <ProductCard key={rec.id} product={rec} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
