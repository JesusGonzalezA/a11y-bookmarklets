import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const LIVE_REGIONS_CATALOG: BookmarkletCatalogEntry = {
  id: "live-regions",
  name: "Live Regions",
  description: "Audit ARIA live regions, implicit live roles, and status message patterns.",
  wcag: ["4.1.3"],
  details:
    "Finds all elements with aria-live, implicit live roles (alert, status, log, marquee, timer), and <output> elements. Validates live values, aria-relevant tokens, and flags potentially aggressive assertive regions.",
  checks: [
    "Invalid aria-live values",
    "aria-live='assertive' usage (may be disruptive)",
    "Implicit live regions via role (alert, status, log, etc.)",
    "Invalid aria-relevant tokens",
    "Conflicting explicit and implicit live values",
    "<output> elements (implicit status role)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, liveValue, role, atomic, relevant, hasContent }` for each live region, plus issues with severity and suggestions.",
  tags: ["aria", "live-region", "dynamic"],
};
