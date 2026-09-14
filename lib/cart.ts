// Shared cart types + pricing math — used by CartDrawer (display only) and
// the /checkout page (full payment-method + Pay in 4 calculation). Keeping
// this in one place means the two surfaces can never compute a different
// total for the same cart.

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
  isBike?: boolean;
  /** Set when the item's price already carries a one-off discount (e.g. the
   * "New Bike Owner" 15% picker) — excluded from the generic 5% bundle rate
   * below so the two discounts never stack. */
  discountTag?: string;
}

/** 5% "bundle" discount rate applied to parts / accessories / gear when a bike is in the cart. */
export const BUNDLE_RATE = 0.05;

/** Fallback bike test for cart items saved before `isBike` was stored. */
export const itemIsBike = (item: CartItem): boolean =>
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

/** Non-bike items are eligible for the 5% bundle discount once a bike is in the cart — unless they already carry their own one-off discount. */
export const bundleEligible = (item: CartItem, hasBike: boolean): boolean =>
  hasBike && !itemIsBike(item) && !item.discountTag;

export const bundleItemPrice = (item: CartItem, hasBike: boolean): number =>
  bundleEligible(item, hasBike) ? Math.round(item.price * (1 - BUNDLE_RATE)) : item.price;

export interface CartTotalsInput {
  items: CartItem[];
  paymentMethod: 'crypto' | 'payid' | 'bank';
  payInFour: boolean;
  cryptoDiscountRate: number;
  freeShippingThreshold: number;
  shippingFee: number;
  bikeCrateFreight: number;
}

export interface CartTotals {
  hasBike: boolean;
  subtotal: number;
  bundleSavings: number;
  netSubtotal: number;
  cryptoSavings: number;
  finalTotal: number;
  shippingCost: number;
  grandTotal: number;
  gstOnTotal: number;
  isPayIn4: boolean;
  payIn4Instalment: number;
  payIn4ShippingInstalment: number;
  displayedSubtotal: number;
  displayedShipping: number;
  displayedTotal: number;
  gstOnDisplayedTotal: number;
  paymentLabel: string;
}

const GST_RATE = 0.1;
const gstPortion = (inclAmount: number) => Math.round(inclAmount - inclAmount / (1 + GST_RATE));

export function computeCartTotals(input: CartTotalsInput): CartTotals {
  const { items, paymentMethod, payInFour, cryptoDiscountRate, freeShippingThreshold, shippingFee, bikeCrateFreight } = input;

  const hasBike = items.some(itemIsBike);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bundleSavings = items.reduce(
    (sum, item) => sum + (item.price - bundleItemPrice(item, hasBike)) * item.quantity,
    0,
  );
  const netSubtotal = subtotal - bundleSavings;

  const cryptoSavings = paymentMethod === 'crypto' ? Math.round(netSubtotal * (cryptoDiscountRate / 100)) : 0;
  const finalTotal = netSubtotal - cryptoSavings;

  const shippingCost =
    items.length === 0 ? 0 : hasBike ? bikeCrateFreight : netSubtotal >= freeShippingThreshold ? 0 : shippingFee;
  const grandTotal = finalTotal + shippingCost;
  const gstOnTotal = gstPortion(grandTotal);

  // Pay in 4 splits the POST-discount total — a crypto instalment must still be 10% off.
  const isPayIn4 = payInFour;
  const payIn4SubtotalInstalment = Math.round(finalTotal / 4);
  const payIn4ShippingInstalment = shippingCost > 0 ? Math.round(shippingCost / 4) : 0;
  const payIn4Instalment = Math.round((finalTotal + shippingCost) / 4);

  const displayedSubtotal = isPayIn4 ? payIn4SubtotalInstalment : subtotal;
  const displayedShipping = isPayIn4 ? payIn4ShippingInstalment : shippingCost;
  const displayedTotal = isPayIn4 ? payIn4Instalment : grandTotal;
  const gstOnDisplayedTotal = gstPortion(displayedTotal);

  const paymentMethodLabel =
    paymentMethod === 'crypto'
      ? 'Bitcoin (BTC) / Tether (USDT) — 10% discount'
      : paymentMethod === 'payid'
      ? 'PayID instant transfer'
      : 'Direct bank EFT';
  const paymentLabel = isPayIn4
    ? `${paymentMethodLabel}, Pay in 4 (interest-free fortnightly)`
    : paymentMethodLabel;

  return {
    hasBike,
    subtotal,
    bundleSavings,
    netSubtotal,
    cryptoSavings,
    finalTotal,
    shippingCost,
    grandTotal,
    gstOnTotal,
    isPayIn4,
    payIn4Instalment,
    payIn4ShippingInstalment,
    displayedSubtotal,
    displayedShipping,
    displayedTotal,
    gstOnDisplayedTotal,
    paymentLabel,
  };
}
