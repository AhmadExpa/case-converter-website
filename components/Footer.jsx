import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../utils/i18n';
import { SOCIAL_LINKS } from '../utils/site';
import LanguageSwitcher from './LanguageSwitcher';

export default function Footer() {
  const { t, locale } = useTranslation();

  return (
    <footer className="bg-white/90 dark:bg-gray-900/90 border-t border-gray-200 dark:border-gray-800 mt-12">
      <div className="container mx-auto px-4 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="text-center md:text-left">
          <span className="block text-sm font-semibold tracking-wide text-gray-800 dark:text-gray-100">
            {t('common.brand')}
          </span>
          <span className="block text-xs md:text-sm text-gray-500 dark:text-gray-400">
            {t('common.tagline')}
          </span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-300">
          <Link
            href="/privacy"
            locale={locale}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            locale={locale}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Terms of Use
          </Link>
          <Link
            href="/advertising"
            locale={locale}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t('common.nav.advertising')}
          </Link>
          <Link
            href="/contact"
            locale={locale}
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            {t('common.nav.contact')}
          </Link>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Instagram
          </a>
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Facebook
          </a>
        </nav>

        <LanguageSwitcher variant="footer" />
      </div>
    </footer>
  );
}
