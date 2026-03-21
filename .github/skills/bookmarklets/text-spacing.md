# Bookmarklet: Text Spacing

## What it checks

Content resilience to WCAG 1.4.12 text spacing changes: line-height, letter-spacing, word-spacing, paragraph spacing.

**WCAG:** 1.4.12 (Text Spacing)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/text-spacing/dist/text-spacing.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["text-spacing"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["text-spacing"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "text-spacing",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "div.card-text",
      "wcag": "1.4.12",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 8, "errors": 2, "warnings": 3, "passes": 1, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Content clipped when spacing increased" | Remove fixed height + `overflow:hidden`. Use `min-height` instead |
| "Fixed line-height below 1.5×" | Use `line-height: 1.5` or greater relative to font size |
| "Container clips overflow" | Allow content to grow: use `overflow: visible` or `auto` |
