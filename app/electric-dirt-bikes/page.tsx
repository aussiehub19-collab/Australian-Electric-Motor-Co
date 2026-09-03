import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, CATEGORIES, SITE } from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Collection | Buy Online in Australia',
  description:
    'Explore our complete electric dirt bike inventory. Compare 60V, 72V, and 360V electric dirt bike models from Surron, Talaria, and Stark VARG with AUD pricing.',
  alternates: {
    canonical: `https://${SITE.domain}/electric-dirt-bikes/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Collection | Buy Online in Australia',
    description:
      'Explore our complete electric dirt bike inventory. Compare 60V, 72V, and 360V electric dirt bike models from Surron, Talaria, and Stark VARG with AUD pricing.',
    url: `https://${SITE.domain}/electric-dirt-bikes/`,
    images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Collection | Buy Online in Australia',
    description:
      'Explore our complete electric dirt bike inventory. Compare 60V, 72V, and 360V electric dirt bike models from Surron, Talaria, and Stark VARG with AUD pricing.',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ElectricDirtBikesPage() {
  // Filter products by category segments
  const adultBikes = PRODUCTS.filter(
    (p) =>
      p.category === 'adult-electric-dirt-bikes' ||
      p.category === 'full-size-motocross' ||
      p.category === 'trail-mid-weight-enduro' ||
      (p.parentCategories && p.parentCategories.includes('adult-electric-dirt-bikes'))
  );

  const kidsBikes = PRODUCTS.filter(
    (p) =>
      p.category === 'kids-youth-electric-dirt-bikes' ||
      p.category === 'junior-trials-youth-dirt-bikes' ||
      p.category === 'balance-mini-bikes' ||
      (p.parentCategories && p.parentCategories.includes('kids-youth-electric-dirt-bikes'))
  );

  const roadLegalBikes = PRODUCTS.filter(
    (p) =>
      p.category === 'road-legal-electric-dirt-bikes' ||
      p.category === 'adr-road-legal-dirt-bikes' ||
      (p.parentCategories && (p.parentCategories.includes('road-legal-electric-dirt-bikes') || p.parentCategories.includes('adr-road-legal-dirt-bikes')))
  );

  const partsAndBatteries = PRODUCTS.filter(
    (p) =>
      p.category === 'batteries-chargers' ||
      p.category === 'high-capacity-batteries' ||
      p.category === 'parts-upgrades' ||
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
        name: 'Electric Dirt Bikes',
        item: `https://${SITE.domain}/electric-dirt-bikes/`,
      },
    ],
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All Electric Dirt Bike Models',
    description:
      'Explore our complete electric dirt bike inventory. Compare 60V, 72V, and 360V electric dirt bike models from Surron, Talaria, and Stark VARG with AUD pricing.',
    url: `https://${SITE.domain}/electric-dirt-bikes/`,
    mainEntity: {
      '@type': 'OfferCatalog',
      name: 'Australian Electric Dirt Bike Catalog',
      numberOfItems: PRODUCTS.length,
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      <JsonLd data={[breadcrumbsSchema, collectionSchema]} />

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">Electric Dirt Bikes</span>
      </nav>

      {/* Hero Header with Exactly ONE <h1> */}
      <div className="relative rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-8 sm:p-14">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1D2024] border border-[#8C4A2F]/40 text-xs font-mono text-[#C87D55]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NATIONWIDE AUSTRALIAN CRATE DELIVERY &bull; LOCAL TECH SUPPORT</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight">
            All Electric Dirt Bike Models
          </h1>

          <p className="text-base sm:text-lg text-stone-300 leading-relaxed">
            Explore Australia&apos;s most comprehensive electric dirt bike inventory. Compare high-torque 60V, 72V, and 360V machines from premier manufacturers like Stark VARG, Surron, Talaria, and E-Ride Pro with transparent AUD pricing, local Queensland warranty, and flexible Pay in 4 financing.
          </p>

          {/* Quick Category Anchors */}
          <div className="pt-4 flex flex-wrap gap-2 text-xs font-mono">
            <a
              href="#adult-models"
              className="px-3.5 py-2 rounded-lg bg-[#23272E] text-stone-200 hover:bg-[#8C4A2F] hover:text-white transition border border-[#2E333D]"
            >
              &darr; Adult Models
            </a>
            <a
              href="#kids-models"
              className="px-3.5 py-2 rounded-lg bg-[#23272E] text-stone-200 hover:bg-[#8C4A2F] hover:text-white transition border border-[#2E333D]"
            >
              &darr; Kids &amp; Youth
            </a>
            <a
              href="#road-legal"
              className="px-3.5 py-2 rounded-lg bg-[#23272E] text-stone-200 hover:bg-[#8C4A2F] hover:text-white transition border border-[#2E333D]"
            >
              &darr; Road-Legal (ADR)
            </a>
            <a
              href="#parts-batteries"
              className="px-3.5 py-2 rounded-lg bg-[#23272E] text-stone-200 hover:bg-[#8C4A2F] hover:text-white transition border border-[#2E333D]"
            >
              &darr; 72V Batteries &amp; Parts
            </a>
          </div>
        </div>
      </div>

      {/* SECTION 1: Adult Electric Dirt Bike Models */}
      <section id="adult-models" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23272E] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
              Full-Power Performance &bull; 60V &ndash; 360V
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Adult Electric Dirt Bike Models (Full-Size &amp; Mid-Weight)
            </h2>
          </div>
          <Link
            href="/electric-dirt-bikes/adult-electric-dirt-bikes/"
            className="text-xs font-mono text-[#C87D55] hover:text-amber-400 flex items-center gap-1 font-bold whitespace-nowrap"
          >
            <span>View All Adult E-Motos ({adultBikes.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <p className="text-sm text-stone-300 max-w-4xl leading-relaxed">
          Engineered for adult riders demanding instant throttle response, long-travel adjustable suspension, and race-winning power. From full-size 60kW Stark VARG motocross weapons to nimble Surron Ultra Bee and Talaria Sting R trail machines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {adultBikes.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 2: Kids Electric Dirt Bike & Balance Trainers */}
      <section id="kids-models" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23272E] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
              Safe Youth Progression &bull; Speed Limited
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Kids Electric Dirt Bike &amp; Balance Trainers
            </h2>
          </div>
          <Link
            href="/electric-dirt-bikes/kids-youth-electric-dirt-bikes/"
            className="text-xs font-mono text-[#C87D55] hover:text-amber-400 flex items-center gap-1 font-bold whitespace-nowrap"
          >
            <span>View All Kids Models ({kidsBikes.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <p className="text-sm text-stone-300 max-w-4xl leading-relaxed">
          Safe, durable, and whisper-quiet electric dirt bikes tailored for groms aged 3 to 15. Features parent-controlled speed limiters, lightweight balance geometry, and no burning hot exhaust pipes for worry-free backyard and park riding.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {kidsBikes.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 3: Road-Legal Electric Dirt Bike Options (ADR Compliant) */}
      <section id="road-legal" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23272E] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
              Street to Trail &bull; ADR Registration Ready
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Road-Legal Electric Dirt Bike Options (ADR Compliant)
            </h2>
          </div>
          <Link
            href="/electric-dirt-bikes/road-legal-electric-dirt-bikes/"
            className="text-xs font-mono text-[#C87D55] hover:text-amber-400 flex items-center gap-1 font-bold whitespace-nowrap"
          >
            <span>View All Road-Legal ({roadLegalBikes.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <p className="text-sm text-stone-300 max-w-4xl leading-relaxed">
          Ride straight from your suburban driveway into Australian forestry tracks and state trails. ADR-certified electric dirt bikes equipped with high/low beam headlights, indicators, mirrors, horn, and Australian VIN plates for standard road registration.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {roadLegalBikes.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: Electric Dirt Bike Parts, 72V Batteries & Fast Chargers */}
      <section id="parts-batteries" className="space-y-6 scroll-mt-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#23272E] pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#C87D55] uppercase tracking-wider font-bold">
              High-Discharge Power &bull; Australian Fast Chargers
            </span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              Electric Dirt Bike Parts, 72V Batteries &amp; Fast Chargers
            </h2>
          </div>
          <Link
            href="/parts-upgrades/batteries-chargers/"
            className="text-xs font-mono text-[#C87D55] hover:text-amber-400 flex items-center gap-1 font-bold whitespace-nowrap"
          >
            <span>View All Batteries &amp; Chargers ({partsAndBatteries.length})</span>
            <span>&rarr;</span>
          </Link>
        </div>

        <p className="text-sm text-stone-300 max-w-4xl leading-relaxed">
          Unleash maximum horsepower and extended range with our custom hand-built 72V Molicel lithium powerpacks, Bluetooth Smart BMS units, and 240V Australian-standard high-amp fast chargers compatible with Surron, Talaria, E-Ride Pro, and custom e-motos.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {partsAndBatteries.slice(0, 8).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
