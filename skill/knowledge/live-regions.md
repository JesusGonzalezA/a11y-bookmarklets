# Live Regions

Audit ARIA live regions, implicit live roles, and status message patterns.

## WCAG Criteria

- 4.1.3

## What It Checks

- Invalid aria-live values
- aria-live='assertive' usage (may be disruptive)
- Implicit live regions via role (alert, status, log, etc.)
- Invalid aria-relevant tokens
- Conflicting explicit and implicit live values
- <output> elements (implicit status role)

## Details

Finds all elements with aria-live, implicit live roles (alert, status, log, marquee, timer), and <output> elements. Validates live values, aria-relevant tokens, and flags potentially aggressive assertive regions.

## Data Returned

Array of `{ selector, tagName, liveValue, role, atomic, relevant, hasContent }` for each live region, plus issues with severity and suggestions.

## Tags

aria, live-region, dynamic

## How to Execute

1. Inject the bookmarklet — pass the entire content of `live-regions.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of live-regions.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.live-regions.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "live-regions",
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
