# New Window Links

Audit links with target=_blank: new window/tab warning, aria-label, sr-only text, and rel=noopener security.

## WCAG Criteria

- 3.2.5

## What It Checks

- Links opening new window without user warning
- Warning method (aria-label, title, sr-only, visible text)
- Missing rel="noopener" security attribute

## Details

Finds all links with target=_blank or target=_new. Checks whether the user is warned about new window via aria-label, title, sr-only text, or visible text. Also checks for rel=noopener noreferrer as a security best practice.

## Data Returned

Array of `{ selector, text, href, hasWarning, hasNoopener, warningSource }`.

## Tags

navigation, links, new-window

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/new-window-links.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of new-window-links.min.js>" })
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
  "bookmarklet": "new-window-links",
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
