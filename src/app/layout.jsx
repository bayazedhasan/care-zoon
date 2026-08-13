'use client';

import React, { useState } from 'react';
import './globals.css';
import { ToastProvider } from '@/context/ToastContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { ModalProvider } from '@/context/ModalContext';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import QuickViewModal from '@/components/common/QuickViewModal';
import CartDrawer from '@/components/common/CartDrawer';
import SearchCommandModal from '@/components/common/SearchCommandModal';

export default function RootLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>CareZoon — Premium Modern E-Commerce Store</title>
        <meta
          name="description"
          content="Discover curated premium lifestyle, electronics, fashion, home decor, wellness, and fitness gear with fast global express shipping."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <AuthProvider>
                <ModalProvider>
                  <ThemeProvider>
                    {/* Header */}
                    <Navbar onMobileMenuOpen={() => setMobileMenuOpen(true)} />

                    {/* Mobile Navigation Drawer & Bottom Bar */}
                    <MobileNav
                      isOpen={mobileMenuOpen}
                      onClose={() => setMobileMenuOpen(false)}
                    />

                    {/* Main Content View */}
                    <main className="flex-1 w-full">{children}</main>

                    {/* Footer */}
                    <Footer />

                    {/* Global Drawers & Modals */}
                    <QuickViewModal />
                    <CartDrawer />
                    <SearchCommandModal />
                  </ThemeProvider>
                </ModalProvider>
              </AuthProvider>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
