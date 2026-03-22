# Forced Colors

Audit forced-colors and prefers-contrast support: Windows High Contrast Mode compatibility.

## WCAG Criteria

- 1.4.11
- 1.4.3

## What It Checks

- Presence of @media (forced-colors: active) rules
- Presence of @media (prefers-contrast) rules
- Whether forced-colors mode is currently active
- Elements with custom colors that get overridden in forced-colors
- Elements using forced-color-adjust: none
- Use of CSS system colors (Canvas, CanvasText, LinkText, etc.)

## Details

Parses stylesheets for @media (forced-colors: active) and @media (prefers-contrast: more/less/custom) rules. Detects if forced-colors mode is currently active via matchMedia. Identifies elements with custom background-color, border-color, and box-shadow that would be overridden in High Contrast Mode. Checks for forced-color-adjust: none usage.

## Data Returned

Object with `{ hasForcedColorsQuery, hasPrefersContrastQuery, isForcedColorsActive, affectedElements[], forcedColorAdjustElements, inaccessibleSheets }` — each affected element includes selector, affected properties, and forced-color-adjust status.

## Tags

color, contrast, preference, high contrast

## How to Execute

1. Inject the bookmarklet — pass the entire content of `forced-colors.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of forced-colors.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.forced-colors.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "forced-colors",
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
