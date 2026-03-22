import { Link, useParams } from "react-router";
import { BookmarkletBreadcrumb } from "@/entities/bookmarklet/ui/BookmarkletBreadcrumb";
import { BookmarkletDetailHeader } from "@/widgets/bookmarklet-detail-header/BookmarkletDetailHeader";
import { BookmarkletInstall } from "@/widgets/bookmarklet-install/BookmarkletInstall";
import { BookmarkletAbout } from "@/widgets/bookmarklet-about/BookmarkletAbout";
import { BookmarkletNavigation } from "@/widgets/bookmarklet-navigation/BookmarkletNavigation";
import { bookmarklets } from "@/entities/bookmarklet/model/types";
import { useManifest } from "@/entities/bookmarklet/api/use-manifest";
import { buttonVariants } from "@/shared/ui/button";
import { Separator } from "@/shared/ui/separator";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

export function BookmarkletDetailPage() {
  const { bookmarkletId } = useParams();
  const manifest = useManifest();
  const bookmarklet = bookmarklets.find((b) => b.id === bookmarkletId);

  if (!bookmarklet) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Bookmarklet not found</h1>
        <p className="text-muted-foreground mb-6">
          The bookmarklet &quot;{bookmarkletId}&quot; does not exist.
        </p>
        <Link to={ROUTES.HOME} className={cn(buttonVariants())}>
          Back to home
        </Link>
      </div>
    );
  }

  const entry = manifest?.find((b) => b.id === bookmarklet.id);
  const currentIndex = bookmarklets.indexOf(bookmarklet);
  const prev = currentIndex > 0 ? bookmarklets[currentIndex - 1] : null;
  const next = currentIndex < bookmarklets.length - 1 ? bookmarklets[currentIndex + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <BookmarkletBreadcrumb items={[{ label: bookmarklet.name }]} />
      <BookmarkletDetailHeader bookmarklet={bookmarklet} />
      <Separator className="mb-8" />
      <BookmarkletInstall bookmarklet={bookmarklet} entry={entry} />
      <Separator className="mb-8" />
      <BookmarkletAbout bookmarklet={bookmarklet} />
      <Separator className="mb-8" />
      <BookmarkletNavigation prev={prev} next={next} />
    </div>
  );
}
