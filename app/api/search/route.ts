import { NextRequest, NextResponse } from 'next/server';
import { PRODUCTS, POSTS, SITE } from '@/config/site';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Cache-Control': 'public, max-age=300',
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') || '').toLowerCase().trim();
  const category = (searchParams.get('category') || '').toLowerCase().trim();
  const maxPrice = searchParams.get('max_price') ? Number(searchParams.get('max_price')) : Infinity;

  const matchedProducts = PRODUCTS.filter((p) => {
    const matchQ =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);
    const matchCat = !category || p.category.toLowerCase() === category;
    const matchPrice = p.price <= maxPrice;
    return matchQ && matchCat && matchPrice;
  }).map((p) => ({
    ...p,
    currency: SITE.currency,
    url: `https://${SITE.domain}/shop/${p.category}/${p.slug}/`,
  }));

  const matchedPosts = POSTS.filter(
    (post) =>
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q)
  ).map((post) => ({
    ...post,
    url: `https://${SITE.domain}/blog/${post.slug}/`,
  }));

  return NextResponse.json(
    {
      query: q,
      totalCount: matchedProducts.length + matchedPosts.length,
      products: matchedProducts,
      posts: matchedPosts,
    },
    { headers: corsHeaders }
  );
}
