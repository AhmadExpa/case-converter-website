import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import ar from '../locales/ar.json';
import el from '../locales/el.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import hi from '../locales/hi.json';
import tr from '../locales/tr.json';
import { DEFAULT_LOCALE, LANGUAGES, getLanguageConfig, isSupportedLocale } from './languageConfig';

const dictionaries = { en, ar, hi, tr, el, es };

const getNestedValue = (obj, path) =>
  path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);

const interpolate = (value, vars = {}) =>
  typeof value === 'string'
    ? value.replace(/{{\s*(\w+)\s*}}/g, (_, k) => (vars[k] !== undefined ? vars[k] : ''))
    : value;

export const translate = (locale, key, vars, fallback) => {
  const dictionary = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];
  const raw = getNestedValue(dictionary, key);
  if (raw === undefined) return fallback ?? key;
  if (typeof raw === 'string') return interpolate(raw, vars);
  return raw;
};

export const stripLocaleFromPath = (path = '', locale = DEFAULT_LOCALE) => {
  if (!path.startsWith(`/${locale}`)) return path || '/';
  const stripped = path.replace(`/${locale}`, '') || '/';
  return stripped.startsWith('/') ? stripped : `/${stripped}`;
};

export const useTranslation = () => {
  const router = useRouter();
  const locale = isSupportedLocale(router.locale) ? router.locale : DEFAULT_LOCALE;
  const langConfig = getLanguageConfig(locale);
  const dictionary = useMemo(
    () => dictionaries[locale] || dictionaries[DEFAULT_LOCALE],
    [locale]
  );

  const t = useCallback(
    (key, vars, fallback) => {
      const raw = getNestedValue(dictionary, key);
      if (raw === undefined) return fallback ?? key;
      if (typeof raw === 'string') return interpolate(raw, vars);
      return raw;
    },
    [dictionary]
  );

  const syncedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem('preferredLanguage');
    if (!syncedRef.current && stored && stored !== locale && isSupportedLocale(stored)) {
      syncedRef.current = true;
      const path = router.asPath || '/';
      router.replace(path, path, { locale: stored });
      return;
    }
    syncedRef.current = true;
  }, [locale, router]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('preferredLanguage', locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = langConfig?.dir === 'rtl' ? 'rtl' : 'ltr';
  }, [langConfig?.dir, locale]);

  return {
    t,
    locale,
    dir: langConfig?.dir || 'ltr',
    languageOptions: LANGUAGES,
  };
};

export const getAlternateLinks = (path = '/', baseUrl = '') => {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return LANGUAGES.map((lang) => ({
    hrefLang: lang.code,
    href: `${normalizedBase}/${lang.code}${normalizedPath === '/' ? '' : normalizedPath}`,
  }));
};
