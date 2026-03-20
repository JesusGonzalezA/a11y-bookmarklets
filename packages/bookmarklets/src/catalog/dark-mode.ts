import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const DARK_MODE_CATALOG: BookmarkletCatalogEntry = {
  id: "dark-mode",
  name: "Dark Mode",
  description:
    "Audit prefers-color-scheme support: dark/light media queries, color-scheme meta tag and CSS property.",
  wcag: ["1.4.3", "1.4.6", "1.4.11"],
  details:
    'Parses all stylesheets looking for @media (prefers-color-scheme: dark) and @media (prefers-color-scheme: light) rules. Checks for <meta name="color-scheme"> and the CSS color-scheme property on :root. Reports whether the page adapts to the user\'s dark mode preference.',
  checks: [
    "Presence of @media (prefers-color-scheme: dark) rules",
    "Presence of @media (prefers-color-scheme: light) rules",
    '<meta name="color-scheme"> tag for browser UI adaptation',
    "CSS color-scheme property on :root for form controls and scrollbars",
    "Cross-origin stylesheets that cannot be inspected",
  ],
  dataReturned:
    "Object with `{ darkRules, lightRules, hasColorSchemeMeta, hasColorSchemeCSS, inaccessibleSheets }` plus issues with severity, WCAG references, and suggestions.",
};
