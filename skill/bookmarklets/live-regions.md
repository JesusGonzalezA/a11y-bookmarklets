# Bookmarklet: Live Regions

## What it checks

ARIA live regions, implicit live roles (alert, status, log), `aria-relevant`, `aria-atomic`, and `<output>` elements.

**WCAG:** 4.1.3 (Status Messages)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/live-regions/dist/live-regions.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["live-regions"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["live-regions"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "live-regions",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "div[aria-live=polite]",
      "wcag": "4.1.3",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 5, "errors": 0, "warnings": 2, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Invalid aria-live value" | Use one of: off, polite, assertive |
| "assertive live region" | Prefer `aria-live="polite"` unless the message is time-critical |
| "Conflicting explicit and implicit live values" | Remove `aria-live` — the role already implies the correct value |
| "Invalid aria-relevant token" | Use valid tokens: additions, removals, text, all |
