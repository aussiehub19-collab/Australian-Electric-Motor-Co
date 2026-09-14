import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { money, formatAddress, isCustomerComplete, type OrderSummary } from '@/lib/order';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { order, botcheck } = body as { order: OrderSummary; botcheck?: unknown };
    const customer = body.customer || {};

    if (botcheck) return NextResponse.json({ success: true });

    if (!isCustomerComplete(customer) || !order || !Array.isArray(order.items) || order.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Missing customer details or an empty cart' },
        { status: 400 },
      );
    }

    const itemsText = order.items
      .map((it) => `${it.quantity}x ${it.name} — ${money(it.price * it.quantity)}`)
      .join('\n');

    const orderRows = [
      { label: 'Order #', value: order.orderNumber || '' },
      { label: 'Items', value: itemsText },
      { label: 'Subtotal', value: money(order.subtotal) },
      { label: 'Bundle Discount', value: order.bundleSavings ? `-${money(order.bundleSavings)}` : '' },
      { label: 'Crypto Discount', value: order.cryptoSavings ? `-${money(order.cryptoSavings)}` : '' },
      { label: 'Freight', value: order.shippingIsFree ? 'FREE' : money(order.shippingCost) },
      { label: 'GST Included (10%)', value: money(order.gstPortion) },
      { label: 'Total Payable', value: money(order.grandTotal) },
      { label: 'Payment', value: order.paymentLabel },
      {
        label: 'Pay in 4',
        value: order.payIn4
          ? `${money(order.payIn4.dueToday)} due today, then 3x ${money(order.payIn4.instalment)} fortnightly`
          : '',
      },
    ];

    // --- Email 1: internal notification, to the business ---
    const businessHtml = buildEmailHtml({
      heading: order.orderNumber ? `New Order — ${order.orderNumber}` : 'New Order',
      intro: `${customer.name} placed an order through the website checkout.`,
      rows: [
        ...orderRows,
        { label: 'Customer', value: customer.name },
        { label: 'Phone', value: customer.phone },
        { label: 'Delivery Address', value: formatAddress(customer) },
      ],
      replyTo: customer.email,
    });
    const businessText = `New order ${order.orderNumber || ''}\n\n${itemsText}\n\nSubtotal: ${money(order.subtotal)}\nTotal payable: ${money(order.grandTotal)}\nPayment: ${order.paymentLabel}\n\nCustomer: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone}\nDeliver to: ${formatAddress(customer)}`;

    const businessResult = await sendMail({
      to: CONTACT.email,
      subject: `New Order${order.orderNumber ? ` ${order.orderNumber}` : ''}: ${customer.name} — ${money(order.grandTotal)}`,
      html: businessHtml,
      text: businessText,
      replyTo: customer.email,
    });

    if (!businessResult.sent) {
      return NextResponse.json(
        { success: false, message: 'Email delivery is not configured yet' },
        { status: 503 },
      );
    }

    // --- Email 2: confirmation copy, to the customer — best-effort, never
    // fails the request (the business already has the order either way) ---
    try {
      const customerHtml = buildEmailHtml({
        heading: order.orderNumber ? `Order Confirmed — ${order.orderNumber}` : 'Order Confirmed',
        intro: `Thanks for your order, ${customer.name}! We've received it and our NSW team will confirm stock and dispatch shortly. Keep this email as your order reference.`,
        rows: [
          ...orderRows,
          { label: 'Delivering To', value: formatAddress(customer) },
          { label: 'Need Help?', value: `${CONTACT.phone} · WhatsApp ${CONTACT.whatsapp}\n${CONTACT.email}` },
        ],
        replyTo: CONTACT.email,
        ctaLabel: 'Contact Us →',
        ctaHref: `mailto:${CONTACT.email}`,
      });
      const customerText = `Order Confirmed ${order.orderNumber || ''}\n\nThanks for your order, ${customer.name}!\n\n${itemsText}\n\nSubtotal: ${money(order.subtotal)}\nTotal payable: ${money(order.grandTotal)}\nPayment: ${order.paymentLabel}\nDelivering to: ${formatAddress(customer)}\n\n${CONTACT.email} · ${CONTACT.phone}\n\nAustralian Electric Motor Co Pty Ltd · ABN ${CONTACT.abn}`;

      await sendMail({
        to: customer.email,
        subject: `Order Confirmed${order.orderNumber ? ` ${order.orderNumber}` : ''} — ${money(order.grandTotal)}`,
        html: customerHtml,
        text: customerText,
        replyTo: CONTACT.email,
      });
    } catch (err) {
      console.error('Order API: customer confirmation email failed (business notification already sent):', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Order API error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
