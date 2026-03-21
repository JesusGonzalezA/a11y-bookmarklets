# Bookmarklet: Buttons

## What it checks

Accessible names, semantic correctness, and label-in-name compliance of buttons and button-like controls.

**WCAG:** 4.1.2 (Name, Role, Value), 2.5.3 (Label in Name)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/buttons/dist/buttons.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.buttons?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.buttons.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "buttons",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "button:nth-of-type(2)",
      "wcag": "4.1.2",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 10, "errors": 2, "warnings": 1, "passes": 6, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Button has no accessible name" | Add text content, `aria-label`, or `aria-labelledby` |
| "Faux button (div with role=button)" | Use native `<button>` instead |
| "Label in name mismatch" | Ensure `aria-label` contains the visible text |
| "Icon button without label" | Add `aria-label` describing the action |
