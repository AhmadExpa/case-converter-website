import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../utils/i18n';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Primary navigation bar for the website.
 *
 * The bar now includes a dark/light mode toggle aligned to the
 * right. The toggle updates a `dark` class on the root element so
 * Tailwind's class-based dark mode styles can react accordingly and
 * the preference is persisted in localStorage.
 */
export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const { t, locale } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedTheme = window.localStorage.getItem('theme');
    const prefersDark =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;

    const initialDark =
      storedTheme === 'dark' || (!storedTheme && prefersDark);

    setIsDark(initialDark);
    const root = document.documentElement;
    if (initialDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        const root = document.documentElement;
        if (next) {
          root.classList.add('dark');
          window.localStorage.setItem('theme', 'dark');
        } else {
          root.classList.remove('dark');
          window.localStorage.setItem('theme', 'light');
        }
      }
      return next;
    });
  };

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 py-4 px-6 flex items-center justify-between gap-4 shadow-sm">
      <Link
        href="/"
        locale={locale}
        className="text-xl font-semibold hover:text-orange-600 dark:hover:text-orange-400 whitespace-nowrap"
      >
        {t('common.brand')}
      </Link>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 px-3 py-1 text-xs sm:text-sm rounded-full border border-gray-300 bg-white shadow-sm hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
          aria-label={isDark ? t('common.theme.light') : t('common.theme.dark')}
        >
          <span className="hidden sm:inline">
            {isDark ? t('common.theme.dark') : t('common.theme.light')}
          </span>
          <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-gray-300 dark:bg-gray-600">
            <span
              className={
                'inline-block h-4 w-4 rounded-full bg-white transform transition-transform ' +
                (isDark ? 'translate-x-4' : 'translate-x-1')
              }
            />
          </span>
        </button>
      </div>
    </nav>
  );
}
