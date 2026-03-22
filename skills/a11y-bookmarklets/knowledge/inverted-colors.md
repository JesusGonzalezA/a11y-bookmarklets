# Inverted Colors

Audit inverted-colors media query support: images, videos, and backgrounds that break when colors are inverted.

## WCAG Criteria

- 1.4.1
- 1.4.3

## What It Checks

- Presence of @media (inverted-colors: inverted) rules
- Images (img, picture) without inversion compensation
- Videos and canvases without compensation
- SVGs with inline colors vulnerable to inversion
- Elements with background-image that may break

## Details

Parses stylesheets for @media (inverted-colors: inverted) rules. Identifies elements vulnerable to color inversion — images, videos, canvases, SVGs, and elements with background-image. Checks whether compensatory filter: invert(1) is applied to preserve their original appearance.

## Data Returned

Object with `{ hasMediaQuery, mediaRuleCount, vulnerableElements[], inaccessibleSheets }` — each element includes selector, type, and whether compensation exists.

## Tags

color, images, preference

## How to Execute

1. Inject the bookmarklet — pass the entire content of `inverted-colors.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of inverted-colors.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.inverted-colors.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "inverted-colors",
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
