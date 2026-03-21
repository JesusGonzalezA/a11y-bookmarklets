# Bookmarklet: Form Labels

## What it checks

Accessible names for form controls: `<label>`, `aria-label`, `aria-labelledby`, `title`, `placeholder` usage and source.

**WCAG:** 1.3.1 (Info and Relationships), 3.3.2 (Labels or Instructions), 4.1.2 (Name, Role, Value)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/form-labels/dist/form-labels.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["form-labels"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["form-labels"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "form-labels",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "input#email",
      "html": "<input id=\"email\" type=\"email\">",
      "wcag": "3.3.2",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 8, "errors": 2, "warnings": 1, "passes": 4, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No accessible name found" | Add a `<label for="id">` or `aria-label` |
| "Only placeholder as label" | Add a visible `<label>` — placeholder disappears on input |
| "Label via title attribute" | Prefer `<label>` for better visibility and click area |
| "aria-labelledby references missing element" | Fix the referenced ID |
