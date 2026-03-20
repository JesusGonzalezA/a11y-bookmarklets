# Bookmarklet: Inverted Colors

## What it checks

Whether the page handles `inverted-colors` media query for users who use OS-level color inversion. Identifies media elements (images, videos, canvases, SVGs) and elements with background-image that appear incorrect when colors are inverted, and checks if compensatory `filter: invert(1)` is applied.

**WCAG:** 1.4.1 (Use of Color), 1.4.3 (Contrast Minimum)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/inverted-colors/dist/inverted-colors.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['inverted-colors']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['inverted-colors'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "inverted-colors",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "img.hero",
      "html": "<img class='hero' src='photo.jpg' alt='...'>",
      "wcag": "1.4.1",
      "suggestion": "How to fix it",
      "data": { "type": "image" }
    }
  ],
  "summary": { "total": 10, "errors": 0, "warnings": 6, "passes": 2, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No inverted-colors rules but vulnerable elements exist" | Add `@media (inverted-colors: inverted) { img, video, svg { filter: invert(1); } }` |
| "Image element may appear incorrect when inverted" | Add compensatory `filter: invert(1)` inside `@media (inverted-colors: inverted)` |
| "Element has background-image that may break" | Provide compensation or use CSS variables that adapt to inversion |
| "Element has filter: invert(1) compensation" | Correctly compensated — no action needed |
