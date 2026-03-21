# Bookmarklet: Video Controls

## What it checks

Whether `<video>` and `<audio>` elements have accessible controls — either the native `controls` attribute or custom player controls with proper ARIA roles, accessible names, and keyboard support.

**WCAG:** 1.2.1 (Audio-only and Video-only), 2.1.1 (Keyboard), 4.1.2 (Name, Role, Value)

## Inject via browser_evaluate

```javascript
(() => {
  const script = document.createElement('script');
  script.src = 'https://unpkg.com/@bookmarklets-a11y/video-controls/dist/video-controls.min.js';
  document.body.appendChild(script);
  return new Promise(resolve => {
    script.onload = () => resolve(window.__a11y?.['video-controls']?.lastResult);
  });
})()
```

Or if already loaded:

```javascript
window.__a11y['video-controls'].audit()
```

## JSON Result Structure

```json
{
  "bookmarklet": "video-controls",
  "url": "https://example.com",
  "timestamp": "2025-01-15T10:30:00Z",
  "issues": [
    {
      "severity": "error|warning|info|pass",
      "message": "Human-readable description",
      "selector": "video.hero-video",
      "html": "<video src='intro.mp4'>",
      "wcag": "2.1.1",
      "suggestion": "How to fix it",
      "data": { "tagName": "video", "src": "intro.mp4" }
    }
  ],
  "summary": { "total": 4, "errors": 1, "warnings": 1, "passes": 2, "info": 0 }
}
```

## Common Findings and Fixes

| Finding | Fix |
|---------|-----|
| "has no controls — neither native nor custom" | Add `controls` attribute or build accessible custom controls with ARIA roles |
| "Custom control has no ARIA role" | Add `role="button"`, `role="slider"`, etc. to custom player controls |
| "Custom control has no accessible name" | Add `aria-label` or visible text to describe the control's purpose |
