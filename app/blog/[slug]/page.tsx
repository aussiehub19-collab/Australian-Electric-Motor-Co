import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SmartImage } from '@/components/SmartImage';
import { JsonLd } from '@/components/JsonLd';
import { FaqAccordion } from '@/components/FaqAccordion';
import { POSTS, PRODUCTS, SITE } from '@/config/site';
import { buildSeoTitle, truncateDescription } from '@/lib/seo';
import { buildFaqSchema } from '@/lib/faq';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

/**
 * Renders a paragraph's inline `[text](/url/)` markdown links as real
 * <Link> components — the previous renderer only understood `### ` headers
 * and dumped everything else as plain text, so a post's "internal links"
 * were never actually clickable. Plain text either side of a link (or with
 * no link at all) passes through unchanged.
 */
function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <React.Fragment key={i}>{part}</React.Fragment>;
    const [, label, href] = match;
    return (
      <Link key={i} href={href} className="text-[#C87D55] underline decoration-[#8C4A2F]/50 underline-offset-2 hover:text-white">
        {label}
      </Link>
    );
  });
}

type ContentBlock = { type: 'h3'; text: string } | { type: 'p'; text: string } | { type: 'ul'; items: string[] };

/**
 * Splits post.content into heading/paragraph/list blocks by LINE, not by
 * blank-line-delimited chunks — the old `content.split('\n\n')` treated a
 * `### Heading` immediately followed by its own paragraph (no blank line
 * between them, the format every post in this file actually uses) as ONE
 * block, so `.replace('### ', '')` only stripped the leading marker and the
 * whole paragraph rendered inside the <h3>, forced uppercase by its CSS.
 * That bug was live on all 3 original posts, not just new ones — fixed here
 * for the whole template rather than reformatting 28 posts' source text.
 */
function parseContent(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  let paraBuf: string[] = [];
  let listBuf: string[] = [];

  const flushPara = () => {
    if (paraBuf.length) {
      blocks.push({ type: 'p', text: paraBuf.join(' ') });
      paraBuf = [];
    }
  };
  const flushList = () => {
    if (listBuf.length) {
      blocks.push({ type: 'ul', items: listBuf });
      listBuf = [];
    }
  };

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trim();
    if (!line) {
      flushPara();
      flushList();
    } else if (line.startsWith('### ')) {
      flushPara();
      flushList();
      blocks.push({ type: 'h3', text: line.slice(4) });
    } else if (line.startsWith('- ')) {
      flushPara();
      listBuf.push(line.slice(2));
    } else {
      flushList();
      paraBuf.push(line);
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export async function generateMetadata({ params }: PostPageProps) {
  const { slug } = await params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };

  // Was `${post.title} | ... Trail Tech` + an unconditional `.slice(150)+'...'`
  // — the exact sitewide title/description bug CLAUDE.md documents as fixed
  // everywhere else. Routed through the same builders as every other page.
  const title = buildSeoTitle(post.title);
  const description = truncateDescription(post.excerpt);

  return {
    title,
    description,
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

  const blogPostingSchema: Record<string, any>[] = [
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
          url: `https://${SITE.domain}/icon.svg`,
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
  const postFaq = (post as any).faq as { question: string; answer: string }[] | undefined;
  if (postFaq?.length) {
    blogPostingSchema.push(buildFaqSchema(postFaq));
  }

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
          parseContent(post.content).map((block, index) => {
            if (block.type === 'h3') {
              return (
                <h3 key={index} className="text-xl font-bold uppercase text-white tracking-tight pt-4 pb-1 border-b border-[#23272E]">
                  {block.text}
                </h3>
              );
            }
            if (block.type === 'ul') {
              return (
                <ul key={index} className="list-disc pl-5 space-y-1.5">
                  {block.items.map((line, li) => (
                    <li key={li}>{renderInline(line)}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{renderInline(block.text)}</p>;
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

      {/* Post FAQ — 3-5 question-intent keywords from this post's cluster, per docs/blog-plan.md */}
      {postFaq?.length ? (
        <div className="space-y-6">
          <h2 className="text-xl font-bold uppercase text-white font-mono">
            Common Questions
          </h2>
          <FaqAccordion items={postFaq} idPrefix="post" />
        </div>
      ) : null}

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
