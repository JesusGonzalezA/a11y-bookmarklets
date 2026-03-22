import type { ManifestEntry } from "./use-manifest";

export function getBookmarkletUrl(manifest: ManifestEntry[] | null, id: string): string | undefined {
  return manifest?.find((b) => b.id === id)?.bookmarkletUrl;
}
