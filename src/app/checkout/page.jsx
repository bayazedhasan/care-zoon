'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Check,
  ChevronRight,
  Lock,
  ArrowRight,
  Sparkles,
  MapPin,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discountAmount, shipping, tax, total, coupon, clearCart } = useCart();
  const { user, addresses, addOrder } = useAuth();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Delivery, 3: Payment, 4: Review

  // Form States
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.name ? user.name.split(' ')[0] : 'Alex',
    lastName: user?.name ? user.name.split(' ')[1] || 'Shopper' : 'Reynolds',
    phone: user?.phone || '+1 (555) 234-5678',
    street: addresses[0]?.street || '742 Evergreen Terrace',
    city: addresses[0]?.city || 'San Francisco',
    state: addresses[0]?.state || 'CA',
    zip: addresses[0]?.zip || '94107',
    country: 'United States',
    saveAddress: true,
  });

  const [shippingMethod, setShippingMethod] = useState('express'); // 'standard' | 'express' | 'overnight'
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'paypal' | 'applepay' | 'cod'

  const [cardData, setCardData] = useState({
    number: '4532 •••• •••• 8892',
    name: user?.name || 'ALEX REYNOLDS',
    expiry: '08/28',
    cvv: '842',
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      addToast('Your cart is empty!', 'error');
      router.push('/products');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const newOrder = addOrder({
        total,
        subtotal,
        discountAmount,
        shipping,
        tax,
        couponCode: coupon?.code || null,
        items: cart,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
          phone: formData.phone,
        },
        paymentMethod:
          paymentMethod === 'card'
            ? 'Credit Card (Visa ending in 8892)'
            : paymentMethod === 'paypal'
            ? 'PayPal Express'
            : paymentMethod === 'applepay'
            ? 'Apple Pay'
            : 'Cash on Delivery (COD)',
      });

      clearCart();
      setIsProcessing(false);
      router.push(`/checkout/success?orderId=${newOrder.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-24 px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Cart is Empty</h2>
        <p className="text-sm text-slate-500 mt-2">Add items to your cart before proceeding to checkout.</p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />

        {/* Checkout Stepper Progress */}
        <div className="my-8 max-w-3xl mx-auto">
          <div className="flex items-center justify-between relative">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 dark:bg-slate-800 z-0" />

            {[
              { num: 1, label: 'Shipping' },
              { num: 2, label: 'Delivery' },
              { num: 3, label: 'Payment' },
              { num: 4, label: 'Review' },
            ].map((s) => (
              <button
                key={s.num}
                onClick={() => setStep(s.num)}
                className="relative z-10 flex flex-col items-center gap-1.5 focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    step === s.num
                      ? 'bg-sky-600 text-white ring-4 ring-sky-500/20 shadow-md scale-110'
                      : step > s.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-400 border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    step === s.num
                      ? 'text-sky-600 dark:text-sky-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Form Steps vs Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Step Panels Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            {/* STEP 1: Shipping Info */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-sky-600" />
                    <span>Shipping Address & Contact</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      value={formData.street}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        required
                        value={formData.zip}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number (for courier SMS updates) *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all"
                  >
                    <span>Continue to Delivery</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Delivery Method */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Truck className="w-5 h-5 text-sky-600" />
                    <span>Select Delivery Method</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 2 of 4</span>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      id: 'express',
                      title: 'DHL Express Tracked (Recommended)',
                      desc: 'Estimated delivery in 2-3 business days with live SMS tracking',
                      price: shipping === 0 ? 'FREE' : '$4.99',
                    },
                    {
                      id: 'standard',
                      title: 'Standard Ground Delivery',
                      desc: 'Estimated delivery in 4-6 business days',
                      price: 'FREE',
                    },
                    {
                      id: 'overnight',
                      title: 'Priority Overnight Air',
                      desc: 'Delivers on the next business morning before 10:30 AM',
                      price: '$14.99',
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      onClick={() => setShippingMethod(method.id)}
                      className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                        shippingMethod === method.id
                          ? 'border-sky-600 bg-sky-50/50 dark:bg-sky-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          checked={shippingMethod === method.id}
                          onChange={() => setShippingMethod(method.id)}
                          className="w-4 h-4 text-sky-600"
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                            {method.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">{method.desc}</p>
                        </div>
                      </div>
                      <span className="font-bold text-xs text-sky-600 dark:text-sky-400">
                        {method.price}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Shipping
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30"
                  >
                    <span>Continue to Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Payment Method & Interactive Card */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-sky-600" />
                    <span>Payment Selection</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 3 of 4</span>
                </div>

                {/* Method Radios */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'card', label: 'Credit Card', icon: CreditCard },
                    { id: 'paypal', label: 'PayPal', icon: ShieldCheck },
                    { id: 'applepay', label: 'Apple Pay', icon: Sparkles },
                    { id: 'cod', label: 'Cash on Del.', icon: Truck },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === m.id
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/50 text-sky-600 font-bold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <m.icon className="w-5 h-5" />
                      <span className="text-xs">{m.label}</span>
                    </button>
                  ))}
                </div>

                {/* Interactive Card Form */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 pt-2">
                    {/* Simulated Credit Card Preview */}
                    <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-sky-950 to-indigo-950 text-white shadow-xl max-w-sm mx-auto space-y-4 border border-sky-500/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold tracking-widest text-sky-300">CareZoon VIP</span>
                        <CreditCard className="w-6 h-6 text-amber-400" />
                      </div>
                      <div className="font-mono text-base tracking-widest text-slate-200 py-1">
                        {cardData.number}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 uppercase">
                        <div>
                          <span className="block text-[9px]">Card Holder</span>
                          <span className="font-bold text-white tracking-wider">{cardData.name}</span>
                        </div>
                        <div>
                          <span className="block text-[9px]">Expires</span>
                          <span className="font-bold text-white">{cardData.expiry}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Expiration Date
                        </label>
                        <input
                          type="text"
                          value={cardData.expiry}
                          onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Security CVV
                        </label>
                        <input
                          type="password"
                          value={cardData.cvv}
                          onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod !== 'card' && (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
                    You have selected <strong>{paymentMethod.toUpperCase()}</strong>. You will be redirected securely to complete authorization.
                  </div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30"
                  >
                    <span>Review Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review & Place Order */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span>Final Review & Confirmation</span>
                  </h2>
                  <span className="text-xs text-slate-400">Step 4 of 4</span>
                </div>

                {/* Summary Recap Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                      <span>Shipping Address</span>
                      <button onClick={() => setStep(1)} className="text-sky-600 hover:underline">Edit</button>
                    </div>
                    <p className="font-semibold">{formData.firstName} {formData.lastName}</p>
                    <p>{formData.street}</p>
                    <p>{formData.city}, {formData.state} {formData.zip}</p>
                    <p className="text-slate-400">{formData.phone}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-1">
                      <span>Payment & Delivery</span>
                      <button onClick={() => setStep(3)} className="text-sky-600 hover:underline">Edit</button>
                    </div>
                    <p>Method: <strong>{paymentMethod.toUpperCase()}</strong></p>
                    <p>Carrier: <strong>DHL Express Priority</strong></p>
                    <p className="text-emerald-600 font-semibold">256-Bit SSL Secure</p>
                  </div>
                </div>

                {/* Line Items Mini Table */}
                <div className="pt-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">
                    Purchasing Items ({cart.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div
                        key={item.cartItemId}
                        className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                            <Image src={item.product.image} alt={item.product.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div className="truncate">
                            <p className="font-bold text-slate-900 dark:text-white truncate">{item.product.name}</p>
                            <p className="text-[11px] text-slate-400">Qty: {item.quantity} • {item.color}</p>
                          </div>
                        </div>
                        <span className="font-black text-slate-900 dark:text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Place Order CTA */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Payment
                  </button>

                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-emerald-600/30 transition-all active:scale-98"
                  >
                    {isProcessing ? (
                      <span>Processing Secure Order...</span>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Place Order — ${total.toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Order Summary Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
              <h3 className="font-black text-slate-900 dark:text-white text-base">Order Summary</h3>

              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({coupon?.code})</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <strong className="text-emerald-500">FREE</strong> : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Sales Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-base font-black text-slate-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-2xl text-sky-600 dark:text-sky-400">${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Guaranteed Safe & Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
