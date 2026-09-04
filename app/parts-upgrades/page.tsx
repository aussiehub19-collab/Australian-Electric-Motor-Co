import React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { CategoryProductGrid } from '@/app/shop/[category]/CategoryProductGrid';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Parts, 72V Batteries & Upgrades | Australian Electric Motor Co',
  description:
    'Shop electric dirt bike parts and upgrades — 72V lithium batteries, fast chargers, programmable controllers, forks and shocks, oversized brakes, wheels and tyres. Filter by category and brand.',
  alternates: {
    canonical: `https://${SITE.domain}/parts-upgrades/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Parts, 72V Batteries & Upgrades | Australian Electric Motor Co',
    description:
      'Batteries, chargers, controllers, suspension, brakes, wheels and tyres for Sur-Ron, Talaria, Stark, E-Ride Pro, STACYC and more.',
    url: `https://${SITE.domain}/parts-upgrades/`,
    images: [{ url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80' }],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function PartsUpgradesRootPage() {
  const partsProducts = PRODUCTS.filter(
    (p: any) => p.category === 'parts-upgrades' || p.parentCategories?.includes('parts-upgrades'),
  );

  const subcategories = CATEGORIES.filter((c) => c.parent === 'parts-upgrades').map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      { '@type': 'ListItem', position: 2, name: 'Parts & Upgrades', item: `https://${SITE.domain}/parts-upgrades/` },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={breadcrumbsSchema} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-stone-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">Parts &amp; Upgrades</span>
      </nav>

      <div className="relative overflow-hidden rounded-3xl border border-[#2B2F36] bg-[#17191C] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C87D55]">
            Performance Upgrades &amp; Genuine Spares
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
            Electric Dirt Bike Parts &amp; Upgrades
          </h1>
          <p className="text-base leading-relaxed text-stone-300">
            Every spare and upgrade for your e-moto in one place — high-capacity 72V lithium batteries,
            Australian fast chargers, programmable controllers, forks and shocks, oversized brakes,
            and full-size wheels and knobbly tyres. Use the filters to jump straight to what fits your bike.
          </p>
          <div className="pt-1 font-mono text-xs text-emerald-400">
            • {partsProducts.length} parts in stock • NSW dispatch
          </div>
        </div>
      </div>

      <CategoryProductGrid
        initialProducts={partsProducts}
        categorySlug="parts-upgrades"
        categoryName="Parts & Upgrades"
        subcategories={subcategories}
      />
    </div>
  );
}
