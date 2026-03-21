import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const META_TAGS_CATALOG: BookmarkletCatalogEntry = {
  id: "meta-tags",
  name: "Meta Tags",
  description:
    "Audit meta tags for accessibility: charset, description, color-scheme, theme-color, and http-equiv refresh.",
  wcag: ["2.2.1", "3.2.5"],
  details:
    "Inspects all meta tags in the document head. Verifies charset is UTF-8, checks for meta refresh (WCAG 2.2.1 violation), detects color-scheme and theme-color declarations, and reports meta description presence.",
  tags: ["meta", "configuration", "timing"],
  checks: [
    "Charset not UTF-8 or missing",
    "meta http-equiv=refresh with redirect/reload (violation 2.2.1)",
    "Missing color-scheme meta tag",
    "Missing meta description",
  ],
  dataReturned:
    "Object with `{ charset, description, colorScheme, themeColor, httpRefresh, allMetaTags: [{ name, content, selector }] }`.",
};
