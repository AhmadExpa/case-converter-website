export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
];

export const DEFAULT_LOCALE = 'en';

export const isSupportedLocale = (locale) =>
  LANGUAGES.some((lang) => lang.code === locale);

export const getLanguageConfig = (locale) =>
  LANGUAGES.find((lang) => lang.code === locale) ||
  LANGUAGES.find((lang) => lang.code === DEFAULT_LOCALE);
