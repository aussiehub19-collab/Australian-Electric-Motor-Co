import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { POSTS, PRODUCTS, SITE } from '@/config/site';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  return {
    title: `${post.title} | Dirt & Co Trail Tech`,
    description: `${post.excerpt.slice(0, 150)}...`,
    alternates: {
      canonical: `https://${SITE.domain}/blog/${post.slug}/`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
    other: {
      'og:updated_time': new Date().toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);
  const featuredBike = PRODUCTS[0];

  const blogPostingSchema = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      image: [post.image],
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: SITE.name,
      },
      publisher: {
        '@type': 'Organization',
        name: SITE.name,
        logo: {
          '@type': 'ImageObject',
          url: `https://${SITE.domain}/images/logo.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://${SITE.domain}/blog/${post.slug}/`,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `https://${SITE.domain}/`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Trail Tech',
          item: `https://${SITE.domain}/blog/`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.title,
          item: `https://${SITE.domain}/blog/${post.slug}/`,
        },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <JsonLd data={blogPostingSchema} />

      {/* Breadcrumb nav */}
      <nav aria-label="Breadcrumb" className="text-xs text-stone-400 font-mono flex flex-wrap items-center gap-2">
        <Link href="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link href="/blog/" className="hover:text-white">Trail Tech</Link>
        <span>/</span>
        <span className="text-[#C87D55] truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Header with Single H1 */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="bg-[#8C4A2F] text-white px-2.5 py-1 rounded font-bold uppercase">
            {post.category}
          </span>
          <span className="text-stone-400">{post.date}</span>
          <span>•</span>
          <span className="text-stone-400">{post.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-300 leading-relaxed italic border-l-2 border-[#8C4A2F] pl-4">
          {post.excerpt}
        </p>
      </div>

      {/* Article Hero Media */}
      <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[#2B2F36]">
        <SmartImage
          src={post.image}
          alt={post.title}
          aspectRatio="16/9"
          priority={true}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Body with Internal Links */}
      <div className="prose prose-invert max-w-none text-stone-300 leading-relaxed text-sm sm:text-base space-y-6">
        {post.content ? (
          post.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold uppercase text-white tracking-tight pt-4 pb-1 border-b border-[#23272E]">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })
        ) : (
          <p>{post.excerpt}</p>
        )}
      </div>

      {/* Embedded Product Feature Callout */}
      {featuredBike && (
        <div className="bg-[#17191C] border border-[#8C4A2F]/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden bg-white flex-shrink-0">
            <SmartImage
              src={featuredBike.images[0]}
              alt={featuredBike.name}
              aspectRatio="4/3"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-2 flex-1">
            <span className="text-[10px] font-mono uppercase text-[#C87D55] font-bold">
              Featured Outback Machine
            </span>
            <h4 className="text-lg font-bold text-white">{featuredBike.name}</h4>
            <p className="text-xs text-stone-400 line-clamp-2">{featuredBike.shortDescription}</p>
            <div className="pt-2 flex items-center gap-4">
              <span className="text-amber-400 font-bold font-mono text-base">
                ${featuredBike.price.toLocaleString()} AUD
              </span>
              <Link
                href={`/shop/${featuredBike.category}/${featuredBike.slug}/`}
                className="text-xs font-bold text-white bg-[#8C4A2F] hover:bg-[#A35839] px-4 py-2 rounded-lg transition"
              >
                Inspect Bike &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* More Articles */}
      {relatedPosts.length > 0 && (
        <div className="pt-8 border-t border-[#23272E] space-y-6">
          <h2 className="text-xl font-bold uppercase text-white font-mono">
            Continue Reading Trail Tech
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}/`}
                className="bg-[#17191C] border border-[#2B2F36] rounded-xl p-4 hover:border-[#8C4A2F] transition space-y-2 group"
              >
                <div className="text-[10px] font-mono text-[#C87D55]">{r.category}</div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#C87D55] transition line-clamp-2">
                  {r.title}
                </h3>
                <div className="text-xs text-stone-500 font-mono">{r.date} • {r.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
