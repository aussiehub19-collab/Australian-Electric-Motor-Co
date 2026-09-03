import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { JsonLd } from '@/components/JsonLd';
import { PaginatedProductGrid } from '@/components/PaginatedProductGrid';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

interface BrandPageProps {
  params: Promise<{
    brand: string;
  }>;
}

export async function generateStaticParams() {
  const brandCategories = CATEGORIES.filter(
    (c) => c.section === 'brands' && c.parent === 'brands'
  );
  return brandCategories.map((c) => ({ brand: c.slug }));
}

export async function generateMetadata({ params }: BrandPageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  const brand = CATEGORIES.find(
    (c) => c.slug === brandSlug && c.section === 'brands'
  );
  if (!brand) return { title: 'Brand Not Found' };

  return {
    title: `${brand.name} Electric Dirt Bikes Australia | Models, Specs & Parts | AEMC`,
    description: `Shop genuine ${brand.name} electric dirt bikes in Australia. Backed by the Australian Electric Motor Co factory warranty, NSW spare parts inventory, and national crated delivery.`,
    alternates: {
      canonical: `https://${SITE.domain}/brands/${brand.slug}/`,
    },
    openGraph: {
      title: `${brand.name} Electric Dirt Bikes Australia | Australian Electric Motor Co`,
      description: brand.description,
      images: [{ url: brand.image }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function BrandIndividualPage({ params }: BrandPageProps) {
  const { brand: brandSlug } = await params;
  const brand = CATEGORIES.find(
    (c) => c.slug === brandSlug && c.section === 'brands'
  );

  if (!brand) {
    notFound();
  }

  // Filter products belonging to this brand
  const brandProducts = PRODUCTS.filter(
    (p: any) =>
      p.brand === brand.slug ||
      p.category === brand.slug ||
      (p.parentCategories && p.parentCategories.includes(brand.slug))
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
        name: 'Brands',
        item: `https://${SITE.domain}/brands/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.name,
        item: `https://${SITE.domain}/brands/${brand.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <JsonLd data={breadcrumbsSchema} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/brands/" className="hover:text-white">Brands</Link>
        <span>/</span>
        <span className="text-[#C87D55] font-semibold">{brand.name}</span>
      </nav>

      {/* Hero Header with Exactly One H1 */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
            <span>Authorised Showroom</span>
            <span>•</span>
            <span>Australian Factory Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            {brand.name} Electric Dirt Bikes
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            {brand.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono">
            <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              • {brandProducts.length} Models &amp; Upgrades in Australian Stock
            </span>
            <span className="text-stone-300 bg-stone-800 border border-stone-700 px-3 py-1 rounded-full">
              • 10% Crypto Discount Applied at Checkout
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {brandProducts.length > 0 ? (
        <PaginatedProductGrid products={brandProducts} />
      ) : (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-10 text-center space-y-4">
          <h2 className="text-xl font-bold text-white uppercase">
            New {brand.name} Crated Shipments En Route
          </h2>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Our next factory allocation of {brand.name} electric dirt bikes is currently undergoing pre-delivery inspection. Contact our workshop team to pre-reserve your build slot.
          </p>
          <div className="pt-4 flex justify-center gap-4">
            <Link
              href="/contact/"
              className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-3 px-6 rounded-lg transition uppercase tracking-wider"
            >
              Contact Workshop Team
            </Link>
            <Link
              href="/brands/"
              className="border border-[#2B2F36] hover:border-stone-500 text-stone-300 text-xs font-bold py-3 px-6 rounded-lg transition uppercase tracking-wider"
            >
              View All Brands
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
