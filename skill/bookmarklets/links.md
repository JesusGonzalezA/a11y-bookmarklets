# Bookmarklet: Links

## What it checks

Accessible names, purpose clarity, and validity of links: empty links, generic text, faux links, new window targets.

**WCAG:** 2.4.4 (Link Purpose in Context), 4.1.2 (Name, Role, Value)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/links/dist/links.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.links?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.links.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "links",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "a:nth-of-type(3)",
      "wcag": "2.4.4",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 20, "errors": 3, "warnings": 5, "passes": 10, "info": 2 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Link has no accessible name" | Add text content or `aria-label` |
| "Generic link text: 'click here'" | Use descriptive text explaining the destination |
| "Anchor without href" | Add `href` or use a `<button>` instead |
| "Non-link element with click handler" | Use `<a href>` or `<button>` for interactive elements |
