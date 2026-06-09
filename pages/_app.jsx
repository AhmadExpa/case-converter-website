import '../styles/globals.css';
import dynamic from 'next/dynamic';
import GoogleAnalytics from '../components/GoogleAnalytics';

const CookieConsent = dynamic(() => import('../components/CookieConsent'), { ssr: false });
const Analytics = dynamic(
  () => import('@vercel/analytics/next').then((module) => module.Analytics),
  { ssr: false },
);

/**
 * Custom App component. Next.js uses this to initialize pages. We
 * import our global styles here so that Tailwind CSS classes are
 * available throughout the application.
 */
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <CookieConsent />
      <GoogleAnalytics />
      <Analytics />
    </>
  );
}
