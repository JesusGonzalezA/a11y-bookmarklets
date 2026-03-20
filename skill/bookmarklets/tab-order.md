# Bookmarklet: Tab Order

## What it checks

Keyboard tab sequence across all focusable elements: positive `tabindex` values, elements that are focusable but visually hidden, and unusual or broken tab flow.

**WCAG:** 2.4.3 (Focus Order), 2.1.1 (Keyboard)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/tab-order/dist/tab-order.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.tabOrder?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.tabOrder.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "tab-order",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "a.skip-link",
      "html": "<a tabindex='3'>...</a>",
      "wcag": "2.4.3",
      "suggestion": "How to fix it",
      "data": { "tabIndex": 3 }
    }
  ],
  "summary": { "total": 15, "errors": 2, "warnings": 1, "passes": 11, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Positive tabindex" | Remove `tabindex`, rely on natural DOM order |
| "Hidden element in tab order" | Add `tabindex="-1"` or hide properly with `display:none` / `visibility:hidden` |
| "Focusable element with no visible focus ring" | Ensure `:focus-visible` styles are defined |
| "Tab order does not match visual order" | Reorder DOM elements to match visual layout |
