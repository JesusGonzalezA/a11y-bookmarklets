import { Link, Outlet } from "react-router";
import { Separator } from "@/components/ui/separator";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      <header className="border-b border-border">
        <nav
          className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between"
          aria-label="Main"
        >
          <Link
            to="/"
            className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
          >
            A11y Bookmarklets
          </Link>
          <a
            href="https://github.com/user/a11y-bookmarklets"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </nav>
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <Separator />
      <footer className="py-8">
        <div className="max-w-3xl mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>A11y Bookmarklets — Open source accessibility tools.</p>
        </div>
      </footer>
    </div>
  );
}
