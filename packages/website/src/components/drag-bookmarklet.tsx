import { useEffect, useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DragBookmarkletProps {
  bookmarkletUrl: string;
  name: string;
  size?: "default" | "sm";
}

export function DragBookmarklet({ bookmarkletUrl, name, size = "default" }: DragBookmarkletProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  // Bypass React's javascript: URL sanitization by setting href directly on the DOM
  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("href", bookmarkletUrl);
    }
  }, [bookmarkletUrl]);

  return (
    // biome-ignore lint/a11y/useValidAnchor: must be an <a> for browser drag-to-bookmarks-bar functionality
    <a
      ref={ref}
      href="#"
      className={cn(buttonVariants({ variant: "outline", size }))}
      onClick={(e) => {
        e.preventDefault();
        const code = bookmarkletUrl.replace(/^javascript:/i, "");
        try {
          new Function(decodeURIComponent(code))();
        } catch {
          /* bookmarklet may throw on this page */
        }
      }}
      draggable
      title={`Click to run or drag to your bookmarks bar`}
      aria-label={`Run or drag ${name} bookmarklet`}
    >
      {name}
    </a>
  );
}
