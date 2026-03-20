/**
 * Bookmarklet registry — derives metadata from the bookmarklet classes.
 */

import {
  HeadingsBookmarklet,
  ImagesBookmarklet,
  LandmarksBookmarklet,
  TabOrderBookmarklet,
  type BookmarkletMeta,
} from "bookmarklets-a11y";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type BookmarkletEntry = BookmarkletMeta;

export const BOOKMARKLET_REGISTRY: BookmarkletEntry[] = [
  new HeadingsBookmarklet().meta,
  new ImagesBookmarklet().meta,
  new LandmarksBookmarklet().meta,
  new TabOrderBookmarklet().meta,
];

export function getBookmarkletSource(distDir: string, id: string): string | null {
  try {
    const path = join(distDir, `${id}.min.js`);
    return readFileSync(path, "utf-8");
  } catch {
    return null;
  }
}
