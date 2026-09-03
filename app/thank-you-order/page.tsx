import React from 'react';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata = {
  title: 'Order Received | Dirt & Co',
  description: 'Thank you for placing your order draft with Dirt & Co.',
  robots: {
    index: false,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ThankYouOrderPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
        🏍️
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#C87D55] font-bold">
        Order Request Received
      </span>
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
        Thank You For Your Order
      </h1>
      <p className="text-sm text-stone-300 leading-relaxed">
        We have received your order details. In accordance with Australian electric motorbike delivery standards and crate logistics, our sales coordinator will contact you directly to confirm delivery depot details and invoice payment.
      </p>
      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/shop/"
          className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Continue Shopping &rarr;
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
