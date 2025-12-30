import { NextResponse } from 'next/server';

const locales = ['en', 'ar', 'hi', 'tr', 'el', 'es'];
const defaultLocale = 'en';

const PUBLIC_FILE = /\.(.*)$/;

const resolveLocale = (request) => {
  const stored = request.cookies.get('NEXT_LOCALE')?.value;
  if (stored && locales.includes(stored)) return stored;

  const header = request.headers.get('accept-language') || '';
  const parts = header.split(',');
  for (const part of parts) {
    const code = part.trim().split(';')[0].split('-')[0];
    if (locales.includes(code)) return code;
  }

  return defaultLocale;
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const locale = resolveLocale(request);
    const newUrl = new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|robots.txt|sitemap.xml).*)'],
};
