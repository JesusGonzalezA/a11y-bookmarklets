# Bookmarklet: Form Errors

## What it checks

Error handling patterns in forms: `aria-invalid`, `aria-errormessage`, `aria-describedby`, and alert regions.

**WCAG:** 3.3.1 (Error Identification), 3.3.3 (Error Suggestion)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/form-errors/dist/form-errors.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["form-errors"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["form-errors"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "form-errors",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "input#email",
      "wcag": "3.3.1",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 6, "errors": 2, "warnings": 1, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "aria-invalid without error message" | Add `aria-errormessage` pointing to error text |
| "aria-errormessage references missing ID" | Add the error element or fix the reference |
| "Custom error class without aria-invalid" | Add `aria-invalid="true"` when field has errors |
| "Alert region for form errors" | Verify live region announces errors properly |
