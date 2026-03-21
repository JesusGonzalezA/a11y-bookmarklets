import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const SKIP_LINKS_CATALOG: BookmarkletCatalogEntry = {
  id: "skip-links",
  name: "Skip Links",
  description:
    "Audit skip navigation links: existence, target validity, visibility on focus, and position as first focusable.",
  wcag: ["2.4.1"],
  details:
    "Searches for skip navigation links (anchors with text matching skip/saltar/jump patterns pointing to internal IDs). Verifies target exists, checks if the skip link is the first focusable element, and whether it becomes visible on focus.",
  tags: ["navigation", "keyboard", "bypass"],
  checks: [
    "No skip navigation link found",
    "Skip link target ID does not exist",
    "Skip link is not the first focusable element",
    "Skip link visibility on focus",
  ],
  dataReturned:
    "Array of `{ selector, text, targetId, targetExists, isVisibleOnFocus, isFirstFocusable }`.",
};
