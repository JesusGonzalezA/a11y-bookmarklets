import { Link } from "react-router";
import { ROUTES } from "@/shared/config/routes";

export function Header() {
  return (
    <header className="border-b border-border">
      <nav
        className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between"
        aria-label="Main"
      >
        <Link
          to={ROUTES.HOME}
          className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
        >
          A11y Bookmarklets
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.BUILDER}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Builder
          </Link>
          <a
            href="https://github.com/user/a11y-bookmarklets"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </nav>
    </header>
  );
}
