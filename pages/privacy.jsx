import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useTranslation } from '../utils/i18n';
import { createLegalContent, EFFECTIVE_DATE, LAST_UPDATED } from '../utils/legal-content';

const legalContent = createLegalContent();

const legalBodyClassName =
  'space-y-8 text-sm leading-7 text-gray-600 dark:text-gray-300 md:text-base [&_section]:space-y-4 [&_section]:border-t [&_section]:border-gray-200 [&_section]:pt-6 dark:[&_section]:border-gray-800 [&_section:first-child]:border-t-0 [&_section:first-child]:pt-0 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h3]:pt-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_li]:pl-1 [&_a]:font-medium [&_a]:text-indigo-600 [&_a]:underline [&_a]:underline-offset-4 dark:[&_a]:text-indigo-300 [&_table]:mt-4 [&_table]:w-full [&_table]:table-fixed [&_table]:border-collapse [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold dark:[&_th]:border-gray-800 dark:[&_th]:bg-gray-900 [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2 [&_td]:align-top [&_td]:break-words dark:[&_td]:border-gray-800';

export default function Privacy() {
  const { locale, dir } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title="Privacy Policy"
        description="Review the Privacy Policy for QuickTextFormatter."
        path="/privacy"
        locale={locale}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mx-auto max-w-5xl space-y-8">
          <div className="space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-300">
              {legalContent.siteName} - {legalContent.privacyTitle}
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold">{legalContent.privacyTitle}</h1>
            <div className="flex flex-col items-center gap-1 text-sm text-gray-500 dark:text-gray-400 sm:flex-row sm:justify-center sm:gap-6">
              <p>Effective date: {EFFECTIVE_DATE}</p>
              <p>Last updated: {LAST_UPDATED}</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 md:p-8">
            <div className={legalBodyClassName} dangerouslySetInnerHTML={{ __html: legalContent.privacyHtml }} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
