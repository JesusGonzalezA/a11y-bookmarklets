# Text Spacing

Test if content is resilient to WCAG 1.4.12 text spacing adjustments.

## WCAG Criteria

- 1.4.12

## What It Checks

- Content clipped when text spacing is increased
- Containers with overflow:hidden that lose text after spacing changes
- Fixed line-height values below 1.5× font size
- Pre-existing overflow issues in clipping containers

## Details

Temporarily applies WCAG 1.4.12 text spacing values (line-height 1.5×, letter-spacing 0.12em, word-spacing 0.16em, paragraph spacing 2em) and detects containers that clip or lose content due to overflow:hidden with fixed heights.

## Data Returned

Array of `{ selector, tagName, overflowsBefore, overflowsAfter, clipsContent, text }` per container, plus issues with severity and WCAG references.

## Tags

text, spacing, reflow

## Result Shape

```json
{
  "bookmarklet": "text-spacing",
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
