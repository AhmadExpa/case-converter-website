import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../utils/i18n';

export default function NotFoundPage() {
  const { t, locale, dir } = useTranslation();
  const breadcrumbItems = [
    { label: t('common.nav.home'), href: '/' },
    { label: '404', href: '/404' },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title="Page not found | QuickTextFormatter"
        description="The page you requested could not be found. Use the case converter homepage or explore the formatting guides."
        path="/404"
        locale={locale}
        noindex
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <Breadcrumbs items={breadcrumbItems} />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300">
            404
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            Page not found
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600 dark:text-gray-300">
            The link may be outdated or the page may have moved. You can return to the case
            converter or use the guides below to keep browsing.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/" locale={locale} className="inline-flex items-center rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700">
              Open the converter
            </Link>
            <Link href="/guide" locale={locale} className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-950">
              Read the title case guide
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
