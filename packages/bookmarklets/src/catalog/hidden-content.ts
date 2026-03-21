import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const HIDDEN_CONTENT_CATALOG: BookmarkletCatalogEntry = {
  id: "hidden-content",
  name: "Hidden Content",
  description: "Reveal hidden content and detect potentially problematic hiding techniques.",
  wcag: ["1.3.2", "4.1.2"],
  details:
    "Scans the page for all hidden content: aria-hidden, display:none, visibility:hidden, [hidden] attribute, sr-only/clip patterns, offscreen positioning, and opacity:0. Highlights content that may be improperly hidden from assistive technology.",
  checks: [
    "aria-hidden='true' containing focusable elements",
    "Content hidden via display:none or visibility:hidden",
    "Hidden attribute usage",
    "Screen-reader-only patterns (sr-only, clip-rect, offscreen)",
    "Elements with opacity:0",
  ],
  dataReturned:
    "Array of `{ selector, tagName, method, hasFocusable, text }` for each hidden element, plus issues with severity and suggestions.",
  tags: ["hidden", "aria", "visibility"],
};
