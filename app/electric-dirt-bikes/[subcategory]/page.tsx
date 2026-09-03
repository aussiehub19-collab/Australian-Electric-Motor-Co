import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

interface SubcategoryPageProps {
  params: Promise<{
    subcategory: string;
  }>;
}

// Subcategory SEO Configuration Map
const SUBCATEGORY_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
    intro: string;
  }
> = {
  'adult-electric-dirt-bikes': {
    title: 'Adult Electric Dirt Bike | High-Power 60V–72V E-Motos',
    description:
      'Discover the best adult electric dirt bike selection in Australia. Featuring Stark VARG, Surron Ultra Bee, and Talaria Sting with high-discharge powertrains.',
    h1: 'Adult Electric Dirt Bike Range',
    intro:
      'Explore Australia’s leading adult electric dirt bike selection. From the industry-dominating 60kW Stark VARG motocross weapon to the versatile Surron Ultra Bee and Talaria Sting R, our adult e-motos deliver brutal instant torque, long-range battery packs, and race-proven suspension.',
  },
  'kids-youth-electric-dirt-bikes': {
    title: 'Kids Electric Dirt Bike | Safe Youth Mini-Motos & Balance Bikes',
    description:
      'Safe, durable, and adjustable kids electric dirt bike models from KTM, STACYC, and OSET. Built-in speed limiters and lightweight frames for young riders.',
    h1: 'Kids Electric Dirt Bike & Youth Off-Road',
    intro:
      'Empower the next generation of Aussie riders with our safe, quiet, and durable kids electric dirt bike range. Equipped with parent-controlled speed limiters, featherlight alloy chassis, and smooth brushless power delivery with zero hot exhausts or messy petrol.',
  },
  'road-legal-electric-dirt-bikes': {
    title: 'Road-Legal Electric Dirt Bike | ADR Street Approved E-Motos',
    description:
      'Ride legally from street to trail. Shop ADR-certified electric dirt bike models equipped with VIN, mirrors, and lights for Australian road registration.',
    h1: 'Road-Legal Electric Dirt Bike Models',
    intro:
      'Commute during the week and conquer rugged off-road singletrack on the weekend. Our ADR-compliant road-legal electric dirt bikes feature full Australian road compliance equipment including headlights, indicators, mirrors, horn, and registered VIN plates.',
  },
  'adr-road-legal-dirt-bikes': {
    title: 'Road-Legal Electric Dirt Bike | ADR Street Approved E-Motos',
    description:
      'Ride legally from street to trail. Shop ADR-certified electric dirt bike models equipped with VIN, mirrors, and lights for Australian road registration.',
    h1: 'Road-Legal Electric Dirt Bike Models',
    intro:
      'Commute during the week and conquer rugged off-road singletrack on the weekend. Our ADR-compliant road-legal electric dirt bikes feature full Australian road compliance equipment including headlights, indicators, mirrors, horn, and registered VIN plates.',
  },
};

export async function generateStaticParams() {
  const eDirtBikeCategories = CATEGORIES.filter(
    (c) => c.section === 'electric-dirt-bikes' && c.slug !== 'electric-dirt-bikes'
  );
  return eDirtBikeCategories.map((c) => ({ subcategory: c.slug }));
}

export async function generateMetadata({ params }: SubcategoryPageProps) {
  const { subcategory: slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const seo = SUBCATEGORY_SEO_MAP[slug];

  if (!category && !seo) return { title: 'Category Not Found' };

  const title = seo?.title || `${category?.name || slug} | Electric Dirt Bikes Australia`;
  const description = seo?.description || `${category?.description?.slice(0, 150)}...`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://${SITE.domain}/electric-dirt-bikes/${slug}/`,
    },
    openGraph: {
      type: 'website',
      siteName: 'Australian Electric Motor Co',
      title,
      description,
      images: [{ url: category?.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [category?.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function SubcategoryPage({ params }: SubcategoryPageProps) {
  const { subcategory: slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const seo = SUBCATEGORY_SEO_MAP[slug];

  if (!category && !seo) {
    notFound();
  }

  const categoryName = category?.name || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const categoryDesc = seo?.intro || category?.description || '';
  const pageH1 = seo?.h1 || categoryName;

  // Filter products belonging to this category or sub-category
  const categoryProducts = PRODUCTS.filter(
    (p: any) =>
      p.category === slug ||
      (p.parentCategories && p.parentCategories.includes(slug)) ||
      (slug === 'road-legal-electric-dirt-bikes' && (p.category === 'adr-road-legal-dirt-bikes' || (p.parentCategories && p.parentCategories.includes('adr-road-legal-dirt-bikes')))) ||
      (slug === 'adult-electric-dirt-bikes' && (p.category === 'full-size-motocross' || p.category === 'trail-mid-weight-enduro' || (p.parentCategories && p.parentCategories.includes('adult-electric-dirt-bikes')))) ||
      (slug === 'kids-youth-electric-dirt-bikes' && (p.category === 'junior-trials-youth-dirt-bikes' || p.category === 'balance-mini-bikes' || (p.parentCategories && p.parentCategories.includes('kids-youth-electric-dirt-bikes'))))
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
        name: 'Electric Dirt Bikes',
        item: `https://${SITE.domain}/electric-dirt-bikes/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageH1,
        item: `https://${SITE.domain}/electric-dirt-bikes/${slug}/`,
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
        <Link href="/electric-dirt-bikes/" className="hover:text-white transition">
          Electric Dirt Bikes
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">{pageH1}</span>
      </nav>

      {/* Hero Header with Exact ONE H1 */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            E-Dirt Bike Subcategory
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            {pageH1}
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            {categoryDesc}
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-400">
            &bull; {categoryProducts.length} Models Ready for Immediate AU Dispatch
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#23272E] pb-4">
          <h2 className="text-xl font-bold uppercase text-white tracking-tight">
            Available Models &amp; Builds
          </h2>
          <span className="text-xs font-mono text-stone-400">
            Showing {categoryProducts.length} bikes
          </span>
        </div>

        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#17191C] rounded-2xl border border-[#2B2F36] space-y-4">
            <p className="text-stone-400 font-mono text-sm">
              New model shipments arriving weekly. Contact our team for pre-orders.
            </p>
            <Link
              href="/electric-dirt-bikes/"
              className="inline-block bg-[#8C4A2F] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase font-mono"
            >
              Browse All Electric Dirt Bikes
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
