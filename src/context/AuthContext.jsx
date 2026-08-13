'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

const DEFAULT_USER = {
  id: 'usr-901',
  name: 'Alex Reynolds',
  email: 'alex.reynolds@example.com',
  phone: '+1 (555) 234-5678',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  role: 'Premium Member',
  joinDate: 'Jan 2025',
  rewardPoints: 1240,
};

const INITIAL_ADDRESSES = [
  {
    id: 'addr-1',
    isDefault: true,
    name: 'Alex Reynolds',
    street: '742 Evergreen Terrace',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107',
    country: 'United States',
    phone: '+1 (555) 234-5678',
    type: 'Home',
  },
  {
    id: 'addr-2',
    isDefault: false,
    name: 'Alex Reynolds (Work)',
    street: '100 Montgomery St, Suite 1400',
    city: 'San Francisco',
    state: 'CA',
    zip: '94104',
    country: 'United States',
    phone: '+1 (555) 987-6543',
    type: 'Office',
  },
];

const INITIAL_ORDERS = [
  {
    id: 'ORD-2026-9821',
    date: '2026-08-08',
    status: 'Delivered',
    trackingNumber: 'TRK-982187342US',
    carrier: 'DHL Express',
    total: 245.99,
    items: [
      {
        productId: 'prod-1',
        name: 'AuraStudio Pro ANC Wireless Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80',
        color: 'Midnight Black',
        size: 'Standard',
        price: 199.99,
        quantity: 1,
      },
      {
        productId: 'prod-4',
        name: 'Botanical Radiance Vitamin C Serum',
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=300&q=80',
        color: 'Standard',
        size: '30ml',
        price: 46.00,
        quantity: 1,
      },
    ],
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
    },
    timeline: [
      { title: 'Order Placed', time: 'Aug 08, 10:30 AM', done: true },
      { title: 'Payment Verified', time: 'Aug 08, 10:32 AM', done: true },
      { title: 'Dispatched from Hub', time: 'Aug 09, 08:15 AM', done: true },
      { title: 'Out for Delivery', time: 'Aug 10, 09:00 AM', done: true },
      { title: 'Delivered', time: 'Aug 10, 02:45 PM', done: true },
    ],
  },
  {
    id: 'ORD-2026-8714',
    date: '2026-08-01',
    status: 'Shipped',
    trackingNumber: 'TRK-871465221US',
    carrier: 'FedEx Priority',
    total: 149.50,
    items: [
      {
        productId: 'prod-2',
        name: 'Lumix Horizon Smart Fitness GPS Watch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80',
        color: 'Onyx Black',
        size: '44mm',
        price: 149.50,
        quantity: 1,
      },
    ],
    shippingAddress: {
      street: '742 Evergreen Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
    },
    timeline: [
      { title: 'Order Placed', time: 'Aug 01, 04:20 PM', done: true },
      { title: 'Payment Verified', time: 'Aug 01, 04:22 PM', done: true },
      { title: 'Dispatched from Hub', time: 'Aug 02, 11:00 AM', done: true },
      { title: 'In Transit', time: 'Aug 03, 01:15 PM', done: true },
      { title: 'Expected Delivery Tomorrow', time: 'Pending', done: false },
    ],
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState(INITIAL_ADDRESSES);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('carezoon_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Auto-login default demo user for frictionless review
        setUser(DEFAULT_USER);
      }
      const storedAddr = localStorage.getItem('carezoon_addresses');
      if (storedAddr) {
        setAddresses(JSON.parse(storedAddr));
      }
      const storedOrders = localStorage.getItem('carezoon_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }
    } catch (e) {
      console.error(e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (user) {
        localStorage.setItem('carezoon_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('carezoon_user');
      }
      localStorage.setItem('carezoon_addresses', JSON.stringify(addresses));
      localStorage.setItem('carezoon_orders', JSON.stringify(orders));
    }
  }, [user, addresses, orders, mounted]);

  const login = useCallback(
    (email, password) => {
      const mockUser = {
        ...DEFAULT_USER,
        email: email || DEFAULT_USER.email,
        name: email ? email.split('@')[0] : DEFAULT_USER.name,
      };
      setUser(mockUser);
      addToast(`Welcome back, ${mockUser.name}!`, 'success');
      return true;
    },
    [addToast]
  );

  const signup = useCallback(
    (name, email) => {
      const newUser = {
        ...DEFAULT_USER,
        id: `usr-${Date.now()}`,
        name: name || 'Valued Shopper',
        email: email || 'shopper@carezoon.com',
      };
      setUser(newUser);
      addToast(`Account created successfully! Welcome to CareZoon, ${newUser.name}.`, 'success');
      return true;
    },
    [addToast]
  );

  const logout = useCallback(() => {
    setUser(null);
    addToast('You have been logged out safely', 'info');
  }, [addToast]);

  const updateProfile = useCallback(
    (updatedFields) => {
      setUser((prev) => {
        const next = { ...prev, ...updatedFields };
        return next;
      });
      addToast('Profile updated successfully!', 'success');
    },
    [addToast]
  );

  const addAddress = useCallback(
    (newAddr) => {
      const id = `addr-${Date.now()}`;
      const isFirst = addresses.length === 0;
      const addrObj = {
        ...newAddr,
        id,
        isDefault: newAddr.isDefault || isFirst,
      };

      setAddresses((prev) => {
        if (addrObj.isDefault) {
          return [...prev.map((a) => ({ ...a, isDefault: false })), addrObj];
        }
        return [...prev, addrObj];
      });
      addToast('Shipping address saved!', 'success');
    },
    [addresses.length, addToast]
  );

  const deleteAddress = useCallback(
    (id) => {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      addToast('Address removed', 'info');
    },
    [addToast]
  );

  const setDefaultAddress = useCallback(
    (id) => {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      addToast('Default address updated', 'success');
    },
    [addToast]
  );

  const addOrder = useCallback((orderData) => {
    const newOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(100000000 + Math.random() * 900000000)}US`,
      carrier: 'DHL Express',
      ...orderData,
      timeline: [
        { title: 'Order Placed', time: 'Just now', done: true },
        { title: 'Payment Confirmed', time: 'Just now', done: true },
        { title: 'Packaging & Warehouse Allocation', time: 'In progress', done: false },
        { title: 'Carrier Dispatch', time: 'Pending', done: false },
        { title: 'Estimated Delivery (2-3 days)', time: 'Pending', done: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
        addresses,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        addOrder,
        mounted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
