import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '../utils/i18n';

export default function LanguageSwitcher({ variant = 'header' }) {
  const router = useRouter();
  const { locale, t, languageOptions } = useTranslation();

  const handleChange = (event) => {
    const nextLocale = event.target.value;
    if (!nextLocale || nextLocale === locale) return;

    const path = router.asPath || '/';
    router.push(path, path, { locale: nextLocale });

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('preferredLanguage', nextLocale);
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    }
  };

  const baseClasses =
    variant === 'footer'
      ? 'text-xs px-3 py-1 pr-9 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      : 'text-sm px-3 py-1 pr-9 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800';

  return (
    <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
      <span className="text-xs sm:text-sm font-medium">{t('common.languageLabel')}</span>
      <div className="relative inline-flex items-center">
        <select
          value={locale}
          onChange={handleChange}
          className={`${baseClasses} focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-gray-100 appearance-none min-w-[140px]`}
          aria-label={t('common.languageLabel')}
        >
          {languageOptions.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.nativeName}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-2 text-gray-500 dark:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </label>
  );
}
