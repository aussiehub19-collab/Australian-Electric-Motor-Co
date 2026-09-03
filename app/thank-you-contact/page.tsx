import React from 'react';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Thank You | Dirt & Co',
  description: 'Thank you for contacting Dirt & Co.',
  robots: {
    index: false,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ThankYouContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400 text-2xl font-bold">
        ✓
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#C87D55] font-bold">
        Message Dispatched
      </span>
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
        Thank You For Reaching Out
      </h1>
      <p className="text-sm text-stone-300 leading-relaxed">
        Our Sunshine Coast team has received your inquiry. One of our off-road technicians will review your request and be in touch within 1 business day.
      </p>
      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/shop/"
          className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Return to Shop &rarr;
        </Link>
        <Link
          href="/"
          className="bg-[#17191C] border border-[#2B2F36] hover:bg-[#25282E] text-stone-300 text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
