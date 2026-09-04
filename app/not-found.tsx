import React from 'react';
import Link from 'next/link';
import { SITE } from '@/config/site';

export const metadata = {
  title: '404 - Trail Not Found | Australian Electric Motor Co',
  description: 'The requested page or electric bike model could not be found on Australian Electric Motor Co.',
  robots: {
    index: false,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <span className="text-xs font-mono uppercase tracking-widest text-[#C87D55] font-bold">
        Error 404 • Out of Bounds
      </span>
      <h1 className="text-4xl sm:text-6xl font-black uppercase text-white tracking-tight">
        Trail Not Found
      </h1>
      <p className="text-sm sm:text-base text-stone-300 leading-relaxed max-w-lg mx-auto">
        Looks like you took a wrong turn down a dead-end fire break. The page or model you are looking for has been moved or retired.
      </p>
      <div className="pt-4 flex flex-wrap justify-center gap-4">
        <Link
          href="/shop/"
          className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-3.5 px-6 rounded-xl transition shadow"
        >
          Explore E-Dirt Bikes &rarr;
        </Link>
        <Link
          href="/compare/"
          className="bg-[#17191C] border border-[#2B2F36] hover:bg-[#25282E] text-stone-300 text-xs font-bold py-3.5 px-6 rounded-xl transition"
        >
          Compare Specs
        </Link>
        <Link
          href="/"
          className="bg-[#17191C] border border-[#2B2F36] hover:bg-[#25282E] text-stone-300 text-xs font-bold py-3.5 px-6 rounded-xl transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
