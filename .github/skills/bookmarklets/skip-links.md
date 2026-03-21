# Bookmarklet: Skip Links

## What it checks

Skip navigation links: presence, target element validity, visibility, and position as first focusable element.

**WCAG:** 2.4.1 (Bypass Blocks)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/skip-links/dist/skip-links.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["skip-links"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["skip-links"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "skip-links",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "a.skip-link",
      "wcag": "2.4.1",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 3, "errors": 0, "warnings": 1, "passes": 1, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No skip link found" | Add a skip link as the first focusable element targeting `#main-content` |
| "Skip link target does not exist" | Add `id` to the target element |
| "Skip link is not first focusable" | Move skip link before all other interactive elements |
| "Skip link never becomes visible" | Ensure skip link appears on focus (`:focus` styles) |
