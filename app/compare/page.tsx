import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { PRODUCTS, SITE } from '@/config/site';

export const metadata = {
  title: 'Compare Electric Dirt Bike Models | Specs & Performance | Dirt & Co',
  description: 'Side-by-side technical comparison of Australian engineered electric dirt bikes. Compare power, battery capacity, range, top speed, and weight.',
  alternates: {
    canonical: `https://${SITE.domain}/compare/`,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default function ComparePage() {
  const bikes: any[] = PRODUCTS.filter((p) => p.category !== 'batteries-performance-parts').slice(0, 8);

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
        name: 'Compare Electric Dirt Bikes',
        item: `https://${SITE.domain}/compare/`,
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
        <span className="text-[#C87D55]">Compare Models</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-4 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
          Interactive Spec Matrix
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Compare Electric Dirt Bikes
        </h1>
        <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
          Evaluate key performance benchmarks across our Australian-engineered electric dirt bike lineup to find the exact power-to-weight ratio for your riding style.
        </p>
      </div>

      {/* Responsive Horizontal Scroll Table */}
      <div className="border border-[#2B2F36] rounded-2xl overflow-hidden bg-[#17191C] shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#121417] border-b border-[#2B2F36]">
                <th className="p-4 sm:p-6 text-stone-400 font-semibold w-48 sticky left-0 bg-[#121417] z-10">
                  Model Feature
                </th>
                {bikes.map((bike) => (
                  <th key={bike.slug} className="p-4 sm:p-6 text-center w-56">
                    <div className="space-y-3">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-white mx-auto max-w-[180px]">
                        <SmartImage
                          src={bike.images[0]}
                          alt={bike.name}
                          aspectRatio="4/3"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="font-bold text-white text-sm truncate px-1">
                        {bike.name}
                      </div>
                      <div className="text-amber-400 font-bold text-base">
                        ${bike.price.toLocaleString()} AUD
                      </div>
                      <Link
                        href={`/shop/${bike.category}/${bike.slug}/`}
                        className="inline-block bg-[#8C4A2F] hover:bg-[#A35839] text-white py-1.5 px-3 rounded text-[11px] font-bold transition"
                      >
                        View Bike &rarr;
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#23272E]">
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Category
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-stone-200">
                    {b.category.replace(/-/g, ' ')}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Peak Power Output
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center font-bold text-amber-400">
                    {b.specs?.PeakPower || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Top Speed
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-white">
                    {b.specs?.TopSpeed || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Estimated Trail Range
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-stone-300">
                    {b.specs?.Range || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Battery System
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-stone-300">
                    {b.specs?.Battery || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Vehicle Weight
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-stone-300">
                    {b.specs?.Weight || '—'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-stone-400 sticky left-0 bg-[#17191C] z-10">
                  Warranty Coverage
                </td>
                {bikes.map((b) => (
                  <td key={b.slug} className="p-4 text-center text-emerald-400">
                    {b.specs?.Warranty || '2-Year Full'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
