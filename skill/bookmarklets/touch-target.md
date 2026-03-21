# Bookmarklet: Touch Targets

## What it checks

Interactive element sizes against WCAG 2.5.8 minimum (24×24 CSS px) and 2.5.5 enhanced (44×44 CSS px) thresholds.

**WCAG:** 2.5.8 (Target Size Minimum), 2.5.5 (Target Size Enhanced)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/touch-target/dist/touch-target.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["touch-target"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["touch-target"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "touch-target",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "button.icon-btn",
      "wcag": "2.5.8",
      "suggestion": "How to fix it",
      "data": { "width": 16, "height": 16, "required": 24 }
    }
  ],
  "summary": { "total": 20, "errors": 5, "warnings": 8, "passes": 6, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Touch target too small (below 24×24)" | Add padding or `min-width`/`min-height` to reach 24×24px minimum |
| "Passes AA but fails AAA (below 44×44)" | Increase clickable area to at least 44×44px for enhanced compliance |
| "Icon button with tiny target" | Add padding around the icon to increase hit area |
