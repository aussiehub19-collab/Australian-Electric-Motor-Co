'use client';

import React, { useState } from 'react';
import { SITE, STARTER_PACK_BUNDLE } from '@/src/config/site';

interface AddToCartButtonProps {
  product: {
    slug: string;
    name: string;
    price: number;
    category: string;
    images: string[];
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

  const isBike =
    !product.category.includes('parts') &&
    !product.category.includes('gear') &&
    !product.category.includes('accessories') &&
    !product.category.includes('chargers') &&
    !product.category.includes('rotors') &&
    !product.category.includes('helmets') &&
    !product.category.includes('boots') &&
    !product.category.includes('gloves');

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
        });
      }

      localStorage.setItem(SITE.cartKey || 'mm-cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cart-updated'));
    } catch (e) {
      console.error('Error adding to cart:', e);
    }
  };

  const handleAddToCart = () => {
    addItemToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);

    // If adding a bike, prompt the Essential Starter Pack upsell modal
    if (isBike) {
      setShowBundleModal(true);
    }
  };

  const handleAddBundleAndProceed = () => {
    addItemToCart({
      slug: STARTER_PACK_BUNDLE.slug || 'essential-starter-pack',
      name: STARTER_PACK_BUNDLE.name,
      price: STARTER_PACK_BUNDLE.price,
      category: 'accessories',
      image: STARTER_PACK_BUNDLE.image,
    });
    setShowBundleModal(false);
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handleDeclineBundle = () => {
    setShowBundleModal(false);
    window.dispatchEvent(new CustomEvent('open-cart'));
  };

  const handlePayIn4Checkout = () => {
    addItemToCart(product);
    if (isBike) {
      setShowBundleModal(true);
    } else {
      window.dispatchEvent(
        new CustomEvent('open-cart', {
          detail: { paymentMethod: 'pay-in-4' },
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

      {/* Cross-Category Bundle Upsell Modal */}
      {showBundleModal && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="bundle-modal-title"
        >
          <div className="bg-[#17191C] border border-amber-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative text-left">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded border border-amber-500/40">
                  ⚡ Special Bike Owner Bundle Offer
                </span>
                <h3
                  id="bundle-modal-title"
                  className="text-xl font-black text-white font-sans mt-2"
                >
                  Essential Starter Pack (Save 15%)
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
              Add the indispensable maintenance and transport trio to your {product.name} build at our exclusive crate bundle rate:
            </p>

            {/* Bundle Items Breakdown */}
            <div className="bg-[#121417] border border-[#2B2F36] rounded-xl p-4 space-y-3 font-mono text-xs">
              {STARTER_PACK_BUNDLE.items.map((item) => (
                <div key={item.slug} className="flex items-center justify-between text-stone-200">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span className="truncate max-w-[260px] font-sans">{item.name}</span>
                  </div>
                  <span className="text-stone-400 line-through">${item.price} AUD</span>
                </div>
              ))}

              <div className="pt-3 border-t border-[#23272E] flex justify-between items-baseline">
                <div>
                  <span className="text-stone-400">Regular Total:</span>{' '}
                  <span className="line-through text-stone-500">${STARTER_PACK_BUNDLE.originalPrice} AUD</span>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-amber-400 font-mono">
                    Bundle Price: ${STARTER_PACK_BUNDLE.price} AUD
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    You Save ${STARTER_PACK_BUNDLE.savings} AUD (15% Off)
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleAddBundleAndProceed}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-600 to-[#8C4A2F] hover:from-amber-500 hover:to-[#A35839] text-white shadow-xl flex items-center justify-center gap-2"
              >
                <span>Add Essential Starter Pack ($229 AUD) &rarr;</span>
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
