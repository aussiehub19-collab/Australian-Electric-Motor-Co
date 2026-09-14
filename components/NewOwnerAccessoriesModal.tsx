'use client';

import React, { useState, useMemo } from 'react';
import { SITE, PRODUCTS } from '@/config/site';
import { SmartImage } from './SmartImage';

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

interface NewOwnerAccessoriesModalProps {
  isOpen: boolean;
  bikeName: string;
  bikeBrandName?: string;
  /** Called when the modal is dismissed, whether via "Add selected" or "No thanks" — the caller should open the cart. */
  onClose: () => void;
}

/**
 * Shown right after a bike is added to cart, from any add-to-cart entry
 * point (product page, shop/category grid cards). Offers real catalog
 * products at 15% off — the customer picks what they want, nothing is
 * forced into the cart.
 */
export function NewOwnerAccessoriesModal({ isOpen, bikeName, bikeBrandName, onClose }: NewOwnerAccessoriesModalProps) {
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());

  const addonOptions = useMemo(() => {
    const base = SUGGESTED_ADDON_SLUGS.map((slug) => PRODUCTS.find((p: any) => p.slug === slug)).filter(
      Boolean,
    ) as any[];
    if (bikeBrandName) {
      const battery = PRODUCTS.filter(
        (p: any) => p.category === 'high-capacity-batteries' && p.name.toLowerCase().includes(bikeBrandName.toLowerCase()),
      ).sort((a: any, b: any) => a.price - b.price)[0];
      if (battery) return [...base, battery];
    }
    return base;
  }, [bikeBrandName]);

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

  const handleAddSelectedAndProceed = () => {
    try {
      const cartKey = SITE.cartKey || 'mm-cart';
      const stored = localStorage.getItem(cartKey);
      const cart = stored ? JSON.parse(stored) : [];

      for (const item of selectedItems) {
        const existingIndex = cart.findIndex((c: any) => c.slug === item.slug);
        if (existingIndex > -1) {
          cart[existingIndex].quantity += 1;
        } else {
          cart.push({
            slug: item.slug,
            name: item.name,
            price: Math.round(item.price * (1 - NEW_OWNER_DISCOUNT)),
            category: item.category,
            image: item.images?.[0],
            quantity: 1,
            discountTag: 'new-owner-15',
          });
        }
      }

      localStorage.setItem(cartKey, JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('Error adding selected accessories:', e);
    }
    setSelectedAddons(new Set());
    onClose();
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handleDecline = () => {
    setSelectedAddons(new Set());
    onClose();
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-owner-modal-title"
    >
      <div className="bg-[#17191C] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-left max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
              ⚡ New Bike Owner Offer
            </span>
            <h3 id="new-owner-modal-title" className="text-xl font-black text-white font-sans mt-2">
              15% Off Any Accessories You Add Now
            </h3>
          </div>
          <button type="button" onClick={handleDecline} className="text-stone-400 hover:text-white text-lg p-1" aria-label="Close modal">
            ✕
          </button>
        </div>

        <p className="text-xs text-stone-300 leading-relaxed font-sans">
          Pick whatever you actually want for your {bikeName} — stand, tie-downs, cleaning kit,
          gear, a spare battery. Everything you tick is 15% off, only while you're adding this bike.
        </p>

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
                <input type="checkbox" checked={checked} onChange={() => toggleAddon(item.slug)} className="w-4 h-4 accent-amber-500 shrink-0" />
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
          <button type="button" onClick={handleDecline} className="w-full py-2.5 px-4 text-xs font-mono text-stone-400 hover:text-white transition text-center">
            No thanks, proceed with bike only
          </button>
        </div>
      </div>
    </div>
  );
}
