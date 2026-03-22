# Grouped Fields

Audit grouped form controls: radio groups in fieldset/radiogroup, checkbox groups, fieldsets with legends.

## WCAG Criteria

- 1.3.1
- 4.1.2

## What It Checks

- Radio groups not inside fieldset or role=radiogroup
- Fieldset without legend
- Checkbox groups without grouping
- Groups without accessible name

## Details

Finds radio buttons grouped by name and verifies they are inside <fieldset> with <legend> or role=radiogroup with accessible name. Checks checkbox groups similarly. Reports fieldsets without legends.

## Data Returned

Array of `{ selector, groupType, legend, controls, name }`.

## Tags

forms, grouping, semantic

## How to Execute

1. Inject the bookmarklet — pass the entire content of `skill/scripts/grouped-fields.min.js` to `evaluate_script` (do NOT analyze the script code):
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "<content of grouped-fields.min.js>" })
   ```


2. Retrieve and analyze the JSON result:
   ```
   mcp_chrome-devtoo_evaluate_script({ expression: "JSON.stringify(window.__a11y)" })
   ```

## Result Shape

```json
{
  "bookmarklet": "grouped-fields",
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
