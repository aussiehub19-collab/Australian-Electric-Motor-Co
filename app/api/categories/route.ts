import { NextResponse } from 'next/server';
import { CATEGORIES, PRODUCTS, SITE } from '@/config/site';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
};

export async function GET() {
  const data = CATEGORIES.map((cat) => ({
    ...cat,
    productCount: PRODUCTS.filter((p) => p.category === cat.slug).length,
    url: `https://${SITE.domain}/shop/${cat.slug}/`,
  }));

  return NextResponse.json(
    {
      count: data.length,
      categories: data,
    },
    { headers: corsHeaders }
  );
}
