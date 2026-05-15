import ContextDetailPage from '../components/ContextDetailPage';
import { useTranslation } from '../utils/i18n';

export default function GuidePage() {
  const { t, locale, dir } = useTranslation();

  const sections = t('guide.sections') || [];

  return (
    <ContextDetailPage
      title={t('meta.guide.title')}
      description={t('meta.guide.description')}
      path="/guide"
      locale={locale}
      dir={dir}
      pageTitle={t('guide.title')}
      intro={t('guide.intro')}
      sections={sections}
      ctaTitle={t('guide.ctaTitle')}
      ctaBody={t('guide.ctaBody')}
      ctaLabel={t('guide.ctaLabel')}
      ctaHref="/analytics-guide"
      ctaLabelSecondary={t('common.nav.home')}
      ctaHrefSecondary="/"
      homeLabel={t('common.nav.home')}
    />
  );
}
