# Bookmarklet: Forced Colors

## What it checks

Whether the page supports Windows High Contrast Mode via `forced-colors` and `prefers-contrast` media queries. Detects elements with custom background-color, border-color, and box-shadow that would be overridden in High Contrast Mode. Checks for `forced-color-adjust: none` usage and live forced-colors mode detection.

**WCAG:** 1.4.11 (Non-text Contrast), 1.4.3 (Contrast Minimum)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/forced-colors/dist/forced-colors.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['forced-colors']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['forced-colors'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "forced-colors",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": ".custom-button",
      "html": "<button class='custom-button'>...</button>",
      "wcag": "1.4.11",
      "suggestion": "How to fix it",
      "data": { "properties": ["background-color", "border-color"] }
    }
  ],
  "summary": { "total": 12, "errors": 0, "warnings": 4, "passes": 2, "info": 6 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No @media (forced-colors: active) rules found" | Add `@media (forced-colors: active) { … }` rules using CSS system colors (Canvas, CanvasText, LinkText, etc.) |
| "Element uses custom background-color and border-color" | Add transparent borders or use CSS system colors inside forced-colors media query |
| "No @media (prefers-contrast) rules found" | Add `@media (prefers-contrast: more) { … }` for users who prefer higher contrast |
| "Element uses forced-color-adjust: none" | Verify it maintains sufficient contrast since it keeps custom colors in forced-colors mode |
| "Forced colors mode is currently ACTIVE" | The audit is running in High Contrast Mode — results reflect the active state |
