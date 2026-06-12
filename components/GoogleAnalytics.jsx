import Script from 'next/script';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX';
const LINKER_DOMAINS = [
  'grovanova.com',
  'www.grovanova.com',
  'quickcalz.com',
  'www.quickcalz.com',
  'snapdocultra.com',
  'www.snapdocultra.com',
  'quickydecide.com',
  'www.quickydecide.com',
  'quicklydecide.com',
  'www.quicklydecide.com',
  'timedateultra.com',
  'www.timedateultra.com',
  'quicktextformatter.com',
  'www.quicktextformatter.com',
  'checkout.paddle.com',
  'sandbox-checkout.paddle.com',
];

function sendPageView(path) {
  if (!GA_ID || typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}

function hasAnalyticsConsent() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem('cookieConsent') === 'true';
}

export default function GoogleAnalytics() {
  const router = useRouter();

  useEffect(() => {
    if (!GA_ID || !hasAnalyticsConsent()) return undefined;

    const sendWithRetry = (url) => {
      let attempts = 0;
      let timer;

      const trySend = () => {
        if (typeof window.gtag === 'function') {
          sendPageView(url);
          return;
        }

        if (attempts < 20) {
          attempts += 1;
          timer = window.setTimeout(trySend, 100);
        }
      };

      trySend();

      return () => {
        if (timer) window.clearTimeout(timer);
      };
    };

    let cleanupPending = sendWithRetry(router.asPath);
    const handleRouteChange = (url) => {
      cleanupPending?.();
      cleanupPending = sendWithRetry(url);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      cleanupPending?.();
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  if (!GA_ID) return null;

  return (
    <>
      <Script
        id="ga4-script"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`}
        strategy="afterInteractive"
      />
      <Script
        id="ga4-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('js', new Date());
gtag('set', 'linker', { domains: ${JSON.stringify(LINKER_DOMAINS).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')} });
gtag('config', ${JSON.stringify(GA_ID).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')}, { send_page_view: false });
`,
        }}
      />
    </>
  );
}
