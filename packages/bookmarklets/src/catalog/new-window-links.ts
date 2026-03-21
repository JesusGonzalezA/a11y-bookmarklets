import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const NEW_WINDOW_LINKS_CATALOG: BookmarkletCatalogEntry = {
  id: "new-window-links",
  name: "New Window Links",
  description:
    "Audit links with target=_blank: new window/tab warning, aria-label, sr-only text, and rel=noopener security.",
  wcag: ["3.2.5"],
  details:
    "Finds all links with target=_blank or target=_new. Checks whether the user is warned about new window via aria-label, title, sr-only text, or visible text. Also checks for rel=noopener noreferrer as a security best practice.",
  tags: ["navigation", "links", "new-window"],
  checks: [
    "Links opening new window without user warning",
    "Warning method (aria-label, title, sr-only, visible text)",
    'Missing rel="noopener" security attribute',
  ],
  dataReturned: "Array of `{ selector, text, href, hasWarning, hasNoopener, warningSource }`.",
};
