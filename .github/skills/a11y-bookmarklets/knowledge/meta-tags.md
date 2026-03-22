# Meta Tags

Audit meta tags for accessibility: charset, description, color-scheme, theme-color, and http-equiv refresh.

## WCAG Criteria

- 2.2.1
- 3.2.5

## What It Checks

- Charset not UTF-8 or missing
- meta http-equiv=refresh with redirect/reload (violation 2.2.1)
- Missing color-scheme meta tag
- Missing meta description

## Details

Inspects all meta tags in the document head. Verifies charset is UTF-8, checks for meta refresh (WCAG 2.2.1 violation), detects color-scheme and theme-color declarations, and reports meta description presence.

## Data Returned

Object with `{ charset, description, colorScheme, themeColor, httpRefresh, allMetaTags: [{ name, content, selector }] }`.

## Tags

meta, configuration, timing

## Result Shape

```json
{
  "bookmarklet": "meta-tags",
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
