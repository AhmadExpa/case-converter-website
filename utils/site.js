import { LANGUAGES, DEFAULT_LOCALE } from './languageConfig';

const PLACEHOLDER_SITE_URL = 'https://www.quicktextformatter.com';
const DEFAULT_OG_IMAGE = '/og-image.svg';

const normalizeProductionSiteUrl = (value, fallback) => {
  const fallbackUrl = fallback.replace(/\/$/, '');
  const raw = String(value || '').trim();
  if (!raw) return fallbackUrl;

  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    if (url.hostname === 'localhost' || url.hostname.endsWith('.vercel.app')) {
      return fallbackUrl;
    }
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallbackUrl;
  }
};

export const SITE_NAME = 'QuickTextFormatter';
export const SITE_URL = normalizeProductionSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, PLACEHOLDER_SITE_URL);
export const DEFAULT_SITE_LOCALE = DEFAULT_LOCALE;
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/quicktextformatter/',
  facebook: 'https://www.facebook.com/quicktextformatter/',
};

export const normalizePath = (path = '/') => {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
};

export const joinSiteUrl = (path = '/') => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
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

export const getOpenGraphImageUrl = (imagePath = DEFAULT_OG_IMAGE) => joinSiteUrl(imagePath);

export const buildRobotsTxt = () => `User-agent: *
Allow: /
Disallow: /api
Disallow: /admin
Disallow: /auth
Disallow: /dashboard
Disallow: /private
Disallow: /test
Sitemap: ${SITE_URL}/sitemap.xml
`;

export const buildSitemapXml = ({
  routes = [],
  locales = LANGUAGES.map((lang) => lang.code),
  lastModified = new Date().toISOString(),
} = {}) => {
  const routeItems = routes
    .flatMap((route) =>
      locales.map((locale) => {
        const loc = getCanonicalUrl(route, locale);
        const alternates = locales
          .map((altLocale) => {
            const href = getCanonicalUrl(route, altLocale);
            return `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${href}" />`;
          })
          .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${getCanonicalUrl(route, DEFAULT_SITE_LOCALE)}" />`)
          .join('\n');

        return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastModified}</lastmod>
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
  inLanguage: LANGUAGES.map((lang) => lang.code),
});

export const buildOrganizationSchema = (path = '/') => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Grova',
  url: getCanonicalUrl(path, DEFAULT_SITE_LOCALE),
  logo: getOpenGraphImageUrl(),
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

export const buildBreadcrumbSchema = (items = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items
    .filter((item) => (item?.name || item?.label) && (item?.path || item?.href))
    .map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name || item.label,
      item: joinSiteUrl(item.path || item.href),
    })),
});

export const buildSoftwareApplicationSchema = ({
  name = SITE_NAME,
  path = '/',
  locale = DEFAULT_SITE_LOCALE,
  description = '',
  category = 'BusinessApplication',
} = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name,
  applicationCategory: category,
  operatingSystem: 'Web',
  browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
  description,
  url: getCanonicalUrl(path, locale),
  publisher: {
    '@type': 'Organization',
    name: 'Grova',
    url: getCanonicalUrl('/', DEFAULT_SITE_LOCALE),
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
});

export const buildContactPageSchema = ({ path = '/contact', locale = DEFAULT_SITE_LOCALE, email } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: `${SITE_NAME} Contact`,
  url: getCanonicalUrl(path, locale),
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: getCanonicalUrl('/', DEFAULT_SITE_LOCALE),
    email,
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
