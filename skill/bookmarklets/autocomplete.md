# Bookmarklet: Autocomplete

## What it checks

Autocomplete attributes on form fields: presence on identity/financial fields, WHATWG token validation.

**WCAG:** 1.3.5 (Identify Input Purpose)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/autocomplete/dist/autocomplete.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.autocomplete?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.autocomplete.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "autocomplete",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "input#email",
      "wcag": "1.3.5",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 5, "errors": 1, "warnings": 2, "passes": 1, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Missing autocomplete on probable email field" | Add `autocomplete="email"` |
| "Invalid autocomplete token" | Use a valid WHATWG token like "name", "email", "tel" |
| "autocomplete='off' on identity field" | Consider using `autocomplete="email"` for a11y |
| "Missing autocomplete on password field" | Add `autocomplete="current-password"` or `"new-password"` |
