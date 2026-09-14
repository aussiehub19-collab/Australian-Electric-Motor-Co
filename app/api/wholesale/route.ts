import { NextRequest, NextResponse } from 'next/server';
import { CONTACT } from '@/config/site';
import { sendMail } from '@/lib/mailer';
import { buildEmailHtml } from '@/lib/emailTemplate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company, name, email, phone, units, notes, botcheck } = body;

    if (botcheck) return NextResponse.json({ success: true });

    if (!company || !name || !email || !phone) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (company, name, email, phone)' },
        { status: 400 },
      );
    }

    const html = buildEmailHtml({
      heading: 'New Wholesale / Fleet Inquiry',
      intro: `${name} at ${company} submitted a commercial application.`,
      rows: [
        { label: 'Business & ABN', value: company },
        { label: 'Contact', value: name },
        { label: 'Email', value: email },
        { label: 'Phone', value: phone },
        { label: 'Est. Units', value: units || '' },
        { label: 'Notes', value: notes || '' },
      ],
      replyTo: email,
    });
    const text = `New wholesale / fleet inquiry\nBusiness: ${company}\nContact: ${name}\nEmail: ${email}\nPhone: ${phone}\nEst. units: ${units || '-'}\n\n${notes || ''}`;

    const result = await sendMail({
      to: CONTACT.email,
      subject: `Wholesale Inquiry: ${company}`,
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
    console.error('Wholesale API error:', error);
    return NextResponse.json({ success: false, message: 'Something went wrong' }, { status: 500 });
  }
}
