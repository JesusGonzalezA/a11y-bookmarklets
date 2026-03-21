# Bookmarklet: Language

## What it checks

HTML `lang` attribute on `<html>` and elements with `lang` overrides. Validates BCP 47 language codes.

**WCAG:** 3.1.1 (Language of Page), 3.1.2 (Language of Parts)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/language/dist/language.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.language?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.language.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "language",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "html",
      "html": "<html lang=\"...\">",
      "wcag": "3.1.1",
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
| "Missing lang on <html>" | Add `lang="en"` (or correct code) to the `<html>` element |
| "Invalid BCP 47 tag" | Use a valid language code like "en", "es", "fr-CA" |
| "Empty lang attribute" | Provide a non-empty language code |
| "Element with lang override" | Verify the language code is correct for the content |
