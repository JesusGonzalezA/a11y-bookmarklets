import type { BookmarkletCatalogEntry } from "../domain/types.js";

export const LANGUAGE_CATALOG: BookmarkletCatalogEntry = {
  id: "language",
  name: "Language",
  description:
    "Audit page language: html lang attribute, BCP 47 validation, and language of parts.",
  wcag: ["3.1.1", "3.1.2"],
  details:
    "Verifies <html lang> exists and is a valid BCP 47 code. Scans all elements with lang attributes to detect multilingual content markup. Reports missing, empty, and invalid language codes.",
  tags: ["meta", "internationalization", "semantic"],
  checks: [
    "Missing lang attribute on <html>",
    "Empty lang attribute",
    "Invalid BCP 47 language code",
    "Elements with lang attribute (language of parts)",
  ],
  dataReturned:
    "Object with `{ htmlLang, isValidBcp47, elementsWithLang: [{ selector, lang, isValid, text }] }`.",
};
