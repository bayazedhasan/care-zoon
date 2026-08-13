'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Check, Sparkles } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Breadcrumbs from '@/components/common/Breadcrumbs';

export default function ContactPage() {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }
    setSubmitted(true);
    addToast('Message received! Our team will respond within 2 hours.', 'success');
    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
  };

  return (
    <div className="w-full min-h-screen py-6 sm:py-10 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Contact Support' }]} />

        {/* Hero Banner */}
        <div className="my-8 text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5" /> 24/7 Dedicated Support Squad
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            We&apos;re Here to Help
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Have a question about an order, product specifications, or wholesale partnerships? Send us a message below.
          </p>
        </div>

        {/* 2-Column Grid: Contact Info vs Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 my-12 items-start">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Get in Touch Directly</h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Global Headquarters</h4>
                    <p className="text-slate-500 mt-0.5">100 Market Street, Suite 800, San Francisco, CA 94105, United States</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Toll-Free Phone Support</h4>
                    <p className="text-slate-500 mt-0.5">+1 (800) 555-CARE (2273) • Available 24 Hours / 7 Days</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Electronic Mail Inquiries</h4>
                    <p className="text-slate-500 mt-0.5">support@carezoon.com (Average reply: 45 minutes)</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Warehouse Dispatch Hours</h4>
                    <p className="text-slate-500 mt-0.5">Monday – Saturday: 06:00 AM – 10:00 PM PST</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Looking for quick self-service answers? Check out our{' '}
                  <Link href="/faq" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
                    FAQ Knowledge Base
                  </Link>.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Send Us a Direct Message</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Order & Shipment Tracking">Order & Shipment Tracking</option>
                  <option value="Return or Exchange Request">Return or Exchange Request</option>
                  <option value="Warranty & Product Support">Warranty & Product Support</option>
                  <option value="Partnership & Wholesale">Partnership & Wholesale</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Detailed Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can our care team help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-8 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2"
              >
                {submitted ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                <span>{submitted ? 'Message Sent!' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
