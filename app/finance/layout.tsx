import type { Metadata } from 'next';
import { SITE } from '@/config/site';

// finance/page.tsx is a Client Component — this server layout supplies its
// metadata so it doesn't inherit the shared root default title.
export const metadata: Metadata = {
  title: 'Electric Dirt Bike Finance & Pay in 4 | AEMC',
  description:
    'Pay in 4 (four fortnightly instalments, 0% interest) and asset finance on electric dirt bikes in Australia. Model repayments with the Australian Electric Motor Co calculator.',
  alternates: { canonical: `https://${SITE.domain}/finance/` },
  other: { 'og:updated_time': new Date().toISOString() },
};

export default function FinanceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
