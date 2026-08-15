import React from 'react';
import HeroBanner from '@/components/home/HeroBanner';
import TrustBadges from '@/components/common/TrustBadges';
import CategoryGrid from '@/components/home/CategoryGrid';
import FlashSale from '@/components/home/FlashSale';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import PromoBanners from '@/components/home/PromoBanners';
import BrandShowcase from '@/components/home/BrandShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';

export const metadata = {
  title: 'CareZoon — Modern Lifestyle & Tech Destination',
  description: 'Shop premium electronics, contemporary fashion, Scandinavian home decor, organic wellness, and pet essentials with free express shipping.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Promotional Carousel */}
      <HeroBanner />

      {/* 2. Trust Assurance Badges */}
      <TrustBadges />

      {/* 3. Product Categories Grid */}
      <CategoryGrid />

      {/* 4. Flash Deals with Live Countdown */}
      <FlashSale />

      {/* 5. Featured / Best Sellers Tabbed Showcase */}
      <FeaturedProducts />

      {/* 6. Dual Seasonal Promo Banners */}
      <PromoBanners />

      {/* 7. Partner Brand Logos */}
      <BrandShowcase />

      {/* 8. Verified Customer Testimonials */}
      <TestimonialsSection />
    </div>
  );
}
