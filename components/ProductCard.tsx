'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { SITE, SHOP } from '@/config/site';

export interface ProductCardProps {
  product: {
    slug: string;
    name: string;
    price: number;
    category: string;
    brand?: string;
    brandName?: string;
    subcategoryName?: string;
    shortDescription?: string;
    description?: string;
    badge?: string;
    target?: string;
    roadLegal?: boolean;
    images: string[];
    specs?: Record<string, any>;
    sizes?: string[];
    [key: string]: any;
  };
  className?: string;
  /** Load the image eagerly (use for the first row of a grid). */
  priority?: boolean;
}

export function ProductCard({ product, className = '', priority = false }: ProductCardProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const productUrl = `/shop/${product.category}/${product.slug}/`;

  const discountedPrice = SHOP.cryptoDiscount
    ? Math.round(product.price * (1 - SHOP.cryptoDiscount / 100))
    : product.price;

  const fortnightly = Math.round(product.price / 4);

  const isRoadLegal =
    product.roadLegal === true ||
    product.category?.includes('road-legal') ||
    product.specs?.RoadLegal?.toLowerCase().includes('yes') ||
    product.badge?.toLowerCase().includes('road legal');

  const voltage = product.specs?.voltage || product.specs?.Voltage;
  const power = product.specs?.power || product.specs?.PeakPower || product.specs?.Motor;
  const topSpeed = product.specs?.topSpeed || product.specs?.TopSpeed;
  const range = product.specs?.range || product.specs?.Range;
  const capacity = product.specs?.capacity || product.specs?.Capacity;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If the click originated from an interactive element (button, input, link), avoid duplicate action
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input') || target.closest('a')) {
      return;
    }
    router.push(productUrl);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((prev) => Math.min(99, prev + 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const cartKey = SITE.cartKey || 'mm-cart';
      const stored = localStorage.getItem(cartKey);
      const items = stored ? JSON.parse(stored) : [];
      const existing = items.find((i: any) => i.slug === product.slug);
      const qtyToAdd = Math.max(1, quantity);

      if (existing) {
        existing.quantity = (existing.quantity || 0) + qtyToAdd;
      } else {
        items.push({
          slug: product.slug,
          name: product.name,
          price: product.price,
          category: product.category,
          image: product.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
          quantity: qtyToAdd,
        });
      }

      localStorage.setItem(cartKey, JSON.stringify(items));
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new Event('open-cart'));

      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group flex flex-col justify-between bg-[#17191C] rounded-2xl border border-[#2B2F36] overflow-hidden hover:border-[#8C4A2F]/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 cursor-pointer ${className}`}
    >
      <div>
        {/* Image Container — every product image contained in the same white frame so cards align */}
        <Link href={productUrl} className="relative block aspect-square overflow-hidden bg-white">
          <SmartImage
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80'}
            alt={product.name}
            fill
            fit="contain"
            priority={priority}
            className="p-5"
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
            {product.badge && (
              <span className="px-2.5 py-1 rounded-md bg-[#8C4A2F] text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
                {product.badge}
              </span>
            )}
            {isRoadLegal && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-600/95 text-white text-[9px] font-mono font-bold uppercase shadow tracking-wider">
                🚦 Road Legal
              </span>
            )}
            {(product.brandName || product.brand) && (
              <span className="px-2 py-0.5 rounded-md bg-[#101214]/85 text-stone-200 text-[9px] font-mono font-bold uppercase backdrop-blur-sm border border-white/10 self-start">
                {product.brandName || product.brand}
              </span>
            )}
          </div>

          {/* Crypto Discount Tag */}
          {SHOP.cryptoDiscount > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-emerald-500/90 text-white text-[10px] font-mono font-bold tracking-wide shadow-md">
              10% OFF CRYPTO
            </div>
          )}
        </Link>

        {/* Content */}
        <div className="p-5 space-y-2.5">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-[#C87D55]">
            <span className="truncate max-w-[65%]">
              {product.subcategoryName || product.category.replace(/-/g, ' ')}
            </span>
            {(product.brandName || product.brand) && (
              <span className="text-stone-400 font-semibold uppercase">
                {product.brandName || product.brand}
              </span>
            )}
          </div>

          <Link href={productUrl} className="block group-hover:text-[#C87D55] transition-colors">
            <h3 className="text-base font-bold text-white leading-snug line-clamp-1">
              {product.name}
            </h3>
          </Link>

          {product.shortDescription && (
            <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed font-normal">
              {product.shortDescription}
            </p>
          )}

          {/* Key Specs Pills */}
          {product.specs && (
            <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono text-stone-300">
              {voltage && (
                <span className="px-2 py-0.5 rounded bg-[#20242A] border border-[#2B2F36]">
                  ⚡ {voltage}
                </span>
              )}
              {power && (
                <span className="px-2 py-0.5 rounded bg-[#20242A] border border-[#2B2F36] text-amber-400">
                  🔥 {power}
                </span>
              )}
              {topSpeed && (
                <span className="px-2 py-0.5 rounded bg-[#20242A] border border-[#2B2F36]">
                  💨 {topSpeed}
                </span>
              )}
              {range && (
                <span className="px-2 py-0.5 rounded bg-[#20242A] border border-[#2B2F36] text-emerald-400">
                  🔋 {range}
                </span>
              )}
              {capacity && !range && (
                <span className="px-2 py-0.5 rounded bg-[#20242A] border border-[#2B2F36]">
                  📦 {capacity}
                </span>
              )}
            </div>
          )}

          {/* Sizing badges if available */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="pt-1 flex flex-wrap gap-1">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#121417] text-stone-300 border border-[#2B2F36]"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-[9px] font-mono text-stone-500 self-center">
                  +{product.sizes.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pricing & Add to Cart + Quantity Stepper Action Bar */}
      <div className="p-5 pt-3 border-t border-[#23272E] mt-2 space-y-3">
        <div>
          <div className="flex items-baseline justify-between">
            <div className="text-lg font-black text-white font-mono flex items-center gap-1.5">
              <span>${product.price.toLocaleString()} AUD</span>
              <span className="text-[9px] font-mono text-stone-400 font-normal px-1.5 py-0.5 rounded bg-[#23272E]">
                GST Incl.
              </span>
            </div>
          </div>
          <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
            ⚡ 10% Crypto: ${discountedPrice.toLocaleString()} AUD
          </div>
          <div className="text-[10px] font-mono text-stone-400">
            or 4x ${fortnightly.toLocaleString()} with Pay in 4
          </div>
        </div>

        {/* Quantity Stepper & Add to Cart */}
        <div
          className="flex items-center gap-2 pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Stepper */}
          <div className="flex items-center bg-[#121417] border border-[#2B2F36] rounded-xl p-0.5 shrink-0">
            <button
              type="button"
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className="w-8 h-9 flex items-center justify-center text-stone-300 hover:text-white disabled:text-stone-600 disabled:cursor-not-allowed text-sm font-bold transition rounded-lg hover:bg-[#20242A]"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-7 text-center text-xs font-mono font-bold text-white select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={quantity >= 99}
              className="w-8 h-9 flex items-center justify-center text-stone-300 hover:text-white disabled:text-stone-600 disabled:cursor-not-allowed text-sm font-bold transition rounded-lg hover:bg-[#20242A]"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add to Cart Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex-1 h-10 px-3.5 rounded-xl text-xs font-bold font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md ${
              added
                ? 'bg-emerald-600 text-white shadow-emerald-900/30'
                : 'bg-[#8C4A2F] hover:bg-[#A35839] text-white shadow-[#8C4A2F]/20 active:scale-[0.98]'
            }`}
            aria-label={`Add ${quantity} ${product.name} to cart`}
          >
            {added ? (
              <>
                <span className="text-sm">✓</span>
                <span>Added ({quantity})</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
