'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';

export interface CompareBike {
  slug: string;
  name: string;
  brandName?: string;
  category: string;
  subcategoryName?: string;
  price: number;
  image: string;
  roadLegal?: boolean;
  specs: Record<string, string | undefined>;
}

interface CompareToolProps {
  bikes: CompareBike[];
  cryptoDiscount?: number;
}

/** Spec rows shown in the matrix. `better` marks rows where a higher number wins. */
const SPEC_ROWS: { label: string; key: string; better?: 'high' }[] = [
  { label: 'Peak Power', key: 'PeakPower', better: 'high' },
  { label: 'Top Speed', key: 'TopSpeed', better: 'high' },
  { label: 'Trail Range', key: 'Range', better: 'high' },
  { label: 'Battery', key: 'Battery' },
  { label: 'Voltage', key: 'Voltage', better: 'high' },
  { label: 'Weight', key: 'Weight' },
  { label: 'Road Legal', key: 'RoadLegal' },
  { label: 'Target Rider', key: 'TargetAudience' },
];

const firstNumber = (v?: string): number | null => {
  if (!v) return null;
  const m = v.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

function BikeCard({
  bike,
  discount,
}: {
  bike: CompareBike;
  discount: number;
}) {
  const discounted = discount ? Math.round(bike.price * (1 - discount / 100)) : bike.price;
  return (
    <div className="space-y-3 text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl bg-white">
        <SmartImage src={bike.image} alt={bike.name} fill fit="contain" className="p-3" sizes="220px" />
      </div>
      {bike.brandName && (
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C87D55]">
          {bike.brandName}
        </div>
      )}
      <div className="text-sm font-bold leading-snug text-white">{bike.name}</div>
      <div>
        <div className="font-mono text-base font-black text-white">
          ${bike.price.toLocaleString()} AUD
        </div>
        {discount > 0 && (
          <div className="font-mono text-[11px] text-emerald-400">
            ⚡ {discount}% crypto: ${discounted.toLocaleString()}
          </div>
        )}
      </div>
      <Link
        href={`/shop/${bike.category}/${bike.slug}/`}
        className="inline-block rounded-lg bg-[#8C4A2F] px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#A35839]"
      >
        View Bike &rarr;
      </Link>
    </div>
  );
}

