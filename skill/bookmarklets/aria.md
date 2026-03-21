# Bookmarklet: ARIA Validation

## What it checks

WAI-ARIA role validity, required properties, broken ID references, redundant roles, and `aria-hidden` misuse.

**WCAG:** 4.1.2 (Name, Role, Value), 1.3.1 (Info and Relationships)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/aria/dist/aria.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.aria?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.aria.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "aria",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "div[role=button]",
      "wcag": "4.1.2",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 12, "errors": 3, "warnings": 2, "passes": 5, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Invalid ARIA role" | Use a valid WAI-ARIA 1.2 role |
| "Redundant role on native element" | Remove `role="button"` from `<button>` — it's already implicit |
| "aria-hidden contains focusable elements" | Remove `aria-hidden` or set `tabindex="-1"` on descendants |
| "Broken ARIA ID reference" | Ensure the referenced element exists with the correct `id` |
| "Missing required ARIA property" | Add the required property (e.g., `aria-checked` for `role="checkbox"`) |
