'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
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
  roadLegal?: boolean;
  images: string[];
  specs?: Record<string, any>;
  sizes?: string[];
  sizesAvailable?: string[];
  safetyStandard?: string;
  certifications?: string[];
  riderCategory?: string;
  fitment?: string[];
  subcategoryName?: string;
}

const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Build a searchable text blob for a product. */
const haystack = (p: Product) =>
  normalize(
    [
      p.name,
      p.brandName,
      p.brand,
      p.category,
      p.subcategoryName,
      p.shortDescription,
      p.description,
      ...(p.fitment || []),
      ...(p.specs ? Object.values(p.specs) : []),
    ]
      .filter(Boolean)
      .join(' '),
  );

/** Match if the query (or each of its words) is a substring of, or word-prefix within, the product text. Works from the first character. */
const matchesSearch = (p: Product, rawQuery: string) => {
  const q = normalize(rawQuery);
  if (!q) return true;
  const text = haystack(p);
  if (text.includes(q)) return true;
  const words = text.split(' ');
  return q.split(' ').every((qw) => words.some((w) => w.startsWith(qw)));
};

interface SubCat {
  slug: string;
  name: string;
  group?: string;
}

interface CategoryProductGridProps {
  initialProducts: Product[];
  categorySlug: string;
  categoryName: string;
  /** Child categories exposed as a visible "Category" facet (hub / shop pages). */
  subcategories?: SubCat[];
}

