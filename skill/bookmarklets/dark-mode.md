# Bookmarklet: Dark Mode

## What it checks

Whether the page supports `prefers-color-scheme` via CSS media queries. Parses all stylesheets for `@media (prefers-color-scheme: dark)` and `@media (prefers-color-scheme: light)` rules. Also checks for `<meta name="color-scheme">` and the CSS `color-scheme` property on `:root`.

**WCAG:** 1.4.3 (Contrast Minimum), 1.4.6 (Contrast Enhanced), 1.4.11 (Non-text Contrast)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/dark-mode/dist/dark-mode.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['dark-mode']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['dark-mode'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "dark-mode",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "html",
      "html": "",
      "wcag": "1.4.3",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 5, "errors": 0, "warnings": 1, "passes": 2, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No @media (prefers-color-scheme: dark) rules found" | Add `@media (prefers-color-scheme: dark) { … }` rules to adapt colors |
| "Dark mode rules exist but no color-scheme declaration" | Add `<meta name="color-scheme" content="light dark">` or `color-scheme: light dark` on `:root` |
| "No color-scheme declaration found" | Add `<meta name="color-scheme" content="light dark">` if you support dark mode |
| "Cross-origin stylesheets could not be inspected" | These may contain dark mode rules but cannot be checked due to CORS |
