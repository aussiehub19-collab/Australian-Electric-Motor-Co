'use client';

import { useState, useEffect, useCallback } from 'react';
import { SITE } from '@/src/config/site';
import type { CartItem } from './cart';

const KEY = () => SITE.cartKey || 'mm-cart';

const readCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(KEY());
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeCart = (items: CartItem[]) => {
  localStorage.setItem(KEY(), JSON.stringify(items));
  window.dispatchEvent(new Event('cart-updated'));
};

/** Shared cart read/write, kept in sync across every mounted instance (drawer + checkout page) via the `cart-updated` event. */
export function useCartStorage() {
  // Always start empty so the client's first render matches the server's —
  // localStorage isn't readable during SSR, and reading it in the initial
  // state here (rather than in the effect below) caused a real hydration
  // mismatch on /checkout, which renders different markup for an empty vs
  // non-empty cart (the drawer never showed it, since it renders null while
  // closed). `isHydrated` lets a page wait for the real value instead of
  // flashing "cart is empty" before the effect below corrects it.
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setIsHydrated(true);
    const handleCartUpdate = () => setItems(readCart());
    window.addEventListener('cart-updated', handleCartUpdate);
    return () => window.removeEventListener('cart-updated', handleCartUpdate);
  }, []);

  const saveCart = useCallback((newItems: CartItem[]) => {
    setItems(newItems);
    writeCart(newItems);
  }, []);

  const updateQuantity = useCallback((slug: string, delta: number) => {
    setItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.slug === slug) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
      writeCart(updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.slug !== slug);
      writeCart(updated);
      return updated;
    });
  }, []);

  return { items, isHydrated, saveCart, updateQuantity, removeItem };
}
