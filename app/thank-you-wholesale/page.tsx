import React from 'react';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Wholesale Application Received | AEMC',
  description: 'Thank you for your commercial fleet application with Australian Electric Motor Co.',
  robots: {
    index: false,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ThankYouWholesalePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-blue-500/20 border border-blue-500/40 rounded-full flex items-center justify-center mx-auto text-blue-400 text-2xl font-bold">
        📋
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#C87D55] font-bold">
        Commercial Application Logged
      </span>
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
        Wholesale Inquiry Dispatched
      </h1>
      <p className="text-sm text-stone-300 leading-relaxed">
        Our commercial fleet manager has received your business details and unit requirements. We will review your application and send dealer pricing tiers and terms within 24 hours.
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
