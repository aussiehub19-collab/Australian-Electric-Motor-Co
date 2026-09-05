'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SmartImage } from './SmartImage';
import { SHOP, FINANCE, CONTACT, SITE, STARTER_PACK_BUNDLE } from '@/src/config/site';

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  isBike?: boolean;
}

/** 5% "bundle" discount rate applied to parts / accessories / gear when a bike is in the cart. */
const BUNDLE_RATE = 0.05;

/** Fallback bike test for cart items saved before `isBike` was stored. */
const itemIsBike = (item: CartItem) =>
  item.isBike ??
  (!item.category.includes('parts') &&
    !item.category.includes('gear') &&
    !item.category.includes('accessories') &&
    !item.category.includes('charger') &&
    !item.category.includes('rotor') &&
    !item.category.includes('helmet') &&
    !item.category.includes('boot') &&
    !item.category.includes('glove') &&
    !item.category.includes('batter'));

export function CartDrawer({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(SITE.cartKey || 'mm-cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [paymentMethod, setPaymentMethod] = useState<'crypto' | 'pay-in-4' | 'payid' | 'bank'>('crypto');
  const [copiedPayId, setCopiedPayId] = useState(false);

  useEffect(() => {
    const handleCartUpdate = () => {
      try {
        const stored = localStorage.getItem(SITE.cartKey || 'mm-cart');
        setItems(stored ? JSON.parse(stored) : []);
      } catch (e) {
        console.error('Failed to load cart:', e);
      }
    };
    const handleOpenCart = (e: any) => {
      if (e?.detail?.paymentMethod) {
        setPaymentMethod(e.detail.paymentMethod);
      }
    };
    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('open-cart', handleOpenCart);
    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('open-cart', handleOpenCart);
    };
  }, []);

  const saveCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem(SITE.cartKey || 'mm-cart', JSON.stringify(newItems));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const updateQuantity = (slug: string, delta: number) => {
    const updated = items
      .map((item) => {
        if (item.slug === slug) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean) as CartItem[];
    saveCart(updated);
  };

  const removeItem = (slug: string) => {
    const updated = items.filter((item) => item.slug !== slug);
    saveCart(updated);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Has a bike in the cart? Parts / batteries / chargers / accessories / gear then
  // qualify for a 5% "bought-with-a-bike" bundle discount.
  const hasBike = items.some(itemIsBike);
  const hasStarterPack = items.some((item) => item.slug === 'essential-starter-pack');

  /** Line items eligible for the 5% bundle discount (non-bike items when a bike is in the cart). */
  const bundleEligible = (item: CartItem) =>
    hasBike && !itemIsBike(item) && item.slug !== 'essential-starter-pack';

  const bundleItemPrice = (item: CartItem) =>
    bundleEligible(item) ? Math.round(item.price * (1 - BUNDLE_RATE)) : item.price;

  const bundleSavings = items.reduce(
    (sum, item) => sum + (item.price - bundleItemPrice(item)) * item.quantity,
    0
  );

  // Net subtotal after the bundle discount — this is the base for crypto / Pay in 4 / totals.
  const netSubtotal = subtotal - bundleSavings;

  const cryptoDiscountRate = SHOP.cryptoDiscount || 10;
  const cryptoSavings = paymentMethod === 'crypto' ? Math.round(netSubtotal * (cryptoDiscountRate / 100)) : 0;
  const finalTotal = netSubtotal - cryptoSavings;

  const addStarterPackToCart = () => {
    const existingIndex = items.findIndex((i) => i.slug === 'essential-starter-pack');
    if (existingIndex > -1) {
      updateQuantity('essential-starter-pack', 1);
    } else {
      const newItem: CartItem = {
        slug: 'essential-starter-pack',
        name: STARTER_PACK_BUNDLE.name,
        price: STARTER_PACK_BUNDLE.price,
        category: 'accessories',
        image: STARTER_PACK_BUNDLE.image,
        quantity: 1,
      };
      saveCart([...items, newItem]);
    }
  };

  const shippingCost = items.length === 0 ? 0 : hasBike ? SHOP.bikeCrateFreight : netSubtotal >= SHOP.freeShippingThreshold ? 0 : SHOP.shippingFee;
  const grandTotal = finalTotal + shippingCost;

  // Pay in 4 calculations: Automatically updates subtotal and total to 1st instalment
  const isPayIn4 = paymentMethod === 'pay-in-4';
  const payIn4SubtotalInstalment = Math.round(netSubtotal / 4);
  const payIn4ShippingInstalment = shippingCost > 0 ? Math.round(shippingCost / 4) : 0;
  const payIn4Instalment = Math.round((netSubtotal + shippingCost) / 4);

  // Dynamic figures according to selected payment method
  const displayedSubtotal = isPayIn4 ? payIn4SubtotalInstalment : subtotal;
  const displayedShipping = isPayIn4 ? payIn4ShippingInstalment : shippingCost;
  const displayedTotal = isPayIn4 ? payIn4Instalment : grandTotal;

  // GST is 10% and already included in every AUD price. The GST portion of a
  // GST-inclusive amount is amount ÷ 11.
  const GST_RATE = 0.1;
  const gstPortion = (inclAmount: number) => Math.round(inclAmount - inclAmount / (1 + GST_RATE));
  const gstOnTotal = gstPortion(grandTotal);
  const gstOnDisplayedTotal = gstPortion(displayedTotal);

  // Build WhatsApp Order Link
  const buildWhatsAppOrderUrl = () => {
    const lines = [
      `G'day Australian Electric Motor Co team! I would like to place an order:`,
      ...items.map((i) => `• ${i.quantity}x ${i.name} ($${i.price.toLocaleString()} AUD Inc. GST)`),
      `Subtotal: $${subtotal.toLocaleString()} AUD (Inc. GST)`,
      bundleSavings > 0
        ? `Bundle Discount — 5% off parts & accessories bought with a bike: -$${bundleSavings.toLocaleString()} AUD`
        : '',
      isPayIn4
        ? `Order Subtotal After Discounts: $${netSubtotal.toLocaleString()} AUD (1st Instalment Due Today: $${displayedSubtotal.toLocaleString()} AUD)`
        : '',
      paymentMethod === 'crypto' ? `10% Crypto Discount: -$${cryptoSavings.toLocaleString()} AUD` : '',
      isPayIn4
        ? `Payment Terms: Pay in 4 Selected (1st Instalment: $${displayedTotal.toLocaleString()} AUD today, followed by 3x $${payIn4Instalment.toLocaleString()} AUD fortnightly)`
        : '',
      isPayIn4 && shippingCost > 0
        ? `Estimated Freight (1st Instalment): $${displayedShipping.toLocaleString()} AUD (Full Freight: $${shippingCost} AUD)`
        : `Estimated Freight: ${shippingCost === 0 ? 'FREE' : `$${shippingCost} AUD (Enclosed Crate / Courier)`}`,
      isPayIn4
        ? `Total Payable Today (1st Instalment): $${displayedTotal.toLocaleString()} AUD (Full Order Value: $${grandTotal.toLocaleString()} AUD Inc. GST)`
        : `Total Payable: $${grandTotal.toLocaleString()} AUD (Inc. GST)`,
      `GST included in this order (10%): $${gstOnTotal.toLocaleString()} AUD`,
      `Selected Payment Option: ${
        paymentMethod === 'crypto'
          ? 'Bitcoin (BTC) / Tether (USDT) with 10% Discount'
          : paymentMethod === 'pay-in-4'
          ? 'Pay in 4 (Interest-Free Fortnightly — 1st Instalment Today)'
          : paymentMethod === 'payid'
          ? 'PayID Instant Transfer'
          : 'Direct Bank EFT'
      }`,
      `Delivery Location: NSW / Australia wide (ABN: 97 628 671 689)`,
      `Please confirm stock allocation and dispatch timeline. Cheers!`,
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  const handleCopyPayId = () => {
    if (SHOP.payId) {
      navigator.clipboard.writeText(SHOP.payId);
      setCopiedPayId(true);
      setTimeout(() => setCopiedPayId(false), 2000);
    }
  };

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
                      {bundleEligible(item) ? (
                        <>
                          <span className="text-xs text-amber-400 font-mono font-bold">
                            ${bundleItemPrice(item).toLocaleString()} AUD
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
                      {paymentMethod === 'crypto' && (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          (${Math.round(bundleItemPrice(item) * 0.9).toLocaleString()} in BTC/USDT)
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

            {/* Essential Starter Pack Cross-Category Upsell Hook */}
            {hasBike && !hasStarterPack && items.length > 0 && (
              <div className="p-3.5 bg-gradient-to-br from-amber-950/30 via-[#1D2024] to-[#17191C] border border-amber-500/40 rounded-xl space-y-2.5 mt-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs">⚡</span>
                      <span className="text-[11px] font-mono font-bold text-amber-300 uppercase tracking-wide">
                        Essential Starter Pack Offer (Save 15%)
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-300 mt-1 font-sans leading-tight">
                      Add Polisport Foldable Stand + Ballard&apos;s Tie-Downs + Muc-Off Waterless Wash for <strong>$229 AUD</strong> (Regular $270 AUD).
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addStarterPackToCart}
                  className="w-full py-2 px-3 bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold rounded-lg transition shadow flex items-center justify-center gap-1.5 font-mono"
                >
                  <span>+ Add Starter Pack ($229 AUD)</span>
                  <span className="text-amber-200 text-[10px]">(Save $41)</span>
                </button>
              </div>
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
            <div className="p-4 sm:p-5 border-t border-[#2B2F36] bg-[#121417] space-y-4">
              {/* Payment selector */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-mono font-semibold text-stone-400 uppercase tracking-wider">
                    Select Payment Plan
                  </label>
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    ⚡ 10% Off via Crypto
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('crypto')}
                    className={`py-2 px-1 text-[11px] font-mono font-medium rounded-lg border text-center transition ${
                      paymentMethod === 'crypto'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold ring-1 ring-amber-500/50'
                        : 'border-[#2B2F36] bg-[#1D2024] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    Crypto (-10%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay-in-4')}
                    className={`py-2 px-1 text-[11px] font-mono font-medium rounded-lg border text-center transition ${
                      paymentMethod === 'pay-in-4'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold ring-1 ring-amber-500/50'
                        : 'border-[#2B2F36] bg-[#1D2024] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    Pay in 4
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('payid')}
                    className={`py-2 px-1 text-[11px] font-mono font-medium rounded-lg border text-center transition ${
                      paymentMethod === 'payid'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold ring-1 ring-amber-500/50'
                        : 'border-[#2B2F36] bg-[#1D2024] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    PayID
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank')}
                    className={`py-2 px-1 text-[11px] font-mono font-medium rounded-lg border text-center transition ${
                      paymentMethod === 'bank'
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold ring-1 ring-amber-500/50'
                        : 'border-[#2B2F36] bg-[#1D2024] text-stone-400 hover:border-stone-600'
                    }`}
                  >
                    Bank EFT
                  </button>
                </div>
              </div>

              {/* Pay in 4 Schedule Snippet */}
              {paymentMethod === 'pay-in-4' && (
                <div className="p-3 bg-[#17191C] border border-amber-500/30 rounded-xl text-xs text-stone-300 space-y-2">
                  <div className="flex items-center justify-between text-amber-300 font-bold font-mono">
                    <span className="flex items-center gap-1">💳 Pay in 4 Schedule</span>
                    <span>0% Interest</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 text-[11px] text-center font-mono">
                    <div className="bg-[#121417] p-1.5 rounded border border-stone-800">
                      <div className="text-stone-400">Today</div>
                      <div className="font-bold text-white">${payIn4Instalment}</div>
                    </div>
                    <div className="bg-[#121417] p-1.5 rounded border border-stone-800">
                      <div className="text-stone-400">2 Wks</div>
                      <div className="font-bold text-white">${payIn4Instalment}</div>
                    </div>
                    <div className="bg-[#121417] p-1.5 rounded border border-stone-800">
                      <div className="text-stone-400">4 Wks</div>
                      <div className="font-bold text-white">${payIn4Instalment}</div>
                    </div>
                    <div className="bg-[#121417] p-1.5 rounded border border-stone-800">
                      <div className="text-stone-400">6 Wks</div>
                      <div className="font-bold text-white">${payIn4Instalment}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* PayID snippet if selected */}
              {paymentMethod === 'payid' && (
                <div className="p-2.5 bg-[#17191C] border border-[#2B2F36] rounded-xl text-xs text-stone-300 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-400 font-mono">PayID Aussie Transfer:</span>
                    <button
                      type="button"
                      onClick={handleCopyPayId}
                      className="text-amber-400 hover:underline font-mono text-[11px] font-bold"
                    >
                      {copiedPayId ? 'Copied!' : 'Copy PayID'}
                    </button>
                  </div>
                  <p className="font-mono text-stone-100 font-bold">{SHOP.payId}</p>
                </div>
              )}

              {/* Bank Transfer details if selected */}
              {paymentMethod === 'bank' && (
                <div className="p-2.5 bg-[#17191C] border border-[#2B2F36] rounded-xl text-xs text-stone-300 space-y-1 font-mono">
                  <div className="text-stone-400 font-semibold">{SHOP.bankDetails.bankName}</div>
                  <div className="flex justify-between">
                    <span>BSB:</span>
                    <span className="font-bold text-white">{SHOP.bankDetails.bsb}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account:</span>
                    <span className="font-bold text-white">{SHOP.bankDetails.accountNumber}</span>
                  </div>
                </div>
              )}

              {/* Price calculations */}
              <div className="space-y-1.5 text-xs text-stone-400 font-mono bg-[#141619] p-3 rounded-xl border border-[#2B2F36]">
                <div className="flex justify-between items-baseline">
                  <span className="flex items-center gap-1.5">
                    <span>Subtotal</span>
                    {isPayIn4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                        1st Instalment
                      </span>
                    )}
                  </span>
                  <div className="text-right">
                    <span className="font-semibold text-stone-200">
                      ${displayedSubtotal.toLocaleString()} AUD
                    </span>
                    {isPayIn4 && (
                      <div className="text-[10px] text-stone-400 line-through">
                        Full: ${(bundleSavings > 0 ? netSubtotal : subtotal).toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                </div>

                {bundleSavings > 0 && !isPayIn4 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Bundle Discount (5% off parts &amp; gear with a bike)</span>
                    <span>-${bundleSavings.toLocaleString()} AUD</span>
                  </div>
                )}
                {bundleSavings > 0 && isPayIn4 && (
                  <div className="flex justify-between text-emerald-400/90 text-[10px]">
                    <span>Incl. 5% bundle discount on parts &amp; gear</span>
                    <span>-${bundleSavings.toLocaleString()} AUD</span>
                  </div>
                )}

                {paymentMethod === 'crypto' && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>10% Crypto Discount (BTC/USDT)</span>
                    <span>-${cryptoSavings.toLocaleString()} AUD</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline">
                  <span className="flex items-center gap-1.5">
                    <span>Freight Delivery</span>
                    {isPayIn4 && shippingCost > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                        1st of 4
                      </span>
                    )}
                  </span>
                  <div className="text-right">
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-emerald-400 uppercase font-bold">Free</span>
                      ) : (
                        `$${displayedShipping.toLocaleString()} AUD`
                      )}
                    </span>
                    {isPayIn4 && shippingCost > 0 && (
                      <div className="text-[10px] text-stone-400 line-through">
                        Full: ${shippingCost} AUD
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-baseline">
                  <span className="flex items-center gap-1.5">
                    <span>GST (10%, included)</span>
                    {isPayIn4 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-semibold">
                        this instalment
                      </span>
                    )}
                  </span>
                  <div className="text-right">
                    <span className="text-stone-300">${gstOnDisplayedTotal.toLocaleString()} AUD</span>
                    {isPayIn4 && (
                      <div className="text-[10px] text-stone-400">
                        Full order GST: ${gstOnTotal.toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-baseline text-sm font-bold text-stone-100 pt-2.5 border-t border-[#2B2F36]">
                  <div>
                    <span className="text-white">
                      {isPayIn4 ? 'Total (1st Instalment Due Today)' : 'Total Amount (Inc. GST)'}
                    </span>
                    <div className="text-[10px] font-normal text-emerald-400 mt-0.5 font-mono">
                      ✓ Incl. ${gstOnDisplayedTotal.toLocaleString()} AUD GST (10%) · Tax invoice provided
                    </div>
                    {isPayIn4 && (
                      <div className="text-[10px] font-normal text-amber-400/90 mt-0.5">
                        Followed by 3 fortnightly payments of ${payIn4Instalment.toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 text-lg font-black font-mono">
                      ${displayedTotal.toLocaleString()} AUD
                    </span>
                    {isPayIn4 && (
                      <div className="text-[10px] font-normal text-stone-400 line-through">
                        Full Order: ${grandTotal.toLocaleString()} AUD
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkout actions */}
              <div className="space-y-2 pt-1">
                <a
                  href={buildWhatsAppOrderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold py-3 px-4 rounded-xl text-sm transition shadow-lg text-center"
                >
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.586-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.183-.077.359.101.176.449.741.964 1.201.662.591 1.221.774 1.394.861.173.086.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z" />
                  </svg>
                  <span>
                    {isPayIn4
                      ? `Checkout via WhatsApp (1st Instalment: $${displayedTotal.toLocaleString()} AUD)`
                      : 'Checkout via WhatsApp'}
                  </span>
                </a>

                <Link
                  href={`/contact/?subject=${encodeURIComponent(
                    isPayIn4
                      ? `Pay in 4 Order Inquiry (1st Instalment $${displayedTotal} AUD)`
                      : 'Order Inquiry'
                  )}`}
                  onClick={onClose}
                  className="w-full flex items-center justify-center bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-3 px-4 rounded-xl text-sm transition text-center"
                >
                  {isPayIn4
                    ? `Request Official Invoice (1st Instalment: $${displayedTotal.toLocaleString()} AUD)`
                    : 'Request Official Invoice & Pay in 4'}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