export function CompareTool({ bikes, cryptoDiscount = 0 }: CompareToolProps) {
  const sorted = useMemo(
    () => [...bikes].sort((a, b) => a.name.localeCompare(b.name)),
    [bikes],
  );

  // Dropdowns stay alphabetical, but seed the tool with two headline adult
  // machines rather than whatever sorts first.
  const [defA, defB] = useMemo(() => {
    const adult = bikes.filter(
      (b) =>
        b.category === 'full-size-motocross' ||
        b.category === 'trail-mid-weight-enduro',
    );
    const pick = adult.length >= 2 ? adult : sorted;
    return [pick[0]?.slug ?? sorted[0]?.slug ?? '', pick[1]?.slug ?? sorted[1]?.slug ?? ''];
  }, [bikes, sorted]);

  const [aSlug, setASlug] = useState(defA);
  const [bSlug, setBSlug] = useState(defB);

  const bikeA = sorted.find((x) => x.slug === aSlug) ?? sorted[0];
  const bikeB = sorted.find((x) => x.slug === bSlug) ?? sorted[1] ?? sorted[0];

  if (!bikeA || !bikeB) return null;

  const Picker = ({
    id,
    label,
    value,
    onChange,
  }: {
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
  }) => (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="font-mono text-[11px] font-bold uppercase tracking-widest text-stone-400"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-[#2B2F36] bg-[#121417] px-3 py-2.5 text-sm text-white transition-colors focus-visible:border-[#8C4A2F] focus-visible:outline-none"
      >
        {sorted.map((bk) => (
          <option key={bk.slug} value={bk.slug}>
            {bk.brandName ? `${bk.brandName} — ` : ''}
            {bk.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2B2F36] bg-[#17191C] shadow-2xl">
      {/* Pickers */}
      <div className="grid grid-cols-1 gap-4 border-b border-[#23272E] bg-[#121417] p-5 sm:grid-cols-2 sm:p-6">
        <Picker id="compare-a" label="Bike A" value={bikeA.slug} onChange={setASlug} />
        <Picker id="compare-b" label="Bike B" value={bikeB.slug} onChange={setBSlug} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 p-5 sm:gap-8 sm:p-8">
        <BikeCard bike={bikeA} discount={cryptoDiscount} />
        <BikeCard bike={bikeB} discount={cryptoDiscount} />
      </div>

      {/* Spec matrix */}
      <table className="w-full border-t border-[#23272E] text-xs font-mono sm:text-sm">
        <caption className="sr-only">
          Specification comparison of {bikeA.name} and {bikeB.name}
        </caption>
        <thead>
          <tr className="border-b border-[#23272E] bg-[#121417]">
            <th scope="col" className="w-1/3 p-3 text-left font-semibold text-stone-400 sm:p-4">
              Spec
            </th>
            <th scope="col" className="p-3 text-center font-bold text-white sm:p-4">
              {bikeA.name}
            </th>
            <th scope="col" className="p-3 text-center font-bold text-white sm:p-4">
              {bikeB.name}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#23272E]">
          <tr>
            <th scope="row" className="p-3 text-left font-semibold text-stone-400 sm:p-4">
              Category
            </th>
            <td className="p-3 text-center text-stone-200 sm:p-4">
              {bikeA.subcategoryName || bikeA.category.replace(/-/g, ' ')}
            </td>
            <td className="p-3 text-center text-stone-200 sm:p-4">
              {bikeB.subcategoryName || bikeB.category.replace(/-/g, ' ')}
            </td>
          </tr>
          <tr>
            <th scope="row" className="p-3 text-left font-semibold text-stone-400 sm:p-4">
              Price (GST incl.)
            </th>
            {[bikeA, bikeB].map((bk, i) => {
              const other = i === 0 ? bikeB : bikeA;
              const cheaper = bk.price < other.price;
              return (
                <td
                  key={bk.slug + i}
                  className={`p-3 text-center font-bold sm:p-4 ${
                    cheaper ? 'text-emerald-400' : 'text-white'
                  }`}
                >
                  ${bk.price.toLocaleString()}
                  {cheaper && <span aria-hidden="true"> ▼</span>}
                </td>
              );
            })}
          </tr>

          {SPEC_ROWS.map((row) => {
            const va = bikeA.specs?.[row.key];
            const vb = bikeB.specs?.[row.key];
            let winner: 0 | 1 | null = null;
            if (row.better === 'high') {
              const na = firstNumber(va);
              const nb = firstNumber(vb);
              if (na != null && nb != null && na !== nb) winner = na > nb ? 0 : 1;
            }
            return (
              <tr key={row.key}>
                <th
                  scope="row"
                  className="p-3 text-left font-semibold text-stone-400 sm:p-4"
                >
                  {row.label}
                </th>
                {[va, vb].map((val, i) => (
                  <td
                    key={i}
                    className={`p-3 text-center sm:p-4 ${
                      winner === i ? 'font-bold text-emerald-400' : 'text-stone-200'
                    }`}
                  >
                    {val || '—'}
                    {winner === i && <span aria-hidden="true"> ▲</span>}
                  </td>
                ))}
              </tr>
            );
          })}

          <tr>
            <th scope="row" className="p-3 text-left font-semibold text-stone-400 sm:p-4">
              Warranty
            </th>
            <td className="p-3 text-center text-emerald-400 sm:p-4">2-Year Australian</td>
            <td className="p-3 text-center text-emerald-400 sm:p-4">2-Year Australian</td>
          </tr>
        </tbody>
      </table>

      <p className="border-t border-[#23272E] p-4 text-center font-mono text-[11px] text-stone-500">
        ▲ higher spec &nbsp;·&nbsp; ▼ lower price &nbsp;·&nbsp; change either dropdown to compare other models
      </p>
    </div>
  );
}
