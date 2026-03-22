import { Suspense } from "react";
import { Link, useParams } from "react-router";
import { testContentMap } from "@/pages/test/content";
import { TestPageLayout } from "@/pages/test/TestPageLayout";
import { buttonVariants } from "@/shared/ui/button";
import { bookmarklets } from "@/entities/bookmarklet/model/types";
import { useManifest } from "@/entities/bookmarklet/api/use-manifest";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

export function TestPage() {
  const { bookmarkletId } = useParams();
  const manifest = useManifest();
  const bookmarklet = bookmarklets.find((b) => b.id === bookmarkletId);

  if (!bookmarklet) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Test page not found</h1>
        <p className="text-muted-foreground mb-6">
          The bookmarklet &quot;{bookmarkletId}&quot; does not exist.
        </p>
        <Link to={ROUTES.HOME} className={cn(buttonVariants())}>
          Back to home
        </Link>
      </div>
    );
  }

  const entry = manifest?.find((b: { id: string }) => b.id === bookmarklet.id);
  const TestContent = testContentMap[bookmarklet.id];

  if (!TestContent) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Test page not available</h1>
        <p className="text-muted-foreground mb-6">
          No test page has been created for &quot;{bookmarklet.name}&quot; yet.
        </p>
        <Link to={ROUTES.BOOKMARKLET_DETAIL(bookmarklet.id)} className={cn(buttonVariants())}>
          Back to {bookmarklet.name}
        </Link>
      </div>
    );
  }

  return (
    <TestPageLayout bookmarklet={bookmarklet} bookmarkletUrl={entry?.bookmarkletUrl}>
      <Suspense
        fallback={
          <div className="py-12 text-center text-muted-foreground">Loading test content…</div>
        }
      >
        <TestContent />
      </Suspense>
    </TestPageLayout>
  );
}
