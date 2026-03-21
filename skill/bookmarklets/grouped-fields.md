# Bookmarklet: Grouped Fields

## What it checks

Grouping of related form controls: `<fieldset>`/`<legend>`, radio button groups, and checkbox groups.

**WCAG:** 1.3.1 (Info and Relationships), 3.3.2 (Labels or Instructions)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/grouped-fields/dist/grouped-fields.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.["grouped-fields"]?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y["grouped-fields"].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "grouped-fields",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "fieldset:nth-of-type(1)",
      "wcag": "1.3.1",
      "suggestion": "How to fix it",
      "data": {}
    }
  ],
  "summary": { "total": 5, "errors": 1, "warnings": 1, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Radio group without fieldset/legend" | Wrap related radios in `<fieldset>` with `<legend>` |
| "Fieldset missing legend" | Add a `<legend>` describing the group |
| "Empty legend" | Add descriptive text to the `<legend>` |
| "Checkbox group not grouped" | Use `<fieldset>`/`<legend>` or `role="group"` with `aria-labelledby` |
