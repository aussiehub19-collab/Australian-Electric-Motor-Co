import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';

/**
 * Sends the "payment details" follow-up email a human picks the moment
 * they've reviewed an order and decided how the customer should pay —
 * there's no order database (see CLAUDE.md), so this is a compose-and-send
 * tool, not automation. Gated on ADMIN_PASSCODE (server-only env var); the
 * page itself shows the form to anyone who finds the URL, but nothing
 * sends without the correct passcode.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { passcode, orderNumber, customerName, customerEmail, amountDue, paymentMethod, instructions, notes } = body;

    const expected = process.env.ADMIN_PASSCODE;
    if (!expected) {
      return NextResponse.json(
        { success: false, message: 'ADMIN_PASSCODE is not configured in Vercel env vars yet.' },
        { status: 503 },
      );
    }
    if (!passcode || passcode !== expected) {
      return NextResponse.json({ success: false, message: 'Incorrect passcode.' }, { status: 401 });
    }

    if (!customerName || !customerEmail || !orderNumber || !amountDue || !paymentMethod || !instructions) {
      return NextResponse.json({ success: false, message: 'Missing required fields.' }, { status: 400 });
    }

    const rows = [
      { label: 'Order #', value: orderNumber },
      { label: 'Amount Due', value: amountDue },
      { label: 'Payment Method', value: paymentMethod },
      { label: 'Instructions', value: instructions },
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

    const text = `Payment Details — ${orderNumber}\n\nHi ${customerName}, here are the payment details to finalise your order.\n\nOrder #: ${orderNumber}\nAmount Due: ${amountDue}\nPayment Method: ${paymentMethod}\n\nInstructions:\n${instructions}\n${notes ? `\nNotes: ${notes}\n` : ''}\nOnce payment is received we'll confirm your order and get it ready for dispatch.`;

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
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin send-payment-email error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
