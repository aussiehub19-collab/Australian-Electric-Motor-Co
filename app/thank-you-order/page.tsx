import React from 'react';
import Link from 'next/link';
import { CONTACT } from '@/config/site';
import OrderReferenceCopy from '@/components/OrderReferenceCopy';

export const metadata = {
  title: 'Order Received | Australian Electric Motor Co',
  description: 'Thank you for placing your order draft with Australian Electric Motor Co.',
  robots: {
    index: false,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
  },
};

export default async function ThankYouOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-16 h-16 bg-amber-500/20 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto text-amber-400 text-2xl font-bold">
        🏍️
      </div>
      <span className="text-xs font-mono uppercase tracking-widest text-[#C87D55] font-bold">
        Order Request Received
      </span>
      <h1 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
        Thank You For Your Order
      </h1>
      {ref && <OrderReferenceCopy orderNumber={ref} />}
      <p className="text-sm text-stone-300 leading-relaxed">
        We have received your order details. In accordance with Australian electric motorbike delivery standards and crate logistics, our sales coordinator will contact you directly to confirm delivery depot details and invoice payment.
        {ref && ' Quote your order reference above in any follow-up.'}
      </p>
      <div className="bg-[#17191C] border border-[#2B2F36] rounded-xl px-5 py-4 text-left space-y-2">
        <p className="text-xs font-mono uppercase tracking-wider text-[#C87D55] font-bold">Next steps</p>
        <ul className="text-sm text-stone-300 leading-relaxed list-disc list-inside space-y-1.5">
          <li>Complete payment within <strong className="text-white">48 hours</strong> to confirm your order.</li>
          <li>
            Use your order number{ref ? <> — <span className="font-mono text-amber-400">{ref}</span> —</> : ''} as the payment
            reference/description.
          </li>
          <li>
            Once paid, send a screenshot of the completed payment to{' '}
            <a href={`mailto:${CONTACT.email}`} className="text-amber-400 hover:underline">
              {CONTACT.email}
            </a>{' '}
            or WhatsApp{' '}
            <a
              href={`https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`}
              className="text-amber-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {CONTACT.whatsapp}
            </a>{' '}
            for confirmation.
          </li>
        </ul>
      </div>
      <div className="pt-4 flex justify-center gap-4">
        <Link
          href="/shop/"
          className="bg-[#8C4A2F] hover:bg-[#A35839] text-white text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Continue Shopping &rarr;
        </Link>
        <Link
          href="/"
          className="bg-[#17191C] border border-[#2B2F36] hover:bg-[#25282E] text-stone-300 text-xs font-bold py-3 px-6 rounded-xl transition"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
