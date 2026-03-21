import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const INVERTED_COLORS_CATALOG: BookmarkletCatalogEntry = {
  id: "inverted-colors",
  name: "Inverted Colors",
  description:
    "Audit inverted-colors media query support: images, videos, and backgrounds that break when colors are inverted.",
  wcag: ["1.4.1", "1.4.3"],
  details:
    "Parses stylesheets for @media (inverted-colors: inverted) rules. Identifies elements vulnerable to color inversion — images, videos, canvases, SVGs, and elements with background-image. Checks whether compensatory filter: invert(1) is applied to preserve their original appearance.",
  checks: [
    "Presence of @media (inverted-colors: inverted) rules",
    "Images (img, picture) without inversion compensation",
    "Videos and canvases without compensation",
    "SVGs with inline colors vulnerable to inversion",
    "Elements with background-image that may break",
  ],
  dataReturned:
    "Object with `{ hasMediaQuery, mediaRuleCount, vulnerableElements[], inaccessibleSheets }` — each element includes selector, type, and whether compensation exists.",
  tags: ["color", "images", "preference"],
};
