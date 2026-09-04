'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';

interface Product {
  slug: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  brandName?: string;
  parentCategories?: string[];
  shortDescription: string;
  description: string;
  badge?: string;
  featured?: boolean;
  images: string[];
  specs?: Record<string, any>;
  sizes?: string[];
  sizesAvailable?: string[];
  safetyStandard?: string;
  certifications?: string[];
  riderCategory?: string;
}

interface CategoryProductGridProps {
  initialProducts: Product[];
  categorySlug: string;
  categoryName: string;
  /** Child categories to expose as a "Category" drill-down filter (hub pages). */
  subcategories?: { slug: string; name: string }[];
}

const PAGE_SIZE = 16;

const GEAR_SLUGS = ['riding-gear', 'helmets', 'body-armour', 'body-armour-protection', 'gloves-goggles', 'boots'];

export function CategoryProductGrid({
  initialProducts,
  categorySlug,
  categoryName,
  subcategories = [],
}: CategoryProductGridProps) {
  const isRidingGear = GEAR_SLUGS.includes(categorySlug);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSub, setSelectedSub] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedRider, setSelectedRider] = useState<'all' | 'adult' | 'kids-youth'>('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedSafety, setSelectedSafety] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

  const subOptions = useMemo(
    () =>
      subcategories.filter((s) =>
        initialProducts.some((p) => p.category === s.slug || p.parentCategories?.includes(s.slug)),
      ),
    [subcategories, initialProducts],
  );

  const brands = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      const b = p.brandName || p.brand;
      if (b) set.add(b);
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [initialProducts]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => (p.sizesAvailable || p.sizes || []).forEach((s) => set.add(s)));
    return [...set].sort();
  }, [initialProducts]);

  const priceBands = useMemo(() => {
    const max = Math.max(0, ...initialProducts.map((p) => p.price));
    const bands: { id: string; label: string; test: (n: number) => boolean }[] = [];
    if (max <= 500) {
      bands.push(
        { id: '0-100', label: 'Under $100', test: (n) => n < 100 },
        { id: '100-250', label: '$100 – $250', test: (n) => n >= 100 && n < 250 },
        { id: '250-500', label: '$250 – $500', test: (n) => n >= 250 && n < 500 },
        { id: '500+', label: '$500+', test: (n) => n >= 500 },
      );
    } else {
      bands.push(
        { id: '0-500', label: 'Under $500', test: (n) => n < 500 },
        { id: '500-2000', label: '$500 – $2,000', test: (n) => n >= 500 && n < 2000 },
        { id: '2000-5000', label: '$2,000 – $5,000', test: (n) => n >= 2000 && n < 5000 },
        { id: '5000-10000', label: '$5,000 – $10,000', test: (n) => n >= 5000 && n < 10000 },
        { id: '10000+', label: '$10,000+', test: (n) => n >= 10000 },
      );
    }
    return bands.filter((b) => initialProducts.some((p) => b.test(p.price)));
  }, [initialProducts]);

  const safetyOptions = [
    { id: 'ECE 22.06', label: 'ECE 22.06 / AS 1698' },
    { id: 'CE Level 2', label: 'CE Level 2' },
    { id: 'CE Level 1', label: 'CE Level 1' },
  ];

  const filtered = useMemo(() => {
    const priceBand = priceBands.find((b) => b.id === selectedPrice);
    const list = initialProducts.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.shortDescription?.toLowerCase().includes(q) &&
          !(p.brandName || p.brand || '').toLowerCase().includes(q)
        )
          return false;
      }
      if (
        selectedSub !== 'all' &&
        p.category !== selectedSub &&
        !p.parentCategories?.includes(selectedSub)
      )
        return false;
      if (selectedBrand !== 'all' && (p.brandName || p.brand) !== selectedBrand) return false;
      if (priceBand && !priceBand.test(p.price)) return false;

      if (selectedRider !== 'all') {
        const rider = (p.riderCategory || p.specs?.RiderCategory || '').toLowerCase();
        const youth =
          rider.includes('youth') ||
          rider.includes('kid') ||
          p.name.toLowerCase().includes('youth') ||
          p.name.toLowerCase().includes('kids') ||
          (p.sizesAvailable || p.sizes || []).some((s) => s.toLowerCase().startsWith('youth'));
        if (selectedRider === 'kids-youth' && !youth) return false;
        if (selectedRider === 'adult' && youth) return false;
      }
      if (selectedSize !== 'all' && !(p.sizesAvailable || p.sizes || []).includes(selectedSize))
        return false;

      if (selectedSafety !== 'all') {
        const hay = [
          p.safetyStandard || '',
          ...(p.certifications || []),
          p.specs?.SafetyStandard || '',
          p.specs?.SafetyCertification || '',
          p.specs?.ChestProtection || '',
          p.specs?.BackProtection || '',
        ]
          .join(' ')
          .toLowerCase();
        if (selectedSafety === 'ECE 22.06' && !hay.includes('ece 22.06') && !hay.includes('1698')) return false;
        if (selectedSafety === 'CE Level 2' && !hay.includes('level 2')) return false;
        if (selectedSafety === 'CE Level 1' && !hay.includes('level 1')) return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return a.price - b.price;
    });
  }, [
    initialProducts,
    priceBands,
    searchQuery,
    selectedSub,
    selectedBrand,
    selectedPrice,
    selectedRider,
    selectedSize,
    selectedSafety,
    sortBy,
  ]);

  const activeCount =
    (searchQuery.trim() ? 1 : 0) +
    (selectedSub !== 'all' ? 1 : 0) +
    (selectedBrand !== 'all' ? 1 : 0) +
    (selectedPrice !== 'all' ? 1 : 0) +
    (selectedRider !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedSafety !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSub('all');
    setSelectedBrand('all');
    setSelectedPrice('all');
    setSelectedRider('all');
    setSelectedSize('all');
    setSelectedSafety('all');
    setSortBy('default');
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedSub, selectedBrand, selectedPrice, selectedRider, selectedSize, selectedSafety, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  const changePage = (p: number) => {
    setPage(p);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const selectClass =
    'w-full rounded-lg border border-[#2B2F36] bg-[#121417] px-3 py-2 text-sm text-stone-200 transition-colors focus-visible:border-[#C87D55] focus-visible:outline-none';
  const groupLabel = 'mb-1.5 block font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-400';

  /* -------- the filter controls, shared between the desktop rail and the mobile panel -------- */
  const FilterControls = (
    <div className="space-y-5">
      {subOptions.length > 1 && (
        <div>
          <label htmlFor="f-sub" className={groupLabel}>Category</label>
          <select id="f-sub" value={selectedSub} onChange={(e) => setSelectedSub(e.target.value)} className={selectClass}>
            <option value="all">All categories</option>
            {subOptions.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>
      )}

      {brands.length > 1 && (
        <div>
          <label htmlFor="f-brand" className={groupLabel}>Brand</label>
          <select id="f-brand" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className={selectClass}>
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      )}

      {priceBands.length > 1 && (
        <div>
          <label htmlFor="f-price" className={groupLabel}>Price</label>
          <select id="f-price" value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} className={selectClass}>
            <option value="all">Any price</option>
            {priceBands.map((b) => (
              <option key={b.id} value={b.id}>{b.label}</option>
            ))}
          </select>
        </div>
      )}

      {isRidingGear && (
        <>
          <div>
            <span className={groupLabel}>Rider</span>
            <div className="flex gap-1.5">
              {([['all', 'All'], ['adult', 'Adult'], ['kids-youth', 'Youth']] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedRider(id)}
                  className={`flex-1 rounded-lg px-2 py-2 text-xs font-mono transition-colors ${
                    selectedRider === id
                      ? 'bg-[#8C4A2F] font-bold text-white'
                      : 'border border-[#2B2F36] bg-[#121417] text-stone-400 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {sizes.length > 0 && (
            <div>
              <label htmlFor="f-size" className={groupLabel}>Size</label>
              <select id="f-size" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)} className={selectClass}>
                <option value="all">All sizes</option>
                {sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="f-safety" className={groupLabel}>Safety standard</label>
            <select id="f-safety" value={selectedSafety} onChange={(e) => setSelectedSafety(e.target.value)} className={selectClass}>
              <option value="all">All standards</option>
              {safetyOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {activeCount > 0 && (
        <button
          type="button"
          onClick={resetFilters}
          className="text-xs font-mono text-rose-400 underline transition-colors hover:text-rose-300"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div ref={gridTop} className="lg:grid lg:grid-cols-[240px_1fr] lg:gap-8">
      {/* ---------------- Left rail (filters) ---------------- */}
      <aside className="mb-6 lg:mb-0">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen((v) => !v)}
          aria-expanded={mobileFiltersOpen}
          className="flex w-full items-center justify-between rounded-xl border border-[#2B2F36] bg-[#17191C] px-4 py-3 text-sm font-bold text-white lg:hidden"
        >
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 text-[#C87D55]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 10h12M10 16h4" />
            </svg>
            Filters{activeCount > 0 ? ` (${activeCount})` : ''}
          </span>
          <svg className={`h-4 w-4 transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          className={`${mobileFiltersOpen ? 'mt-3 block' : 'hidden'} rounded-2xl border border-[#2B2F36] bg-[#17191C] p-5 lg:sticky lg:top-24 lg:mt-0 lg:block`}
        >
          <h2 className="mb-4 hidden font-mono text-xs font-bold uppercase tracking-widest text-[#C87D55] lg:block">
            Refine
          </h2>
          {FilterControls}
        </div>
      </aside>

      {/* ---------------- Main column ---------------- */}
      <div className="space-y-6">
        {/* Top bar — search + sort + count */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryName}…`}
              aria-label={`Search ${categoryName}`}
              className="w-full rounded-xl border border-[#2B2F36] bg-[#121417] py-2.5 pl-10 pr-9 text-sm text-stone-100 placeholder-stone-500 transition-colors focus-visible:border-[#C87D55] focus-visible:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 sm:shrink-0">
            <label htmlFor="sort" className="font-mono text-xs text-stone-400">Sort</label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-[#2B2F36] bg-[#121417] px-3 py-2 text-sm text-stone-200 transition-colors focus-visible:border-[#C87D55] focus-visible:outline-none"
            >
              <option value="default">Featured</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>

        <p className="font-mono text-xs text-stone-400">
          {filtered.length === 0
            ? 'No matches'
            : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`}
          {filtered.length !== initialProducts.length && ` · ${initialProducts.length} total`}
        </p>

        {/* Grid */}
        {pageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            <Pagination page={safePage} pageCount={pageCount} onChange={changePage} className="pt-4" />
          </>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[#2B2F36] bg-[#17191C] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#121417] text-xl text-amber-400">
              🔍
            </div>
            <h3 className="text-lg font-bold uppercase text-white">Nothing matches those filters</h3>
            <p className="mx-auto max-w-md text-xs text-stone-400">
              Try a broader search, or clear a filter to widen the range.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg bg-[#8C4A2F] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#A35839]"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
