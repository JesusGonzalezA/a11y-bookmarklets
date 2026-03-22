import { useMemo, useState } from "react";
import type { BookmarkletInfo } from "@/entities/bookmarklet/model/types";

export function useBookmarkletSearch(bookmarklets: BookmarkletInfo[]) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return bookmarklets;

    return bookmarklets.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        b.wcag.some((criterion) => `wcag ${criterion}`.includes(query)),
    );
  }, [bookmarklets, search]);

  return { search, setSearch, filtered };
}
