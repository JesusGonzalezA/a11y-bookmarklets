# Autocomplete

Audit autocomplete attributes on form fields for personal data input purpose identification.

## WCAG Criteria

- 1.3.5

## What It Checks

- Personal data fields missing autocomplete attribute
- Invalid autocomplete token values
- Fields with correct autocomplete attributes

## Details

Scans text inputs, selects, and textareas. Uses heuristics (name, id, placeholder, label text, input type) to detect fields that should have autocomplete attributes. Validates existing autocomplete tokens against the WHATWG spec.

## Data Returned

Array of `{ selector, tagName, type, autocomplete, expectedAutocomplete, fieldName }`.

## Tags

forms, autocomplete, input-purpose

## Result Shape

```json
{
  "bookmarklet": "autocomplete",
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
