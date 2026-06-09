import React from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../utils/i18n';
import { buildBreadcrumbSchema } from '../utils/site';

export default function About() {
  const { t, locale, dir } = useTranslation();
  const paragraphs = t('about.paragraphs') || [];
  const breadcrumbItems = [
    { label: t('common.nav.home'), href: '/' },
    { label: t('common.nav.about'), href: '/about' },
  ];

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title={t('meta.about.title')}
        description={t('meta.about.description')}
        path="/about"
        locale={locale}
        schema={[buildBreadcrumbSchema(breadcrumbItems)]}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
            {t('about.title')}
          </h1>
          <div className="grid gap-6 md:grid-cols-[1.4fr,0.9fr]">
            <section className="space-y-4 text-sm leading-relaxed rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
              <p>
                <Link
                  href="/contact"
                  locale={locale}
                  className="font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300"
                >
                  {t('common.nav.contact')}
                </Link>{' '}
                {t('about.contactPrompt')}
              </p>
            </section>

            <aside className="rounded-2xl border border-gray-200 bg-orange-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Built for practical formatting work
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                QuickTextFormatter is designed for writers, students, editors, and marketing teams
                that need a fast browser-based way to clean titles, normalize copy, and review text
                length before publishing.
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <Link href="/guide" locale={locale} className="block font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300">
                  Read the title case guide
                </Link>
                <Link href="/analytics-guide" locale={locale} className="block font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300">
                  Review the analytics guide
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
