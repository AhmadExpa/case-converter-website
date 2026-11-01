import Script from 'next/script';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const isValidGtmId = (id) => !!id && /^GTM-[A-Z0-9]+$/.test(id);

export default function GoogleTagManager() {
  if (!isValidGtmId(GTM_ID)) return null;

  return (
    <Script
      id="gtm-init"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
if (!window.__consentReady) {
  window.__consentReady = true;
  window.gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied', wait_for_update: 500 });
  try { if (localStorage.getItem('cookieConsent')==='true') window.gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' }); } catch (e) {}
}
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
`,
      }}
    />
  );
}

// Rendered from _document so the fallback iframe sits right after <body>.
export function GoogleTagManagerNoScript() {
  if (!isValidGtmId(GTM_ID)) return null;

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
