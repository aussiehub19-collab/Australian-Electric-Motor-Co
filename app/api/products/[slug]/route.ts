import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, SITE } from '@/config/site';

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
};

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return NextResponse.json(
      { error: 'Product not found', slug },
      { status: 404, headers: corsHeaders }
    );
  }

  return NextResponse.json(
    {
      ...product,
      currency: SITE.currency,
      url: `https://${SITE.domain}/shop/${product.category}/${product.slug}/`,
    },
    { headers: corsHeaders }
  );
}
