'use client';

import React from 'react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function TermsPage() {
  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

        <div className="my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Agreement to Terms</h2>
            <p>
              By accessing or purchasing from CareZoon (&ldquo;the Site&rdquo;), you agree to be bound by these Terms of Service. If you disagree with any portion of these terms, please do not use our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. Product Descriptions & Pricing</h2>
            <p>
              We endeavor to describe all items with meticulous accuracy. However, CareZoon does not warrant that product descriptions, pricing, photography, or other content are error-free. We reserve the right to correct errors and cancel orders arising from inaccurate pricing.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Shipping & Risk of Loss</h2>
            <p>
              All purchases from CareZoon are made pursuant to a shipment contract. Risk of loss and title for items pass to you upon our carrier delivery scan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">4. User Accounts</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials and password. CareZoon reserves the right to terminate accounts that violate security or community standards.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
