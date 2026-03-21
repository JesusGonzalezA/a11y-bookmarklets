# Headings

Audit heading structure (h1-h6): hierarchy, skipped levels, empty headings, multiple h1s.

## WCAG Criteria

- 1.3.1
- 2.4.6

## What It Checks

- Empty headings (no text content)
- Skipped heading levels (e.g. h2 → h4)
- Multiple h1 elements (only one per page recommended)
- No h1 found on the page

## Details

Scans every heading element on the page and verifies the hierarchy is correct. Each heading gets a color-coded label overlay (h1=red, h2=orange, h3=yellow, h4=green, h5=blue, h6=purple) so you immediately spot structural issues.

## Data Returned

Array of `{ level, text, selector }` for every heading, plus issues with severity, WCAG references, and suggestions.

## Tags

structure, semantic, navigation

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/headings.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of headings.min.js>" })
   ```

2. Take a screenshot to see the visual overlays:
   ```
   mcp_chrome-devtoo_take_screenshot()
   ```

3. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "headings",
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
