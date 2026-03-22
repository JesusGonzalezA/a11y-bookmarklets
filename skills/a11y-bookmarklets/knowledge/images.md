# Images

Audit image alt text: missing alt, decorative images, suspicious alt text patterns.

## WCAG Criteria

- 1.1.1

## What It Checks

- Missing alt attribute entirely
- Decorative images (alt="" or aria-hidden="true")
- Suspicious alt text patterns (e.g. "image", "photo", "DSC_")
- Very long alt text (> 150 characters)

## Details

Checks every image on the page for proper alternative text. Visual indicators show the status of each image: red for missing alt, gray for decorative, green for valid alt text. Alt text is shown directly on the overlay.

## Data Returned

Array of `{ selector, alt, isDecorative, hasFigcaption, src, role }` for every image.

## Tags

images, alt text, semantic

## Result Shape

```json
{
  "bookmarklet": "images",
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
