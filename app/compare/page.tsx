import React from 'react';
import Link from 'next/link';
import { JsonLd } from '@/components/JsonLd';
import { CompareTool, type CompareBike } from '@/components/CompareTool';
import { PRODUCTS, SHOP, SITE } from '@/config/site';

export const metadata = {
  title: 'Compare Electric Dirt Bikes | Side-by-Side Spec Tool | AEMC',
  description:
    'Pick any two electric dirt bikes and compare power, top speed, range, battery, weight and price side by side. Swap either model to compare the whole Australian lineup.',
  alternates: {
    canonical: `https://${SITE.domain}/compare/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ComparePage() {
  const bikes: CompareBike[] = PRODUCTS.filter(
    (p: any) => p.isBike && p.specs?.Voltage && p.specs?.TopSpeed,
  ).map((p: any) => ({
    slug: p.slug,
    name: p.name,
    brandName: p.brandName || p.brand,
    category: p.category,
    subcategoryName: p.subcategoryName,
    price: p.price,
    image: p.images?.[0] || '',
    roadLegal: p.roadLegal,
    specs: p.specs || {},
  }));

  const breadcrumbsSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://${SITE.domain}/` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Compare Electric Dirt Bikes',
        item: `https://${SITE.domain}/compare/`,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <JsonLd data={breadcrumbsSchema} />

      <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs text-stone-400">
        <Link href="/" className="hover:text-white">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#C87D55]">Compare Models</span>
      </nav>

      <div className="max-w-3xl space-y-4">
        <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#C87D55]">
          Interactive Spec Tool
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white sm:text-5xl">
          Compare Electric Dirt Bikes
        </h1>
        <p className="text-sm leading-relaxed text-stone-300 sm:text-base">
          Choose any two machines from our Australian-engineered lineup to see their power, top speed,
          trail range, battery, weight and price side by side. Change either dropdown at any time to
          compare a different pair.
        </p>
      </div>

      <CompareTool bikes={bikes} cryptoDiscount={SHOP.cryptoDiscount} />

      <div className="rounded-2xl border border-[#23272E] bg-[#141619] p-6 text-center sm:p-8">
        <h2 className="text-lg font-bold uppercase tracking-tight text-white">
          Not sure which pair to start with?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-stone-400">
          Browse the full catalogue or talk to our NSW workshop for a recommendation based on your
          riding style, rider height and where you ride.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/shop/"
            className="rounded-xl bg-[#8C4A2F] px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-[#A35839]"
          >
            Browse All Models &rarr;
          </Link>
          <Link
            href="/contact/"
            className="rounded-xl border border-[#2B2F36] bg-[#17191C] px-6 py-3 text-sm font-bold text-stone-200 transition-colors hover:border-[#8C4A2F]"
          >
            Ask the Workshop
          </Link>
        </div>
      </div>
    </div>
  );
}
