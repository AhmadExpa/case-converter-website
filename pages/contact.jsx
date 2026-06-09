import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import Breadcrumbs from '../components/Breadcrumbs';
import { useTranslation } from '../utils/i18n';
import { CONTACT_EMAIL, SITE_NAME } from '../utils/legal-content';
import { buildBreadcrumbSchema, buildContactPageSchema } from '../utils/site';

export default function Contact() {
  const { t, locale, dir } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState('');
  const breadcrumbItems = [
    { label: t('common.nav.home'), href: '/' },
    { label: t('common.nav.contact'), href: '/contact' },
  ];

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;

    const subject = `Contact from ${form.name} - ${SITE_NAME}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`;

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    setStatus(t('contact.status'));
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title={t('meta.contact.title')}
        description={t('meta.contact.description')}
        path="/contact"
        locale={locale}
        schema={[
          buildBreadcrumbSchema(breadcrumbItems),
          buildContactPageSchema({ locale, email: CONTACT_EMAIL }),
        ]}
      />
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-semibold text-center mb-2">
            {t('contact.title')}
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 text-center mb-8 max-w-xl mx-auto">
            {t('contact.intro')}
          </p>

          <div className="grid gap-6 md:grid-cols-[1.1fr,0.9fr]">
            <section className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 md:p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('contact.fields.name')}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={t('contact.placeholders.name')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('contact.fields.email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    placeholder={t('contact.placeholders.email')}
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-300"
                  >
                    {t('contact.fields.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={form.message}
                    onChange={handleChange}
                    required
                    className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
                    placeholder={t('contact.placeholders.message')}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-sm transition-colors w-full sm:w-auto"
                >
                  {t('contact.submit')}
                </button>

                {status && (
                  <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                    {status}
                  </p>
                )}
              </form>
            </section>

            <aside className="rounded-xl border border-gray-200 bg-orange-50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                What to send
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
                Use this page to report formatting issues, request a new case mode, or share how
                you use the converter in editorial, academic, or SEO workflows.
              </p>
              <h3 className="mt-6 text-base font-semibold text-gray-900 dark:text-white">
                Direct contact
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                <a className="font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
              </p>
              <div className="mt-6 space-y-3 text-sm">
                <Link href="/" locale={locale} className="block font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300">
                  Try the case converter
                </Link>
                <Link href="/guide" locale={locale} className="block font-medium text-orange-700 underline decoration-orange-400 underline-offset-4 dark:text-orange-300">
                  Read the formatting guide
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
