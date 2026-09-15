import React from 'react';
import { CONTACT } from '@/config/site';

/**
 * The same payment terms as lib/order.ts#paymentTermsHtml (48-hour deadline,
 * order number as reference, Osko/PayID note, screenshot confirmation) —
 * rendered as JSX instead of a raw HTML string, so it renders identically
 * wherever a customer sees these terms directly on the site (the
 * order-confirmation page) and in the admin's own preview of the email.
 * No 'use client' here: it's pure presentational JSX (an <a> per link, no
 * state), so it renders fine inside both a Server Component tree and a
 * Client Component tree.
 */
export function PaymentTermsList({
  orderNumber,
  whatsappLink,
  showOsko,
}: {
  orderNumber: string;
  whatsappLink: string;
  showOsko?: boolean;
}) {
  return (
    <ul className="text-sm text-stone-300 leading-relaxed list-disc list-inside space-y-1.5">
      <li>
        Complete payment within <strong className="text-white">48 hours</strong> to confirm your order.
      </li>
      <li>
        Use your order number — <span className="font-mono text-amber-400">{orderNumber}</span> — as the payment
        reference/description.
      </li>
      {showOsko && (
        <li>
          <strong className="text-amber-300">Use Osko / PayID transfer</strong> where possible — it clears instantly, so your
          order gets confirmed fastest.
        </li>
      )}
      <li>
        Once paid, send a screenshot of the completed payment to{' '}
        <a href={`mailto:${CONTACT.email}`} className="text-amber-400 hover:underline">
          {CONTACT.email}
        </a>{' '}
        or WhatsApp{' '}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline">
          {CONTACT.whatsapp}
        </a>{' '}
        for confirmation.
      </li>
    </ul>
  );
}
