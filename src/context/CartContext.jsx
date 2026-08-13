'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

const VALID_COUPONS = {
  SAVE20: { code: 'SAVE20', discountPercent: 20, label: '20% OFF Everything' },
  WELCOME10: { code: 'WELCOME10', discountPercent: 10, label: '10% OFF Welcome Bonus' },
  FREESHIP: { code: 'FREESHIP', freeShipping: true, label: 'Free Express Shipping' },
  CARE50: { code: 'CARE50', discountPercent: 50, label: '50% VIP Flash Code' },
};

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [coupon, setCoupon] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();

  // Load from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('carezoon_cart');
      if (stored) {
        setCart(JSON.parse(stored));
      }
      const storedCoupon = localStorage.getItem('carezoon_coupon');
      if (storedCoupon) {
        setCoupon(JSON.parse(storedCoupon));
      }
    } catch (e) {
      console.error('Failed to parse cart storage', e);
    }
    setMounted(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('carezoon_cart', JSON.stringify(cart));
    }
  }, [cart, mounted]);

  useEffect(() => {
    if (mounted) {
      if (coupon) {
        localStorage.setItem('carezoon_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('carezoon_coupon');
      }
    }
  }, [coupon, mounted]);

  const addToCart = useCallback((product, quantity = 1, selectedColor = null, selectedSize = null, showNotification = true) => {
    const color = selectedColor || (product.colors && product.colors[0]?.name) || 'Default';
    const size = selectedSize || (product.sizes && product.sizes[0]) || 'Standard';
    const cartItemId = `${product.id}-${color}-${size}`;

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            cartItemId,
            productId: product.id,
            product,
            color,
            size,
            price: product.price,
            quantity,
          },
        ];
      }
    });

    if (showNotification) {
      addToast(`Added "${product.name}" to your cart!`, 'success');
    }
  }, [addToast]);

  const updateQuantity = useCallback((cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );
  }, []);

  const removeFromCart = useCallback((cartItemId) => {
    setCart((prev) => {
      const itemToRemove = prev.find((item) => item.cartItemId === cartItemId);
      if (itemToRemove) {
        addToast(`Removed "${itemToRemove.product.name}" from cart`, 'info');
      }
      return prev.filter((item) => item.cartItemId !== cartItemId);
    });
  }, [addToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    setCoupon(null);
  }, []);

  const applyCoupon = useCallback((code) => {
    const upper = code.trim().toUpperCase();
    if (VALID_COUPONS[upper]) {
      setCoupon(VALID_COUPONS[upper]);
      addToast(`Coupon "${upper}" applied successfully!`, 'success');
      return { success: true, message: `Coupon applied: ${VALID_COUPONS[upper].label}` };
    } else {
      addToast(`Invalid promo code "${code}". Try code: SAVE20`, 'error');
      return { success: false, message: 'Invalid promo code. Try SAVE20' };
    }
  }, [addToast]);

  const removeCoupon = useCallback(() => {
    setCoupon(null);
    addToast('Coupon removed', 'info');
  }, [addToast]);

  // Calculations
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountPercent = coupon?.discountPercent || 0;
  const discountAmount = (subtotal * discountPercent) / 100;
  const freeShippingThreshold = 99;
  const isFreeShipCoupon = coupon?.freeShipping;

  const rawShipping = subtotal >= freeShippingThreshold || isFreeShipCoupon || subtotal === 0 ? 0 : 4.99;
  const shipping = Number(rawShipping.toFixed(2));
  const tax = Number(((subtotal - discountAmount) * 0.08).toFixed(2));
  const total = Number(Math.max(0, subtotal - discountAmount + shipping + tax).toFixed(2));

  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        coupon,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        toggleCart: () => setIsCartOpen((prev) => !prev),
        totalItems,
        subtotal,
        discountAmount,
        shipping,
        tax,
        total,
        freeShippingThreshold,
        freeShippingProgress,
        freeShippingRemaining,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
