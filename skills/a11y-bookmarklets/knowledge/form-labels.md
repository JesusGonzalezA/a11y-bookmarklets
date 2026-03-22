# Form Labels

Audit form controls for accessible names: label, aria-label, aria-labelledby, placeholder-only detection.

## WCAG Criteria

- 1.3.1
- 3.3.2
- 4.1.2

## What It Checks

- Form control without any accessible name
- Placeholder used as the only label
- Accessible name source for each control

## Details

Scans all form controls (input, select, textarea, ARIA roles) and resolves their accessible name following the AccName algorithm: aria-labelledby → aria-label → label[for] → wrapping label → title → placeholder. Reports controls without labels and placeholder-only controls.

## Data Returned

Array of `{ selector, tagName, type, nameSource, accessibleName, hasPlaceholderOnly }`.

## Tags

forms, labels, interactive

## Result Shape

```json
{
  "bookmarklet": "form-labels",
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
