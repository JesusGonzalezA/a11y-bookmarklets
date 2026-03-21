import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const LINKS_CATALOG: BookmarkletCatalogEntry = {
  id: "links",
  name: "Links",
  description:
    "Audit links: empty links, generic text, faux links (href=#), new window warnings, anchor without href.",
  wcag: ["2.4.4", "2.4.9"],
  details:
    "Scans all <a> and [role=link] elements. Computes accessible name via AccName algorithm. Detects empty links, generic text (click here, read more, etc.), faux links (href=# or javascript:), anchors without href, and target=_blank without new window indication.",
  tags: ["navigation", "links", "interactive"],
  checks: [
    "Links without accessible text",
    "Generic link text (click here, read more, etc.)",
    'Faux links (href="#" or javascript:void(0))',
    "Anchor without href (not keyboard focusable)",
    "Opens new window without warning",
  ],
  dataReturned:
    "Array of `{ selector, text, href, isGeneric, isEmpty, opensNewWindow, hasNewWindowWarning, isFauxLink }`.",
};
