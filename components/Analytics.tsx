import Script from 'next/script';
import { SITE } from '@/config/site';

/**
 * Google Analytics 4 (gtag.js). Renders nothing until NEXT_PUBLIC_GA_ID is set
 * in the environment — see SITE.analyticsId. Loaded `afterInteractive` so the
 * snippet is in the server-rendered HTML (crawlers and RankMath see it) but
 * does not block first paint.
 */
export function Analytics() {
  const id = SITE.analyticsId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
