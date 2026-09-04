import React from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';

export interface SubcategoryCard {
  slug: string;
  name: string;
  description?: string;
  image?: string;
  count: number;
}

/** A tidy grid of category tiles for hub pages (Parts, Accessories, Riding Gear). */
export function SubcategoryCards({ items }: { items: SubcategoryCard[] }) {
  if (!items.length) return null;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <Link
          key={c.slug}
          href={`/shop/${c.slug}/`}
          className="group flex flex-col overflow-hidden rounded-2xl border border-[#2B2F36] bg-[#17191C] transition-all hover:border-[#8C4A2F] hover:shadow-xl hover:shadow-black/50"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-black">
            {c.image ? (
              <SmartImage
                src={c.image}
                alt={c.name}
                fill
                fit="cover"
                className=""
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#121417] text-3xl">
                ⚙️
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#17191C] via-transparent to-transparent opacity-80" />
            <span className="absolute bottom-3 left-3 rounded bg-[#8C4A2F] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white shadow">
              {c.count} {c.count === 1 ? 'item' : 'items'}
            </span>
          </div>
          <div className="flex flex-1 flex-col justify-between space-y-2 p-4">
            <div>
              <h3 className="text-base font-bold text-white transition-colors group-hover:text-[#C87D55]">
                {c.name}
              </h3>
              {c.description && (
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-400">
                  {c.description}
                </p>
              )}
            </div>
            <span className="inline-flex items-center gap-1 pt-1 text-xs font-bold uppercase tracking-wider text-[#C87D55] transition-colors group-hover:text-white">
              <span>Browse {c.name}</span>
              <span className="transition-transform group-hover:translate-x-0.5">&rarr;</span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
