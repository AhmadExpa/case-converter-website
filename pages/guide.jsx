import ContextDetailPage from '../components/ContextDetailPage';
import { useTranslation } from '../utils/i18n';
import { buildHowToSchema } from '../utils/site';

export default function GuidePage() {
  const { t, locale, dir } = useTranslation();

  const sections = t('guide.sections') || [];
  const howToSteps = sections.map((section) => ({
    name: section.heading,
    text: Array.isArray(section.body) ? section.body.join(' ') : section.heading,
  }));

  return (
    <ContextDetailPage
      title={t('meta.guide.title')}
      description={t('meta.guide.description')}
      path="/guide"
      locale={locale}
      dir={dir}
      pageTitle={t('guide.title')}
      pageLabel="Title Case Guide"
      intro={t('guide.intro')}
      sections={sections}
      ctaTitle={t('guide.ctaTitle')}
      ctaBody={t('guide.ctaBody')}
      ctaLabel={t('guide.ctaLabel')}
      ctaHref="/analytics-guide"
      ctaLabelSecondary={t('common.nav.home')}
      ctaHrefSecondary="/"
      homeLabel={t('common.nav.home')}
      schema={[
        buildHowToSchema({
          name: t('guide.title'),
          description: t('guide.intro'),
          path: '/guide',
          locale,
          steps: howToSteps,
        }),
      ]}
    />
  );
}
