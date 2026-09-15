import type { Metadata } from 'next';

// Internal tool, not a marketing page — kept out of search entirely.
export const metadata: Metadata = {
  title: 'Reply to Enquiry | AEMC',
  robots: { index: false, follow: false },
};

export default function ReplyEnquiryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
