import '../styles/globals.css';
import CookieConsent from '../components/CookieConsent';
import { Analytics } from '@vercel/analytics/next';

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
      <Analytics />
    </>
  );
}