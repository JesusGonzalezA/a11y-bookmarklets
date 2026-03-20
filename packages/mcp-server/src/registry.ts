/**
 * Bookmarklet registry — re-exports the catalog as the single source of truth.
 */

import { BOOKMARKLET_CATALOG, type BookmarkletMeta } from "bookmarklets-a11y";

export type BookmarkletEntry = BookmarkletMeta;

export const BOOKMARKLET_REGISTRY: BookmarkletEntry[] = BOOKMARKLET_CATALOG;
