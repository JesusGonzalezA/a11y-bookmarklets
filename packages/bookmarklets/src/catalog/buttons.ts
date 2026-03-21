import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const BUTTONS_CATALOG: BookmarkletCatalogEntry = {
  id: "buttons",
  name: "Buttons",
  description:
    "Audit buttons: accessible names, faux buttons (onclick without role), label-in-name violations (2.5.3).",
  wcag: ["4.1.2", "2.5.3", "2.1.1"],
  details:
    "Scans all button, [role=button], and input[type=button/submit/reset] elements. Computes accessible name via AccName algorithm. Detects faux buttons (elements with onclick but no role/keyboard support). Checks label-in-name (2.5.3) — aria-label must contain the visible text.",
  tags: ["interactive", "buttons", "keyboard"],
  checks: [
    "Buttons without accessible name (icon buttons without aria-label)",
    "Faux buttons (div/span with onclick, no role=button or keyboard)",
    "Label-in-name violation (aria-label doesn't include visible text)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, role, accessibleName, visibleText, isEmpty, isFauxButton, labelInNameViolation, isDisabled }`.",
};
