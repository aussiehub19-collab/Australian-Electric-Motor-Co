import { CONTACT, SITE } from '@/config/site';

/** Digits-only WhatsApp number, ready for a wa.me/<number> link. */
export const WHATSAPP_NUMBER = CONTACT.whatsapp.replace(/[^0-9]/g, '');

/**
 * Header prepended to every pre-filled WhatsApp message. It becomes the first
 * line of the customer's chat thread, so both sides can see which business the
 * conversation is about. WhatsApp renders *text* as bold.
 */
export const WA_HEADER = `*${SITE.name}*\n${SITE.domain}`;

/**
 * Build a wa.me link whose pre-filled message opens with the business name and
 * site. Pass the body as a string or an array of lines.
 *
 * Note: the *contact name* WhatsApp shows at the top of the thread is taken
 * from the recipient's WhatsApp Business profile (set in the WhatsApp Business
 * app → Settings → Business tools → Profile), not from the link — this header
 * is how the site puts the brand in the message itself.
 */
export function waLink(body: string | string[]): string {
  const text = Array.isArray(body) ? body.filter(Boolean).join('\n') : body;
  const message = `${WA_HEADER}\n\n${text}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Generic "I have a question" enquiry link, used for bare chat buttons. */
export function waEnquiryLink(topic?: string): string {
  return waLink(
    topic
      ? `Hi, I have a question about ${topic}.`
      : `Hi, I have a question about your electric dirt bikes.`,
  );
}

export interface WaOrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface WaOrderSummary {
  items: WaOrderItem[];
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

/**
 * Compose the "new order" WhatsApp message from the cart. Every figure the
 * checkout drawer shows the customer is carried into the message so the order
 * arrives complete.
 */
export function waOrderLink(o: WaOrderSummary): string {
  const money = (n: number) => `$${Math.round(n).toLocaleString()} AUD`;

  const lines: string[] = ['*NEW ORDER*', ''];

  for (const it of o.items) {
    const lineTotal = it.price * it.quantity;
    const each = it.quantity > 1 ? ` (${money(it.price)} ea)` : '';
    lines.push(`${it.quantity}x ${it.name} — ${money(lineTotal)}${each}`);
  }

  lines.push('');
  lines.push(`Subtotal: ${money(o.subtotal)} (inc. GST)`);
  if (o.bundleSavings && o.bundleSavings > 0) {
    lines.push(`Bundle discount (5%): -${money(o.bundleSavings)}`);
  }
  if (o.cryptoSavings && o.cryptoSavings > 0) {
    lines.push(`Crypto discount (10%): -${money(o.cryptoSavings)}`);
  }
  lines.push(
    `Freight: ${o.shippingIsFree ? 'FREE' : `${money(o.shippingCost)} (enclosed crate / courier)`}`,
  );
  lines.push(`*Total payable: ${money(o.grandTotal)} (inc. GST)*`);
  lines.push(`GST included (10%): ${money(o.gstPortion)}`);
  lines.push('');
  lines.push(`Payment: ${o.paymentLabel}`);
  if (o.payIn4) {
    lines.push(
      `Pay in 4: ${money(o.payIn4.dueToday)} due today, then 3x ${money(o.payIn4.instalment)} fortnightly`,
    );
  }
  lines.push(`Deliver to: (name, address, suburb, state, postcode)`);
  lines.push(`ABN ${CONTACT.abn}`);
  lines.push('');
  lines.push('Please confirm stock allocation and dispatch timeline. Cheers!');

  return waLink(lines);
}
