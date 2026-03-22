# Touch Targets

Check interactive element sizes against WCAG touch target minimums.

## WCAG Criteria

- 2.5.8
- 2.5.5

## What It Checks

- Touch target below 24×24 CSS px (WCAG 2.5.8 AA failure)
- Touch target below 44×44 CSS px (WCAG 2.5.5 AAA)
- Zero-dimension interactive elements (likely hidden)

## Details

Measures the bounding box of every interactive element (links, buttons, inputs, custom controls) and compares against WCAG 2.5.8 minimum (24×24 CSS px) and 2.5.5 enhanced (44×44 CSS px) thresholds. Small targets are flagged and highlighted.

## Data Returned

Array of `{ selector, tagName, width, height, label, passesAA, passesAAA }` per interactive element, plus issues with severity and suggestions.

## Tags

touch, target-size, mobile

## Result Shape

```json
{
  "bookmarklet": "touch-target",
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
