# Text Spacing

Test if content is resilient to WCAG 1.4.12 text spacing adjustments.

## WCAG Criteria

- 1.4.12

## What It Checks

- Content clipped when text spacing is increased
- Containers with overflow:hidden that lose text after spacing changes
- Fixed line-height values below 1.5× font size
- Pre-existing overflow issues in clipping containers

## Details

Temporarily applies WCAG 1.4.12 text spacing values (line-height 1.5×, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2em) and detects containers that clip or lose content due to overflow:hidden with fixed heights.

## Data Returned

Array of `{ selector, tagName, overflowsBefore, overflowsAfter, clipsContent, text }` per container, plus issues with severity and WCAG references.

## Tags

text, spacing, reflow

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/text-spacing.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of text-spacing.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "text-spacing",
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
