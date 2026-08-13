'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import { useCart } from './CartContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { addToast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    try {
      const stored = localStorage.getItem('carezoon_wishlist');
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse wishlist storage', e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('carezoon_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, mounted]);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          addToast(`Removed "${product.name}" from your wishlist`, 'info');
          return prev.filter((item) => item.id !== product.id);
        } else {
          addToast(`Saved "${product.name}" to your wishlist!`, 'success');
          return [...prev, product];
        }
      });
    },
    [addToast]
  );

  const removeFromWishlist = useCallback(
    (productId) => {
      setWishlist((prev) => prev.filter((item) => item.id !== productId));
    },
    []
  );

  const moveToCart = useCallback(
    (product) => {
      addToCart(product, 1);
      removeFromWishlist(product.id);
    },
    [addToCart, removeFromWishlist]
  );

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
        clearWishlist,
        totalWishlistItems: wishlist.length,
        mounted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
