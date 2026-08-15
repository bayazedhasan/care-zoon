'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Tag,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import ProductCard from '@/components/common/ProductCard';

export default function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shipping,
    tax,
    total,
    coupon,
    applyCoupon,
    removeCoupon,
    freeShippingProgress,
    freeShippingRemaining,
    totalItems,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode) return;
    const res = applyCoupon(couponCode);
    setCouponMsg(res.message);
    setCouponCode('');
  };

  const upsellProducts = products
    .filter((p) => !cart.some((c) => c.productId === p.id))
    .slice(0, 4);

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Shopping Cart' }]} />

        <div className="mt-4 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Shopping Cart
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              You have <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> items in your cart
            </p>
          </div>

          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Shopping Cart
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-10 h-10 stroke-1" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your cart is empty</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              Explore our wide collection of premium electronics, fashion, home essentials, and lifestyle gear.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm shadow-lg shadow-sky-600/30 transition-all"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Line Items Table & Upsells (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Free Shipping Progress Indicator */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-2">
                  <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                    <Truck className="w-4 h-4" />
                    {freeShippingRemaining > 0 ? (
                      <>
                        Add <span className="text-amber-500">${freeShippingRemaining.toFixed(2)}</span> more to qualify for FREE Express Shipping!
                      </>
                    ) : (
                      <span className="text-emerald-500 font-black">
                        Congratulations! You unlocked FREE Express Delivery! 🎉
                      </span>
                    )}
                  </span>
                  <span>{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
                {cart.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Thumbnail + Info */}
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                          {item.product.brand}
                        </span>
                        <Link
                          href={`/products/${item.productId}`}
                          className="block text-sm font-bold text-slate-900 dark:text-white truncate hover:text-sky-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                          <span>Variant: <strong>{item.color}</strong></span>
                          {item.size && item.size !== 'Standard' && <span>• Size: <strong>{item.size}</strong></span>}
                        </div>
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block sm:hidden mt-1">
                          ${item.price.toFixed(2)} each
                        </span>
                      </div>
                    </div>

                    {/* Quantity & Pricing Controls */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      {/* Quantity modifier */}
                      <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-bold text-slate-900 dark:text-white min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right min-w-[80px]">
                        <span className="text-base font-black text-slate-900 dark:text-white block">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[11px] text-slate-400 hidden sm:block">
                          ${item.price.toFixed(2)} / unit
                        </span>
                      </div>

                      {/* Delete item button */}
                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                        title="Remove item"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Back */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Continue Browsing Products
                </Link>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-5 sticky top-24">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Order Summary</h3>

                {/* Subtotals & Breakdown */}
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
                      <span>Discount ({coupon?.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Estimated Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-500 font-bold">FREE Express</span>
                      ) : (
                        `$${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-baseline justify-between text-base font-black text-slate-900 dark:text-white">
                    <span>Grand Total</span>
                    <span className="text-2xl text-sky-600 dark:text-sky-400">${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Coupon Code Applicator */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  {coupon ? (
                    <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                        <Tag className="w-4 h-4" />
                        <span>{coupon.label} ({coupon.code})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-slate-400 hover:text-rose-500 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon: SAVE20"
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-bold transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Proceed to Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-xl shadow-sky-600/30 active:scale-98 transition-all"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Trust Assurances */}
                <div className="pt-2 flex flex-col gap-2 text-[11px] text-slate-400 text-center">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-500 font-semibold">
                    <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Checkout
                  </div>
                  <p>30-Day Money Back Guarantee • Free Express Returns</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upsell Recommendations Grid */}
        {upsellProducts.length > 0 && (
          <section className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6">
              Frequently Added with These Items
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {upsellProducts.map((up) => (
                <ProductCard key={up.id} product={up} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
