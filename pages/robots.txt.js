import { buildRobotsTxt } from '../utils/site';

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  res.write(buildRobotsTxt());
  res.end();

  return {
    props: {},
  };
}

export default function RobotsTxt() {
  return null;
}
