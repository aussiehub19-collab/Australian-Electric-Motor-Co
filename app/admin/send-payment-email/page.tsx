'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SHOP, CONTACT } from '@/src/config/site';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { paymentTermsHtml } from '@/lib/order';
import { waPaymentConfirmationLink } from '@/lib/whatsapp';
import { useAdminPasscode } from '@/lib/useAdminPasscode';
import { PasscodeGate } from '@/components/admin/PasscodeGate';
import { PaymentTermsList } from '@/components/PaymentTermsList';
import type { StoredOrder } from '@/lib/orderStore';

type PaymentMethod = 'Direct Bank EFT' | 'PayID' | 'Bitcoin (BTC) / Tether (USDT)' | 'Pay in 4 (fortnightly instalments)';

const PAYMENT_METHODS: PaymentMethod[] = [
  'Direct Bank EFT',
  'PayID',
  'Bitcoin (BTC) / Tether (USDT)',
  'Pay in 4 (fortnightly instalments)',
];

const METHOD_CODE_MAP: Record<string, PaymentMethod> = {
  bank: 'Direct Bank EFT',
  payid: 'PayID',
  crypto: 'Bitcoin (BTC) / Tether (USDT)',
  payin4: 'Pay in 4 (fortnightly instalments)',
};

/**
 * Instructions split into three pieces — an opening line, the payment
 * detail block, and a closing line — instead of one fixed paragraph. Paste
 * mode below only replaces the middle piece, so pasting a wallet address or
 * an updated BSB/account still comes out wrapped in the usual "Please
 * transfer... to:" / "We'll dispatch..." framing rather than replacing it.
 */
function instructionsParts(
  method: PaymentMethod,
  amountDue: string,
  orderNumber: string,
): { opening: string; detail: string; closing: string } {
  switch (method) {
    case 'Direct Bank EFT':
      return {
        opening: `Please transfer ${amountDue || '[amount]'} via Osko/PayID-enabled bank transfer where possible — it clears instantly — to:`,
        detail: `${SHOP.bankDetails.bankName}\nAccount Name: ${SHOP.bankDetails.accountName}\nBSB: ${SHOP.bankDetails.bsb}\nAccount: ${SHOP.bankDetails.accountNumber}\nReference: ${orderNumber || '[order number]'}`,
        closing: `We'll dispatch once the transfer clears.`,
      };
    case 'PayID':
      return {
        opening: `Please pay ${amountDue || '[amount]'} via PayID (an Osko instant transfer) to:`,
        detail: `${SHOP.payId}\nReference: ${orderNumber || '[order number]'}`,
        closing: `PayID/Osko transfers are usually instant — we'll dispatch as soon as it lands.`,
      };
    case 'Bitcoin (BTC) / Tether (USDT)':
      return {
        opening: `Please send the exact amount for ${amountDue || '[amount]'} to the wallet address below:`,
        detail: `[wallet address + exact BTC/USDT amount]`,
        closing: `We'll dispatch as soon as it's received — reply here if you'd prefer these details sent via WhatsApp instead.`,
      };
    case 'Pay in 4 (fortnightly instalments)':
      return {
        opening: `First instalment of ${amountDue || '[amount]'} is due now.`,
        detail: '',
        closing: `Reply to this email or contact us and we'll send a secure payment link. The remaining 3 fortnightly instalments follow automatically at 0% interest.`,
      };
    default:
      return { opening: '', detail: '', closing: '' };
  }
}

/** Opening, detail and closing each get a blank line between them — reads
 * as three clean paragraphs rather than the detail block running straight
 * on from "to:". */
function assembleInstructions(opening: string, detail: string, closing: string): string {
  return [opening, detail, closing].filter(Boolean).join('\n\n');
}

function defaultInstructions(method: PaymentMethod, amountDue: string, orderNumber: string): string {
  const { opening, detail, closing } = instructionsParts(method, amountDue, orderNumber);
  return assembleInstructions(opening, detail, closing);
}

