import ContextDetailPage from '../components/ContextDetailPage';
import { useTranslation } from '../utils/i18n';

export default function AnalyticsGuidePage() {
  const { t, locale, dir } = useTranslation();

  const sections = t('analyticsGuide.sections') || [];

  return (
    <ContextDetailPage
      title={t('meta.analyticsGuide.title')}
      description={t('meta.analyticsGuide.description')}
      path="/analytics-guide"
      locale={locale}
      dir={dir}
      pageTitle={t('analyticsGuide.title')}
      intro={t('analyticsGuide.intro')}
      sections={sections}
      ctaTitle={t('analyticsGuide.ctaTitle')}
      ctaBody={t('analyticsGuide.ctaBody')}
      ctaLabel={t('analyticsGuide.ctaLabel')}
      ctaHref="/guide"
      ctaLabelSecondary={t('common.nav.home')}
      ctaHrefSecondary="/"
      homeLabel={t('common.nav.home')}
    />
  );
}
