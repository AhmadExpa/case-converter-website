import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useTranslation } from '../utils/i18n';

export default function About() {
  const { t, locale, dir } = useTranslation();
  const paragraphs = t('about.paragraphs') || [];

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title={t('meta.about.title')}
        description={t('meta.about.description')}
        path="/about"
        locale={locale}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          {t('about.title')}
        </h1>
        <div className="space-y-4 text-sm leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
