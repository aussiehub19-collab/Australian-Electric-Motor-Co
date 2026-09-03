import { NextResponse } from 'next/server';
import { SITE, CONTACT, SHOP } from '@/config/site';

export async function GET() {
  const baseUrl = `https://${SITE.domain}`;
  return NextResponse.json(
    {
      ucp: '1.0',
      protocol_version: '1.0',
      spec: 'https://ucp.dev/specification/overview/',
      schema: 'https://ucp.dev/schema/v1.json',
      site: baseUrl,
      name: SITE.name,
      services: [
        {
          id: 'product-catalog',
          type: 'catalog',
          url: `${baseUrl}/shop/`,
          description: 'Full Australian electric dirt bike catalog',
        },
        {
          id: 'mcp-server',
          type: 'mcp',
          url: `${baseUrl}/api/mcp/`,
          description: 'MCP Streamable HTTP server',
        },
        {
          id: 'order',
          type: 'commerce',
          url: `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}`,
          description: 'Place orders via WhatsApp or human order draft',
        },
        {
          id: 'wholesale',
          type: 'b2b',
          url: `${baseUrl}/wholesale/`,
          description: 'Commercial fleet and dealer bulk pricing',
        },
        {
          id: 'compare',
          type: 'tool',
          url: `${baseUrl}/compare/`,
          description: 'Side-by-side electric dirt bike specification comparison',
        },
        {
          id: 'finance',
          type: 'tool',
          url: `${baseUrl}/finance/`,
          description: 'Outback powersports repayment and loan calculator',
        },
      ],
      capabilities: ['browse', 'search', 'inquiry', 'compare', 'finance', 'wholesale', 'content', 'mcp'],
      currency: SITE.currency,
      minimum_order_usd: String(SHOP.minOrder),
      payment_methods: SHOP.paymentMethods,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  );
}
