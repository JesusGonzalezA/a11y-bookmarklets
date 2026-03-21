# Bookmarklet: Hidden Content

## What it checks

Hidden content techniques: `aria-hidden`, `display:none`, `visibility:hidden`, `[hidden]`, sr-only patterns, and `opacity:0`.

**WCAG:** 1.3.2 (Meaningful Sequence), 4.1.2 (Name, Role, Value)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/hidden-content/dist/hidden-content.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["hidden-content"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["hidden-content"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "hidden-content",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "div[aria-hidden=true]",
      "wcag": "4.1.2",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 15, "errors": 2, "warnings": 0, "passes": 5, "info": 8 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "aria-hidden hides focusable content" | Remove `aria-hidden` or set `tabindex="-1"` on focusable descendants |
| "Content hidden via display:none" | Verify this content doesn't need to be accessible |
| "Screen-reader-only pattern detected" | Intentional — content is hidden visually but read by AT |
| "opacity:0 hides content" | Verify this is a transition state, not permanent hiding |
