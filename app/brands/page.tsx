import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { CATEGORIES, PRODUCTS, SITE, BRAND, CONTACT } from '@/config/site';

export const metadata: Metadata = {
  title: 'Electric Dirt Bike Brands Australia | Surron, Talaria, Stark, Dirt & Co',
  description:
    'Explore leading electric dirt bike brands in Australia. Official Australian warranties, spare parts warehouse in Queensland, and national crated delivery on Surron, Talaria, Stark Future, Dirt & Co, and more.',
  alternates: {
    canonical: `https://${SITE.domain}/brands/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Electric Dirt Bike Brands Australia | Surron, Talaria, Stark, Dirt & Co',
    description:
      'Compare and shop the world\'s leading electric dirt bike brands with Australian factory support, local spare parts stock, and fast crated dispatch.',
    url: `https://${SITE.domain}/brands/`,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Brands Australia | Dirt & Co',
    description:
      'Compare leading electric dirt bike brands with Australian factory warranties and local spare parts.',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'],
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

// Rich brand engineering details to pair with CATEGORIES
const BRAND_DETAILS: Record<
  string,
  {
    origin: string;
    flag: string;
    specialty: string;
    flagship: string;
    powerRange: string;
  }
> = {
  surron: {
    origin: 'Global Trail Icon',
    flag: '⚡',
    specialty: 'Agile Singletrack Enduro & ADR Commuters',
    flagship: 'Ultra Bee & Light Bee X',
    powerRange: '6kW – 12.5kW Peak',
  },
  talaria: {
    origin: 'Gearbox E-Motos',
    flag: '⚙️',
    specialty: 'Sealed Oil-Bath Gearbox, Zero Belt Slips',
    flagship: 'Sting R MX4 & Sting Pro',
    powerRange: '8kW – 13.5kW Peak',
  },
  'stark-future': {
    origin: 'Barcelona / Sweden',
    flag: '🇪🇺',
    specialty: '80HP Motocross Benchmark vs 450cc Four-Strokes',
    flagship: 'Varg 80HP Alpha',
    powerRange: '60HP – 80HP (60kW)',
  },
  'e-ride-pro': {
    origin: 'California, USA',
    flag: '🇺🇸',
    specialty: 'Factory 72V Out-of-the-Crate Screamer',
    flagship: 'SS 2.0 72V Extreme',
    powerRange: '12kW – 15kW Peak',
  },
  ktm: {
    origin: 'Mattighofen, Austria',
    flag: '🇦🇹',
    specialty: 'Factory Youth MX with WP Air Suspension',
    flagship: 'SX-E 5 & Freeride E-XC',
    powerRange: '5kW – 18kW Factory',
  },
  husqvarna: {
    origin: 'Sweden / Austria',
    flag: '🇸🇪',
    specialty: 'Swedish Precision & Youth Competition Minis',
    flagship: 'EE 5 Competition & EE 3',
    powerRange: '3.8kW – 5kW Race',
  },
  gasgas: {
    origin: 'Girona, Spain',
    flag: '🇪🇸',
    specialty: 'Trial & Youth Motocross with Aggressive Geometry',
    flagship: 'MC-E 5 & TXT-E Factory',
    powerRange: '3.8kW – 5kW Race',
  },
  kuberg: {
    origin: 'Handmade in EU',
    flag: '🇨🇿',
    specialty: 'Freestyle Stunt & Youth Competition Platforms',
    flagship: 'Freerider 12kW & Challenger',
    powerRange: '3kW – 12kW Peak',
  },
  oset: {
    origin: 'United Kingdom',
    flag: '🇬🇧',
    specialty: 'World-Championship Winning Electric Trials',
    flagship: '24.0 Racing & TXP-24',
    powerRange: '1.4kW – 2.5kW Trials',
  },
  'rfn-apollo': {
    origin: 'RFN Racing',
    flag: '🏁',
    specialty: 'Chromoly Cradle Chassis & 74V Powerpacks',
    flagship: 'Ares Rally Pro 74V',
    powerRange: '7.5kW – 12.5kW Peak',
  },
  'arctic-leopard': {
    origin: 'Extreme Enduro',
    flag: '🏔️',
    specialty: 'Vertical Trials, Rock Hoppers & Extreme Torque',
    flagship: 'E-XT 800 & E-XE 880',
    powerRange: '12kW – 25kW Extreme',
  },
  stacyc: {
    origin: 'California, USA',
    flag: '🇺🇸',
    specialty: 'Patented Balance-to-Moto Training for Groms',
    flagship: '20eDRIVE & 18eDRIVE',
    powerRange: 'Youth 18V – 36V',
  },
  thumpstar: {
    origin: 'AU / NZ Heritage',
    flag: '🇦🇺',
    specialty: 'Heavy-Duty Pit & Youth Trail Electric Dirt Bikes',
    flagship: 'TSR-E 160 & TSB-E 110',
    powerRange: '1kW – 4kW Youth/Pit',
  },
  ubco: {
    origin: 'New Zealand',
    flag: '🇳🇿',
    specialty: 'Dual-Drive 2X2 Station & Farm Workhorses',
    flagship: '2X2 Work & Adventure',
    powerRange: 'Dual 1kW Hubs (3.1kWh)',
  },
  takani: {
    origin: 'Australia',
    flag: '🇦🇺',
    specialty: 'Accessible Youth & Junior Trail E-Dirt Bikes',
    flagship: 'TK-16 Trail & TK-20',
    powerRange: '500W – 1.5kW Junior',
  },
};

export default function BrandsPage() {
  const brandCategories = CATEGORIES.filter(
    (c) => c.section === 'brands' && c.parent === 'brands'
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
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
      <JsonLd data={breadcrumbsSchema} />

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C87D55] font-semibold">Brands</span>
      </nav>

      {/* Hero Header with Exactly One H1 */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#17191C] border border-[#2B2F36] p-6 sm:p-10">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            Authorised Importers &amp; Racing Lineups
          </span>
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight">
            Electric Dirt Bike Brands in Australia
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Dirt &amp; Co stocks and supports Australia’s premier collection of 75 electric dirt bikes across 15 manufacturers. Every bike is backed by local spare parts in Queensland, comprehensive factory warranties, and national crated delivery.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
            <span className="bg-[#8C4A2F]/20 text-[#E89569] border border-[#8C4A2F]/40 px-2.5 py-0.5 rounded-full font-bold">
              15 Authorised Brands
            </span>
            <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              75 Australian Spec Models
            </span>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
              100% Genuine Spare Parts Stocked
            </span>
          </div>
        </div>
      </div>

      {/* Brands Cards Grid: Smaller, Prettier & Highly Responsive */}
      <section aria-labelledby="all-brands-heading" className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="all-brands-heading" className="text-lg sm:text-xl font-bold uppercase text-white tracking-tight">
              All 15 Authorised Showrooms
            </h2>
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              Select any brand to explore its 5 model lineup, specifications, and genuine accessories
            </p>
          </div>
          <span className="text-xs font-mono text-[#C87D55] hidden sm:inline-block">
            15 Brands · 5 Bikes Each
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {brandCategories.map((brand) => {
            const details = BRAND_DETAILS[brand.slug] || {
              origin: 'Authorised Importer',
              flag: '🏍️',
              specialty: 'High-Performance Electric Motocross',
              flagship: 'Flagship Edition',
              powerRange: 'High Output',
            };

            // Count products matching this brand (5 models each)
            const matchingCount = PRODUCTS.filter(
              (p: any) =>
                p.brand === brand.slug ||
                (p.parentCategories && p.parentCategories.includes(brand.slug))
            ).length;

            return (
              <Link
                key={brand.slug}
                href={`/brands/${brand.slug}/`}
                className="group relative bg-[#17191C]/95 hover:bg-[#1C2026] border border-[#2B2F36] hover:border-[#C87D55] rounded-xl overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#C87D55]/5 hover:-translate-y-1"
              >
                <div>
                  {/* Compact Aspect Ratio Image Tile */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/60">
                    <SmartImage
                      src={brand.image}
                      alt={`${brand.name} electric dirt bikes Australia`}
                      aspectRatio="4/3"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-[#17191C]/30 to-transparent" />

                    {/* Top Origin Tag */}
                    <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-sm border border-white/10 text-stone-200 text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 shadow">
                      <span>{details.flag}</span>
                      <span className="font-medium text-stone-300 truncate max-w-[85px]">{details.origin}</span>
                    </div>

                    {/* Model Count Tag */}
                    <div className="absolute top-2 right-2 bg-[#8C4A2F]/90 text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                      {matchingCount > 0 ? `${matchingCount} Bikes` : '5 Bikes'}
                    </div>
                  </div>

                  {/* Compact Body */}
                  <div className="p-3 sm:p-3.5 space-y-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-black uppercase text-white group-hover:text-[#C87D55] transition tracking-tight truncate">
                        {brand.name}
                      </h3>
                      <p className="text-[10px] font-mono text-stone-400 line-clamp-1 mt-0.5">
                        {details.specialty}
                      </p>
                    </div>

                    {/* Compact Specs Box */}
                    <div className="bg-[#121417] border border-[#22262E] rounded-lg p-2 space-y-1 text-[10px] font-mono">
                      <div className="flex items-center justify-between text-stone-400">
                        <span className="text-stone-500">Flagship:</span>
                        <span className="text-stone-200 font-semibold truncate max-w-[100px] text-right">
                          {details.flagship}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-stone-400">
                        <span className="text-stone-500">Power:</span>
                        <span className="text-amber-400 font-bold text-right">
                          {details.powerRange}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-3 sm:px-3.5 py-2.5 border-t border-[#22262E] bg-black/20 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-stone-400 group-hover:text-white font-medium transition">
                    View Range
                  </span>
                  <span className="text-[#C87D55] group-hover:translate-x-1 transition-transform">
                    &rarr;
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Brand Authority & Support Assurance */}
      <section className="bg-[#17191C] border border-[#2B2F36] rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
            Australian Warranty &amp; Spare Parts
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-white">
            Why Purchase Your Brand E-Moto Through Dirt &amp; Co?
          </h2>
          <p className="text-sm text-stone-300 leading-relaxed">
            Gray-market and unverified imports leave riders stranded when controllers pop or batteries degrade. Every brand bike purchased through Dirt &amp; Co includes official Australian factory warranty coverage, certified ADR road compliance on road-legal models, and immediate access to our Queensland spare parts warehouse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-[#23272E]">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase font-mono">1. Local AU Warehouse</h3>
            <p className="text-xs text-stone-400">
              Spare battery packs, fast chargers, sprockets, brake rotors, and controllers on shelf in Sunshine Coast QLD.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase font-mono">2. Crated &amp; Pre-Inspected</h3>
            <p className="text-xs text-stone-400">
              Every bike undergoes electrical diagnostic checks and pre-delivery inspection before heavy-duty crating.
            </p>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase font-mono">3. Full Factory Backing</h3>
            <p className="text-xs text-stone-400">
              2-year comprehensive factory warranty on frames, brushless motors, and 72V lithium power modules.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
