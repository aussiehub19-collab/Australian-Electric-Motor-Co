'use client';

import React from 'react';
import Link from 'next/link';
import { SmartImage } from './SmartImage';
import { SHOP } from '@/src/config/site';
import { useCartStorage } from '@/lib/useCartStorage';
import { computeCartTotals, bundleEligible, bundleItemPrice, itemIsBike, type CartItem } from '@/lib/cart';

export type { CartItem };

/**
 * The side panel is cart contents only — quantities, the bundle discount,
 * a plain total, and one action: Proceed to Checkout. Payment method, Pay in
 * 4, delivery details and the WhatsApp/Email choice all live on /checkout/.
 */
export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { items, updateQuantity, removeItem } = useCartStorage();

  // Neutral totals (no payment-method discount, no Pay in 4 split) — those are chosen at checkout.
  const { hasBike, subtotal, bundleSavings, shippingCost, grandTotal, gstOnTotal } = computeCartTotals({
    items,
    paymentMethod: 'bank',
    payInFour: false,
    cryptoDiscountRate: SHOP.cryptoDiscount || 10,
    freeShippingThreshold: SHOP.freeShippingThreshold,
    shippingFee: SHOP.shippingFee,
    bikeCrateFreight: SHOP.bikeCrateFreight,
  });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-[#17191C] border-l border-[#2B2F36] text-stone-100 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#2B2F36] flex items-center justify-between bg-[#141619]">
            <h2 id="cart-title" className="text-lg sm:text-xl font-bold tracking-tight text-stone-100 flex items-center gap-2 font-sans">
              <span>Rider Cart</span>
              <span className="text-xs bg-[#8C4A2F] text-white px-2 py-0.5 rounded-full font-mono">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-[#20242A] focus-visible:ring-2 focus-visible:ring-amber-500"
              aria-label="Close cart drawer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1D2024] border border-[#2B2F36] flex items-center justify-center text-amber-400 text-3xl">
                  ⚡
                </div>
                <div className="space-y-1">
                  <p className="text-stone-200 font-bold">Your cart is empty.</p>
                  <p className="text-xs text-stone-400">Ready to build your ultimate electric dirt bike setup?</p>
                </div>
                <Link
                  href="/shop/"
                  onClick={onClose}
                  className="inline-block bg-[#8C4A2F] hover:bg-[#A35839] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-lg"
                >
                  Explore Dirt Bikes &amp; Gear
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.slug}
                  className="flex gap-3.5 p-3 bg-[#1D2024] border border-[#2B2F36] rounded-xl items-center group"
                >
                  <div className="relative w-20 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden border border-stone-800">
                    <SmartImage src={item.image} alt={item.name} fill fit="contain" className="p-1" sizes="80px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-stone-100 truncate">{item.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                      {bundleEligible(item, hasBike) ? (
                        <>
                          <span className="text-xs text-amber-400 font-mono font-bold">
                            ${bundleItemPrice(item, hasBike).toLocaleString()} AUD
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono line-through">
                            ${item.price.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-mono font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded px-1 py-0.5 uppercase tracking-wide">
                            Bundle −5%
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-amber-400 font-mono font-bold">
                          ${item.price.toLocaleString()} AUD
                        </span>
                      )}
                      {item.discountTag && (
                        <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 rounded px-1 py-0.5 uppercase tracking-wide">
                          New Owner −15%
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#2B2F36] rounded-lg bg-[#141619]">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, -1)}
                          className="px-2.5 py-1 text-xs text-stone-400 hover:text-white"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono font-bold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.slug, 1)}
                          className="px-2.5 py-1 text-xs text-stone-400 hover:text-white"
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.slug)}
                        className="text-xs text-stone-400 hover:text-rose-400 ml-auto transition font-mono"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Bike + accessory bundle discount status */}
            {items.length > 0 && bundleSavings > 0 && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2 mt-2">
                <span className="text-emerald-400 text-sm leading-none mt-0.5">✓</span>
                <p className="text-[11px] text-emerald-200 font-sans leading-tight">
                  <strong className="font-bold">Bundle discount applied.</strong> 5% off every part,
                  battery, charger &amp; accessory in this order because you&apos;re buying a bike —
                  you save <strong>${bundleSavings.toLocaleString()} AUD</strong>.
                </p>
              </div>
            )}
            {items.length > 0 && !hasBike && items.some((i) => !itemIsBike(i)) && (
              <div className="p-3 bg-[#1D2024] border border-[#2B2F36] rounded-xl flex items-start gap-2 mt-2">
                <span className="text-amber-400 text-sm leading-none mt-0.5">💡</span>
                <p className="text-[11px] text-stone-300 font-sans leading-tight">
                  Add any electric dirt bike to unlock <strong className="text-amber-300">5% off</strong>{' '}
                  these parts &amp; accessories — spares and upgrades are discounted when bought with a bike.
                </p>
              </div>
            )}
          </div>

          {/* Footer / Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#2B2F36] bg-[#121417] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-400 font-mono">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-200">${subtotal.toLocaleString()} AUD</span>
                </div>
                {bundleSavings > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Bundle Discount (5%)</span>
                    <span>-${bundleSavings.toLocaleString()} AUD</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Freight Delivery</span>
                  <span>{shippingCost === 0 ? <span className="text-emerald-400 uppercase font-bold">Free</span> : `$${shippingCost.toLocaleString()} AUD`}</span>
                </div>
                <div className="flex justify-between items-baseline text-sm font-bold text-stone-100 pt-2 border-t border-[#2B2F36]">
                  <div>
                    <span className="text-white">Total (Inc. GST)</span>
                    <div className="text-[10px] font-normal text-emerald-400 mt-0.5">
                      ✓ Incl. ${gstOnTotal.toLocaleString()} AUD GST (10%)
                    </div>
                  </div>
                  <span className="text-amber-400 text-lg font-black font-mono">${grandTotal.toLocaleString()} AUD</span>
                </div>
                <p className="text-[10px] text-stone-500 text-center pt-1">
                  10% off with crypto &amp; Pay in 4 available at checkout
                </p>
              </div>

              <Link
                href="/checkout/"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition shadow-lg text-center"
              >
                <span>Proceed to Checkout</span>
                <span>&rarr;</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
