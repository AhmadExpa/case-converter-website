import { LANGUAGES, DEFAULT_LOCALE } from './languageConfig';

const PLACEHOLDER_SITE_URL = 'https://www.quicktextformatter.com';
const VERCEL_SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';

export const SITE_NAME = 'QuickTextFormatter';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || VERCEL_SITE_URL || PLACEHOLDER_SITE_URL).replace(/\/$/, '');
export const DEFAULT_SITE_LOCALE = DEFAULT_LOCALE;
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/quicktextformatter/',
  facebook: 'https://www.facebook.com/quicktextformatter/',
};

export const normalizePath = (path = '/') => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

export const buildLocalizedPath = (path = '/', locale = DEFAULT_SITE_LOCALE) => {
  const normalizedPath = normalizePath(path);
  if (locale === DEFAULT_SITE_LOCALE) return normalizedPath;
  return normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;
};

export const getCanonicalUrl = (path = '/', locale = DEFAULT_SITE_LOCALE) =>
  `${SITE_URL}${buildLocalizedPath(path, locale)}`;

export const getAlternateLinks = (path = '/', currentLocale = DEFAULT_SITE_LOCALE) => {
  const selfLink = {
    hrefLang: currentLocale,
    href: getCanonicalUrl(path, currentLocale),
  };

  const otherLinks = LANGUAGES.filter((lang) => lang.code !== currentLocale).map((lang) => ({
    hrefLang: lang.code,
    href: getCanonicalUrl(path, lang.code),
  }));

  return [selfLink, ...otherLinks];
};

export const getOpenGraphLocale = (locale = DEFAULT_SITE_LOCALE) => {
  const map = {
    en: 'en_US',
    ar: 'ar_AR',
    hi: 'hi_IN',
    tr: 'tr_TR',
    el: 'el_GR',
    es: 'es_ES',
  };

  return map[locale] || map[DEFAULT_SITE_LOCALE];
};

export const buildRobotsTxt = () => `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;

export const buildSitemapXml = ({ routes = [], locales = LANGUAGES.map((lang) => lang.code) } = {}) => {
  const routeItems = routes
    .flatMap((route) =>
      locales.map((locale) => {
        const loc = getCanonicalUrl(route, locale);
        const alternates = locales
          .map((altLocale) => {
            const href = getCanonicalUrl(route, altLocale);
            return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${href}" />`;
          })
          .join('\n');

        return `  <url>
    <loc>${loc}</loc>
${alternates}
  </url>`;
      }),
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routeItems}
</urlset>
`;
};

export const buildWebSiteSchema = (path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: getCanonicalUrl(path, DEFAULT_SITE_LOCALE),
});

export const buildOrganizationSchema = (path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: getCanonicalUrl(path, DEFAULT_SITE_LOCALE),
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.facebook],
});

export const buildWebPageSchema = ({ path = '/', title = '', description = '', locale = DEFAULT_SITE_LOCALE } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title || SITE_NAME,
  description,
  url: getCanonicalUrl(path, locale),
  inLanguage: locale,
  isPartOf: {
    '@type': 'WebSite',
    name: SITE_NAME,
    url: getCanonicalUrl('/', DEFAULT_SITE_LOCALE),
  },
});

export const buildFaqSchema = (questions = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: questions
    .filter((item) => item?.question && item?.answer)
    .map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
});
