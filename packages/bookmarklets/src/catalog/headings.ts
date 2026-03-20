import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const HEADINGS_CATALOG: BookmarkletCatalogEntry = {
  id: "headings",
  name: "Headings",
  description:
    "Audit heading structure (h1-h6): hierarchy, skipped levels, empty headings, multiple h1s.",
  wcag: ["1.3.1", "2.4.6"],
  details:
    "Scans every heading element on the page and verifies the hierarchy is correct. Each heading gets a color-coded label overlay (h1=red, h2=orange, h3=yellow, h4=green, h5=blue, h6=purple) so you immediately spot structural issues.",
  checks: [
    "Empty headings (no text content)",
    "Skipped heading levels (e.g. h2 → h4)",
    "Multiple h1 elements (only one per page recommended)",
    "No h1 found on the page",
  ],
  dataReturned:
    "Array of `{ level, text, selector }` for every heading, plus issues with severity, WCAG references, and suggestions.",
};
