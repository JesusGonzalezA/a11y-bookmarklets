# Bookmarklet: Viewport & Zoom

## What it checks

The `<meta name="viewport">` tag and its directives. Detects zoom restrictions (`user-scalable=no`, `maximum-scale < 2`) that prevent users from resizing text to at least 200%. Also checks for responsive width configuration.

**WCAG:** 1.4.4 (Resize Text), 1.4.10 (Reflow)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/viewport-zoom/dist/viewport-zoom.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['viewport-zoom']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['viewport-zoom'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "viewport-zoom",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "meta",
      "html": "<meta name='viewport' content='width=device-width, initial-scale=1, user-scalable=no'>",
      "wcag": "1.4.4",
      "suggestion": "How to fix it"
    }
  ],
  "summary": { "total": 4, "errors": 1, "warnings": 0, "passes": 2, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "Zoom is disabled: user-scalable=no" | Remove `user-scalable=no` or set to `yes` |
| "maximum-scale restricts zoom below 200%" | Set `maximum-scale` to at least 2.0, or remove it |
| "maximum-scale limits zoom" (2–5) | Consider removing `maximum-scale` entirely |
| "minimum-scale equals maximum-scale — zoom is locked" | Use different values or remove both |
| "Fixed viewport width" | Use `width=device-width` for responsive reflow |
| "No viewport meta found" | Browser allows zoom by default — informational |
