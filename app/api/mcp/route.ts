import { NextRequest, NextResponse } from 'next/server';
import { SITE, CONTACT, SHOP, CATEGORIES, PRODUCTS } from '@/config/site';

const TOOLS = [
  {
    name: 'search_products',
    description: 'Search products by keyword, category, max_price',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        category: { type: 'string' },
        max_price: { type: 'number' },
      },
    },
  },
  {
    name: 'get_product',
    description: 'Get full product details by slug',
    inputSchema: {
      type: 'object',
      required: ['slug'],
      properties: {
        slug: { type: 'string' },
      },
    },
  },
  {
    name: 'list_categories',
    description: 'List all product categories',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'get_policies',
    description: 'Get shipping, payment, returns policies',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'create_order_draft',
    description: 'Create prefilled order URL. Human completes — never captures payment.',
    inputSchema: {
      type: 'object',
      properties: {
        items: { type: 'array' },
        notes: { type: 'string' },
      },
    },
  },
];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Mcp-Session-Id',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET() {
  return NextResponse.json(
    {
      name: `${SITE.name} MCP Streamable HTTP Server`,
      version: '1.0.0',
      transport: 'streamable-http',
      endpoint: `https://${SITE.domain}/api/mcp/`,
      tools: TOOLS,
    },
    { headers: corsHeaders }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { jsonrpc, id, method, params } = body;

    if (jsonrpc !== '2.0') {
      return NextResponse.json(
        { jsonrpc: '2.0', id: id || null, error: { code: -32600, message: 'Invalid Request: jsonrpc must be "2.0"' } },
        { status: 400, headers: corsHeaders }
      );
    }

    if (method === 'initialize') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            protocolVersion: '2025-03-26',
            serverInfo: {
              name: SITE.name,
              version: '1.0.0',
            },
            capabilities: {
              tools: {},
            },
          },
        },
        { headers: corsHeaders }
      );
    }

    if (method === 'tools/list') {
      return NextResponse.json(
        {
          jsonrpc: '2.0',
          id,
          result: {
            tools: TOOLS,
          },
        },
        { headers: corsHeaders }
      );
    }

    if (method === 'tools/call') {
      const toolName = params?.name;
      const args = params?.arguments || {};

      if (toolName === 'search_products') {
        const q = (args.query || '').toLowerCase();
        const cat = (args.category || '').toLowerCase();
        const maxPrice = args.max_price ? Number(args.max_price) : Infinity;

        const results = PRODUCTS.filter((p) => {
          const matchQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
          const matchCat = !cat || p.category.toLowerCase() === cat;
          const matchPrice = p.price <= maxPrice;
          return matchQ && matchCat && matchPrice;
        }).map((p) => ({
          slug: p.slug,
          name: p.name,
          price: p.price,
          currency: SITE.currency,
          category: p.category,
          shortDescription: p.shortDescription,
          url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
        }));

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ count: results.length, products: results }, null, 2),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === 'get_product') {
        const product = PRODUCTS.find((p) => p.slug === args.slug);
        if (!product) {
          return NextResponse.json(
            {
              jsonrpc: '2.0',
              id,
              error: { code: -32602, message: `Product not found: ${args.slug}` },
            },
            { status: 404, headers: corsHeaders }
          );
        }

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      ...product,
                      currency: SITE.currency,
                      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
                      inStock: true,
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === 'list_categories') {
        const cats = CATEGORIES.map((c) => ({
          ...c,
          productCount: PRODUCTS.filter((p) => p.category === c.slug).length,
          url: `https://${SITE.domain}/shop/${c.slug}/`,
        }));

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(cats, null, 2),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === 'get_policies') {
        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      minimumOrder: SHOP.minOrder,
                      freeShippingThreshold: SHOP.freeShippingThreshold,
                      shippingFee: SHOP.shippingFee,
                      cryptoDiscount: SHOP.cryptoDiscount,
                      paymentMethods: SHOP.paymentMethods,
                      ordering: 'human-assisted-whatsapp-or-form',
                      currency: SITE.currency,
                      dispatch: 'Queensland Workshop Crate Freight',
                      warranty: '2-Year Comprehensive Australian Warranty',
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      if (toolName === 'create_order_draft') {
        const items = args.items || [];
        const notes = args.notes || '';

        const text = `Order Draft from MCP Agent:\nItems: ${JSON.stringify(items)}\nNotes: ${notes}`;
        const waUrl = `https://wa.me/${CONTACT.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`;

        return NextResponse.json(
          {
            jsonrpc: '2.0',
            id,
            result: {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(
                    {
                      status: 'draft_created',
                      requiresHumanCompletion: true,
                      whatsappOrderUrl: waUrl,
                      shopUrl: `https://${SITE.domain}/shop/`,
                      note: 'Dirt & Co never captures payment via agent. Complete order directly with our sales team.',
                    },
                    null,
                    2
                  ),
                },
              ],
            },
          },
          { headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${toolName}` } },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { jsonrpc: '2.0', id, error: { code: -32601, message: `Unknown method: ${method}` } },
      { status: 404, headers: corsHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error: invalid JSON' } },
      { status: 400, headers: corsHeaders }
    );
  }
}
