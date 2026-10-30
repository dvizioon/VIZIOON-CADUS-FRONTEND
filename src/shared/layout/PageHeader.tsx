import type { Route } from "next";
import Link from "next/link";
import { AppTypography } from "@/shared/ui";

interface BreadcrumbItem {
  label: string;
  href?: Route;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeader({ title, breadcrumbs }: PageHeaderProps) {
  return (
    <header className="mb-4">
      <nav aria-label={`Trilha de ${title}`}>
        <ol className="crumbs">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const label = (
              <AppTypography as="span" className="text-white" type="body-sm" weight="medium">
                {item.label}
              </AppTypography>
            );

            return (
              <li
                className="crumb"
                key={item.label}
                style={{ zIndex: breadcrumbs.length - index }}
              >
                {item.href && !isLast ? (
                  <Link className="text-white no-underline" href={item.href}>
                    {label}
                  </Link>
                ) : (
                  label
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </header>
  );
}
