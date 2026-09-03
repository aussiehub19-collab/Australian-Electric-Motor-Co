import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { ReviewSlider } from '@/components/ReviewSlider';
import {
  SITE,
  BRAND,
  CONTACT,
  SHOP,
  CATEGORIES,
  PRODUCTS,
  POSTS,
  FAQ,
  TRUSTPILOT_DATA,
} from '@/config/site';

export const metadata = {
  title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
  description:
    'Shop the ultimate electric dirt bike range. From high-torque 72V adult electric dirt bike models to youth mini-motos. Fast AU dispatch and local warranty. All prices include 10% GST.',
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    type: 'website',
    siteName: 'Australian Electric Motor Co',
    title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
    description:
      'Shop the ultimate electric dirt bike range. From high-torque 72V adult electric dirt bike models to youth mini-motos. Fast AU dispatch and local warranty.',
    url: `https://${SITE.domain}/`,
    images: [{ url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
    description:
      'Shop the ultimate electric dirt bike range. From high-torque 72V adult electric dirt bike models to youth mini-motos. Fast AU dispatch and local warranty.',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function HomePage() {
  const featuredProducts = PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const recentPosts = POSTS.slice(0, 3);

  // E-Bike categories + 1 card for Accessories on homepage category grid
  const homepageCategorySlugs = [
    'adult-electric-dirt-bikes',
    'kids-youth-electric-dirt-bikes',
    'trail-enduro',
    'full-size-motocross',
    'adr-road-legal-dirt-bikes',
    'utility-farm-e-bikes',
    'accessories',
  ];

  const homepageCategories = homepageCategorySlugs
    .map((slug) => CATEGORIES.find((cat) => cat.slug === slug))
    .filter(Boolean) as (typeof CATEGORIES)[number][];

  // Validated Schema.org JSON-LD for BikeStore / Store Entity with AggregateRating
  const jsonLdData = [
    {
      '@context': 'https://schema.org',
      '@type': ['Store', 'Organization', 'BikeStore'],
      name: SITE.name,
      url: `https://${SITE.domain}/`,
      description:
        "Australia's premier destination to buy an electric dirt bike, performance 72V batteries, and off-road riding gear.",
      currenciesAccepted: 'AUD',
      paymentAccepted: 'Direct Bank Transfer, PayID, Cryptocurrency (BTC/USDT), Pay in 4',
      priceRange: '$$',
      taxID: 'ABN 97 628 671 689',
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'NSW',
        addressCountry: 'AU',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: TRUSTPILOT_DATA.score,
        reviewCount: String(TRUSTPILOT_DATA.totalReviewsCount),
        bestRating: '5',
        worstRating: '1',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: `https://${SITE.domain}/search/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.slice(0, 5).map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      <JsonLd data={jsonLdData} />

      {/* SECTION 1: HERO - Exactly ONE <h1> per page with target keyword */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-[#101214] overflow-hidden border-b border-[#23272E]">
        {/* Hero Background Image with Subtle Radial Scrim */}
        <div className="absolute inset-0 z-0">
          <SmartImage
            src="https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1920&q=85"
            alt="Dirt & Co Apex 72R Electric Dirt Bike conquering Australian outback singletrack"
            priority={true}
            className="w-full h-full object-cover opacity-35 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1012] via-[#0f1012]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f1012] via-transparent to-[#0f1012]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 sm:py-28 space-y-8">
          {/* Factual Entity Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1D2024]/90 border border-[#8C4A2F]/50 text-xs font-mono text-[#C87D55] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AUSTRALIA&apos;S E-MOTO SUPERSTORE &bull; 60V, 72V &amp; 360V PLATFORMS</span>
          </div>

          {/* Mandatory Single H1 with Primary Focus Keyword */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white leading-[1.08]">
            Premium Electric Dirt Bike <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-[#C87D55] to-[#8C4A2F]">
              Range in Australia
            </span>
          </h1>

          {/* Exact Lead Introductory Paragraph */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg lg:text-xl text-stone-200 font-normal leading-relaxed">
            Find your next electric dirt bike engineered for rugged trails, tracks, and off-road exploration. Whether you need a full-power adult electric dirt bike capable of 100+ km/h or an entry-level kids electric dirt bike for backyard riding, our Australian inventory features top brands, fast nationwide shipping, and local technical support.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/shop/"
              className="w-full sm:w-auto bg-[#8C4A2F] hover:bg-[#A35839] text-white px-8 py-4 rounded-xl text-base font-bold transition-all shadow-xl shadow-[#8C4A2F]/20 flex items-center justify-center gap-2 group"
            >
              <span>Explore E-Dirt Bikes</span>
              <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>

            <Link
              href="/compare/"
              className="w-full sm:w-auto bg-[#1D2024] hover:bg-[#252930] text-stone-200 border border-[#2B2F36] px-8 py-4 rounded-xl text-base font-bold transition flex items-center justify-center gap-2"
            >
              <span>Compare Specs &amp; Models</span>
            </Link>
          </div>

          {/* Quick Stat Anchors */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-[#23272E]/60 text-left font-mono">
            <div className="p-3 bg-[#17191C]/80 rounded-lg border border-[#23272E]">
              <div className="text-xs text-stone-400">Peak Power</div>
              <div className="text-lg font-bold text-amber-400">22,000 W</div>
            </div>
            <div className="p-3 bg-[#17191C]/80 rounded-lg border border-[#23272E]">
              <div className="text-xs text-stone-400">Instant Torque</div>
              <div className="text-lg font-bold text-white">540 Nm</div>
            </div>
            <div className="p-3 bg-[#17191C]/80 rounded-lg border border-[#23272E]">
              <div className="text-xs text-stone-400">Single Charge</div>
              <div className="text-lg font-bold text-white">110 km Range</div>
            </div>
            <div className="p-3 bg-[#17191C]/80 rounded-lg border border-[#23272E]">
              <div className="text-xs text-stone-400">AU Warranty</div>
              <div className="text-lg font-bold text-emerald-400">2-Year Full</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOP CATEGORIES - E-Bike Categories & Accessories Card with 4:3 Grid Uniformity */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Engineered Lineup &amp; Gear
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-1">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/shop/"
            className="text-sm font-semibold text-[#C87D55] hover:text-white inline-flex items-center gap-1 group"
          >
            <span>View Complete 75+ Model Lineup</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {homepageCategories.map((cat) => {
            const targetUrl = `/shop/${cat.slug}/`;
            const isAccessories = cat.slug === 'accessories';
            const unitLabel = isAccessories ? 'Items' : 'Models';

            return (
              <Link
                key={cat.slug}
                href={targetUrl}
                className={`group bg-[#17191C] border rounded-2xl overflow-hidden transition-all flex flex-col hover:shadow-xl hover:shadow-black/50 ${
                  isAccessories
                    ? 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-[#1c1917] to-[#17191C]'
                    : 'border-[#2B2F36] hover:border-[#8C4A2F]'
                }`}
              >
                {/* Image Frame with 4:3 ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                  <SmartImage
                    src={cat.image}
                    alt={`${cat.name} electric dirt bike department`}
                    aspectRatio="4/3"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-transparent to-transparent opacity-80" />
                  <span
                    className={`absolute bottom-3 left-3 text-[11px] font-mono font-bold px-2.5 py-0.5 rounded shadow ${
                      isAccessories ? 'bg-amber-600 text-white' : 'bg-[#8C4A2F] text-white'
                    }`}
                  >
                    {cat.count} {unitLabel}
                  </span>
                  {isAccessories && (
                    <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                      Stands, Haulers &amp; Gear
                    </span>
                  )}
                </div>

                {/* Text Container */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-[#C87D55] transition">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 pt-2 transition-colors ${
                      isAccessories
                        ? 'text-amber-400 group-hover:text-amber-200'
                        : 'text-[#C87D55] group-hover:text-white'
                    }`}
                  >
                    <span>{isAccessories ? 'Explore Accessories' : 'Browse E-Bikes'}</span>
                    <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: FEATURED BIKES - High-Impact Tiles with Full Specs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Ready For Immediate Dispatch
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-1">
              Featured Electric Dirt Bikes
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              • 10% Crypto Discount (BTC/USDT) • Pay in 4 Available
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 4: REVOLUTIONARY REVIEWS SLIDER - Verified Australian Rider Feedback */}
      <ReviewSlider />

      {/* SECTION 5: AI VISIBILITY & BRAND AUTHORITY - Factual "About Australian Electric Motor Co" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Australian Moto Engineering Since {BRAND.foundingYear} &bull; ABN 97 628 671 689
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold uppercase text-white tracking-tight">
              Engineered for Australia. <br />
              Tuned for Raw Performance.
            </h2>
            <p className="text-base text-stone-300 leading-relaxed">
              {BRAND.description}
            </p>

            {/* Differentiation Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {BRAND.differentiation.map((diff, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#1D2024] border border-[#2B2F36] space-y-1.5"
                >
                  <div className="text-[#C87D55] font-bold text-sm flex items-center gap-2">
                    <span>⚡</span>
                    <span>Engineering Benchmark #{idx + 1}</span>
                  </div>
                  <p className="text-xs text-stone-400 leading-relaxed">{diff}</p>
                </div>
              ))}
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <Link
                href="/about/"
                className="bg-[#8C4A2F] hover:bg-[#A35839] text-white px-6 py-3 rounded-xl text-sm font-bold transition"
              >
                Read Our Company Story &rarr;
              </Link>
              <Link
                href="/contact/"
                className="bg-[#1D2024] hover:bg-[#24282E] text-stone-200 border border-[#2B2F36] px-6 py-3 rounded-xl text-sm font-bold transition"
              >
                Book NSW Test Ride &amp; Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MODEL COMPARISON TEASER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#141619] border border-[#23272E] rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Side-by-Side Specs
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
              Need Help Choosing Your E-Dirt Bike?
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              Compare peak kilowatts, Molicel battery capacities, total vehicle weights, suspension travel, and outback trail ranges across our entire fleet.
            </p>
          </div>
          <Link
            href="/compare/"
            className="flex-shrink-0 bg-[#8C4A2F] hover:bg-[#A35839] text-white px-8 py-4 rounded-xl text-sm font-bold transition shadow-lg"
          >
            Launch Full Comparison Matrix &rarr;
          </Link>
        </div>
      </section>

      {/* SECTION 6: TRAIL TECH BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Field Reports &amp; Tech Guides
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight mt-1">
              Trail Tech &amp; Outpost Insights
            </h2>
          </div>
          <Link
            href="/blog/"
            className="text-sm font-semibold text-[#C87D55] hover:text-white inline-flex items-center gap-1 group"
          >
            <span>All Articles</span>
            <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group bg-[#17191C] border border-[#2B2F36] rounded-2xl overflow-hidden hover:border-[#8C4A2F] transition-all flex flex-col"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-black">
                <SmartImage
                  src={post.image}
                  alt={post.title}
                  aspectRatio="4/3"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-[#17191C]/90 text-[#C87D55] text-[10px] font-mono font-bold px-2.5 py-1 rounded">
                  {post.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="text-[11px] font-mono text-stone-500">
                    {post.date} • {post.readTime}
                  </div>
                  <h3 className="text-base font-bold text-white group-hover:text-[#C87D55] transition line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#C87D55] inline-flex items-center gap-1 pt-2">
                  <span>Read Article</span>
                  <span>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 7: DIRECT-ANSWER FAQ - Conforming to FAQPage Schema */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            Rider Knowledge Base
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Direct, factual answers regarding battery longevity, top speeds, Australian off-road compliance, and logistics.
          </p>
        </div>

        <div className="space-y-4">
          {FAQ.slice(0, 5).map((item, index) => (
            <div
              key={index}
              className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-6 space-y-2 hover:border-[#8C4A2F]/60 transition"
            >
              <h3 className="text-base font-bold text-stone-100 flex items-start gap-3">
                <span className="text-[#C87D55] font-mono">Q.</span>
                <span>{item.question}</span>
              </h3>
              <p className="text-sm text-stone-300 pl-7 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <Link
            href="/faq/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#C87D55] hover:text-white transition"
          >
            <span>Read All Rider &amp; Logistics FAQs</span>
            <span>&rarr;</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
