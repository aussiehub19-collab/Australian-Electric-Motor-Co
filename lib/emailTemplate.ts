import { SITE, CONTACT } from '@/config/site';

interface EmailRow {
  label: string;
  value: string;
}

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

/**
 * Branded transactional email — table-based layout with inline styles only
 * (required for Outlook/Gmail rendering; no external CSS, no flexbox/grid).
 * Dark header band + terracotta accent mirror the site's own palette; the
 * body stays on a light card so the message is readable in every client.
 */
export function buildEmailHtml(opts: {
  heading: string;
  intro?: string;
  rows: EmailRow[];
  replyTo?: string;
  /** Overrides the CTA button text — defaults to "Reply directly →" when replyTo is set. */
  ctaLabel?: string;
  /** Overrides the CTA button link — defaults to mailto:{replyTo}. */
  ctaHref?: string;
}): string {
  const rowsHtml = opts.rows
    .filter((r) => r.value)
    .map(
      (r) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #E5E1DB;font-family:'Courier New',Courier,monospace;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:#8C4A2F;vertical-align:top;width:150px;">${escapeHtml(r.label)}</td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #E5E1DB;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.55;color:#17191C;">${escapeHtml(r.value).replace(/\n/g, '<br>')}</td>
      </tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(opts.heading)}</title>
</head>
<body style="margin:0;padding:0;background:#F4F1EA;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F1EA;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#17191C;padding:28px 32px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#C87D55;">${escapeHtml(SITE.name)}</div>
              <div style="font-family:'Courier New',Courier,monospace;font-size:11px;color:#9A9DA3;margin-top:6px;">${escapeHtml(SITE.domain)}</div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h1 style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:800;color:#17191C;">${escapeHtml(opts.heading)}</h1>
              ${opts.intro ? `<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:#4B4F56;">${escapeHtml(opts.intro)}</p>` : ''}
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
              ${
                opts.ctaHref || opts.replyTo
                  ? `<a href="${escapeHtml(opts.ctaHref || `mailto:${opts.replyTo}`)}" style="display:inline-block;margin-top:24px;background:#8C4A2F;color:#FFFFFF;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;padding:14px 26px;border-radius:10px;">${escapeHtml(opts.ctaLabel || 'Reply directly →')}</a>`
                  : ''
              }
            </td>
          </tr>
          <tr>
            <td style="background:#F7F5F1;padding:20px 32px;border-top:1px solid #EDE9E1;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#9A9DA3;">${escapeHtml(SITE.name)} Pty Ltd &middot; ABN ${escapeHtml(CONTACT.abn)}<br>${escapeHtml(CONTACT.address)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
