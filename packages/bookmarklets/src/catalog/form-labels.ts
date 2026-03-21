import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const FORM_LABELS_CATALOG: BookmarkletCatalogEntry = {
  id: "form-labels",
  name: "Form Labels",
  description:
    "Audit form controls for accessible names: label, aria-label, aria-labelledby, placeholder-only detection.",
  wcag: ["1.3.1", "3.3.2", "4.1.2"],
  details:
    "Scans all form controls (input, select, textarea, ARIA roles) and resolves their accessible name following the AccName algorithm: aria-labelledby → aria-label → label[for] → wrapping label → title → placeholder. Reports controls without labels and placeholder-only controls.",
  tags: ["forms", "labels", "interactive"],
  checks: [
    "Form control without any accessible name",
    "Placeholder used as the only label",
    "Accessible name source for each control",
  ],
  dataReturned:
    "Array of `{ selector, tagName, type, nameSource, accessibleName, hasPlaceholderOnly }`.",
};
