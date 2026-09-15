import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { getEnquiry, markEnquiryReplied } from '@/lib/enquiryStore';

/**
 * Sends a human-composed reply to a contact-form or wholesale enquiry
 * straight from the admin dashboard, instead of the business having to
 * reply from their own inbox. Gated on ADMIN_PASSCODE like the other admin
 * routes — nothing sends without it.
 */
export async function POST(request: NextRequest) {
  const authError = checkAdminPasscode(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { id, message } = body;

    if (!id || !message) {
      return NextResponse.json({ success: false, message: 'Missing enquiry id or reply message.' }, { status: 400 });
    }

    const enquiry = await getEnquiry(id);
    if (!enquiry) {
      return NextResponse.json({ success: false, message: 'Enquiry not found.' }, { status: 404 });
    }

    const subjectTopic =
      enquiry.type === 'wholesale' ? enquiry.meta['Business & ABN'] || enquiry.name : enquiry.meta['Interest'] || 'Your Inquiry';

    const html = buildEmailHtml({
      heading: `Re: ${subjectTopic}`,
      intro: `Hi ${enquiry.name},`,
      rows: [
        { label: 'Reply', value: message },
        { label: 'Your Original Message', value: enquiry.message || '' },
      ],
      replyTo: CONTACT.email,
      ctaLabel: 'Reply to This Email →',
      ctaHref: `mailto:${CONTACT.email}`,
    });

    const text = `Hi ${enquiry.name},\n\n${message}\n\n---\nYour original message:\n${enquiry.message || ''}`;

    const result = await sendMail({
      to: enquiry.email,
      subject: `Re: ${subjectTopic}`,
      html,
      text,
      replyTo: CONTACT.email,
    });

    if (!result.sent) {
      return NextResponse.json({ success: false, message: 'Email delivery is not configured yet' }, { status: 503 });
    }

    try {
      await markEnquiryReplied(id);
    } catch (err) {
      console.error('reply-enquiry: markEnquiryReplied failed (email already sent):', err);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin reply-enquiry error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
