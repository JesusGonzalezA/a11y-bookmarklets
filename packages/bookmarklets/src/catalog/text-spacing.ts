import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const TEXT_SPACING_CATALOG: BookmarkletCatalogEntry = {
  id: "text-spacing",
  name: "Text Spacing",
  description: "Test if content is resilient to WCAG 1.4.12 text spacing adjustments.",
  wcag: ["1.4.12"],
  details:
    "Temporarily applies WCAG 1.4.12 text spacing values (line-height 1.5×, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2em) and detects containers that clip or lose content due to overflow:hidden with fixed heights.",
  checks: [
    "Content clipped when text spacing is increased",
    "Containers with overflow:hidden that lose text after spacing changes",
    "Fixed line-height values below 1.5× font size",
    "Pre-existing overflow issues in clipping containers",
  ],
  dataReturned:
    "Array of `{ selector, tagName, overflowsBefore, overflowsAfter, clipsContent, text }` per container, plus issues with severity and WCAG references.",
  tags: ["text", "spacing", "reflow"],
};
