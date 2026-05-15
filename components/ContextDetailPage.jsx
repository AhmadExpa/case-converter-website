import React from 'react';
import Link from 'next/link';
import Footer from './Footer';
import Navbar from './Navbar';
import SeoHead from './SeoHead';

export default function ContextDetailPage({
  title,
  description,
  path,
  locale,
  dir,
  pageTitle,
  intro,
  sections = [],
  ctaTitle,
  ctaBody,
  ctaLabel,
  ctaHref,
  ctaLabelSecondary,
  ctaHrefSecondary,
  homeLabel = 'Home',
}) {
  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead title={title} description={description} path={path} locale={locale} />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-10">
        <article className="mx-auto max-w-4xl">
          <header className="mb-8 space-y-4 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-orange-600 dark:text-orange-300">
              QuickTextFormatter
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">
              {pageTitle}
            </h1>
            <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-7">
              {intro}
            </p>
          </header>

          <div className="space-y-5">
            {sections.map((section, idx) => (
              <section
                key={idx}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300">
                  {section.body?.map((line, lineIdx) => (
                    <p key={lineIdx}>{line}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-500 p-[1px] shadow-lg">
            <div className="rounded-2xl bg-white px-6 py-6 dark:bg-gray-950">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{ctaTitle}</h2>
              <p className="mt-2 text-sm md:text-base leading-7 text-gray-600 dark:text-gray-300">
                {ctaBody}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {ctaHref && (
                  <Link
                    href={ctaHref}
                    locale={locale}
                    className="inline-flex items-center rounded-full bg-orange-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-700"
                  >
                    {ctaLabel}
                  </Link>
                )}
                {ctaHrefSecondary && (
                  <Link
                    href={ctaHrefSecondary}
                    locale={locale}
                    className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-900"
                  >
                    {ctaLabelSecondary || homeLabel}
                  </Link>
                )}
              </div>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
}
