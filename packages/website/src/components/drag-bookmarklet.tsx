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
      onClick={(e) => e.preventDefault()}
      draggable
      title={name}
      aria-label={`Drag ${name} bookmarklet to your bookmarks bar`}
    >
      {name}
    </a>
  );
}
