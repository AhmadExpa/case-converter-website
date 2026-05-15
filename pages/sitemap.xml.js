import { buildSitemapXml } from '../utils/site';

const ROUTES = ['/', '/about', '/contact', '/privacy', '/terms', '/advertising', '/guide', '/analytics-guide'];

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(buildSitemapXml({ routes: ROUTES }));
  res.end();

  return {
    props: {},
  };
}

export default function SitemapXml() {
  return null;
}
