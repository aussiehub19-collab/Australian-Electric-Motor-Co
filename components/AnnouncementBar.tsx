'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const ANNOUNCEMENTS = [
  { text: '⚡ 10% Instant Discount on Bitcoin (BTC) & Tether (USDT) Orders', link: '/shop/' },
  { text: '💳 Pay in 4 Available: 4 Interest-Free Fortnightly Payments (0% Interest)', link: '/finance/' },
  { text: '🚚 Nationwide Enclosed Crate Freight Across Australia & Regional Depots', link: '/faq/' },
  { text: '🇦🇺 Queensland Engineered 72V High-Output Powertrains — 2-Year Warranty', link: '/about/' },
  { text: '💬 Sunshine Coast Workshop Test Rides Available — Chat on WhatsApp', link: '/contact/' },
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const current = ANNOUNCEMENTS[index];

  return (
    <div className="bg-[#6D3720] text-stone-100 text-xs sm:text-sm py-2 px-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-center font-medium tracking-wide">
          <Link
            href={current.link}
            className="hover:underline inline-flex items-center gap-1.5 focus-visible:ring-1 focus-visible:ring-amber-300"
          >
            <span>{current.text}</span>
            <span className="opacity-75 hidden sm:inline">&rarr;</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-4 text-stone-300 text-xs pl-4 border-l border-amber-900/40">
          <span>Sunshine Coast, QLD</span>
          <span className="text-amber-400 font-semibold">AUD ($)</span>
        </div>
      </div>
    </div>
  );
}
