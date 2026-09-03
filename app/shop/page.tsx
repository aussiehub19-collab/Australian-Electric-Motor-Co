'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { ProductCard } from '@/components/ProductCard';
import { Pagination } from '@/components/Pagination';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

// 6 Strict Australian Electric Dirt Bike subcategories
const EBIKE_SUBCATEGORIES = [
  {
    slug: 'all',
    name: 'All E-Bikes',
    icon: '⚡',
    description: 'All 75 models across 15 brands',
  },
  {
    slug: 'full-size-motocross',
    name: 'Full-Size Motocross',
    icon: '🏁',
    description: 'Competition MX, 21"/18" wheels, up to 60kW peak',
  },
  {
    slug: 'trail-mid-weight-enduro',
    name: 'Trail & Mid-Weight Enduro',
    icon: '🌲',
    description: 'Nimble bush singletrack weapons & enduro cruisers',
  },
  {
    slug: 'junior-trials-youth-dirt-bikes',
    name: 'Junior Trials & Youth Dirt Bikes',
    icon: '⚡',
    description: 'Youth race bikes, trials modulation & skill builders',
  },
  {
    slug: 'balance-mini-bikes',
    name: 'Balance & Mini Bikes',
    icon: '🧒',
    description: 'Starter e-balance & mini bikes for ages 3 to 9',
  },
  {
    slug: 'adr-road-legal-dirt-bikes',
    name: 'ADR Road-Legal Dirt Bikes',
    icon: '🚦',
    description: 'ADR road-registerable with lights, blinkers & mirrors',
  },
  {
    slug: 'utility-farm-e-bikes',
    name: 'Utility & Farm E-Bikes',
    icon: '🚜',
    description: 'Silent 2WD paddock workhorses for farm mustering',
  },
];

const EBIKE_CATEGORY_SLUGS = [
  'full-size-motocross',
  'trail-mid-weight-enduro',
  'trail-enduro',
  'junior-trials-youth-dirt-bikes',
  'junior-trials',
  'kids-youth-electric-dirt-bikes',
  'balance-mini-bikes',
  'adr-road-legal-dirt-bikes',
  'road-legal-electric-dirt-bikes',
  'utility-farm-e-bikes',
  'utility-farm-ebikes',
  'electric-dirt-bikes',
  'adult-electric-dirt-bikes',
];

