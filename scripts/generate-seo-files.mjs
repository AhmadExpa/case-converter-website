import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

const SITE_URL = (
  normalizeProductionSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, 'https://www.quicktextformatter.com')
);
const isPreview = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production';

const routes = ['/', '/about', '/contact', '/privacy', '/terms', '/advertising', '/guide', '/analytics-guide'];
const locales = ['en', 'ar', 'hi', 'tr', 'el', 'es'];
const lastModified = new Date().toISOString();

const localizedUrl = (route, locale) => {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  const path = locale === 'en'
    ? normalizedRoute
    : normalizedRoute === '/'
      ? `/${locale}`
      : `/${locale}${normalizedRoute}`;
  return `${SITE_URL}${path}`;
};

function normalizeProductionSiteUrl(value, fallback) {
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
}

const robots = isPreview
  ? `User-agent: *
Disallow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
  : `User-agent: *
Allow: /
Disallow: /api
Disallow: /admin
Disallow: /auth
Disallow: /dashboard
Disallow: /private
Disallow: /test
Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .flatMap((route) =>
    locales.map((locale) => {
      const alternates = locales
        .map((altLocale) => `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${localizedUrl(route, altLocale)}" />`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${localizedUrl(route, 'en')}" />`)
        .join('\n');

      return `  <url>
    <loc>${localizedUrl(route, locale)}</loc>
    <lastmod>${lastModified}</lastmod>
${alternates}
  </url>`;
    }),
  )
  .join('\n')}
</urlset>
`;

await mkdir(publicDir, { recursive: true });
await writeFile(join(publicDir, 'robots.txt'), robots);
await writeFile(join(publicDir, 'sitemap.xml'), sitemap);
