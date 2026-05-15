import Head from 'next/head';
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  getAlternateLinks,
  getCanonicalUrl,
  getOpenGraphLocale,
  normalizePath,
  SITE_NAME,
} from '../utils/site';

export default function SeoHead({
  title,
  description,
  path = '/',
  locale = 'en',
  schema = [],
  includeDefaultSchemas = false,
  keywords = [],
}) {
  const normalizedPath = normalizePath(path);
  const alternates = getAlternateLinks(normalizedPath, locale);
  const canonicalUrl = getCanonicalUrl(normalizedPath, locale);
  const defaultHref = getCanonicalUrl(normalizedPath, 'en');
  const normalizedKeywords = [...new Set([].concat(keywords).flatMap((value) => {
    if (!value) return [];
    return String(value)
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);
  }))];
  const schemas = [
    ...(includeDefaultSchemas ? [buildWebSiteSchema(), buildOrganizationSchema()] : []),
    buildWebPageSchema({ path: normalizedPath, title, description, locale }),
    ...[].concat(schema).filter(Boolean),
  ];

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {normalizedKeywords.length > 0 && (
        <meta name="keywords" content={normalizedKeywords.join(', ')} />
      )}
      <meta
        name="robots"
        content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
      />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {alternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={defaultHref} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={getOpenGraphLocale(locale)} />
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {schemas.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
}
