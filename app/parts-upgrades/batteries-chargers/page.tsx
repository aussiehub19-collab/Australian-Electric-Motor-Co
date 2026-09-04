import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Battery & Fast Charger Upgrades',
  description:
    'Upgrade your electric dirt bike with 72V high-capacity lithium packs and 240V AU-standard fast chargers for Surron, Talaria, and Stark VARG.',
  alternates: {
    canonical: `https://${SITE.domain}/parts-upgrades/batteries-chargers/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Battery & Fast Charger Upgrades',
    description:
      'Upgrade your electric dirt bike with 72V high-capacity lithium packs and 240V AU-standard fast chargers for Surron, Talaria, and Stark VARG.',
    url: `https://${SITE.domain}/parts-upgrades/batteries-chargers/`,
    images: [{ url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Battery & Fast Charger Upgrades',
    description:
      'Upgrade your electric dirt bike with 72V high-capacity lithium packs and 240V AU-standard fast chargers for Surron, Talaria, and Stark VARG.',
    images: ['https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80'],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function BatteriesChargersPage() {
  const products = PRODUCTS.filter(
    (p) =>
      p.category === 'batteries-chargers' ||
      p.category === 'high-capacity-batteries' ||
      p.category === 'parts-upgrades' ||
      (p.parentCategories && p.parentCategories.includes('batteries-chargers')) ||
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
        item: `https://${SITE.domain}/shop/parts-upgrades/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Electric Dirt Bike Batteries & Fast Chargers',
        item: `https://${SITE.domain}/parts-upgrades/batteries-chargers/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <JsonLd data={breadcrumbsSchema} />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop/parts-upgrades/" className="hover:text-white transition">
          Parts &amp; Upgrades
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">Batteries &amp; Chargers</span>
      </nav>

      {/* Hero Header with Exact ONE H1 */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            High-Discharge Power &amp; Fast Charging
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Electric Dirt Bike Batteries &amp; Fast Chargers
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            Upgrade your electric dirt bike with 72V high-capacity lithium packs and 240V AU-standard fast chargers for Surron, Talaria, and Stark VARG. Hand-built using tier-1 Molicel 21700 cells, smart Bluetooth BMS, and CNC billet housing for extreme Aussie heat dissipation.
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-400">
            &bull; {products.length} Upgrades Available for Express AU Dispatch
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#23272E] pb-4">
          <h2 className="text-xl font-bold uppercase text-white tracking-tight">
            High-Voltage Batteries, Chargers &amp; Harnesses
          </h2>
          <span className="text-xs font-mono text-stone-400">
            Showing {products.length} products
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
