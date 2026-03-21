import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const FORCED_COLORS_CATALOG: BookmarkletCatalogEntry = {
  id: "forced-colors",
  name: "Forced Colors",
  description:
    "Audit forced-colors and prefers-contrast support: Windows High Contrast Mode compatibility.",
  wcag: ["1.4.11", "1.4.3"],
  details:
    "Parses stylesheets for @media (forced-colors: active) and @media (prefers-contrast: more/less/custom) rules. Detects if forced-colors mode is currently active via matchMedia. Identifies elements with custom background-color, border-color, and box-shadow that would be overridden in High Contrast Mode. Checks for forced-color-adjust: none usage.",
  checks: [
    "Presence of @media (forced-colors: active) rules",
    "Presence of @media (prefers-contrast) rules",
    "Whether forced-colors mode is currently active",
    "Elements with custom colors that get overridden in forced-colors",
    "Elements using forced-color-adjust: none",
    "Use of CSS system colors (Canvas, CanvasText, LinkText, etc.)",
  ],
  dataReturned:
    "Object with `{ hasForcedColorsQuery, hasPrefersContrastQuery, isForcedColorsActive, affectedElements[], forcedColorAdjustElements, inaccessibleSheets }` — each affected element includes selector, affected properties, and forced-color-adjust status.",
  tags: ["color", "contrast", "preference", "high contrast"],
};
