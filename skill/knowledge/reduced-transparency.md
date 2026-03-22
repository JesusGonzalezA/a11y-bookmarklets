# Reduced Transparency

Audit prefers-reduced-transparency support: semi-transparent elements and opaque fallbacks.

## WCAG Criteria

- 1.4.11

## What It Checks

- Presence of @media (prefers-reduced-transparency: reduce) rules
- Elements with opacity less than 1
- Background colors with alpha transparency (rgba, hsla)
- backdrop-filter usage (blur, saturate, etc.)
- Availability of opaque fallbacks

## Details

Parses stylesheets for @media (prefers-reduced-transparency: reduce) rules. Scans all elements for semi-transparent properties: opacity < 1, rgba/hsla backgrounds with alpha < 1, and backdrop-filter usage. Reports whether opaque fallbacks exist for users who prefer reduced transparency.

## Data Returned

Object with `{ hasMediaQuery, mediaRuleCount, transparentElements[], inaccessibleSheets }` — each element includes selector, property, and value.

## Tags

visual, transparency, preference

## How to Execute

1. Inject the bookmarklet — pass the entire content of `reduced-transparency.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of reduced-transparency.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.reduced-transparency.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "reduced-transparency",
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
