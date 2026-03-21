import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const REDUCED_TRANSPARENCY_CATALOG: BookmarkletCatalogEntry = {
  id: "reduced-transparency",
  name: "Reduced Transparency",
  description:
    "Audit prefers-reduced-transparency support: semi-transparent elements and opaque fallbacks.",
  wcag: ["1.4.11"],
  details:
    "Parses stylesheets for @media (prefers-reduced-transparency: reduce) rules. Scans all elements for semi-transparent properties: opacity < 1, rgba/hsla backgrounds with alpha < 1, and backdrop-filter usage. Reports whether opaque fallbacks exist for users who prefer reduced transparency.",
  checks: [
    "Presence of @media (prefers-reduced-transparency: reduce) rules",
    "Elements with opacity less than 1",
    "Background colors with alpha transparency (rgba, hsla)",
    "backdrop-filter usage (blur, saturate, etc.)",
    "Availability of opaque fallbacks",
  ],
  dataReturned:
    "Object with `{ hasMediaQuery, mediaRuleCount, transparentElements[], inaccessibleSheets }` — each element includes selector, property, and value.",
  tags: ["visual", "transparency", "preference"],
};
