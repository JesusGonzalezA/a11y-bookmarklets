# Links

Audit links: empty links, generic text, faux links (href=#), new window warnings, anchor without href.

## WCAG Criteria

- 2.4.4
- 2.4.9

## What It Checks

- Links without accessible text
- Generic link text (click here, read more, etc.)
- Faux links (href="#" or javascript:void(0))
- Anchor without href (not keyboard focusable)
- Opens new window without warning

## Details

Scans all <a> and [role=link] elements. Computes accessible name via AccName algorithm. Detects empty links, generic text (click here, read more, etc.), faux links (href=# or javascript:), anchors without href, and target=_blank without new window indication.

## Data Returned

Array of `{ selector, text, href, isGeneric, isEmpty, opensNewWindow, hasNewWindowWarning, isFauxLink }`.

## Tags

navigation, links, interactive

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/links.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of links.min.js>" })
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
  "bookmarklet": "links",
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
