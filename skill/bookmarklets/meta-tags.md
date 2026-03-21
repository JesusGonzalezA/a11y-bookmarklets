# Bookmarklet: Meta Tags

## What it checks

Accessibility-relevant meta tags: charset, description, color-scheme, theme-color, viewport, and http-equiv refresh.

**WCAG:** 2.4.2 (Page Titled), 3.2.5 (Change on Request), 1.4.10 (Reflow)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/meta-tags/dist/meta-tags.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["meta-tags"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["meta-tags"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "meta-tags",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "wcag": "3.2.5",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 6, "errors": 1, "warnings": 2, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No charset declaration" | Add `<meta charset="UTF-8">` |
| "meta http-equiv refresh" | Remove auto-redirect; use server-side redirects |
| "No meta description" | Add `<meta name="description" content="...">` |
| "No color-scheme meta" | Add `<meta name="color-scheme" content="light dark">` if theme support exists |
