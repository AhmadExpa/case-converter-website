import Link from 'next/link';
import { useTranslation } from '../utils/i18n';

export default function Breadcrumbs({ items = [] }) {
  const { locale } = useTranslation();
  const crumbs = items.filter((item) => item?.label && item?.href);

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        {crumbs.map((item, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <li key={`${item.href}-${item.label}`} className="flex items-center gap-2">
              {isLast ? (
                <span aria-current="page" className="font-medium text-gray-800 dark:text-gray-100">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  locale={locale}
                  className="hover:text-orange-700 dark:hover:text-orange-300"
                >
                  {item.label}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
