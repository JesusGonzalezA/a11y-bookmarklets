import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const AUTOCOMPLETE_CATALOG: BookmarkletCatalogEntry = {
  id: "autocomplete",
  name: "Autocomplete",
  description:
    "Audit autocomplete attributes on form fields for personal data input purpose identification.",
  wcag: ["1.3.5"],
  details:
    "Scans text inputs, selects, and textareas. Uses heuristics (name, id, placeholder, label text, input type) to detect fields that should have autocomplete attributes. Validates existing autocomplete tokens against the WHATWG spec.",
  tags: ["forms", "autocomplete", "input-purpose"],
  checks: [
    "Personal data fields missing autocomplete attribute",
    "Invalid autocomplete token values",
    "Fields with correct autocomplete attributes",
  ],
  dataReturned:
    "Array of `{ selector, tagName, type, autocomplete, expectedAutocomplete, fieldName }`.",
};
