import { Link } from "react-router";
import { ROUTES } from "@/shared/config/routes";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface BookmarkletBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function BookmarkletBreadcrumb({ items }: BookmarkletBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center gap-2 text-sm text-muted-foreground">
        <li>
          <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors">
            Home
          </Link>
        </li>
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.label} {...(isLast ? { "aria-current": "page" as const, className: "text-foreground font-medium" } : {})}>
              <span aria-hidden="true" className="mr-2">/</span>
              {item.to && !isLast ? (
                <Link to={item.to} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                item.label
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
