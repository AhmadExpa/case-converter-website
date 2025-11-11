import '../styles/globals.css';

/**
 * Custom App component. Next.js uses this to initialize pages. We
 * import our global styles here so that Tailwind CSS classes are
 * available throughout the application.
 */
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}