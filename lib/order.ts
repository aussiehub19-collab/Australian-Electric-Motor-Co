import { escapeHtml } from '@/lib/emailTemplate';

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

export interface PaymentTermsOptions {
  orderNumber: string;
  contactEmail: string;
  /** Display text for the WhatsApp number, e.g. "+61 480 811 308". */
  whatsapp: string;
  /** Full wa.me link, pre-filled — build with lib/whatsapp.ts#waPaymentConfirmationLink.
   * Taken as a prop rather than built here to avoid a circular import
   * (lib/whatsapp.ts itself imports OrderSummary/money from this file). */
  whatsappLink: string;
  /** Shows the Osko/PayID fast-transfer callout — only relevant for bank
   * transfer and PayID, where an instant-clearing rail actually exists. */
  showOskoNote?: boolean;
}

/**
 * Standard payment terms appended to every payment-details email — kept in
 * one place so the 48-hour deadline, reference convention, Osko/PayID note
 * and confirmation step are worded identically everywhere they appear
 * (admin preview, outgoing email, the order-confirmation page).
 */
export function paymentTermsLines(opts: PaymentTermsOptions): string[] {
  const lines = [
    'Complete payment within 48 hours to confirm this order.',
    `Use your order number — ${opts.orderNumber || '[order number]'} — as the payment reference/description.`,
  ];
  if (opts.showOskoNote) {
    lines.push('Use Osko / PayID transfer where possible — it clears instantly, so your order gets confirmed fastest.');
  }
  lines.push(`Once paid, send a screenshot of the completed payment to ${opts.contactEmail} or WhatsApp ${opts.whatsapp} for confirmation.`);
  return lines;
}

/** Same content as paymentTermsLines(), as an HTML bullet list with a
 * clickable mailto: and WhatsApp link — for the actual outbound email
 * (lib/emailTemplate.ts's EmailRow.html), which needs real markup rather
 * than escaped plain text. */
export function paymentTermsHtml(opts: PaymentTermsOptions): string {
  const points = [
    'Complete payment within <strong>48 hours</strong> to confirm this order.',
    `Use your order number — <strong>${escapeHtml(opts.orderNumber || '[order number]')}</strong> — as the payment reference/description.`,
  ];
  if (opts.showOskoNote) {
    points.push(
      '<strong style="color:#8C4A2F;">Use Osko / PayID transfer</strong> where possible — it clears instantly, so your order gets confirmed fastest.',
    );
  }
  points.push(
    `Once paid, send a screenshot of the completed payment to <a href="mailto:${escapeHtml(opts.contactEmail)}" style="color:#8C4A2F;font-weight:700;text-decoration:underline;">${escapeHtml(opts.contactEmail)}</a> or WhatsApp <a href="${escapeHtml(opts.whatsappLink)}" style="color:#8C4A2F;font-weight:700;text-decoration:underline;">${escapeHtml(opts.whatsapp)}</a> for confirmation.`,
  );
  return `<ul style="margin:0;padding-left:18px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.7;color:#17191C;">${points
    .map((p) => `<li style="margin-bottom:6px;">${p}</li>`)
    .join('')}</ul>`;
}
