import Head from 'next/head';
import { getAlternateLinks } from '../utils/i18n';

const normalizeBase = (url = '') => (url.endsWith('/') ? url.slice(0, -1) : url);
const normalizePath = (path = '/') => (path.startsWith('/') ? path : `/${path}`);

export default function SeoHead({ title, description, path = '/', locale = 'en' }) {
  const baseUrl = normalizeBase(process.env.NEXT_PUBLIC_SITE_URL || '');
  const normalizedPath = normalizePath(path);
  const alternates = getAlternateLinks(normalizedPath, baseUrl);
  const defaultHref = `${baseUrl}/en${normalizedPath === '/' ? '' : normalizedPath}`;

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {alternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={defaultHref} />
      <meta name="og:locale" content={locale} />
    </Head>
  );
}
