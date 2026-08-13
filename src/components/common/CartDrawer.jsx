'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Tag, ShieldCheck, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { products } from '@/data/products';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    total,
    shipping,
    discountAmount,
    coupon,
    applyCoupon,
    removeCoupon,
    freeShippingProgress,
    freeShippingRemaining,
    totalItems,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput) return;
    const res = applyCoupon(couponInput);
    setCouponMsg(res.message);
    setCouponInput('');
  };

  const upsellProducts = products
    .filter((p) => !cart.some((item) => item.productId === p.id))
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Your Cart</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-sky-400">
                <Truck className="w-4 h-4" />
                {freeShippingRemaining > 0 ? (
                  <>
                    Add <span className="font-bold">${freeShippingRemaining.toFixed(2)}</span> more for Free Shipping
                  </>
                ) : (
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    You unlocked Free Express Shipping! 🎉
                  </span>
                )}
              </span>
              <span>{Math.round(freeShippingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-4">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-lg">Your cart is empty</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
                  Looks like you haven&apos;t added any items to your shopping cart yet.
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.cartItemId}
                      className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/40 shadow-sm"
                    >
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{item.color}</span>
                          {item.size && item.size !== 'Standard' && <span>• {item.size}</span>}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>

                          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Promo Code Input */}
                <div className="pt-2">
                  {coupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs">
                      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <Tag className="w-3.5 h-3.5" />
                        <span>{coupon.label} ({coupon.code})</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-slate-400 hover:text-rose-500 font-medium ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="Coupon: SAVE20"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
                      />
                      <button
                        type="submit"
                        className="px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                </div>

                {/* Frequently Bought Together Upsells */}
                {upsellProducts.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                      Recommended for You
                    </h5>
                    <div className="space-y-2">
                      {upsellProducts.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                              <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="truncate">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{p.name}</p>
                              <p className="text-sky-600 dark:text-sky-400 font-bold">${p.price.toFixed(2)}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              useCart().addToCart(p, 1);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-medium hover:bg-sky-700 shrink-0 text-[11px]"
                          >
                            + Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer & Checkout summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-sm font-bold text-slate-900 dark:text-white">
                  <span>Estimated Total</span>
                  <span className="text-base text-sky-600 dark:text-sky-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-lg shadow-sky-600/20 active:scale-98 transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  View Full Shopping Cart
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>256-Bit Bank Level Encryption</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
