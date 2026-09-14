import type { Metadata } from 'next';

// Internal tool, not a marketing page — kept out of search entirely.
export const metadata: Metadata = {
  title: 'Send Payment Details | AEMC',
  robots: { index: false, follow: false },
};

export default function SendPaymentEmailLayout({ children }: { children: React.ReactNode }) {
  return children;
}
