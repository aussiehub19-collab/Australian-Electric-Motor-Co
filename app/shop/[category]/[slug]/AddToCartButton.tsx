'use client';

import React, { useState } from 'react';
import { SITE } from '@/src/config/site';
import { NewOwnerAccessoriesModal } from '@/components/NewOwnerAccessoriesModal';

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

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const [showBundleModal, setShowBundleModal] = useState(false);

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

      <NewOwnerAccessoriesModal
        isOpen={showBundleModal}
        bikeName={product.name}
        bikeBrandName={product.brandName}
        onClose={() => setShowBundleModal(false)}
      />
    </div>
  );
}
