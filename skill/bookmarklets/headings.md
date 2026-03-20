# Bookmarklet: Headings

## What it checks

Heading hierarchy across the full document: h1–h6 levels, skipped levels, empty headings, and multiple h1 elements.

**WCAG:** 1.3.1 (Info and Relationships), 2.4.6 (Headings and Labels)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/headings/dist/headings.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.headings?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.headings.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "headings",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "h2:nth-of-type(1)",
      "html": "<h2>...</h2>",
      "wcag": "1.3.1",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 10, "errors": 2, "warnings": 3, "passes": 4, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Heading level skipped: h2 → h4" | Add the missing h3 in between |
| "Empty heading" | Add visible text or remove the element |
| "Multiple h1 elements" | Keep one h1 as the main page title |
| "No h1 found" | Add an h1 heading to the page |
