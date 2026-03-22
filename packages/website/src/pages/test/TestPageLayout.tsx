import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { BookmarkletBreadcrumb } from "@/entities/bookmarklet/ui/BookmarkletBreadcrumb";
import { buttonVariants } from "@/shared/ui/button";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

interface TestPageLayoutProps {
  bookmarklet: BookmarkletInfo;
  bookmarkletUrl?: string;
  children: React.ReactNode;
}

export function TestPageLayout({ bookmarklet, bookmarkletUrl, children }: TestPageLayoutProps) {
  const runRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (runRef.current && bookmarkletUrl) {
      runRef.current.setAttribute("href", bookmarkletUrl);
    }
  }, [bookmarkletUrl]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <BookmarkletBreadcrumb
        items={[
          { label: bookmarklet.name, to: ROUTES.BOOKMARKLET_DETAIL(bookmarklet.id) },
          { label: "Test Page" },
        ]}
      />

      {/* Warning banner */}
      <div
        role="alert"
        className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200"
      >
        <p className="font-semibold">⚠ Intentionally inaccessible page</p>
        <p className="mt-1">
          This page contains deliberate accessibility errors for testing the{" "}
          <strong>{bookmarklet.name}</strong> bookmarklet. Do not use it as a reference for
          accessible design.
        </p>
      </div>

      {/* Execute button */}
      <div className="mb-8 flex gap-3 flex-wrap items-center">
        {bookmarkletUrl ? (
          // biome-ignore lint/a11y/useValidAnchor: must be an <a> for bookmarklet execution
          <a
            ref={runRef}
            href="#"
            className={cn(buttonVariants(), "gap-2")}
            onClick={(e) => {
              e.preventDefault();
              const code = bookmarkletUrl.replace(/^javascript:/i, "");
              try {
                new Function(decodeURIComponent(code))();
              } catch {
                /* bookmarklet may throw on this page */
              }
            }}
            aria-label={`Run ${bookmarklet.name} bookmarklet on this test page`}
          >
            ▶ Run {bookmarklet.name} bookmarklet
          </a>
        ) : (
          <p className="text-sm text-muted-foreground">
            Bookmarklet not built yet. Run{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
              npm run build:bookmarklets
            </code>{" "}
            first.
          </p>
        )}
        <Link to={ROUTES.BOOKMARKLET_DETAIL(bookmarklet.id)} className={cn(buttonVariants({ variant: "ghost" }))}>
          ← Back to {bookmarklet.name}
        </Link>
      </div>

      {/* Test content */}
      <div className="rounded-lg border border-border bg-background p-6">{children}</div>
    </div>
  );
}
