import { CONTACT, SITE } from '@/config/site';
import { money, formatAddress, type OrderSummary, type OrderCustomer } from '@/lib/order';

/** Digits-only WhatsApp number, ready for a wa.me/<number> link. */
export const WHATSAPP_NUMBER = CONTACT.whatsapp.replace(/[^0-9]/g, '');

/**
 * Header prepended to every pre-filled WhatsApp message. It becomes the first
 * line of the customer's chat thread, so both sides can see which business the
 * conversation is about. WhatsApp renders *text* as bold.
 */
export const WA_HEADER = `*${SITE.name}*`;

/**
 * Every wa.me link this site generates opens with the same bold business
 * name as its first line — whether the chat is the business's own number
 * (a customer messaging in) or a customer's number (the admin messaging
 * out) — so there's never any ambiguity about which business the message
 * is from, regardless of what name/photo is set on either side's profile.
 */
function buildWaLink(toNumber: string, body: string | string[]): string {
  // Preserve '' entries as intentional blank lines (spacing between
  // sections) — callers omit a conditional line entirely with an `if`
  // rather than pushing '', so nothing here is meant to be stripped.
  const text = Array.isArray(body) ? body.join('\n') : body;
  const message = `${WA_HEADER}\n\n${text}`;
  return `https://wa.me/${toNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Build a wa.me link to the BUSINESS's own number — used for every
 * customer-facing "message us" link (checkout, enquiries, payment
 * confirmation). Pass the body as a string or an array of lines.
 *
 * Note: the *contact name* WhatsApp shows at the top of the thread is taken
 * from the recipient's WhatsApp Business profile (set in the WhatsApp Business
 * app → Settings → Business tools → Profile), not from the link — this header
 * is how the site puts the brand in the message itself.
 */
export function waLink(body: string | string[]): string {
  return buildWaLink(WHATSAPP_NUMBER, body);
}

/** The exact text a wa.me link would pre-fill, without the URL wrapper —
 * for a "copy the message" fallback when a redirect isn't reliable (e.g.
 * desktop with no WhatsApp Web session logged in). */
export function waMessageText(body: string | string[]): string {
  const text = Array.isArray(body) ? body.join('\n') : body;
  return `${WA_HEADER}\n\n${text}`;
}

/** Digits-only, AU-country-coded phone number ready for a wa.me/<number>
 * link. Customers type their phone in all sorts of local formats (0412 345
 * 678, (04) 12345678, +61 412 345 678) — this normalises any of them. */
function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('61')) return digits;
  if (digits.startsWith('0')) return `61${digits.slice(1)}`;
  return `61${digits}`;
}

/** Build a wa.me link to an arbitrary (customer's) number — used when the
 * admin replies to a specific customer's chat rather than the business's
 * own number receiving a message. */
export function waLinkTo(phone: string, body: string | string[]): string {
  return buildWaLink(toWhatsAppNumber(phone), body);
}

/** Generic "I have a question" enquiry link, used for bare chat buttons. */
export function waEnquiryLink(topic?: string): string {
  return waLink(
    topic
      ? `Hi, I have a question about ${topic}.`
      : `Hi, I have a question about your electric dirt bikes.`,
  );
}

/**
 * wa.me link pre-filled to open a payment-confirmation chat for a specific
 * order — used wherever a customer is asked to send their payment
 * screenshot via WhatsApp (the order-confirmation page, the payment-details
 * email). The intro line does the work of routing the chat; the screenshot
 * itself still has to be attached by the customer once the chat opens.
 */
export function waPaymentConfirmationLink(orderNumber: string): string {
  return waLink([`Hi, here's my payment confirmation for Order ${orderNumber}.`, 'Screenshot attached below 👇']);
}

const DIVIDER = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';

/**
 * Compose the "new order" WhatsApp message from the cart. Every figure the
 * checkout page shows the customer is carried into the message so the order
 * arrives complete, plus the customer's own delivery details. Dividers +
 * section emoji keep a long order readable as a chat message rather than a
 * wall of "Label: value" lines.
 */
export function waOrderLink(o: OrderSummary, customer: OrderCustomer): string {
  const lines: string[] = [
    o.orderNumber ? `🛵 *NEW ORDER* · ${o.orderNumber}` : '🛵 *NEW ORDER*',
    DIVIDER,
  ];

  for (const it of o.items) {
    const lineTotal = it.price * it.quantity;
    const each = it.quantity > 1 ? ` (${money(it.price)} ea)` : '';
    lines.push(`▪️ ${it.quantity}x ${it.name} — ${money(lineTotal)}${each}`);
  }
  lines.push(DIVIDER);

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
  lines.push(DIVIDER);
  lines.push(`*Total payable: ${money(o.grandTotal)} (inc. GST)*`);
  lines.push(`GST included (10%): ${money(o.gstPortion)}`);
  lines.push('');

  lines.push(`💳 *Payment:* ${o.paymentLabel}`);
  if (o.payIn4) {
    lines.push(
      `${money(o.payIn4.dueToday)} due today, then 3x ${money(o.payIn4.instalment)} fortnightly`,
    );
  }
  lines.push('');

  lines.push(`👤 *Customer:* ${customer.name} (${customer.phone})`);
  lines.push(`✉️ ${customer.email}`);
  lines.push(`📍 ${formatAddress(customer)}`);
  lines.push('');
  lines.push('Please confirm stock allocation and dispatch timeline. Cheers!');

  return waLink(lines);
}

/**
 * Build the wa.me link the admin uses to send an order's payment details
 * straight into the customer's own WhatsApp chat — same content as the
 * payment-details email (the Instructions text + lib/order.ts's
 * paymentTermsLines), reformatted for a chat message: WhatsApp's own
 * bold/divider markup instead of HTML, since WhatsApp can't render HTML in
 * either the consumer app or the Business API. Opens directly in the
 * customer's chat (via waLinkTo) with the message pre-filled — the admin
 * just presses send, or copies the same text as a fallback if the redirect
 * doesn't land (see components/admin — WhatsAppSendPanel builds that copy
 * text from the same pieces).
 */
export function waPaymentDetailsMessage(opts: {
  orderNumber: string;
  amountDue: string;
  instructions: string;
  termsLines: string[];
}): string[] {
  return [
    `💳 *Payment Details — Order ${opts.orderNumber}*`,
    `Amount due: *${opts.amountDue}*`,
    DIVIDER,
    opts.instructions,
    DIVIDER,
    ...opts.termsLines.map((l) => `✅ ${l}`),
  ];
}

export function waPaymentDetailsLink(
  phone: string,
  opts: { orderNumber: string; amountDue: string; instructions: string; termsLines: string[] },
): string {
  return waLinkTo(phone, waPaymentDetailsMessage(opts));
}
