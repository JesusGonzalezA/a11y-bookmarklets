# Bookmarklet: Color Contrast

## What it checks

Text contrast ratios against WCAG AA (4.5:1 / 3:1 large) and AAA (7:1 / 4.5:1 large) thresholds.

**WCAG:** 1.4.3 (Contrast Minimum), 1.4.6 (Contrast Enhanced)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/color-contrast/dist/color-contrast.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["color-contrast"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["color-contrast"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "color-contrast",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "p.subtitle",
      "wcag": "1.4.3",
      "suggestion": "How to fix it",
      "data": { "ratio": 3.2, "required": 4.5 }
    }
  ],
  "summary": { "total": 50, "errors": 5, "warnings": 10, "passes": 34, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Contrast ratio fails AA" | Darken text or lighten background to reach 4.5:1 (normal) or 3:1 (large) |
| "Passes AA but fails AAA" | Increase contrast to 7:1 (normal) or 4.5:1 (large) for enhanced compliance |
| "Light gray text on white background" | Use a darker gray (#555 or darker) for sufficient contrast |
