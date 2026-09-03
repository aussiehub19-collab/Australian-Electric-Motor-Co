'use client';

import React from 'react';

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  className?: string;
}

/** Compact, accessible page control: ‹ 1 … 4 [5] 6 … 12 › */
export function Pagination({ page, pageCount, onChange, className = '' }: PaginationProps) {
  if (pageCount <= 1) return null;

  const go = (p: number) => onChange(Math.min(pageCount, Math.max(1, p)));

  // build a windowed list of page numbers with ellipses
  const pages: (number | 'gap')[] = [];
  const push = (p: number) => pages.push(p);
  const window = 1;
  const first = 1;
  const last = pageCount;
  for (let p = first; p <= last; p++) {
    if (p === first || p === last || (p >= page - window && p <= page + window)) {
      push(p);
    } else if (pages[pages.length - 1] !== 'gap') {
      pages.push('gap');
    }
  }

  const btn =
    'inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-mono transition-colors';

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-center gap-1.5 ${className}`}
    >
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className={`${btn} border-[#2B2F36] bg-[#121417] text-stone-300 hover:border-[#8C4A2F] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        &lsaquo;
      </button>

      {pages.map((p, i) =>
        p === 'gap' ? (
          <span key={`gap-${i}`} className="px-1 text-stone-600">
            &hellip;
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btn} ${
              p === page
                ? 'border-[#8C4A2F] bg-[#8C4A2F] font-bold text-white'
                : 'border-[#2B2F36] bg-[#121417] text-stone-300 hover:border-[#8C4A2F]'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page === pageCount}
        aria-label="Next page"
        className={`${btn} border-[#2B2F36] bg-[#121417] text-stone-300 hover:border-[#8C4A2F] disabled:cursor-not-allowed disabled:opacity-40`}
      >
        &rsaquo;
      </button>
    </nav>
  );
}
