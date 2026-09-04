'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';

export interface CompareItem {
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

/** Back-compat alias — the page used to import this name. */
export type CompareBike = CompareItem;

export interface CompareSpecRow {
  label: string;
  /** Candidate spec keys, tried in order — the first present wins. */
  keys: string[];
  better?: 'high';
}

export interface CompareGroup {
  id: string;
  /** Segmented-control label, e.g. "Electric Dirt Bikes". */
  label: string;
  /** Singular noun for buttons, e.g. "Bike", "Battery", "Charger". */
  noun: string;
  items: CompareItem[];
  specRows: CompareSpecRow[];
}

interface CompareToolProps {
  groups: CompareGroup[];
  cryptoDiscount?: number;
}

const firstNumber = (v?: string): number | null => {
  if (!v) return null;
  const m = v.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

const specValue = (item: CompareItem, row: CompareSpecRow): string | undefined => {
  for (const k of row.keys) {
    const v = item.specs?.[k];
    if (v) return v;
  }
  return undefined;
};

function ItemCard({
  item,
  discount,
  noun,
}: {
  item: CompareItem;
  discount: number;
  noun: string;
}) {
  const discounted = discount ? Math.round(item.price * (1 - discount / 100)) : item.price;
  return (
    <div className="space-y-3 text-center">
      <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-xl bg-white">
        <SmartImage src={item.image} alt={item.name} fill fit="contain" className="p-3" sizes="220px" />
      </div>
      {item.brandName && (
        <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C87D55]">
          {item.brandName}
        </div>
      )}
      <div className="text-sm font-bold leading-snug text-white">{item.name}</div>
      <div>
        <div className="font-mono text-base font-black text-white">
          ${item.price.toLocaleString()} AUD
        </div>
        {discount > 0 && (
          <div className="font-mono text-[11px] text-emerald-400">
            ⚡ {discount}% crypto: ${discounted.toLocaleString()}
          </div>
        )}
      </div>
      <Link
        href={`/shop/${item.category}/${item.slug}/`}
        className="inline-block rounded-lg bg-[#8C4A2F] px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-[#A35839]"
      >
        View {noun} &rarr;
      </Link>
    </div>
  );
}

export function CompareTool({ groups, cryptoDiscount = 0 }: CompareToolProps) {
  const usable = groups.filter((g) => g.items.length >= 2);
  const [groupId, setGroupId] = useState(usable[0]?.id ?? '');
  const group = usable.find((g) => g.id === groupId) ?? usable[0];

  const sorted = useMemo(
    () => (group ? [...group.items].sort((a, b) => a.name.localeCompare(b.name)) : []),
    [group],
  );

  // Seed each group with a sensible headline pair.
  const [defA, defB] = useMemo(() => {
    if (!group) return ['', ''];
    const headline =
      group.id === 'bikes'
        ? group.items.filter(
            (b) =>
              b.category === 'full-size-motocross' ||
              b.category === 'trail-mid-weight-enduro',
          )
        : group.items;
    const pick = headline.length >= 2 ? headline : sorted;
    return [pick[0]?.slug ?? sorted[0]?.slug ?? '', pick[1]?.slug ?? sorted[1]?.slug ?? ''];
  }, [group, sorted]);

  const [picked, setPicked] = useState<Record<string, [string, string]>>({});
  const [aSlug, bSlug] = picked[group?.id ?? ''] ?? [defA, defB];

  const setPair = (a: string, b: string) =>
    setPicked((prev) => ({ ...prev, [group.id]: [a, b] }));

  if (!group) return null;

  const itemA = sorted.find((x) => x.slug === aSlug) ?? sorted[0];
  const itemB = sorted.find((x) => x.slug === bSlug) ?? sorted[1] ?? sorted[0];
  if (!itemA || !itemB) return null;

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
        {sorted.map((it) => (
          <option key={it.slug} value={it.slug}>
            {it.brandName ? `${it.brandName} — ` : ''}
            {it.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2B2F36] bg-[#17191C] shadow-2xl">
      {/* Group selector */}
      {usable.length > 1 && (
        <div className="flex flex-wrap gap-2 border-b border-[#23272E] bg-[#141619] p-4 sm:px-6">
          {usable.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setGroupId(g.id)}
              className={`rounded-lg px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                g.id === group.id
                  ? 'bg-[#8C4A2F] text-white'
                  : 'border border-[#2B2F36] bg-[#17191C] text-stone-400 hover:text-white'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      )}

      {/* Pickers */}
      <div className="grid grid-cols-1 gap-4 border-b border-[#23272E] bg-[#121417] p-5 sm:grid-cols-2 sm:p-6">
        <Picker
          id="compare-a"
          label={`${group.noun} A`}
          value={itemA.slug}
          onChange={(v) => setPair(v, itemB.slug)}
        />
        <Picker
          id="compare-b"
          label={`${group.noun} B`}
          value={itemB.slug}
          onChange={(v) => setPair(itemA.slug, v)}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 gap-4 p-5 sm:gap-8 sm:p-8">
        <ItemCard item={itemA} discount={cryptoDiscount} noun={group.noun} />
        <ItemCard item={itemB} discount={cryptoDiscount} noun={group.noun} />
      </div>

      {/* Spec matrix */}
      <div className="overflow-x-auto">
        <table className="w-full border-t border-[#23272E] text-xs font-mono sm:text-sm">
          <caption className="sr-only">
            Specification comparison of {itemA.name} and {itemB.name}
          </caption>
          <thead>
            <tr className="border-b border-[#23272E] bg-[#121417]">
              <th scope="col" className="w-1/3 p-3 text-left font-semibold text-stone-400 sm:p-4">
                Spec
              </th>
              <th scope="col" className="p-3 text-center font-bold text-white sm:p-4">
                {itemA.name}
              </th>
              <th scope="col" className="p-3 text-center font-bold text-white sm:p-4">
                {itemB.name}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#23272E]">
            <tr>
              <th scope="row" className="p-3 text-left font-semibold text-stone-400 sm:p-4">
                Category
              </th>
              <td className="p-3 text-center text-stone-200 sm:p-4">
                {itemA.subcategoryName || itemA.category.replace(/-/g, ' ')}
              </td>
              <td className="p-3 text-center text-stone-200 sm:p-4">
                {itemB.subcategoryName || itemB.category.replace(/-/g, ' ')}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-3 text-left font-semibold text-stone-400 sm:p-4">
                Price (GST incl.)
              </th>
              {[itemA, itemB].map((it, i) => {
                const other = i === 0 ? itemB : itemA;
                const cheaper = it.price < other.price;
                return (
                  <td
                    key={it.slug + i}
                    className={`p-3 text-center font-bold sm:p-4 ${
                      cheaper ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    ${it.price.toLocaleString()}
                    {cheaper && <span aria-hidden="true"> ▼</span>}
                  </td>
                );
              })}
            </tr>

            {group.specRows.map((row) => {
              const va = specValue(itemA, row);
              const vb = specValue(itemB, row);
              if (!va && !vb) return null;
              let winner: 0 | 1 | null = null;
              if (row.better === 'high') {
                const na = firstNumber(va);
                const nb = firstNumber(vb);
                if (na != null && nb != null && na !== nb) winner = na > nb ? 0 : 1;
              }
              return (
                <tr key={row.label}>
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
      </div>

      <p className="border-t border-[#23272E] p-4 text-center font-mono text-[11px] text-stone-500">
        ▲ higher spec &nbsp;·&nbsp; ▼ lower price &nbsp;·&nbsp; change either dropdown to compare other
        {' '}
        {group.noun.toLowerCase()}s
      </p>
    </div>
  );
}
