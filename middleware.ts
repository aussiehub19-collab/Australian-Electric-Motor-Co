import { NextRequest, NextResponse } from 'next/server';
import { SITE, BRAND, CATEGORIES, PRODUCTS, POSTS, FAQ, CONTACT, SHOP } from '@/config/site';

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/|fonts/).*)'],
};

function prefersMarkdownOverHtml(accept: string): boolean {
  let mdQ = -1;
  let htmlQ = -1;

  for (const part of accept.split(',')) {
    const [type, ...params] = part.trim().split(';').map((s) => s.trim());
    let q = 1;
    for (const p of params) {
      const m = /^q=([\d.]+)$/.exec(p);
      if (m) q = parseFloat(m[1]);
    }
    if (type === 'text/markdown') mdQ = Math.max(mdQ, q);
    if (type === 'text/html') htmlQ = Math.max(htmlQ, q);
  }

  return mdQ > -1 && mdQ > htmlQ;
}

export default async function middleware(request: NextRequest) {
  const accept = request.headers.get('accept') || '';
  const pathname = request.nextUrl.pathname;

  // Check if caller explicitly prefers markdown over HTML (q-value aware)
  if (prefersMarkdownOverHtml(accept) && !pathname.startsWith('/api/')) {
    const baseUrl = `https://${SITE.domain}`;

    // Generate markdown on-the-fly based on pathname
    let md = `# ${SITE.name} — Australian Electric Dirt Bikes\n\n> ${SITE.tagline}\n\n`;

    if (pathname === '/' || pathname === '') {
      md += `## Brand Overview\n${BRAND.description}\n\n`;
      md += `## E-Dirt Bike Models\n`;
      PRODUCTS.forEach((p) => {
        md += `- [${p.name}](${baseUrl}/shop/${p.category}/${p.slug}/): $${p.price} ${SITE.currency} — ${p.shortDescription}\n`;
      });
      md += `\n## Categories\n`;
      CATEGORIES.forEach((c) => {
        md += `- [${c.name}](${baseUrl}/shop/${c.slug}/): ${c.description}\n`;
      });
      md += `\n## Contact & HQ\n- Location: ${CONTACT.hq}\n- Phone: ${CONTACT.phone}\n- WhatsApp: ${CONTACT.whatsapp}\n- Minimum Order: $${SHOP.minOrder} ${SITE.currency}\n`;
    } else if (pathname.startsWith('/shop/')) {
      md += `## Product Inventory\n\n`;
      PRODUCTS.forEach((p) => {
        md += `### ${p.name} ($${p.price} ${SITE.currency})\n`;
        md += `- Category: ${p.category}\n`;
        md += `- Description: ${p.shortDescription}\n`;
        md += `- Full Specs: ${baseUrl}/shop/${p.category}/${p.slug}/\n\n`;
      });
    } else if (pathname.startsWith('/faq/')) {
      md += `## Frequently Asked Questions\n\n`;
      FAQ.forEach((f) => {
        md += `### ${f.question}\n${f.answer}\n\n`;
      });
    } else if (pathname.startsWith('/blog/')) {
      md += `## Trail Tech & Outback Articles\n\n`;
      POSTS.forEach((post) => {
        md += `### [${post.title}](${baseUrl}/blog/${post.slug}/)\n${post.excerpt}\n\n`;
      });
    } else {
      md += `## ${SITE.name} Public Resource\n\nPath: ${pathname}\nWebsite: ${baseUrl}\n\nVisit [${baseUrl}](${baseUrl}) for full interactive access.\n`;
    }

    return new NextResponse(md, {
      status: 200,
      headers: {
        'content-type': 'text/markdown; charset=utf-8',
        'access-control-allow-origin': '*',
      },
    });
  }

  return NextResponse.next();
}
