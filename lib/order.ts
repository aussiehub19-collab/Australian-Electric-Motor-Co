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
  orderNumber?: string;
}

/**
 * A reference number for correspondence — there's no backend/order database
 * (see CLAUDE.md), so this isn't a sequential ID, just a short, readable tag
 * the customer and the WhatsApp/email order share so both sides can refer to
 * "the same order" without one being generated after the other.
 */
export function generateOrderNumber(): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AEMC-${rand}`;
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

/**
 * Standard payment terms appended to every payment-details email — kept in
 * one place so the 48-hour deadline, reference convention, and confirmation
 * step are worded identically whether the admin used the template or pasted
 * their own instructions (lib/order.ts is imported by both the compose page
 * and the send API, so preview and outgoing email never drift).
 */
export function paymentTermsText(orderNumber: string, contactEmail: string, whatsapp: string): string {
  return `Please complete payment within 48 hours to confirm this order. Use your order number, ${orderNumber || '[order number]'}, as the payment reference/description. Once paid, send a screenshot of the completed payment to ${contactEmail} or WhatsApp ${whatsapp} so we can confirm and get your order ready for dispatch.`;
}
