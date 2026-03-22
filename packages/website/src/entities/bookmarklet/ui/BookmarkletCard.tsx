import { Link } from "react-router";
import { Badge } from "@/shared/ui/badge";
import { DragBookmarklet } from "@/entities/bookmarklet/ui/DragBookmarklet";
import { buttonVariants } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/config/routes";

interface BookmarkletCardProps {
  bookmarklet: BookmarkletInfo;
  bookmarkletUrl?: string;
}

export function BookmarkletCard({ bookmarklet, bookmarkletUrl }: BookmarkletCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{bookmarklet.name}</CardTitle>
        <CardDescription>{bookmarklet.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-2">
        <ul className="flex flex-wrap gap-1.5 list-none p-0" aria-label="WCAG criteria">
          {bookmarklet.wcag.map((criterion) => (
            <li key={criterion}>
              <Badge variant="secondary">WCAG {criterion}</Badge>
            </li>
          ))}
        </ul>
        {bookmarklet.tags.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 list-none p-0" aria-label="Tags">
            {bookmarklet.tags.map((tag) => (
              <li key={tag}>
                <Badge variant="outline">{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter className="flex gap-2 flex-wrap">
        {bookmarkletUrl ? (
          <DragBookmarklet bookmarkletUrl={bookmarkletUrl} name={bookmarklet.name} size="sm" />
        ) : (
          <span
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "opacity-50 pointer-events-none",
            )}
          >
            Not built yet
          </span>
        )}
        <Link
          to={ROUTES.BOOKMARKLET_DETAIL(bookmarklet.id)}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View details
          <span className="sr-only"> for {bookmarklet.name}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
