import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const PAGE_TITLE_CATALOG: BookmarkletCatalogEntry = {
  id: "page-title",
  name: "Page Title",
  description: "Audit page title: existence, descriptiveness, length, and coherence with h1.",
  wcag: ["2.4.2"],
  details:
    "Verifies <title> exists, is not empty, and is not generic. Checks length (ideal 30-60 chars), compares with <h1> for coherence using Jaccard similarity. Detects generic titles like 'Home', 'Untitled', 'Page'.",
  tags: ["meta", "navigation", "semantic"],
  checks: [
    "Missing or empty page title",
    "Generic title detection (Home, Untitled, Page, etc.)",
    "Title length (too short or too long)",
    "Title vs h1 coherence",
  ],
  dataReturned: "Object with `{ title, isEmpty, isGeneric, length, h1Text, h1TitleMatch }`.",
};
