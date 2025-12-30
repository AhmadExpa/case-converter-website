/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'ar', 'hi', 'tr', 'el', 'es'],
    defaultLocale: 'en',
    localeDetection: false,
  },
};

module.exports = nextConfig;
