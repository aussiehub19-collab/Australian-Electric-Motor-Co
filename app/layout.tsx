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
  title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
  description: 'Shop the ultimate electric dirt bike range. From high-torque 72V adult electric dirt bike models to youth mini-motos. Fast AU dispatch and local warranty. GST inclusive.',
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
    title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
    description: 'Shop the ultimate electric dirt bike range. From high-torque 72V adult electric dirt bike models to youth mini-motos. Fast AU dispatch and local warranty.',
    url: `https://${SITE.domain}/`,
    locale: 'en_AU',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 800,
        alt: 'Australian Electric Motor Co Electric Dirt Bike Range Australia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Electric Dirt Bike Superstore Australia | Australian Electric Motor Co',
    description: 'High-performance 72V electric dirt bikes in Australia. Zero emissions, instant torque, race-grade suspension and nationwide delivery.',
    images: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'],
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
