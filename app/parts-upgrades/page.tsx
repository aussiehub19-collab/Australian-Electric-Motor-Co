import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Parts, 72V Batteries & Upgrades | Australian Electric Motor Co',
  description:
    'High-performance 72V Molicel batteries, programmable controllers, FastAce suspension, and Australian 240V fast chargers for electric dirt bikes.',
  alternates: {
    canonical: `https://${SITE.domain}/parts-upgrades/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Parts, 72V Batteries & Upgrades | Australian Electric Motor Co',
    description:
      'High-performance 72V Molicel batteries, programmable controllers, FastAce suspension, and Australian 240V fast chargers for electric dirt bikes.',
    url: `https://${SITE.domain}/parts-upgrades/`,
    images: [{ url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Parts, 72V Batteries & Upgrades | Australian Electric Motor Co',
    description:
      'High-performance 72V Molicel batteries, programmable controllers, FastAce suspension, and Australian 240V fast chargers for electric dirt bikes.',
    images: ['https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80'],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function PartsUpgradesRootPage() {
  const partsCategories = CATEGORIES.filter((c) => c.section === 'parts-upgrades' && c.parent === 'parts-upgrades');
  const allPartsProducts = PRODUCTS.filter(
    (p) =>
      p.category === 'parts-upgrades' ||
      p.category === 'batteries-chargers' ||
      p.category === 'high-capacity-batteries' ||
      p.category === 'controllers-electrical' ||
      p.category === 'suspension-handling' ||
      (p.parentCategories && p.parentCategories.includes('parts-upgrades'))
  );

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `https://${SITE.domain}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Parts & Upgrades',
        item: `https://${SITE.domain}/parts-upgrades/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <JsonLd data={breadcrumbsSchema} />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">Parts &amp; Upgrades</span>
      </nav>

      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            Performance Upgrades &bull; 72V Molicel Packs
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Electric Dirt Bike Parts, Batteries &amp; Tuning
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            Upgrade your e-moto with race-grade 72V Molicel lithium powerpacks, BAC/Torp programmable controllers, reinforced swingarms, oversized brake discs, and Australian 240V high-amp fast chargers.
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-400">
            &bull; {allPartsProducts.length} Upgrades In Stock in NSW &bull; Express Dispatch
          </div>
        </div>
      </div>

      {/* Subcategory Navigation Bar */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/parts-upgrades/batteries-chargers/"
          className="px-4 py-2.5 rounded-xl bg-[#8C4A2F] text-white text-xs font-mono font-bold hover:bg-[#A35839] transition"
        >
          ⚡ Batteries &amp; Fast Chargers
        </Link>
        <Link
          href="/shop/controllers-electrical/"
          className="px-4 py-2.5 rounded-xl bg-[#1D2024] text-stone-200 border border-[#2B2F36] text-xs font-mono font-bold hover:bg-[#252930] transition"
        >
          🎛️ Controllers &amp; Displays
        </Link>
        <Link
          href="/shop/suspension-handling/"
          className="px-4 py-2.5 rounded-xl bg-[#1D2024] text-stone-200 border border-[#2B2F36] text-xs font-mono font-bold hover:bg-[#252930] transition"
        >
          🛠️ Suspension &amp; Brakes
        </Link>
      </div>

      {/* Product Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#23272E] pb-4">
          <h2 className="text-xl font-bold uppercase text-white tracking-tight">
            All Parts &amp; Tuning Components
          </h2>
          <span className="text-xs font-mono text-stone-400">
            Showing {allPartsProducts.length} products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {allPartsProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
