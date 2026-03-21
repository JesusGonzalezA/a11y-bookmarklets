# Hidden Content

Reveal hidden content and detect potentially problematic hiding techniques.

## WCAG Criteria

- 1.3.2
- 4.1.2

## What It Checks

- aria-hidden='true' containing focusable elements
- Content hidden via display:none or visibility:hidden
- Hidden attribute usage
- Screen-reader-only patterns (sr-only, clip-rect, offscreen)
- Elements with opacity:0

## Details

Scans the page for all hidden content: aria-hidden, display:none, visibility:hidden, [hidden] attribute, sr-only/clip patterns, offscreen positioning, and opacity:0. Highlights content that may be improperly hidden from assistive technology.

## Data Returned

Array of `{ selector, tagName, method, hasFocusable, text }` for each hidden element, plus issues with severity and suggestions.

## Tags

hidden, aria, visibility

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/hidden-content.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of hidden-content.min.js>" })
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
  "bookmarklet": "hidden-content",
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
