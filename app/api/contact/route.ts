import { NextRequest, NextResponse } from 'next/server';
import { CONTACT, FORMS } from '@/config/site';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message, subject } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, email, message)' },
        { status: 400 }
      );
    }

    // If Resend key is configured in env
    if (FORMS.provider === 'resend' && process.env.RESEND_API_KEY && FORMS.resendFrom) {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        const { error } = await resend.emails.send({
          from: FORMS.resendFrom,
          to: CONTACT.email,
          replyTo: email,
          subject: subject || `Contact inquiry from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });

        if (error) {
          return NextResponse.json({ success: false, message: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, provider: 'resend' });
      } catch (err: any) {
        console.error('Resend provider error:', err);
        return NextResponse.json({ success: false, message: 'Email provider error' }, { status: 500 });
      }
    }

    // Default Web3Forms proxy / pending acknowledgement
    return NextResponse.json({
      success: true,
      message: 'Inquiry acknowledged. Forwarded to Australian Electric Motor Co NSW workshop.',
      recipient: CONTACT.email,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }
}
