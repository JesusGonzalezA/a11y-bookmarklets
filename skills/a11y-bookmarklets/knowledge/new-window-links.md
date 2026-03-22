# New Window Links

Audit links with target=_blank: new window/tab warning, aria-label, sr-only text, and rel=noopener security.

## WCAG Criteria

- 3.2.5

## What It Checks

- Links opening new window without user warning
- Warning method (aria-label, title, sr-only, visible text)
- Missing rel="noopener" security attribute

## Details

Finds all links with target=_blank or target=_new. Checks whether the user is warned about new window via aria-label, title, sr-only text, or visible text. Also checks for rel=noopener noreferrer as a security best practice.

## Data Returned

Array of `{ selector, text, href, hasWarning, hasNoopener, warningSource }`.

## Tags

navigation, links, new-window

## Result Shape

```json
{
  "bookmarklet": "new-window-links",
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
