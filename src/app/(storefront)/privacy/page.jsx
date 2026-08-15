'use client';

import React from 'react';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function PrivacyPage() {
  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

        <div className="my-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xs text-slate-400 mt-1">Last Updated: August 2026</p>
          </div>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">1. Information We Collect</h2>
            <p>
              We collect information you provide directly when creating an account, making a purchase, or communicating with customer service (such as name, email, shipping address, and phone number).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">2. How We Use Your Data</h2>
            <p>
              We use your information strictly to process orders, manage deliveries, send transaction confirmations, prevent fraudulent transactions, and enhance your shopping experience. We never sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">3. Security & Payment Encryption</h2>
            <p>
              All payment transactions are encrypted using 256-Bit SSL encryption. We do not store raw credit card numbers on our servers; payments are processed securely through certified payment gateways.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
