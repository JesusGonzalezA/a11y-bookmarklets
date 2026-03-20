import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { DragBookmarklet } from "@/components/drag-bookmarklet";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { BookmarkletInfo } from "@/data/bookmarklets";
import { cn } from "@/lib/utils";

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
      <CardContent className="flex-1">
        <ul className="flex flex-wrap gap-1.5 list-none p-0" aria-label="WCAG criteria">
          {bookmarklet.wcag.map((criterion) => (
            <li key={criterion}>
              <Badge variant="secondary">WCAG {criterion}</Badge>
            </li>
          ))}
        </ul>
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
          to={`/${bookmarklet.id}`}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          View details
          <span className="sr-only"> for {bookmarklet.name}</span>
        </Link>
      </CardFooter>
    </Card>
  );
}
