import type { Metadata } from 'next';
import { SITE } from '@/config/site';

// checkout/page.tsx is a Client Component (reads the cart from localStorage)
// — this server layout supplies its metadata. noindex: a cart-dependent
// transactional page has no content of its own to rank.
export const metadata: Metadata = {
  title: 'Checkout | AEMC',
  description: 'Complete your electric dirt bike order — delivery details, payment method and Pay in 4.',
  alternates: { canonical: `https://${SITE.domain}/checkout/` },
  robots: { index: false, follow: true },
  other: { 'og:updated_time': new Date().toISOString() },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
