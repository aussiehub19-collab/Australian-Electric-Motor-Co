import nodemailer from 'nodemailer';
import { SITE } from '@/config/site';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

/**
 * Zoho Mail SMTP transport. Set ZOHO_SMTP_USER + ZOHO_SMTP_PASSWORD (a Zoho
 * app-specific password, not the account login password) in Vercel env vars.
 * ZOHO_SMTP_HOST is an optional override — most accounts use smtp.zoho.com,
 * but a mailbox provisioned in a regional data centre may need smtp.zoho.eu /
 * smtp.zoho.in / smtp.zoho.com.au instead (check Zoho Mail → Settings →
 * Mail Accounts → POP/IMAP for the exact host).
 */
function getTransporter() {
  const user = process.env.ZOHO_SMTP_USER;
  const pass = process.env.ZOHO_SMTP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST || 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}): Promise<{ sent: true } | { sent: false; reason: 'not-configured' }> {
  const t = getTransporter();
  if (!t) return { sent: false, reason: 'not-configured' };

  await t.sendMail({
    from: `"${SITE.name}" <${process.env.ZOHO_SMTP_USER}>`,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
  });
  return { sent: true };
}
