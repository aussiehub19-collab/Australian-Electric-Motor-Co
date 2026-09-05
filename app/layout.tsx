import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { AnnouncementBar } from '@/components/AnnouncementBar';
import { ChatHub } from '@/components/ChatHub';
import { SITE, SEO_KEYWORDS } from '@/config/site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#8C4A2F',
};

export const metadata: Metadata = {
  // Fallback only — every route should set its own metadata. Kept <=60 chars
  // and free of the "Superstore" phrasing so an un-overridden page still
  // reads correctly (crosscheck check 10 scans for regressions here).
  title: 'Electric Dirt Bikes Australia | Australian Electric Motor Co',
  description: 'Electric dirt bikes for adults, kids and farms: motocross, enduro and road-legal models, 2-year warranty, fast AU crate delivery, 10% off with crypto.',
  keywords: SEO_KEYWORDS.secondary.join(', '),
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  metadataBase: new URL(`https://${SITE.domain}`),
  alternates: {
    canonical: `https://${SITE.domain}/`,
  },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: 'Electric Dirt Bikes Australia | Australian Electric Motor Co',
    description: 'Electric dirt bikes for adults, kids and farms: motocross, enduro and road-legal models, 2-year warranty, fast AU crate delivery, 10% off with crypto.',
    url: `https://${SITE.domain}/`,
    locale: 'en_AU',
    images: [
      {
        url: '/images/home/hero-1.webp',
        width: 1200,
        height: 800,
        alt: 'Australian Electric Motor Co Electric Dirt Bike Range Australia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bikes Australia | Australian Electric Motor Co',
    description: 'Electric dirt bikes for adults, kids and farms — motocross, enduro and road-legal models, 2-year warranty and fast AU crate delivery.',
    images: ['/images/home/hero-1.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:updated_time': new Date().toISOString(),
    'google-site-verification': SITE.gscVerification || 'pending',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={SITE.locale || 'en-AU'} className="scroll-smooth">
      <head>
        {/* Agent-Ready WebMCP Client Context Loader */}
        <script src="/js/webmcp.js" defer></script>
      </head>
      <body className="bg-[#0f1012] text-stone-100 min-h-screen flex flex-col font-sans selection:bg-[#8C4A2F] selection:text-white antialiased" suppressHydrationWarning>
        <AnnouncementBar />
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <ChatHub />
      </body>
    </html>
  );
}
