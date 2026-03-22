import { BookmarkletCard } from "@/entities/bookmarklet/ui/BookmarkletCard";
import { getBookmarkletUrl } from "@/entities/bookmarklet/api/get-bookmarklet-url";
import { bookmarklets } from "@/entities/bookmarklet/model/types";
import { useManifest } from "@/entities/bookmarklet/api/use-manifest";
import { useBookmarkletSearch } from "@/features/search-bookmarklets/useBookmarkletSearch";

export function BookmarkletCatalog() {
  const manifest = useManifest();
  const { search, setSearch, filtered } = useBookmarkletSearch(bookmarklets);

  return (
    <section aria-labelledby="bookmarklets-heading" className="mb-16">
      <h2 id="bookmarklets-heading" className="text-2xl font-semibold tracking-tight mb-6">
        Bookmarklets
      </h2>
      <input
        type="search"
        placeholder="Search by name or description…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        aria-label="Search bookmarklets"
        className="mb-6 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((b) => (
          <BookmarkletCard key={b.id} bookmarklet={b} bookmarkletUrl={getBookmarkletUrl(manifest, b.id)} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground mt-4">
          No bookmarklets match your search.
        </p>
      )}
    </section>
  );
}
