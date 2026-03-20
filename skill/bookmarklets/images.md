# Bookmarklet: Images

## What it checks

Alt text presence and quality on all `<img>` elements, SVGs, and elements with `role="img"`. Detects missing alt, decorative images with text alt, and suspicious alt patterns (filename as alt, very long alt, etc.).

**WCAG:** 1.1.1 (Non-text Content)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/images/dist/images.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.images?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y.images.audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "images",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "img.hero-banner",
      "html": "<img src='banner.jpg'>",
      "wcag": "1.1.1",
      "suggestion": "How to fix it",
      "data": { "alt": null, "src": "banner.jpg" }
    }
  ],
  "summary": { "total": 12, "errors": 3, "warnings": 2, "passes": 6, "info": 1 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "No alt attribute" | Add `alt="meaningful description"` or `alt=""` if decorative |
| "Suspicious alt text (filename)" | Replace with a real description of the image content |
| "Very long alt text" | Shorten; move detailed description to visible caption or `aria-describedby` |
| "Decorative image with non-empty alt" | Set `alt=""` and optionally `role="presentation"` |
