import type { Metadata } from 'next';
import { SITE } from '@/config/site';

// contact/page.tsx is a Client Component and can't export metadata itself —
// this server layout supplies its title/description so it no longer falls
// back to the shared root default (which was over-length and identical
// across contact/finance/wholesale/search).
export const metadata: Metadata = {
  title: 'Contact & Workshop Support | AEMC',
  description:
    'Get in touch with Australian Electric Motor Co — WhatsApp, email or the enquiry form for advice on electric dirt bikes, parts, warranty and NSW workshop support.',
  alternates: { canonical: `https://${SITE.domain}/contact/` },
  other: { 'og:updated_time': new Date().toISOString() },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
