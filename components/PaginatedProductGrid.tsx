'use client';

import React, { useRef, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';

interface PaginatedProductGridProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  products: any[];
  pageSize?: number;
}

/** Plain 16-per-page product grid — no filters. For brand pages and other fixed listings. */
export function PaginatedProductGrid({ products, pageSize = 16 }: PaginatedProductGridProps) {
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const pageCount = Math.max(1, Math.ceil(products.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const items = products.slice((safePage - 1) * pageSize, safePage * pageSize);
  const rangeStart = products.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, products.length);

  const changePage = (p: number) => {
    setPage(p);
    top.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8" ref={top}>
      {pageCount > 1 && (
        <p className="font-mono text-xs text-stone-400">
          Showing {rangeStart}–{rangeEnd} of {products.length}
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <Pagination page={safePage} pageCount={pageCount} onChange={changePage} className="pt-4" />
    </div>
  );
}
