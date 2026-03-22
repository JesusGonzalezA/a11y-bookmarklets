# Viewport & Zoom

Audit viewport meta tag for zoom restrictions: user-scalable, maximum-scale, minimum-scale, and responsive width configuration.

## WCAG Criteria

- 1.4.4
- 1.4.10

## What It Checks

- user-scalable=no or user-scalable=0 (zoom disabled — violation)
- maximum-scale < 2 (below 200% zoom — violation)
- maximum-scale 2–5 (limited zoom — warning)
- minimum-scale = maximum-scale (locked zoom — violation)
- width=device-width for responsive reflow (1.4.10)
- Fixed pixel width that may cause horizontal scroll

## Details

Reads <meta name="viewport"> and analyzes its directives. Detects restrictions: user-scalable=no, maximum-scale < 2 (below 200% required by WCAG), minimum-scale = maximum-scale (locked zoom). Reports each directive and its accessibility impact.

## Data Returned

Object with `{ hasViewportMeta, content, directives: [{ key, value }], userScalable, maximumScale, minimumScale, initialScale, width }`.

## Tags

zoom, mobile, responsive

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/viewport-zoom.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of viewport-zoom.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "viewport-zoom",
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
