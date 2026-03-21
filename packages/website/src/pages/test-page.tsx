import { Suspense } from "react";
import { Link, useParams } from "react-router";
import { testContentMap } from "@/components/test-content";
import { TestPageLayout } from "@/components/test-page-layout";
import { buttonVariants } from "@/components/ui/button";
import { bookmarklets } from "@/data/bookmarklets";
import { useManifest } from "@/hooks/use-manifest";
import { cn } from "@/lib/utils";

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
        <Link to="/" className={cn(buttonVariants())}>
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
        <Link to={`/${bookmarklet.id}`} className={cn(buttonVariants())}>
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
