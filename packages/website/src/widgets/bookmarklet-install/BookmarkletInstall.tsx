import { Link } from "react-router";
import { DragBookmarklet } from "@/entities/bookmarklet/ui/DragBookmarklet";
import { Button, buttonVariants } from "@/shared/ui/button";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";
import type { ManifestEntry } from "@/entities/bookmarklet/api/use-manifest";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

interface BookmarkletInstallProps {
  bookmarklet: BookmarkletInfo;
  entry?: ManifestEntry;
}

export function BookmarkletInstall({ bookmarklet, entry }: BookmarkletInstallProps) {
  return (
    <section aria-labelledby="detail-install" className="mb-10">
      <h2 id="detail-install" className="text-xl font-semibold mb-4">
        Install
      </h2>
      {entry ? (
        <div className="flex gap-3 flex-wrap">
          <DragBookmarklet bookmarkletUrl={entry.bookmarkletUrl} name={bookmarklet.name} />
          <Button
            variant="secondary"
            onClick={() => navigator.clipboard.writeText(entry.bookmarkletUrl)}
            aria-label={`Copy ${bookmarklet.name} bookmarklet URL`}
          >
            Copy bookmarklet URL
          </Button>
          <Link
            to={ROUTES.TEST_PAGE(bookmarklet.id)}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Try test page
          </Link>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">
          Bookmarklet not built yet. Run{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-xs">
            npm run build:bookmarklets
          </code>{" "}
          first.
        </p>
      )}
    </section>
  );
}
