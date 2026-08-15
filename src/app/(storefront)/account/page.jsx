'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  CreditCard,
  LogOut,
  Sparkles,
  ShieldCheck,
  Truck,
  Plus,
  Trash2,
  Edit2,
  Check,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Clock,
  Award
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

function AccountDashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'profile';

  const {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
    addresses,
    addAddress,
    deleteAddress,
    setDefaultAddress,
    orders,
  } = useAuth();

  const { wishlist, removeFromWishlist, moveToCart } = useWishlist();
  const [activeTab, setActiveTab] = useState(initialTab);

  // Profile Edit State
  const [profileName, setProfileName] = useState(user?.name || 'Alex Reynolds');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [profileSaved, setProfileSaved] = useState(false);

  // Add Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: '',
    street: '',
    city: '',
    state: 'CA',
    zip: '',
    country: 'United States',
    phone: '',
    type: 'Home',
    isDefault: false,
  });

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name: profileName, phone: profilePhone });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleCreateAddress = (e) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city) return;
    addAddress(newAddr);
    setShowAddAddress(false);
    setNewAddr({
      name: '',
      street: '',
      city: '',
      state: 'CA',
      zip: '',
      country: 'United States',
      phone: '',
      type: 'Home',
      isDefault: false,
    });
  };

  // If Not Authenticated, show Login / Demo Login View
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Account Access</h2>
        <p className="text-xs text-slate-500 mt-2">
          Please sign in to view your profile, active order shipments, saved addresses, and wishlist.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => login('alex.reynolds@example.com', 'password123')}
            className="w-full py-3.5 px-4 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" /> 1-Click Demo Login (Alex Reynolds)
          </button>
          <Link
            href="/auth/login"
            className="w-full py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50"
          >
            Standard Login
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
    { id: 'addresses', label: `Addresses (${addresses.length})`, icon: MapPin },
    { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
    { id: 'payments', label: 'Payment Cards', icon: CreditCard },
  ];

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'User Account' }]} />

        {/* User Hero Banner */}
        <div className="mt-4 mb-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-sky-400/50 shadow-md">
              <Image src={user.avatar} alt={user.name} fill sizes="80px" className="object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">{user.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-bold">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-slate-400 mt-1">Member since {user.joinDate}</p>
            </div>
          </div>

          {/* Reward Points Box */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/15">
            <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-300">CareZoon Rewards</span>
              <p className="text-lg font-black text-white">{user.rewardPoints} Pts</p>
            </div>
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </button>
              );
            })}

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Tab Content Panel (9 cols) */}
          <div className="lg:col-span-9 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            {/* 1. Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h2>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Email Verified
                  </span>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-4 max-w-lg">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-xs text-slate-400 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                    >
                      {profileSaved ? <Check className="w-4 h-4" /> : null}
                      <span>{profileSaved ? 'Profile Updated!' : 'Save Changes'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 2. Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Order History & Tracking</h2>
                  <span className="text-xs text-slate-400">{orders.length} total orders</span>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">{order.id}</span>
                          <span className="text-slate-400">• {order.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full font-bold text-[11px] ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300'
                            }`}
                          >
                            {order.status}
                          </span>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 text-slate-700 dark:text-slate-200"
                          >
                            Live Tracking
                          </button>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                <Image src={item.image || item.product?.image} alt={item.name} fill sizes="40px" className="object-cover" />
                              </div>
                              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                            </div>
                            <span className="font-bold text-slate-900 dark:text-white ml-2">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 text-xs font-bold">
                        <span className="text-slate-500">Carrier: {order.carrier}</span>
                        <span>Total: <strong className="text-sky-600 text-sm">${order.total?.toFixed(2)}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Shipping Addresses</h2>
                  <button
                    onClick={() => setShowAddAddress((prev) => !prev)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs shadow-sm hover:bg-sky-500"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add New Address
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <form
                    onSubmit={handleCreateAddress}
                    className="p-5 rounded-2xl border border-sky-500/40 bg-slate-50 dark:bg-slate-800/40 space-y-3 animate-slide-down"
                  >
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      New Shipping Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Recipient Name *"
                          value={newAddr.name}
                          onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Street Address *"
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="City *"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="ZIP Code *"
                          value={newAddr.zip}
                          onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                          className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs bg-white dark:bg-slate-900"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        addr.isDefault
                          ? 'border-sky-500 bg-sky-50/40 dark:bg-sky-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-sky-600" /> {addr.type}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-sky-600 bg-sky-100 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                            DEFAULT
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{addr.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{addr.street}</p>
                      <p className="text-xs text-slate-500">{addr.city}, {addr.state} {addr.zip}</p>
                      <p className="text-xs text-slate-400 mt-1">{addr.phone}</p>

                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        {!addr.isDefault && (
                          <button
                            onClick={() => setDefaultAddress(addr.id)}
                            className="font-bold text-sky-600 hover:underline text-[11px]"
                          >
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className="text-slate-400 hover:text-rose-500 ml-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Saved Wishlist</h2>
                  <span className="text-xs text-slate-400">{wishlist.length} saved products</span>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
                    <Link
                      href="/products"
                      className="mt-4 inline-block px-5 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {wishlist.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3">
                            <Image src={p.image} alt={p.name} fill sizes="160px" className="object-cover" />
                          </div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{p.name}</h4>
                          <p className="font-black text-sm text-sky-600 mt-1">${p.price.toFixed(2)}</p>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                          <button
                            onClick={() => moveToCart(p)}
                            className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(p.id)}
                            className="p-2 text-slate-400 hover:text-rose-500"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Payment Cards Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Saved Payment Methods</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-sky-950 to-indigo-950 text-white shadow-md space-y-4 border border-sky-500/30">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold tracking-widest text-sky-300">VISA</span>
                      <CreditCard className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="font-mono text-sm tracking-widest">•••• •••• •••• 8892</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase">
                      <span>Expires 08/28</span>
                      <span className="text-emerald-400 font-bold">Default Card</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Live Tracking Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  Order Tracking Timeline
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900"
                >
                  Close
                </button>
              </div>

              <div className="text-xs space-y-1">
                <p>Order ID: <strong className="font-mono">{selectedOrder.id}</strong></p>
                <p>Tracking #: <strong className="font-mono text-sky-600">{selectedOrder.trackingNumber}</strong></p>
                <p>Carrier: <strong>{selectedOrder.carrier}</strong></p>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4 pl-2 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                {selectedOrder.timeline?.map((stepItem, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div
                      className={`absolute -left-[17px] top-0.5 w-4 h-4 rounded-full border-2 ${
                        stepItem.done
                          ? 'bg-emerald-500 border-white ring-2 ring-emerald-500/20'
                          : 'bg-slate-300 dark:bg-slate-700 border-white'
                      }`}
                    />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">{stepItem.title}</h5>
                    <span className="text-[10px] text-slate-400">{stepItem.time}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                >
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountDashboardPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-sm font-semibold">Loading Dashboard...</div>}>
      <AccountDashboardContent />
    </Suspense>
  );
}
