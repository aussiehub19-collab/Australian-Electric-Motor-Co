import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { markOrderSent } from '@/lib/orderStore';
import { paymentTermsText } from '@/lib/order';

/**
 * Sends the "payment details" follow-up email a human picks the moment
 * they've reviewed an order and decided how the customer should pay — this
 * is a compose-and-send tool, not automation. Gated on ADMIN_PASSCODE
 * (X-Admin-Passcode header, checked server-side); the page itself shows the
 * form to anyone who finds the URL, but nothing sends without it.
 */
export async function POST(request: NextRequest) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { orderNumber, customerName, customerEmail, amountDue, paymentMethod, instructions, notes } = body;

    if (!customerName || !customerEmail || !orderNumber || !amountDue || !paymentMethod || !instructions) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const terms = paymentTermsText(orderNumber, CONTACT.email, CONTACT.whatsapp);

    const rows = [
      { label: 'Order #', value: orderNumber, mono: true },
      { label: 'Amount Due', value: amountDue, mono: true },
      { label: 'Payment Method', value: paymentMethod },
      { label: 'Instructions', value: instructions, mono: true },
      { label: 'Payment Terms', value: terms },
      { label: 'Notes', value: notes || '' },
    ];

    const html = buildEmailHtml({
      heading: `Payment Details — ${orderNumber}`,
      intro: `Hi ${customerName}, thanks for your patience — here are the payment details to finalise Order ${orderNumber}. Once payment is received we'll confirm your order and get it ready for dispatch.`,
      rows,
      replyTo: CONTACT.email,
      ctaLabel: 'Questions? Contact Us →',
      ctaHref: `mailto:${CONTACT.email}`,
    });

    const text = `Payment Details — ${orderNumber}\n\nHi ${customerName}, here are the payment details to finalise your order.\n\nOrder #: ${orderNumber}\nAmount Due: ${amountDue}\nPayment Method: ${paymentMethod}\n\nInstructions:\n${instructions}\n\nPayment Terms:\n${terms}\n${notes ? `\nNotes: ${notes}\n` : ''}\nOnce payment is received we'll confirm your order and get it ready for dispatch.`;

    const result = await sendMail({
      to: customerEmail,
      subject: `Payment Details — Order ${orderNumber}`,
      html,
      text,
      replyTo: CONTACT.email,
    });

    if (!result.sent) {
      return NextResponse.json({ success: false, message: 'Email delivery is not configured yet' }, { status: 503 });
    }

    try {
      await markOrderSent(orderNumber);
    } catch (err) {
      console.error('send-payment-email: markOrderSent failed (email already sent):', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin send-payment-email error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
