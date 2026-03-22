# Reading Order

Compare DOM reading order vs visual layout order and detect discrepancies caused by CSS reordering.

## WCAG Criteria

- 1.3.2
- 2.4.3

## What It Checks

- DOM order vs visual order correlation (Kendall tau)
- CSS order property overriding natural DOM order
- Absolutely/fixed positioned elements displaced from DOM position
- Positive tabindex values altering focus order
- Flexbox/grid containers with reordered children

## Details

Compares the DOM source order (used by assistive technologies) with the visual layout order (perceived by sighted users). Uses getBoundingClientRect() to determine visual position and compares with document order. Detects discrepancies caused by CSS order property (flexbox/grid), position: absolute/fixed, CSS grid areas, float, and positive tabindex values. Highlights elements where DOM order differs significantly from visual order. Calculates a Kendall tau correlation coefficient as an overall measure of order consistency.

## Data Returned

Array of `{ selector, domIndex, visualIndex, tag, text, cssOrder, position, displaced }` for content elements where DOM and visual order differ, plus a `kendallTau` correlation score.

## Tags

structure, navigation, reading-order

## Result Shape

```json
{
  "bookmarklet": "reading-order",
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
