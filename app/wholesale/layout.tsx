import type { Metadata } from 'next';
import { SITE } from '@/config/site';

// wholesale/page.tsx is a Client Component — this server layout supplies its
// metadata so it doesn't inherit the shared root default title.
export const metadata: Metadata = {
  title: 'Electric Dirt Bike Wholesale & Fleet Orders | AEMC',
  description:
    'Wholesale and bulk electric dirt bike orders for dealers, agricultural stations and fleet buyers in Australia — apply for trade pricing with Australian Electric Motor Co.',
  alternates: { canonical: `https://${SITE.domain}/wholesale/` },
  other: { 'og:updated_time': new Date().toISOString() },
};

export default function WholesaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