const PAGE_SIZE = 16;
const EAGER = 8;

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
  const [selectedLegal, setSelectedLegal] = useState<'all' | 'legal' | 'offroad'>('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');
  const [page, setPage] = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const gridTop = useRef<HTMLDivElement>(null);

  const inSub = (p: Product, slug: string) =>
    p.category === slug || !!p.parentCategories?.includes(slug);

  const isYouth = (p: Product) => {
    const rider = (p.riderCategory || p.specs?.RiderCategory || '').toLowerCase();
    return (
      rider.includes('youth') ||
      rider.includes('kid') ||
      /\b(youth|kids?|junior|mini|balance)\b/i.test(p.name) ||
      (p.sizesAvailable || p.sizes || []).some((s) => /^(youth|kids)/i.test(s))
    );
  };

  const isRoadLegal = (p: Product) =>
    p.roadLegal === true ||
    /road[-\s]?legal|adr|l1e/i.test(p.badge || '') ||
    p.category.includes('road-legal') ||
    p.category.includes('adr');

  const safetyMatch = (p: Product, id: string) => {
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
    if (id === 'ECE 22.06') return hay.includes('ece 22.06') || hay.includes('1698');
    if (id === 'CE Level 2') return hay.includes('level 2');
    if (id === 'CE Level 1') return hay.includes('level 1') || hay.includes('level 2');
    return true;
  };

  const priceBandDefs = useMemo(() => {
    const max = Math.max(0, ...initialProducts.map((p) => p.price));
    return max <= 600
      ? [
          { id: '0-50', label: 'Under $50', lo: 0, hi: 50 },
          { id: '50-150', label: '$50 – $150', lo: 50, hi: 150 },
          { id: '150-350', label: '$150 – $350', lo: 150, hi: 350 },
          { id: '350+', label: '$350+', lo: 350, hi: Infinity },
        ]
      : [
          { id: '0-500', label: 'Under $500', lo: 0, hi: 500 },
          { id: '500-2000', label: '$500 – $2,000', lo: 500, hi: 2000 },
          { id: '2000-5000', label: '$2,000 – $5,000', lo: 2000, hi: 5000 },
          { id: '5000-10000', label: '$5,000 – $10,000', lo: 5000, hi: 10000 },
          { id: '10000+', label: '$10,000+', lo: 10000, hi: Infinity },
        ];
  }, [initialProducts]);

  // one predicate per dimension — used both for the final list and for dependent facet counts
  const preds = {
    search: (p: Product) => matchesSearch(p, searchQuery),
    sub: (p: Product) => selectedSub === 'all' || inSub(p, selectedSub),
    brand: (p: Product) => selectedBrand === 'all' || (p.brandName || p.brand) === selectedBrand,
    price: (p: Product) => {
      if (selectedPrice === 'all') return true;
      const b = priceBandDefs.find((x) => x.id === selectedPrice);
      return !b || (p.price >= b.lo && p.price < b.hi);
    },
    legal: (p: Product) =>
      selectedLegal === 'all' ||
      (selectedLegal === 'legal' ? isRoadLegal(p) : !isRoadLegal(p)),
    rider: (p: Product) =>
      selectedRider === 'all' ||
      (selectedRider === 'kids-youth' ? isYouth(p) : !isYouth(p)),
    size: (p: Product) =>
      selectedSize === 'all' || (p.sizesAvailable || p.sizes || []).includes(selectedSize),
    safety: (p: Product) => selectedSafety === 'all' || safetyMatch(p, selectedSafety),
  };

  const passExcept = (p: Product, skip: keyof typeof preds) =>
    (Object.keys(preds) as (keyof typeof preds)[]).every((k) => k === skip || preds[k](p));

  // ---- dependent facets: each list/count reflects every OTHER active filter ----
  const subOptions = useMemo(() => {
    return subcategories
      .map((s) => ({
        ...s,
        count: initialProducts.filter((p) => passExcept(p, 'sub') && inSub(p, s.slug)).length,
      }))
      .filter((s) => s.count > 0 || selectedSub === s.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subcategories, initialProducts, searchQuery, selectedBrand, selectedPrice, selectedLegal, selectedRider, selectedSize, selectedSafety]);
  const subCount = useMemo(() => {
    const m: Record<string, number> = {};
    subOptions.forEach((s) => (m[s.slug] = s.count));
    return m;
  }, [subOptions]);

  const brands = useMemo(() => {
    const m = new Map<string, number>();
    initialProducts.forEach((p) => {
      if (!passExcept(p, 'brand')) return;
      const b = p.brandName || p.brand;
      if (b) m.set(b, (m.get(b) || 0) + 1);
    });
    if (selectedBrand !== 'all' && !m.has(selectedBrand)) m.set(selectedBrand, 0);
    return [...m.keys()].sort((a, b) => a.localeCompare(b));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts, searchQuery, selectedSub, selectedPrice, selectedLegal, selectedRider, selectedSize, selectedSafety, selectedBrand]);

  const sizes = useMemo(() => {
    const set = new Set<string>();
    initialProducts.forEach((p) => {
      if (passExcept(p, 'size')) (p.sizesAvailable || p.sizes || []).forEach((s) => set.add(s));
    });
    return [...set].sort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts, searchQuery, selectedSub, selectedBrand, selectedPrice, selectedLegal, selectedRider, selectedSafety]);

  const priceBands = useMemo(() => {
    return priceBandDefs
      .map((b) => ({
        ...b,
        count: initialProducts.filter((p) => passExcept(p, 'price') && p.price >= b.lo && p.price < b.hi).length,
      }))
      .filter((b) => b.count > 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [priceBandDefs, initialProducts, searchQuery, selectedSub, selectedBrand, selectedLegal, selectedRider, selectedSize, selectedSafety]);

  const hasRoadLegalMix = useMemo(() => {
    let legal = false;
    let off = false;
    initialProducts.forEach((p) => (isRoadLegal(p) ? (legal = true) : (off = true)));
    return legal && off;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts]);

  const safetyOptions = [
    { id: 'ECE 22.06', label: 'ECE 22.06 / AS 1698' },
    { id: 'CE Level 2', label: 'CE Level 2' },
    { id: 'CE Level 1', label: 'CE Level 1' },
  ];

  const filtered = useMemo(() => {
    const list = initialProducts.filter((p) =>
      (Object.keys(preds) as (keyof typeof preds)[]).every((k) => preds[k](p)),
    );
    return list.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (!!b.featured !== !!a.featured) return b.featured ? 1 : -1;
      return a.price - b.price;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialProducts,
    priceBandDefs,
    searchQuery,
    selectedSub,
    selectedBrand,
    selectedPrice,
    selectedLegal,
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
    (selectedLegal !== 'all' ? 1 : 0) +
    (selectedRider !== 'all' ? 1 : 0) +
    (selectedSize !== 'all' ? 1 : 0) +
    (selectedSafety !== 'all' ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSub('all');
    setSelectedBrand('all');
    setSelectedPrice('all');
    setSelectedLegal('all');
    setSelectedRider('all');
    setSelectedSize('all');
    setSelectedSafety('all');
    setSortBy('default');
  };

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedSub, selectedBrand, selectedPrice, selectedLegal, selectedRider, selectedSize, selectedSafety, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filtered.length);

  const changePage = (p: number) => {
    setPage(p);
    gridTop.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const groupLabel = 'mb-2 block font-mono text-[11px] font-semibold uppercase tracking-wider text-stone-400';
  const selectClass =
    'w-full rounded-lg border border-[#2B2F36] bg-[#121417] px-3 py-2 text-sm text-stone-200 transition-colors focus-visible:border-[#C87D55] focus-visible:outline-none';

  // grouped subcategory list
  const groups = useMemo(() => {
    const g = new Map<string, SubCat[]>();
    subOptions.forEach((s) => {
      const key = s.group || '';
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(s);
    });
    return [...g.entries()];
  }, [subOptions]);

  const OptionRow = ({
    active,
    onClick,
    label,
    count,
  }: {
    active: boolean;
    onClick: () => void;
    label: string;
    count?: number;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
        active ? 'bg-[#8C4A2F] font-semibold text-white' : 'text-stone-300 hover:bg-[#20242A]'
      }`}
    >
      <span className="truncate">{label}</span>
      {typeof count === 'number' && (
        <span className={`font-mono text-[11px] ${active ? 'text-white/80' : 'text-stone-500'}`}>{count}</span>
      )}
    </button>
  );

  /** Category facet row that navigates to the category's own indexable page. */
  const CategoryLinkRow = ({
    href,
    active,
    label,
    count,
  }: {
    href: string;
    active: boolean;
    label: string;
    count?: number;
  }) => (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition-colors ${
        active ? 'bg-[#8C4A2F] font-semibold text-white' : 'text-stone-300 hover:bg-[#20242A] hover:text-white'
      }`}
    >
      <span className="truncate">{label}</span>
      {typeof count === 'number' && (
        <span className={`font-mono text-[11px] ${active ? 'text-white/80' : 'text-stone-500'}`}>{count}</span>
      )}
    </Link>
  );

  const FilterControls = (
    <div className="space-y-6">
      {subOptions.length > 1 && (
        <div>
          <span className={groupLabel}>Category</span>
          <div className="space-y-3">
            <CategoryLinkRow
              href="/shop/"
              active={categorySlug === 'all'}
              label="All categories"
              count={initialProducts.length}
            />
            {groups.map(([groupName, items], gi) => (
              <div key={groupName || gi} className="space-y-0.5">
                {groupName && (
                  <p className="px-2.5 pb-0.5 pt-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#C87D55]">
                    {groupName}
                  </p>
                )}
                {items.map((s) => (
                  <CategoryLinkRow
                    key={s.slug}
                    href={`/shop/${s.slug}/`}
                    active={categorySlug === s.slug}
                    label={s.name}
                    count={subCount[s.slug]}
                  />
                ))}
              </div>
            ))}
          </div>
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

      {hasRoadLegalMix && (
        <div>
          <span className={groupLabel}>Road use</span>
          <div className="flex gap-1.5">
            {([['all', 'All'], ['legal', 'Road-legal'], ['offroad', 'Off-road']] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedLegal(id)}
                className={`flex-1 rounded-lg px-2 py-2 text-xs font-mono transition-colors ${
                  selectedLegal === id
                    ? 'bg-[#8C4A2F] font-bold text-white'
                    : 'border border-[#2B2F36] bg-[#121417] text-stone-400 hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {priceBands.length > 1 && (
        <div>
          <span className={groupLabel}>Price</span>
          <div className="space-y-0.5">
            <OptionRow active={selectedPrice === 'all'} onClick={() => setSelectedPrice('all')} label="Any price" />
            {priceBands.map((b) => (
              <OptionRow
                key={b.id}
                active={selectedPrice === b.id}
                onClick={() => setSelectedPrice(b.id)}
                label={b.label}
                count={b.count}
              />
            ))}
          </div>
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
    <div ref={gridTop} className="lg:grid lg:grid-cols-[256px_1fr] lg:gap-8">
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
          className={`${mobileFiltersOpen ? 'mt-3 block' : 'hidden'} rounded-2xl border border-[#2B2F36] bg-[#17191C] p-5 lg:sticky lg:top-24 lg:mt-0 lg:block lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto`}
        >
          <div className="mb-4 hidden items-center justify-between lg:flex">
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-[#C87D55]">Refine</h2>
            {activeCount > 0 && (
              <button type="button" onClick={resetFilters} className="font-mono text-[11px] text-rose-400 underline hover:text-rose-300">
                Reset
              </button>
            )}
          </div>
          {FilterControls}
        </div>
      </aside>

      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <svg className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          {filtered.length === 0 ? 'No matches' : `Showing ${rangeStart}–${rangeEnd} of ${filtered.length}`}
          {filtered.length !== initialProducts.length && ` · ${initialProducts.length} total`}
        </p>

        {pageItems.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {pageItems.map((product, i) => (
                <ProductCard key={product.slug} product={product} priority={i < EAGER} />
              ))}
            </div>
            <Pagination page={safePage} pageCount={pageCount} onChange={changePage} className="pt-4" />
          </>
        ) : (
          <div className="space-y-4 rounded-2xl border border-[#2B2F36] bg-[#17191C] p-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#121417] text-xl text-amber-400">🔍</div>
            <h3 className="text-lg font-bold uppercase text-white">Nothing matches those filters</h3>
            <p className="mx-auto max-w-md text-xs text-stone-400">Try a broader search, or clear a filter to widen the range.</p>
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
