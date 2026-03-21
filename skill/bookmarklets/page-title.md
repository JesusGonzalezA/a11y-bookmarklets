# Bookmarklet: Page Title

## What it checks

Document title presence, descriptiveness, uniqueness relative to H1, and length.

**WCAG:** 2.4.2 (Page Titled)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/page-title/dist/page-title.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["page-title"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["page-title"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "page-title",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "wcag": "2.4.2",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 4, "errors": 0, "warnings": 1, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No <title> element found" | Add a `<title>` with a descriptive page title |
| "Generic title detected" | Replace with a unique, descriptive title |
| "Title too similar to h1" | Differentiate: title should include site name + page topic |
| "Title exceeds 70 characters" | Shorten to ~60-70 chars for SEO and screen readers |
