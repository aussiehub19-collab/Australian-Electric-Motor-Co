'use client';

import React, { useState, useMemo } from 'react';
import { SITE, PRODUCTS } from '@/src/config/site';
import { SmartImage } from '@/components/SmartImage';

interface AddToCartButtonProps {
  product: {
    slug: string;
    name: string;
    brandName?: string;
    price: number;
    category: string;
    images: string[];
    isBike?: boolean;
  };
}

const NEW_OWNER_DISCOUNT = 0.15;

// General-purpose accessories + gear suggested to every new bike owner —
// real catalog products (real image, real page), not a fixed forced bundle.
const SUGGESTED_ADDON_SLUGS = [
  'polisport-foldable-bike-stand',
  'ballards-ratchet-tie-down-straps',
  'muc-off-waterless-wash-750ml',
  'e-moto-heavy-duty-weatherproof-storage-cover',
  'fox-racing-v1-matte-black-helmet',
  '100-percent-armega-goggles-hiper-mirror-lens',
];

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const isBike =
    product.isBike ??
    (!product.category.includes('parts') &&
      !product.category.includes('gear') &&
      !product.category.includes('accessories') &&
      !product.category.includes('chargers') &&
      !product.category.includes('rotors') &&
      !product.category.includes('helmets') &&
      !product.category.includes('boots') &&
      !product.category.includes('gloves'));

  // Suggested accessories/gear + one spare battery matched to this bike's brand, if the catalog has one.
  const addonOptions = useMemo(() => {
    const base = SUGGESTED_ADDON_SLUGS.map((slug) => PRODUCTS.find((p: any) => p.slug === slug)).filter(
      Boolean,
    ) as any[];
    if (product.brandName) {
      const battery = PRODUCTS.filter(
        (p: any) =>
          p.category === 'high-capacity-batteries' &&
          p.name.toLowerCase().includes(product.brandName!.toLowerCase()),
      ).sort((a: any, b: any) => a.price - b.price)[0];
      if (battery) return [...base, battery];
    }
    return base;
  }, [product.brandName]);

  const toggleAddon = (slug: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectedItems = addonOptions.filter((a) => selectedAddons.has(a.slug));
  const selectedOriginalTotal = selectedItems.reduce((s, a) => s + a.price, 0);
  const selectedSavings = Math.round(selectedOriginalTotal * NEW_OWNER_DISCOUNT);

  const addItemToCart = (itemToAdd: any) => {
    try {
      const stored = localStorage.getItem(SITE.cartKey || 'mm-cart');
      const cart = stored ? JSON.parse(stored) : [];

      const existingIndex = cart.findIndex((item: any) => item.slug === itemToAdd.slug);
      if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({
          slug: itemToAdd.slug,
          name: itemToAdd.name,
          price: itemToAdd.price,
          category: itemToAdd.category,
          image: itemToAdd.images ? itemToAdd.images[0] : itemToAdd.image,
          quantity: 1,
          isBike: itemToAdd.isBike === true,
          ...(itemToAdd.discountTag ? { discountTag: itemToAdd.discountTag } : {}),
        });
      }

      localStorage.setItem(SITE.cartKey || 'mm-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  const handleAddToCart = () => {
    addItemToCart({ ...product, isBike });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);

    // If adding a bike, prompt the "choose your accessories" offer
    if (isBike) {
      setShowBundleModal(true);
    }
  };

  const handleAddSelectedAndProceed = () => {
    selectedItems.forEach((item) => {
      addItemToCart({
        slug: item.slug,
        name: item.name,
        price: Math.round(item.price * (1 - NEW_OWNER_DISCOUNT)),
        category: item.category,
        images: item.images,
        discountTag: 'new-owner-15',
      });
    });
    setShowBundleModal(false);
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handleDeclineBundle = () => {
    setShowBundleModal(false);
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handlePayIn4Checkout = () => {
    addItemToCart({ ...product, isBike });
    if (isBike) {
      setShowBundleModal(true);
    } else {
      window.dispatchEvent(
        new CustomEvent('open-cart', {
          detail: { payInFour: true },
        })
      );
    }
  };

  const payIn4Instalment = Math.round(product.price / 4);

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        onClick={handleAddToCart}
        className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-xl flex items-center justify-center gap-2 ${
          added
            ? 'bg-emerald-600 text-white'
            : 'bg-[#8C4A2F] hover:bg-[#A35839] text-white shadow-[#8C4A2F]/25'
        }`}
      >
        {added ? (
          <>
            <span>✓ Added to Cart!</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Add To Cart (${product.price.toLocaleString()} AUD)</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handlePayIn4Checkout}
        className="w-full py-3 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500/15 via-amber-500/25 to-amber-500/15 hover:from-amber-500/25 hover:to-amber-500/35 border border-amber-500/50 text-amber-300 transition-all flex items-center justify-center gap-2 shadow-lg group"
      >
        <span className="bg-amber-500/30 text-amber-200 text-xs px-2 py-0.5 rounded font-mono font-bold">
          Pay in 4
        </span>
        <span>
          Checkout with Pay in 4 (1st Instalment: ${payIn4Instalment.toLocaleString()} AUD)
        </span>
        <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
      </button>

      {/* New Bike Owner accessory picker */}
      {showBundleModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bundle-modal-title"
        >
          <div className="bg-[#17191C] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
                  ⚡ New Bike Owner Offer
                </span>
                <h3
                  id="bundle-modal-title"
                  className="text-xl font-black text-white font-sans mt-2"
                >
                  15% Off Any Accessories You Add Now
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBundleModal(false)}
                className="text-stone-400 hover:text-white text-lg p-1"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed font-sans">
              Pick whatever you actually want for your {product.name} — stand, tie-downs, cleaning
              kit, gear, a spare battery. Everything you tick is 15% off, only while you're adding
              this bike.
            </p>

            {/* Selectable add-ons */}
            <div className="space-y-2">
              {addonOptions.map((item) => {
                const checked = selectedAddons.has(item.slug);
                const discounted = Math.round(item.price * (1 - NEW_OWNER_DISCOUNT));
                return (
                  <label
                    key={item.slug}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition ${
                      checked ? 'border-amber-500/60 bg-amber-500/10' : 'border-[#2B2F36] bg-[#121417] hover:border-stone-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleAddon(item.slug)}
                      className="w-4 h-4 accent-amber-500 shrink-0"
                    />
                    <div className="relative w-11 h-11 shrink-0 rounded-lg overflow-hidden bg-white border border-stone-800">
                      <SmartImage src={item.images?.[0]} alt={item.name} fill fit="contain" className="p-0.5" sizes="44px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-stone-100 truncate font-sans">{item.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 font-mono text-[11px]">
                        <span className="text-stone-500 line-through">${item.price}</span>
                        <span className="text-amber-400 font-bold">${discounted} AUD</span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {selectedItems.length > 0 && (
              <div className="bg-[#121417] border border-[#2B2F36] rounded-xl p-3 flex items-center justify-between font-mono text-xs">
                <span className="text-stone-400">{selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected</span>
                <span className="text-emerald-400 font-bold">You save ${selectedSavings.toLocaleString()} AUD</span>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddSelectedAndProceed}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-[#8C4A2F] hover:from-amber-500 hover:to-[#A35839] text-white shadow-xl flex items-center justify-center gap-2"
              >
                <span>
                  {selectedItems.length > 0
                    ? `Add ${selectedItems.length} Selected Item${selectedItems.length > 1 ? 's' : ''} →`
                    : 'Continue →'}
                </span>
              </button>
              <button
                type="button"
                onClick={handleDeclineBundle}
                className="w-full py-2.5 px-4 text-xs font-mono text-stone-400 hover:text-white transition text-center"
              >
                No thanks, proceed with bike only
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
