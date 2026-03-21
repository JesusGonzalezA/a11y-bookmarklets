import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const FORM_ERRORS_CATALOG: BookmarkletCatalogEntry = {
  id: "form-errors",
  name: "Form Errors",
  description:
    "Audit form error handling: aria-invalid, aria-errormessage, error descriptions, and live regions.",
  wcag: ["3.3.1", "3.3.3"],
  details:
    "Inspects fields with aria-invalid for associated error messages via aria-errormessage and aria-describedby. Validates that referenced IDs exist and are visible. Detects alert/status live regions for error announcements.",
  tags: ["forms", "errors", "validation"],
  checks: [
    "Invalid fields without error messages",
    "aria-errormessage referencing missing IDs",
    "Alert/status live regions for error announcements",
    "Error message visibility",
  ],
  dataReturned:
    "Array of `{ selector, tagName, isInvalid, hasErrorMessage, errorMessageId, errorMessageText, hasLiveRegion }`.",
};
