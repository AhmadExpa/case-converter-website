import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useTranslation } from '../utils/i18n';

export default function Terms() {
  const { t, locale, dir } = useTranslation();
  const paragraphs = t('terms.paragraphs') || [];

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title={t('meta.terms.title')}
        description={t('meta.terms.description')}
        path="/terms"
        locale={locale}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          {t('terms.title')}
        </h1>
        <div className="text-sm space-y-4 leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
