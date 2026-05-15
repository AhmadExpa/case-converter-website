import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://www.quicktextformatter.com')
).replace(/\/$/, '');

const routes = ['/', '/about', '/contact', '/privacy', '/terms', '/advertising', '/guide', '/analytics-guide'];
const locales = ['en', 'ar', 'hi', 'tr', 'el', 'es'];

const localizedUrl = (route, locale) => {
  const normalizedRoute = route.startsWith('/') ? route : `/${route}`;
  const path = locale === 'en'
    ? normalizedRoute
    : normalizedRoute === '/'
      ? `/${locale}`
      : `/${locale}${normalizedRoute}`;
  return `${SITE_URL}${path}`;
};

const robots = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${routes
  .flatMap((route) =>
    locales.map((locale) => {
      const alternates = locales
        .map((altLocale) => `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${localizedUrl(route, altLocale)}" />`)
        .join('\n');

      return `  <url>
    <loc>${localizedUrl(route, locale)}</loc>
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
