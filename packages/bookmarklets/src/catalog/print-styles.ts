import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const PRINT_STYLES_CATALOG: BookmarkletCatalogEntry = {
  id: "print-styles",
  name: "Print Styles",
  description:
    "Verify print stylesheet presence and detect content loss, hidden navigation, and unrevealed link URLs.",
  wcag: ["1.1.1", "1.3.2"],
  details:
    "Checks whether the page has @media print rules. Analyzes print styles to detect: content that disappears without alternatives, navigation that is not hidden for print, link URLs that are not revealed in print, background images carrying information that would be lost, and tables that may overflow. Compares content visibility before and after applying print media emulation.",
  checks: [
    "Presence of @media print rules",
    "Content hidden only in print without text alternative",
    "Navigation visibility in print mode",
    "Link URLs revealed in print via CSS content",
    "Background images lost in print",
    "Elements with overflow:hidden that may clip printed content",
    "Cross-origin stylesheets that could not be inspected",
  ],
  dataReturned:
    "Array of `{ selector, type, detail }` for elements affected by print styles, plus print rule statistics.",
  tags: ["print", "css", "media-query"],
};
