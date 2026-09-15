import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enquiries | AEMC',
  robots: { index: false, follow: false },
};

export default function EnquiriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
