# Bookmarklet: New Window Links

## What it checks

Links that open in new windows/tabs: `target="_blank"` presence, user warnings, and `rel="noopener"`.

**WCAG:** 3.2.5 (Change on Request)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/new-window-links/dist/new-window-links.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["new-window-links"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["new-window-links"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "new-window-links",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "a[target=_blank]:nth-of-type(1)",
      "wcag": "3.2.5",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 8, "errors": 0, "warnings": 5, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Opens new window without warning" | Add "(opens in new tab)" text or an icon with `aria-label` |
| "Missing rel=noopener" | Add `rel="noopener"` for security |
| "target=_blank on same-site link" | Consider removing `target="_blank"` for same-site navigation |
