# Bookmarklet: Landmarks

## What it checks

Semantic landmark regions: `<main>`, `<nav>`, `<header>` (banner), `<footer>` (contentinfo), `<aside>` (complementary), and `<search>`. Detects missing, duplicate, or unlabelled landmarks.

**WCAG:** 1.3.1 (Info and Relationships), 2.4.1 (Bypass Blocks)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/landmarks/dist/landmarks.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.landmarks?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.landmarks.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "landmarks",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "nav:nth-of-type(2)",
      "html": "<nav>...</nav>",
      "wcag": "1.3.1",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 8, "errors": 1, "warnings": 2, "passes": 4, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No main landmark" | Wrap primary content in `<main>` |
| "Multiple nav without labels" | Add `aria-label` to each `<nav>` element |
| "No navigation landmark" | Use `<nav>` for navigation menus |
| "Multiple main landmarks" | Only one `<main>` is allowed per page |
