# Print Styles

Verify print stylesheet presence and detect content loss, hidden navigation, and unrevealed link URLs.

## WCAG Criteria

- 1.1.1
- 1.3.2

## What It Checks

- Presence of @media print rules
- Content hidden only in print without text alternative
- Navigation visibility in print mode
- Link URLs revealed in print via CSS content
- Background images lost in print
- Elements with overflow:hidden that may clip printed content
- Cross-origin stylesheets that could not be inspected

## Details

Checks whether the page has @media print rules. Analyzes print styles to detect: content that disappears without alternatives, navigation that is not hidden for print, link URLs that are not revealed in print, background images carrying information that would be lost, and tables that may overflow. Compares content visibility before and after applying print media emulation.

## Data Returned

Array of `{ selector, type, detail }` for elements affected by print styles, plus print rule statistics.

## Tags

print, css, media-query

## Result Shape

```json
{
  "bookmarklet": "print-styles",
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
