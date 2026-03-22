# ARIA Validation

Validate WAI-ARIA roles, required properties, broken ID references, and aria-hidden misuse.

## WCAG Criteria

- 4.1.2
- 1.3.1

## What It Checks

- Invalid ARIA roles
- Redundant roles matching implicit semantics
- Missing required ARIA properties (e.g. aria-checked on role=checkbox)
- aria-hidden='true' containing focusable elements
- Broken ARIA ID references (aria-labelledby, aria-describedby, aria-controls, etc.)

## Details

Inspects every element with a role attribute to verify it is a valid WAI-ARIA 1.2 role, checks for redundant implicit roles, validates required ARIA properties, detects aria-hidden='true' containers with focusable descendants, and verifies that all ARIA ID references (aria-labelledby, aria-describedby, etc.) point to existing elements.

## Data Returned

Array of `{ selector, tagName, role, issueType, detail }` for each finding, plus issues with severity, WCAG references, and suggestions.

## Tags

aria, semantic, validation

## How to Execute

1. Inject the bookmarklet — pass the entire content of `aria.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of aria.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.aria.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "aria",
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
