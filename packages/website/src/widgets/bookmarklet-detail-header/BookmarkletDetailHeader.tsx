import { WcagBadges } from "@/entities/bookmarklet/ui/WcagBadges";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";

interface BookmarkletDetailHeaderProps {
  bookmarklet: BookmarkletInfo;
}

export function BookmarkletDetailHeader({ bookmarklet }: BookmarkletDetailHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-3">{bookmarklet.name}</h1>
      <p className="text-lg text-muted-foreground">{bookmarklet.description}</p>
      <div className="mt-4">
        <WcagBadges criteria={bookmarklet.wcag} />
      </div>
    </header>
  );
}
