import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { CategoryProductGrid } from './CategoryProductGrid';
import { CATEGORIES, PRODUCTS, SITE, getShopCategoryNav } from '@/config/site';
import { buildSeoTitle, truncateDescription } from '@/lib/seo';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

// Subcategory SEO Configuration Map
const CATEGORY_SEO_MAP: Record<
  string,
  {
    title: string;
    description: string;
    h1: string;
  }
> = {
  'adult-electric-dirt-bikes': {
    title: 'Adult Electric Dirt Bike | High-Power 60V–72V E-Motos',
    description:
      'Discover the best adult electric dirt bike selection in Australia. Featuring Stark VARG, Surron Ultra Bee, and Talaria Sting with high-discharge powertrains.',
    h1: 'Adult Electric Dirt Bike Range',
  },
  'kids-youth-electric-dirt-bikes': {
    title: 'Kids Electric Dirt Bike | Safe Youth Mini-Motos & Balance Bikes',
    description:
      'Safe, durable, and adjustable kids electric dirt bike models from KTM, STACYC, and OSET. Built-in speed limiters and lightweight frames for young riders.',
    h1: 'Kids Electric Dirt Bike & Youth Off-Road',
  },
  'adr-road-legal-dirt-bikes': {
    title: 'Road-Legal Electric Dirt Bike | ADR Street Approved E-Motos',
    description:
      'Ride legally from street to trail. Shop ADR-certified electric dirt bike models equipped with VIN, mirrors, and lights for Australian road registration.',
    h1: 'Road-Legal Electric Dirt Bike Models',
  },
  'batteries-chargers': {
    title: 'Electric Dirt Bike Battery & Fast Charger Upgrades',
    description:
      'Upgrade your electric dirt bike with 72V high-capacity lithium packs and 240V AU-standard fast chargers for Surron, Talaria, and Stark VARG.',
    h1: 'Electric Dirt Bike Batteries & Fast Chargers',
  },
  'electric-dirt-bikes': {
    title: 'Electric Dirt Bike Collection | Buy Online in Australia',
    description:
      'Explore our complete electric dirt bike inventory. Compare 60V, 72V, and 360V electric dirt bike models from Surron, Talaria, and Stark VARG with AUD pricing.',
    h1: 'All Electric Dirt Bike Models',
  },
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const customSeo = CATEGORY_SEO_MAP[categorySlug];

  if (!category && !customSeo) return { title: 'Category Not Found' };

  const title = customSeo?.title || buildSeoTitle(category?.name || '');
  const description = customSeo?.description || truncateDescription(category?.description || '');

  return {
    title,
    description,
    alternates: {
      canonical: `https://${SITE.domain}/shop/${categorySlug}/`,
    },
    openGraph: {
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const customSeo = CATEGORY_SEO_MAP[categorySlug];

  if (!category) {
    notFound();
  }

  const isBrandsRoot = category.slug === 'brands';
  const brandCategories = CATEGORIES.filter(
    (c) => c.section === 'brands' && c.parent === 'brands'
  );

  const categoryProducts = PRODUCTS.filter(
    (p: any) =>
      isBrandsRoot ||
      p.category === category.slug ||
      p.brand === category.slug ||
      (p.parentCategories && p.parentCategories.includes(category.slug)) ||
      (category.slug === 'adult-electric-dirt-bikes' && (p.category === 'full-size-motocross' || p.category === 'trail-mid-weight-enduro')) ||
      (category.slug === 'kids-youth-electric-dirt-bikes' && (p.category === 'junior-trials-youth-dirt-bikes' || p.category === 'balance-mini-bikes'))
  );

  const pageHeading = customSeo?.h1 || category.name;

  // Child categories to expose as a drill-down "Category" filter on hub pages
  const subcategories = CATEGORIES.filter((c) => c.parent === category.slug).map((c) => ({
    slug: c.slug,
    name: c.name,
  }));

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
        name: 'Shop',
        item: `https://${SITE.domain}/shop/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: pageHeading,
        item: `https://${SITE.domain}/shop/${category.slug}/`,
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <JsonLd data={breadcrumbsSchema} />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/shop/" className="hover:text-white">Shop</Link>
        <span>/</span>
        <span className="text-[#C87D55]">{pageHeading}</span>
      </nav>

      {/* Hero Header with Single H1 */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-12">
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            Category Showcase
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            {pageHeading}
          </h1>
          <p className="text-base text-stone-300 leading-relaxed">
            {category.description}
          </p>
          <div className="pt-2 text-xs font-mono text-emerald-400">
            • {categoryProducts.length} Models Available for Immediate AU Crate Delivery
          </div>
        </div>
      </div>

      {/* If Brands Root, display clickable Brand Cards */}
      {isBrandsRoot && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
              Authorised Brand Showrooms
            </h2>
            <Link
              href="/brands/"
              className="text-xs font-semibold text-[#C87D55] hover:text-white inline-flex items-center gap-1"
            >
              <span>View Full Brands Directory</span>
              <span>&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {brandCategories.map((brand) => {
              const modelCount = PRODUCTS.filter(
                (p: any) =>
                  p.brand === brand.slug ||
                  p.category === brand.slug ||
                  (p.parentCategories && p.parentCategories.includes(brand.slug)),
              ).length;
              return (
                <Link
                  key={brand.slug}
                  href={`/brands/${brand.slug}/`}
                  className="group flex items-center gap-3 rounded-xl border border-[#2B2F36] bg-[#17191C] p-2.5 transition-all hover:border-[#C87D55] hover:bg-[#1D2024]"
                >
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white">
                    <SmartImage
                      src={brand.image}
                      alt={`${brand.name} logo`}
                      fill
                      fit="contain"
                      className="p-1"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-[13px] font-bold leading-tight text-white transition-colors group-hover:text-[#C87D55]">
                      {brand.name}
                    </h3>
                    <span className="font-mono text-[11px] text-stone-400">
                      {modelCount} {modelCount === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                  <span className="shrink-0 text-stone-500 transition-transform group-hover:translate-x-0.5 group-hover:text-[#C87D55]">
                    &rarr;
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Products Grid with Interactive Filters */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold uppercase text-white tracking-tight">
          {isBrandsRoot ? 'All Electric Dirt Bikes Across Brands' : `${category.name} Inventory`}
        </h2>

        <CategoryProductGrid
          initialProducts={categoryProducts}
          categorySlug={category.slug}
          categoryName={category.name}
          subcategories={subcategories}
          categoryNav={getShopCategoryNav()}
        />
      </section>
    </div>
  );
}
