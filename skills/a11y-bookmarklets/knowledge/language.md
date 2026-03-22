# Language

Audit page language: html lang attribute, BCP 47 validation, and language of parts.

## WCAG Criteria

- 3.1.1
- 3.1.2

## What It Checks

- Missing lang attribute on <html>
- Empty lang attribute
- Invalid BCP 47 language code
- Elements with lang attribute (language of parts)

## Details

Verifies <html lang> exists and is a valid BCP 47 code. Scans all elements with lang attributes to detect multilingual content markup. Reports missing, empty, and invalid language codes.

## Data Returned

Object with `{ htmlLang, isValidBcp47, elementsWithLang: [{ selector, lang, isValid, text }] }`.

## Tags

meta, internationalization, semantic

## Result Shape

```json
{
  "bookmarklet": "language",
  "url": "...",
  "timestamp": "ISO 8601",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Description",
      "selector": "CSS selector",
      "html": "Truncated outerHTML",
      "wcag": "criterion",
      "suggestion": "Fix",
      "data": {}
    }
  ],
  "summary": { "total": 0, "errors": 0, "warnings": 0, "passes": 0, "info": 0 }
}
```
