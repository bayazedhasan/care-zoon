'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';
import Footer from '@/components/layout/Footer';
import QuickViewModal from '@/components/common/QuickViewModal';
import CartDrawer from '@/components/common/CartDrawer';
import SearchCommandModal from '@/components/common/SearchCommandModal';

export default function StorefrontLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Navbar onMobileMenuOpen={() => setMobileMenuOpen(true)} />
      <MobileNav isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <QuickViewModal />
      <CartDrawer />
      <SearchCommandModal />
    </>
  );
}
