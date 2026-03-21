# Bookmarklet: Reduced Transparency

## What it checks

Whether the page supports `prefers-reduced-transparency` by providing opaque fallbacks for semi-transparent elements. Scans for elements with `opacity < 1`, `rgba`/`hsla` backgrounds with alpha transparency, and `backdrop-filter` usage.

**WCAG:** 1.4.11 (Non-text Contrast)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/reduced-transparency/dist/reduced-transparency.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['reduced-transparency']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['reduced-transparency'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "reduced-transparency",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": ".overlay",
      "html": "<div class='overlay'>...</div>",
      "wcag": "1.4.11",
      "suggestion": "How to fix it",
      "data": { "property": "opacity", "value": "0.7" }
    }
  ],
  "summary": { "total": 6, "errors": 0, "warnings": 3, "passes": 1, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Semi-transparent elements found but no prefers-reduced-transparency fallback" | Add `@media (prefers-reduced-transparency: reduce) { … }` with opaque alternatives |
| "Element has opacity: 0.7" | Provide `opacity: 1` fallback in `prefers-reduced-transparency` query |
| "Element has backdrop-filter" | Replace with solid background color in reduced-transparency query |
| "Background color with alpha transparency" | Use opaque `rgb()` instead of `rgba()` in the fallback |