export default function SendPaymentEmailPage() {
  const { unlocked, passcode, unlock, lock } = useAdminPasscode();

  const [orderNumber, setOrderNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Direct Bank EFT');
  const [instructions, setInstructions] = useState(() => defaultInstructions('Direct Bank EFT', '', ''));
  const [instructionsTouched, setInstructionsTouched] = useState(false);
  // 'template' auto-fills Instructions from the payment method (editable, but
  // regenerates on method change unless touched); 'paste' lets the admin
  // paste just the payment detail (a wallet address, an updated BSB/account)
  // — the usual opening/closing sentences still wrap around it automatically.
  const [instructionsMode, setInstructionsMode] = useState<'template' | 'paste'>('template');
  const [pastedDetail, setPastedDetail] = useState('');
  const [notes, setNotes] = useState('');

  const [loadingOrder, setLoadingOrder] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');

  // Pre-fill from an order in the dashboard — the "Send Payment Details" link
  // in the order email, or a click from /admin/orders/, both use ?id=.
  useEffect(() => {
    if (!unlocked || !passcode) return;
    const id = new URLSearchParams(window.location.search).get('id');
    if (!id) return;

    let cancelled = false;
    setLoadingOrder(true);
    setLoadError('');
    fetch(`/api/admin/orders/${encodeURIComponent(id)}/`, { headers: { 'X-Admin-Passcode': passcode } })
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (res.ok && data.success) {
          const order = data.order as StoredOrder;
          setOrderNumber(order.orderNumber);
          setCustomerName(order.customerName);
          setCustomerEmail(order.customerEmail);
          setAmountDue(order.amountDue);
          if (METHOD_CODE_MAP[order.paymentMethodCode]) setPaymentMethod(METHOD_CODE_MAP[order.paymentMethodCode]);
        } else {
          if (res.status === 401) lock();
          setLoadError(data?.message || 'Could not load that order.');
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError('Could not load that order.');
      })
      .finally(() => {
        if (!cancelled) setLoadingOrder(false);
      });

    return () => {
      cancelled = true;
    };
  }, [unlocked, passcode, lock]);

  // Keep the instructions template in sync with the method/amount/order —
  // unless the user has actually edited it, so we never clobber manual edits.
  useEffect(() => {
    if (instructionsMode === 'template' && !instructionsTouched) {
      setInstructions(defaultInstructions(paymentMethod, amountDue, orderNumber));
    }
  }, [paymentMethod, amountDue, orderNumber, instructionsTouched, instructionsMode]);

  // In Paste mode, re-wrap whatever's pasted with the current opening/closing
  // sentences whenever the method, amount, order number or the paste itself
  // changes — so switching payment method mid-paste doesn't leave stale wording.
  useEffect(() => {
    if (instructionsMode === 'paste') {
      const { opening, closing } = instructionsParts(paymentMethod, amountDue, orderNumber);
      setInstructions(assembleInstructions(opening, pastedDetail, closing));
    }
  }, [instructionsMode, paymentMethod, amountDue, orderNumber, pastedDetail]);

  const switchToTemplate = () => {
    setInstructionsMode('template');
    setInstructionsTouched(false);
  };

  const switchToPaste = () => {
    setInstructionsMode('paste');
    setPastedDetail('');
  };

  const { opening: instructionsOpeningPreview, closing: instructionsClosingPreview } = instructionsParts(
    paymentMethod,
    amountDue,
    orderNumber,
  );

  const showOsko = paymentMethod === 'Direct Bank EFT' || paymentMethod === 'PayID';
  const whatsappLink = useMemo(() => waPaymentConfirmationLink(orderNumber || 'your order'), [orderNumber]);

  const paymentTermsHtmlValue = useMemo(
    () =>
      paymentTermsHtml({
        orderNumber,
        contactEmail: CONTACT.email,
        whatsapp: CONTACT.whatsapp,
        whatsappLink,
        showOskoNote: showOsko,
      }),
    [orderNumber, whatsappLink, showOsko],
  );

  const previewHtml = useMemo(
    () =>
      buildEmailHtml({
        heading: `Payment Details — ${orderNumber || '[order number]'}`,
        intro: `Hi ${customerName || '[customer name]'}, thanks for your patience — here are the payment details to finalise Order ${orderNumber || '[order number]'}. Once payment is received we'll confirm your order and get it ready for dispatch.`,
        rows: [
          { label: 'Order #', value: orderNumber, mono: true },
          { label: 'Amount Due', value: amountDue, mono: true },
          { label: 'Payment Method', value: paymentMethod },
          { label: 'Instructions', value: instructions, mono: true },
          { label: 'Payment Terms', html: paymentTermsHtmlValue },
          { label: 'Notes', value: notes },
        ],
        replyTo: CONTACT.email,
        ctaLabel: 'Questions? Contact Us →',
        ctaHref: `mailto:${CONTACT.email}`,
      }),
    [orderNumber, customerName, amountDue, paymentMethod, instructions, paymentTermsHtmlValue, notes],
  );

  const formValid = orderNumber && customerName && customerEmail && amountDue && instructions;

  const handleSend = async () => {
    if (!formValid) {
      setError('Fill in order #, customer name, email, amount and instructions first.');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/admin/send-payment-email/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Passcode': passcode },
        body: JSON.stringify({ orderNumber, customerName, customerEmail, amountDue, paymentMethod, instructions, notes }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus('sent');
      } else {
        if (res.status === 401) lock();
        throw new Error(data?.message || 'Send failed');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong sending the email.');
      setStatus('idle');
    }
  };

  const resetForm = () => {
    setOrderNumber('');
    setCustomerName('');
    setCustomerEmail('');
    setAmountDue('');
    setPaymentMethod('Direct Bank EFT');
    setInstructions(defaultInstructions('Direct Bank EFT', '', ''));
    setInstructionsTouched(false);
    setInstructionsMode('template');
    setPastedDetail('');
    setNotes('');
    setStatus('idle');
    setError('');
  };

  const inputClass =
    'w-full bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3 text-sm text-stone-100 placeholder-stone-600 focus:ring-1 focus:ring-amber-500 focus:border-amber-500';
  const labelClass = 'block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5 font-mono';

  if (!unlocked) {
    return <PasscodeGate title="Send Payment Details" onUnlock={unlock} />;
  }

  if (status === 'sent') {
    return (
      <div className="max-w-sm mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl">✓</div>
        <h1 className="text-lg font-bold text-white">Sent to {customerEmail}</h1>
        <p className="text-xs text-stone-400">Payment details for Order {orderNumber} are on their way.</p>
        <div className="flex flex-col gap-2 pt-2">
          <button type="button" onClick={resetForm} className="bg-[#8C4A2F] hover:bg-[#A35839] text-white font-bold py-3 px-6 rounded-xl text-sm transition">
            Send Another
          </button>
          <Link href="/admin/orders/" className="text-xs font-mono text-stone-400 hover:text-white">
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6">
      <Link href="/admin/orders/" className="text-xs font-mono text-stone-400 hover:text-white inline-block">
        ← All Orders
      </Link>
      <h1 className="text-2xl font-black uppercase text-white tracking-tight">Send Payment Details</h1>
      <p className="text-xs text-stone-400">
        {loadingOrder ? 'Loading order…' : 'Fill this in from the order you received, review the preview below, then send.'}
      </p>
      {loadError && <p className="text-xs text-rose-400 font-semibold">{loadError}</p>}

      <div className="bg-[#17191C] border border-[#2B2F36] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Order # *</label>
            <input value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="AEMC-XXXXXX" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Amount Due *</label>
            <input value={amountDue} onChange={(e) => setAmountDue(e.target.value)} placeholder="$6,921 AUD" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Customer Name *</label>
          <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Jack Rider" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Customer Email *</label>
          <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="jack@example.com.au" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value as PaymentMethod);
              setInstructionsTouched(false);
            }}
            className={inputClass}
          >
            {PAYMENT_METHODS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelClass} mb-0`}>Instructions *</label>
            <div className="flex bg-[#1D2024] border border-[#2B2F36] rounded-lg p-0.5 text-[10px] font-mono font-bold uppercase">
              <button
                type="button"
                onClick={switchToTemplate}
                className={`px-2.5 py-1 rounded-md transition ${
                  instructionsMode === 'template' ? 'bg-[#8C4A2F] text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Template
              </button>
              <button
                type="button"
                onClick={switchToPaste}
                className={`px-2.5 py-1 rounded-md transition ${
                  instructionsMode === 'paste' ? 'bg-[#8C4A2F] text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Paste
              </button>
            </div>
          </div>
          {instructionsMode === 'paste' && (
            <p className="text-xs text-stone-500 italic font-mono mb-1.5 leading-relaxed">{instructionsOpeningPreview}</p>
          )}
          <textarea
            value={instructionsMode === 'paste' ? pastedDetail : instructions}
            onChange={(e) => {
              if (instructionsMode === 'paste') {
                setPastedDetail(e.target.value);
              } else {
                setInstructions(e.target.value);
                setInstructionsTouched(true);
              }
            }}
            rows={instructionsMode === 'paste' ? 6 : 5}
            placeholder={instructionsMode === 'paste' ? 'Paste just the payment detail — wallet address + exact amount, updated BSB/account, PayID handle, etc.' : undefined}
            className={`${inputClass} font-mono text-xs`}
          />
          {instructionsMode === 'paste' && (
            <p className="text-xs text-stone-500 italic font-mono mt-1.5 leading-relaxed">{instructionsClosingPreview}</p>
          )}
          <p className="text-[10px] text-stone-500 mt-1.5">
            {instructionsMode === 'template'
              ? "Auto-filled from the payment method — edit freely, it won't reset unless you change the method."
              : "Paste mode — only the payment detail above is yours to fill in. The opening and closing lines shown in grey wrap around it automatically and stay in sync with the payment method and amount."}
          </p>
        </div>
        <div className="bg-[#1D2024] border border-[#2B2F36] rounded-xl px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-stone-300 uppercase tracking-wider font-mono">Payment Terms</span>
            <span className="text-[10px] text-stone-500 font-mono">always included</span>
          </div>
          <PaymentTermsList orderNumber={orderNumber || '[order number]'} whatsappLink={whatsappLink} showOsko={showOsko} />
        </div>
        <div>
          <label className={labelClass}>Notes (optional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="e.g. estimated dispatch date" className={inputClass} />
        </div>
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono mb-2">Preview</h2>
        <div className="border border-[#2B2F36] rounded-2xl overflow-hidden bg-white">
          <iframe title="Email preview" srcDoc={previewHtml} className="w-full" style={{ height: 560, border: 0 }} />
        </div>
      </div>

      {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

      <button
        type="button"
        onClick={handleSend}
        disabled={status === 'sending' || !formValid}
        className={`w-full py-4 rounded-xl text-sm font-bold transition ${
          formValid ? 'bg-[#8C4A2F] hover:bg-[#A35839] text-white' : 'bg-[#8C4A2F]/40 text-white/60 cursor-not-allowed'
        }`}
      >
        {status === 'sending' ? 'Sending…' : `Send to ${customerEmail || 'customer'}`}
      </button>
    </div>
  );
}
