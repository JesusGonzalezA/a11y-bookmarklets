# Landmarks

Audit semantic landmark regions: main, nav, banner, complementary, contentinfo, search.

## WCAG Criteria

- 1.3.1
- 2.4.1

## What It Checks

- Missing main landmark
- Multiple main landmarks
- Duplicate unnamed landmarks of the same type
- Regions without accessible labels

## Details

Identifies all ARIA landmark regions including native HTML5 elements (main, nav, header, footer, aside, form, section) and custom roles. Color-coded outlines make each region clearly visible.

## Data Returned

Array of `{ role, label, selector, element }` for every landmark found, plus issues flagging missing or duplicate landmarks.

## Tags

structure, semantic, navigation

## Result Shape

```json
{
  "bookmarklet": "landmarks",
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
