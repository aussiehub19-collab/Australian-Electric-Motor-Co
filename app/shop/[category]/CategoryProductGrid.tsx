'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { SmartImage } from '@/components/SmartImage';
import { ProductCard } from '@/components/ProductCard';

interface Product {
  slug: string;
  name: string;
  price: number;
  category: string;
  brand?: string;
  parentCategories?: string[];
  shortDescription: string;
  description: string;
  badge?: string;
  featured?: boolean;
  images: string[];
  specs?: Record<string, any>;
  sizes?: string[];
  safetyStandard?: string;
  riderCategory?: string;
}

interface CategoryProductGridProps {
  initialProducts: Product[];
  categorySlug: string;
  categoryName: string;
}

export function CategoryProductGrid({
  initialProducts,
  categorySlug,
  categoryName,
}: CategoryProductGridProps) {
  const isRidingGear =
    categorySlug === 'riding-gear' ||
    categorySlug === 'helmets' ||
    categorySlug === 'body-armour' ||
    categorySlug === 'body-armour-protection' ||
    categorySlug === 'gloves-goggles' ||
    categorySlug === 'boots';

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedRiderCategory, setSelectedRiderCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [selectedSafetyStandard, setSelectedSafetyStandard] = useState('all');
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'name'>('default');

  // Subcategories for Riding Gear
  const ridingGearSubcategories = [
    { id: 'all', label: 'All Riding Gear' },
    { id: 'helmets', label: 'Helmets' },
    { id: 'body-armour', label: 'Body Armour' },
    { id: 'gloves-goggles', label: 'Gloves & Goggles' },
    { id: 'boots', label: 'Boots' },
  ];

  // Size Matrix options
  const sizeOptions = [
    { id: 'all', label: 'All Sizes' },
    { id: 'Youth S', label: 'Youth S' },
    { id: 'Youth M', label: 'Youth M' },
    { id: 'Youth L', label: 'Youth L' },
    { id: 'Adult S', label: 'Adult S' },
    { id: 'Adult M', label: 'Adult M' },
    { id: 'Adult L', label: 'Adult L' },
    { id: 'Adult XL', label: 'Adult XL' },
    { id: 'Adult 2XL', label: 'Adult 2XL' },
  ];

  // Safety Standards options
  const safetyStandardOptions = [
    { id: 'all', label: 'All Standards' },
    { id: 'ECE 22.06', label: 'ECE 22.06 / AS 1698' },
    { id: 'CE Level 2', label: 'CE Level 2' },
    { id: 'CE Level 1', label: 'CE Level 1' },
  ];

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesDesc = product.shortDescription.toLowerCase().includes(q);
        const matchesBrand = product.brand?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesBrand) return false;
      }

      // Subcategory filter (on riding-gear parent)
      if (selectedSubcategory !== 'all') {
        const matchesCat =
          product.category === selectedSubcategory ||
          (selectedSubcategory === 'body-armour' && product.category === 'body-armour-protection') ||
          product.parentCategories?.includes(selectedSubcategory);
        if (!matchesCat) return false;
      }

      // Rider Category (Adult vs Kids/Youth)
      if (selectedRiderCategory !== 'all') {
        const prodRider = product.riderCategory || (product.specs as any)?.RiderCategory || (product.specs as any)?.Fitment || '';
        const isYouthProduct =
          prodRider.toLowerCase().includes('youth') ||
          prodRider.toLowerCase().includes('kids') ||
          product.name.toLowerCase().includes('youth') ||
          product.name.toLowerCase().includes('kids') ||
          product.sizes?.some((s) => s.startsWith('Youth'));

        if (selectedRiderCategory === 'kids-youth' && !isYouthProduct) return false;
        if (selectedRiderCategory === 'adult' && isYouthProduct) return false;
      }

      // Size Filter
      if (selectedSize !== 'all') {
        const hasSize =
          product.sizes?.includes(selectedSize) ||
          (product.specs as any)?.AvailableSizes?.includes(selectedSize) ||
          (product.specs as any)?.SizeMatrix?.includes(selectedSize) ||
          (product.specs as any)?.Sizing?.includes(selectedSize) ||
          (product.specs as any)?.Sizes?.includes(selectedSize);
        if (!hasSize) return false;
      }

      // Safety Standard Filter
      if (selectedSafetyStandard !== 'all') {
        const std =
          product.safetyStandard ||
          (product.specs as any)?.SafetyStandard ||
          (product.specs as any)?.ChestProtection ||
          (product.specs as any)?.BackProtection ||
          '';
        const stdLower = std.toLowerCase();
        if (selectedSafetyStandard === 'ECE 22.06') {
          if (!stdLower.includes('ece 22.06') && !stdLower.includes('as/nzs 1698')) return false;
        } else if (selectedSafetyStandard === 'CE Level 2') {
          if (!stdLower.includes('level 2')) return false;
        } else if (selectedSafetyStandard === 'CE Level 1') {
          if (!stdLower.includes('level 1')) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [
    initialProducts,
    searchQuery,
    selectedSubcategory,
    selectedRiderCategory,
    selectedSize,
    selectedSafetyStandard,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedSubcategory !== 'all' ||
    selectedRiderCategory !== 'all' ||
    selectedSize !== 'all' ||
    selectedSafetyStandard !== 'all';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubcategory('all');
    setSelectedRiderCategory('all');
    setSelectedSize('all');
    setSelectedSafetyStandard('all');
    setSortBy('default');
  };

  return (
    <div className="space-y-8">
      {/* Interactive Filter Suite */}
      <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
        {/* Top Filter Row: Search + Sort + Reset */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-4 border-b border-[#23272E]">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryName}...`}
              className="w-full bg-[#121417] border border-[#2B2F36] rounded-xl px-4 py-2.5 pl-10 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#C87D55] focus:ring-1 focus:ring-[#C87D55] font-sans"
            />
            <svg
              className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-xs text-stone-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort dropdown and Clear */}
          <div className="flex items-center gap-3">
            <label className="text-xs font-mono text-stone-400 shrink-0">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#121417] border border-[#2B2F36] rounded-xl px-3 py-2 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#C87D55]"
            >
              <option value="default">Featured / Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name (A-Z)</option>
            </select>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-mono text-rose-400 hover:text-rose-300 underline py-1 px-2"
              >
                Reset All
              </button>
            )}
          </div>
        </div>

        {/* Riding Gear Specific Filter Controls */}
        {isRidingGear ? (
          <div className="space-y-4">
            {/* Subcategory Filter Tabs if on parent */}
            {categorySlug === 'riding-gear' && (
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-400 font-semibold">
                  Gear Discipline:
                </span>
                <div className="flex flex-wrap gap-2">
                  {ridingGearSubcategories.map((sub) => (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setSelectedSubcategory(sub.id)}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition font-medium ${
                        selectedSubcategory === sub.id
                          ? 'bg-[#8C4A2F] text-white shadow-md'
                          : 'bg-[#121417] border border-[#2B2F36] text-stone-300 hover:border-stone-500'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 3 Matrix Filters: Rider Category, Size Matrix, Safety Standards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* 1. Rider Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-stone-400 uppercase font-semibold">
                  Rider Division:
                </label>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedRiderCategory('all')}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-mono transition ${
                      selectedRiderCategory === 'all'
                        ? 'bg-[#8C4A2F] text-white font-bold'
                        : 'bg-[#121417] border border-[#2B2F36] text-stone-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRiderCategory('adult')}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-mono transition ${
                      selectedRiderCategory === 'adult'
                        ? 'bg-[#8C4A2F] text-white font-bold'
                        : 'bg-[#121417] border border-[#2B2F36] text-stone-400 hover:text-white'
                    }`}
                  >
                    Adult
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedRiderCategory('kids-youth')}
                    className={`flex-1 py-1.5 px-2 rounded text-xs font-mono transition ${
                      selectedRiderCategory === 'kids-youth'
                        ? 'bg-[#8C4A2F] text-white font-bold'
                        : 'bg-[#121417] border border-[#2B2F36] text-stone-400 hover:text-white'
                    }`}
                  >
                    Youth / Kids
                  </button>
                </div>
              </div>

              {/* 2. Size Matrix Dropdown/Pills */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-stone-400 uppercase font-semibold">
                  Size Matrix:
                </label>
                <select
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="w-full bg-[#121417] border border-[#2B2F36] rounded-lg px-3 py-1.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#C87D55]"
                >
                  {sizeOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Safety Standards */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-stone-400 uppercase font-semibold">
                  Safety Standard:
                </label>
                <select
                  value={selectedSafetyStandard}
                  onChange={(e) => setSelectedSafetyStandard(e.target.value)}
                  className="w-full bg-[#121417] border border-[#2B2F36] rounded-lg px-3 py-1.5 text-xs font-mono text-stone-200 focus:outline-none focus:border-[#C87D55]"
                >
                  {safetyStandardOptions.map((std) => (
                    <option key={std.id} value={std.id}>
                      {std.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ) : (
          /* General Category Quick Filter Pills */
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-mono text-stone-400">Inventory Status:</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-md">
              ✓ In Stock &amp; Australian Crate Ready
            </span>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-md">
              ⚡ 10% Crypto Discount Applicable
            </span>
          </div>
        )}

        {/* Results Counter & Active Indicator */}
        <div className="flex items-center justify-between text-xs font-mono text-stone-400 pt-2 border-t border-[#23272E]">
          <div>
            Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> of{' '}
            {initialProducts.length} items
          </div>
          {isRidingGear && (
            <div className="text-emerald-400 flex items-center gap-1.5">
              <span>🇦🇺</span>
              <span>All Helmets ECE 22.06 / AS 1698 Approved</span>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-10 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-900 flex items-center justify-center text-amber-400 text-xl font-bold">
            🔍
          </div>
          <h3 className="text-lg font-bold text-white uppercase">
            No Products Match Your Selected Filters
          </h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">
            Try adjusting your search criteria, clearing size matrix restrictions, or resetting filters to browse full inventory.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-2.5 px-5 rounded-lg transition uppercase tracking-wider"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
