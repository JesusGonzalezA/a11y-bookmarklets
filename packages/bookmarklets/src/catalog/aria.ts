import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const ARIA_CATALOG: BookmarkletCatalogEntry = {
  id: "aria",
  name: "ARIA Validation",
  description:
    "Validate WAI-ARIA roles, required properties, broken ID references, and aria-hidden misuse.",
  wcag: ["4.1.2", "1.3.1"],
  details:
    "Inspects every element with a role attribute to verify it is a valid WAI-ARIA 1.2 role, checks for redundant implicit roles, validates required ARIA properties, detects aria-hidden='true' containers with focusable descendants, and verifies that all ARIA ID references (aria-labelledby, aria-describedby, etc.) point to existing elements.",
  checks: [
    "Invalid ARIA roles",
    "Redundant roles matching implicit semantics",
    "Missing required ARIA properties (e.g. aria-checked on role=checkbox)",
    "aria-hidden='true' containing focusable elements",
    "Broken ARIA ID references (aria-labelledby, aria-describedby, aria-controls, etc.)",
  ],
  dataReturned:
    "Array of `{ selector, tagName, role, issueType, detail }` for each finding, plus issues with severity, WCAG references, and suggestions.",
  tags: ["aria", "semantic", "validation"],
};
