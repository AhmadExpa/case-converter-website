import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import SeoHead from '../components/SeoHead';
import { useTranslation } from '../utils/i18n';

export default function Privacy() {
  const { t, locale, dir } = useTranslation();
  const sections = t('privacy.sections') || [];
  const formattedDate = new Intl.DateTimeFormat(locale || 'en', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      <SeoHead
        title={t('meta.privacy.title')}
        description={t('meta.privacy.description')}
        path="/privacy"
        locale={locale}
      />
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-center mb-4">
          {t('privacy.title')}
        </h1>

        <div className="text-sm space-y-4 leading-relaxed max-w-4xl mx-auto">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-xl font-semibold mt-6">{section.heading}</h2>
              {section.body.map((line, lineIdx) => (
                <p key={lineIdx} className="mt-2">
                  {line}
                </p>
              ))}
            </div>
          ))}

          <p className="italic">
            {t('privacy.lastUpdated', { date: formattedDate })}
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
