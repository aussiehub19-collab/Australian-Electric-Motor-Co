// Shared order shape used by both the WhatsApp order message (lib/whatsapp.ts)
// and the "Email My Order" API route (app/api/order) — one definition so the
// two channels never drift apart on what an order actually contains.

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface OrderCustomer {
  name: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
}

export interface OrderSummary {
  items: OrderItem[];
  subtotal: number;
  bundleSavings?: number;
  cryptoSavings?: number;
  shippingCost: number;
  shippingIsFree: boolean;
  grandTotal: number;
  gstPortion: number;
  paymentLabel: string;
  payIn4?: { instalment: number; dueToday: number } | null;
}

export const AU_STATES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'] as const;

export function money(n: number): string {
  return `$${Math.round(n).toLocaleString()} AUD`;
}

export function formatAddress(c: OrderCustomer): string {
  return `${c.address}, ${c.suburb} ${c.state} ${c.postcode}`;
}

export function isCustomerComplete(c: Partial<OrderCustomer>): c is OrderCustomer {
  return !!(c.name && c.email && c.phone && c.address && c.suburb && c.state && c.postcode);
}
