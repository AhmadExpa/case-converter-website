import Head from 'next/head';
import {
  buildOrganizationSchema,
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
}) {
  const normalizedPath = normalizePath(path);
  const alternates = getAlternateLinks(normalizedPath);
  const canonicalUrl = getCanonicalUrl(normalizedPath, locale);
  const defaultHref = getCanonicalUrl(normalizedPath, 'en');
  const schemas = [
    ...(includeDefaultSchemas ? [buildWebSiteSchema(), buildOrganizationSchema()] : []),
    ...[].concat(schema).filter(Boolean),
  ];

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
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
