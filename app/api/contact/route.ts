import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { saveEnquiry, generateEnquiryId, enquiryReplyLink } from '@/lib/enquiryStore';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, interest, message, botcheck } = body;

    // Honeypot — bots fill every field, humans never see this one.
    if (botcheck) return NextResponse.json({ success: true });

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, email, message)' },
        { status: 400 },
      );
    }

    // Best-effort: record the enquiry so /admin/enquiries can list and reply
    // to it, regardless of whether email delivery succeeds below.
    const enquiryId = generateEnquiryId();
    try {
      await saveEnquiry({
        id: enquiryId,
        type: 'contact',
        name,
        email,
        phone: phone || '',
        message,
        meta: { Interest: interest || 'General Inquiry' },
        createdAt: Date.now(),
        status: 'new',
      });
    } catch (err) {
      console.error('Contact API: saveEnquiry failed (email still sent):', err);
    }

    const html = buildEmailHtml({
      heading: 'New Technical Inquiry',
      intro: `${name} sent a message through the contact form.`,
      rows: [
        { label: 'Name', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone || '' },
        { label: 'Interest', value: interest || 'General Inquiry' },
        { label: 'Message', value: message },
      ],
      replyTo: email,
      ctaLabel: 'Reply in Dashboard →',
      ctaHref: enquiryReplyLink(enquiryId),
    });
    const text = `New technical inquiry\nName: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nInterest: ${interest || 'General Inquiry'}\n\n${message}\n\nReply in dashboard: ${enquiryReplyLink(enquiryId)}`;

    const result = await sendMail({
      to: CONTACT.email,
      subject: `New Inquiry: ${interest || 'General'} — ${name}`,
      html,
      text,
      replyTo: email,
    });

    if (!result.sent) {
      return NextResponse.json(
        { success: false, message: 'Email delivery is not configured yet' },
        { status: 503 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
