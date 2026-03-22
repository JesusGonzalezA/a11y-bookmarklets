import { Link } from "react-router";
import { buttonVariants } from "@/shared/ui/button";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

interface BookmarkletNavigationProps {
  prev: BookmarkletInfo | null;
  next: BookmarkletInfo | null;
}

export function BookmarkletNavigation({ prev, next }: BookmarkletNavigationProps) {
  return (
    <nav aria-label="Bookmarklet navigation" className="flex items-center justify-between gap-4">
      <div>
        {prev ? (
          <Link
            to={ROUTES.BOOKMARKLET_DETAIL(prev.id)}
            className={cn(buttonVariants({ variant: "ghost" }), "gap-1")}
          >
            ← {prev.name}
          </Link>
        ) : (
          <Link to={ROUTES.HOME} className={cn(buttonVariants({ variant: "ghost" }), "gap-1")}>
            ← All bookmarklets
          </Link>
        )}
      </div>
      <div>
        {next ? (
          <Link
            to={ROUTES.BOOKMARKLET_DETAIL(next.id)}
            className={cn(buttonVariants({ variant: "ghost" }), "gap-1")}
          >
            {next.name} →
          </Link>
        ) : (
          <Link to={ROUTES.HOME} className={cn(buttonVariants({ variant: "ghost" }), "gap-1")}>
            All bookmarklets →
          </Link>
        )}
      </div>
    </nav>
  );
}
