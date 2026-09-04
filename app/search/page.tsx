'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { ProductCard } from '@/components/ProductCard';
import { PRODUCTS, POSTS, SITE } from '@/config/site';
import { productMatchesQuery, textMatchesQuery, buildHaystack } from '@/lib/search';

function SearchContent() {
  const searchParams = useSearchParams();
  const paramQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(paramQ);
  const [prevParamQ, setPrevParamQ] = useState(paramQ);

  if (paramQ !== prevParamQ) {
    setPrevParamQ(paramQ);
    setQuery(paramQ);
  }

  const matchingProducts = PRODUCTS.filter((p) => productMatchesQuery(p, query));

  const matchingPosts = POSTS.filter((post) =>
    textMatchesQuery(buildHaystack([post.title, post.excerpt, post.category]), query),
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <span className="text-[#C87D55]">Inventory Search</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C87D55] font-mono">
          Catalogue &amp; Guides Index
        </span>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Search {SITE.name}
        </h1>
        <p className="text-sm text-stone-300">
          Find electric dirt bikes, 72V Molicel powerpacks, specs, and trail tech guides.
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="relative max-w-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by model, power (e.g. 22kW), 72V, trail, motocross..."
          className="w-full bg-[#17191C] border border-[#2B2F36] rounded-2xl pl-12 pr-4 py-4 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-[#8C4A2F] focus:ring-1 focus:ring-[#8C4A2F]"
        />
        <svg
          className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Search Results */}
      <div className="space-y-10">
        {/* Products Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold uppercase text-white font-mono flex items-center justify-between border-b border-[#23272E] pb-3">
            <span>Electric Dirt Bikes &amp; Components</span>
            <span className="text-xs text-stone-400 font-normal">({matchingProducts.length} Found)</span>
          </h2>

          {matchingProducts.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-4">No matching electric dirt bikes found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Trail Tech Blog Results */}
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold uppercase text-white font-mono flex items-center justify-between border-b border-[#23272E] pb-3">
            <span>Trail Tech Articles</span>
            <span className="text-xs text-stone-400 font-normal">({matchingPosts.length} Found)</span>
          </h2>

          {matchingPosts.length === 0 ? (
            <p className="text-xs text-stone-500 font-mono py-4">No matching articles found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchingPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}/`}
                  className="p-4 rounded-xl bg-[#17191C] border border-[#2B2F36] hover:border-[#8C4A2F] transition space-y-1 group"
                >
                  <div className="text-[10px] font-mono text-[#C87D55]">{post.category}</div>
                  <h3 className="font-bold text-sm text-white group-hover:text-[#C87D55] transition">{post.title}</h3>
                  <p className="text-xs text-stone-400 line-clamp-1">{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-stone-400">Loading Search Engine...</div>}>
      <SearchContent />
    </Suspense>
  );
}
