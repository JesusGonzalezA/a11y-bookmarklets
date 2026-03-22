# Form Labels

Audit form controls for accessible names: label, aria-label, aria-labelledby, placeholder-only detection.

## WCAG Criteria

- 1.3.1
- 3.3.2
- 4.1.2

## What It Checks

- Form control without any accessible name
- Placeholder used as the only label
- Accessible name source for each control

## Details

Scans all form controls (input, select, textarea, ARIA roles) and resolves their accessible name following the AccName algorithm: aria-labelledby → aria-label → label[for] → wrapping label → title → placeholder. Reports controls without labels and placeholder-only controls.

## Data Returned

Array of `{ selector, tagName, type, nameSource, accessibleName, hasPlaceholderOnly }`.

## Tags

forms, labels, interactive

## How to Execute

1. Inject the bookmarklet — pass the entire content of `form-labels.min.js` to `evaluate_script` (do NOT analyze the script code):
```
mcp_chrome-devtoo_evaluate_script({ expression: "<content of form-labels.min.js>" })
```
2. Retrieve and analyze the result:
   ```
   mcp_chrome-devtoo_evaluate_script({
     expression: "JSON.stringify(window.__a11y.form-labels.lastResult)"
   })
   ```

## Result Shape

```json
{
  "bookmarklet": "form-labels",
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
