import React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { SubcategoryCards } from '@/components/SubcategoryCards';
import { CategoryProductGrid } from '@/app/shop/[category]/CategoryProductGrid';
import { CATEGORIES, PRODUCTS, SITE, getShopCategoryNav } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Parts & Upgrades | Batteries, Chargers, Brakes & Wheels',
  description:
    'Shop electric dirt bike parts and upgrades by category — 72V batteries and chargers, controllers and electronics, suspension, brakes and rotors, wheels and tyres. Genuine and aftermarket fitments for Sur-Ron, Talaria, Stark, E-Ride Pro and more.',
  alternates: {
    canonical: `https://${SITE.domain}/parts-upgrades/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Parts & Upgrades | Australian Electric Motor Co',
    description:
      'Batteries, chargers, controllers, suspension, brakes, wheels and tyres for every electric dirt bike we sell.',
    url: `https://${SITE.domain}/parts-upgrades/`,
    images: [{ url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=80' }],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function PartsUpgradesRootPage() {
  const belongs = (p: any, slug: string) => p.category === slug || p.parentCategories?.includes(slug);

  const partsProducts = PRODUCTS.filter((p: any) => belongs(p, 'parts-upgrades'));

  const groups = CATEGORIES.filter((c) => c.parent === 'parts-upgrades').map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    image: c.image,
    count: PRODUCTS.filter((p: any) => belongs(p, c.slug)).length,
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
    <div className="mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={breadcrumbsSchema} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-stone-400">
        <Link href="/" className="hover:text-white">Home</Link>
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
            Every spare and upgrade for your e-moto, sorted by department. Pick a category to jump
            straight in, or scroll down to browse the full range with brand and price filters.
          </p>
          <div className="pt-1 font-mono text-xs text-emerald-400">
            • {partsProducts.length} parts in stock • NSW dispatch
          </div>
        </div>
      </div>

      {/* Department cards */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
          Shop parts by department
        </h2>
        <SubcategoryCards items={groups} />
      </section>

      {/* Full filtered catalogue */}
      <section className="space-y-5">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
          All parts &amp; upgrades
        </h2>
        <CategoryProductGrid
          initialProducts={partsProducts}
          categorySlug="parts-upgrades"
          categoryName="Parts & Upgrades"
          categoryNav={getShopCategoryNav()}
        />
      </section>
    </div>
  );
}
