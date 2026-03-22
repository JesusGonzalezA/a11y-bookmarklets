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
