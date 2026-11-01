import Head from 'next/head';
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildWebSiteSchema,
  getAlternateLinks,
  getCanonicalUrl,
  getOpenGraphImageUrl,
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
  includeDefaultSchemas = true,
  ogType = 'website',
  image = '/og-image.png',
  imageAlt = `${SITE_NAME} preview image`,
  noindex = false,
  hreflang = true,
}) {
  const normalizedPath = normalizePath(path);
  const alternates = getAlternateLinks(normalizedPath, locale);
  const canonicalUrl = getCanonicalUrl(normalizedPath, locale);
  const defaultHref = getCanonicalUrl(normalizedPath, 'en');
  const imageUrl = getOpenGraphImageUrl(image);
  const schemas = [
    ...(includeDefaultSchemas ? [buildWebSiteSchema(), buildOrganizationSchema()] : []),
    buildWebPageSchema({ path: normalizedPath, title, description, locale }),
    ...[].concat(schema).filter(Boolean),
  ];

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      <meta
        name="robots"
        content={
          noindex
            ? 'noindex,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
            : 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
        }
      />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {hreflang && alternates.map(({ hrefLang, href }) => (
        <link key={hrefLang} rel="alternate" hrefLang={hrefLang} href={href} />
      ))}
      {hreflang && <link rel="alternate" hrefLang="x-default" href={defaultHref} />}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content={getOpenGraphLocale(locale)} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      {imageUrl.endsWith('.png') && <meta property="og:image:type" content="image/png" />}
      {image === '/og-image.png' && <meta property="og:image:width" content="1200" />}
      {image === '/og-image.png' && <meta property="og:image:height" content="630" />}
      <meta name="twitter:card" content="summary_large_image" />
      {title && <meta name="twitter:title" content={title} />}
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={imageUrl} />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {schemas.map((item, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026') }}
        />
      ))}
    </Head>
  );
}
