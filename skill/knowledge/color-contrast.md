# Color Contrast

Check text color contrast ratios against WCAG AA and AAA thresholds.

## WCAG Criteria

- 1.4.3
- 1.4.6

## What It Checks

- Contrast ratio below AA minimum (4.5:1 normal, 3:1 large text)
- Contrast ratio below AAA enhanced (7:1 normal, 4.5:1 large text)
- Background color resolution through parent elements
- Large text detection (18pt+ or 14pt+ bold)

## Details

Computes the contrast ratio between foreground text color and the resolved background color for text-bearing elements. Uses the WCAG 2.x relative luminance formula. Distinguishes between normal and large text for appropriate AA/AAA thresholds.

## Data Returned

Array of `{ selector, tagName, text, fontSize, fontWeight, foreground, background, ratio, passesAA, passesAAA, isLargeText }` per element, plus issues with severity and WCAG references.

## Tags

color, contrast, visual

## How to Execute

1. Inject the bookmarklet — pass the entire content of `color-contrast.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of color-contrast.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.color-contrast.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "color-contrast",
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
