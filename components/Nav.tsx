'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartDrawer } from './CartDrawer';
import { Logo } from './Logo';
import { AbnBar } from './AbnBar';
import { TAXONOMY_SECTIONS, CATEGORIES, SITE } from '@/config/site';

export function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const stored = localStorage.getItem(SITE.cartKey || 'mm-cart');
      if (stored) {
        const items = JSON.parse(stored);
        return items.reduce((acc: number, item: { quantity: number }) => acc + (item.quantity || 1), 0);
      }
      return 0;
    } catch {
      return 0;
    }
  });
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
    setShopDropdownOpen(false);
  }

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem(SITE.cartKey || 'mm-cart');
        if (stored) {
          const items = JSON.parse(stored);
          const total = items.reduce((acc: number, item: { quantity: number }) => acc + (item.quantity || 1), 0);
          setCartCount(total);
        } else {
          setCartCount(0);
        }
      } catch {
        setCartCount(0);
      }
    };
    const handleOpenCart = () => setCartOpen(true);
    window.addEventListener('cart-updated', updateCount);
    window.addEventListener('open-cart', handleOpenCart);
    return () => {
      window.removeEventListener('cart-updated', updateCount);
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  const brands = CATEGORIES.filter((c) => c.section === 'brands' && c.parent === 'brands');

  return (
    <>
      {/* WCAG 2.2 AA Mandatory Skip Link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-[#8C4A2F] focus:text-white focus:px-4 focus:py-2 focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 bg-[#121417]/95 backdrop-blur-md border-b border-[#2B2F36]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center group focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1"
            aria-label={`${SITE.name} Homepage`}
          >
            <Logo variant="full" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7" aria-label="Main Navigation">
            {/* Shop Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <Link
                href="/shop/"
                className={`text-sm font-semibold tracking-wide transition flex items-center gap-1.5 py-2 ${
                  pathname === '/shop' || pathname === '/shop/'
                    ? 'text-[#C87D55]'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <span>Shop Catalogue</span>
                <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Mega Dropdown Menu */}
              {shopDropdownOpen && (
                <div className="absolute top-full left-0 w-[640px] bg-[#17191C] border border-[#2B2F36] rounded-2xl shadow-2xl p-5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#2B2F36]">
                    <span className="text-[11px] font-mono uppercase tracking-widest text-[#C87D55] font-bold">
                      Electric Dirt Bike Catalog
                    </span>
                    <Link
                      href="/shop/"
                      className="text-xs text-amber-400 hover:text-white font-mono font-medium transition"
                    >
                      View All Inventory &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column: 6 Electric Dirt Bike Categories */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider px-2 mb-1">
                        E-Moto Categories
                      </div>
                      {[
                        { slug: 'full-size-motocross', name: 'Full-Size Motocross', icon: '🏁' },
                        { slug: 'trail-mid-weight-enduro', name: 'Trail & Mid-Weight Enduro', icon: '🌲' },
                        { slug: 'junior-trials-youth-dirt-bikes', name: 'Junior Trials & Youth', icon: '⚡' },
                        { slug: 'balance-mini-bikes', name: 'Balance & Mini Bikes', icon: '🧒' },
                        { slug: 'adr-road-legal-dirt-bikes', name: 'ADR Road-Legal Dirt Bikes', icon: '🚦' },
                        { slug: 'utility-farm-e-bikes', name: 'Utility & Farm E-Bikes', icon: '🚜' },
                      ].map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/shop/${sub.slug}/`}
                          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#20242A] transition group/sub"
                        >
                          <span className="text-sm">{sub.icon}</span>
                          <span className="text-xs font-medium text-stone-200 group-hover/sub:text-[#C87D55] transition">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Right Column: Other Departments & Brands */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-stone-400 font-bold tracking-wider px-2 mb-1">
                          Hardware &amp; Gear
                        </div>
                        {[
                          { slug: 'parts-upgrades', name: 'Parts & Upgrades', icon: '⚙️' },
                          { slug: 'riding-gear', name: 'Riding Gear', icon: '🛡️' },
                          { slug: 'accessories', name: 'Accessories', icon: '🎒' },
                        ].map((dept) => (
                          <Link
                            key={dept.slug}
                            href={`/shop/${dept.slug}/`}
                            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-[#20242A] transition group/dept"
                          >
                            <span className="text-sm">{dept.icon}</span>
                            <span className="text-xs font-medium text-stone-200 group-hover/dept:text-[#C87D55] transition">
                              {dept.name}
                            </span>
                          </Link>
                        ))}
                      </div>

                      {/* Popular Brands fast links */}
                      <div className="pt-2 border-t border-[#2B2F36]">
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 mb-1.5 px-2">
                          <span className="uppercase text-[#C87D55] font-bold">Top Brands</span>
                          <Link href="/brands/" className="text-amber-400 hover:underline">
                            All {brands.length} &rarr;
                          </Link>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {brands.slice(0, 6).map((b) => (
                            <Link
                              key={b.slug}
                              href={`/brands/${b.slug}/`}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141619] border border-[#2B2F36] text-stone-300 hover:text-white hover:border-[#8C4A2F] transition"
                            >
                              {b.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#2B2F36] flex items-center justify-between text-xs text-stone-400 bg-[#121417] p-2.5 rounded-xl">
                    <span className="flex items-center gap-1.5 text-amber-300 font-medium">
                      <span>⚡</span> 10% Crypto Discount at Checkout
                    </span>
                    <span className="text-stone-300 font-medium">
                      Australia-Wide Crate Delivery
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Brands Link */}
            <Link
              href="/brands/"
              className={`text-sm font-semibold tracking-wide transition ${
                pathname?.startsWith('/brands') ? 'text-[#C87D55]' : 'text-stone-300 hover:text-white'
              }`}
            >
              Brands
            </Link>

            {/* Compare Models */}
            <Link
              href="/compare/"
              className={`text-sm font-semibold tracking-wide transition ${
                pathname === '/compare/' || pathname === '/compare' ? 'text-[#C87D55]' : 'text-stone-300 hover:text-white'
              }`}
            >
              Compare
            </Link>

            {/* Bush Tech / Blog */}
            <Link
              href="/blog/"
              className={`text-sm font-semibold tracking-wide transition ${
                pathname?.startsWith('/blog') ? 'text-[#C87D55]' : 'text-stone-300 hover:text-white'
              }`}
            >
              Bush Tech
            </Link>

            {/* About Australian Electric Motor Co */}
            <Link
              href="/about/"
              className={`text-sm font-semibold tracking-wide transition ${
                pathname === '/about/' || pathname === '/about' ? 'text-[#C87D55]' : 'text-stone-300 hover:text-white'
              }`}
            >
              About
            </Link>

            {/* Contact */}
            <Link
              href="/contact/"
              className={`text-sm font-semibold tracking-wide transition ${
                pathname === '/contact/' || pathname === '/contact' ? 'text-[#C87D55]' : 'text-stone-300 hover:text-white'
              }`}
            >
              Contact &amp; HQ
            </Link>
          </nav>

          {/* Right Action Icons: Search + Cart + Mobile Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Search Icon */}
            <Link
              href="/search/"
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-[#1D2024] transition focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Search electric dirt bikes and components"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Cart Button */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative p-2 text-stone-300 hover:text-white rounded-lg hover:bg-[#1D2024] transition focus-visible:ring-2 focus-visible:ring-amber-500 flex items-center gap-2"
              aria-label={`Open shopping cart with ${cartCount} items`}
            >
              <div className="relative">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#8C4A2F] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#121417] shadow">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden xl:inline text-xs font-mono font-semibold text-amber-300 bg-[#8C4A2F]/30 px-2 py-1 rounded border border-[#C87D55]/30">
                10% Crypto Off
              </span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white rounded-lg hover:bg-[#1D2024] transition focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ABN Verification Bar directly under the nav bar */}
        <AbnBar />

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#17191C] border-b border-[#2B2F36] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="bg-[#121417] p-2.5 rounded-xl border border-[#2B2F36] flex items-center justify-between text-xs font-mono">
              <span className="text-amber-300 font-bold">⚡ 10% Crypto Discount</span>
              <span className="text-stone-400">Australia-Wide Shipping</span>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/shop/"
                className="block p-3 rounded-xl bg-[#141619] border border-[#2B2F36] text-center font-bold text-sm text-stone-100 hover:border-[#8C4A2F] hover:text-[#C87D55]"
              >
                All Shop Inventory &rarr;
              </Link>
              <Link
                href="/brands/"
                className="block p-3 rounded-xl bg-[#141619] border border-[#2B2F36] text-center font-bold text-sm text-stone-100 hover:border-[#8C4A2F] hover:text-[#C87D55]"
              >
                All Brands ({brands.length}) &rarr;
              </Link>
            </div>

            {/* Department Accordion List */}
            <div className="space-y-1 pt-2">
              <div className="text-xs font-mono uppercase text-[#C87D55] font-bold tracking-wider px-1">
                E-Bike Categories
              </div>
              {[
                { slug: 'full-size-motocross', name: 'Full-Size Motocross', icon: '🏁' },
                { slug: 'trail-mid-weight-enduro', name: 'Trail & Mid-Weight Enduro', icon: '🌲' },
                { slug: 'junior-trials-youth-dirt-bikes', name: 'Junior Trials & Youth', icon: '⚡' },
                { slug: 'balance-mini-bikes', name: 'Balance & Mini Bikes', icon: '🧒' },
                { slug: 'adr-road-legal-dirt-bikes', name: 'ADR Road-Legal Dirt Bikes', icon: '🚦' },
                { slug: 'utility-farm-e-bikes', name: 'Utility & Farm E-Bikes', icon: '🚜' },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop/${cat.slug}/`}
                  className="flex items-center justify-between px-3 py-2 text-sm text-stone-300 hover:bg-[#20242A] hover:text-white rounded-lg transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>{cat.icon}</span>
                    <span className="font-medium">{cat.name}</span>
                  </span>
                  <span className="text-xs text-stone-500">&rarr;</span>
                </Link>
              ))}
            </div>

            {/* Other Departments */}
            <div className="space-y-1 pt-2 border-t border-[#2B2F36]/60">
              <div className="text-xs font-mono uppercase text-stone-400 font-bold tracking-wider px-1">
                Other Departments
              </div>
              {[
                { slug: 'parts-upgrades', name: 'Parts & Upgrades', icon: '⚙️' },
                { slug: 'riding-gear', name: 'Riding Gear', icon: '🛡️' },
                { slug: 'accessories', name: 'Accessories', icon: '🎒' },
              ].map((sec) => (
                <Link
                  key={sec.slug}
                  href={`/shop/${sec.slug}/`}
                  className="flex items-center justify-between px-3 py-2 text-sm text-stone-300 hover:bg-[#20242A] hover:text-white rounded-lg transition"
                >
                  <span className="flex items-center gap-2.5">
                    <span>{sec.icon}</span>
                    <span className="font-medium">{sec.name}</span>
                  </span>
                  <span className="text-xs text-stone-500">&rarr;</span>
                </Link>
              ))}
            </div>

            {/* Brand Directory Quick Links */}
            <div className="pt-2 border-t border-[#2B2F36]/60">
              <div className="text-xs font-mono uppercase text-stone-400 font-semibold px-1 mb-1.5 flex items-center justify-between">
                <span>Featured Brands</span>
                <Link href="/brands/" className="text-amber-400 text-[11px]">
                  View All
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {brands.slice(0, 6).map((b) => (
                  <Link
                    key={b.slug}
                    href={`/brands/${b.slug}/`}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-[#141619] border border-[#2B2F36] text-stone-300 hover:text-white"
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Core Pages */}
            <div className="border-t border-[#2B2F36]/60 pt-2 space-y-1">
              <Link
                href="/compare/"
                className="block py-2 px-1 text-sm font-semibold text-stone-100 hover:text-[#C87D55]"
              >
                Compare Specifications
              </Link>
              <Link
                href="/about/"
                className="block py-2 px-1 text-sm font-semibold text-stone-100 hover:text-[#C87D55]"
              >
                About Australian Electric Motor Co
              </Link>
              <Link
                href="/blog/"
                className="block py-2 px-1 text-sm font-semibold text-stone-100 hover:text-[#C87D55]"
              >
                Bush Tech &amp; Outing Guides
              </Link>
              <Link
                href="/contact/"
                className="block py-2 px-1 text-sm font-semibold text-stone-100 hover:text-[#C87D55]"
              >
                Contact &amp; Workshop HQ
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
