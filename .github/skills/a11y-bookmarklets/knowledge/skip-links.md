# Skip Links

Audit skip navigation links: existence, target validity, visibility on focus, and position as first focusable.

## WCAG Criteria

- 2.4.1

## What It Checks

- No skip navigation link found
- Skip link target ID does not exist
- Skip link is not the first focusable element
- Skip link visibility on focus

## Details

Searches for skip navigation links (anchors with text matching skip/saltar/jump patterns pointing to internal IDs). Verifies target exists, checks if the skip link is the first focusable element, and whether it becomes visible on focus.

## Data Returned

Array of `{ selector, text, targetId, targetExists, isVisibleOnFocus, isFirstFocusable }`.

## Tags

navigation, keyboard, bypass

## Result Shape

```json
{
  "bookmarklet": "skip-links",
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
