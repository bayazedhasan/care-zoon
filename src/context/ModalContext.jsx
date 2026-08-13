'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
  }, []);

  const closeQuickView = useCallback(() => {
    setQuickViewProduct(null);
  }, []);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        quickViewProduct,
        openQuickView,
        closeQuickView,
        isSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