function ShopContent() {
  const searchParams = useSearchParams();
  const urlBrand = searchParams.get('brand') || 'all';
  const urlSub = searchParams.get('category') || searchParams.get('sub') || 'all';
  const urlDept = searchParams.get('dept') || 'all';
  const urlQ = searchParams.get('q') || '';
  const urlLegal = (searchParams.get('legal') as 'all' | 'legal' | 'offroad') || 'all';
  const urlPrice = searchParams.get('price') || 'all';
  const urlSort = (searchParams.get('sort') as any) || 'featured';

  const [selectedDepartment, setSelectedDepartment] = useState<string>(urlDept);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(urlSub);
  const [selectedBrand, setSelectedBrand] = useState<string>(urlBrand);
  const [selectedRoadLegal, setSelectedRoadLegal] = useState<'all' | 'legal' | 'offroad'>(urlLegal);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(urlPrice);
  const [searchQuery, setSearchQuery] = useState<string>(urlQ);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'power-desc' | 'name-asc'>(
    ['featured', 'price-asc', 'price-desc', 'power-desc', 'name-asc'].includes(urlSort) ? urlSort : 'featured'
  );

  // Sync if query parameters in URL change during client navigation
  const [prevParamsStr, setPrevParamsStr] = useState(searchParams.toString());
  const currentParamsStr = searchParams.toString();
  if (currentParamsStr !== prevParamsStr) {
    setPrevParamsStr(currentParamsStr);
    if (searchParams.has('brand')) setSelectedBrand(searchParams.get('brand')!);
    if (searchParams.has('category') || searchParams.has('sub')) {
      setSelectedSubcategory(searchParams.get('category') || searchParams.get('sub')!);
    }
    if (searchParams.has('dept')) setSelectedDepartment(searchParams.get('dept')!);
    if (searchParams.has('q')) setSearchQuery(searchParams.get('q')!);
    if (searchParams.has('legal')) setSelectedRoadLegal(searchParams.get('legal') as any);
    if (searchParams.has('price')) setSelectedPriceRange(searchParams.get('price')!);
    if (searchParams.has('sort')) {
      const s = searchParams.get('sort')!;
      if (['featured', 'price-asc', 'price-desc', 'power-desc', 'name-asc'].includes(s)) {
        setSortBy(s as any);
      }
    }
  }

  // Main departments with calculated item counts
  const mainDepartments = useMemo(() => {
    const isEbike = (p: any) =>
      EBIKE_CATEGORY_SLUGS.includes(p.category) ||
      p.parentCategories?.includes('electric-dirt-bikes') ||
      p.roadLegal !== undefined ||
      p.specs?.PeakPower;

    const eBikesCount = PRODUCTS.filter(isEbike).length;
    const partsCount = PRODUCTS.filter((p: any) => p.parentCategories?.includes('parts-upgrades') || p.category === 'parts-upgrades' || p.category.includes('batteries') || p.category.includes('brakes') || p.category.includes('wheels')).length;
    const gearCount = PRODUCTS.filter((p: any) => p.parentCategories?.includes('riding-gear') || p.category === 'riding-gear' || p.category.includes('helmets') || p.category.includes('armor') || p.category.includes('boots')).length;
    const accCount = PRODUCTS.filter((p: any) => p.parentCategories?.includes('accessories') || p.category === 'accessories' || p.category.includes('storage') || p.category.includes('stands')).length;

    return [
      { slug: 'all', name: 'All Inventory', count: PRODUCTS.length, icon: '📦' },
      { slug: 'electric-dirt-bikes', name: 'Electric Dirt Bikes', count: eBikesCount, icon: '⚡' },
      { slug: 'brands', name: 'Shop by Brand', count: CATEGORIES.filter((c) => c.section === 'brands' && c.parent === 'brands').length, icon: '🏷️' },
      { slug: 'parts-upgrades', name: 'Parts & Upgrades', count: partsCount, icon: '⚙️' },
      { slug: 'riding-gear', name: 'Riding Gear', count: gearCount, icon: '🛡️' },
      { slug: 'accessories', name: 'Accessories', count: accCount, icon: '🎒' },
    ];
  }, []);

  // All brand options for brand selector
  const allBrands = useMemo(() => {
    return CATEGORIES.filter((c) => c.section === 'brands' && c.parent === 'brands');
  }, []);

  // Secondary subcategories when a non-e-bike department is chosen
  const departmentSubcategories = useMemo(() => {
    if (selectedDepartment === 'all' || selectedDepartment === 'electric-dirt-bikes') {
      return [];
    }
    if (selectedDepartment === 'brands') {
      return allBrands;
    }
    return CATEGORIES.filter(
      (c) => c.parent === selectedDepartment || (c.section === selectedDepartment && c.parent !== null)
    );
  }, [selectedDepartment, allBrands]);

  // Main filtered products list
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p: any) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc =
          (p.shortDescription || '').toLowerCase().includes(query) ||
          (p.description || '').toLowerCase().includes(query);
        const matchesBrand = (p.brand || '').toLowerCase().includes(query) || (p.brandName || '').toLowerCase().includes(query);
        const matchesCategory = (p.category || '').toLowerCase().includes(query);
        const matchesSubcatName = (p.subcategoryName || '').toLowerCase().includes(query);
        const matchesVoltage = (p.specs?.Voltage || '').toLowerCase().includes(query);
        const matchesPower = (p.specs?.PeakPower || '').toLowerCase().includes(query);

        if (!matchesName && !matchesDesc && !matchesBrand && !matchesCategory && !matchesSubcatName && !matchesVoltage && !matchesPower) {
          return false;
        }
      }

      // 2. Department filter
      if (selectedDepartment !== 'all') {
        if (selectedDepartment === 'electric-dirt-bikes') {
          const isEbike =
            EBIKE_CATEGORY_SLUGS.includes(p.category) ||
            p.parentCategories?.includes('electric-dirt-bikes') ||
            p.roadLegal !== undefined ||
            p.specs?.PeakPower;
          if (!isEbike) return false;
        } else if (selectedDepartment === 'brands') {
          if (selectedBrand !== 'all') {
            const matchesBrand = p.brand === selectedBrand || p.parentCategories?.includes(selectedBrand);
            if (!matchesBrand) return false;
          }
        } else {
          const matchesDept =
            p.category === selectedDepartment ||
            p.parentCategories?.includes(selectedDepartment) ||
            p.category.includes(selectedDepartment.replace('s', ''));
          if (!matchesDept) return false;
        }
      }

      // 3. Subcategory filter
      if (selectedSubcategory !== 'all') {
        if (selectedDepartment === 'brands') {
          const matches = p.brand === selectedSubcategory || p.parentCategories?.includes(selectedSubcategory);
          if (!matches) return false;
        } else {
          // Normalize subcategory matching
          const pCat = p.category;
          const sub = selectedSubcategory;
          const matchesSub =
            pCat === sub ||
            p.parentCategories?.includes(sub) ||
            (sub === 'trail-mid-weight-enduro' && (pCat === 'trail-mid-weight-enduro' || pCat === 'trail-enduro')) ||
            (sub === 'junior-trials-youth-dirt-bikes' && (pCat === 'junior-trials-youth-dirt-bikes' || pCat === 'junior-trials' || pCat === 'kids-youth-electric-dirt-bikes')) ||
            (sub === 'adr-road-legal-dirt-bikes' && (pCat === 'adr-road-legal-dirt-bikes' || pCat === 'road-legal-electric-dirt-bikes' || p.roadLegal === true)) ||
            (sub === 'utility-farm-e-bikes' && (pCat === 'utility-farm-e-bikes' || pCat === 'utility-farm-ebikes'));

          if (!matchesSub) return false;
        }
      }

      // 4. Standalone Brand Filter
      if (selectedBrand !== 'all' && selectedDepartment !== 'brands') {
        const pBrand = (p.brand || '').toLowerCase();
        const pBrandName = (p.brandName || '').toLowerCase();
        const selBrand = selectedBrand.toLowerCase();
        const matchesBrand =
          pBrand === selBrand ||
          p.parentCategories?.includes(selectedBrand) ||
          pBrandName.includes(selBrand) ||
          p.slug.toLowerCase().startsWith(selBrand) ||
          (selBrand === 'stark-future' && (pBrand.includes('stark') || p.name.toLowerCase().includes('stark'))) ||
          (selBrand === 'e-ride-pro' && (pBrand.includes('eride') || pBrand.includes('e-ride') || p.slug.includes('eride'))) ||
          (selBrand === 'rf-apollo' && (pBrand.includes('rf') || pBrand.includes('rfn') || p.slug.includes('rfn') || p.slug.includes('apollo'))) ||
          (selBrand === 'dirt-and-co' && (pBrand.includes('dirt') || p.slug.startsWith('dirt-co')));
        if (!matchesBrand) return false;
      }

      // 5. Road-Legal filter
      if (selectedRoadLegal === 'legal') {
        const isLegal =
          p.roadLegal === true ||
          p.category.includes('road-legal') ||
          p.specs?.RoadLegal?.toLowerCase().includes('yes') ||
          p.badge?.toLowerCase().includes('road legal');
        if (!isLegal) return false;
      } else if (selectedRoadLegal === 'offroad') {
        const isOffroad =
          p.roadLegal === false ||
          p.specs?.RoadLegal?.toLowerCase().includes('no') ||
          p.badge?.toLowerCase().includes('off-road');
        if (!isOffroad) return false;
      }

      // 6. Price Range filter
      if (selectedPriceRange !== 'all') {
        if (selectedPriceRange === 'under-5k' && p.price >= 5000) return false;
        if (selectedPriceRange === '5k-10k' && (p.price < 5000 || p.price > 10000)) return false;
        if (selectedPriceRange === '10k-15k' && (p.price < 10000 || p.price > 15000)) return false;
        if (selectedPriceRange === 'over-15k' && p.price <= 15000) return false;
      }

      return true;
    }).sort((a: any, b: any) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (sortBy === 'power-desc') {
        const getKw = (p: any) => {
          const raw = p.specs?.PeakPower || '';
          const match = raw.match(/([\d.]+)\s*k?W/i);
          return match ? parseFloat(match[1]) : 0;
        };
        return getKw(b) - getKw(a);
      }
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedDepartment, selectedSubcategory, selectedBrand, selectedRoadLegal, selectedPriceRange, searchQuery, sortBy]);

  // Pagination — 16 products per page
  const PAGE_SIZE = 16;
  const [page, setPage] = useState(1);
  const gridTopRef = React.useRef<HTMLDivElement>(null);
  const filterKey = `${selectedDepartment}|${selectedSubcategory}|${selectedBrand}|${selectedRoadLegal}|${selectedPriceRange}|${searchQuery}|${sortBy}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedProducts = filteredProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const rangeStart = filteredProducts.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filteredProducts.length);
  const changePage = (p: number) => {
    setPage(p);
    gridTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleResetFilters = () => {
    setSelectedDepartment('all');
    setSelectedSubcategory('all');
    setSelectedBrand('all');
    setSelectedRoadLegal('all');
    setSelectedPriceRange('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  const isAnyFilterActive =
    selectedDepartment !== 'all' ||
    selectedSubcategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedRoadLegal !== 'all' ||
    selectedPriceRange !== 'all' ||
    searchQuery.trim() !== '';

  // Breadcrumb schema
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
        name: 'Shop Electric Dirt Bikes',
        item: `https://${SITE.domain}/shop/`,
      },
    ],
  };

  const showEbikeSubcategories =
    selectedDepartment === 'all' || selectedDepartment === 'electric-dirt-bikes';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      <JsonLd data={breadcrumbsSchema} />

      {/* Header & Single H1 */}
      <div className="space-y-4 border-b border-[#23272E] pb-6">
        <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
          <Link href="/" className="hover:text-white transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C87D55] font-semibold">Shop</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
              Australian Electric Dirt Bike Catalog &amp; Hardware Depot
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-1">
              Electric Dirt Bikes &amp; Gear
            </h1>
            <p className="text-sm sm:text-base text-stone-300 max-w-3xl mt-2 leading-relaxed">
              Explore Australia’s full 75-model lineup across 15 premier brands (Surron, Talaria, Stark Future, E Ride Pro, KTM, and more). Filter by riding discipline, ADR road compliance, or manufacturer.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 sm:self-end">
            <Link
              href="/brands/"
              className="text-xs font-mono font-bold text-[#E89569] bg-[#8C4A2F]/20 hover:bg-[#8C4A2F]/30 border border-[#8C4A2F]/40 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <span>🏷️</span> All 15 Brands &rarr;
            </Link>
            <div className="text-xs font-mono text-stone-400 bg-[#17191C] px-3.5 py-2 rounded-xl border border-[#2B2F36]">
              Showing <strong className="text-white">{filteredProducts.length}</strong> of {PRODUCTS.length} Models
            </div>
          </div>
        </div>
      </div>

      {/* SPACIOUS, REDESIGNED FILTER SUITE */}
      <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-5 sm:p-7 shadow-xl space-y-6">
        {/* Top Controls: Department Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C87D55]" />
              <span>1. Primary Department</span>
            </div>
            {isAnyFilterActive && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-mono font-bold text-[#C87D55] hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <span>✕</span> Reset All Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 items-stretch">
            {mainDepartments.map((dept) => {
              const isActive = selectedDepartment === dept.slug;
              return (
                <button
                  key={dept.slug}
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(dept.slug);
                    setSelectedSubcategory('all');
                  }}
                  className={`px-3.5 py-3 rounded-xl text-xs font-bold transition flex flex-col justify-between items-start gap-1 cursor-pointer text-left min-h-[72px] h-full ${
                    isActive
                      ? 'bg-[#8C4A2F] text-white shadow-lg shadow-[#8C4A2F]/30 border border-[#A35839]'
                      : 'bg-[#20242A] border border-[#2D323A] text-stone-300 hover:text-white hover:border-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-base">{dept.icon}</span>
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-black/40 text-white' : 'bg-[#141619] text-stone-400'
                      }`}
                    >
                      {dept.count}
                    </span>
                  </div>
                  <span className="font-semibold mt-0.5 truncate w-full">{dept.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* E-Bike Subcategories Pills (When viewing e-bikes) */}
        {showEbikeSubcategories && (
          <div className="pt-5 border-t border-[#23272E] space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>2. Electric Dirt Bike Subcategories (Strict AU Taxonomy)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 items-stretch">
              {EBIKE_SUBCATEGORIES.map((sub) => {
                const isActive = selectedSubcategory === sub.slug;
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => setSelectedSubcategory(sub.slug)}
                    className={`p-3 rounded-xl text-left transition flex items-center gap-2.5 cursor-pointer min-h-[64px] h-full ${
                      isActive
                        ? 'bg-[#C87D55] text-white font-bold shadow-md shadow-[#C87D55]/20 border border-[#D98D65]'
                        : 'bg-[#1D2024] border border-[#2B2F36] text-stone-300 hover:text-white hover:border-stone-500'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{sub.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold truncate">{sub.name}</div>
                      <div className="text-[10px] text-stone-400 line-clamp-1 mt-0.5 opacity-80">
                        {sub.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Department Subcategories (When viewing Parts, Gear, Accessories, or Brands) */}
        {!showEbikeSubcategories && departmentSubcategories.length > 0 && (
          <div className="pt-5 border-t border-[#23272E] space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>2. Sub-Type Refinement</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedSubcategory('all');
                  if (selectedDepartment === 'brands') setSelectedBrand('all');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  selectedSubcategory === 'all' && (selectedDepartment !== 'brands' || selectedBrand === 'all')
                    ? 'bg-stone-200 text-stone-900 font-bold'
                    : 'bg-[#1D2024] border border-[#2B2F36] text-stone-400 hover:text-white'
                }`}
              >
                All {selectedDepartment === 'brands' ? 'Brands' : 'Options'}
              </button>

              {departmentSubcategories.map((sub) => {
                const isSubActive =
                  selectedSubcategory === sub.slug || (selectedDepartment === 'brands' && selectedBrand === sub.slug);
                return (
                  <button
                    key={sub.slug}
                    type="button"
                    onClick={() => {
                      if (selectedDepartment === 'brands') {
                        setSelectedBrand(sub.slug);
                      } else {
                        setSelectedSubcategory(sub.slug);
                      }
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      isSubActive
                        ? 'bg-[#C87D55] text-white font-bold shadow'
                        : 'bg-[#1D2024] border border-[#2B2F36] text-stone-300 hover:text-white hover:border-stone-500'
                    }`}
                  >
                    {sub.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Refinement Toolbar: Search, Brand, Road-Legal, Price Range, and Sort */}
        <div className="pt-5 border-t border-[#23272E] space-y-3">
          <div className="text-xs font-mono uppercase tracking-wider text-stone-400 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>3. Technical Specifications &amp; Live Search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="sm:col-span-2 lg:col-span-4 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, 72V, Surron, kW..."
                className="w-full h-11 bg-[#131518] border border-[#2B2F36] rounded-xl pl-4 pr-10 text-xs text-stone-200 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-[#C87D55] font-mono"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs font-mono p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  ✕
                </button>
              ) : (
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs pointer-events-none">
                  🔍
                </span>
              )}
            </div>

            {/* Brand Dropdown */}
            <div className="sm:col-span-1 lg:col-span-2 relative">
              <select
                aria-label="Filter by Brand"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none bg-[#131518] border border-[#2B2F36] text-stone-200 text-xs rounded-xl pl-3.5 pr-8 h-11 font-mono focus:outline-none focus:ring-2 focus:ring-[#C87D55] cursor-pointer"
              >
                <option value="all">All 15 Brands</option>
                {allBrands.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Road-Legal Selector */}
            <div className="sm:col-span-1 lg:col-span-2 relative">
              <select
                aria-label="Filter by ADR Road Legal Status"
                value={selectedRoadLegal}
                onChange={(e) => setSelectedRoadLegal(e.target.value as any)}
                className="w-full appearance-none bg-[#131518] border border-[#2B2F36] text-stone-200 text-xs rounded-xl pl-3.5 pr-8 h-11 font-mono focus:outline-none focus:ring-2 focus:ring-[#C87D55] cursor-pointer"
              >
                <option value="all">Compliance: All</option>
                <option value="legal">🚦 ADR Road Legal</option>
                <option value="offroad">🌲 Off-Road Only</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Price Range Selector */}
            <div className="sm:col-span-1 lg:col-span-2 relative">
              <select
                aria-label="Filter by Price Range"
                value={selectedPriceRange}
                onChange={(e) => setSelectedPriceRange(e.target.value)}
                className="w-full appearance-none bg-[#131518] border border-[#2B2F36] text-stone-200 text-xs rounded-xl pl-3.5 pr-8 h-11 font-mono focus:outline-none focus:ring-2 focus:ring-[#C87D55] cursor-pointer"
              >
                <option value="all">Budget: All Prices</option>
                <option value="under-5k">&lt; $5,000 AUD</option>
                <option value="5k-10k">$5k – $10k AUD</option>
                <option value="10k-15k">$10k – $15k AUD</option>
                <option value="over-15k">&gt; $15,000 AUD</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Sort Order Selector */}
            <div className="sm:col-span-1 lg:col-span-2 relative">
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full appearance-none bg-[#131518] border border-[#2B2F36] text-stone-200 text-xs rounded-xl pl-3.5 pr-8 h-11 font-mono focus:outline-none focus:ring-2 focus:ring-[#C87D55] cursor-pointer"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="power-desc">Peak Power: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {isAnyFilterActive && (
          <div className="pt-4 border-t border-[#23272E] flex flex-wrap items-center gap-2 text-xs font-mono text-stone-400">
            <span className="font-semibold text-stone-300">Active Filters:</span>

            {selectedDepartment !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Dept:</span>
                <strong className="text-white">
                  {mainDepartments.find((d) => d.slug === selectedDepartment)?.name}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedDepartment('all')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear department filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedSubcategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Type:</span>
                <strong className="text-white">
                  {EBIKE_SUBCATEGORIES.find((s) => s.slug === selectedSubcategory)?.name || selectedSubcategory}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedSubcategory('all')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear subcategory filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Brand:</span>
                <strong className="text-white">
                  {allBrands.find((b) => b.slug === selectedBrand)?.name || selectedBrand}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedBrand('all')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear brand filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedRoadLegal !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Compliance:</span>
                <strong className="text-white">
                  {selectedRoadLegal === 'legal' ? 'ADR Road-Legal' : 'Off-Road Only'}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedRoadLegal('all')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear compliance filter"
                >
                  ✕
                </button>
              </span>
            )}

            {selectedPriceRange !== 'all' && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Budget:</span>
                <strong className="text-white">
                  {selectedPriceRange === 'under-5k'
                    ? '< $5,000 AUD'
                    : selectedPriceRange === '5k-10k'
                    ? '$5k – $10k AUD'
                    : selectedPriceRange === '10k-15k'
                    ? '$10k – $15k AUD'
                    : '> $15,000 AUD'}
                </strong>
                <button
                  type="button"
                  onClick={() => setSelectedPriceRange('all')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear budget filter"
                >
                  ✕
                </button>
              </span>
            )}

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 bg-[#2B2F36] text-stone-200 px-3 py-1 rounded-lg">
                <span>Query:</span>
                <strong className="text-white">&quot;{searchQuery}&quot;</strong>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="hover:text-amber-400 ml-1 text-stone-400 cursor-pointer"
                  aria-label="Clear search query"
                >
                  ✕
                </button>
              </span>
            )}

            <button
              type="button"
              onClick={handleResetFilters}
              className="text-xs text-[#C87D55] hover:text-white font-bold underline ml-auto cursor-pointer"
            >
              Reset All
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div ref={gridTopRef} className="scroll-mt-24 space-y-8">
          <p className="font-mono text-xs text-stone-400">
            Showing {rangeStart}–{rangeEnd} of {filteredProducts.length}
            {filteredProducts.length !== PRODUCTS.length && ` (${PRODUCTS.length} total)`}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pagedProducts.map((product: any) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
          <Pagination page={safePage} pageCount={pageCount} onChange={changePage} className="pt-4" />
        </div>
      ) : (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-12 text-center space-y-4">
          <span className="text-4xl block">🔍</span>
          <h2 className="text-xl font-bold text-white uppercase font-mono">
            No Bikes Matched Your Filter Configuration
          </h2>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Try resetting your filters or adjusting your search keywords to view our complete Australian electric dirt bike inventory.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-2.5 px-6 rounded-xl transition uppercase tracking-wider font-mono cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0E1012] flex items-center justify-center text-stone-400 font-mono text-xs">
          Loading inventory...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
