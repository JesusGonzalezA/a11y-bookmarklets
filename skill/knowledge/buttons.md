# Buttons

Audit buttons: accessible names, faux buttons (onclick without role), label-in-name violations (2.5.3).

## WCAG Criteria

- 4.1.2
- 2.5.3
- 2.1.1

## What It Checks

- Buttons without accessible name (icon buttons without aria-label)
- Faux buttons (div/span with onclick, no role=button or keyboard)
- Label-in-name violation (aria-label doesn't include visible text)

## Details

Scans all button, [role=button], and input[type=button/submit/reset] elements. Computes accessible name via AccName algorithm. Detects faux buttons (elements with onclick but no role/keyboard support). Checks label-in-name (2.5.3) — aria-label must contain the visible text.

## Data Returned

Array of `{ selector, tagName, role, accessibleName, visibleText, isEmpty, isFauxButton, labelInNameViolation, isDisabled }`.

## Tags

interactive, buttons, keyboard

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/buttons.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of buttons.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "buttons",
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
